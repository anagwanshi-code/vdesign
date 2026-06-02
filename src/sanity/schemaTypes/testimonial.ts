import { defineField, defineType } from "sanity";

import { SANITY_IMAGE_PROFILE_SQUARE } from "../lib/image-field-descriptions";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "designation",
      title: "Designation",
      type: "string",
      description: "e.g. Bride, Business Owner, Creative Director",
    }),
    defineField({
      name: "review",
      title: "Review",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      initialValue: 5,
      validation: (Rule) =>
        Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "image",
      title: "Client Photo",
      type: "image",
      options: { hotspot: true },
      description: SANITY_IMAGE_PROFILE_SQUARE,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "designation",
      rating: "rating",
      media: "image",
    },
    prepare({ title, subtitle, rating, media }) {
      return {
        title: title ?? "Untitled testimonial",
        subtitle: [subtitle, rating ? `${rating}/5` : null]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
