import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "10+", label: "Years of Excellence" },
  { value: "500+", label: "Unique Fragrances" },
  { value: "50K+", label: "Happy Customers" },
  { value: "30+", label: "Countries Served" },
];

function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="scroll-mt-20 py-28 px-4 bg-[#0a0a0a]"
    >
      <div className="container-main" ref={ref}>
        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-clamp-label uppercase tracking-[0.5em] text-gold text-center"
        >
          Our Story
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-prim text-clamp-section font-bold tracking-wide text-white text-center mt-3"
        >
          Crafted with <span className="text-gold italic">Passion</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-clamp-body text-zinc-300 leading-8">
              N & K Fragrances was founded on a simple belief — that luxury should
              be accessible. We source the world's finest raw materials, from oud harvested
              in the forests of Assam to rose absolute from the valleys of Bulgaria.
            </p>
            <p className="mt-6 text-clamp-body text-zinc-400 leading-8">
              Every bottle we craft tells a story. Our master perfumers spend months
              composing each scent, balancing top, heart, and base notes with meticulous
              precision to create something truly unforgettable.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <div className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent mt-5" />
              <p className="text-clamp-label uppercase tracking-widest text-gold">
                Est. 2014 · Lahore, Pakistan
              </p>
            </div>
          </motion.div>

          {/* Right: Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="rounded-2xl border border-gold/20 bg-[#111] p-6 text-center hover:border-gold/50 transition-all duration-300 hover:bg-gold/5"
              >
                <p className="font-prim text-4xl font-bold text-gold">{stat.value}</p>
                <p className="mt-2 text-clamp-label uppercase tracking-widest text-zinc-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
