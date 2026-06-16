// import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const links = {
  Explore: ["Home", "About", "Products", "Testimonials", "Contact"],
  Support: [
    "FAQs",
    "Shipping Policy",
    "Return Policy",
    "Track Order",
    "Privacy Policy",
  ],
};

const socials = [
  //   { Icon: Instagr, href: "#" },
  //   { Icon: Facebook, href: "#" },
  //   { Icon: Twitter, href: "#" },
  //   { Icon: Youtube, href: "#" },
  // ];
];
function Footer() {
  const scrollTo = (item) => {
    const slug = item.toLowerCase().replace(/\s+/g, "-");
    const el = document.getElementById(slug);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-gold/15 bg-[#080808] pt-16 pb-8 px-4">
      <div className="container-main">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo.png"
                alt="N&K Fragrances"
                className="h-12 w-12 rounded-full border border-gold/20 object-contain bg-black"
              />
              <p className="font-prim text-xl font-bold text-gold tracking-widest">
                N&K Fragrances
              </p>
            </div>
            <p className="text-clamp-body text-zinc-400 leading-7 max-w-xs">
              Luxury fragrances crafted with passion and precision. Bringing the
              world's finest scents to Pakistan since 2014.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full border border-gold/25 flex items-center justify-center text-gold/70 hover:text-gold hover:border-gold hover:bg-gold/10 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-clamp-label uppercase tracking-widest text-gold mb-5 font-semibold">
                {title}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollTo(item)}
                      className="text-clamp-body text-zinc-400 hover:text-gold transition-colors duration-200 text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar.... */}
        <div className="mt-12 border-t border-gold/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-clamp-label text-zinc-600 text-center sm:text-left">
            © 2025 N&K Fragrances. All rights reserved.
          </p>
          <p className="text-clamp-label text-zinc-600">
            Devloped by{" "}
            <a
              href="https://github.com/MalikZubair01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80"
            >
              Malik Zubair
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
