import React, { useEffect, useRef } from "react";
import { X, GraduationCap, Languages, Clock, Briefcase } from "lucide-react";
import { navigate } from "../router.js";
import { inr } from "../lib.js";
import { Badge, Monogram, docSchedule } from "./ui.jsx";

export default function DoctorModal({ doctor: d, onClose }) {
  const closeRef = useRef(null);
  const lastFocus = useRef(document.activeElement);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusBack = lastFocus.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      focusBack?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-y-auto bg-white md:bg-[#F5F5F5] p-0 md:p-8" role="dialog" aria-modal="true" aria-labelledby="profile-name" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-3xl border border-ink bg-white">
        <div className="flex items-start justify-between gap-4 border-b border-line bg-surface p-6 md:p-8">
          <div className="flex items-start gap-5">
            <Monogram name={d.name} size="h-16 w-16 text-xl" />
            <div>
              <Badge>{d.specialty}</Badge>
              <h2 id="profile-name" className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{d.name}</h2>
              <p className="text-muted">{d.qual}</p>
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-ink bg-white hover:bg-ink hover:text-white" aria-label="Close profile">
            <X size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-[1fr_260px]">
          <div className="p-6 md:p-8 md:border-r border-line">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">About</p>
            <p className="text-[15px] leading-relaxed">{d.bio}</p>

            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted mb-3 inline-flex items-center gap-2"><GraduationCap size={16} aria-hidden="true" /> Education &amp; Training</p>
            <ul className="border-t border-line">
              {d.education.map((e) => <li key={e} className="border-b border-line py-3 text-[15px]">{e}</li>)}
            </ul>

            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted mb-3">Conditions Treated</p>
            <div className="flex flex-wrap gap-2">
              {d.conditions.map((c) => <span key={c} className="border border-line px-3 py-1 text-sm capitalize">{c}</span>)}
            </div>
          </div>

          <aside className="bg-surface p-6 md:p-8 text-sm">
            <dl className="space-y-5">
              <div><dt className="text-muted inline-flex items-center gap-1.5"><Briefcase size={15} aria-hidden="true" /> Experience</dt><dd className="mt-1 font-semibold">{d.exp} years</dd></div>
              <div><dt className="text-muted inline-flex items-center gap-1.5"><Languages size={15} aria-hidden="true" /> Languages</dt><dd className="mt-1 font-semibold">{d.languages.join(", ")}</dd></div>
              <div><dt className="text-muted inline-flex items-center gap-1.5"><Clock size={15} aria-hidden="true" /> OPD Schedule</dt><dd className="mt-1 font-semibold">{docSchedule(d)}</dd></div>
              <div className="border-t border-ink pt-5"><dt className="text-xs font-semibold uppercase tracking-widest">Consultation Fee</dt><dd className="mt-1 font-mono text-3xl font-semibold">{inr(d.fee)}</dd></div>
            </dl>
            <button type="button" onClick={() => { onClose(); navigate("book", { doctor: d.id }); }} className="btn-primary mt-6 w-full">Book Appointment</button>
          </aside>
        </div>
      </div>
    </div>
  );
}
