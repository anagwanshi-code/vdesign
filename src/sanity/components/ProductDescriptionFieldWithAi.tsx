"use client";

import { ProductFieldWithAi } from "@/sanity/components/ProductFieldWithAi";
import type { FieldProps } from "sanity";

export function ProductDescriptionFieldWithAi(props: FieldProps) {
  return ProductFieldWithAi({ ...props, aiLabel: "AI Generate Copy" });
}
