import { generateProductContent } from "@/lib/ai/generate-product-content";
import { generateProductDescription } from "@/lib/ai/generate-product-description";
import { type NextRequest, NextResponse } from "next/server";

type GenerateDescriptionRequest = {
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
};

export async function POST(req: NextRequest) {
  let body: GenerateDescriptionRequest;

  try {
    body = (await req.json()) as GenerateDescriptionRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const title = body.title?.trim();

  if (!title) {
    return NextResponse.json(
      { error: "Product title is required" },
      { status: 400 },
    );
  }

  if (body.imageUrl) {
    const content = await generateProductContent({
      title,
      subtitle: body.subtitle?.trim(),
      imageUrl: body.imageUrl,
    });

    return NextResponse.json({ description: content.description });
  }

  const description = await generateProductDescription({
    title,
    subtitle: body.subtitle?.trim(),
  });

  return NextResponse.json({ description });
}
