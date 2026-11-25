import React from "react";
import { CLINIC } from "../data.js";
import { doctorById, inr, prettyDate, formatPhone, code39Bars } from "../lib.js";

function Barcode({ value }) {
  const { bars, width } = code39Bars(value);
  const quiet = 10;
  return (
    <svg viewBox={`0 0 ${width + quiet * 2} 60`} className="h-16 w-full max-w-[280px] bg-white" role="img" aria-label={`Barcode for token ${value}`} preserveAspectRatio="none">
      <rect width={width + quiet * 2} height="60" fill="#fff" />
      {bars.map((b, i) => <rect key={i} x={b.x + quiet} y="6" width={b.w} height="48" fill="#000" />)}
    </svg>
  );
}

export default function Slip({ booking }) {
  const d = doctorById(booking.doctorId);
  const issued = new Date(booking.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const rows = [
    ["Patient Name", booking.name, "Age / Gender", `${booking.age} yrs / ${booking.gender}`],
    ["Phone", formatPhone(booking.phone), "Consultation Fee", d ? inr(d.fee) : "—"],
    ["Consulting Doctor", d ? `${d.name}, ${d.qual}` : "—", "Specialty", d ? d.specialty : "—"],
    ["Confirmed Date", prettyDate(booking.date), "Time Slot", booking.slot],
  ];
  const mono = new Set(["Phone", "Consultation Fee", "Time Slot"]);

  return (
    <article id="print-slip" className="border-2 border-ink bg-white p-6 md:p-10" aria-label={`OPD appointment slip ${booking.token}`}>
      <header className="flex flex-col gap-4 border-b-2 border-ink pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-2xl md:text-3xl font-extrabold tracking-[0.05em] leading-none">{CLINIC.name}</p>
          <p className="mt-2 text-xs text-muted">{CLINIC.address} · {CLINIC.phone}</p>
        </div>
        <div className="sm:text-right">
          <p className="inline-block border border-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest">Official OPD Appointment Copy</p>
          <p className="mt-2 font-mono text-xs text-muted">Booked {issued}</p>
        </div>
      </header>

      <div className="slip-band my-7 flex flex-col gap-4 bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">Token No</p>
          <p className="mt-1 font-mono text-4xl md:text-6xl font-semibold leading-none tracking-tight">{booking.token}</p>
        </div>
        <div className="bg-white p-2"><Barcode value={booking.token} /></div>
      </div>

      <table className="w-full border-collapse text-[15px]">
        <tbody>
          {rows.map(([l1, v1, l2, v2]) => (
            <tr key={l1} className="block sm:table-row">
              <th scope="row" className="block sm:table-cell w-full sm:w-[17%] border border-ink bg-surface px-3 py-2.5 text-left align-top text-[11px] font-bold uppercase tracking-wider">{l1}</th>
              <td className={`block sm:table-cell sm:w-[33%] border border-ink px-3 py-2.5 align-top font-semibold break-words ${mono.has(l1) ? "font-mono" : ""}`}>{v1}</td>
              <th scope="row" className="block sm:table-cell sm:w-[17%] border border-ink bg-surface px-3 py-2.5 text-left align-top text-[11px] font-bold uppercase tracking-wider">{l2}</th>
              <td className={`block sm:table-cell sm:w-[33%] border border-ink px-3 py-2.5 align-top font-semibold break-words ${mono.has(l2) ? "font-mono" : ""}`}>{v2}</td>
            </tr>
          ))}
          <tr className="block sm:table-row">
            <th scope="row" className="block sm:table-cell border border-ink bg-surface px-3 py-2.5 text-left align-top text-[11px] font-bold uppercase tracking-wider">Reported Symptoms</th>
            <td colSpan={3} className="block sm:table-cell border border-ink px-3 py-2.5 align-top font-semibold break-words">{booking.symptoms}</td>
          </tr>
        </tbody>
      </table>

      <footer className="mt-6 border-t border-ink pt-4">
        <p className="text-[11px] font-bold uppercase tracking-widest">Reporting Instructions</p>
        <p className="mt-1 font-semibold">Report to Reception Desk 15 minutes prior to your slot with this copy.</p>
        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted">
          <p>Consultation fee is payable at reception (cash, card or UPI).</p>
          <p className="font-mono">Ref {booking.token} · {booking.date}</p>
        </div>
      </footer>
    </article>
  );
}
