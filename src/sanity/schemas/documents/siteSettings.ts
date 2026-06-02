import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Platform Name",
              type: "string",
              description: "e.g. Instagram, Pinterest, Facebook",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "Profile URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      validation: (Rule) =>
        Rule.email().warning("Use a valid email address for mailto links."),
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      initialValue: "© 2026 V Design. All rights reserved.",
    }),
    defineField({
      name: "announcements",
      title: "Announcement Bar Messages",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Short promotional lines for the top marquee. Leave empty to use site defaults.",
    }),
    defineField({
      name: "isShippingComplimentary",
      title: "Offer Complimentary Shipping",
      type: "boolean",
      initialValue: true,
      description: "Turn on to offer free shipping.",
    }),
    defineField({
      name: "flatShippingRate",
      title: "Flat Shipping Rate (₹)",
      type: "number",
      initialValue: 150,
      hidden: ({ document }) => Boolean(document?.isShippingComplimentary),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Site Settings",
    }),
  },
});
