import { defineField, defineType } from "sanity";

import { SANITY_IMAGE_HERO } from "../lib/image-field-descriptions";

export const resourcesPage = defineType({
  name: "resourcesPage",
  title: "Resources Page Content",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Knowledge That Inspires.",
    }),
    defineField({
      name: "heroHighlight",
      title: "Hero Highlighted Word",
      type: "string",
      initialValue: "Creativity",
    }),
    defineField({
      name: "heroSuffix",
      title: "Hero Title Suffix",
      type: "string",
      initialValue: " That Delivers.",
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
  ],
});
