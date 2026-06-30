// Centralized product catalogue.
// Image paths point to /public/images/products — replace with real product
// photography whenever it's available; everything else (cart, checkout,
// product page) reads from this single source of truth.

// const img = (slug, n) => `/images/products/${slug}-${n}.jpg`;

// export const products = [
//   {
//     id: "royal-oud",
//     name: "Royal Oud",
//     type: "Luxury Perfume",
//     price: 4999,
//     badge: "Best Seller",
//     rating: 4.9,
//     stock: 18,
//     sizes: ["30ml", "50ml", "100ml"],
//     images: [img("royal-oud", 1), img("royal-oud", 2), img("royal-oud", 3), img("royal-oud", 4)],
//     desc: "Deep woody oud with warm amber, precious resins and soft white musk. A regal statement for every occasion.",
//     notes: {
//       top: "Saffron, Bergamot",
//       heart: "Oud, Rose",
//       base: "Amber, White Musk",
//     },
//   },
//   {
//     id: "golden-mist",
//     name: "Golden Mist",
//     type: "Fresh Fragrance",
//     price: 3499,
//     badge: "New Arrival",
//     rating: 4.7,
//     stock: 24,
//     sizes: ["30ml", "50ml", "100ml"],
//     images: [img("golden-mist", 1), img("golden-mist", 2), img("golden-mist", 3), img("golden-mist", 4)],
//     desc: "A luminous, clean scent — sparkling citrus opens into blooming jasmine, settling into creamy vanilla.",
//     notes: {
//       top: "Citrus, Bergamot",
//       heart: "Jasmine, Orange Blossom",
//       base: "Vanilla, Musk",
//     },
//   },
//   {
//     id: "midnight-rose",
//     name: "Midnight Rose",
//     type: "Premium Attar",
//     price: 2999,
//     badge: null,
//     rating: 4.6,
//     stock: 30,
//     sizes: ["12ml", "30ml"],
//     images: [img("midnight-rose", 1), img("midnight-rose", 2), img("midnight-rose", 3), img("midnight-rose", 4)],
//     desc: "An elegant Bulgarian rose heart entwined with creamy sandalwood and a whisper of sweet oud.",
//     notes: {
//       top: "Bulgarian Rose",
//       heart: "Sandalwood",
//       base: "Oud, Sweet Musk",
//     },
//   },
//   {
//     id: "velvet-amber",
//     name: "Velvet Amber",
//     type: "Oriental Blend",
//     price: 5499,
//     badge: "Limited Edition",
//     rating: 4.8,
//     stock: 9,
//     sizes: ["30ml", "50ml", "100ml"],
//     images: [img("velvet-amber", 1), img("velvet-amber", 2), img("velvet-amber", 3), img("velvet-amber", 4)],
//     desc: "A rich oriental warmth — tonka bean, benzoin and sweet amber layered over a mossy base.",
//     notes: {
//       top: "Tonka Bean, Cinnamon",
//       heart: "Benzoin, Amber",
//       base: "Oakmoss, Vanilla",
//     },
//   },
//   {
//     id: "crystal-blue",
//     name: "Crystal Blue",
//     type: "Aquatic Fragrance",
//     price: 3199,
//     badge: null,
//     rating: 4.5,
//     stock: 21,
//     sizes: ["30ml", "50ml", "100ml"],
//     images: [img("crystal-blue", 1), img("crystal-blue", 2), img("crystal-blue", 3), img("crystal-blue", 4)],
//     desc: "Cool ocean breeze meets white cedar and light musk in this refreshing aquatic composition.",
//     notes: {
//       top: "Sea Breeze, Mint",
//       heart: "White Cedar",
//       base: "Light Musk",
//     },
//   },
//   {
//     id: "noir-elixir",
//     name: "Noir Elixir",
//     type: "Signature Oud",
//     price: 6999,
//     badge: "Flagship",
//     rating: 5.0,
//     stock: 0,
//     sizes: ["50ml", "100ml"],
//     images: [img("noir-elixir", 1), img("noir-elixir", 2), img("noir-elixir", 3), img("noir-elixir", 4)],
//     desc: "Our most prestigious creation. Dark, complex and hypnotic — oud, leather, and smoky incense.",
//     notes: {
//       top: "Black Pepper, Incense",
//       heart: "Leather, Oud",
//       base: "Smoked Woods",
//     },
//   },
// ];

