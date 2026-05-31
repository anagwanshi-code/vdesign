import { defineArrayMember, defineField, defineType } from "sanity";

import {
  SANITY_IMAGE_GRID_CARD,
  SANITY_IMAGE_HERO,
} from "../lib/image-field-descriptions";

export const portfolio = defineType({
  name: "portfolio",
  title: "Portfolio Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "loopingVideo",
      title: "Homepage Looping Video (.mp4)",
      type: "file",
      options: {
        accept: "video/mp4,video/webm",
      },
      description:
        "Upload a short, optimized, muted looping video for the homepage card. Max 10MB.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image (Case Study Hero)",
      type: "image",
      options: { hotspot: true },
      description: SANITY_IMAGE_HERO,
    }),
    defineField({
      name: "image",
      title: "Grid / Card Image",
      type: "image",
      options: { hotspot: true },
      description: `${SANITY_IMAGE_GRID_CARD} Used on portfolio index cards when no cover image is set.`,
    }),
    defineField({
      name: "gallery",
      title: "Project Gallery (Multiple Photos)",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
      ],
      description: `${SANITY_IMAGE_GRID_CARD} Additional project photos for detail pages.`,
    }),
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
    }),
    defineField({
      name: "client",
      title: "Client Name (Legacy)",
      type: "string",
      hidden: true,
      description: "Deprecated — use Client Name instead.",
    }),
    defineField({
      name: "timeline",
      title: "Project Timeline",
      type: "string",
      description: 'e.g., "3 Months" or "Q1 2026"',
    }),
    defineField({
      name: "servicesProvided",
      title: "Services Provided",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      description: "Summary for cards and below the case study hero.",
    }),
    defineField({
      name: "description",
      title: "Short Description (Legacy)",
      type: "text",
      rows: 3,
      hidden: true,
    }),
    defineField({
      name: "body",
      title: "Case Study Content",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          description: SANITY_IMAGE_GRID_CARD,
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
      description:
        "The main story and deep visual showcase of the project.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      media: "coverImage",
    },
  },
});
