import { defineArrayMember, defineField, defineType } from "sanity";

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Industry Name",
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
      rows: 3,
      description: "Shown on industry cards on the homepage and /industries page.",
    }),
    defineField({
      name: "homepagePortraitImage",
      title: "Homepage Card Image (Portrait)",
      type: "image",
      options: { hotspot: true },
      description:
        "EXACT SIZE: 800x1000px (4:5 Aspect Ratio). This image is specifically used for the tall vertical cards on the Homepage Industries section.",
    }),
    defineField({
      name: "pageLandscapeImage",
      title: "Industries Page Image (Landscape)",
      type: "image",
      options: { hotspot: true },
      description:
        "EXACT SIZE: 1200x675px (16:9 Aspect Ratio). This image is used for the wide horizontal slots on the main /industries page.",
    }),
    defineField({
      name: "icon",
      title: "Icon (optional Lucide name)",
      type: "string",
      description:
        "e.g. Pill, Gem, Heart, ShoppingBag, Briefcase, Camera, UtensilsCrossed, Rocket",
    }),
    defineField({
      name: "body",
      title: "Industry Page Content",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
      ],
      description:
        "Rich editorial content for the /industries/[slug] detail page.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "homepagePortraitImage",
    },
  },
});
