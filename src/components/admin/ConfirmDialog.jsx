import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-red-500/25 bg-[#111] p-6 shadow-2xl shadow-black/60"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertTriangle size={22} />
            </div>
            <h3 className="font-prim text-lg font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{message}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="rounded-full border border-gold/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-zinc-300 hover:border-gold/50 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="rounded-full bg-red-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-red-600"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;
