import { defineField, defineType } from "sanity";

export const productSize = defineType({
  name: "productSize",
  title: "Product Size",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'Display label, e.g. "8×10 in" or "24×36 in".',
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
      name: "dimensionsLabel",
      title: "Dimensions Label",
      type: "string",
      description: 'Compact label for variant pickers, e.g. "8×10".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "widthInches",
      title: "Width (inches)",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "heightInches",
      title: "Height (inches)",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          { title: "4:5", value: "4:5" },
          { title: "2:3", value: "2:3" },
          { title: "3:4", value: "3:4" },
          { title: "Square", value: "square" },
          { title: "Custom", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "4:5",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first in size selectors.",
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
      subtitle: "dimensionsLabel",
    },
  },
});
