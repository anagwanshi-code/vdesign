"use client";

import {
  formatOrderDate,
  isDispatchedOrder,
  isPendingDispatchOrder,
} from "@/lib/admin/orders";
import { formatInr } from "@/lib/checkout/totals";
import { cn } from "@/lib/utils/cn";
import type { AdminOrder } from "@/types/admin-order";
import type { OrderDispatchErrorResponse } from "@/types/order-dispatch";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Package,
  Send,
  Truck,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type AdminOrdersDashboardProps = {
  initialOrders: AdminOrder[];
};

type TabId = "pending" | "dispatched";

type DispatchDraft = {
  courierName: string;
  awbNumber: string;
};

export function AdminOrdersDashboard({ initialOrders }: AdminOrdersDashboardProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<TabId>("pending");
  const [drafts, setDrafts] = useState<Record<string, DispatchDraft>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const pendingOrders = useMemo(
    () => orders.filter(isPendingDispatchOrder),
    [orders],
  );
  const dispatchedOrders = useMemo(
    () => orders.filter(isDispatchedOrder),
    [orders],
  );

  const updateDraft = (orderId: string, field: keyof DispatchDraft, value: string) => {
    setDrafts((current) => ({
      ...current,
      [orderId]: {
        courierName: current[orderId]?.courierName ?? "",
        awbNumber: current[orderId]?.awbNumber ?? "",
        [field]: value,
      },
    }));
  };

  const handleDispatch = async (order: AdminOrder) => {
    const draft = drafts[order._id] ?? { courierName: "", awbNumber: "" };
    const courierName = draft.courierName.trim();
    const awbNumber = draft.awbNumber.trim();

    if (!courierName || !awbNumber) {
      toast.error("Enter courier name and tracking number (AWB)");
      return;
    }

    setLoadingId(order._id);

    try {
      const response = await fetch("/api/admin/order-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sanityDocumentId: order._id,
          awbNumber,
          courierName,
          customerEmail: order.email,
          customerName: order.customerName,
          orderId: order.orderId,
        }),
      });

      const payload = (await response.json()) as
        | { success?: boolean; message?: string }
        | OrderDispatchErrorResponse;

      if (!response.ok) {
        toast.error(
          "error" in payload ? payload.error : "Failed to mark order as dispatched",
        );
        return;
      }

      setOrders((current) =>
        current.map((entry) =>
          entry._id === order._id
            ? {
                ...entry,
                orderStatus: "Dispatched",
                awbNumber,
                courierName,
              }
            : entry,
        ),
      );

      setDrafts((current) => {
        const next = { ...current };
        delete next[order._id];
        return next;
      });

      toast.success(
        "message" in payload && payload.message
          ? payload.message
          : "Order dispatched and customer notified",
      );
      setActiveTab("dispatched");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const visibleOrders =
    activeTab === "pending" ? pendingOrders : dispatchedOrders;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-sm">
        <TabButton
          active={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
          icon={Clock}
          label="Pending dispatch"
          count={pendingOrders.length}
        />
        <TabButton
          active={activeTab === "dispatched"}
          onClick={() => setActiveTab("dispatched")}
          icon={Truck}
          label="Dispatched / completed"
          count={dispatchedOrders.length}
        />
      </div>

      {visibleOrders.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <ul className="space-y-4">
          {visibleOrders.map((order) =>
            activeTab === "pending" ? (
              <PendingOrderCard
                key={order._id}
                order={order}
                draft={drafts[order._id] ?? { courierName: "", awbNumber: "" }}
                isLoading={loadingId === order._id}
                onDraftChange={updateDraft}
                onDispatch={() => handleDispatch(order)}
              />
            ) : (
              <DispatchedOrderCard key={order._id} order={order} />
            ),
          )}
        </ul>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Clock;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none",
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs tabular-nums",
          active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-700",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({ tab }: { tab: TabId }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
      <Package className="mx-auto h-10 w-10 text-zinc-300" aria-hidden="true" />
      <p className="mt-4 font-serif text-lg text-zinc-800">
        {tab === "pending" ? "No orders awaiting dispatch" : "No dispatched orders yet"}
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        {tab === "pending"
          ? "New paid orders will appear here automatically."
          : "Dispatched orders will show tracking details here."}
      </p>
    </div>
  );
}

