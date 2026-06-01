import { defineType } from "sanity";

import { pageHeroFields } from "../lib/page-hero-fields";

export const industriesPage = defineType({
  name: "industriesPage",
  title: "Industries Page Content",
  type: "document",
  fields: pageHeroFields,
  preview: {
    prepare: () => ({
      title: "Industries Page",
    }),
  },
});
