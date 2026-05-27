import type {
  GenerateProductContentInput,
  GeneratedProductContent,
} from "@/lib/ai/types";

const PAPER_TYPES = [
  "300 GSM Art Card",
  "350 GSM Ivory",
  "Imported Texture Paper",
  "Metallic Sheet",
] as const;

const PRINT_METHODS = [
  "Offset Printing",
  "Digital Printing",
  "Screen Printing",
  "Foil Stamping",
] as const;

const LAMINATION_TYPES = ["Matte", "Gloss", "Velvet", "Soft-touch", "None"] as const;

const FINISHING_OPTIONS = [
  "Embossing",
  "Spot UV",
  "Gold Foiling",
  "Die Cutting",
] as const;

function inferProductType(title: string, imageUrl?: string | null): string {
  const lower = title.toLowerCase();

  if (lower.includes("box") || lower.includes("packaging")) {
    return "Luxury Packaging";
  }

  if (lower.includes("stationery") || lower.includes("invite")) {
    return "Wedding Stationery";
  }

  if (lower.includes("card")) {
    return "Premium Print Collateral";
  }

  if (imageUrl) {
    return "Bespoke Print & Packaging";
  }

  return "Curated Luxury Product";
}

function buildMockContent(
  input: GenerateProductContentInput,
): GeneratedProductContent {
  const title = input.title?.trim() || "Signature Edition";
  const productType = inferProductType(title, input.imageUrl);
  const subtitle =
    input.subtitle?.trim() ||
    `${productType} · archival materials · studio-finished in Surat`;

  const description = `${title} is conceived as a ${productType.toLowerCase()} piece for discerning brands and private celebrations. ${
    input.imageUrl
      ? "Visual analysis of the primary product image informed the material story—layered textures, controlled contrast, and finish cues that read as quietly opulent under retail and hospitality light."
      : "Compose the listing with a hero image in the Media tab to unlock vision-guided copy and manufacturing suggestions."
  } Each run is calibrated for Indian luxury retail: tactile unboxing, precise registration, and white-glove fulfillment through V Design Luxury.`;

  const seoTitle = `${title} | V Design Luxury`.slice(0, 60);
  const seoDescription =
    `Shop ${title} — ${productType.toLowerCase()} with MOQ-friendly manufacturing, premium paper stocks, and Razorpay checkout.`.slice(
      0,
      160,
    );

  const useVelvet = /velvet|peacock|luxury|wedding/i.test(title);
  const useFoil = /gold|saffron|foil|royal|wedding/i.test(title);

  return {
    productType,
    title,
    subtitle,
    description,
    seoTitle,
    seoDescription,
    specifications: {
      paperType: useVelvet ? "350 GSM Ivory" : "300 GSM Art Card",
      printMethod: useFoil ? "Foil Stamping" : "Offset Printing",
      machineType: "Heidelberg Offset",
      laminationType: useVelvet ? "Velvet" : "Soft-touch",
      techFinishingOptions: [
        ...(useFoil ? ["Gold Foiling" as const] : []),
        "Spot UV",
        ...(useVelvet ? ["Embossing" as const] : []),
      ],
    },
    finishing: {
      embossing: useVelvet,
      spotUV: true,
      goldFoiling: useFoil,
      velvetLamination: useVelvet,
    },
  };
}

async function generateWithOpenAiVision(
  input: GenerateProductContentInput,
): Promise<GeneratedProductContent | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !input.imageUrl) {
    return null;
  }

  const schemaHint = {
    productType: "string",
    title: "string",
    subtitle: "string",
    description: "string (2 short paragraphs, luxury tone)",
    seoTitle: "string (max 60 chars)",
    seoDescription: "string (max 160 chars)",
    specifications: {
      paperType: PAPER_TYPES,
      printMethod: PRINT_METHODS,
      machineType: "string",
      laminationType: LAMINATION_TYPES,
      techFinishingOptions: FINISHING_OPTIONS,
    },
    finishing: {
      embossing: "boolean",
      spotUV: "boolean",
      goldFoiling: "boolean",
      velvetLamination: "boolean",
    },
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a luxury print and packaging copywriter for V Design Luxury (India). Return strict JSON only. Use INR luxury tone. Pick specification values only from the allowed lists in the schema hint.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this product image and draft listing content. Existing title: ${input.title ?? "(none)"}. Subtitle: ${input.subtitle ?? "(none)"}. Schema: ${JSON.stringify(schemaHint)}`,
            },
            {
              type: "image_url",
              image_url: { url: input.imageUrl, detail: "low" },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const raw = payload.choices?.[0]?.message?.content;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as GeneratedProductContent;
  } catch {
    return null;
  }
}

export async function generateProductContent(
  input: GenerateProductContentInput,
): Promise<GeneratedProductContent> {
  const visionResult = await generateWithOpenAiVision(input);

  if (visionResult) {
    return visionResult;
  }

  await new Promise((resolve) => setTimeout(resolve, 800));

  return buildMockContent(input);
}
