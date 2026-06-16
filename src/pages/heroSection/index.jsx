import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { image: "/slider/slider1.png" },
  { image: "/slider/slider3.png" },
  { image: "/slider/slider4.png" },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Background slider */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={slides[currentIndex].image}
          src={slides[currentIndex].image}
          alt="slide"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />

      {/* Content */}
      <div className="relative z-20 container-main text-center">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-clamp-label uppercase tracking-[0.5em] text-gold mb-4"
        >
          Luxury Fragrances
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="font-prim text-clamp-hero font-bold leading-tight text-white"
        >
          Wear the <span className="text-gold italic">Essence</span>
          <br />
          of Luxury
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-6 text-clamp-body text-zinc-300 max-w-xl mx-auto leading-relaxed"
        >
          Crafted from the world's finest ingredients. A fragrance for every moment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => scrollTo("products")}
            className="px-8 py-3 bg-gold text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-goldLight transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
          >
            Explore Collection
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="px-8 py-3 border border-gold text-gold font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-gold/10 transition-all duration-300"
          >
            Contact Us
          </button>
        </motion.div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-8 h-2 bg-gold" : "w-2 h-2 bg-gold/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
