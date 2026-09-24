import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Save, ImagePlus, Tag } from "lucide-react";
import AdminLayout from "./layout/AdminLayout";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { useToast } from "../../components/ToastProvider";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../../utils/adminStore";

function CategoryFormModal({ open, category, onClose, onSubmit }) {
  const isEdit = !!category;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(category?.name || "");
    setDescription(category?.description || "");
    setImageFile(null);
    setError("");
  }, [open, category]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), imageFile });
    } catch (err) {
      setError(err.message || "Could not save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
      <div className="fixed inset-x-0 top-[10%] z-50 mx-auto w-[92%] max-w-md rounded-2xl border border-gold/25 bg-[#111] p-6 shadow-2xl shadow-black/60">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-prim text-xl font-bold text-white">
            {isEdit ? "Edit Category" : "Add Category"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-gold" aria-label="Close">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
              Category Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Eau de Parfum"
              className="input-gold w-full rounded-xl px-4 py-2.5 text-sm placeholder-zinc-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
              Description <span className="text-zinc-600">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Long-lasting signature fragrances"
              className="input-gold w-full rounded-xl px-4 py-2.5 text-sm placeholder-zinc-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-clamp-label uppercase tracking-widest text-zinc-400">
              Category Image <span className="text-zinc-600">(optional)</span>
            </label>
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gold/30 px-4 py-2.5 text-xs font-medium text-zinc-400 hover:border-gold/60 hover:text-gold">
              <ImagePlus size={15} />
              {imageFile ? imageFile.name : "Choose image"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {category?.image && !imageFile && (
              <img
                src={category.image}
                alt=""
                className="mt-3 h-16 w-16 rounded-lg border border-gold/15 object-cover"
              />
            )}
          </div>

          {error && <p className="text-[12px] text-red-400">{error}</p>}

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gold/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-300 hover:border-gold/50 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black hover:bg-goldLight disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isEdit ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function CategoryManagement() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCategories = async () => {
    try {
      const list = await getCategories();
      setCategories(list);
    } catch (err) {
      showToast(err.message || "Could not load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (payload) => {
    if (editingCategory) {
      await updateCategory(editingCategory._id, payload);
      showToast(`${payload.name} updated`);
    } else {
      await addCategory(payload);
      showToast(`${payload.name} added`);
    }
    await loadCategories();
    setFormOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget._id);
      showToast(`${deleteTarget.name} removed`);
      await loadCategories();
    } catch (err) {
      showToast(err.message || "Could not delete category", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout title="Categories" subtitle="Organize your product catalogue into categories.">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-black hover:bg-goldLight"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gold" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-gold/20 bg-[#111] py-20 text-center text-zinc-500">
          No categories yet. Add your first one to start organizing products.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c._id}
              className="flex flex-col gap-3 rounded-2xl border border-gold/20 bg-[#111] p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/15 bg-black/40 text-gold">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <Tag size={18} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{c.name}</p>
                  <p className="truncate text-[12px] text-zinc-500">{c.slug}</p>
                </div>
              </div>

              {c.description && (
                <p className="line-clamp-2 text-[13px] text-zinc-400">{c.description}</p>
              )}

              <div className="mt-auto flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setEditingCategory(c);
                    setFormOpen(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gold/20 py-2 text-xs font-medium text-zinc-300 hover:border-gold/50 hover:text-gold"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(c)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2 text-xs font-medium text-red-400/80 hover:border-red-500/50 hover:text-red-400"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryFormModal
        open={formOpen}
        category={editingCategory}
        onClose={() => {
          setFormOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        message={`"${deleteTarget?.name}" will be permanently removed. This fails if any products still use it.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}

export default CategoryManagement;
