// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],

//   theme: {
//     extend: {
//       fontFamily: {
//         prim: ["Cinzel", "serif"],
//         sec: ["Poppins", "sans-serif"],
//       },

//       colors: {
//         gold: "#D4AF37",
//         goldLight: "#E5C76B",
//         goldDark: "#B8860B",
//         dark: "#0B0B0B",
//         card: "#111111",
//       },

//       backgroundImage: {
//         "custom-bg":
//           "radial-gradient(circle at center, #3a2a12 0%, #151515 40%, #000000 100%)",
//         "gold-gradient":
//           "linear-gradient(135deg, #E5C76B 0%, #D4AF37 45%, #B8860B 100%)",
//       },
//     },
//   },

//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#b8952a",
        goldLight: "#d4a832",
        goldDim: "#7a621a",
        card: "#111111",
        surface: "#161616",
        border: "rgba(184,149,42,0.25)",
      },
      fontFamily: {
        prim: ["Cormorant Garamond", "serif"],
        sans: ["Poppins", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};
