import { defineType } from "sanity";

import { pageHeroFields } from "../lib/page-hero-fields";

export const shopPage = defineType({
  name: "shopPage",
  title: "Shop Page Content",
  type: "document",
  fields: pageHeroFields,
  preview: {
    prepare: () => ({
      title: "Shop Page",
    }),
  },
});
