import { defineField, defineType } from "sanity";

import { SANITY_IMAGE_GRID_CARD } from "../lib/image-field-descriptions";

export const category = defineType({
  name: "category",
  title: "Product Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category Title",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
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
