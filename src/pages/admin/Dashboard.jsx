import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  Package,
  AlertTriangle,
  XCircle,
  Wallet,
  Star,
  ArrowRight,
} from "lucide-react";
import AdminLayout from "./layout/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import { getStats, LOW_STOCK_LIMIT } from "../../utils/adminStore";
import { formatPKR } from "../../data/products";
import { useAdminAuth } from "../../context/AdminAuthContext";

function Dashboard() {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState(() => getStats());

  useEffect(() => {
    setStats(getStats());
  }, []);

  return (
    <AdminLayout
      title={`Welcome back, ${admin?.name?.split(" ")[0] || "Admin"}`}
      subtitle="Here's what's happening with your store today."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          tone="gold"
        />
        <StatCard
          icon={Boxes}
          label="Total Stock Units"
          value={stats.totalStockUnits}
          tone="gold"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={stats.lowStockCount}
          hint={`${LOW_STOCK_LIMIT} units or fewer`}
          tone="amber"
        />
        <StatCard
          icon={XCircle}
          label="Out of Stock"
          value={stats.outOfStockCount}
          tone="red"
        />
        <StatCard
          icon={Wallet}
          label="Inventory Value"
          value={formatPKR(stats.inventoryValue)}
          tone="green"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={stats.avgRating.toFixed(1)}
          tone="gold"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Low stock */}
        <div className="rounded-2xl border border-gold/20 bg-[#111] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-prim text-lg font-bold text-white">
              Low Stock Alerts
            </h2>
            <Link
              to="/admin/stock"
              className="flex items-center gap-1 text-[12px] font-medium text-gold hover:text-goldLight"
            >
              Manage Stock <ArrowRight size={14} />
            </Link>
          </div>

          {stats.lowStockItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No products are running low right now.
            </p>
          ) : (
            <ul className="space-y-3">
              {stats.lowStockItems.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {p.name}
                    </p>
                    <p className="text-[12px] text-zinc-500">{p.type}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Out of stock */}
        <div className="rounded-2xl border border-gold/20 bg-[#111] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-prim text-lg font-bold text-white">
              Out of Stock
            </h2>
            <Link
              to="/admin/stock"
              className="flex items-center gap-1 text-[12px] font-medium text-gold hover:text-goldLight"
            >
              Restock Now <ArrowRight size={14} />
            </Link>
          </div>

          {stats.outOfStockItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              Every product currently has stock available.
            </p>
          ) : (
            <ul className="space-y-3">
              {stats.outOfStockItems.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {p.name}
                    </p>
                    <p className="text-[12px] text-zinc-500">{p.type}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-400">
                    Sold Out
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
