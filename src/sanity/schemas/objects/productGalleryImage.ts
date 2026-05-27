import { defineField, defineType } from "sanity";

export const productGalleryImage = defineType({
  name: "productGalleryImage",
  title: "Gallery Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional detail shown on hover or in lightbox.",
    }),
  ],
  preview: {
    select: {
      title: "image.alt",
      media: "image",
      caption: "caption",
    },
    prepare({ title, media, caption }) {
      return {
        title: title ?? "Gallery image",
        subtitle: caption,
        media,
      };
    },
  },
});
