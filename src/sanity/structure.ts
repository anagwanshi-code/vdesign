import type { StructureResolver } from "sanity/structure";

const HOME_PAGE_DOCUMENT_ID = "homePageV2";
const SITE_SETTINGS_DOCUMENT_ID = "siteSettings";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .id(HOME_PAGE_DOCUMENT_ID)
        .child(
          S.document()
            .schemaType("homePage")
            .documentId(HOME_PAGE_DOCUMENT_ID),
        ),
      S.listItem()
        .title("Site Settings")
        .id(SITE_SETTINGS_DOCUMENT_ID)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId(SITE_SETTINGS_DOCUMENT_ID),
        ),
      S.divider(),
      S.listItem()
        .title("Collections")
        .schemaType("collection")
        .child(S.documentTypeList("collection").title("Collections")),
      S.listItem()
        .title("Products")
        .schemaType("product")
        .child(S.documentTypeList("product").title("Products")),
      S.divider(),
      S.listItem()
        .title("Size Presets")
        .schemaType("productSize")
        .child(S.documentTypeList("productSize").title("Size Presets")),
      S.listItem()
        .title("Frame Presets")
        .schemaType("productFrame")
        .child(S.documentTypeList("productFrame").title("Frame Presets")),
    ]);
