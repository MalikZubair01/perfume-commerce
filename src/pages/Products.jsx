import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

function Products() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="products"
      className="scroll-mt-20 py-28 px-4 bg-[#0d0d0d]"
    >
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

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item, i) => (
            <ProductCard key={item.id} product={item} index={i} variants={cardVariants} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
