import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Minus, Loader2 } from "lucide-react";
import AdminLayout from "./layout/AdminLayout";
import ProductFormModal from "../../components/admin/ProductFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { useToast } from "../../components/ToastProvider";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  LOW_STOCK_LIMIT,
} from "../../utils/adminStore";
import { formatPKR } from "../../data/products";

const STATUS_FILTERS = ["All", "In Stock", "Low Stock", "Out of Stock"];

function getStatus(stock) {
  if (stock <= 0) return "Out of Stock";
  if (stock <= LOW_STOCK_LIMIT) return "Low Stock";
  return "In Stock";
}

const statusStyles = {
  "In Stock": "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "Low Stock": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Out of Stock": "border-red-500/30 bg-red-500/10 text-red-400",
};

function StockManagement() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadProducts = async () => {
    try {
      const list = await getAllProducts();
      setProducts(list);
    } catch (err) {
      showToast(err.message || "Could not load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        (p.type || "").toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "All" || getStatus(p.stock) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
        showToast(`${payload.name} updated`);
      } else {
        await addProduct(payload);
        showToast(`${payload.name} added to catalogue`);
      }
      await loadProducts();
      setFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      showToast(err.message || "Could not save product", "error");
    }
  };

  const handleQuickStock = async (product, delta) => {
    try {
      const updated = await adjustStock(product._id, delta);
      setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, ...updated } : p)));
      showToast(`${updated.name} stock: ${updated.stock}`);
    } catch (err) {
      showToast(err.message || "Could not update stock", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget._id);
      showToast(`${deleteTarget.name} removed`);
      await loadProducts();
    } catch (err) {
      showToast(err.message || "Could not delete product", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout
      title="Stock & Products"
      subtitle="Add, edit and manage your product inventory."
    >
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
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

        <div className="flex shrink-0 gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-goldLight"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gold/20 bg-[#111]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-gold/15 text-[11px] uppercase tracking-widest text-zinc-500">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-zinc-500">
                    <Loader2 size={20} className="mx-auto animate-spin" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-zinc-500">
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const status = getStatus(p.stock);
                  return (
                    <tr
                      key={p._id || p.id}
                      className="border-b border-gold/10 last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gold/10 bg-black/40">
                            <img
                              src={p.images?.[0]}
                              alt={p.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {p.name}
                            </p>
                            <p className="truncate text-[12px] text-zinc-500">
                              {p.categoryName || p.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gold font-semibold">
                        {formatPKR(p.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuickStock(p, -1)}
                            disabled={p.stock <= 0}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 text-zinc-300 hover:border-gold/50 hover:text-white disabled:opacity-30"
                            aria-label="Decrease stock"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center font-medium text-white">
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleQuickStock(p, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 text-zinc-300 hover:border-gold/50 hover:text-white"
                            aria-label="Increase stock"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full border px-3 py-1 text-[11px] font-semibold ${statusStyles[status]}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/20 text-zinc-300 hover:border-gold/50 hover:text-gold"
                            aria-label="Edit product"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 text-red-400/80 hover:border-red-500/50 hover:text-red-400"
                            aria-label="Delete product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-zinc-600">
        Showing {filtered.length} of {products.length} products.
      </p>

      <ProductFormModal
        open={formOpen}
        product={editingProduct}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this product?"
        message={`"${deleteTarget?.name}" will be permanently removed from the catalogue. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}

export default StockManagement;
