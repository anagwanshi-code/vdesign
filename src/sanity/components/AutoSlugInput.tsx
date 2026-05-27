"use client";

import { slugify } from "@/sanity/lib/slugify";
import { useEffect } from "react";
import { set, SlugInput, useFormValue, type SlugInputProps } from "sanity";

export function AutoSlugInput(props: SlugInputProps) {
  const { value, onChange } = props;
  const title = useFormValue(["title"]) as string | undefined;

  useEffect(() => {
    const nextSlug = slugify(title ?? "");

    if (!nextSlug) {
      return;
    }

    if (value?.current !== nextSlug) {
      onChange(
        set({
          _type: "slug",
          current: nextSlug,
        }),
      );
    }
  }, [title, value?.current, onChange]);

  return <SlugInput {...props} readOnly />;
}
