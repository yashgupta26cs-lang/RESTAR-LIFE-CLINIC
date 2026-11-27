import React, { useEffect, useRef } from "react";
import { X, GraduationCap, Languages, CalendarDays, Briefcase, Clock } from "lucide-react";
import { navigate } from "../router.js";
import { inr } from "../lib.js";
import { DoctorPhoto, SpecBadge, docSchedule } from "./ui.jsx";

export default function DoctorModal({ doctor: d, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const last = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; last?.focus?.(); };
  }, [onClose]);
  const s = docSchedule(d);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-6 animate-fadeIn no-print" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="doc-title" className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-float sm:rounded-2xl animate-popIn">
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close profile" className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink border border-line transition-all duration-200 ease-out hover:bg-sand">
          <X size={18} />
        </button>
        <div className="grid sm:grid-cols-[240px_1fr]">
          <DoctorPhoto doctor={d} rounded="rounded-none" className="h-64 sm:h-full sm:min-h-[340px]" />
          <div className="p-6 sm:p-8">
            <SpecBadge>{d.specialty}</SpecBadge>
            <h2 id="doc-title" className="mt-3 font-display text-2xl font-bold">{d.name}</h2>
            <p className="text-[14px] text-slate">{d.qual}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-[13.5px]">
              <div className="rounded-lg bg-cream border border-line p-3"><p className="flex items-center gap-1.5 text-slate"><Briefcase size={14} aria-hidden="true" /> Experience</p><p className="mt-1 font-semibold">{d.exp}+ years</p></div>
              <div className="rounded-lg bg-cream border border-line p-3"><p className="text-slate">Consultation fee</p><p className="mt-1 font-mono font-semibold text-brand">{inr(d.fee)}</p></div>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-slate">{d.bio}</p>
            <h3 className="mt-6 flex items-center gap-2 text-sm font-bold"><GraduationCap size={16} className="text-brand" aria-hidden="true" /> Education</h3>
            <ul className="mt-2 space-y-1.5 text-[14px] text-slate">
              {d.education.map((e) => <li key={e} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />{e}</li>)}
            </ul>
            <h3 className="mt-5 flex items-center gap-2 text-sm font-bold"><Languages size={16} className="text-brand" aria-hidden="true" /> Languages</h3>
            <div className="mt-2 flex flex-wrap gap-2">{d.languages.map((l) => <span key={l} className="badge bg-sand text-ink">{l}</span>)}</div>
            <h3 className="mt-5 flex items-center gap-2 text-sm font-bold"><CalendarDays size={16} className="text-brand" aria-hidden="true" /> OPD Schedule</h3>
            <p className="mt-1 text-[14px] text-slate">{s.days} · <span className="font-mono text-[13px]">{s.hours}</span></p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="btn-primary" onClick={() => { onClose(); navigate("book", { doctor: d.id }); }}>
                <Clock size={17} aria-hidden="true" /> Book Appointment
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
