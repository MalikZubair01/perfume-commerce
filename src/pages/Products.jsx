import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "../api/products.api";
import { getCategories } from "../api/categories.api";
import ProductCard from "../components/ProductCard";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const PAGE_SIZE = 9;

function Products() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProducts({ search: search || undefined, category: category || undefined, page, limit: PAGE_SIZE })
      .then((res) => {
        if (!active) return;
        setProducts(res.products);
        setPages(res.pages || 1);
      })
      .catch(() => active && setProducts([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [search, category, page]);

  // reset to page 1 whenever the filters change
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  return (
    <section id="products" className="scroll-mt-20 py-28 px-4 bg-[#0d0d0d]">
      <div className="container-main" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-clamp-label uppercase tracking-[0.5em] text-gold text-center"
        >
          Our Collection
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-prim text-clamp-section font-bold tracking-wide text-white text-center mt-3"
        >
          Signature <span className="text-gold italic">Scents</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-clamp-body text-zinc-400 text-center mt-4 max-w-xl mx-auto"
        >
          Each fragrance is composed by hand, using only the finest raw materials from across the globe.
        </motion.p>

        {/* Search + category filter */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fragrances..."
              className="input-gold w-full rounded-full py-2.5 pl-10 pr-4 text-sm placeholder-zinc-600"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCategory("")}
              className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-all duration-200 ${
                category === ""
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-gold/15 text-zinc-400 hover:border-gold/40 hover:text-white"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.slug)}
                className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-all duration-200 ${
                  category === c.slug
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-gold/15 text-zinc-400 hover:border-gold/40 hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 size={24} className="animate-spin text-gold" />
          </div>
        ) : products.length === 0 ? (
          <p className="mt-16 text-center text-zinc-500">No fragrances match your search.</p>
        ) : (
          <>
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((item, i) => (
                <ProductCard key={item.id} product={item} index={i} variants={cardVariants} />
              ))}
            </div>

            {pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-zinc-300 hover:border-gold/50 disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-zinc-400">
                  Page {page} of {pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-zinc-300 hover:border-gold/50 disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Products;
