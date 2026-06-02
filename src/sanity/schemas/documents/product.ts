import { AutoSlugInput } from "@/sanity/components/AutoSlugInput";
import { ProductAiAssistInput } from "@/sanity/components/ProductAiAssistInput";
import { ProductDescriptionFieldWithAi } from "@/sanity/components/ProductDescriptionFieldWithAi";
import { ProductFieldWithAi } from "@/sanity/components/ProductFieldWithAi";
import { ProductSeoFieldWithAi } from "@/sanity/components/ProductSeoFieldWithAi";
import { SANITY_IMAGE_GRID_CARD } from "@/sanity/lib/image-field-descriptions";
import { slugify } from "@/sanity/lib/slugify";
import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "main", title: "1. Basic Info", default: true },
    { name: "media", title: "2. Media & AI" },
    { name: "taxonomy", title: "3. Categories & Filters" },
    { name: "pricing", title: "4. Pricing & Discounts" },
    { name: "specs", title: "5. Technical Specs" },
    { name: "customization", title: "6. Customizations" },
  ],
  fieldsets: [
    {
      name: "corePricing",
      title: "Base pricing",
      options: { collapsible: false },
    },
    {
      name: "volumeTiers",
      title: "Volume discount tiers",
      options: { collapsible: true },
    },
    {
      name: "inventory",
      title: "Inventory & publish status",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "premiumAddons",
      title: "Premium add-ons",
      options: { collapsible: true },
    },
    {
      name: "customUploads",
      title: "Custom uploads & artwork",
      options: { collapsible: true },
    },
    {
      name: "variantMatrix",
      title: "Sizes, frames & variants",
      options: { collapsible: true, collapsed: true },
    },
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
      description: `Primary shop/PDP image. ${SANITY_IMAGE_GRID_CARD}`,
    }),
    defineField({
      name: "gallery",
      title: "Product Gallery (Multiple Photos)",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
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
      description: `Additional PDP and shop card images. ${SANITY_IMAGE_GRID_CARD}`,
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
      description: `Legacy field for existing cloud data. Prefer Primary Image + Gallery. ${SANITY_IMAGE_GRID_CARD}`,
    }),

    // ==========================================
    // 2. BASIC INFORMATION
    // ==========================================
    defineField({
      name: "aiAssist",
      title: "AI Content Assistant",
      type: "string",
      group: "media",
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
      group: "main",
      components: {
        field: ProductFieldWithAi,
      },
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "main",
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
      group: "main",
      description: "Short line shown on product cards and the PDP header.",
    }),
    defineField({
      name: "description",
      title: "Luxury Description",
      type: "text",
      group: "main",
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
      group: "taxonomy",
      to: [{ type: "category" }],
      description:
        "Product category for shop filters and catalog grouping (manage under Product Category).",
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      group: "taxonomy",
      to: [{ type: "collection" }],
      validation: (Rule) =>
        Rule.required().error(
          "Assign a Collection before publishing—products without one are hidden from the storefront.",
        ),
      description:
        "Required. Collection slug drives `/collections/[slug]` routing and catalog listings.",
    }),
    defineField({
      name: "industries",
      title: "Related Industries",
      type: "array",
      group: "taxonomy",
      of: [{ type: "reference", to: [{ type: "industry" }] }],
      description: "Industries this product is relevant for (e.g. Wedding, Pharma).",
    }),
    defineField({
      name: "occasion",
      title: "Occasion",
      description: "Used for frontend Shop filters.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Wedding", value: "wedding" },
          { title: "Corporate", value: "corporate" },
          { title: "Festival", value: "festival" },
          { title: "Personal", value: "personal" },
        ],
        layout: "grid",
      },
      group: "taxonomy",
    }),
    defineField({
      name: "isNewArrival",
      title: "New Arrival",
      type: "boolean",
      initialValue: false,
      group: "taxonomy",
    }),
    defineField({
      name: "isOnSale",
      title: "On Sale",
      type: "boolean",
      initialValue: false,
      group: "taxonomy",
    }),
    defineField({
      name: "isCustomizable",
      title: "Customizable",
      type: "boolean",
      initialValue: false,
      group: "taxonomy",
    }),
    defineField({
      name: "isBestSeller",
      title: "Is Best Seller?",
      type: "boolean",
      group: "taxonomy",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "taxonomy",
      initialValue: false,
    }),

    // ==========================================
    // 3. PRICING & DISCOUNTS
    // ==========================================
    defineField({
      name: "price",
      title: "Selling Price (₹)",
      type: "number",
      group: "pricing",
      fieldset: "corePricing",
      validation: (Rule) => Rule.min(0),
      description:
        "Current selling price. Used on cards and PDP when no variants exist.",
    }),
    defineField({
      name: "mrp",
      title: "MRP / Compare-at Price (₹)",
      type: "number",
      group: "pricing",
      fieldset: "corePricing",
      description:
        "Original list price shown with strikethrough when higher than the selling price.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price (Legacy)",
      type: "number",
      group: "pricing",
      fieldset: "corePricing",
      hidden: true,
      description: "Legacy field — prefer MRP above. Kept for existing cloud data.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "moq",
      title: "Minimum Order Quantity (MOQ)",
      type: "number",
      group: "pricing",
      fieldset: "corePricing",
      initialValue: 1,
      description:
        "Lowest quantity a customer may order. Use 1 for retail/flexible items; higher for bulk print runs.",
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: "volumeDiscounts",
      title: "Volume Discounts",
      type: "array",
      group: "pricing",
      fieldset: "volumeTiers",
      of: [{ type: "volumeDiscount" }],
      description:
        "Tiered pricing by quantity — e.g. 10+ units → 5% off, 50+ units → 12% off. Sorted by min quantity on the storefront.",
    }),

    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      group: "pricing",
      fieldset: "inventory",
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: "reviewsCount",
      title: "Number of Reviews",
      type: "number",
      group: "pricing",
      fieldset: "inventory",
      validation: (Rule) => Rule.min(0),
    }),

    // ==========================================
    // 5. TECHNICAL SPECS
    // ==========================================
    defineField({
      name: "saleType",
      title: "Sale Type",
      type: "string",
      group: "specs",
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
      title: "Bulk MOQ (Manufacturing)",
      type: "number",
      group: "specs",
      initialValue: 100,
      description:
        "Bulk manufacturing minimum. Storefront MOQ is set under Pricing & Discounts; queries coalesce both fields.",
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: "paperType",
      title: "Paper Type",
      type: "string",
      group: "specs",
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
      group: "specs",
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
      group: "specs",
      description: "e.g., Heidelberg Offset, Konica Minolta Digital",
    }),
    defineField({
      name: "laminationType",
      title: "Lamination Type",
      type: "string",
      group: "specs",
      options: {
        list: ["Matte", "Gloss", "Velvet", "Soft-touch", "None"],
      },
      initialValue: "None",
    }),
    defineField({
      name: "techFinishingOptions",
      title: "Technical Finishing Options",
      type: "array",
      group: "specs",
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
      group: "specs",
      initialValue: false,
    }),
    defineField({
      name: "spotUV",
      title: "Spot UV Available",
      type: "boolean",
      group: "specs",
      initialValue: false,
    }),
    defineField({
      name: "goldFoiling",
      title: "Gold Foiling Available",
      type: "boolean",
      group: "specs",
      initialValue: false,
    }),
    defineField({
      name: "velvetLamination",
      title: "Velvet Lamination Available",
      type: "boolean",
      group: "specs",
      initialValue: false,
    }),
    defineField({
      name: "paperGsm",
      title: "Paper GSM Options",
      type: "string",
      group: "specs",
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
      group: "main",
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
      group: "main",
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
      group: "pricing",
      fieldset: "inventory",
    }),
    defineField({
      name: "inStock",
      title: "In Stock / Available for Order",
      type: "boolean",
      group: "pricing",
      fieldset: "inventory",
      initialValue: true,
    }),
    defineField({
      name: "status",
      title: "Publish Status",
      type: "string",
      group: "pricing",
      fieldset: "inventory",
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
    // 6. CUSTOMIZATIONS
    // ==========================================
    defineField({
      name: "allowCustomUpload",
      title: "Allow Custom Upload",
      type: "boolean",
      group: "customization",
      fieldset: "customUploads",
      initialValue: false,
      description:
        "Show a file upload field on the product page for custom logos, artwork, or design files.",
    }),
    defineField({
      name: "logoUploadRequired",
      title: "Upload Required at Checkout",
      type: "boolean",
      group: "customization",
      fieldset: "customUploads",
      initialValue: true,
      description:
        "When enabled, customers must upload artwork before checkout. Requires “Allow Custom Upload” to be on.",
    }),
    defineField({
      name: "customizationNotes",
      title: "Customization Instructions",
      type: "text",
      group: "customization",
      fieldset: "customUploads",
      description:
        "Customer-facing instructions for bespoke modifications, file formats, or bleed guidelines.",
    }),
    defineField({
      name: "premiumAddons",
      title: "Premium Add-ons",
      type: "array",
      group: "customization",
      fieldset: "premiumAddons",
      of: [{ type: "premiumAddon" }],
      description:
        "Optional upsells shown on the PDP — e.g. Gold Foiling (+₹500), Velvet Lamination (+₹300).",
    }),

    defineField({
      name: "availableSizes",
      title: "Available Sizes",
      type: "array",
      group: "customization",
      fieldset: "variantMatrix",
      of: [{ type: "reference", to: [{ type: "productSize" }] }],
      description: "Preset sizes offered for this artwork.",
    }),
    defineField({
      name: "sizeLabels",
      title: "Additional Size Labels",
      type: "array",
      group: "customization",
      fieldset: "variantMatrix",
      of: [{ type: "string" }],
      description:
        "Optional custom size strings when a shared preset is not needed.",
    }),
    defineField({
      name: "availableFrames",
      title: "Available Framing Options",
      type: "array",
      group: "customization",
      fieldset: "variantMatrix",
      of: [{ type: "reference", to: [{ type: "productFrame" }] }],
      description: "Preset framing finishes offered for this artwork.",
    }),
    defineField({
      name: "frameLabels",
      title: "Additional Frame Labels",
      type: "array",
      group: "customization",
      fieldset: "variantMatrix",
      of: [{ type: "string" }],
      description:
        "Optional custom frame strings when a shared preset is not needed.",
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      group: "customization",
      fieldset: "variantMatrix",
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