function PendingOrderCard({
  order,
  draft,
  isLoading,
  onDraftChange,
  onDispatch,
}: {
  order: AdminOrder;
  draft: DispatchDraft;
  isLoading: boolean;
  onDraftChange: (id: string, field: keyof DispatchDraft, value: string) => void;
  onDispatch: () => void;
}) {
  return (
    <li className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <OrderCardHeader order={order} badge="Awaiting dispatch" badgeClass="bg-amber-50 text-amber-800" />
      <OrderItemsSection order={order} />
      <div className="border-t border-zinc-100 bg-zinc-50/80 px-5 py-4 md:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Dispatch details
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-600">Courier name</span>
            <input
              type="text"
              placeholder="e.g. DTDC, Shiprocket"
              value={draft.courierName}
              onChange={(event) =>
                onDraftChange(order._id, "courierName", event.target.value)
              }
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[#0088A9] focus:ring-1 focus:ring-[#0088A9]"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-600">Tracking number (AWB)</span>
            <input
              type="text"
              placeholder="AWB / tracking ID"
              value={draft.awbNumber}
              onChange={(event) =>
                onDraftChange(order._id, "awbNumber", event.target.value)
              }
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[#0088A9] focus:ring-1 focus:ring-[#0088A9]"
            />
          </label>
          <button
            type="button"
            disabled={isLoading}
            onClick={onDispatch}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#E91E63] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#d41857] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            Mark as dispatched
          </button>
        </div>
      </div>
    </li>
  );
}

function DispatchedOrderCard({ order }: { order: AdminOrder }) {
  return (
    <li className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <OrderCardHeader
        order={order}
        badge={order.orderStatus === "Delivered" ? "Delivered" : "Dispatched"}
        badgeClass="bg-emerald-50 text-emerald-800"
      />
      <OrderItemsSection order={order} />
      <div className="flex flex-wrap gap-4 border-t border-zinc-100 bg-emerald-50/40 px-5 py-4 text-sm md:px-6">
        <div className="flex items-center gap-2 text-zinc-700">
          <Truck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span>
            <strong>{order.courierName ?? "—"}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span>
            AWB: <strong className="font-mono">{order.awbNumber ?? "—"}</strong>
          </span>
        </div>
      </div>
    </li>
  );
}

function OrderCardHeader({
  order,
  badge,
  badgeClass,
}: {
  order: AdminOrder;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-100 px-5 py-5 md:flex-row md:items-start md:justify-between md:px-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-serif text-lg text-zinc-900">{order.orderId}</p>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              badgeClass,
            )}
          >
            {badge}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">{formatOrderDate(order._createdAt)}</p>
      </div>
      <p className="text-right font-semibold text-lg text-zinc-900 tabular-nums">
        {formatInr(order.totalAmount ?? 0)}
      </p>
    </div>
  );
}

function OrderItemsSection({ order }: { order: AdminOrder }) {
  const items = order.items ?? [];

  return (
    <div className="grid gap-4 px-5 py-4 md:grid-cols-2 md:px-6 lg:grid-cols-3">
      <div className="space-y-2 text-sm text-zinc-600">
        <p className="flex items-start gap-2">
          <User className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <span>
            <span className="font-medium text-zinc-900">{order.customerName}</span>
            <br />
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3 w-3" aria-hidden="true" />
              {order.email}
            </span>
            <br />
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3" aria-hidden="true" />
              {order.phone?.trim() || "—"}
            </span>
          </span>
        </p>
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <span>{order.shippingAddress}</span>
        </p>
      </div>
      <div className="md:col-span-2">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Items ({items.length})
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-100">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Qty</th>
                <th className="px-3 py-2 font-medium text-right">Line total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.productName}-${index}`} className="border-t border-zinc-100">
                  <td className="px-3 py-2 text-zinc-800">{item.productName}</td>
                  <td className="px-3 py-2 text-zinc-600">{item.quantity}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-zinc-900">
                    {formatInr((item.price ?? 0) * (item.quantity ?? 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
