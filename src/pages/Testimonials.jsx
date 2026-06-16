import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Malik",
    role: "Fashion Designer, Lahore",
    avatar: "AM",
    rating: 5,
    text: "Royal Oud has become my signature scent. The longevity is incredible — I get compliments everywhere I go. N&K Fragrances truly understand what luxury means.",
  },
  {
    name: "Ahmed Raza",
    role: "Business Executive, Karachi",
    avatar: "AR",
    rating: 5,
    text: "Noir Elixir is unlike anything I've worn before. Dark, complex and absolutely magnetic. Worth every rupee. This brand is in a league of its own.",
  },
  {
    name: "Sana Tariq",
    role: "Lifestyle Blogger",
    avatar: "ST",
    rating: 5,
    text: "Golden Mist is my everyday favorite. It's fresh, feminine and lasts all day. The packaging is also stunning — makes a perfect gift!",
  },
  {
    name: "Usman Khan",
    role: "Entrepreneur, Islamabad",
    avatar: "UK",
    rating: 5,
    text: "I ordered Midnight Rose for my wife and she absolutely loves it. The customer service was exceptional too — fast delivery and beautifully packaged.",
  },
  {
    name: "Fatima Noor",
    role: "Doctor, Peshawar",
    avatar: "FN",
    rating: 5,
    text: "Crystal Blue is my go-to scent for the clinic. It's clean, professional and refreshing without being overpowering. Exactly what I needed.",
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-gold text-gold" />
      ))}
    </div>
  );
}

function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((p) => (p + 1) % testimonials.length);

  const getVisible = () => {
    const indices = [];
    for (let i = -1; i <= 1; i++) {
      indices.push((active + i + testimonials.length) % testimonials.length);
    }
    return indices;
  };

  return (
    <section id="testimonials" className="scroll-mt-20 py-28 px-4 bg-[#0a0a0a]">
      <div className="container-main" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-clamp-label uppercase tracking-[0.5em] text-gold text-center"
        >
          What Clients Say
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-prim text-clamp-section font-bold tracking-wide text-white text-center mt-3"
        >
          Stories of <span className="text-gold italic">Luxury</span>
        </motion.h2>

        {/* Desktop: 3-card carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 relative"
        >
          {/* Cards */}
          <div className="hidden md:flex gap-6 items-stretch justify-center">
            {getVisible().map((idx, pos) => {
              const t = testimonials[idx];
              const isCenter = pos === 1;
              return (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{
                    scale: isCenter ? 1 : 0.93,
                    opacity: isCenter ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`flex-1 max-w-sm rounded-2xl border p-7 flex flex-col gap-4 transition-all duration-300 ${
                    isCenter
                      ? "border-gold/50 bg-[#131313] shadow-xl shadow-gold/10"
                      : "border-gold/15 bg-[#0f0f0f]"
                  }`}
                >
                  <StarRating count={t.rating} />
                  <p className="text-clamp-body text-zinc-300 leading-7 italic flex-1">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-gold/10">
                    <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-semibold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile: single card */}
          <div className="md:hidden">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-gold/40 bg-[#131313] p-7 flex flex-col gap-4"
            >
              <StarRating count={testimonials[active].rating} />
              <p className="text-clamp-body text-zinc-300 leading-7 italic">
                "{testimonials[active].text}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-gold/10">
                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-semibold text-sm">
                  {testimonials[active].avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonials[active].name}</p>
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{testimonials[active].role}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? "w-6 h-2 bg-gold" : "w-2 h-2 bg-gold/25"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
