import React, { useEffect, useState } from "react";
import { Clock, Phone, MapPin, Siren, Menu, X } from "lucide-react";
import { CLINIC, SPECIALTIES } from "./data.js";
import { navigate, useRoute } from "./router.js";
import { seedOnce } from "./lib.js";
import Home from "./views/Home.jsx";
import Explore from "./views/Explore.jsx";
import Book from "./views/Book.jsx";
import FindToken from "./views/FindToken.jsx";

const NAV = [
  { route: "home", label: "Home" },
  { route: "explore", label: "Overview / Explore" },
  { route: "token", label: "Find My Token" },
];

function NavLink({ item, active, onClick }) {
  return (
    <a
      href={`#/${item.route}`}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`px-1 py-6 text-[15px] font-medium border-b-2 ${active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
    >
      {item.label}
    </a>
  );
}

export default function App() {
  const { route, params } = useRoute();
  const [menu, setMenu] = useState(false);

  useEffect(() => { seedOnce(); }, []);
  useEffect(() => { setMenu(false); }, [route, params.doctor, params.spec, params.q]);
  useEffect(() => {
    const titles = { home: "OPD & Diagnostics", explore: "Doctors & Facilities", book: "Take Appointment", token: "Find My Token" };
    document.title = `DOCTOR'S CLINIC | ${titles[route]}`;
  }, [route]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Utility bar */}
      <div className="bg-ink text-white text-[13px] no-print">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-8 gap-y-1 py-2.5">
          <span className="inline-flex items-center gap-2"><Clock size={14} strokeWidth={1.75} aria-hidden="true" /><span className="text-neutral-400 uppercase tracking-widest text-[11px] font-semibold">Hours</span>{CLINIC.hours}</span>
          <a href={CLINIC.emergencyHref} className="inline-flex items-center gap-2 hover:underline"><Siren size={14} strokeWidth={1.75} aria-hidden="true" /><span className="text-neutral-400 uppercase tracking-widest text-[11px] font-semibold">24/7 Emergency</span><span className="font-mono">{CLINIC.emergency}</span></a>
          <span className="hidden md:inline-flex items-center gap-2"><MapPin size={14} strokeWidth={1.75} aria-hidden="true" />{CLINIC.address}</span>
        </div>
      </div>

      {/* Sticky header */}
      <header id="site-header" className="sticky top-0 z-40 bg-white border-b border-line no-print">
        <div className="container-x flex items-center justify-between gap-6 min-h-[76px]">
          <a href="#/home" className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-[0.06em]">DOCTOR'S CLINIC</span>
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">OPD &amp; Diagnostics</span>
          </a>
          <nav aria-label="Main" className="hidden lg:flex items-center gap-8">
            {NAV.map((n) => <NavLink key={n.route} item={n} active={route === n.route} />)}
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate("book")} className={`btn-primary hidden sm:inline-flex ${route === "book" ? "outline outline-2 outline-offset-2 outline-ink" : ""}`}>Take Appointment</button>
            <button type="button" className="lg:hidden inline-flex h-12 w-12 items-center justify-center border border-ink" aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu((m) => !m)}>
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav id="mobile-nav" aria-label="Mobile" className="lg:hidden border-t border-line bg-white">
            <div className="container-x flex flex-col py-2">
              {NAV.map((n) => (
                <a key={n.route} href={`#/${n.route}`} className={`py-4 border-b border-line text-base font-semibold ${route === n.route ? "text-ink" : "text-muted"}`}>{n.label}</a>
              ))}
              <button type="button" onClick={() => navigate("book")} className="btn-primary my-4 w-full">Take Appointment</button>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {route === "home" && <Home />}
        {route === "explore" && <Explore params={params} />}
        {route === "book" && <Book params={params} />}
        {route === "token" && <FindToken params={params} />}
      </main>

      {/* Footer */}
      <footer className="bg-ink text-white no-print">
        <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-extrabold tracking-[0.06em]">DOCTOR'S CLINIC</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-400">OPD &amp; Diagnostics</p>
            <p className="mt-6 text-sm leading-relaxed text-neutral-300">{CLINIC.address}</p>
            <p className="mt-3 text-sm"><a href={CLINIC.phoneHref} className="font-mono hover:underline">{CLINIC.phone}</a></p>
            <p className="text-sm"><a href={`mailto:${CLINIC.email}`} className="hover:underline text-neutral-300">{CLINIC.email}</a></p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">OPD Timings</p>
            <dl className="text-sm space-y-3 text-neutral-300">
              <div className="flex justify-between gap-4 border-b border-neutral-800 pb-3"><dt>Mon – Sat</dt><dd className="font-mono text-white">08:00 – 20:00</dd></div>
              <div className="flex justify-between gap-4 border-b border-neutral-800 pb-3"><dt>Sunday</dt><dd className="font-mono text-white">Closed</dd></div>
              <div className="flex justify-between gap-4 border-b border-neutral-800 pb-3"><dt>Lab &amp; Pharmacy</dt><dd className="font-mono text-white">24/7</dd></div>
            </dl>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">Departments</p>
            <ul className="space-y-2.5 text-sm">
              {SPECIALTIES.map((s) => (
                <li key={s.key}><a href={`#/explore?spec=${encodeURIComponent(s.key)}`} className="text-neutral-300 hover:text-white hover:underline">{s.key}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-5">Emergency</p>
            <a href={CLINIC.emergencyHref} className="block border border-white p-5 hover:bg-white hover:text-ink">
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest"><Phone size={14} aria-hidden="true" /> 24/7 Helpline</span>
              <span className="mt-2 block font-mono text-2xl font-semibold">{CLINIC.emergency}</span>
            </a>
            <p className="mt-4 text-sm text-neutral-400">For chest pain, breathing difficulty or injury, come straight to the Emergency &amp; Triage Unit.</p>
          </div>
        </div>
        <div className="border-t border-neutral-800">
          <div className="container-x flex flex-wrap justify-between gap-3 py-6 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} DOCTOR'S CLINIC. All rights reserved.</p>
            <p>Demo site: doctors, fees and contact details are placeholders.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
