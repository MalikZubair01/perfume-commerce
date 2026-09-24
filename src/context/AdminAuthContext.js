// Admin auth context.
//
// Now wired to the real backend (src/api/auth.api.js) instead of
// localStorage simulation. The shape returned to consumers (admin,
// isAuthenticated, loading, login, signup, logout, requestPasswordReset,
// resetPassword) is unchanged, so no page/component needs to change.
//
// NOTE on resetPassword: the backend uses a one-time reset TOKEN (emailed/
// logged as a link, not the account email) — see requestPasswordReset below.
// resetPassword(token, newPassword) takes that token, not the email.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  loginApi,
  signupApi,
  forgotPasswordApi,
  resetPasswordApi,
  getMeApi,
  logoutApi,
  getPersistedAdmin,
} from "../api/auth.api";
import { getStoredToken } from "../api/axiosInstance";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => getPersistedAdmin());
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, verify it's still valid against the
  // backend (covers the case where it expired since the last visit).
  useEffect(() => {
    const verifySession = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const freshAdmin = await getMeApi();
        setAdmin(freshAdmin);
      } catch {
        // interceptor already clears the stale session on 401
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedInAdmin = await loginApi(email, password);
      setAdmin(loggedInAdmin);
      return loggedInAdmin;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const newAdmin = await signupApi({ name, email, password });
      setAdmin(newAdmin);
      return newAdmin;
    } finally {
      setLoading(false);
    }
  };

  // Returns { success, message, resetUrl? } — resetUrl only present in dev
  const requestPasswordReset = async (email) => {
    setLoading(true);
    try {
      return await forgotPasswordApi(email);
    } finally {
      setLoading(false);
    }
  };

  // token comes from the reset link (/admin/reset-password/:token)
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    try {
      return await resetPasswordApi(token, newPassword);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: !!admin,
      loading,
      login,
      signup,
      logout,
      requestPasswordReset,
      resetPassword,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [admin, loading]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
}
