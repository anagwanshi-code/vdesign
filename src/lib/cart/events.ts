export const OPEN_CART_EVENT = "open-cart";

export function dispatchOpenCart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_CART_EVENT));
  }
}
