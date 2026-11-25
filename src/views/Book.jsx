import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Printer, RotateCcw, Sun, Moon, Check, Plus } from "lucide-react";
import { DOCTORS, SYMPTOM_TAGS } from "../data.js";
import { navigate } from "../router.js";
import {
  DAY, inr, doctorById, todayISO, parseISO, isoDate, prettyDate, slotMinutes, slotsFor,
  cleanPhone, bookedSlots, createBooking, daysText, hoursText,
} from "../lib.js";
import { PageHead, Badge } from "../components/ui.jsx";
import Slip from "../components/Slip.jsx";

const EMPTY = { name: "", age: "", gender: "", phone: "", symptoms: "" };
const LABEL = { name: "Full Name", age: "Age", gender: "Gender", phone: "Phone Number", symptoms: "Disease / Symptoms", doctor: "Doctor", date: "Appointment Date", slot: "Time Slot" };
const ORDER = ["name", "age", "gender", "phone", "symptoms", "doctor", "date", "slot"];

function validate(f, doctorId, date, slot) {
  const e = {};
  const name = f.name.trim();
  if (!name) e.name = "Enter the patient's full name.";
  else if (name.length < 2) e.name = "Name must be at least 2 characters.";
  else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(name)) e.name = "Use letters, spaces, dots, hyphens or apostrophes only.";
  if (f.age === "") e.age = "Enter the patient's age.";
  else if (!/^\d{1,3}$/.test(f.age) || +f.age > 120) e.age = "Enter an age between 0 and 120.";
  if (!f.gender) e.gender = "Select a gender.";
  if (!f.phone.trim()) e.phone = "Enter a phone number.";
  else if (!/^[6-9]\d{9}$/.test(cleanPhone(f.phone))) e.phone = "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.";
  if (!f.symptoms.trim()) e.symptoms = "Describe the disease or symptoms, or tap a tag below.";
  else if (f.symptoms.trim().length < 3) e.symptoms = "Add a little more detail.";
  const d = doctorById(doctorId);
  if (!d) e.doctor = "Select a doctor.";
  if (!date) e.date = "Choose an appointment date.";
  else {
    const c = parseISO(date), t = parseISO(todayISO());
    const max = new Date(t); max.setDate(max.getDate() + 60);
    if (c < t) e.date = "The date cannot be in the past.";
    else if (c > max) e.date = "Appointments open up to 60 days ahead.";
    else if (c.getDay() === 0) e.date = "The OPD is closed on Sundays.";
    else if (d && !d.days.includes(c.getDay())) e.date = `${d.name} does not consult on ${DAY[c.getDay()]}s.`;
  }
  if (!slot) e.slot = "Select an available time slot.";
  else if (d && date && bookedSlots(d.id, date).has(slot)) e.slot = "That slot has just been booked. Please choose another.";
  return e;
}

function Field({ id, label, error, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label} <span aria-hidden="true">*</span></label>
      {children}
      {error && <p id={`${id}-err`} className="field-error"><AlertCircle size={15} className="mt-px shrink-0" aria-hidden="true" />{error}</p>}
    </div>
  );
}

function StepHead({ n, title, done }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-ink pt-6 mb-6">
      <h2 className="flex items-baseline gap-4 text-2xl font-bold tracking-tight"><span className="font-mono text-sm font-semibold text-muted">{n}</span>{title}</h2>
      {done && <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"><Check size={14} aria-hidden="true" /> Done</span>}
    </div>
  );
}

function SummaryRow({ label, value, mono }) {
  return (
    <div className="grid grid-cols-[112px_1fr] gap-3 border-b border-line py-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className={value ? `font-semibold break-words ${mono ? "font-mono" : ""}` : "text-neutral-400"}>{value || "—"}</dd>
    </div>
  );
}

