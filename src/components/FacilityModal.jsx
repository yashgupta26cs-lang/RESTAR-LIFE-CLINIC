import React from "react";
import { MapPin, Clock, IndianRupee, CheckCircle2, Phone, CalendarPlus, Siren, ListChecks } from "lucide-react";
import { CLINIC, IMAGES } from "../data.js";
import { navigate } from "../router.js";
import { facilityStatus } from "../lib.js";
import { Icon, Img } from "./ui.jsx";
import ModalShell, { SubHead } from "./Modal.jsx";

const PILL = { coral: "bg-coral text-white", mint: "bg-mint-soft text-mint-ink", muted: "bg-white/95 text-slate" };

/** Facility info popup: photo, location, hours, pricing, what's available and a call / book action. */
export default function FacilityModal({ facility: f, onClose }) {
  const status = facilityStatus(f);
  const emergency = f.id === "emergency";
  return (
    <ModalShell onClose={onClose} labelledBy="fac-title" describedBy="fac-desc" closeLabel="Close facility details" maxW="max-w-[620px]">
      <div className="relative shrink-0">
        <Img src={IMAGES[f.img]} alt={f.title} eager className="h-44 sm:h-56" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1F1B]/85 to-transparent px-5 pb-4 pt-14 sm:px-6">
          <span className={`badge ${PILL[status.tone]} uppercase tracking-[0.1em] text-[11px]`}>{status.label}</span>
          <h2 id="fac-title" className="mt-2 flex items-center gap-2.5 font-display text-[22px] font-bold leading-tight text-white sm:text-2xl">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/95 text-brand"><Icon name={f.icon} size={19} /></span>
            {f.title}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
        <dl className="grid gap-2 sm:grid-cols-3 sm:gap-3">
          {[[MapPin, "Location", f.location], [Clock, "Hours", f.hours], [IndianRupee, "Pricing", f.price]].map(([I, k, v]) => (
            <div key={k} className="flex items-start gap-2.5 rounded-xl border border-line bg-cream p-3">
              <I size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate">{k}</dt>
                <dd className={`mt-0.5 text-[13px] font-semibold leading-snug text-ink ${k === "Hours" ? "font-mono text-[12.5px]" : ""}`}>{v}</dd>
              </div>
            </div>
          ))}
        </dl>
        <p id="fac-desc" className="mt-5 text-[14.5px] leading-relaxed text-slate">{f.desc}</p>
        <section className="mt-6">
          <SubHead icon={ListChecks}>What's available</SubHead>
          <ul className="space-y-2">
            {f.features.map((x) => <li key={x} className="flex items-start gap-2.5 text-[14px] text-ink"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-mint" aria-hidden="true" />{x}</li>)}
          </ul>
        </section>
        <p className="mt-6 rounded-lg border border-line bg-sand/60 px-4 py-3 text-[12.5px] leading-relaxed text-slate">
          {CLINIC.address}. Reception <span className="whitespace-nowrap font-mono text-ink">{CLINIC.phone}</span>.
        </p>
      </div>

      <footer className="flex flex-wrap items-center gap-2 border-t border-line bg-white px-4 py-3 sm:px-6">
        {emergency ? (
          <a href={CLINIC.emergencyHref} className="btn-coral flex-1 sm:ml-auto sm:flex-none"><Siren size={17} aria-hidden="true" /> Call 24/7 Emergency</a>
        ) : (
          <>
            <a href={CLINIC.phoneHref} className="btn-secondary flex-1 sm:flex-none"><Phone size={16} aria-hidden="true" /> Call Reception</a>
            <button type="button" className="btn-primary flex-1 sm:ml-auto sm:flex-none" onClick={() => { onClose(); navigate("book"); }}>
              <CalendarPlus size={17} aria-hidden="true" /> Take Appointment
            </button>
          </>
        )}
      </footer>
    </ModalShell>
  );
}
