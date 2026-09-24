// src/api/orders.api.js
import axiosInstance from "./axiosInstance";

// POST /api/orders — public, no auth required (guest checkout)
// payload: { customer: {fullName, mobile, email, address, city, postalCode, notes}, items: [{productId, size, quantity}], paymentMethod }
export const createOrder = async (payload) => {
  const { data } = await axiosInstance.post("/orders", payload);
  return data.order;
};

// GET /api/orders — admin
export const getOrders = async (params = {}) => {
  const { data } = await axiosInstance.get("/orders", { params });
  return {
    orders: data.orders || [],
    total: data.total,
    page: data.page,
    pages: data.pages,
  };
};

// GET /api/orders/:id — admin (id can be Mongo _id or orderNumber)
export const getOrderById = async (id) => {
  const { data } = await axiosInstance.get(`/orders/${id}`);
  return data.order;
};

// PATCH /api/orders/:id/status — admin
export const updateOrderStatus = async (id, status) => {
  const { data } = await axiosInstance.patch(`/orders/${id}/status`, { status });
  return data.order;
};

// GET /api/orders/stats/summary — admin
export const getOrderStats = async () => {
  const { data } = await axiosInstance.get("/orders/stats/summary");
  return data.stats;
};
