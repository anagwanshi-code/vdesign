"use client";

import { resolveStudioImageUrl } from "@/sanity/lib/resolve-studio-image-url";
import type { GeneratedProductContent } from "@/lib/ai/types";
import { useCallback, useState } from "react";
import {
  PatchEvent,
  set,
  useClient,
  useFormCallbacks,
  useFormValue,
} from "sanity";

type SanityImageField = {
  asset?: { _ref?: string; url?: string };
} | null;

export function useProductAiGenerate() {
  const { onChange: onDocumentChange } = useFormCallbacks();
  const client = useClient({ apiVersion: "2024-05-24" });
  const config = client.config();

  const title = useFormValue(["title"]) as string | undefined;
  const subtitle = useFormValue(["subtitle"]) as string | undefined;
  const primaryImage = useFormValue(["image"]) as SanityImageField | undefined;
  const images = useFormValue(["images"]) as SanityImageField[] | undefined;

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyGeneratedContent = useCallback(
    (content: GeneratedProductContent) => {
      const patches = [
        set(content.title, ["title"]),
        set(content.subtitle, ["subtitle"]),
        set(content.description, ["description"]),
        set(content.seoTitle, ["seoTitle"]),
        set(content.seoDescription, ["seoDescription"]),
        set(content.specifications.paperType, ["paperType"]),
        set(content.specifications.printMethod, ["printMethod"]),
        set(content.specifications.machineType ?? "", ["machineType"]),
        set(content.specifications.laminationType ?? "None", ["laminationType"]),
        set(
          content.specifications.techFinishingOptions ?? [],
          ["techFinishingOptions"],
        ),
        set(Boolean(content.finishing.embossing), ["embossing"]),
        set(Boolean(content.finishing.spotUV), ["spotUV"]),
        set(Boolean(content.finishing.goldFoiling), ["goldFoiling"]),
        set(Boolean(content.finishing.velvetLamination), ["velvetLamination"]),
      ];

      onDocumentChange(PatchEvent.from(patches));
    },
    [onDocumentChange],
  );

  const generate = useCallback(async () => {
    const imageUrl = resolveStudioImageUrl(
      primaryImage ?? images?.[0] ?? null,
      config.projectId ?? "",
      config.dataset ?? "production",
    );

    if (!imageUrl && !title?.trim()) {
      setError(
        "Add a product title or a primary image in the Media tab.",
      );
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-product-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          imageUrl,
        }),
      });

      const payload = (await response.json()) as GeneratedProductContent & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Generation failed");
      }

      applyGeneratedContent(payload);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Unable to generate content",
      );
    } finally {
      setIsGenerating(false);
    }
  }, [
    applyGeneratedContent,
    config.dataset,
    config.projectId,
    images,
    primaryImage,
    subtitle,
    title,
  ]);

  return {
    generate,
    isGenerating,
    error,
    hasPrimaryImage: Boolean(primaryImage ?? images?.[0]),
  };
}
