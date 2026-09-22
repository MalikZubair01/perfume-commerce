// Admin stock/product store.
//
// There's no backend wired up yet, so this persists everything to
// localStorage and seeds itself from the public catalogue in
// src/data/products.js the first time it runs. Every admin CRUD screen
// (Dashboard, Stock Management) reads/writes through the functions below.
//
// When the real backend is ready, swap the bodies of these functions for
// fetch()/axios calls — the function signatures are designed to map
// cleanly onto typical REST endpoints (GET/POST/PUT/DELETE /api/products).

import { products as seedProducts } from "../data/products";

const PRODUCTS_KEY = "nk_admin_products_v1";
const LOW_STOCK_THRESHOLD = 10;

const clone = (v) => JSON.parse(JSON.stringify(v));

const slugify = (name) =>
  name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const readRaw = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    console.warn("Could not read admin product store:", err);
    return null;
  }
};

const writeRaw = (list) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn("Could not persist admin product store:", err);
  }
};

const seedIfEmpty = () => {
  const existing = readRaw();
  if (existing) return existing;
  const seeded = clone(seedProducts);
  writeRaw(seeded);
  return seeded;
};

export const getAllProducts = () => seedIfEmpty();

export const getProduct = (id) => getAllProducts().find((p) => p.id === id) || null;

export const addProduct = (data) => {
  const list = getAllProducts();

  let id = slugify(data.name || "product");
  if (!id) id = `product-${Date.now()}`;
  let uniqueId = id;
  let n = 1;
  while (list.some((p) => p.id === uniqueId)) {
    n += 1;
    uniqueId = `${id}-${n}`;
  }

  const newProduct = {
    id: uniqueId,
    name: data.name?.trim() || "Untitled Product",
    type: data.type?.trim() || "Fragrance",
    price: Number(data.price) || 0,
    badge: data.badge?.trim() || null,
    rating: data.rating ? Number(data.rating) : 4.5,
    stock: Number.isFinite(Number(data.stock)) ? Number(data.stock) : 0,
    sizes: data.sizes?.length ? data.sizes : ["30ml", "50ml", "100ml"],
    images: data.images?.length ? data.images : ["/images/products/placeholder.jpg"],
    desc: data.desc?.trim() || "",
    notes: {
      top: data.notes?.top?.trim() || "",
      heart: data.notes?.heart?.trim() || "",
      base: data.notes?.base?.trim() || "",
    },
  };

  const updated = [newProduct, ...list];
  writeRaw(updated);
  return newProduct;
};

export const updateProduct = (id, data) => {
  const list = getAllProducts();
  let updatedProduct = null;

  const updated = list.map((p) => {
    if (p.id !== id) return p;
    updatedProduct = {
      ...p,
      name: data.name?.trim() || p.name,
      type: data.type?.trim() || p.type,
      price: data.price !== undefined ? Number(data.price) : p.price,
      badge: data.badge !== undefined ? data.badge?.trim() || null : p.badge,
      stock: data.stock !== undefined ? Math.max(0, Number(data.stock)) : p.stock,
      sizes: data.sizes?.length ? data.sizes : p.sizes,
      images: data.images?.length ? data.images : p.images,
      desc: data.desc !== undefined ? data.desc : p.desc,
      notes: {
        top: data.notes?.top ?? p.notes?.top ?? "",
        heart: data.notes?.heart ?? p.notes?.heart ?? "",
        base: data.notes?.base ?? p.notes?.base ?? "",
      },
    };
    return updatedProduct;
  });

  writeRaw(updated);
  return updatedProduct;
};

export const deleteProduct = (id) => {
  const list = getAllProducts();
  const updated = list.filter((p) => p.id !== id);
  writeRaw(updated);
  return updated;
};

export const adjustStock = (id, delta) => {
  const list = getAllProducts();
  let updatedProduct = null;

  const updated = list.map((p) => {
    if (p.id !== id) return p;
    updatedProduct = { ...p, stock: Math.max(0, p.stock + delta) };
    return updatedProduct;
  });

  writeRaw(updated);
  return updatedProduct;
};

export const resetToDefaults = () => {
  const seeded = clone(seedProducts);
  writeRaw(seeded);
  return seeded;
};

export const getStats = () => {
  const list = getAllProducts();

  const totalProducts = list.length;
  const totalStockUnits = list.reduce((sum, p) => sum + (p.stock || 0), 0);
  const outOfStock = list.filter((p) => p.stock <= 0);
  const lowStock = list.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const inventoryValue = list.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);
  const avgRating =
    list.reduce((sum, p) => sum + (p.rating || 0), 0) / (list.length || 1);

  return {
    totalProducts,
    totalStockUnits,
    outOfStockCount: outOfStock.length,
    lowStockCount: lowStock.length,
    inventoryValue,
    avgRating: Number.isFinite(avgRating) ? avgRating : 0,
    lowStockItems: lowStock,
    outOfStockItems: outOfStock,
  };
};

export const LOW_STOCK_LIMIT = LOW_STOCK_THRESHOLD;
