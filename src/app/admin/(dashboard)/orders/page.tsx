import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { AdminOrdersDashboard } from "@/components/admin/admin-orders-dashboard";
import { client } from "@/sanity/lib/client";
import { ALL_ORDERS_QUERY } from "@/sanity/lib/queries/orders";
import type { AdminOrder } from "@/types/admin-order";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Dispatch",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: AdminOrder[] = [];

  try {
    orders = await client.fetch<AdminOrder[]>(ALL_ORDERS_QUERY);
  } catch (error) {
    console.error("[admin/orders] Failed to fetch orders:", error);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-zinc-900">Order dispatch</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Manage paid orders awaiting shipment and review dispatched consignments.
          </p>
        </div>
        <AdminLogoutButton />
      </div>
      <AdminOrdersDashboard initialOrders={orders} />
    </div>
  );
}
