import React, { useEffect, useState } from "react";
import { Search, Printer, ArrowLeft, Ticket, AlertCircle, FileSearch, ChevronRight, CalendarPlus } from "lucide-react";
import { navigate } from "../router.js";
import { findBookings, doctorById, prettyDate, cleanPhone } from "../lib.js";
import { DoctorPhoto } from "../components/ui.jsx";
import Slip from "../components/Slip.jsx";

export default function FindToken({ params }) {
  const [q, setQ] = useState(params.q || "");
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(null);

  const run = (value) => {
    const v = value.trim();
    setOpen(null);
    if (!v) { setError("Enter a token number (e.g. DC-101) or your 10-digit phone number."); setResults(null); return; }
    const isToken = /^(#?DC-?)?\d{1,4}$/i.test(v);
    const isPhone = /^\d{10}$/.test(cleanPhone(v));
    if (!isToken && !isPhone) { setError("That doesn't look like a token (DC-101) or a 10-digit phone number."); setResults(null); return; }
    setError("");
    const r = findBookings(v);
    setResults(r);
    if (r.length === 1) setOpen(r[0]);
  };

  useEffect(() => { if (params.q) run(params.q); }, [params.q]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <section className="border-b border-line bg-sand no-print">
        <div className="container-x py-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-cream"><Ticket size={26} aria-hidden="true" /></span>
            <h1 className="mt-5 font-display text-3xl font-extrabold sm:text-4xl">Find My Token</h1>
            <p className="lead mt-3">Enter your token number or the phone number used while booking to view and re-print your OPD appointment slip.</p>
            <form onSubmit={(e) => { e.preventDefault(); run(q); }} role="search" className="mt-8 text-left">
              <div className={`flex items-center gap-2 rounded-xl border bg-white p-2 shadow-card transition-all duration-200 ease-out focus-within:ring-4 ${error ? "border-coral focus-within:ring-coral/15" : "border-line focus-within:border-brand focus-within:ring-brand/10"}`}>
                <Search size={20} className="ml-2 shrink-0 text-slate" aria-hidden="true" />
                <label htmlFor="token-q" className="sr-only">Token number or phone number</label>
                <input id="token-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="DC-101 or 98765 43210" autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent px-1 py-2.5 font-mono text-[16px] uppercase outline-none placeholder:normal-case placeholder:text-[#9AA39F]"
                  aria-invalid={!!error} aria-describedby={error ? "token-err" : "token-hint"} />
                <button type="submit" className="btn-primary min-h-[44px]">Find Slip</button>
              </div>
              {error ? <p id="token-err" className="field-error" role="alert"><AlertCircle size={15} aria-hidden="true" />{error}</p>
                : <p id="token-hint" className="mt-2 text-center text-[13px] text-slate">Try a sample token: {["DC-098", "DC-099", "DC-100"].map((t, i) => (
                  <React.Fragment key={t}>{i > 0 && ", "}<button type="button" className="font-mono font-semibold text-brand hover:underline" onClick={() => { setQ(t); run(t); }}>{t}</button></React.Fragment>
                ))}</p>}
            </form>
          </div>
        </div>
      </section>

      <section className="container-x py-12 print-reset">
        {results && results.length === 0 && (
          <div className="card mx-auto flex max-w-xl flex-col items-center p-10 text-center animate-popIn no-print">
            <FileSearch size={36} className="text-slate" aria-hidden="true" />
            <p className="mt-4 font-display text-lg font-bold">No appointment found</p>
            <p className="mt-1 text-[14.5px] text-slate">Check the number and try again. Slips are saved on the device and browser used to book.</p>
            <button type="button" onClick={() => navigate("book")} className="btn-primary mt-6"><CalendarPlus size={17} aria-hidden="true" /> Take Appointment</button>
          </div>
        )}

        {results && results.length > 1 && !open && (
          <div className="mx-auto max-w-2xl animate-popIn no-print">
            <p className="mb-4 text-[14px] text-slate"><span className="font-semibold text-ink">{results.length} appointments</span> found for this phone number:</p>
            <ul className="space-y-3">
              {results.map((b) => {
                const d = doctorById(b.doctorId);
                return (
                  <li key={b.token}>
                    <button type="button" onClick={() => setOpen(b)} className="card card-hover flex w-full items-center gap-4 p-4 text-left">
                      {d && <DoctorPhoto doctor={d} rounded="rounded-lg" className="h-12 w-12 shrink-0" />}
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-lg font-bold text-brand">{b.token}</span>
                        <span className="block truncate text-[13.5px] text-slate">{b.name} · {d?.name} · {prettyDate(b.date)}, <span className="font-mono">{b.slot}</span></span>
                      </span>
                      <ChevronRight size={18} className="text-slate" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {open && (
          <>
            <Slip booking={open} />
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 no-print">
              <button type="button" onClick={() => window.print()} className="btn-primary px-6"><Printer size={18} aria-hidden="true" /> Print / Save Copy Sheet (PDF)</button>
              {results && results.length > 1
                ? <button type="button" onClick={() => setOpen(null)} className="btn-secondary px-6"><ArrowLeft size={18} aria-hidden="true" /> All results</button>
                : <button type="button" onClick={() => { setOpen(null); setResults(null); setQ(""); document.getElementById("token-q")?.focus(); }} className="btn-secondary px-6"><Search size={18} aria-hidden="true" /> Search again</button>}
            </div>
          </>
        )}

        {!results && (
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3 no-print">
            {[["1", "Find", "Enter your token or phone number above."], ["2", "View", "Your official slip opens instantly."], ["3", "Print", "Print it or save it as a PDF."]].map(([n, t, d]) => (
              <div key={n} className="card p-5">
                <span className="font-mono text-2xl font-bold text-brand/30">0{n}</span>
                <p className="mt-2 font-display font-bold">{t}</p>
                <p className="text-[13.5px] text-slate">{d}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
