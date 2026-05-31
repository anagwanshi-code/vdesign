import { defineField, defineType } from "sanity";

import {
  SANITY_IMAGE_GRID_CARD,
  SANITY_IMAGE_HERO,
} from "../lib/image-field-descriptions";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page Content",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      description: "e.g., Crafting Brands. Creating",
    }),
    defineField({
      name: "heroHighlight",
      title: "Hero Highlighted Word",
      type: "string",
      description: "e.g., Impact.",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      description: SANITY_IMAGE_HERO,
    }),
    defineField({
      name: "journeyTitle",
      title: "Journey Section Title",
      type: "string",
      initialValue: "A Journey of Passion & Creativity",
    }),
    defineField({
      name: "journeyTimeline",
      title: "Timeline Events",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "year", title: "Year", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "valuesTitle",
      title: "Values Section Title",
      type: "string",
      initialValue: "The Principles That Define Us",
    }),
    defineField({
      name: "valuesList",
      title: "Core Values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Value Title", type: "string" }),
            defineField({
              name: "description",
              title: "Value Description",
              type: "text",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "studioHeading",
      title: "Studio Heading",
      type: "string",
      initialValue: "Where Ideas Come to Life",
    }),
    defineField({
      name: "studioDescription",
      title: "Studio Description",
      type: "text",
    }),
    defineField({
      name: "studioImages",
      title: "Studio Images (Upload exactly 4)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: `${SANITY_IMAGE_GRID_CARD} Upload exactly 4 studio photos.`,
      validation: (Rule) => Rule.max(4),
    }),
  ],
});
