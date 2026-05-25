import { homePage } from "@/sanity/schemas/documents/homePage";
import { product } from "@/sanity/schemas/documents/product";
import { cta } from "@/sanity/schemas/objects/cta";
import { heroBlock } from "@/sanity/schemas/objects/heroBlock";
import { service } from "@/sanity/schemas/objects/service";
import type { SchemaTypeDefinition } from "sanity";

export const schemaTypes: SchemaTypeDefinition[] = [
  homePage,
  product,
  heroBlock,
  service,
  cta,
];
