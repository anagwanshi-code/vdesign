import { defineField } from "sanity";

import { SANITY_IMAGE_HERO } from "./image-field-descriptions";

/** Shared hero fields for marketing page singletons. */
export const pageHeroFields = [
  defineField({
    name: "title",
    title: "Hero Title",
    type: "string",
  }),
  defineField({
    name: "shortDescription",
    title: "Subtitle / Short Description",
    type: "text",
    rows: 4,
  }),
  defineField({
    name: "heroImage",
    title: "Hero Image",
    type: "image",
    options: { hotspot: true },
    description: SANITY_IMAGE_HERO,
  }),
];
