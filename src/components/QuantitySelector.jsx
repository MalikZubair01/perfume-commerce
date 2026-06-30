import { Minus, Plus } from "lucide-react";

function QuantitySelector({ quantity, onChange, min = 1, max = 99, size = "md" }) {
  const dec = () => onChange(Math.max(min, quantity - 1));
  const inc = () => onChange(Math.min(max, quantity + 1));

  const pad = size === "sm" ? "py-1.5" : "py-2.5";

  return (
    <div className="inline-flex items-center rounded-full border border-gold/30 bg-black/40 overflow-hidden">
      <button
        type="button"
        onClick={dec}
        disabled={quantity <= min}
        className={`px-3 ${pad} text-gold hover:bg-gold/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-medium text-white select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={quantity >= max}
        className={`px-3 ${pad} text-gold hover:bg-gold/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default QuantitySelector;
