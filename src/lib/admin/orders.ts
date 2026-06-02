import type { AdminOrder } from "@/types/admin-order";

export function isPendingDispatchOrder(order: AdminOrder): boolean {
  if (order.orderStatus === "Paid") {
    return true;
  }

  return !order.orderStatus && order.paymentStatus === "Paid";
}

export function isDispatchedOrder(order: AdminOrder): boolean {
  return order.orderStatus === "Dispatched" || order.orderStatus === "Delivered";
}

export function formatOrderDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
