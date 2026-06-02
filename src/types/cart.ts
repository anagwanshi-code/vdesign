import type { ProductSaleType } from "@/lib/commerce/sale-type";
import type {
  OrderTotals,
  OrderTotalsLabels,
} from "@/lib/checkout/totals";

export type CartItemImage = {
  src: string;
  alt: string;
};

export type CartPremiumAddon = {
  addonName: string;
  extraPrice: number;
};

export type CartItem = {
  id: string;
  productId: string;
  variantKey?: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  /** Final unit price after volume discount and add-ons. */
  priceInInr: number;
  baseUnitPriceInInr?: number;
  volumeDiscountPercent?: number;
  premiumAddons?: CartPremiumAddon[];
  quantity: number;
  saleType: ProductSaleType;
  minOrderQuantity: number;
  sku?: string;
  sizeLabel?: string;
  frameLabel?: string;
  logoFileName?: string;
  uploadInstructions?: string;
  image?: CartItemImage;
};

export type AddCartItemInput = {
  productId: string;
  variantKey?: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  priceInInr: number;
  baseUnitPriceInInr?: number;
  volumeDiscountPercent?: number;
  premiumAddons?: CartPremiumAddon[];
  quantity?: number;
  saleType?: ProductSaleType;
  minOrderQuantity?: number;
  sku?: string;
  sizeLabel?: string;
  frameLabel?: string;
  logoFileName?: string;
  uploadInstructions?: string;
  image?: CartItemImage;
};

export type CartContextValue = {
  isOpen: boolean;
  cartItems: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  totalQuantity: number;
  subtotalLabel: string;
  subtotalInInr: number;
  orderTotals: OrderTotals;
  orderTotalsLabels: OrderTotalsLabels;
  estimatedTotalInInr: number;
  estimatedTotalLabel: string;
  meetsMoqForCheckout: boolean;
  moqMessage: string | null;
};
