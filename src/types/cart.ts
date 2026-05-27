import type { ProductSaleType } from "@/lib/commerce/sale-type";

export type CartItemImage = {
  src: string;
  alt: string;
};

export type CartItem = {
  id: string;
  productId: string;
  variantKey?: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  priceInInr: number;
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
  clearCart: () => void;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (lineId: string) => void;
  totalQuantity: number;
  subtotalLabel: string;
  subtotalInInr: number;
  meetsMoqForCheckout: boolean;
  moqMessage: string | null;
};
