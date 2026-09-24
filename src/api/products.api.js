// src/api/products.api.js
//
// All product HTTP calls live here. Pages/components never call axios
// directly — they go through this file (usually via utils/adminStore.js
// on the admin side, or directly on public storefront pages).

import axiosInstance from "./axiosInstance";

// Backend product -> shape the existing frontend components already expect
// (product.id as the URL-friendly identifier, product.images as a plain
// array of URL strings). Keeping this here means ProductCard, ProductDetails,
// etc. don't need to change at all.
const normalizeProduct = (p) => ({
  id: p.slug,
  _id: p._id,
  name: p.name,
  type: p.type,
  category: p.category?.slug || p.category || null, // slug — used for public filtering/URLs
  categoryId: p.category?._id || (typeof p.category === "string" ? p.category : null), // Mongo _id — used when submitting admin forms
  categoryName: p.category?.name || null,
  price: p.price,
  badge: p.badge,
  rating: p.rating,
  stock: p.stock,
  sizes: p.sizes || [],
  images: (p.images || []).map((img) => img.url),
  imageObjects: p.images || [], // kept if you need public_id later (e.g. to remove a specific image)
  desc: p.desc,
  notes: p.notes || { top: "", heart: "", base: "" },
});

// GET /api/products — pagination + search + filter + sort
// params: { search, category, type, badge, minPrice, maxPrice, inStock, sort, page, limit }
export const getProducts = async (params = {}) => {
  const { data } = await axiosInstance.get("/products", { params });
  return {
    products: (data.products || []).map(normalizeProduct),
    total: data.total,
    page: data.page,
    pages: data.pages,
    hasNextPage: data.hasNextPage,
    hasPrevPage: data.hasPrevPage,
  };
};

// GET /api/products/:slug — product detail + related products
export const getProductBySlug = async (slug) => {
  const { data } = await axiosInstance.get(`/products/${slug}`);
  return {
    product: normalizeProduct(data.product),
    related: (data.related || []).map(normalizeProduct),
  };
};

// Builds the multipart/form-data body shared by create + update.
// `payload.imageFiles` (array of File objects) are the newly picked images.
// `payload.removeImageIds` (array of Cloudinary public_id strings) marks
// existing images to delete on update.
const buildProductFormData = (payload) => {
  const form = new FormData();

  if (payload.name !== undefined) form.append("name", payload.name);
  if (payload.type !== undefined) form.append("type", payload.type);
  if (payload.category !== undefined) form.append("category", payload.category); // category _id
  if (payload.price !== undefined) form.append("price", payload.price);
  if (payload.badge !== undefined) form.append("badge", payload.badge || "");
  if (payload.rating !== undefined) form.append("rating", payload.rating);
  if (payload.stock !== undefined) form.append("stock", payload.stock);
  if (payload.desc !== undefined) form.append("desc", payload.desc);
  if (payload.sizes !== undefined) form.append("sizes", JSON.stringify(payload.sizes));
  if (payload.notes !== undefined) form.append("notes", JSON.stringify(payload.notes));
  if (payload.removeImageIds?.length) {
    form.append("removeImageIds", JSON.stringify(payload.removeImageIds));
  }

  (payload.imageFiles || []).forEach((file) => form.append("images", file));

  return form;
};

// POST /api/products  (admin)
export const createProduct = async (payload) => {
  const form = buildProductFormData(payload);
  const { data } = await axiosInstance.post("/products", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeProduct(data.product);
};

// PUT /api/products/:id  (admin) — id must be the Mongo _id
export const updateProduct = async (id, payload) => {
  const form = buildProductFormData(payload);
  const { data } = await axiosInstance.put(`/products/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeProduct(data.product);
};

// DELETE /api/products/:id  (admin)
export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};

// PATCH /api/products/:id/stock  (admin) — delta e.g. -1 or +5
export const adjustStock = async (id, delta) => {
  const { data } = await axiosInstance.patch(`/products/${id}/stock`, { delta });
  return normalizeProduct(data.product);
};

// GET /api/products/stats/summary  (admin)
export const getStats = async () => {
  const { data } = await axiosInstance.get("/products/stats/summary");
  return data.stats; // { totalProducts, totalStock, lowStockCount, outOfStockCount, totalCategories }
};
