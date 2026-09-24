// src/api/auth.api.js
//
// All admin-auth HTTP calls live here. Nothing else in the app should
// call axios directly for auth — AdminAuthContext.js is the only consumer.

import axiosInstance, { setAuthSession, clearAuthSession, getStoredAdmin } from "./axiosInstance";

// POST /api/auth/login
export const loginApi = async (email, password) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  setAuthSession(data.token, data.admin);
  return data.admin;
};

// POST /api/auth/signup
export const signupApi = async ({ name, email, password }) => {
  const { data } = await axiosInstance.post("/auth/signup", { name, email, password });
  setAuthSession(data.token, data.admin);
  return data.admin;
};

// POST /api/auth/forgot-password
export const forgotPasswordApi = async (email) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", { email });
  return data; // { success, message, resetUrl? (dev only) }
};

// PUT /api/auth/reset-password/:token
export const resetPasswordApi = async (token, password) => {
  const { data } = await axiosInstance.put(`/auth/reset-password/${token}`, { password });
  return data;
};

// GET /api/auth/me
export const getMeApi = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data.admin;
};

export const logoutApi = () => {
  clearAuthSession();
};

export const getPersistedAdmin = getStoredAdmin;
