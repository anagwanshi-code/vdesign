import type { AdminOrder } from "@/types/admin-order";

export function isPendingDispatchOrder(order: AdminOrder): boolean {
  const status = order.orderStatus?.trim();

  if (status === "Paid" || status === "Processing") {
    return true;
  }

  return !status && order.paymentStatus === "Paid";
}

export function getPendingDispatchLabel(order: AdminOrder): string {
  const status = order.orderStatus?.trim();
  if (status === "Processing") {
    return "Processing";
  }
  return "Paid";
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
