import { defineField, defineType } from "sanity";

export const FRAME_TYPES = [
  { title: "Unframed", value: "unframed" },
  { title: "Framed Paper", value: "framed-paper" },
  { title: "Framed Canvas", value: "framed-canvas" },
  { title: "Wrapped Canvas", value: "wrapped-canvas" },
  { title: "Oversized Canvas", value: "oversized-canvas" },
  { title: "Digital Download", value: "digital-download" },
] as const;

export const FRAME_FINISHES = [
  { title: "Unframed", value: "unframed" },
  { title: "Black", value: "black" },
  { title: "Natural Oak", value: "natural-oak" },
  { title: "Walnut", value: "walnut" },
  { title: "White", value: "white" },
  { title: "Gold", value: "gold" },
] as const;

export const productFrame = defineType({
  name: "productFrame",
  title: "Framing Option",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'Display label, e.g. "Black Wood Frame" or "Unframed".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "frameType",
      title: "Frame Type",
      type: "string",
      options: {
        list: [...FRAME_TYPES],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "finish",
      title: "Finish",
      type: "string",
      options: {
        list: [...FRAME_FINISHES],
        layout: "dropdown",
      },
      initialValue: "unframed",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional material or finish notes for PDP copy.",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      frameType: "frameType",
      finish: "finish",
    },
    prepare({ title, frameType, finish }) {
      return {
        title,
        subtitle: [frameType, finish].filter(Boolean).join(" · "),
      };
    },
  },
});
