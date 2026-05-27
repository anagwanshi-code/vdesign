"use client";

import { ProductFieldWithAi } from "@/sanity/components/ProductFieldWithAi";
import type { FieldProps } from "sanity";

export function ProductSeoFieldWithAi(props: FieldProps) {
  return ProductFieldWithAi({ ...props, aiLabel: "AI Generate SEO" });
}
