import { defineType } from "sanity";

import { pageHeroFields } from "../lib/page-hero-fields";

export const portfolioPage = defineType({
  name: "portfolioPage",
  title: "Portfolio Page Content",
  type: "document",
  fields: pageHeroFields,
  preview: {
    prepare: () => ({
      title: "Portfolio Page",
    }),
  },
});
