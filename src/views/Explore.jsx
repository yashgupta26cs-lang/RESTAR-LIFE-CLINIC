import React, { useEffect, useMemo, useState } from "react";
import { Search, X, SlidersHorizontal, Users, Building2, Clock, SearchX, Plus, MapPin } from "lucide-react";
import { DOCTORS, SPECIALTIES, FACILITIES, IMAGES } from "../data.js";
import { navigate, scrollToId } from "../router.js";
import { inr, nextAvailable, daysText, facilityStatus, floorOf } from "../lib.js";
import { Icon, Img, DoctorPhoto } from "../components/ui.jsx";
import { useProfile, useFacilityInfo } from "../components/Profile.jsx";
import { useHoverPreview, HoverPreviewCard } from "../components/HoverPreview.jsx";

const idx = (i) => `// ${String(i + 1).padStart(2, "0")}`;
const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
const STATUS_TAG = { coral: "tag-coral", mint: "tag-mint", muted: "tag-muted" };

const DOCTOR_PREVIEWS = DOCTORS.map((d) => ({
  key: d.id, src: d.photo, badge: "Profile", tone: "coral", pos: "top",
  meta: `${d.specialty} • ${d.exp} Yrs Exp • ${inr(d.fee)}`, cta: "Click for full info +",
}));
const FACILITY_PREVIEWS = FACILITIES.map((f) => ({
  key: f.id, src: IMAGES[f.img], badge: "Explore", tone: "brand",
  meta: `${floorOf(f)} • ${f.hoursShort}`, cta: "Click for full info +",
}));

