import { defineField, defineType } from "sanity";

import { SANITY_IMAGE_GRID_CARD } from "../lib/image-field-descriptions";

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
      description: "Shown on the Industries grid card.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      description: `Optional card footer image; gradient placeholder when empty. ${SANITY_IMAGE_GRID_CARD}`,
    }),
    defineField({
      name: "icon",
      title: "Icon (optional Lucide name)",
      type: "string",
      description:
        "e.g. Pill, Gem, Heart, ShoppingBag, Briefcase, Camera, UtensilsCrossed, Rocket",
    }),
  ],
});
