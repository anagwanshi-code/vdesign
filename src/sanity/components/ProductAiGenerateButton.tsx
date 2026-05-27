"use client";

import { useProductAiGenerate } from "@/sanity/hooks/use-product-ai-generate";
import { Box, Button, Flex, Spinner, Text } from "@sanity/ui";

type ProductAiGenerateButtonProps = {
  label?: string;
  compact?: boolean;
};

export function ProductAiGenerateButton({
  label = "AI Generate",
  compact = false,
}: ProductAiGenerateButtonProps) {
  const { generate, isGenerating, error, hasPrimaryImage } =
    useProductAiGenerate();

  return (
    <Box>
      <Flex align="center" gap={2} wrap="wrap">
        <Button
          text={isGenerating ? "Generating…" : label}
          tone="primary"
          mode={compact ? "ghost" : "default"}
          icon={isGenerating ? Spinner : undefined}
          disabled={isGenerating}
          onClick={generate}
        />
        {!hasPrimaryImage ? (
          <Text size={1} muted>
            Add a primary image for vision-guided specs.
          </Text>
        ) : null}
      </Flex>
      {error ? (
        <Text
          size={1}
          style={{ color: "var(--card-badge-critical-fg-color)", marginTop: 8 }}
        >
          {error}
        </Text>
      ) : null}
    </Box>
  );
}
