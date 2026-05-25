import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "vertical",
      title: "Vertical",
      type: "string",
      options: {
        list: [
          { title: "Packaging", value: "packaging" },
          { title: "Ecommerce", value: "ecommerce" },
          { title: "Agency", value: "agency" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "accent",
      title: "Accent Color",
      type: "string",
      options: {
        list: [
          { title: "Peacock", value: "peacock" },
          { title: "Saffron", value: "saffron" },
          { title: "Purple", value: "purple" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "href",
      title: "Link URL",
      type: "string",
      description: "Destination when the service card is clicked.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "vertical",
      media: "coverImage",
    },
  },
});
