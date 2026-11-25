import React, { useEffect, useState } from "react";
import { Search, Printer, ArrowLeft, AlertCircle, Ticket } from "lucide-react";
import { navigate } from "../router.js";
import { findBookings, doctorById, prettyDate } from "../lib.js";
import { PageHead } from "../components/ui.jsx";
import Slip from "../components/Slip.jsx";

export default function FindToken({ params }) {
  const [query, setQuery] = useState(params.q || "");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null);

  const run = (q) => {
    const v = q.trim();
    setOpen(null);
    if (!v) { setError("Enter a token number (e.g. DC-101) or a 10-digit phone number."); setResults(null); return; }
    const isToken = /^#?(dc-?)?\d{1,4}$/i.test(v);
    const isPhone = /^\d{10}$/.test(v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""));
    if (!isToken && !isPhone) { setError("That doesn't look like a token (DC-101) or a 10-digit phone number."); setResults(null); return; }
    setError("");
    const r = findBookings(v);
    setResults(r);
    if (r.length === 1) setOpen(r[0]);
  };

  useEffect(() => { if (params.q) run(params.q); }, [params.q]); // eslint-disable-line

  const submit = (e) => { e.preventDefault(); run(query); };

  return (
    <>
      <PageHead eyebrow="Find My Token" title="Retrieve your OPD appointment copy">
        Enter your token number or the phone number you booked with to view and re-print your appointment slip.
      </PageHead>

      <section className="py-12 md:py-16 print-reset">
        <div className="mx-auto max-w-4xl px-6 print-reset">
          {!open && (
            <>
              <form onSubmit={submit} noValidate className="no-print">
                <label htmlFor="token-q" className="field-label">Token Number or Phone Number</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input id="token-q" value={query} onChange={(e) => { setQuery(e.target.value); setError(""); }}
                    placeholder="DC-101 or 98765 43210" autoComplete="off"
                    className={`field-input font-mono text-lg ${error ? "is-invalid" : ""}`} aria-invalid={!!error} aria-describedby={error ? "token-err" : "token-hint"} />
                  <button type="submit" className="btn-primary sm:w-48"><Search size={18} aria-hidden="true" /> Find Token</button>
                </div>
                {error ? <p id="token-err" className="field-error"><AlertCircle size={15} className="mt-px shrink-0" aria-hidden="true" />{error}</p>
                  : <p id="token-hint" className="mt-2 text-sm text-muted">Bookings are saved on this device. Sample tokens to try: <button type="button" className="font-mono font-semibold text-ink underline underline-offset-4" onClick={() => { setQuery("DC-099"); run("DC-099"); }}>DC-099</button>.</p>}
              </form>

              {results && results.length === 0 && (
                <div className="mt-10 border border-line bg-surface p-10 text-center no-print">
                  <Ticket size={28} strokeWidth={1.5} className="mx-auto" aria-hidden="true" />
                  <p className="mt-4 text-lg font-semibold">No appointment found.</p>
                  <p className="mt-2 text-muted">Check the number and try again. Bookings made on another phone or browser are not stored here.</p>
                  <button type="button" onClick={() => navigate("book")} className="btn-primary mt-6">Take Appointment</button>
                </div>
              )}

              {results && results.length > 1 && (
                <div className="mt-10 no-print">
                  <p className="mb-4 font-mono text-sm text-muted">{results.length} appointments found for this phone number</p>
                  <ul className="border-t border-line">
                    {results.map((b) => {
                      const d = doctorById(b.doctorId);
                      return (
                        <li key={b.token} className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-5">
                          <div>
                            <p className="font-mono text-2xl font-semibold">{b.token}</p>
                            <p className="text-sm text-muted">{b.name} · {d?.name} · {prettyDate(b.date)}, <span className="font-mono">{b.slot}</span></p>
                          </div>
                          <button type="button" onClick={() => setOpen(b)} className="btn-secondary">View Slip</button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          )}

          {open && (
            <>
              <Slip booking={open} />
              <div className="mt-8 flex flex-wrap gap-3 no-print">
                <button type="button" onClick={() => window.print()} className="btn-primary"><Printer size={18} aria-hidden="true" /> Print / Save as PDF</button>
                <button type="button" onClick={() => { setOpen(null); if (results?.length === 1) setResults(null); }} className="btn-secondary"><ArrowLeft size={18} aria-hidden="true" /> Search Again</button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
