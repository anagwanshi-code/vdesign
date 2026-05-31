import { defineField, defineType } from "sanity";

import { SANITY_IMAGE_GRID_CARD } from "../lib/image-field-descriptions";

export const downloadResource = defineType({
  name: "downloadResource",
  title: "Downloadable Resource (PDFs)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Resource Title",
      type: "string",
      description: "e.g., Packaging Checklist",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / File Info",
      type: "string",
      description: "e.g., PDF Guide • 1.2 MB",
    }),
    defineField({
      name: "file",
      title: "Upload File",
      type: "file",
    }),
    defineField({
      name: "previewImage",
      title: "Preview / Cover Image",
      type: "image",
      options: { hotspot: true },
      description: `PDF cover or mockup. ${SANITY_IMAGE_GRID_CARD}`,
    }),
  ],
});
