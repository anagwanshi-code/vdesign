import { defineField, defineType } from "sanity";

import { SANITY_IMAGE_SERVICES_PAGE_HERO } from "../lib/image-field-descriptions";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page Content",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      initialValue: "OUR SERVICES",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      initialValue: "Creative Solutions, Powerful",
    }),
    defineField({
      name: "heroHighlight",
      title: "Hero Highlight Word",
      type: "string",
      initialValue: "Results.",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      description: SANITY_IMAGE_SERVICES_PAGE_HERO,
    }),
    defineField({
      name: "videoLink",
      title: "Video Link",
      type: "url",
      description:
        'URL for the "Watch Our Video" button (e.g., YouTube or Vimeo link).',
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Services Page",
    }),
  },
});