/** Editorial directory row for a doctor. Click anywhere opens the doctor popup; Book goes straight to booking. */
function DoctorRow({ d, i, pv }) {
  const openProfile = useProfile();
  const next = nextAvailable(d);
  const today = next?.label === "Today";
  const open = () => { pv.hide(); openProfile(d); };
  return (
    <li {...pv.rowProps(d.id)}>
      <article className="dir-row group" onClick={open} data-doctor={d.id}>
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <span className="w-10 shrink-0 pt-1.5 font-mono text-[12px] font-medium text-slate/70 transition-colors duration-200 group-hover:text-coral">{idx(i)}</span>
          {!pv.fine && <DoctorPhoto doctor={d} rounded="rounded-lg" className="h-[68px] w-14 shrink-0" initialsClass="text-base" />}
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-snug sm:text-[21px]">
              <button type="button" onClick={stop(open)} className="text-left transition-colors duration-200 group-hover:text-brand">{d.name}</button>
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="tag-brand">{d.specialty}</span>
              <span className={today ? "tag-mint" : "tag-muted"}>
                {today ? <><span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" />Available today</> : next ? `Next: ${next.label}` : "Fully booked"}
              </span>
              <span className="tag-muted">{d.exp} yrs exp</span>
            </div>
            <p className="mt-2 line-clamp-1 text-[13.5px] text-slate">{d.designation} · {d.conditions.slice(0, 3).join(", ")}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-3 md:justify-end md:gap-6 md:border-0 md:pt-0">
          <div className="hidden w-[230px] text-right xl:block">
            <p className="truncate text-[13px] font-medium text-ink">{d.qual}</p>
            <p className="truncate font-mono text-[11.5px] text-slate">Reg. {d.regNo} · {daysText(d.days)}</p>
          </div>
          <div className="md:w-[104px] md:text-right">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate">Consultation</p>
            <p className="font-mono text-xl font-bold text-brand">{inr(d.fee)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-primary min-h-[44px] px-5" onClick={stop(() => navigate("book", { doctor: d.id }))} aria-label={`Book appointment with ${d.name}`}>Book</button>
            <button type="button" onClick={stop(open)} aria-label={`View full info for ${d.name}`}
              className="dir-plus group-hover:border-coral group-hover:bg-coral group-hover:text-white"><Plus size={19} aria-hidden="true" /></button>
          </div>
        </div>
      </article>
    </li>
  );
}

/** Editorial directory row for a facility. Click opens the facility popup. */
function FacilityRow({ f, i, pv }) {
  const openFacility = useFacilityInfo();
  const status = facilityStatus(f);
  const open = () => { pv.hide(); openFacility(f); };
  return (
    <li {...pv.rowProps(f.id)}>
      <article className="dir-row group" onClick={open} data-facility={f.id}>
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <span className="w-10 shrink-0 pt-1.5 font-mono text-[12px] font-medium text-slate/70 transition-colors duration-200 group-hover:text-brand">{idx(i)}</span>
          {!pv.fine && <Img src={IMAGES[f.img]} alt="" className="h-14 w-16 shrink-0 rounded-lg" />}
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold leading-snug sm:text-[21px]">
              <Icon name={f.icon} size={19} className="hidden shrink-0 text-brand sm:block" />
              <button type="button" onClick={stop(open)} className="text-left transition-colors duration-200 group-hover:text-brand">{f.title}</button>
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={STATUS_TAG[status.tone]}>{status.label}</span>
              <span className="tag-muted">{floorOf(f)}</span>
            </div>
            <p className="mt-2 line-clamp-1 text-[13.5px] text-slate">{f.summary}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-3 md:justify-end md:gap-6 md:border-0 md:pt-0">
          <div className="hidden w-[210px] text-right lg:block">
            <p className="flex items-center justify-end gap-1.5 font-mono text-[12.5px] text-ink"><Clock size={13} className="text-brand" aria-hidden="true" />{f.hoursShort}</p>
            <p className="mt-0.5 flex items-center justify-end gap-1.5 truncate text-[12px] text-slate"><MapPin size={12} className="text-brand" aria-hidden="true" />{f.location}</p>
          </div>
          <p className="text-[13.5px] font-bold text-brand md:w-[210px] md:text-right">{f.price}</p>
          <button type="button" onClick={stop(open)} aria-label={`View details for ${f.title}`}
            className="dir-plus group-hover:border-brand group-hover:bg-brand group-hover:text-cream"><Plus size={19} aria-hidden="true" /></button>
        </div>
      </article>
    </li>
  );
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
function matches(d, q) {
  if (!q) return true;
  const hay = norm([d.name, d.specialty, d.qual, d.designation, ...d.conditions, ...d.languages].join(" "));
  const words = norm(q).split(" ").filter((w) => w && !["dr", "doctor", "for", "and", "the", "pain"].includes(w));
  if (!words.length) return hay.includes(norm(q));
  return words.every((w) => hay.includes(w) || hay.includes(w.replace(/s$/, "")));
}

export default function Explore({ params }) {
  const [q, setQ] = useState(params.q || "");
  const [spec, setSpec] = useState(params.spec || "All");
  const [sort, setSort] = useState("recommended");
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

  const docPv = useHoverPreview();
  const facPv = useHoverPreview();
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
            <p className="lead mt-4 max-w-xl">Find the right specialist by name, department or symptom, compare fees and next available slots, and see the diagnostics available on site. Tap or click any row for full details.</p>
          </div>
          <Img src={IMAGES.lounge} alt="Patient waiting lounge with teal sofas" eager className="hidden h-48 rounded-xl border border-line lg:block" />
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
          <ol {...docPv.listProps} className="mt-6 space-y-3" aria-label="Doctors">
            {list.map((d, i) => <DoctorRow key={d.id} d={d} i={i} pv={docPv} />)}
          </ol>
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
          <ol {...facPv.listProps} className="mt-10 space-y-3" aria-label="Facilities">
            {FACILITIES.map((f, i) => <FacilityRow key={f.id} f={f} i={i} pv={facPv} />)}
          </ol>
        </div>
      </section>

      <HoverPreviewCard preview={docPv} items={DOCTOR_PREVIEWS} />
      <HoverPreviewCard preview={facPv} items={FACILITY_PREVIEWS} />
    </>
  );
}
