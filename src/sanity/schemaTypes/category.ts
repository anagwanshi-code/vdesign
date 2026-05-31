import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Product Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category Title",
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
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],
});
