/** Editorial monochrome design system: sharp, static, flat. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // Every radius resolves to 0, so no utility can round a corner.
    borderRadius: { none: "0px", DEFAULT: "0px", sm: "0px", md: "0px", lg: "0px", xl: "0px", "2xl": "0px", "3xl": "0px", full: "0px" },
    // No motion and no depth.
    transitionProperty: { none: "none", DEFAULT: "none" },
    transitionDuration: { 0: "0ms", DEFAULT: "0ms" },
    animation: { none: "none" },
    keyframes: {},
    boxShadow: { none: "none", DEFAULT: "none" },
    dropShadow: { none: "0 0 #0000" },
    backdropBlur: { none: "0" },
    extend: {
      colors: {
        ink: "#000000",
        canvas: "#FFFFFF",
        surface: "#F5F5F5",
        muted: "#525252",
        line: "#E5E5E5",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Helvetica Neue", "Arial", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      letterSpacing: { widest: "0.16em" },
    },
  },
  plugins: [],
};
