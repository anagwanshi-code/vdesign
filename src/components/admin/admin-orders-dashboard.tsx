"use client";

import {
  formatOrderDate,
  getPendingDispatchLabel,
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
  Package,
  Phone,
  Truck,
  User,
  X,
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

const dispatchInputClass =
  "h-11 w-full border border-gray-200 bg-white px-3 font-sans text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-pink-600 focus:ring-1 focus:ring-pink-600/20";

const dispatchSubmitClass = cn(
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-6 font-sans text-sm font-bold uppercase tracking-[0.12em] text-white transition-all duration-300",
  "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-pink-500 hover:to-rose-400 hover:shadow-[0_8px_25px_rgb(225,29,72,0.35)]",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none",
);

export function AdminOrdersDashboard({ initialOrders }: AdminOrdersDashboardProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<TabId>("pending");
  const [drafts, setDrafts] = useState<Record<string, DispatchDraft>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  const closeDispatchForm = (orderId: string) => {
    setExpandedOrderId((current) => (current === orderId ? null : current));
    setDrafts((current) => {
      const next = { ...current };
      delete next[orderId];
      return next;
    });
  };

  const handleDispatch = async (order: AdminOrder) => {
    const draft = drafts[order._id] ?? { courierName: "", awbNumber: "" };
    const courierName = draft.courierName.trim();
    const awbNumber = draft.awbNumber.trim();

    if (!courierName || !awbNumber) {
      toast.error("Courier company name and tracking number are required.");
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

      closeDispatchForm(order._id);

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
      <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
        <TabButton
          active={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
          icon={Clock}
          label="Awaiting dispatch"
          count={pendingOrders.length}
        />
        <TabButton
          active={activeTab === "dispatched"}
          onClick={() => setActiveTab("dispatched")}
          icon={Truck}
          label="Dispatched"
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
                isExpanded={expandedOrderId === order._id}
                isLoading={loadingId === order._id}
                onDraftChange={updateDraft}
                onOpenForm={() => setExpandedOrderId(order._id)}
                onCloseForm={() => closeDispatchForm(order._id)}
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
        "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none",
        active
          ? "bg-gray-900 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs tabular-nums",
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({ tab }: { tab: TabId }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <Package className="mx-auto h-10 w-10 text-gray-300" aria-hidden="true" />
      <p className="mt-4 font-serif text-lg text-gray-800">
        {tab === "pending" ? "No orders awaiting dispatch" : "No dispatched orders yet"}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        {tab === "pending"
          ? "Paid and processing orders will appear here."
          : "Dispatched orders will show tracking details here."}
      </p>
    </div>
  );
}

function PendingOrderCard({
  order,
  draft,
  isExpanded,
  isLoading,
  onDraftChange,
  onOpenForm,
  onCloseForm,
  onDispatch,
}: {
  order: AdminOrder;
  draft: DispatchDraft;
  isExpanded: boolean;
  isLoading: boolean;
  onDraftChange: (id: string, field: keyof DispatchDraft, value: string) => void;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onDispatch: () => void;
}) {
  const statusLabel = getPendingDispatchLabel(order);
  const badgeClass =
    statusLabel === "Processing"
      ? "bg-sky-50 text-sky-800"
      : "bg-amber-50 text-amber-800";

  return (
    <li className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <OrderCardHeader order={order} badge={statusLabel} badgeClass={badgeClass} />
      <OrderItemsSection order={order} />

      <div className="border-t border-gray-100 px-5 py-4 md:px-6">
        {!isExpanded ? (
          <button
            type="button"
            onClick={onOpenForm}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-pink-600 bg-white py-3 font-sans text-sm font-bold uppercase tracking-[0.14em] text-pink-600 transition-colors hover:bg-pink-50 sm:w-auto sm:px-8",
            )}
          >
            <Truck className="h-4 w-4" aria-hidden="true" />
            Mark as Dispatched
          </button>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-gray-900">
                  Dispatch details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter courier and tracking information for {order.orderId}.
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseForm}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close dispatch form"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Courier company name
                  <span className="text-pink-600"> *</span>
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. DTDC, Delhivery, Blue Dart"
                  value={draft.courierName}
                  onChange={(event) =>
                    onDraftChange(order._id, "courierName", event.target.value)
                  }
                  className={dispatchInputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Tracking number / AWB
                  <span className="text-pink-600"> *</span>
                </span>
                <input
                  type="text"
                  required
                  placeholder="AWB or tracking ID"
                  value={draft.awbNumber}
                  onChange={(event) =>
                    onDraftChange(order._id, "awbNumber", event.target.value)
                  }
                  className={dispatchInputClass}
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                disabled={isLoading}
                onClick={onDispatch}
                className={cn(dispatchSubmitClass, "w-full sm:w-auto")}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Truck className="h-4 w-4" aria-hidden="true" />
                )}
                Confirm Dispatch
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={onCloseForm}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 font-sans text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

function DispatchedOrderCard({ order }: { order: AdminOrder }) {
  return (
    <li className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <OrderCardHeader
        order={order}
        badge={order.orderStatus === "Delivered" ? "Delivered" : "Dispatched"}
        badgeClass="bg-emerald-50 text-emerald-800"
      />
      <OrderItemsSection order={order} />
      <div className="flex flex-wrap gap-4 border-t border-gray-100 bg-emerald-50/40 px-5 py-4 text-sm md:px-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Truck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span>
            Courier: <strong>{order.courierName ?? "—"}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
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
    <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 md:flex-row md:items-start md:justify-between md:px-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-serif text-lg text-gray-900">{order.orderId}</p>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              badgeClass,
            )}
          >
            {badge}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">{formatOrderDate(order._createdAt)}</p>
      </div>
      <p className="text-right text-lg font-bold tabular-nums text-gray-900">
        {formatInr(order.totalAmount ?? 0)}
      </p>
    </div>
  );
}

function OrderItemsSection({ order }: { order: AdminOrder }) {
  const items = order.items ?? [];

  return (
    <div className="grid gap-4 px-5 py-4 md:grid-cols-2 md:px-6 lg:grid-cols-3">
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-start gap-2">
          <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
          <span>
            <span className="font-medium text-gray-900">{order.customerName}</span>
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
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
          <span>{order.shippingAddress}</span>
        </p>
      </div>
      <div className="md:col-span-2">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Items ({items.length})
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Qty</th>
                <th className="px-3 py-2 font-medium text-right">Line total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.productName}-${index}`} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-gray-800">{item.productName}</td>
                  <td className="px-3 py-2 text-gray-600">{item.quantity}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-gray-900">
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
