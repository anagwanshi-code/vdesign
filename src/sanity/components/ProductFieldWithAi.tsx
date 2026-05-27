"use client";

import { ProductAiGenerateButton } from "@/sanity/components/ProductAiGenerateButton";
import { Box, Flex } from "@sanity/ui";
import type { FieldProps } from "sanity";

type ProductFieldWithAiProps = FieldProps & {
  aiLabel?: string;
};

export function ProductFieldWithAi(props: ProductFieldWithAiProps) {
  const { children, aiLabel } = props;

  return (
    <Box>
      <Flex align="flex-end" justify="space-between" gap={3} wrap="wrap">
        <Box flex={1}>{children}</Box>
        <ProductAiGenerateButton label={aiLabel ?? "AI Generate"} compact />
      </Flex>
    </Box>
  );
}
