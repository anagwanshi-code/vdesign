"use client";

import { SparklesIcon } from "@sanity/icons";
import { Box, Button, Stack } from "@sanity/ui";
import { useCallback } from "react";
import {
  PatchEvent,
  set,
  useFormCallbacks,
  useFormValue,
  type FieldProps,
} from "sanity";

export function GenerateDescriptionAction(props: FieldProps) {
  const { renderDefault } = props;
  const title = useFormValue(["title"]) as string | undefined;
  const { onChange } = useFormCallbacks();

  const handleGenerate = useCallback(() => {
    if (!title?.trim()) {
      window.alert("Please enter a Collection Title first.");
      return;
    }

    const generatedDesc = `Discover our exclusive ${title} collection. Handcrafted with premium materials and cinematic Indian artistry, perfect for luxury branding and bespoke packaging.`;

    onChange(PatchEvent.from([set(generatedDesc, ["description"])]));
  }, [title, onChange]);

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Box>
        <Button
          icon={SparklesIcon}
          text="AI Generate Description"
          mode="ghost"
          tone="primary"
          onClick={handleGenerate}
        />
      </Box>
    </Stack>
  );
}
