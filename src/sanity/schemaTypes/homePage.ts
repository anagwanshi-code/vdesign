import { SANITY_IMAGE_GRID_CARD } from "@/sanity/lib/image-field-descriptions";
import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadingRegular",
      title: "Hero Heading (Regular)",
      type: "string",
      description:
        "The regular part of the heading, e.g., 'We Build Brands That Leave a'",
    }),
    defineField({
      name: "heroHeadingCursive",
      title: "Hero Heading (Cursive Highlight)",
      type: "string",
      description:
        "The highlighted cursive word at the end, e.g., 'Mark.'",
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "text",
      rows: 3,
      description: "Supporting paragraph below the headline.",
    }),
    defineField({
      name: "heroStats",
      title: "Hero Stats",
      type: "array",
      validation: (Rule) => Rule.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "heroStat",
          fields: [
            defineField({
              name: "numberValue",
              title: "Number Value",
              type: "string",
              description: 'e.g. "18+", "5000+"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g. "Years Experience", "Projects Delivered"',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "numberValue", subtitle: "label" },
          },
        }),
      ],
    }),
    defineField({
      name: "trustStripHeading",
      title: "Trust Strip Heading",
      type: "string",
      initialValue: "TRUSTED BY GROWING BRANDS",
    }),
    defineField({
      name: "clientLogos",
      title: "Client Logos",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
      ],
      description:
        "Client brand logos for the trust strip marquee. Transparent PNGs work best.",
    }),
    defineField({
      name: "hero",
      title: "Hero Media & CTAs",
      type: "heroBlock",
      description:
        "Slider images, eyebrow, and call-to-action buttons for the hero.",
    }),
    defineField({
      name: "featuredCollections",
      title: "Featured Collections",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "collection" }],
        }),
      ],
    }),
    defineField({
      name: "featuredProducts",
      title: "Signature Pieces (Featured Products)",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "product" }],
        }),
      ],
    }),
    defineField({
      name: "aboutStudio",
      title: "About Studio",
      type: "object",
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
        }),
        defineField({
          name: "image",
          title: "Studio Image",
          type: "image",
          options: { hotspot: true },
          description: SANITY_IMAGE_GRID_CARD,
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
