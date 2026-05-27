import { AutoSlugInput } from "@/sanity/components/AutoSlugInput";
import { ProductAiAssistInput } from "@/sanity/components/ProductAiAssistInput";
import { ProductDescriptionFieldWithAi } from "@/sanity/components/ProductDescriptionFieldWithAi";
import { ProductFieldWithAi } from "@/sanity/components/ProductFieldWithAi";
import { ProductSeoFieldWithAi } from "@/sanity/components/ProductSeoFieldWithAi";
import { slugify } from "@/sanity/lib/slugify";
import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "media", title: "1. Media", default: true },
    { name: "basic", title: "2. Basic Information" },
    { name: "pricing", title: "3. Pricing" },
    { name: "manufacturing", title: "4. Sales & Manufacturing Controls" },
    { name: "specifications", title: "5. Product Specifications" },
    { name: "finishing", title: "6. Finishing Options" },
    { name: "seo", title: "7. SEO" },
    { name: "inventory", title: "8. Inventory" },
    { name: "customization", title: "9. Customization" },
    { name: "catalog", title: "10. Variants & Catalog" },
  ],
  fields: [
    // ==========================================
    // 1. MEDIA (must match Sanity Cloud: image + gallery[])
    // ==========================================
    defineField({
      name: "image",
      title: "Primary Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description: "The main image for the product.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            },
          ],
        },
      ],
      description: "Additional product images.",
    }),
    defineField({
      name: "images",
      title: "Product Images (Legacy Array)",
      type: "array",
      group: "media",
      hidden: true,
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
            }),
          ],
        },
      ],
      description:
        "Legacy field kept for existing cloud data. Prefer Primary Image + Gallery.",
    }),

    // ==========================================
    // 2. BASIC INFORMATION
    // ==========================================
    defineField({
      name: "aiAssist",
      title: "AI Content Assistant",
      type: "string",
      group: "basic",
      readOnly: true,
      components: {
        input: ProductAiAssistInput,
      },
      description:
        "Generate title, description, specs, and SEO from the primary product image.",
    }),
    defineField({
      name: "title",
      title: "Product Title",
      type: "string",
      group: "basic",
      components: {
        field: ProductFieldWithAi,
      },
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basic",
      readOnly: true,
      description: "Auto-generated from the product title.",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) => slugify(input),
      },
      components: {
        input: AutoSlugInput,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "basic",
      description: "Short line shown on product cards and the PDP header.",
    }),
    defineField({
      name: "description",
      title: "Luxury Description",
      type: "text",
      group: "basic",
      rows: 6,
      components: {
        field: ProductDescriptionFieldWithAi,
      },
      description:
        "Plain string stored as Sanity text (not Portable Text blocks).",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "catalog",
      to: [{ type: "collection" }],
      description:
        "Primary browse category. Similar products match here first on the PDP.",
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      group: "catalog",
      to: [{ type: "collection" }],
      validation: (Rule) =>
        Rule.required().error(
          "Assign a Collection before publishing—products without one are hidden from the storefront.",
        ),
      description:
        "Required. Collection slug drives `/collections/[slug]` routing and catalog listings.",
    }),

    // ==========================================
    // 3. PRICING
    // ==========================================
    defineField({
      name: "price",
      title: "Base Price (₹)",
      type: "number",
      group: "pricing",
      validation: (Rule) => Rule.min(0),
      description:
        "Display price when no variants exist, or as the “from” price on cards.",
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price (₹)",
      type: "number",
      group: "pricing",
      description: "Original price for displaying discounts.",
      validation: (Rule) => Rule.min(0),
    }),

    // ==========================================
    // 4. SALES & MANUFACTURING CONTROLS
    // ==========================================
    defineField({
      name: "saleType",
      title: "Sale Type",
      type: "string",
      group: "manufacturing",
      options: {
        list: [
          { title: "Bulk Manufacturing", value: "bulk" },
          { title: "Flexible / Retail", value: "flexible" },
        ],
        layout: "radio",
      },
      initialValue: "bulk",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "minOrderQuantity",
      title: "Minimum Order Quantity (MOQ)",
      type: "number",
      group: "manufacturing",
      initialValue: 100,
      description:
        "Bulk: customers must order in multiples of this value. Flexible: minimum units only.",
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: "logoUploadRequired",
      title: "Logo/Artwork Upload Required",
      type: "boolean",
      group: "manufacturing",
      initialValue: true,
      description:
        "Mandates the customer to upload their brand assets before checkout.",
    }),

    // ==========================================
    // 5. PRODUCT SPECIFICATIONS
    // ==========================================
    defineField({
      name: "paperType",
      title: "Paper Type",
      type: "string",
      group: "specifications",
      options: {
        list: [
          "300 GSM Art Card",
          "350 GSM Ivory",
          "Imported Texture Paper",
          "Metallic Sheet",
        ],
      },
      validation: (Rule) =>
        Rule.required().error("Paper Type is critical for manufacturing."),
    }),
    defineField({
      name: "printMethod",
      title: "Print Method",
      type: "string",
      group: "specifications",
      options: {
        list: [
          "Offset Printing",
          "Digital Printing",
          "Screen Printing",
          "Foil Stamping",
        ],
      },
      validation: (Rule) =>
        Rule.required().error("Print Method is critical for manufacturing."),
    }),
    defineField({
      name: "machineType",
      title: "Machine Type",
      type: "string",
      group: "specifications",
      description: "e.g., Heidelberg Offset, Konica Minolta Digital",
    }),
    defineField({
      name: "laminationType",
      title: "Lamination Type",
      type: "string",
      group: "specifications",
      options: {
        list: ["Matte", "Gloss", "Velvet", "Soft-touch", "None"],
      },
      initialValue: "None",
    }),
    defineField({
      name: "techFinishingOptions",
      title: "Technical Finishing Options",
      type: "array",
      group: "specifications",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Embossing", value: "Embossing" },
          { title: "Spot UV", value: "Spot UV" },
          { title: "Gold Foiling", value: "Gold Foiling" },
          { title: "Die Cutting", value: "Die Cutting" },
        ],
      },
    }),

    // ==========================================
    // 6. FINISHING OPTIONS
    // ==========================================
    defineField({
      name: "embossing",
      title: "Embossing Available",
      type: "boolean",
      group: "finishing",
      initialValue: false,
    }),
    defineField({
      name: "spotUV",
      title: "Spot UV Available",
      type: "boolean",
      group: "finishing",
      initialValue: false,
    }),
    defineField({
      name: "goldFoiling",
      title: "Gold Foiling Available",
      type: "boolean",
      group: "finishing",
      initialValue: false,
    }),
    defineField({
      name: "velvetLamination",
      title: "Velvet Lamination Available",
      type: "boolean",
      group: "finishing",
      initialValue: false,
    }),
    defineField({
      name: "paperGsm",
      title: "Paper GSM Options",
      type: "string",
      group: "finishing",
      options: {
        list: [
          "300 GSM",
          "350 GSM",
          "400 GSM",
          "Imported Texture",
          "Metallic Sheet",
        ],
      },
    }),

    // ==========================================
    // 7. SEO
    // ==========================================
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      components: {
        field: ProductSeoFieldWithAi,
      },
      validation: (Rule) =>
        Rule.max(60).warning("Keep under 60 characters for optimal SEO."),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
      components: {
        field: ProductSeoFieldWithAi,
      },
      validation: (Rule) =>
        Rule.max(160).warning("Keep under 160 characters for optimal SEO."),
    }),

    // ==========================================
    // 8. INVENTORY
    // ==========================================
    defineField({
      name: "sku",
      title: "SKU (Stock Keeping Unit)",
      type: "string",
      group: "inventory",
    }),
    defineField({
      name: "inStock",
      title: "In Stock / Available for Order",
      type: "boolean",
      group: "inventory",
      initialValue: true,
    }),
    defineField({
      name: "status",
      title: "Publish Status",
      type: "string",
      group: "inventory",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Draft", value: "draft" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),

    // ==========================================
    // 9. CUSTOMIZATION
    // ==========================================
    defineField({
      name: "customizationNotes",
      title: "Customization Instructions",
      type: "text",
      group: "customization",
      description:
        "Internal notes or customer-facing instructions regarding bespoke modifications.",
    }),

    // ==========================================
    // 10. VARIANTS & CATALOG (storefront matrix)
    // ==========================================
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "catalog",
      initialValue: false,
    }),
    defineField({
      name: "availableSizes",
      title: "Available Sizes",
      type: "array",
      group: "catalog",
      of: [{ type: "reference", to: [{ type: "productSize" }] }],
      description: "Preset sizes offered for this artwork.",
    }),
    defineField({
      name: "sizeLabels",
      title: "Additional Size Labels",
      type: "array",
      group: "catalog",
      of: [{ type: "string" }],
      description:
        "Optional custom size strings when a shared preset is not needed.",
    }),
    defineField({
      name: "availableFrames",
      title: "Available Framing Options",
      type: "array",
      group: "catalog",
      of: [{ type: "reference", to: [{ type: "productFrame" }] }],
      description: "Preset framing finishes offered for this artwork.",
    }),
    defineField({
      name: "frameLabels",
      title: "Additional Frame Labels",
      type: "array",
      group: "catalog",
      of: [{ type: "string" }],
      description:
        "Optional custom frame strings when a shared preset is not needed.",
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      group: "catalog",
      of: [{ type: "productVariant" }],
      description:
        "Size × frame combinations with individual INR pricing (dt-brushstrokes style matrix).",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "sku",
      status: "status",
      media: "image",
      legacyMedia: "images.0",
    },
    prepare({ title, subtitle, status, media, legacyMedia }) {
      return {
        title,
        subtitle: [subtitle, status].filter(Boolean).join(" · ") || undefined,
        media: media ?? legacyMedia,
      };
    },
  },
  validation: (Rule) =>
    Rule.custom((document) => {
      if (!document || typeof document !== "object") {
        return true;
      }

      const record = document as {
        price?: number;
        variants?: Array<{ priceInInr?: number }>;
        images?: unknown[];
        image?: unknown;
        collection?: { _ref?: string };
        status?: string;
      };

      const hasBasePrice = typeof record.price === "number" && record.price >= 0;
      const hasVariantPrices =
        Array.isArray(record.variants) &&
        record.variants.some(
          (variant) =>
            typeof variant?.priceInInr === "number" && variant.priceInInr >= 0,
        );
      const hasImages =
        (Array.isArray(record.images) && record.images.length > 0) ||
        Boolean(record.image);

      if (!hasImages) {
        return "Add at least one product image.";
      }

      if (!hasBasePrice && !hasVariantPrices) {
        return "Add a base price or at least one variant with pricing.";
      }

      const status = record.status ?? "active";
      if (status === "active" && !record.collection?._ref) {
        return "Active products must reference a Collection.";
      }

      return true;
    }),
});
