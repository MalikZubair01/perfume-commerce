import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "products", label: "Products" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActive(id);
    setOpen(false);
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let maxVisible = 0;
      let winner = "home";
      navItems.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
        );
        if (visibleHeight > maxVisible) {
          maxVisible = visibleHeight;
          winner = id;
        }
      });
      setActive(winner);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-gold/20 bg-black/90 backdrop-blur-lg shadow-lg shadow-black/40"
          : "bg-black/60 backdrop-blur-md"
      }`}
    >
      <div className="container-main mx-auto flex items-center justify-between py-3">
        <button onClick={() => scrollToSection("home")}>
          <img
            src="/images/logo.png"
            alt="N&K Fragrances Logo"
            className="h-14 w-14 rounded-full bg-black object-contain border border-gold/20"
          />
        </button>

        {/* Desktop Menu */}
        <div className="hidden gap-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative text-clamp-label font-medium uppercase tracking-widest transition-all duration-300 ${
                active === item.id
                  ? "text-gold"
                  : "text-zinc-300 hover:text-gold"
              }`}
            >
              {item.label}
              {active === item.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-[2px] w-full bg-gold"
                />
              )}
            </button>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} className="text-gold md:hidden">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gold/20 bg-black/95 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full border-b border-gold/10 px-6 py-4 text-left text-xs font-medium uppercase tracking-widest transition-all duration-300 ${
                  active === item.id
                    ? "bg-gold/10 text-gold"
                    : "text-zinc-300 hover:bg-gold/5 hover:text-gold"
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
