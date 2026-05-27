import { generateProductContent } from "@/lib/ai/generate-product-content";
import type { GenerateProductContentInput } from "@/lib/ai/types";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: GenerateProductContentInput;

  try {
    body = (await req.json()) as GenerateProductContentInput;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!body.imageUrl && !body.title?.trim()) {
    return NextResponse.json(
      { error: "Add a product title or primary image before generating." },
      { status: 400 },
    );
  }

  try {
    const content = await generateProductContent({
      title: body.title?.trim(),
      subtitle: body.subtitle?.trim(),
      imageUrl: body.imageUrl ?? null,
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("[AI] generate-product-content failed:", error);

    return NextResponse.json(
      { error: "Failed to generate product content" },
      { status: 500 },
    );
  }
}
