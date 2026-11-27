import React from "react";
import { Briefcase, CalendarDays, Clock, Languages, BadgeCheck } from "lucide-react";
import { navigate } from "../router.js";
import { inr, nextAvailable } from "../lib.js";
import { DoctorPhoto, SpecBadge, NextSlot, docSchedule } from "./ui.jsx";
import { useProfile } from "./Profile.jsx";

/** Doctor card. Clicking anywhere on the card (except the buttons) opens the doctor info popup. */
export default function DoctorCard({ doctor: d, compact = false }) {
  const openProfile = useProfile();
  const s = docSchedule(d);
  const next = nextAvailable(d);
  const open = () => openProfile(d);
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
  return (
    <article className="card card-hover group flex cursor-pointer flex-col overflow-hidden" onClick={open} data-doctor={d.id}>
      <div className="relative">
        <DoctorPhoto doctor={d} rounded="rounded-none" className={`${compact ? "h-64" : "h-60"} transition-transform`} />
        <NextSlot next={next} overlay className="absolute left-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug">
          <button type="button" onClick={stop(open)} className="text-left transition-colors duration-200 group-hover:text-brand">{d.name}</button>
        </h3>
        <p className="text-[13px] text-ink/75">{d.qual}</p>
        <p className="mt-1 inline-flex items-center gap-1 font-mono text-[11.5px] text-slate"><BadgeCheck size={12} className="text-mint-ink" aria-hidden="true" />Reg. No: {d.regNo}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SpecBadge>{d.specialty}</SpecBadge>
          <span className="badge bg-sand text-ink"><Briefcase size={12} aria-hidden="true" /> {d.exp} yrs exp.</span>
        </div>
        <dl className="mt-4 space-y-1.5 text-[13.5px] text-slate">
          {!compact && <div className="flex items-center gap-2"><CalendarDays size={15} className="shrink-0 text-brand" aria-hidden="true" /><dt className="sr-only">Days</dt><dd>{s.days}</dd></div>}
          {!compact && <div className="flex items-start gap-2"><Clock size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" /><dt className="sr-only">Timings</dt><dd className="font-mono text-[12.5px]">{s.hours}</dd></div>}
          <div className="flex items-start gap-2"><Languages size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" /><dt className="sr-only">Languages</dt><dd>{d.languages.join(", ")}</dd></div>
        </dl>
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="text-[12px] text-slate">Consultation fee</span>
            <span className="font-mono text-lg font-bold text-brand">{inr(d.fee)}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" className="btn-secondary px-3" onClick={stop(open)} aria-label={`View profile of ${d.name}`}>View Profile</button>
            <button type="button" className="btn-primary px-3" onClick={stop(() => navigate("book", { doctor: d.id }))} aria-label={`Book appointment with ${d.name}`}>Book Now</button>
          </div>
        </div>
      </div>
    </article>
  );
}
