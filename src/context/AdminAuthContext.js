// Admin auth context.
//
// No backend is wired up yet, so this simulates auth entirely in
// localStorage: a list of registered admin accounts + a "session" key.
// Swap login/signup/requestPasswordReset/resetPassword for real API calls
// once the backend is ready — the shape returned to consumers (admin,
// isAuthenticated, loading helpers) is designed to stay the same.

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ADMINS_KEY = "nk_admin_users_v1";
const SESSION_KEY = "nk_admin_session_v1";

const DEFAULT_ADMIN = {
  name: "Store Admin",
  email: "admin@nkfragrances.com",
  password: "Admin@123",
};

const AdminAuthContext = createContext(null);

const readAdmins = () => {
  try {
    const raw = localStorage.getItem(ADMINS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (err) {
    console.warn("Could not read admin accounts:", err);
  }
  const seeded = [DEFAULT_ADMIN];
  localStorage.setItem(ADMINS_KEY, JSON.stringify(seeded));
  return seeded;
};

const writeAdmins = (list) => {
  try {
    localStorage.setItem(ADMINS_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn("Could not persist admin accounts:", err);
  }
};

const readSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => readSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Seed the default admin account on first load so login works
    // out of the box for demoing the UI.
    readAdmins();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450)); // simulate network latency
    const admins = readAdmins();
    const found = admins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    setLoading(false);

    if (!found || found.password !== password) {
      throw new Error("Invalid email or password.");
    }

    const session = { name: found.name, email: found.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setAdmin(session);
    return session;
  };

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    const admins = readAdmins();
    const exists = admins.some(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (exists) {
      setLoading(false);
      throw new Error("An admin account with this email already exists.");
    }

    const newAdmin = { name: name.trim(), email: email.trim(), password };
    const updated = [...admins, newAdmin];
    writeAdmins(updated);
    setLoading(false);
    return newAdmin;
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    const admins = readAdmins();
    const found = admins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    setLoading(false);
    if (!found) {
      throw new Error("No admin account found with this email.");
    }
    return true;
  };

  const resetPassword = async (email, newPassword) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    const admins = readAdmins();
    const idx = admins.findIndex(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (idx === -1) {
      setLoading(false);
      throw new Error("No admin account found with this email.");
    }

    admins[idx] = { ...admins[idx], password: newPassword };
    writeAdmins(admins);
    setLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
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
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
}
