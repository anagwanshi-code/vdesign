import {
  getQuantityValidationMessage,
  isQuantityValidForSaleType,
  normalizeMoq,
} from "@/lib/commerce/moq";
import { normalizeSaleType } from "@/lib/commerce/sale-type";
import {
  calculateOrderTotals,
  labelOrderTotals,
  type OrderTotals,
  type OrderTotalsLabels,
} from "@/lib/checkout/totals";
import {
  DEFAULT_SHIPPING_CONFIG,
  shippingConfigToTotalsOptions,
  type ShippingConfig,
} from "@/lib/checkout/shipping";
import { OPEN_CART_EVENT } from "@/lib/cart/events";
import type { AddCartItemInput, CartItem } from "@/types/cart";
import { create } from "zustand";

function createCartItemId(productId: string, variantKey?: string): string {
  return variantKey ? `cart-${productId}-${variantKey}` : `cart-${productId}`;
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function normalizeCartQuantity(
  quantity: number,
  minOrderQuantity: number,
  saleType: AddCartItemInput["saleType"],
): number {
  const moq = normalizeMoq(minOrderQuantity);
  const normalizedSaleType = normalizeSaleType(saleType);
  let next = Math.max(moq, Math.floor(quantity));

  if (normalizedSaleType === "bulk" && moq > 1) {
    next = Math.max(moq, Math.ceil(next / moq) * moq);
  }

  return next;
}

type CartStoreState = {
  items: CartItem[];
  isOpen: boolean;
  shippingConfig: ShippingConfig;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
  setShippingConfig: (config: ShippingConfig) => void;
};

export const useCartStore = create<CartStoreState>((set, get) => ({
  items: [],
  isOpen: false,
  shippingConfig: DEFAULT_SHIPPING_CONFIG,

  addItem: (item) => {
    const minOrderQuantity = normalizeMoq(item.minOrderQuantity);
    const saleType = normalizeSaleType(item.saleType);
    const quantity = normalizeCartQuantity(
      item.quantity ?? minOrderQuantity,
      minOrderQuantity,
      saleType,
    );

    set((state) => {
      const lineId = createCartItemId(item.productId, item.variantKey);
      const existingIndex = state.items.findIndex((entry) => entry.id === lineId);

      if (existingIndex === -1) {
        return {
          items: [
            ...state.items,
            {
              id: lineId,
              productId: item.productId,
              variantKey: item.variantKey,
              title: item.title,
              subtitle: item.subtitle,
              priceLabel: item.priceLabel,
              priceInInr: item.priceInInr,
              baseUnitPriceInInr: item.baseUnitPriceInInr,
              volumeDiscountPercent: item.volumeDiscountPercent,
              premiumAddons: item.premiumAddons,
              quantity,
              saleType,
              minOrderQuantity,
              sku: item.sku,
              sizeLabel: item.sizeLabel,
              frameLabel: item.frameLabel,
              logoFileName: item.logoFileName,
              uploadInstructions: item.uploadInstructions,
              image: item.image,
            },
          ],
        };
      }

      return {
        items: state.items.map((entry, index) =>
          index === existingIndex
            ? {
                ...entry,
                quantity: entry.quantity + quantity,
                priceInInr: item.priceInInr,
                priceLabel: item.priceLabel,
                baseUnitPriceInInr: item.baseUnitPriceInInr,
                volumeDiscountPercent: item.volumeDiscountPercent,
                premiumAddons: item.premiumAddons ?? entry.premiumAddons,
                logoFileName: item.logoFileName ?? entry.logoFileName,
                uploadInstructions:
                  item.uploadInstructions ?? entry.uploadInstructions,
              }
            : entry,
        ),
      };
    });
  },

  removeItem: (lineId) => {
    set((state) => ({
      items: state.items.filter((entry) => entry.id !== lineId),
    }));
  },

  updateQuantity: (lineId, quantity) => {
    set((state) => ({
      items: state.items.map((entry) => {
        if (entry.id !== lineId) {
          return entry;
        }

        return {
          ...entry,
          quantity: normalizeCartQuantity(
            quantity,
            entry.minOrderQuantity,
            entry.saleType,
          ),
        };
      }),
    }));
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  clearCart: () => set({ items: [] }),
  setShippingConfig: (config) => set({ shippingConfig: config }),
}));

export function selectSubtotalInInr(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceInInr * item.quantity, 0);
}

export function selectTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectMoqValidation(items: CartItem[]): {
  meetsMoqForCheckout: boolean;
  moqMessage: string | null;
} {
  const failingItem = items.find(
    (item) =>
      !isQuantityValidForSaleType(
        item.quantity,
        item.minOrderQuantity,
        item.saleType,
      ),
  );

  if (!failingItem) {
    return { meetsMoqForCheckout: items.length > 0, moqMessage: null };
  }

  return {
    meetsMoqForCheckout: false,
    moqMessage: `${failingItem.title}: ${getQuantityValidationMessage(
      failingItem.minOrderQuantity,
      failingItem.saleType,
    )}`,
  };
}

export function selectSubtotalLabel(items: CartItem[]): string {
  return formatInr(selectSubtotalInInr(items));
}

export function selectOrderTotals(
  items: CartItem[],
  shippingConfig: ShippingConfig = DEFAULT_SHIPPING_CONFIG,
): OrderTotals {
  return calculateOrderTotals(
    selectSubtotalInInr(items),
    shippingConfigToTotalsOptions(shippingConfig),
  );
}

export function selectOrderTotalsLabels(
  items: CartItem[],
  shippingConfig: ShippingConfig = DEFAULT_SHIPPING_CONFIG,
): OrderTotalsLabels {
  return labelOrderTotals(selectOrderTotals(items, shippingConfig));
}

export type { ShippingConfig };
export { DEFAULT_SHIPPING_CONFIG };

if (typeof window !== "undefined") {
  window.addEventListener(OPEN_CART_EVENT, () => {
    useCartStore.getState().openCart();
  });
}
