import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "heroBlock",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "service" }],
    }),
    defineField({
      name: "featuredCollections",
      title: "Featured Collections",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "collection" }],
        },
      ],
      description:
        "Curated collections shown on the homepage in a 4-column cinematic grid.",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Home Page",
    }),
  },
});