export default function Book({ params }) {
  const [form, setForm] = useState(EMPTY);
  const [doctorId, setDoctorId] = useState(doctorById(params.doctor) ? params.doctor : "");
  const [date, setDate] = useState(() => {
    if (params.date && params.date >= todayISO()) return params.date;
    return todayISO();
  });
  const [slot, setSlot] = useState("");
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);
  const [, force] = useState(0);
  const summaryRef = useRef(null);

  // Arriving with ?doctor= from another page
  useEffect(() => {
    if (params.doctor && doctorById(params.doctor)) { setDoctorId(params.doctor); setBooking(null); }
    if (params.date && params.date >= todayISO()) setDate(params.date);
  }, [params.doctor, params.date]);

  const doctor = doctorById(doctorId);
  const set = (k) => (e) => { const v = e.target.value; setForm((f) => ({ ...f, [k]: v })); setErrors((x) => ({ ...x, [k]: undefined })); };

  const slotInfo = useMemo(() => {
    if (!doctor || !date) return null;
    const day = parseISO(date).getDay();
    if (!doctor.days.includes(day)) return { off: true, day };
    const taken = bookedSlots(doctor.id, date);
    const isToday = date === todayISO();
    const now = new Date(); const nowM = now.getHours() * 60 + now.getMinutes();
    const mk = (s) => ({ s, booked: taken.has(s), passed: !taken.has(s) && isToday && slotMinutes(s) <= nowM });
    const { morning, evening } = slotsFor(doctor);
    return { morning: morning.map(mk), evening: evening.map(mk) };
  }, [doctor, date, booking]); // eslint-disable-line

  // Drop a selected slot that is no longer valid
  useEffect(() => {
    if (!slot || !slotInfo) return;
    const all = slotInfo.off ? [] : [...slotInfo.morning, ...slotInfo.evening];
    const hit = all.find((x) => x.s === slot);
    if (!hit || hit.booked || hit.passed) setSlot("");
  }, [slotInfo]); // eslint-disable-line

  const pickDoctor = (id) => { setDoctorId(id); setErrors((x) => ({ ...x, doctor: undefined, slot: undefined })); };
  const addTag = (t) => {
    setForm((f) => {
      const cur = f.symptoms.trim();
      if (cur.toLowerCase().split(/,\s*/).includes(t.toLowerCase())) return f;
      return { ...f, symptoms: cur ? `${cur}, ${t}` : t };
    });
    setErrors((x) => ({ ...x, symptoms: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(form, doctorId, date, slot);
    Object.keys(errs).forEach((k) => errs[k] === undefined && delete errs[k]);
    setErrors(errs);
    if (Object.keys(errs).length) {
      force((n) => n + 1);
      requestAnimationFrame(() => {
        const box = document.getElementById("error-summary");
        if (box) { window.scrollTo(0, box.getBoundingClientRect().top + window.pageYOffset - 110); box.focus({ preventScroll: true }); }
      });
      return;
    }
    const b = createBooking({ ...form, name: form.name.trim().replace(/\s+/g, " "), symptoms: form.symptoms.trim(), phone: cleanPhone(form.phone), doctorId, date, slot });
    setBooking(b);
    window.scrollTo(0, 0);
  };

  const reset = () => {
    setBooking(null); setForm(EMPTY); setSlot(""); setErrors({}); setDoctorId(""); setDate(todayISO());
    if (window.location.hash !== "#/book") navigate("book"); else window.scrollTo(0, 0);
  };

  const jump = (k) => {
    const el = k === "gender" ? document.querySelector('input[name="gender"]') : k === "doctor" ? document.querySelector('input[name="doctor"]') : k === "slot" ? document.querySelector("[data-slot]:not(:disabled)") || document.getElementById("f-date") : document.getElementById(`f-${k}`);
    if (el) { window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - 160); el.focus({ preventScroll: true }); }
  };

  /* ---------- Confirmation ---------- */
  if (booking) {
    return (
      <>
        <PageHead eyebrow="Appointment Confirmed" title={`Your OPD token is ${booking.token}`}>
          Print or save this copy sheet. You can also find it later under Find My Token using your phone number.
        </PageHead>
        <section className="py-12 md:py-16 print-reset">
          <div className="mx-auto max-w-4xl px-6 print-reset">
            <Slip booking={booking} />
            <div className="mt-8 flex flex-wrap gap-3 no-print">
              <button type="button" onClick={() => window.print()} className="btn-primary"><Printer size={18} aria-hidden="true" /> Print / Save as PDF</button>
              <button type="button" onClick={reset} className="btn-secondary"><RotateCcw size={18} aria-hidden="true" /> Book Another Appointment</button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const fe = (k) => errors[k];
  const errKeys = ORDER.filter((k) => errors[k]);
  const done = [form.name.trim(), form.age, form.gender, form.phone.trim(), form.symptoms.trim(), doctorId, date, slot].filter(Boolean).length;
  const inputCls = (k) => `field-input ${fe(k) ? "is-invalid" : ""}`;

  const SlotGrid = ({ title, icon: Icon, range, items }) => items.length === 0 ? null : (
    <div className="mb-6">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted"><Icon size={14} aria-hidden="true" /> {title} <span className="font-mono normal-case tracking-normal">({range})</span></p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label={`${title} slots`}>
        {items.map(({ s, booked, passed }) => {
          const off = booked || passed; const sel = slot === s;
          return (
            <button key={s} type="button" data-slot={s} role="radio" aria-checked={sel} disabled={off}
              onClick={() => { setSlot(s); setErrors((x) => ({ ...x, slot: undefined })); }}
              className={`flex min-h-[56px] flex-col items-center justify-center border font-mono text-[15px] font-semibold
                ${sel ? "border-ink bg-ink text-white" : off ? "cursor-not-allowed border-line bg-surface text-neutral-400" : "border-neutral-300 bg-white hover:border-ink"}`}>
              <span className={off ? "line-through" : ""}>{s}</span>
              {off && <span className="font-sans text-[10px] font-bold tracking-widest">{booked ? "BOOKED" : "PASSED"}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <PageHead eyebrow="Take Appointment" title="Book an OPD appointment">
        Three short sections. Your digital OPD token is generated the moment you confirm.
      </PageHead>

      <section className="py-12 md:py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[65fr_35fr] lg:gap-14 items-start">
          {/* ---------- Form ---------- */}
          <form onSubmit={submit} noValidate className="min-w-0">
            {errKeys.length > 0 && (
              <div id="error-summary" tabIndex={-1} role="alert" className="mb-10 border-2 border-ink p-5 outline-none">
                <p className="flex items-center gap-2 font-bold"><AlertCircle size={18} aria-hidden="true" /> Please correct {errKeys.length} field{errKeys.length > 1 ? "s" : ""} to continue</p>
                <ul className="mt-3 space-y-1 pl-7 text-sm list-disc">
                  {errKeys.map((k) => <li key={k}><button type="button" onClick={() => jump(k)} className="font-semibold underline underline-offset-2">{LABEL[k]}</button>: {errors[k]}</li>)}
                </ul>
              </div>
            )}

            {/* 1 */}
            <fieldset className="mb-12">
              <legend className="sr-only">Section 1, Patient Details</legend>
              <StepHead n="01" title="Patient Details" done={form.name && form.age && form.gender && form.phone && form.symptoms} />
              <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
                <Field id="f-name" label="Full Name" error={fe("name")} className="sm:col-span-2">
                  <input id="f-name" className={inputCls("name")} value={form.name} onChange={set("name")} autoComplete="name" placeholder="e.g. Rahul Verma" aria-invalid={!!fe("name")} aria-describedby={fe("name") ? "f-name-err" : undefined} />
                </Field>
                <Field id="f-age" label="Age" error={fe("age")}>
                  <input id="f-age" type="number" min="0" max="120" inputMode="numeric" className={inputCls("age")} value={form.age} onChange={set("age")} placeholder="Years" aria-invalid={!!fe("age")} />
                </Field>
                <Field id="f-phone" label="Phone Number" error={fe("phone")}>
                  <input id="f-phone" type="tel" inputMode="tel" maxLength={14} className={`${inputCls("phone")} font-mono`} value={form.phone}
                    onChange={(e) => { e.target.value = e.target.value.replace(/[^\d+\s-]/g, ""); set("phone")(e); }} autoComplete="tel" placeholder="10-digit mobile number" aria-invalid={!!fe("phone")} />
                </Field>
                <div className="sm:col-span-2">
                  <span className="field-label" id="gender-label">Gender <span aria-hidden="true">*</span></span>
                  <div role="radiogroup" aria-labelledby="gender-label" className="grid grid-cols-3">
                    {["Male", "Female", "Other"].map((g, i) => (
                      <label key={g} className={`relative cursor-pointer ${i > 0 ? "-ml-px" : ""}`}>
                        <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={set("gender")} className="peer absolute h-px w-px opacity-0 appearance-none" />
                        <span className={`flex min-h-[52px] items-center justify-center border text-[15px] font-semibold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2
                          ${form.gender === g ? "relative border-ink bg-ink text-white" : `${fe("gender") ? "border-dashed border-ink" : "border-ink"} bg-white hover:bg-surface`}`}>{g}</span>
                      </label>
                    ))}
                  </div>
                  {fe("gender") && <p className="field-error"><AlertCircle size={15} className="mt-px shrink-0" aria-hidden="true" />{fe("gender")}</p>}
                </div>
                <Field id="f-symptoms" label="Disease / Symptoms" error={fe("symptoms")} className="sm:col-span-2">
                  <textarea id="f-symptoms" rows={3} className={`${inputCls("symptoms")} min-h-[110px] resize-y`} value={form.symptoms} onChange={set("symptoms")} placeholder="Briefly describe the problem and how long you have had it" aria-invalid={!!fe("symptoms")} />
                  <div className="mt-3 flex flex-wrap gap-2" aria-label="Quick-select symptoms">
                    {SYMPTOM_TAGS.map((t) => {
                      const on = form.symptoms.toLowerCase().split(/,\s*/).includes(t.toLowerCase());
                      return (
                        <button key={t} type="button" onClick={() => addTag(t)} aria-pressed={on}
                          className={`inline-flex items-center gap-1 border px-3 py-1.5 text-sm font-medium ${on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>
                          {on ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}{t}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>
            </fieldset>

            {/* 2 */}
            <fieldset className="mb-12">
              <legend className="sr-only">Section 2, Doctor Selection</legend>
              <StepHead n="02" title="Select Doctor" done={!!doctor} />
              <div role="radiogroup" aria-label="Doctor" className="grid gap-2 sm:grid-cols-2">
                {DOCTORS.map((d) => {
                  const on = d.id === doctorId;
                  return (
                    <label key={d.id} className="relative block cursor-pointer">
                      <input type="radio" name="doctor" value={d.id} checked={on} onChange={() => pickDoctor(d.id)} className="peer absolute h-px w-px opacity-0 appearance-none" />
                      <span className={`grid h-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border p-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2
                        ${on ? "border-ink bg-ink text-white" : `${fe("doctor") ? "border-dashed border-ink" : "border-neutral-300"} bg-white hover:border-ink`}`}>
                        <span className="font-bold">{d.name}</span>
                        <span className="row-span-2 font-mono text-lg font-semibold">{inr(d.fee)}</span>
                        <span className={`text-[11px] font-semibold uppercase tracking-widest ${on ? "text-neutral-400" : "text-muted"}`}>{d.specialty} · {daysText(d.days)}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {fe("doctor") && <p className="field-error"><AlertCircle size={15} className="mt-px shrink-0" aria-hidden="true" />{fe("doctor")}</p>}
            </fieldset>

            {/* 3 */}
            <fieldset className="mb-10">
              <legend className="sr-only">Section 3, Date and Time Slot</legend>
              <StepHead n="03" title="Date & Time Slot" done={!!(date && slot)} />
              <div className="max-w-xs">
                <Field id="f-date" label="Appointment Date" error={fe("date")}>
                  <input id="f-date" type="date" className={`${inputCls("date")} font-mono`} value={date} min={todayISO()}
                    max={isoDate(new Date(Date.now() + 60 * 864e5))}
                    onChange={(e) => { setDate(e.target.value); setErrors((x) => ({ ...x, date: undefined })); }} aria-invalid={!!fe("date")} />
                </Field>
              </div>
              <p className="mt-2 mb-6 text-sm text-muted">{doctor ? `${doctor.name} consults ${daysText(doctor.days)}, ${hoursText(doctor)}.` : "OPD runs Monday to Saturday. Sunday is closed."}</p>

              {!doctor && <p className="border border-dashed border-neutral-300 bg-surface p-5 text-sm text-muted">Select a doctor in section 02 to see their available time slots.</p>}
              {doctor && !date && <p className="border border-dashed border-neutral-300 bg-surface p-5 text-sm text-muted">Choose a date to see available time slots.</p>}
              {slotInfo?.off && (
                <p className="border border-dashed border-ink bg-surface p-5 text-sm">
                  {doctor.name} does not consult on {DAY[slotInfo.day]}s. Available: <strong>{daysText(doctor.days)}</strong>. Please choose another date.
                </p>
              )}
              {slotInfo && !slotInfo.off && (
                <>
                  <SlotGrid title="Morning" icon={Sun} range="09:00 AM – 12:00 PM" items={slotInfo.morning} />
                  <SlotGrid title="Evening" icon={Moon} range="04:00 PM – 07:30 PM" items={slotInfo.evening} />
                  {[...slotInfo.morning, ...slotInfo.evening].every((x) => x.booked || x.passed) && (
                    <p className="border border-dashed border-ink bg-surface p-5 text-sm">No slots left on this date. Please choose another day.</p>
                  )}
                  <div className="flex flex-wrap gap-5 text-[13px] text-muted">
                    <span className="inline-flex items-center gap-2"><i className="inline-block h-3.5 w-3.5 border border-neutral-300 bg-white" />Available</span>
                    <span className="inline-flex items-center gap-2"><i className="inline-block h-3.5 w-3.5 bg-ink" />Selected</span>
                    <span className="inline-flex items-center gap-2"><i className="inline-block h-3.5 w-3.5 border border-line bg-surface" />Booked / Passed</span>
                  </div>
                </>
              )}
              {fe("slot") && <p className="field-error"><AlertCircle size={15} className="mt-px shrink-0" aria-hidden="true" />{fe("slot")}</p>}
            </fieldset>

            <button type="submit" className="btn-primary w-full min-h-[60px] text-base">Confirm Booking &amp; Generate OPD Token</button>
            <p className="mt-3 text-sm text-muted">The consultation fee is paid at the clinic. Please arrive 15 minutes before your slot.</p>
          </form>

          {/* ---------- Live summary ---------- */}
          <aside ref={summaryRef} className="lg:sticky lg:top-[100px]" aria-labelledby="summary-title" aria-live="polite">
            <div className="border border-line bg-surface p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Live Appointment Summary</p>
              <h2 id="summary-title" className="text-2xl font-bold tracking-tight mb-5">Your visit</h2>
              {doctor && (
                <div className="mb-5 border border-ink bg-white p-4">
                  <Badge>{doctor.specialty}</Badge>
                  <p className="mt-2 font-bold">{doctor.name}</p>
                  <p className="text-sm text-muted">{doctor.qual}</p>
                </div>
              )}
              <dl className="border-t border-line">
                <SummaryRow label="Patient" value={form.name.trim()} />
                <SummaryRow label="Age / Gender" value={[form.age && `${form.age} yrs`, form.gender].filter(Boolean).join(" / ")} />
                <SummaryRow label="Phone" value={form.phone.trim()} mono />
                <SummaryRow label="Symptoms" value={form.symptoms.trim()} />
                <SummaryRow label="Doctor" value={doctor?.name} />
                <SummaryRow label="Date" value={date && prettyDate(date)} />
                <SummaryRow label="Time Slot" value={slot} mono />
              </dl>
              <div className="flex items-baseline justify-between border-b border-ink py-5">
                <span className="text-xs font-bold uppercase tracking-widest">Consultation Fee</span>
                <span className="font-mono text-3xl font-semibold">{doctor ? inr(doctor.fee) : "₹—"}</span>
              </div>
              <div className="mt-5">
                <p className="font-mono text-xs text-muted">{done} of 8 details complete</p>
                <div className="mt-2 h-1 bg-line" aria-hidden="true"><div className="h-full bg-ink" style={{ width: `${(done / 8) * 100}%` }} /></div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
