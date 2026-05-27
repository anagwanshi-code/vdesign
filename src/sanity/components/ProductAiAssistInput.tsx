"use client";

import { ProductAiGenerateButton } from "@/sanity/components/ProductAiGenerateButton";
import { Box, Card, Stack, Text } from "@sanity/ui";
import type { StringInputProps } from "sanity";

/** Studio-only helper field — triggers vision-guided listing auto-fill. */
export function ProductAiAssistInput(props: StringInputProps) {
  const { readOnly } = props;

  return (
    <Card padding={4} radius={2} shadow={1} tone="transparent">
      <Stack space={4}>
        <Stack space={2}>
          <Text size={2} weight="semibold">
            AI Image-to-Content
          </Text>
          <Text size={1} muted>
            Uses the primary product image to suggest title, luxury description,
            technical specifications, finishing flags, and SEO metadata. Review
            and edit before publishing.
          </Text>
        </Stack>
        <ProductAiGenerateButton
          label="AI Generate All Fields"
          compact={false}
        />
        {readOnly ? (
          <Text size={1} muted>
            Document is read-only.
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
