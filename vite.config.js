import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build stamp shown in the footer, in the clinic's time zone, so anyone can tell which version they are looking at.
const BUILD_LABEL = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " IST";

// Served from https://yashgupta26cs-lang.github.io/RESTAR-LIFE-CLINIC/
export default defineConfig({
  plugins: [react()],
  base: "./",
  define: { __BUILD_LABEL__: JSON.stringify(BUILD_LABEL) },
});
