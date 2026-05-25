import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "v-design-luxury",
  title: "V Design Surat",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2024-05-24" }),
  ],
  schema: {
    types: schemaTypes,
  },
});
