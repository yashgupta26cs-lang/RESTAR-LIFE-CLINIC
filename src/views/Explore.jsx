import React, { useEffect, useMemo, useState } from "react";
import { Search, X, SlidersHorizontal, Users, Building2, MapPin, Clock, CheckCircle2, SearchX } from "lucide-react";
import { DOCTORS, SPECIALTIES, FACILITIES, IMAGES } from "../data.js";
import { scrollToId } from "../router.js";
import { Icon, Img } from "../components/ui.jsx";
import DoctorCard from "../components/DoctorCard.jsx";
import DoctorModal from "../components/DoctorModal.jsx";

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
function matches(d, q) {
  if (!q) return true;
  const hay = norm([d.name, d.specialty, d.qual, ...d.conditions, ...d.languages].join(" "));
  const words = norm(q).split(" ").filter((w) => w && !["dr", "doctor", "for", "and", "the", "pain"].includes(w));
  if (!words.length) return hay.includes(norm(q));
  return words.every((w) => hay.includes(w) || hay.includes(w.replace(/s$/, "")));
}

export default function Explore({ params }) {
  const [q, setQ] = useState(params.q || "");
  const [spec, setSpec] = useState(params.spec || "All");
  const [sort, setSort] = useState("recommended");
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState(params.tab === "facilities" ? "facilities" : "doctors");

  useEffect(() => { setQ(params.q || ""); setSpec(params.spec || "All"); }, [params.q, params.spec]);
  useEffect(() => {
    if (params.tab === "facilities") scrollToId("facilities");
    else if (params.q || params.spec || params.tab === "doctors") scrollToId("doctors");
  }, [params.tab, params.q, params.spec]);
  useEffect(() => {
    const on = () => { const f = document.getElementById("facilities"); if (f) setTab(f.getBoundingClientRect().top < 220 ? "facilities" : "doctors"); };
    window.addEventListener("scroll", on, { passive: true }); return () => window.removeEventListener("scroll", on);
  }, []);

  const list = useMemo(() => {
    const r = DOCTORS.filter((d) => (spec === "All" || d.specialty === spec) && matches(d, q));
    if (sort === "fee") r.sort((a, b) => a.fee - b.fee);
    if (sort === "exp") r.sort((a, b) => b.exp - a.exp);
    return r;
  }, [q, spec, sort]);

  const jump = (id) => { setTab(id); scrollToId(id); };
  const reset = () => { setQ(""); setSpec("All"); setSort("recommended"); };

  return (
    <>
      {/* Page header */}
      <section className="border-b border-line bg-sand">
        <div className="container-x grid items-center gap-8 py-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow mb-3">Overview / Explore</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">Our doctors &amp; clinic facilities</h1>
            <p className="lead mt-4 max-w-xl">Find the right specialist by name, department or symptom, compare timings and fees, and see the diagnostics available on site.</p>
          </div>
          <Img src={IMAGES.lobby} alt="Clinic interior" className="hidden h-48 rounded-xl border border-line lg:block" />
        </div>
      </section>

      {/* Quick jump tabs */}
      <div className="sticky top-[74px] z-30 border-b border-line bg-cream/95 no-print">
        <div className="container-x flex gap-2 py-3" role="tablist" aria-label="Jump to section">
          {[["doctors", "Our Doctors", Users, DOCTORS.length], ["facilities", "Clinic Facilities", Building2, FACILITIES.length]].map(([id, label, I, n]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => jump(id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-display text-[14px] font-semibold transition-all duration-200 ease-out ${tab === id ? "bg-brand text-cream shadow-card" : "text-slate hover:bg-white hover:text-brand"}`}>
              <I size={16} aria-hidden="true" /> {label} <span className={`rounded-full px-2 text-[12px] font-mono ${tab === id ? "bg-white/15" : "bg-sand"}`}>{n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* A. Doctors */}
      <section id="doctors" className="container-x scroll-mt-40 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">A. Available doctors</p>
            <h2 className="h2">Doctors directory</h2>
          </div>
        </div>

        <div className="card p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate" aria-hidden="true" />
              <label htmlFor="doc-search" className="sr-only">Search by doctor name, specialty or condition</label>
              <input id="doc-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by doctor name, specialty or condition (e.g. migraine)"
                className="field-input pl-11 pr-10" />
              {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate hover:bg-sand"><X size={16} /></button>}
            </div>
            <div className="relative md:w-64">
              <label htmlFor="doc-sort" className="sr-only">Sort doctors</label>
              <SlidersHorizontal size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate" aria-hidden="true" />
              <select id="doc-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="field-input pl-10">
                <option value="recommended">Sort: Recommended</option>
                <option value="fee">Fee: Low to High</option>
                <option value="exp">Experience: High to Low</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by specialty">
            {["All", ...SPECIALTIES.map((s) => s.key)].map((s) => (
              <button key={s} type="button" aria-pressed={spec === s} onClick={() => setSpec(s)} className={spec === s ? "chip-on" : "chip-off"}>
                {s !== "All" && <Icon name={SPECIALTIES.find((x) => x.key === s).icon} size={14} />}{s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[14px] text-slate" aria-live="polite">
          Showing <span className="font-semibold text-ink">{list.length}</span> of {DOCTORS.length} doctors
          {spec !== "All" && <> in <span className="font-semibold text-ink">{spec}</span></>}
          {q && <> matching “<span className="font-semibold text-ink">{q}</span>”</>}
          {(q || spec !== "All") && <button type="button" onClick={reset} className="ml-2 font-semibold text-brand hover:underline">Clear filters</button>}
        </p>

        {list.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d) => <DoctorCard key={d.id} doctor={d} onProfile={setProfile} />)}
          </div>
        ) : (
          <div className="mt-6 card flex flex-col items-center p-12 text-center">
            <SearchX size={36} className="text-slate" aria-hidden="true" />
            <p className="mt-4 font-display text-lg font-bold">No doctors match that search</p>
            <p className="mt-1 text-slate">Try a specialty such as “Cardiology” or a symptom such as “fever”.</p>
            <button type="button" onClick={reset} className="btn-secondary mt-5">Show all doctors</button>
          </div>
        )}
      </section>

      {/* B. Facilities */}
      <section id="facilities" className="scroll-mt-40 border-t border-line bg-sand py-16">
        <div className="container-x">
          <p className="eyebrow mb-2">B. Facilities &amp; infrastructure</p>
          <h2 className="h2">Available facilities</h2>
          <p className="lead mt-3 max-w-2xl">Everything most visits need, from blood tests to X-rays and medicines, is on site, so you don't have to travel between centres.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((f) => (
              <article key={f.title} className="card card-hover flex flex-col overflow-hidden">
                <div className="relative">
                  <Img src={IMAGES[f.img]} alt={f.title} className="h-48" />
                  <span className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-brand shadow-card"><Icon name={f.icon} size={20} /></span>
                  {f.hours === "Open 24/7" && <span className="absolute right-3 top-3 badge bg-coral text-white">24/7</span>}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-slate">{f.desc}</p>
                  <dl className="mt-4 space-y-1.5 text-[13px]">
                    <div className="flex items-center gap-2 text-slate"><Clock size={14} className="text-brand" aria-hidden="true" /><dt className="sr-only">Hours</dt><dd className="font-mono">{f.hours}</dd></div>
                    <div className="flex items-center gap-2 text-slate"><MapPin size={14} className="text-brand" aria-hidden="true" /><dt className="sr-only">Location</dt><dd>{f.location}</dd></div>
                  </dl>
                  <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-[13.5px]">
                    {f.features.map((x) => <li key={x} className="flex items-start gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-mint" aria-hidden="true" />{x}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {profile && <DoctorModal doctor={profile} onClose={() => setProfile(null)} />}
    </>
  );
}
