import React from "react";
import { CalendarCheck2, Clock, Info } from "lucide-react";
import { CLINIC } from "../data.js";
import { doctorById, inr, prettyDate, formatPhone, code39Bars } from "../lib.js";
import Logo from "./Logo.jsx";

function Barcode({ value }) {
  const { bars, width } = code39Bars(value);
  return (
    <svg viewBox={`0 0 ${width} 40`} preserveAspectRatio="none" className="h-14 w-56 max-w-full" role="img" aria-label={`Barcode for token ${value}`}>
      <rect width={width} height="40" fill="#fff" />
      {bars.map((b, i) => <rect key={i} x={b.x} y="0" width={b.w} height="40" fill="#18221F" />)}
    </svg>
  );
}

function Row({ label, children, mono }) {
  return (
    <div className="border-b border-line py-3 sm:px-1">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate">{label}</dt>
      <dd className={`mt-1 text-[15px] font-semibold text-ink ${mono ? "font-mono" : ""}`}>{children}</dd>
    </div>
  );
}

export default function Slip({ booking: b }) {
  const d = doctorById(b.doctorId);
  const created = new Date(b.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return (
    <article id="print-slip" className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-line bg-white shadow-float animate-popIn" aria-label={`OPD appointment slip ${b.token}`}>
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-brand px-6 py-5 sm:px-8">
        <Logo size={44} />
        <div className="text-right text-[12.5px] leading-relaxed text-slate">
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-brand">Official OPD Appointment Slip</p>
          <p className="max-w-[260px] sm:ml-auto">{CLINIC.address}</p>
          <p>Helpline <span className="font-mono">{CLINIC.phone}</span></p>
        </div>
      </header>

      {/* Token banner */}
      <div className="flex flex-wrap items-center justify-between gap-5 bg-brand px-6 py-5 text-cream sm:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/70">OPD Token</p>
          <p className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">TOKEN NO: {b.token}</p>
          <p className="mt-1 text-[12.5px] text-cream/75">Booked {created}</p>
        </div>
        <div className="rounded-lg bg-white px-3 pt-2 pb-1 text-center">
          <Barcode value={b.token} />
          <p className="font-mono text-[11px] tracking-[0.3em] text-ink">*{b.token}*</p>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-6 sm:px-8">
        <div className="mb-5 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg bg-mint-soft px-3 py-2 text-[14px] font-semibold text-mint-ink">
            <CalendarCheck2 size={16} aria-hidden="true" /> {prettyDate(b.date)}
          </span>
          <span className="inline-flex items-center gap-2 rounded-lg bg-mint-soft px-3 py-2 font-mono text-[14px] font-semibold text-mint-ink">
            <Clock size={16} aria-hidden="true" /> {b.slot}
          </span>
        </div>
        <dl className="grid gap-x-8 sm:grid-cols-2">
          <Row label="Patient Name">{b.name}</Row>
          <Row label="Age / Gender">{b.age} yrs · {b.gender}</Row>
          <Row label="Phone" mono>{formatPhone(b.phone)}</Row>
          <Row label="Consulting Doctor">{d ? d.name : "—"}</Row>
          <Row label="Specialty">{d ? d.specialty : "—"}</Row>
          <Row label="Consultation Fee" mono>{d ? inr(d.fee) : "—"}</Row>
          <Row label="Confirmed Date & Time" mono>{prettyDate(b.date)}, {b.slot}</Row>
          <Row label="Payment Status"><span className="text-coral-ink">Pay at Clinic</span></Row>
          <div className="sm:col-span-2"><Row label="Reported Symptoms">{b.symptoms}</Row></div>
        </dl>
        <p className="mt-6 flex items-start gap-2.5 rounded-lg border border-line bg-cream px-4 py-3 text-[13.5px] leading-relaxed text-slate">
          <Info size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          <span>Please arrive 15 minutes before your slot with this digital or printed slip. Bring previous prescriptions and reports. Show the token at the reception desk on the ground floor.</span>
        </p>
      </div>
      <footer className="flex flex-wrap justify-between gap-2 border-t border-line bg-sand/60 px-6 py-3 text-[11.5px] text-slate sm:px-8">
        <span>OPD Hours: {CLINIC.hours}</span>
        <span>24/7 Emergency: <span className="font-mono">{CLINIC.emergency}</span></span>
      </footer>
    </article>
  );
}
