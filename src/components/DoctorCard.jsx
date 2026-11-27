import React from "react";
import { Briefcase, CalendarDays, Clock, ArrowRight } from "lucide-react";
import { navigate } from "../router.js";
import { inr, nextAvailable } from "../lib.js";
import { DoctorPhoto, SpecBadge, docSchedule } from "./ui.jsx";

export default function DoctorCard({ doctor: d, onProfile, compact = false }) {
  const s = docSchedule(d);
  const next = nextAvailable(d);
  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      <div className="relative">
        <DoctorPhoto doctor={d} rounded="rounded-none" className={compact ? "h-64" : "h-60"} />
        {next && (
          <span className="absolute left-3 top-3 badge bg-white/95 text-mint-ink shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Next: {next.label}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold leading-snug">{d.name}</h3>
            <p className="text-[13px] text-slate">{d.qual}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SpecBadge>{d.specialty}</SpecBadge>
          <span className="badge bg-sand text-ink"><Briefcase size={12} aria-hidden="true" /> {d.exp} yrs exp.</span>
        </div>
        {!compact && (
          <dl className="mt-4 space-y-1.5 text-[13.5px] text-slate">
            <div className="flex items-center gap-2"><CalendarDays size={15} className="text-brand" aria-hidden="true" /><dt className="sr-only">Days</dt><dd>{s.days}</dd></div>
            <div className="flex items-start gap-2"><Clock size={15} className="mt-0.5 text-brand" aria-hidden="true" /><dt className="sr-only">Timings</dt><dd className="font-mono text-[12.5px]">{s.hours}</dd></div>
          </dl>
        )}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="text-[12px] text-slate">Consultation</span>
            <span className="font-mono text-lg font-bold text-brand">{inr(d.fee)}</span>
          </div>
          <div className={`mt-4 grid gap-2 ${onProfile ? "grid-cols-2" : "grid-cols-1"}`}>
            {onProfile && <button type="button" className="btn-secondary px-3" onClick={() => onProfile(d)}>View Profile</button>}
            <button type="button" className="btn-primary px-3" onClick={() => navigate("book", { doctor: d.id })}>
              Book Appointment {!onProfile && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
