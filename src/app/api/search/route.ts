import {
  filterCatalogProducts,
  resolveAllCatalogProducts,
} from "@/lib/data/catalog";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ products: [], source: "mock" });
  }

  const { products, source } = await resolveAllCatalogProducts();
  const results = filterCatalogProducts(products, query).slice(0, 12);

  return NextResponse.json({ products: results, source });
}
