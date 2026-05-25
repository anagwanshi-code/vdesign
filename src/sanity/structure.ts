import type { StructureResolver } from "sanity/structure";

const HOME_PAGE_DOCUMENT_ID = "homePage";

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
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "homePage",
      ),
    ]);
