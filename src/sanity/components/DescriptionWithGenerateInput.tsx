"use client";

import { Box, Button, Flex, Stack, Text, TextArea } from "@sanity/ui";
import { useCallback, useState } from "react";
import { set, useFormValue, type StringInputProps } from "sanity";

export function DescriptionWithGenerateInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props;
  const title = useFormValue(["title"]) as string | undefined;
  const subtitle = useFormValue(["subtitle"]) as string | undefined;
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!title?.trim()) {
      setError("Add a product title before generating a description.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle }),
      });

      const payload = (await response.json()) as {
        description?: string;
        error?: string;
      };

      if (!response.ok || !payload.description) {
        throw new Error(payload.error ?? "Generation failed");
      }

      onChange(set(payload.description));
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Unable to generate description",
      );
    } finally {
      setIsGenerating(false);
    }
  }, [title, subtitle, onChange]);

  return (
    <Stack space={3}>
      <Flex align="center" gap={3} wrap="wrap">
        <Button
          text={isGenerating ? "Generating…" : "Generate Description"}
          tone="primary"
          mode="ghost"
          disabled={isGenerating || readOnly}
          onClick={handleGenerate}
        />
        {error ? (
          <Text size={1} style={{ color: "var(--card-badge-critical-fg-color)" }}>
            {error}
          </Text>
        ) : null}
      </Flex>
      <Box>
        <TextArea
          value={value ?? ""}
          readOnly={readOnly}
          rows={5}
          onChange={(event) => onChange(set(event.currentTarget.value))}
        />
      </Box>
    </Stack>
  );
}
