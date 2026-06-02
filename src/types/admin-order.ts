export type AdminOrderLineItem = {
  productName: string;
  quantity: number;
  price: number;
};

export type AdminOrder = {
  _id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone?: string | null;
  shippingAddress: string;
  totalAmount: number;
  orderStatus?: string | null;
  paymentStatus?: string | null;
  awbNumber?: string | null;
  courierName?: string | null;
  items?: AdminOrderLineItem[] | null;
  _createdAt: string;
};
