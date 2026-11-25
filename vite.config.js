import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://yashgupta26cs-lang.github.io/RESTAR-LIFE-CLINIC/
export default defineConfig({
  plugins: [react()],
  base: "./",
});
