import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/*
 * GitHub Pages lets browsers cache index.html for up to 10 minutes, so right after a
 * deploy a returning visitor can still get the previous build. Ask the server for the
 * current index.html (bypassing the cache); if it points to a newer bundle, reload once
 * on a fresh URL so the visitor always sees the latest version.
 */
function ensureLatestBuild() {
  if (import.meta.env.DEV) return;
  const mine = document.querySelector('script[type="module"][src*="assets/index-"]')?.getAttribute("src")?.match(/index-[\w-]+\.js/)?.[0];
  if (!mine) return;
  fetch(`./index.html?check=${Date.now()}`, { cache: "no-store" })
    .then((r) => (r.ok ? r.text() : ""))
    .then((html) => {
      const live = html.match(/assets\/(index-[\w-]+\.js)/)?.[1];
      if (!live || live === mine) return;
      const key = `dc_reload_${live}`;
      try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch { /* private mode: still reload once */ }
      const url = new URL(window.location.href);
      url.searchParams.set("v", live.replace(/^index-|\.js$/g, ""));
      window.location.replace(url.toString());
    })
    .catch(() => {});
}
ensureLatestBuild();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
