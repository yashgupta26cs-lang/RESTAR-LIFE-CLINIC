import React, { useEffect, useMemo, useState } from "react";
import { Search, Languages, Clock, MapPin, X, GraduationCap } from "lucide-react";
import { DOCTORS, SPECIALTIES, FACILITIES, IMAGES } from "../data.js";
import { navigate, scrollToId } from "../router.js";
import { inr } from "../lib.js";
import { Photo, Badge, Monogram, SectionHead, PageHead, ICONS, docSchedule } from "../components/ui.jsx";
import DoctorModal from "../components/DoctorModal.jsx";

const FILTERS = ["All", ...SPECIALTIES.map((s) => s.key)];

export default function Explore({ params }) {
  const [q, setQ] = useState(params.q || "");
  const [spec, setSpec] = useState(FILTERS.includes(params.spec) ? params.spec : "All");
  const [sort, setSort] = useState("default");
  const [profile, setProfile] = useState(null);

  // Keep in sync when arriving from Home with new params
  useEffect(() => {
    setQ(params.q || "");
    setSpec(FILTERS.includes(params.spec) ? params.spec : "All");
    if (params.section) scrollToId(params.section);
    else if (params.q || params.spec) scrollToId("doctors");
  }, [params.q, params.spec, params.section]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    let l = DOCTORS.filter((d) => {
      if (spec !== "All" && d.specialty !== spec) return false;
      if (!t) return true;
      const hay = [d.name, d.specialty, d.qual, ...d.conditions, ...d.languages].join(" ").toLowerCase();
      return t.split(/\s+/).every((w) => hay.includes(w.replace(/^dr\.?$/, "")));
    });
    if (sort === "fee") l = [...l].sort((a, b) => a.fee - b.fee);
    if (sort === "exp") l = [...l].sort((a, b) => b.exp - a.exp);
    return l;
  }, [q, spec, sort]);

  const clear = () => { setQ(""); setSpec("All"); setSort("default"); };

  return (
    <>
      <PageHead eyebrow="Overview / Explore" title="Doctors, departments & facilities">
        Search our specialists by name, department or condition, then book a slot directly.
      </PageHead>

      <div className="sticky top-[76px] z-30 hidden md:block border-b border-line bg-white">
        <div className="container-x flex gap-8 text-sm font-semibold">
          <button type="button" onClick={() => scrollToId("doctors")} className="py-4 border-b-2 border-transparent hover:border-ink">A. Doctors Directory</button>
          <button type="button" onClick={() => scrollToId("facilities")} className="py-4 border-b-2 border-transparent hover:border-ink">B. Facilities &amp; Infrastructure</button>
        </div>
      </div>

      {/* A. Directory */}
      <section id="doctors" className="py-16 md:py-20">
        <div className="container-x">
          <SectionHead eyebrow="A · Doctors Directory" title="Find the right specialist." className="mb-8" />

          <div className="grid gap-3 md:grid-cols-[1fr_260px]">
            <div className="flex border border-ink">
              <span className="flex items-center pl-4" aria-hidden="true"><Search size={20} strokeWidth={1.75} /></span>
              <label htmlFor="dir-search" className="sr-only">Search by name, specialty or condition</label>
              <input id="dir-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, specialty or condition (e.g. migraine)"
                className="min-w-0 flex-1 bg-white px-4 py-3.5 text-base outline-none placeholder:text-neutral-400" />
              {q && <button type="button" onClick={() => setQ("")} className="px-4 hover:bg-surface" aria-label="Clear search"><X size={18} /></button>}
            </div>
            <div>
              <label htmlFor="dir-sort" className="sr-only">Sort doctors</label>
              <select id="dir-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="field-input font-semibold text-[15px]">
                <option value="default">Sort: Recommended</option>
                <option value="fee">Fee: Low to High</option>
                <option value="exp">Experience: High to Low</option>
              </select>
            </div>
          </div>

          <div role="tablist" aria-label="Filter by specialty" className="mt-5 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} type="button" role="tab" aria-selected={spec === f} onClick={() => setSpec(f)}
                className={`border px-4 py-2 text-sm font-semibold ${spec === f ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"}`}>
                {f}
              </button>
            ))}
          </div>

          <p className="mt-6 mb-6 font-mono text-[13px] text-muted" aria-live="polite">
            Showing {list.length} of {DOCTORS.length} doctors{spec !== "All" ? ` in ${spec}` : ""}{q ? ` matching "${q}"` : ""}
          </p>

          {list.length === 0 ? (
            <div className="border border-line bg-surface p-12 text-center">
              <p className="text-lg font-semibold">No doctors match your search.</p>
              <p className="mt-2 text-muted">Try another name, department or symptom, or <button type="button" onClick={clear} className="font-semibold text-ink underline underline-offset-4">clear all filters</button>.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((d) => (
                <article key={d.id} className="flex flex-col border border-line hover:border-neutral-400">
                  <div className="flex items-start gap-4 border-b border-line bg-surface p-6">
                    <Monogram name={d.name} />
                    <div className="min-w-0">
                      <Badge>{d.specialty}</Badge>
                      <h3 className="mt-2 text-xl font-bold tracking-tight">{d.name}</h3>
                      <p className="text-sm text-muted">{d.qual}</p>
                    </div>
                  </div>
                  <dl className="px-6 text-sm">
                    <div className="flex justify-between gap-4 border-b border-line py-3"><dt className="text-muted">Experience</dt><dd className="font-medium">{d.exp} years</dd></div>
                    <div className="flex justify-between gap-4 border-b border-line py-3"><dt className="text-muted inline-flex items-center gap-1.5"><Languages size={15} aria-hidden="true" />Languages</dt><dd className="text-right font-medium">{d.languages.join(", ")}</dd></div>
                    <div className="flex justify-between gap-4 border-b border-line py-3"><dt className="text-muted inline-flex items-center gap-1.5 shrink-0"><Clock size={15} aria-hidden="true" />Available</dt><dd className="text-right font-medium">{docSchedule(d)}</dd></div>
                    <div className="flex items-baseline justify-between gap-4 py-3.5"><dt className="text-muted">Consultation fee</dt><dd className="font-mono text-2xl font-semibold">{inr(d.fee)}</dd></div>
                  </dl>
                  <div className="mt-auto grid grid-cols-2 gap-2 p-6 pt-2">
                    <button type="button" onClick={() => setProfile(d)} className="btn-secondary px-3">View Profile</button>
                    <button type="button" onClick={() => navigate("book", { doctor: d.id })} className="btn-primary px-3">Book Appointment</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* B. Facilities */}
      <section id="facilities" className="bg-surface py-16 md:py-24 border-t border-line">
        <div className="container-x">
          <SectionHead eyebrow="B · Hospital Facilities & Infrastructure" title="Diagnostics, pharmacy and emergency care under one roof." />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((f) => {
              const Icon = ICONS[f.icon];
              return (
                <article key={f.title} className="flex flex-col border border-line bg-white">
                  <Photo src={IMAGES[f.img]} alt={f.title} className="aspect-[16/10] border-0 border-b" />
                  <div className="flex flex-1 flex-col p-6">
                    <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="mt-4 text-xl font-bold tracking-tight">{f.title}</h3>
                    <p className="mt-2 text-[15px] text-muted line-clamp-2">{f.desc}</p>
                    <dl className="mt-auto pt-5 text-[13px]">
                      <div className="flex items-center gap-2 border-t border-line py-2.5"><MapPin size={14} aria-hidden="true" /><dt className="sr-only">Location</dt><dd>{f.location}</dd></div>
                      <div className="flex items-center gap-2 border-t border-line pt-2.5"><Clock size={14} aria-hidden="true" /><dt className="sr-only">Hours</dt><dd className="font-mono">{f.hours}</dd></div>
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {profile && <DoctorModal doctor={profile} onClose={() => setProfile(null)} />}
    </>
  );
}
