import { defineField, defineType } from "sanity";

export const volumeDiscount = defineType({
  name: "volumeDiscount",
  title: "Volume Discount Tier",
  type: "object",
  fields: [
    defineField({
      name: "minQuantity",
      title: "Minimum Quantity",
      type: "number",
      description: "Order at least this many units to unlock the discount (e.g. 10).",
      validation: (Rule) => Rule.required().integer().min(2),
    }),
    defineField({
      name: "discountPercentage",
      title: "Discount (%)",
      type: "number",
      description: "Percentage off the unit price for this tier (e.g. 5 for 5% off).",
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
  ],
  preview: {
    select: {
      minQuantity: "minQuantity",
      discountPercentage: "discountPercentage",
    },
    prepare({ minQuantity, discountPercentage }) {
      return {
        title:
          minQuantity != null ? `${minQuantity}+ units` : "Volume tier",
        subtitle:
          discountPercentage != null ? `${discountPercentage}% off` : undefined,
      };
    },
  },
});
