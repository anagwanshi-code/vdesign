import { defineField, defineType } from "sanity";

import { SANITY_IMAGE_GRID_CARD } from "../lib/image-field-descriptions";

export const post = defineType({
  name: "post",
  title: "Insight / Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Post Title",
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
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      description: SANITY_IMAGE_GRID_CARD,
    }),
    defineField({
      name: "excerpt",
      title: "Short Summary / Excerpt",
      type: "text",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
  ],
});
