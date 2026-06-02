export const ALL_ORDERS_QUERY = `*[_type == "order"] | order(_createdAt desc) {
  _id,
  orderId,
  customerName,
  email,
  phone,
  shippingAddress,
  totalAmount,
  orderStatus,
  paymentStatus,
  awbNumber,
  courierName,
  "items": items[]{
    productName,
    quantity,
    price
  },
  _createdAt
}`;
