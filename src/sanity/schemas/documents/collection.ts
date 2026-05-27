import { GenerateDescriptionAction } from "@/sanity/components/GenerateDescriptionAction";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Collection Description",
      type: "text",
      rows: 4,
      components: {
        field: GenerateDescriptionAction,
      },
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
      description:
        "Optional. If left blank, the system uses the first product image automatically.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image (Cinematic)",
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
    defineField({
      name: "products",
      title: "Featured Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      description:
        "Curated product order for collection pages. Products also reference this collection for catalog filtering.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      productCount: "products",
      media: "coverImage",
    },
    prepare({ title, productCount, media }) {
      const count = Array.isArray(productCount) ? productCount.length : 0;

      return {
        title,
        subtitle: count === 1 ? "1 product" : `${count} products`,
        media,
      };
    },
  },
});
