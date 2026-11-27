import React from "react";
import { GraduationCap, Building2, CalendarDays, Sun, Sunset, BadgeCheck, CalendarPlus, MapPin, Check, Stethoscope } from "lucide-react";
import { SPECIALTIES, SESSION_HOURS } from "../data.js";
import { navigate } from "../router.js";
import { inr, nextAvailable, weeklySchedule } from "../lib.js";
import { DoctorPhoto, Icon, NextSlot } from "./ui.jsx";
import ModalShell, { SubHead } from "./Modal.jsx";

/**
 * Doctor info popup (built on the shared ModalShell).
 * `onBook` overrides the CTA (the booking page uses it to select the doctor in place).
 */
export default function DoctorModal({ doctor: d, onClose, onBook, selected = false }) {
  const spec = SPECIALTIES.find((s) => s.key === d.specialty);
  const next = nextAvailable(d);
  const week = weeklySchedule(d);
  const today = new Date().getDay();
  const book = () => { onClose(); if (onBook) onBook(d); else navigate("book", { doctor: d.id }); };

  return (
    <ModalShell onClose={onClose} labelledBy="doc-title" describedBy="doc-bio" closeLabel="Close doctor profile">
        {/* Header: portrait, name, qualifications, specialty, registration */}
        <header className="relative flex gap-4 border-b border-line bg-cream p-4 pr-14 sm:gap-5 sm:p-6 sm:pr-16">
          <DoctorPhoto doctor={d} eager rounded="rounded-xl" className="h-[104px] w-[86px] shrink-0 border border-line shadow-card sm:h-[132px] sm:w-[110px]" />
          <div className="min-w-0">
            <span className="badge-brand">{spec && <Icon name={spec.icon} size={13} />}{d.specialty}</span>
            <h2 id="doc-title" className="mt-2 font-display text-[21px] font-bold leading-tight text-ink sm:text-2xl">{d.name}</h2>
            <p className="mt-0.5 text-[13.5px] font-medium text-ink/80">{d.qual}</p>
            <p className="text-[12.5px] text-slate">{d.designation}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-2 py-1 font-mono text-[11.5px] font-medium text-ink">
              <BadgeCheck size={13} className="text-mint-ink" aria-hidden="true" /> Reg. No: {d.regNo}
            </p>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
          {/* Stats row */}
          <dl className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-line bg-cream p-3">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate">Experience</dt>
              <dd className="mt-1 font-display text-lg font-bold text-ink sm:text-xl">{d.exp}+ <span className="text-[13px] font-semibold text-slate">yrs</span></dd>
            </div>
            <div className="rounded-xl bg-brand p-3 text-cream">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-cream/75"><span className="sm:hidden">Fee</span><span className="hidden sm:inline">Consultation fee</span></dt>
              <dd className="mt-1 font-mono text-lg font-bold sm:text-[22px]">{inr(d.fee)}</dd>
            </div>
            <div className="rounded-xl border border-line bg-cream p-3">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate">Languages</dt>
              <dd className="mt-1 text-[12.5px] font-semibold leading-snug text-ink sm:text-[13px]">{d.languages.join(", ")}</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <NextSlot next={next} />
            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-slate"><MapPin size={13} className="text-brand" aria-hidden="true" />{d.room}</span>
          </div>

          {/* Biography */}
          <p id="doc-bio" className="mt-5 text-[14.5px] leading-relaxed text-slate">{d.bio}</p>

          {/* Expertise */}
          <section className="mt-6">
            <SubHead icon={Stethoscope}>Conditions treated</SubHead>
            <ul className="flex flex-wrap gap-2">
              {d.conditions.map((c) => <li key={c} className="rounded-full border border-mint/30 bg-mint-soft px-3 py-1 text-[12.5px] font-medium text-mint-ink">{c}</li>)}
            </ul>
          </section>

          {/* Education + affiliations */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <section>
              <SubHead icon={GraduationCap}>Education</SubHead>
              <ul className="space-y-2 text-[13.5px] leading-snug text-slate">
                {d.education.map((e) => <li key={e} className="flex gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-mint" aria-hidden="true" />{e}</li>)}
              </ul>
            </section>
            <section>
              <SubHead icon={Building2}>Past affiliations</SubHead>
              <ul className="space-y-2 text-[13.5px] leading-snug text-slate">
                {d.affiliations.map((a) => <li key={a} className="flex gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-coral" aria-hidden="true" />{a}</li>)}
              </ul>
            </section>
          </div>

          {/* Weekly OPD schedule */}
          <section className="mt-6">
            <SubHead icon={CalendarDays}>Weekly OPD schedule</SubHead>
            <div className="overflow-hidden rounded-xl border border-line">
              <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] text-center text-[12px] sm:grid-cols-[96px_repeat(7,minmax(0,1fr))]">
                <div className="bg-sand" />
                {week.map((w) => (
                  <div key={w.i} className={`bg-sand py-2 font-display font-bold ${w.i === today ? "text-brand" : "text-ink"}`}>
                    {w.short}{w.i === today && <span className="sr-only"> (today)</span>}
                  </div>
                ))}
                {[["morning", "Morning", Sun, "text-coral"], ["evening", "Evening", Sunset, "text-brand"]].map(([key, label, I, tone]) => (
                  <React.Fragment key={key}>
                    <div className="flex items-center gap-1.5 border-t border-line px-2 py-2.5 text-left font-semibold text-ink sm:px-3">
                      <I size={14} className={`shrink-0 ${tone}`} aria-hidden="true" />{label}
                    </div>
                    {week.map((w) => (
                      <div key={w.i} className={`flex items-center justify-center border-l border-t border-line py-2.5 ${w.i === today ? "bg-brand-soft/60" : ""}`}>
                        {w[key]
                          ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-mint text-white"><Check size={13} strokeWidth={3} aria-hidden="true" /><span className="sr-only">{w.day} {label}: {w[key]}</span></span>
                          : <span className="text-slate/40" aria-hidden="true">–</span>}
                        {!w[key] && <span className="sr-only">{w.day} {label}: no OPD</span>}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate">
              {d.sessions.includes("morning") && <span>Morning <span className="font-mono text-ink">{SESSION_HOURS.morning}</span></span>}
              {d.sessions.includes("evening") && <span>Evening <span className="font-mono text-ink">{SESSION_HOURS.evening}</span></span>}
              <span>Sunday closed</span>
            </p>
          </section>
        </div>

        {/* Sticky footer CTA */}
        <footer className="flex items-center gap-2 border-t border-line bg-white px-4 py-3 sm:px-6">
          <button type="button" onClick={onClose} className="btn-secondary hidden sm:inline-flex">Close</button>
          <button type="button" onClick={book} className="btn-primary flex-1 whitespace-normal text-center leading-tight sm:ml-auto sm:flex-none">
            <CalendarPlus size={17} className="shrink-0" aria-hidden="true" />
            {selected ? `Continue with ${d.name}` : `Book Appointment with ${d.name}`}
          </button>
        </footer>
    </ModalShell>
  );
}
