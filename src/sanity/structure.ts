import type { StructureBuilder, StructureResolver } from "sanity/structure";

const HIDDEN_DOCUMENT_TYPES = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "contactPage",
  "servicesPage",
  "resourcesPage",
  "portfolioPage",
  "industriesPage",
  "shopPage",
  "product",
  "category",
  "collection",
  "productSize",
  "productFrame",
  "service",
  "industry",
  "portfolio",
  "post",
  "founder",
  "downloadResource",
  "order",
]);

function singletonDocument(
  S: StructureBuilder,
  schemaType: string,
  title: string,
  documentId: string,
) {
  return S.listItem()
    .title(title)
    .id(`${schemaType}-${documentId}`)
    .child(
      S.document().schemaType(schemaType).documentId(documentId).title(title),
    );
}

function documentTypeListItem(
  S: StructureBuilder,
  schemaType: string,
  title: string,
) {
  return S.documentTypeListItem(schemaType).title(title);
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singletonDocument(S, "siteSettings", "Site Settings", "siteSettings"),

      S.divider(),

      S.listItem()
        .title("Main Pages")
        .child(
          S.list()
            .title("Main Pages")
            .items([
              S.listItem()
                .title("Home Page")
                .id("homePage")
                .child(
                  S.document()
                    .schemaType("homePage")
                    .documentId("homePageV2")
                    .title("Home Page"),
                ),
              singletonDocument(
                S,
                "aboutPage",
                "About Page Content",
                "aboutPage",
              ),
              singletonDocument(
                S,
                "contactPage",
                "Contact Page Content",
                "contactPage",
              ),
              singletonDocument(
                S,
                "servicesPage",
                "Services Page Content",
                "servicesPage",
              ),
              singletonDocument(
                S,
                "resourcesPage",
                "Resources Page Content",
                "resourcesPage",
              ),
              singletonDocument(
                S,
                "portfolioPage",
                "Portfolio Page Content",
                "portfolioPage",
              ),
              singletonDocument(
                S,
                "industriesPage",
                "Industries Page Content",
                "industriesPage",
              ),
              singletonDocument(
                S,
                "shopPage",
                "Shop Page Content",
                "shopPage",
              ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("E-Commerce Catalog")
        .child(
          S.list()
            .title("E-Commerce Catalog")
            .items([
              documentTypeListItem(S, "product", "Product"),
              documentTypeListItem(S, "category", "Product Category"),
              documentTypeListItem(S, "collection", "Collection"),
              documentTypeListItem(S, "productSize", "Product Size"),
              documentTypeListItem(S, "productFrame", "Framing Option"),
              documentTypeListItem(S, "order", "Orders"),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Core Content")
        .child(
          S.list()
            .title("Core Content")
            .items([
              documentTypeListItem(S, "service", "Services"),
              documentTypeListItem(S, "industry", "Industry"),
              documentTypeListItem(S, "portfolio", "Portfolio Project"),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Editorial & Media")
        .child(
          S.list()
            .title("Editorial & Media")
            .items([
              documentTypeListItem(S, "post", "Insight / Blog Post"),
              documentTypeListItem(S, "founder", "Founder & Story"),
              documentTypeListItem(
                S,
                "downloadResource",
                "Downloadable Resource (PDFs)",
              ),
            ]),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) => !HIDDEN_DOCUMENT_TYPES.has(item.getId() ?? ""),
      ),
    ]);
