import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatPKR } from "../data/products";
import { useCart } from "../context/CartContext";
import { useToast } from "./ToastProvider";

function ProductCard({ product, index = 0, variants }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const outOfStock = product.stock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product, { size: product.sizes?.[0], quantity: 1 });
    showToast(`${product.name} added to cart`);
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group relative rounded-2xl border border-gold/20 bg-[#111] p-6 text-left hover:border-gold/60 transition-colors duration-300 overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none rounded-2xl" />

        {product.badge && (
          <span className="absolute top-4 right-4 z-10 text-[10px] uppercase tracking-widest bg-gold/15 border border-gold/30 text-gold px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}

        <div className="h-44 overflow-hidden rounded-xl border border-gold/10 bg-black/60 mb-5">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <p className="text-clamp-label uppercase tracking-widest text-gold">
          {product.type}
        </p>
        <h3 className="font-prim mt-2 text-2xl font-bold text-white">
          {product.name}
        </h3>
        <p className="mt-3 text-clamp-body leading-7 text-zinc-400 line-clamp-2">
          {product.desc}
        </p>
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-gold">
          {formatPKR(product.price)}
        </span>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex items-center gap-2 rounded-full border border-gold px-5 py-2 text-xs uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-black font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold"
        >
          <ShoppingBag size={14} />
          {outOfStock ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}

export default ProductCard;
