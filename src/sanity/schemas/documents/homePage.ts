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
    defineField({
      name: "featuredProducts",
      title: "Signature Pieces (Featured Products)",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      description:
        "Hand-picked products for the Signature Pieces section (3-column grid).",
    }),
    defineField({
      name: "aboutStudio",
      title: "About Studio",
      type: "object",
      description:
        "Craftsmanship story section below Signature Pieces on the homepage.",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          initialValue: "OUR ATELIER",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 4,
        }),
        defineField({
          name: "ctaLabel",
          title: "CTA Label",
          type: "string",
          initialValue: "Discover Our Studio",
        }),
        defineField({
          name: "ctaLink",
          title: "CTA Link",
          type: "string",
          initialValue: "/about",
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value || typeof value !== "string") {
                return true;
              }
              const trimmed = value.trim();
              if (
                trimmed.startsWith("/") ||
                trimmed.startsWith("http://") ||
                trimmed.startsWith("https://")
              ) {
                return true;
              }
              return "Use a path starting with / or a full http(s) URL.";
            }),
        }),
        defineField({
          name: "image",
          title: "Studio Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Home Page",
    }),
  },
});
