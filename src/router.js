import { useEffect, useState } from "react";

/** Tiny hash router: #/explore?spec=Cardiology. Hash URLs never 404 on GitHub Pages. */
export function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [path, qs = ""] = raw.split("?");
  const route = ["home", "explore", "book", "token"].includes(path) ? path : "home";
  return { route, params: Object.fromEntries(new URLSearchParams(qs)) };
}

export function navigate(route, params = {}) {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")).toString();
  const next = `#/${route}${qs ? `?${qs}` : ""}`;
  if (window.location.hash === next) window.dispatchEvent(new HashChangeEvent("hashchange"));
  else window.location.hash = next;
}

export function useRoute() {
  const [loc, setLoc] = useState(parseHash);
  useEffect(() => {
    const on = () => { setLoc(parseHash()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return loc;
}

/** Scroll to an element id, below the sticky header. */
export function scrollToId(id) {
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    const header = document.getElementById("site-header");
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - (header ? header.offsetHeight : 0) - 8);
  });
}
