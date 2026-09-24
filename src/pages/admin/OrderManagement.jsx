import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, X, Package } from "lucide-react";
import AdminLayout from "./layout/AdminLayout";
import { useToast } from "../../components/ToastProvider";
import { getOrders, updateOrderStatus } from "../../api/orders.api";
import { formatPKR } from "../../data/products";

const STATUS_FILTERS = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusStyles = {
  Pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  Processing: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  Shipped: "border-indigo-400/30 bg-indigo-400/10 text-indigo-300",
  Delivered: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Cancelled: "border-red-500/30 bg-red-500/10 text-red-400",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function OrderManagement() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadOrders = async () => {
    try {
      const res = await getOrders({ limit: 200 });
      setOrders(res.orders);
    } catch (err) {
      showToast(err.message || "Could not load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.mobile.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (order, newStatus) => {
    setUpdatingStatus(true);
    try {
      const updated = await updateOrderStatus(order._id, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      if (selectedOrder?._id === updated._id) setSelectedOrder(updated);
      showToast(`${order.orderNumber} marked as ${newStatus}`);
    } catch (err) {
      showToast(err.message || "Could not update status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <AdminLayout title="Orders" subtitle="View and manage customer orders.">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, name, email, phone..."
            className="input-gold w-full rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder-zinc-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-all duration-200 ${
                statusFilter === s
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-gold/15 text-zinc-400 hover:border-gold/40 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gold/20 bg-[#111]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-gold/15 text-[11px] uppercase tracking-widest text-zinc-500">
                <th className="px-6 py-4 font-medium">Order #</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-zinc-500">
                    <Loader2 size={20} className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-zinc-500">
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr
                    key={o._id}
                    onClick={() => setSelectedOrder(o)}
                    className="cursor-pointer border-b border-gold/10 last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-medium text-gold">{o.orderNumber}</td>
                    <td className="px-6 py-4">
                      <p className="text-white">{o.customer.fullName}</p>
                      <p className="text-[12px] text-zinc-500">{o.customer.mobile}</p>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {o.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {formatPKR(o.total)}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{formatDate(o.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full border px-3 py-1 text-[11px] font-semibold ${statusStyles[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-zinc-600">
        Showing {filtered.length} of {orders.length} orders.
      </p>

      {/* Detail drawer */}
      {selectedOrder && (
        <>
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-gold/20 bg-[#111] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gold">
                  {selectedOrder.orderNumber}
                </p>
                <h3 className="font-prim text-lg font-bold text-white">Order Details</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-500 hover:text-gold"
              >
                <X size={20} />
              </button>
            </div>

            {/* Status control */}
            <div className="mb-6 rounded-xl border border-gold/15 bg-black/30 p-4">
              <p className="mb-2 text-[11px] uppercase tracking-widest text-zinc-400">
                Update Status
              </p>
              <select
                value={selectedOrder.status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(selectedOrder, e.target.value)}
                className="input-gold w-full rounded-lg px-3 py-2.5 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {selectedOrder.status !== "Cancelled" && (
                <p className="mt-2 text-[11px] text-zinc-600">
                  Setting to "Cancelled" automatically restocks all items in this order.
                </p>
              )}
            </div>

            {/* Customer info */}
            <div className="mb-6">
              <p className="mb-2 text-[11px] uppercase tracking-widest text-zinc-400">
                Customer
              </p>
              <div className="space-y-1 rounded-xl border border-gold/15 bg-black/30 p-4 text-sm text-zinc-300">
                <p className="font-medium text-white">{selectedOrder.customer.fullName}</p>
                <p>{selectedOrder.customer.mobile}</p>
                <p>{selectedOrder.customer.email}</p>
                <p>
                  {selectedOrder.customer.address}, {selectedOrder.customer.city} —{" "}
                  {selectedOrder.customer.postalCode}
                </p>
                {selectedOrder.customer.notes && (
                  <p className="mt-2 text-zinc-500">Note: {selectedOrder.customer.notes}</p>
                )}
                <p className="mt-2 text-[12px] uppercase tracking-widest text-gold/80">
                  Payment: {selectedOrder.paymentMethod === "jazzcash" ? "JazzCash" : "Cash on Delivery"}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <p className="mb-2 text-[11px] uppercase tracking-widest text-zinc-400">
                Items
              </p>
              <div className="space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-gold/15 bg-black/30 p-3"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gold/10 bg-black/40">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Package size={18} className="text-zinc-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">{item.name}</p>
                      <p className="text-[12px] text-zinc-500">
                        {item.size ? `${item.size} · ` : ""}Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gold">
                      {formatPKR(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t border-gold/10 pt-4 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Items Subtotal</span>
                <span className="text-zinc-200">{formatPKR(selectedOrder.itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Delivery Charges</span>
                <span className="text-zinc-200">
                  {selectedOrder.deliveryCharge === 0 ? "Free" : formatPKR(selectedOrder.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-base font-semibold">
                <span className="text-zinc-300">Grand Total</span>
                <span className="text-gold">{formatPKR(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default OrderManagement;
