import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const products = [
  {
    name: "Royal Oud",
    type: "Luxury Perfume",
    price: "Rs. 4,999",
    desc: "Deep woody oud with warm amber, precious resins and soft white musk. A regal statement for every occasion.",

    badge: "Best Seller",
  },
  {
    name: "Golden Mist",
    type: "Fresh Fragrance",
    price: "Rs. 3,499",
    desc: "A luminous, clean scent — sparkling citrus opens into blooming jasmine, settling into creamy vanilla.",
    badge: "New Arrival",
  },
  {
    name: "Midnight Rose",
    type: "Premium Attar",
    price: "Rs. 2,999",
    desc: "An elegant Bulgarian rose heart entwined with creamy sandalwood and a whisper of sweet oud.",
    badge: null,
  },
  {
    name: "Velvet Amber",
    type: "Oriental Blend",
    price: "Rs. 5,499",
    desc: "A rich oriental warmth — tonka bean, benzoin and sweet amber layered over a mossy base.",
    badge: "Limited Edition",
  },
  {
    name: "Crystal Blue",
    type: "Aquatic Fragrance",
    price: "Rs. 3,199",
    desc: "Cool ocean breeze meets white cedar and light musk in this refreshing aquatic composition.",
    badge: null,
  },
  {
    name: "Noir Elixir",
    type: "Signature Oud",
    price: "Rs. 6,999",
    desc: "Our most prestigious creation. Dark, complex and hypnotic — oud, leather, and smoky incense.",
    badge: "Flagship",
  },
];

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
            <motion.div
              key={item.name}
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group relative rounded-2xl border border-gold/20 bg-[#111] p-6 text-left hover:border-gold/60 transition-colors duration-300 overflow-hidden"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none rounded-2xl" />

              {/* Badge */}
              {item.badge && (
                <span className="absolute top-4 right-4 text-[10px] uppercase tracking-widest bg-gold/15 border border-gold/30 text-gold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}

              {/* Icon placeholder */}
              <div className="flex h-44 items-center justify-center rounded-xl border border-gold/10 bg-black/60 mb-5">
                <span className="text-5xl">{item.icon}</span>
              </div>

              <p className="text-clamp-label uppercase tracking-widest text-gold">
                {item.type}
              </p>
              <h3 className="font-prim mt-2 text-2xl font-bold text-white">
                {item.name}
              </h3>
              <p className="mt-3 text-clamp-body leading-7 text-zinc-400">
                {item.desc}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-semibold text-gold">{item.price}</span>
                <button className="rounded-full border border-gold px-5 py-2 text-xs uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-black font-medium">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
