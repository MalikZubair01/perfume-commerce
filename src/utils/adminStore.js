// Admin stock/product store.
//
// Now backed by the real API (src/api/products.api.js, categories.api.js)
// instead of localStorage. Every function here is now ASYNC — call sites
// (Dashboard, Stock Management, ProductFormModal) must `await` them.
//
// Function names are kept the same as the old mock version so the rest of
// the admin UI barely changed — just added `await` and loading states.

import * as productsApi from "../api/products.api";
import * as categoriesApi from "../api/categories.api";

const LOW_STOCK_THRESHOLD = 10;
export const LOW_STOCK_LIMIT = LOW_STOCK_THRESHOLD;

// Admin screens want the *whole* catalogue (they do their own client-side
// search/filter/pagination in the table), so ask the backend for a high
// limit rather than building a separate admin pagination UI right now.
const ADMIN_LIST_LIMIT = 500;

export const getAllProducts = async () => {
  const { products } = await productsApi.getProducts({ limit: ADMIN_LIST_LIMIT, sort: "newest" });
  return products;
};

export const getProduct = async (slug) => {
  const { product } = await productsApi.getProductBySlug(slug);
  return product;
};

// data: { name, type, category (category _id), price, badge, rating, stock,
//          sizes (array), desc, notes {top,heart,base}, imageFiles (File[]) }
export const addProduct = async (data) => {
  return productsApi.createProduct(data);
};

// id must be the product's Mongo _id (product._id from the normalized object)
export const updateProduct = async (id, data) => {
  return productsApi.updateProduct(id, data);
};

// id must be the product's Mongo _id
export const deleteProduct = async (id) => {
  await productsApi.deleteProduct(id);
  return getAllProducts();
};

// id must be the product's Mongo _id
export const adjustStock = async (id, delta) => {
  return productsApi.adjustStock(id, delta);
};

export const getStats = async () => {
  const stats = await productsApi.getStats();
  const { products } = await productsApi.getProducts({ limit: ADMIN_LIST_LIMIT });

  const lowStockItems = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const outOfStockItems = products.filter((p) => p.stock <= 0);
  const inventoryValue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);
  const avgRating =
    products.reduce((sum, p) => sum + (p.rating || 0), 0) / (products.length || 1);

  return {
    totalProducts: stats.totalProducts,
    totalStockUnits: stats.totalStock,
    outOfStockCount: stats.outOfStockCount,
    lowStockCount: stats.lowStockCount,
    inventoryValue,
    avgRating: Number.isFinite(avgRating) ? avgRating : 0,
    lowStockItems,
    outOfStockItems,
  };
};

// Categories — re-exported here so admin screens have one import to reach for
export const getCategories = () => categoriesApi.getCategories();
export const addCategory = (data) => categoriesApi.createCategory(data);
export const updateCategory = (id, data) => categoriesApi.updateCategory(id, data);
export const deleteCategory = (id) => categoriesApi.deleteCategory(id);
