import { motion } from "framer-motion";

function StatCard({ icon: Icon, label, value, tone = "gold", hint }) {
  const toneClasses = {
    gold: "border-gold/20 text-gold bg-gold/10",
    red: "border-red-500/25 text-red-400 bg-red-500/10",
    amber: "border-amber-400/25 text-amber-300 bg-amber-400/10",
    green: "border-emerald-400/25 text-emerald-300 bg-emerald-400/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-gold/20 bg-[#111] p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-clamp-label uppercase tracking-widest text-zinc-500">
            {label}
          </p>
          <p className="font-prim mt-2 text-3xl font-bold text-white">
            {value}
          </p>
          {hint && <p className="mt-1 text-[12px] text-zinc-500">{hint}</p>}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${toneClasses[tone]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
