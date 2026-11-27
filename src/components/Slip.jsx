import React from "react";
import { CalendarCheck2, Clock, MapPin, ShieldCheck, Info } from "lucide-react";
import { CLINIC } from "../data.js";
import { doctorById, inr, prettyDate, formatPhone, code39Bars, receiptNo, patientId, reportingTime } from "../lib.js";
import Logo from "./Logo.jsx";

function Barcode({ value }) {
  const { bars, width } = code39Bars(value);
  return (
    <svg viewBox={`0 0 ${width} 40`} preserveAspectRatio="none" className="h-12 w-52 max-w-full" role="img" aria-label={`Barcode for token ${value}`}>
      <rect width={width} height="40" fill="#fff" />
      {bars.map((b, i) => <rect key={i} x={b.x} y="0" width={b.w} height="40" fill="#18221F" />)}
    </svg>
  );
}

function Field({ label, children, mono }) {
  return (
    <div className="flex gap-3 border-b border-dashed border-line py-1.5">
      <dt className="w-[104px] shrink-0 text-[12px] text-slate">{label}</dt>
      <dd className={`min-w-0 text-[13px] font-semibold text-ink ${mono ? "font-mono" : ""}`}>{children}</dd>
    </div>
  );
}

const Heading = ({ children }) => <h3 className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">{children}</h3>;

