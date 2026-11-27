/** DOCTOR'S CLINIC design system: warm cream surfaces, emerald brand, mint + coral accents. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        sand: "#F2ECE1",
        line: "#E6DFD3",
        brand: { DEFAULT: "#0F5C52", dark: "#0B4740", soft: "#E3EFEC" },
        mint: { DEFAULT: "#14B8A6", soft: "#DDF5F1", ink: "#0B7A6E" },
        coral: { DEFAULT: "#E86A4A", soft: "#FCE9E3", ink: "#B8482C" },
        ink: "#18221F",
        slate: { DEFAULT: "#5A6561" },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(24,34,31,0.04), 0 1px 3px rgba(24,34,31,0.06)",
        lift: "0 10px 30px -12px rgba(15,92,82,0.22)",
        float: "0 18px 40px -16px rgba(24,34,31,0.28)",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        popIn: { from: { opacity: 0, transform: "translateY(8px) scale(0.985)" }, to: { opacity: 1, transform: "none" } },
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
        popIn: "popIn 220ms ease-out",
      },
    },
  },
  plugins: [],
};
