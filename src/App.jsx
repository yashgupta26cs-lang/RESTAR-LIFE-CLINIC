import React, { useEffect, useState } from "react";
import { Clock, Phone, MapPin, Siren, Menu, X, CalendarPlus, Mail, ArrowUpRight, ShieldCheck } from "lucide-react";
import { CLINIC, SPECIALTIES } from "./data.js";
import { navigate, useRoute } from "./router.js";
import { seedOnce } from "./lib.js";
import Logo from "./components/Logo.jsx";
import { ProfileProvider } from "./components/Profile.jsx";
import Home from "./views/Home.jsx";
import Explore from "./views/Explore.jsx";
import Book from "./views/Book.jsx";
import FindToken from "./views/FindToken.jsx";

// Seed sample bookings before the first render, so a direct #/token?q=DC-099 link finds them.
seedOnce();

const NAV = [
  { route: "home", label: "Home" },
  { route: "explore", label: "Overview / Explore" },
  { route: "token", label: "Find My Token" },
];

export default function App() {
  const { route, params } = useRoute();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMenu(false); }, [route, params.doctor, params.spec, params.q]);
  useEffect(() => {
    const titles = { home: "Multispecialty OPD & Diagnostics", explore: "Doctors & Facilities", book: "Take Appointment", token: "Find My Token" };
    document.title = `DOCTOR'S CLINIC | ${titles[route]}`;
  }, [route]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <ProfileProvider>
    <div className="flex min-h-screen flex-col">
      {/* Announcement strip */}
      <div className="bg-brand text-[13px] text-cream no-print">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-1.5 py-2.5 sm:justify-between">
          <span className="inline-flex items-center gap-2"><Clock size={14} aria-hidden="true" className="text-mint" /><span className="text-cream/70">OPD Hours</span> Mon–Sat: 8:00 AM – 8:00 PM</span>
          <a href={CLINIC.phoneHref} className="hidden items-center gap-2 transition-colors duration-200 hover:text-white sm:inline-flex">
            <Phone size={14} aria-hidden="true" className="text-mint" /><span className="text-cream/70">Reception</span><span className="font-mono font-semibold">{CLINIC.phone}</span>
          </a>
          <a href={CLINIC.emergencyHref} className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-white">
            <Siren size={14} aria-hidden="true" className="text-coral" /><span className="text-cream/70">24/7 Emergency</span><span className="font-mono font-semibold">{CLINIC.emergency}</span>
          </a>
          <span className="hidden items-center gap-2 2xl:inline-flex"><MapPin size={14} aria-hidden="true" className="text-mint" />{CLINIC.addressShort}</span>
          <span className="hidden items-center gap-1.5 rounded-full border border-mint/40 bg-white/10 px-2.5 py-0.5 text-[12px] font-semibold xl:inline-flex"><ShieldCheck size={13} aria-hidden="true" className="text-mint" />{CLINIC.accreditation.title}</span>
        </div>
      </div>

      {/* Sticky header */}
      <header id="site-header" className={`sticky top-0 z-40 border-b bg-[#FFFDFA]/95 transition-all duration-200 ease-out no-print ${scrolled ? "border-line shadow-card" : "border-transparent"}`}>
        <div className="container-x flex min-h-[74px] items-center justify-between gap-6">
          <a href="#/home" aria-label="DOCTOR'S CLINIC home" className="min-w-0"><Logo size={40} subClass="hidden sm:block" /></a>
          <nav aria-label="Main" className="hidden items-center gap-1 rounded-full border border-line bg-cream p-1 lg:flex">
            {NAV.map((n) => {
              const active = route === n.route;
              return (
                <a key={n.route} href={`#/${n.route}`} aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 font-display text-[14px] font-semibold transition-all duration-200 ease-out ${active ? "bg-white text-brand shadow-card" : "text-slate hover:text-brand"}`}>
                  {n.label}
                </a>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate("book")} className={`btn-primary hidden sm:inline-flex ${route === "book" ? "ring-2 ring-mint ring-offset-2 ring-offset-[#FFFDFA]" : ""}`}>
              <CalendarPlus size={17} aria-hidden="true" /> Take Appointment
            </button>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white transition-all duration-200 hover:border-brand lg:hidden"
              aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu((m) => !m)}>
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-[#FFFDFA] lg:hidden animate-fadeIn">
            <div className="container-x flex flex-col py-2">
              {NAV.map((n) => (
                <a key={n.route} href={`#/${n.route}`} className={`border-b border-line py-4 font-display text-base font-semibold ${route === n.route ? "text-brand" : "text-ink"}`}>{n.label}</a>
              ))}
              <button type="button" onClick={() => navigate("book")} className="btn-primary my-4 w-full"><CalendarPlus size={17} aria-hidden="true" /> Take Appointment</button>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <div key={route} className="animate-fadeIn">
          {route === "home" && <Home />}
          {route === "explore" && <Explore params={params} />}
          {route === "book" && <Book params={params} />}
          {route === "token" && <FindToken params={params} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#10231F] text-cream no-print">
        <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo size={44} inverse sub="OPD & Diagnostics" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/70">Warm, unhurried multispecialty care with modern diagnostics under one roof.</p>
            <p className="mt-5 flex gap-2.5 text-sm text-cream/80"><MapPin size={16} className="mt-0.5 shrink-0 text-mint" aria-hidden="true" /><span>{CLINIC.address}<span className="mt-0.5 block text-[12.5px] text-cream/55">{CLINIC.landmark}</span></span></p>
            <p className="mt-3 flex items-center gap-2.5 text-sm"><Phone size={16} className="text-mint" aria-hidden="true" /><span className="text-cream/60">Reception</span><a href={CLINIC.phoneHref} className="font-mono hover:text-white">{CLINIC.phone}</a></p>
            <p className="mt-2 flex items-center gap-2.5 text-sm"><Mail size={16} className="text-mint" aria-hidden="true" /><a href={`mailto:${CLINIC.email}`} className="text-cream/80 hover:text-white">{CLINIC.email}</a></p>
          </div>
          <div>
            <p className="mb-5 font-display text-sm font-bold uppercase tracking-[0.14em] text-cream/60">Timings</p>
            <dl className="space-y-3 text-sm">
              {[["OPD · Mon – Sat", "08:00 – 20:00"], ["Sunday", "Closed"], ["Lab & Pharmacy", "24/7"], ["Emergency", "24/7"]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-3"><dt className="text-cream/70">{k}</dt><dd className="font-mono">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div>
            <p className="mb-5 font-display text-sm font-bold uppercase tracking-[0.14em] text-cream/60">Departments</p>
            <ul className="space-y-2.5 text-sm">
              {SPECIALTIES.map((s) => (
                <li key={s.key}><a href={`#/explore?spec=${encodeURIComponent(s.key)}`} className="text-cream/80 transition-colors duration-200 hover:text-mint">{s.key}</a></li>
              ))}
              <li><a href="#/token" className="text-cream/80 transition-colors duration-200 hover:text-mint">Find My Token</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-5 font-display text-sm font-bold uppercase tracking-[0.14em] text-cream/60">Helpline</p>
            <a href={CLINIC.emergencyHref} className="group block rounded-xl border border-coral/40 bg-coral/10 p-5 transition-all duration-200 hover:border-coral hover:bg-coral/20">
              <span className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.14em] text-coral"><span className="flex items-center gap-2"><Siren size={15} aria-hidden="true" /> 24/7 Emergency</span><ArrowUpRight size={16} aria-hidden="true" /></span>
              <span className="mt-2 block font-mono text-2xl font-bold text-cream">{CLINIC.emergency}</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-cream/60">For chest pain, breathing difficulty or injury, come straight to the Emergency &amp; Triage unit at the rear entrance.</p>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint"><ShieldCheck size={20} aria-hidden="true" /></span>
              <span className="text-[12.5px] leading-snug">
                <span className="block font-semibold text-cream">{CLINIC.accreditation.title}</span>
                <span className="block text-cream/60">{CLINIC.accreditation.hygiene}</span>
                <span className="mt-1 block font-mono text-[11px] text-cream/50">Reg. {CLINIC.establishmentReg}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-x flex flex-wrap justify-between gap-3 py-6 text-xs text-cream/50">
            <p>© {new Date().getFullYear()} DOCTOR'S CLINIC. All rights reserved.</p>
            <p>Demo site: doctors, registration numbers, fees, contact details and accreditation are placeholders.</p>
          </div>
        </div>
      </footer>
    </div>
    </ProfileProvider>
  );
}
