import { getSimilarProducts } from "@/lib/product/similar-products";
import type { ProductShowcaseItem } from "@/types/home";

export async function resolveSimilarProducts(
  currentProductId: string,
  categoryRef?: string | null,
  collectionRef?: string | null,
): Promise<ProductShowcaseItem[]> {
  return getSimilarProducts(currentProductId, categoryRef, collectionRef);
}
