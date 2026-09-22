import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

function AdminAuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] px-6 py-16">
      {/* Ambient background glow, consistent with the site's gold/black theme */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            to="/"
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-black/60 text-gold"
          >
            <ShieldCheck size={26} />
          </Link>
          <p className="text-clamp-label uppercase tracking-widest text-gold">
            N&amp;K Fragrances · Admin
          </p>
          <h1 className="font-prim mt-2 text-3xl font-bold text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-clamp-body text-zinc-400">{subtitle}</p>
          )}
        </div>

        <div className="rounded-2xl border border-gold/20 bg-[#111] p-8 shadow-xl shadow-black/40">
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-clamp-body text-zinc-500">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AdminAuthShell;
