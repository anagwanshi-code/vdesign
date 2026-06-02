import { defineField, defineType } from "sanity";

const PAYMENT_STATUS_OPTIONS = [
  { title: "Pending", value: "Pending" },
  { title: "Paid", value: "Paid" },
  { title: "Failed", value: "Failed" },
] as const;

const ORDER_STATUS_OPTIONS = [
  { title: "Paid", value: "Paid" },
  { title: "Processing", value: "Processing" },
  { title: "Dispatched", value: "Dispatched" },
  { title: "Delivered", value: "Delivered" },
] as const;

export const order = defineType({
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
      description: "Unique reference (e.g. ORD-1234)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "text",
      description: "Full combined address from checkout",
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount (INR)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "orderLineItem",
          title: "Line Item",
          fields: [
            defineField({
              name: "productName",
              title: "Product Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "price",
              title: "Price (INR)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              productName: "productName",
              quantity: "quantity",
              price: "price",
            },
            prepare({ productName, quantity, price }) {
              return {
                title: productName || "Line item",
                subtitle:
                  quantity != null && price != null
                    ? `Qty ${quantity} · ₹${price}`
                    : undefined,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [...PAYMENT_STATUS_OPTIONS],
        layout: "radio",
      },
      initialValue: "Pending",
    }),
    defineField({
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [...ORDER_STATUS_OPTIONS],
        layout: "radio",
      },
      initialValue: "Paid",
    }),
    defineField({
      name: "razorpayOrderId",
      title: "Razorpay Order ID",
      type: "string",
    }),
    defineField({
      name: "razorpayPaymentId",
      title: "Razorpay Payment ID",
      type: "string",
    }),
    defineField({
      name: "awbNumber",
      title: "AWB Number",
      type: "string",
      description: "Courier tracking number (Air Waybill)",
    }),
    defineField({
      name: "courierName",
      title: "Courier Name",
      type: "string",
      description: "Shipping carrier (e.g. Delhivery, Blue Dart)",
    }),
  ],
  preview: {
    select: {
      orderId: "orderId",
      customerName: "customerName",
      orderStatus: "orderStatus",
      paymentStatus: "paymentStatus",
      totalAmount: "totalAmount",
    },
    prepare({ orderId, customerName, orderStatus, paymentStatus, totalAmount }) {
      const amountLabel =
        totalAmount != null ? `₹${totalAmount}` : undefined;
      return {
        title: orderId || "Order",
        subtitle: [customerName, orderStatus ?? paymentStatus, amountLabel]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
