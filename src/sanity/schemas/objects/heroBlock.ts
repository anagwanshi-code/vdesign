import { defineField, defineType } from "sanity";

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Short label above the headline.",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImages",
      title: "Hero Slider Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
            }),
          ],
        },
      ],
      description:
        "Cinematic full-screen slider. Add multiple images for a 5-second cross-fade.",
    }),
    defineField({
      name: "media",
      title: "Hero Media (Legacy)",
      type: "image",
      options: { hotspot: true },
      hidden: true,
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
      description: "Legacy single image. Prefer Hero Slider Images.",
    }),
    defineField({
      name: "ctaPrimary",
      title: "Primary CTA",
      type: "cta",
    }),
    defineField({
      name: "ctaSecondary",
      title: "Secondary CTA",
      type: "cta",
    }),
  ],
});
