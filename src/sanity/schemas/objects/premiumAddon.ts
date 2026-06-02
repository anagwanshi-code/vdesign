import { defineField, defineType } from "sanity";

export const premiumAddon = defineType({
  name: "premiumAddon",
  title: "Premium Add-on",
  type: "object",
  fields: [
    defineField({
      name: "addonName",
      title: "Add-on Name",
      type: "string",
      description: "e.g. Gold Foiling, Velvet Lamination, Spot UV",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "extraPrice",
      title: "Extra Price (₹)",
      type: "number",
      description: "Additional charge per unit or per order (storefront logic applies this at checkout).",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      addonName: "addonName",
      extraPrice: "extraPrice",
    },
    prepare({ addonName, extraPrice }) {
      return {
        title: addonName || "Premium add-on",
        subtitle:
          typeof extraPrice === "number"
            ? `+₹${extraPrice.toLocaleString("en-IN")}`
            : undefined,
      };
    },
  },
});
