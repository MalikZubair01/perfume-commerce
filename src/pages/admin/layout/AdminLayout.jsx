import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Boxes,
  LogOut,
  Menu,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useAdminAuth } from "../../../context/AdminAuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/stock", label: "Stock & Products", icon: Boxes },
];

function SidebarContent({ onNavigate }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/admin/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-3 border-b border-gold/15 px-6 py-6"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-black/60 text-gold">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="font-prim text-lg font-bold leading-tight text-white">
            N&amp;K Admin
          </p>
          <p className="text-[11px] uppercase tracking-widest text-zinc-500">
            Fragrances
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={18} />
          View Store
        </a>
      </nav>

      <div className="border-t border-gold/15 px-4 py-5">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-black/40 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold">
            {admin?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {admin?.name || "Admin"}
            </p>
            <p className="truncate text-[11px] text-zinc-500">
              {admin?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-all duration-200 hover:border-red-500/40 hover:text-red-400"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
}

function AdminLayout({ title, subtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-72 lg:shrink-0 lg:border-r lg:border-gold/15 lg:bg-[#0c0c0c]">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0c0c0c] border-r border-gold/15 lg:hidden"
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-gold/15 bg-[#0a0a0a]/90 px-6 py-4 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-gold lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="font-prim text-xl font-bold text-white sm:text-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="text-clamp-body text-zinc-500">{subtitle}</p>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
