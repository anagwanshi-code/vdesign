import { defineField, defineType } from "sanity";

export const productVariant = defineType({
  name: "productVariant",
  title: "Product Variant",
  type: "object",
  fields: [
    defineField({
      name: "size",
      title: "Size (Preset)",
      type: "reference",
      to: [{ type: "productSize" }],
      description:
        "Link a shared size preset, or leave empty and use Custom Size Label below.",
    }),
    defineField({
      name: "sizeLabel",
      title: "Custom Size Label",
      type: "string",
      description:
        'One-off size label when no preset exists, e.g. "18×24 in".',
    }),
    defineField({
      name: "frame",
      title: "Frame (Preset)",
      type: "reference",
      to: [{ type: "productFrame" }],
      description:
        "Link a shared framing option, or leave empty and use Custom Frame Label below.",
    }),
    defineField({
      name: "frameLabel",
      title: "Custom Frame Label",
      type: "string",
      description: 'One-off frame label, e.g. "Natural Oak Floater".',
    }),
    defineField({
      name: "priceInInr",
      title: "Price (INR)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "compareAtPriceInInr",
      title: "Compare-at Price (INR)",
      type: "number",
      description: "Optional struck-through reference price.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      sizeTitle: "size.title",
      sizeLabel: "sizeLabel",
      frameTitle: "frame.title",
      frameLabel: "frameLabel",
      priceInInr: "priceInInr",
    },
    prepare({ sizeTitle, sizeLabel, frameTitle, frameLabel, priceInInr }) {
      const size = sizeTitle ?? sizeLabel ?? "Size TBD";
      const frame = frameTitle ?? frameLabel ?? "Frame TBD";
      const price =
        typeof priceInInr === "number"
          ? `₹${priceInInr.toLocaleString("en-IN")}`
          : "";

      return {
        title: `${size} · ${frame}`,
        subtitle: price,
      };
    },
  },
  validation: (Rule) =>
    Rule.custom((variant) => {
      if (!variant || typeof variant !== "object") {
        return true;
      }

      const record = variant as {
        size?: { _ref?: string };
        sizeLabel?: string;
        frame?: { _ref?: string };
        frameLabel?: string;
      };

      const hasSize = Boolean(record.size?._ref || record.sizeLabel?.trim());
      const hasFrame = Boolean(record.frame?._ref || record.frameLabel?.trim());

      if (!hasSize) {
        return "Each variant needs a size preset or custom size label.";
      }

      if (!hasFrame) {
        return "Each variant needs a frame preset or custom frame label.";
      }

      return true;
    }),
});
