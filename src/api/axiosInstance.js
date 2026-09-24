// src/api/axiosInstance.js
//
// Single configured axios instance used by every *.api.js file.
// Nothing outside src/api/ should import axios directly — pages/components
// only ever call the functions exported from the resource api files.

import axios from "axios";

const ADMIN_TOKEN_KEY = "nk_admin_token_v1";
const ADMIN_SESSION_KEY = "nk_admin_session_v1";

export const getStoredToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

export const setAuthSession = (token, admin) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
};

export const clearAuthSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const getStoredAdmin = () => {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// set url
console.log("REACT_APP_API_BASE_URL is:", process.env.REACT_APP_API_BASE_URL)
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ---- Request interceptor: attach JWT on every request, if present ----
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- Response interceptor: normalize errors, auto-logout on 401 ----
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (status === 401) {
      // token missing/expired/invalid — drop the stale session so the UI
      // falls back to the logged-out state on next render/route guard
      clearAuthSession();
    }

    // Always reject with a plain Error carrying the backend's message,
    // so callers can just do `catch (err) { showToast(err.message) }`
    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;
