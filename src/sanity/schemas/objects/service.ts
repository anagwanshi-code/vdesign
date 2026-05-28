import { ServiceDescriptionFieldWithAi } from "@/sanity/components/ServiceDescriptionFieldWithAi";
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
      rows: 5,
      components: {
        field: ServiceDescriptionFieldWithAi,
      },
      description:
        "Free-form service copy. Use AI Generate to draft editorial text from the title.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "vertical",
      title: "Category Label",
      type: "string",
      description:
        "Optional short label above the title (e.g. Packaging, Commerce, Atelier). Fully custom—no presets.",
    }),
    defineField({
      name: "accent",
      title: "Accent Color",
      type: "string",
      description:
        "Optional accent token for the card label: peacock, saffron, purple, or gold.",
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
