import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import QuantitySelector from "../../components/QuantitySelector";
import { formatPKR } from "../../data/products";

const DELIVERY_CHARGE = 250;
const FREE_DELIVERY_THRESHOLD = 5000;

function Cart() {
  const { items, updateQuantity, removeFromCart, itemCount, subtotal } = useCart();
  const delivery = items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#0a0a0a]">
        <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-gold" />
        </div>
        <h2 className="font-prim text-3xl font-bold text-white">
          Your Cart is <span className="text-gold italic">Empty</span>
        </h2>
        <p className="mt-3 text-zinc-400 max-w-sm">
          Looks like you haven't added any fragrances yet. Explore our collection to find your signature scent.
        </p>
        <Link
          to="/"
          className="mt-8 px-8 py-3 bg-gold text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-goldLight transition-all duration-300"
        >
          Explore Collection
        </Link>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#0a0a0a] min-h-screen">
      <div className="container-main">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gold transition-colors duration-200 mb-8 w-fit"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <h1 className="font-prim text-clamp-section font-bold text-white">
          Your <span className="text-gold italic">Cart</span>{" "}
          <span className="text-base font-sans text-zinc-500">({itemCount} items)</span>
        </h1>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.key}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-gold/15 bg-[#111] p-4"
                >
                  <Link
                    to={`/product/${item.id}`}
                    className="w-full sm:w-28 h-28 shrink-0 rounded-xl overflow-hidden border border-gold/10 bg-black/40"
                  >
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-prim text-xl font-bold text-white hover:text-gold transition-colors duration-200">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-clamp-label uppercase tracking-widest text-gold/70 mt-1">
                        {item.type}
                      </p>
                      {item.size && (
                        <p className="text-xs text-zinc-500 mt-1">Size: {item.size}</p>
                      )}
                      <p className="text-sm text-gold mt-2 font-semibold">
                        {formatPKR(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <QuantitySelector
                        quantity={item.quantity}
                        onChange={(q) => updateQuantity(item.key, q)}
                        size="sm"
                      />
                      <p className="text-sm font-semibold text-white w-20 text-right">
                        {formatPKR(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="text-zinc-500 hover:text-red-400 transition-colors duration-200"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gold/20 bg-[#111] p-6 sticky top-24">
              <h3 className="font-prim text-xl font-bold text-white mb-5">
                Order Summary
              </h3>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-zinc-200">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery</span>
                  <span className="text-zinc-200">
                    {delivery === 0 ? "Free" : formatPKR(delivery)}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="text-[11px] text-zinc-500">
                    Free delivery on orders over {formatPKR(FREE_DELIVERY_THRESHOLD)}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-5 border-t border-gold/10 flex justify-between items-center">
                <span className="text-zinc-300 font-medium">Total</span>
                <span className="text-xl font-bold text-gold">{formatPKR(total)}</span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-gold text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-goldLight transition-all duration-300 hover:shadow-lg hover:shadow-gold/25"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
