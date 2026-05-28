"use client";

import { SparklesIcon } from "@sanity/icons";
import { Box, Button, Stack, Text } from "@sanity/ui";
import { useCallback, useState } from "react";
import {
  PatchEvent,
  set,
  useFormCallbacks,
  useFormValue,
  type FieldProps,
} from "sanity";

export function ServiceDescriptionFieldWithAi(props: FieldProps) {
  const { renderDefault } = props;
  const title = useFormValue(["title"]) as string | undefined;
  const { onChange } = useFormCallbacks();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!title?.trim()) {
      setError("Add a service title before generating a description.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, context: "service" }),
      });

      const payload = (await response.json()) as {
        description?: string;
        error?: string;
      };

      if (!response.ok || !payload.description) {
        throw new Error(payload.error ?? "Generation failed");
      }

      onChange(PatchEvent.from([set(payload.description, ["description"])]));
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Unable to generate description",
      );
    } finally {
      setIsGenerating(false);
    }
  }, [title, onChange]);

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Box>
        <Button
          icon={SparklesIcon}
          text={isGenerating ? "Generating…" : "AI Generate Description"}
          mode="ghost"
          tone="primary"
          disabled={isGenerating}
          onClick={handleGenerate}
        />
      </Box>
      {error ? (
        <Text size={1} style={{ color: "var(--card-badge-critical-fg-color)" }}>
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}