/** Printable OPD appointment slip cum receipt. Fits on one A4 page. */
export default function Slip({ booking: b }) {
  const d = doctorById(b.doctorId);
  const fee = d ? d.fee : 0;
  const created = new Date(b.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return (
    <article id="print-slip" className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-line bg-white shadow-float animate-popIn" aria-label={`OPD appointment slip ${b.token}`}>
      {/* Letterhead */}
      <header className="grid gap-3 px-5 pb-4 pt-5 sm:grid-cols-[auto_1fr] sm:gap-6 sm:px-8">
        <div>
          <Logo size={46} />
          <p className="mt-2 text-[11px] text-slate">Clinical Establishment Reg. No: <span className="font-mono text-ink">{CLINIC.establishmentReg}</span></p>
        </div>
        <div className="text-[11.5px] leading-relaxed text-slate sm:text-right">
          <p>{CLINIC.address}</p>
          <p>Reception <span className="whitespace-nowrap font-mono text-ink">{CLINIC.phone}</span> · 24/7 Emergency <span className="whitespace-nowrap font-mono text-ink">{CLINIC.emergency}</span></p>
          <p className="mt-1 inline-flex items-center gap-1 rounded border border-mint/40 bg-mint-soft px-1.5 py-0.5 text-[10.5px] font-semibold text-mint-ink">
            <ShieldCheck size={11} aria-hidden="true" /> {CLINIC.accreditation.title}
          </p>
        </div>
      </header>

      {/* Title strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-y-2 border-brand bg-brand-soft px-5 py-2 sm:px-8">
        <p className="font-display text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand">OPD Appointment Slip cum Receipt</p>
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate">Patient copy</p>
      </div>

      {/* Token, receipt metadata and barcode */}
      <div className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto] sm:px-8">
        <div>
          <p className="font-mono text-[26px] font-bold leading-tight text-brand sm:text-[34px]">TOKEN NO: {b.token}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
            {[["Receipt No.", receiptNo(b), true], ["Patient ID (UHID)", patientId(b), true], ["Booked on", created], ["Booking channel", "Online · Website"]].map(([k, v, mono]) => (
              <div key={k} className="min-w-0">
                <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate">{k}</dt>
                <dd className={`text-[12.5px] font-semibold text-ink ${mono ? "font-mono" : ""}`}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="self-start rounded-lg border border-line px-3 pb-1 pt-2 text-center">
          <Barcode value={b.token} />
          <p className="font-mono text-[11px] tracking-[0.3em] text-ink">*{b.token}*</p>
        </div>
      </div>

      {/* Appointment band */}
      <div className="mx-5 grid overflow-hidden rounded-lg border border-line sm:mx-8 sm:grid-cols-3">
        <div className="flex items-start gap-2.5 bg-cream p-3">
          <CalendarCheck2 size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          <div><p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate">Appointment date</p><p className="text-[14px] font-bold text-ink">{prettyDate(b.date)}</p></div>
        </div>
        <div className="flex items-start gap-2.5 border-t border-line bg-cream p-3 sm:border-l sm:border-t-0">
          <Clock size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          <div><p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate">Time slot</p><p className="font-mono text-[14px] font-bold text-ink">{b.slot}</p><p className="text-[11.5px] text-slate">Report by <span className="font-mono">{reportingTime(b.slot)}</span></p></div>
        </div>
        <div className="flex items-start gap-2.5 border-t border-line bg-cream p-3 sm:border-l sm:border-t-0">
          <MapPin size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          <div><p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate">Consultation room</p><p className="text-[13.5px] font-bold text-ink">{d ? d.room : "—"}</p></div>
        </div>
      </div>

      {/* Patient + doctor */}
      <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 sm:gap-8 sm:px-8">
        <section>
          <Heading>Patient details</Heading>
          <dl>
            <Field label="Patient name">{b.name}</Field>
            <Field label="Age / Gender">{b.age} yrs · {b.gender}</Field>
            <Field label="Mobile" mono>{formatPhone(b.phone)}</Field>
            <Field label="Symptoms"><span className="font-medium">{b.symptoms}</span></Field>
          </dl>
        </section>
        <section>
          <Heading>Consulting doctor</Heading>
          <dl>
            <Field label="Doctor">{d ? d.name : "—"}</Field>
            <Field label="Qualification"><span className="font-medium">{d ? d.qual : "—"}</span></Field>
            <Field label="Department">{d ? d.specialty : "—"}</Field>
            <Field label="Medical Reg. No." mono>{d ? d.regNo : "—"}</Field>
          </dl>
        </section>
      </div>

      {/* Fee breakdown */}
      <div className="px-5 sm:px-8">
        <Heading>Fee details</Heading>
        <table className="w-full overflow-hidden rounded-lg border border-line text-[13px]">
          <thead>
            <tr className="bg-sand text-left text-[11px] uppercase tracking-[0.1em] text-slate">
              <th scope="col" className="px-3 py-1.5 font-bold">Description</th>
              <th scope="col" className="px-3 py-1.5 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line">
              <td className="px-3 py-1.5">Consultation Fee{d ? ` · ${d.name} (${d.specialty})` : ""}</td>
              <td className="px-3 py-1.5 text-right font-mono font-semibold">{inr(fee)}</td>
            </tr>
            <tr className="border-t border-line">
              <td className="px-3 py-1.5">Online Booking Charge</td>
              <td className="px-3 py-1.5 text-right font-mono font-semibold">{inr(0)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-brand bg-brand-soft">
              <th scope="row" className="px-3 py-2 text-left font-display text-[13.5px] font-bold text-brand">Total Payable at Reception</th>
              <td className="px-3 py-2 text-right font-mono text-[16px] font-bold text-brand">{inr(fee)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate">
          Payment status:
          <span className="rounded border border-coral/40 bg-coral-soft px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-coral-ink">Unpaid · Pay at Reception</span>
          Cash, UPI and cards accepted.
        </p>
      </div>

      {/* Instructions */}
      <div className="px-5 py-4 sm:px-8">
        <div className="flex items-start gap-2.5 rounded-lg border border-line bg-cream px-4 py-3 text-[12px] leading-relaxed text-slate">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          <ul className="list-disc space-y-0.5 pl-4">
            <li>Report to the ground-floor reception by the time above and show this slip, printed or on your phone.</li>
            <li>Bring previous prescriptions, reports and a photo ID. Tokens are called in order on the display board.</li>
          </ul>
        </div>
      </div>

      <footer className="flex flex-wrap justify-between gap-2 border-t border-line bg-sand/60 px-5 py-2.5 text-[10.5px] text-slate sm:px-8">
        <span>Computer-generated slip. No signature required.</span>
        <span>OPD: {CLINIC.hours}</span>
        <span>24/7 Emergency: <span className="whitespace-nowrap font-mono">{CLINIC.emergency}</span></span>
      </footer>
    </article>
  );
}
