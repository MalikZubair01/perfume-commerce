import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { ChevronLeft, ShoppingBag, Star, CheckCircle2, XCircle } from "lucide-react";
import { getProductById, getRelatedProducts, formatPKR } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../components/ToastProvider";
import QuantitySelector from "../../components/QuantitySelector";
import ProductCard from "../../components/ProductCard";
import ImageMagnifier from "../../components/ImageMagnifier";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSize(product?.sizes?.[0] || null);
    setQuantity(1);
    setActiveImage(0);
  }, [id, product]);

  if (!product) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-prim text-3xl font-bold text-white">
          Product Not <span className="text-gold italic">Found</span>
        </h2>
        <p className="mt-3 text-zinc-400">
          The fragrance you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/"
          className="mt-8 px-6 py-3 bg-gold text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-goldLight transition-all duration-300"
        >
          Back to Home
        </Link>
      </section>
    );
  }

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 10;
  const related = getRelatedProducts(product.id, 3);

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product, { size, quantity });
    showToast(`${quantity} × ${product.name} added to cart`);
  };

  return (
    <section className="scroll-mt-20 py-16 px-4 bg-[#0a0a0a] min-h-screen">
      <div className="container-main">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gold transition-colors duration-200 mb-8"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageMagnifier
              src={product.images[activeImage]}
              alt={`${product.name} — image ${activeImage + 1}`}
            />

            <Swiper
              modules={[Navigation, Thumbs]}
              onSwiper={setThumbsSwiper}
              watchSlidesProgress
              navigation
              spaceBetween={12}
              slidesPerView={4}
              className="mt-4 product-thumbs"
              onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
            >
              {product.images.map((src, i) => (
                <SwiperSlide key={src}>
                  <button
                    onClick={() => {
                      setActiveImage(i);
                      thumbsSwiper?.slideTo(i);
                    }}
                    className={`block w-full aspect-square overflow-hidden rounded-xl border transition-colors duration-200 ${
                      activeImage === i
                        ? "border-gold"
                        : "border-gold/15 hover:border-gold/50"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {product.badge && (
              <span className="inline-block text-[10px] uppercase tracking-widest bg-gold/15 border border-gold/30 text-gold px-2 py-1 rounded-full mb-4">
                {product.badge}
              </span>
            )}

            <p className="text-clamp-label uppercase tracking-widest text-gold">
              {product.type}
            </p>
            <h1 className="font-prim text-clamp-section font-bold text-white mt-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-gold text-gold" />
                <span className="text-sm text-zinc-300">{product.rating}</span>
              </div>
              <span className="text-zinc-600">·</span>
              {outOfStock ? (
                <span className="flex items-center gap-1 text-sm text-red-400">
                  <XCircle size={14} /> Out of Stock
                </span>
              ) : lowStock ? (
                <span className="flex items-center gap-1 text-sm text-amber-400">
                  <CheckCircle2 size={14} /> Only {product.stock} left in stock
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-emerald-400">
                  <CheckCircle2 size={14} /> In Stock
                </span>
              )}
            </div>

            <p className="mt-5 text-2xl font-semibold text-gold">
              {formatPKR(product.price)}
            </p>

            <p className="mt-5 text-clamp-body leading-7 text-zinc-400">
              {product.desc}
            </p>

            {/* Fragrance notes */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {Object.entries(product.notes).map(([key, val]) => (
                <div
                  key={key}
                  className="rounded-xl border border-gold/15 bg-[#111] p-3 text-center"
                >
                  <p className="text-[10px] uppercase tracking-widest text-gold/70">
                    {key} notes
                  </p>
                  <p className="mt-1 text-xs text-zinc-300">{val}</p>
                </div>
              ))}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mt-8">
                <p className="text-clamp-label uppercase tracking-widest text-zinc-400 mb-3">
                  Select Size
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-5 py-2 rounded-full border text-sm uppercase tracking-widest transition-all duration-200 ${
                        size === s
                          ? "border-gold bg-gold text-black font-semibold"
                          : "border-gold/30 text-zinc-300 hover:border-gold hover:text-gold"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                max={Math.max(product.stock, 1)}
              />
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 bg-gold text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-goldLight transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gold disabled:hover:shadow-none"
              >
                <ShoppingBag size={16} />
                {outOfStock ? "Sold Out" : "Add to Cart"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-28">
            <p className="text-clamp-label uppercase tracking-[0.5em] text-gold text-center">
              You May Also Like
            </p>
            <h2 className="font-prim text-clamp-section font-bold tracking-wide text-white text-center mt-3">
              Related <span className="text-gold italic">Scents</span>
            </h2>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} variants={cardVariants} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetails;
