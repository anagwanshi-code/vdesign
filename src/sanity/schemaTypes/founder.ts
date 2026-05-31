import { defineField, defineType } from "sanity";

import {
  SANITY_IMAGE_GRID_CARD,
  SANITY_IMAGE_PROFILE_SQUARE,
} from "../lib/image-field-descriptions";

export const founder = defineType({
  name: "founder",
  title: "Founder & Story",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Founder Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Designation / Role",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description: "e.g., Built on Passion, Driven by Purpose",
    }),
    defineField({
      name: "quote",
      title: "Founder Quote",
      type: "text",
      description: "e.g., Design is not decoration...",
    }),
    defineField({
      name: "image",
      title: "Founder Image",
      type: "image",
      options: { hotspot: true },
      description: SANITY_IMAGE_PROFILE_SQUARE,
    }),
    defineField({
      name: "bio",
      title: "Founder Story / Bio",
      type: "text",
    }),
    defineField({
      name: "signature",
      title: "Signature Image (Optional)",
      type: "image",
      description: SANITY_IMAGE_GRID_CARD,
    }),
  ],
});