// export const getProductById = (id) => products.find((p) => p.id === id);

// export const getRelatedProducts = (id, count = 3) =>
//   products.filter((p) => p.id !== id).slice(0, count);

// export const formatPKR = (amount) =>
//   `Rs. ${Number(amount).toLocaleString("en-PK")}`;


const productImg = (n) => `/images/product-${n}.jpg`;

const repeatImg = (n) => Array(4).fill(productImg(n));

export const products = [
  {
    id: "royal-oud",
    name: "Royal Oud",
    type: "Luxury Perfume",
    price: 4999,
    badge: "Best Seller",
    rating: 4.9,
    stock: 18,
    sizes: ["30ml", "50ml", "100ml"],
    images: repeatImg(1),
    desc: "Deep woody oud with warm amber, precious resins and soft white musk. A regal statement for every occasion.",
    notes: {
      top: "Saffron, Bergamot",
      heart: "Oud, Rose",
      base: "Amber, White Musk",
    },
  },
  {
    id: "golden-mist",
    name: "Golden Mist",
    type: "Fresh Fragrance",
    price: 3499,
    badge: "New Arrival",
    rating: 4.7,
    stock: 24,
    sizes: ["30ml", "50ml", "100ml"],
    images: repeatImg(2),
    desc: "A luminous, clean scent — sparkling citrus opens into blooming jasmine, settling into creamy vanilla.",
    notes: {
      top: "Citrus, Bergamot",
      heart: "Jasmine, Orange Blossom",
      base: "Vanilla, Musk",
    },
  },
  {
    id: "midnight-rose",
    name: "Midnight Rose",
    type: "Premium Attar",
    price: 2999,
    badge: null,
    rating: 4.6,
    stock: 30,
    sizes: ["12ml", "30ml"],
    images: repeatImg(3),
    desc: "An elegant Bulgarian rose heart entwined with creamy sandalwood and a whisper of sweet oud.",
    notes: {
      top: "Bulgarian Rose",
      heart: "Sandalwood",
      base: "Oud, Sweet Musk",
    },
  },
  {
    id: "velvet-amber",
    name: "Velvet Amber",
    type: "Oriental Blend",
    price: 5499,
    badge: "Limited Edition",
    rating: 4.8,
    stock: 9,
    sizes: ["30ml", "50ml", "100ml"],
    images: repeatImg(4),
    desc: "A rich oriental warmth — tonka bean, benzoin and sweet amber layered over a mossy base.",
    notes: {
      top: "Tonka Bean, Cinnamon",
      heart: "Benzoin, Amber",
      base: "Oakmoss, Vanilla",
    },
  },
  {
    id: "crystal-blue",
    name: "Crystal Blue",
    type: "Aquatic Fragrance",
    price: 3199,
    badge: null,
    rating: 4.5,
    stock: 21,
    sizes: ["30ml", "50ml", "100ml"],
    images: repeatImg(5),
    desc: "Cool ocean breeze meets white cedar and light musk in this refreshing aquatic composition.",
    notes: {
      top: "Sea Breeze, Mint",
      heart: "White Cedar",
      base: "Light Musk",
    },
  },
  {
    id: "noir-elixir",
    name: "Noir Elixir",
    type: "Signature Oud",
    price: 6999,
    badge: "Flagship",
    rating: 5.0,
    stock: 0,
    sizes: ["50ml", "100ml"],
    images: repeatImg(6),
    desc: "Our most prestigious creation. Dark, complex and hypnotic — oud, leather, and smoky incense.",
    notes: {
      top: "Black Pepper, Incense",
      heart: "Leather, Oud",
      base: "Smoked Woods",
    },
  },
];

export const getProductById = (id) => products.find((p) => p.id === id);

export const getRelatedProducts = (id, count = 3) =>
  products.filter((p) => p.id !== id).slice(0, count);

export const formatPKR = (amount) =>
  `Rs. ${Number(amount).toLocaleString("en-PK")}`;