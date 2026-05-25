export type CartItemImage = {
  src: string;
  alt: string;
};

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  priceInInr: number;
  quantity: number;
  image?: CartItemImage;
};

export type AddCartItemInput = {
  productId: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  priceInInr: number;
  quantity?: number;
  image?: CartItemImage;
};

export type CartContextValue = {
  isOpen: boolean;
  cartItems: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  addItem: (item: AddCartItemInput) => void;
  totalQuantity: number;
  subtotalLabel: string;
  subtotalInInr: number;
};
