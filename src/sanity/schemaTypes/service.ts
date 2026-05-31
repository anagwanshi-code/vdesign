import { defineField, defineType } from "sanity";

import { SANITY_IMAGE_GRID_CARD } from "../lib/image-field-descriptions";

export const service = defineType({
  name: "service",
  title: "Services",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Service Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      description: "A brief summary of the service.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      description: SANITY_IMAGE_GRID_CARD,
    }),
  ],
});
