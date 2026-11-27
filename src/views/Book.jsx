import React, { useEffect, useMemo, useRef, useState } from "react";
import { User, Stethoscope, CalendarDays, Sun, Sunset, AlertCircle, Check, Printer, CalendarPlus, ShieldCheck, Lock, Clock, Ticket, Phone, ArrowLeft, Info } from "lucide-react";
import { DOCTORS, SPECIALTIES, SYMPTOM_TAGS, CLINIC } from "../data.js";
import { navigate, scrollToId } from "../router.js";
import { DAY, inr, doctorById, todayISO, isoDate, parseISO, prettyDate, slotsFor, bookedSlots, slotMinutes, cleanPhone, createBooking, daysText } from "../lib.js";
import { DoctorPhoto, SpecBadge } from "../components/ui.jsx";
import Slip from "../components/Slip.jsx";

const EMPTY = { name: "", age: "", gender: "", phone: "", symptoms: "" };

function StepCard({ n, title, sub, icon: I, done, children, id }) {
  return (
    <section id={id} className="card scroll-mt-28 p-5 sm:p-7">
      <header className="mb-6 flex items-start gap-4">
        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[14px] font-bold transition-all duration-200 ease-out ${done ? "bg-mint text-white" : "bg-brand text-cream"}`}>
          {done ? <Check size={18} aria-hidden="true" /> : n}
        </span>
        <div>
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate">Step {n}</p>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold"><I size={19} className="text-brand" aria-hidden="true" />{title}</h2>
          {sub && <p className="mt-0.5 text-[14px] text-slate">{sub}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function Err({ id, msg }) {
  if (!msg) return null;
  return <p id={id} className="field-error" role="alert"><AlertCircle size={15} aria-hidden="true" />{msg}</p>;
}

function validate(f, doctorId, date, slot) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter the patient's full name.";
  else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(f.name.trim())) e.name = "Use letters, spaces, dots or hyphens only.";
  const age = Number(f.age);
  if (f.age === "") e.age = "Please enter the patient's age.";
  else if (!Number.isInteger(age) || age < 0 || age > 120) e.age = "Enter an age between 0 and 120.";
  if (!f.gender) e.gender = "Please select a gender.";
  const p = cleanPhone(f.phone);
  if (!p) e.phone = "Please enter a mobile number.";
  else if (!/^[6-9]\d{9}$/.test(p)) e.phone = "Enter a valid 10-digit mobile number (starts with 6–9).";
  if (f.symptoms.trim().length < 3) e.symptoms = "Briefly describe the symptoms or reason for the visit.";
  if (!doctorId) e.doctor = "Please choose a doctor.";
  if (!date) e.date = "Please choose a date.";
  else if (date < todayISO()) e.date = "Past dates can't be booked.";
  if (!slot) e.slot = "Please choose an available time slot.";
  return e;
}

export default function Book({ params }) {
  const [form, setForm] = useState(EMPTY);
  const [doctorId, setDoctorId] = useState(doctorById(params.doctor) ? params.doctor : "");
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState("");
  const [filter, setFilter] = useState(() => doctorById(params.doctor)?.specialty || "All");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [booking, setBooking] = useState(null);
  const [tick, setTick] = useState(0);
  const formRef = useRef(null);

  const doctor = doctorById(doctorId);
  useEffect(() => { if (doctorById(params.doctor)) { setDoctorId(params.doctor); setFilter(doctorById(params.doctor).specialty); setSlot(""); } }, [params.doctor]);

  // Re-validate live once the user has tried to submit.
  useEffect(() => { if (touched) setErrors(validate(form, doctorId, date, slot)); }, [form, doctorId, date, slot, touched]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const addSymptom = (t) => setForm((f) => {
    const parts = f.symptoms.split(",").map((s) => s.trim()).filter(Boolean);
    const has = parts.some((p) => p.toLowerCase() === t.toLowerCase());
    return { ...f, symptoms: (has ? parts.filter((p) => p.toLowerCase() !== t.toLowerCase()) : [...parts, t]).join(", ") };
  });
  const symptomOn = (t) => form.symptoms.split(",").map((s) => s.trim().toLowerCase()).includes(t.toLowerCase());

  const dayOk = doctor ? doctor.days.includes(parseISO(date).getDay()) : true;
  const nextDays = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return isoDate(d); }), []);

  // pick doctor: keep date if they work then, else jump to their next working day
  const chooseDoctor = (id) => {
    setDoctorId(id); setSlot("");
    const d = doctorById(id);
    if (!d.days.includes(parseISO(date).getDay())) { const nd = nextDays.find((x) => d.days.includes(parseISO(x).getDay())); if (nd) setDate(nd); }
  };

  const slotInfo = useMemo(() => {
    if (!doctor || !dayOk) return null;
    const taken = bookedSlots(doctor.id, date);
    const now = new Date(); const isToday = date === todayISO(); const nowMin = now.getHours() * 60 + now.getMinutes();
    const map = (list) => list.map((s) => ({ s, state: taken.has(s) ? "booked" : isToday && slotMinutes(s) <= nowMin + 15 ? "past" : "open" }));
    const { morning, evening } = slotsFor(doctor);
    return { morning: map(morning), evening: map(evening) };
  }, [doctor, date, dayOk, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCount = slotInfo ? [...slotInfo.morning, ...slotInfo.evening].filter((x) => x.state === "open").length : 0;

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    let errs = validate(form, doctorId, date, slot);
    if (!errs.slot && bookedSlots(doctorId, date).has(slot)) { errs = { ...errs, slot: "Sorry, that slot was just booked. Please pick another." }; setSlot(""); setTick((t) => t + 1); }
    setErrors(errs);
    const first = ["name", "age", "gender", "phone", "symptoms", "doctor", "date", "slot"].find((k) => errs[k]);
    if (first) {
      const target = { doctor: "step-doctor", date: "step-slot", slot: "step-slot" }[first];
      if (target) scrollToId(target, 16); else { document.getElementById(`f-${first}`)?.focus({ preventScroll: true }); scrollToId(`f-${first}-wrap`, 24); }
      return;
    }
    const b = createBooking({ ...form, name: form.name.trim(), symptoms: form.symptoms.trim(), phone: cleanPhone(form.phone), doctorId, date, slot });
    setBooking(b);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const reset = () => { setBooking(null); setForm(EMPTY); setSlot(""); setTouched(false); setErrors({}); setTick((t) => t + 1); window.scrollTo({ top: 0, behavior: "instant" }); };

  /* ---------- Confirmation ---------- */
  if (booking) {
    return (
      <section className="container-x py-12 print-reset">
        <div className="mx-auto mb-8 max-w-3xl text-center no-print">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-mint-soft text-mint-ink"><Check size={28} aria-hidden="true" /></span>
          <h1 className="mt-4 font-display text-3xl font-extrabold">Appointment confirmed</h1>
          <p className="lead mt-2">Your OPD token is <span className="font-mono font-bold text-brand">{booking.token}</span>. Save or print the slip below and show it at reception.</p>
        </div>
        <Slip booking={booking} />
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 no-print">
          <button type="button" onClick={() => window.print()} className="btn-primary px-6"><Printer size={18} aria-hidden="true" /> Print / Save Copy Sheet (PDF)</button>
          <button type="button" onClick={reset} className="btn-secondary px-6"><CalendarPlus size={18} aria-hidden="true" /> Book Another Appointment</button>
        </div>
        <p className="mx-auto mt-5 max-w-3xl text-center text-[13px] text-slate no-print">Lost the slip later? Use <a href="#/token" className="font-semibold text-brand hover:underline">Find My Token</a> with {booking.token} or your phone number.</p>
      </section>
    );
  }

  /* ---------- Booking studio ---------- */
  const visibleDocs = DOCTORS.filter((d) => filter === "All" || d.specialty === filter);
  const filled = [form.name.trim().length > 1, form.age !== "", !!form.gender, /^[6-9]\d{9}$/.test(cleanPhone(form.phone)), form.symptoms.trim().length > 2, !!doctorId, !!slot].filter(Boolean).length;
  const pct = Math.round((filled / 7) * 100);
  const errCount = Object.keys(errors).length;

  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="container-x py-10">
          <button type="button" onClick={() => navigate("explore")} className="mb-4 flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-brand hover:underline"><ArrowLeft size={15} aria-hidden="true" /> Browse doctors</button>
          <p className="eyebrow mb-2 flex">Take Appointment</p>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Book your OPD visit</h1>
          <p className="lead mt-2 max-w-2xl">Three short steps. You'll get a token number and a printable appointment slip instantly. Pay at the clinic.</p>
        </div>
      </section>

      <form ref={formRef} id="booking-form" onSubmit={submit} noValidate className="container-x grid items-start gap-8 py-10 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
        <div className="space-y-6">
          {touched && errCount > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-coral/40 bg-coral-soft px-5 py-4 text-[14px] text-coral-ink animate-fadeIn" role="alert">
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span><span className="font-semibold">Please fix {errCount} {errCount === 1 ? "field" : "fields"}</span> highlighted below to confirm your appointment.</span>
            </div>
          )}

          {/* Step 1 */}
          <StepCard n={1} title="Patient details" sub="As they should appear on the OPD slip." icon={User} done={!!form.name && !!form.age && !!form.gender && /^[6-9]\d{9}$/.test(cleanPhone(form.phone)) && form.symptoms.trim().length > 2}>
            <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
              <div id="f-name-wrap">
                <label htmlFor="f-name" className="field-label">Full name <span className="text-coral">*</span></label>
                <input id="f-name" value={form.name} onChange={set("name")} autoComplete="name" placeholder="e.g. Rahul Verma"
                  className={`field-input ${errors.name ? "field-invalid" : ""}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
                <Err id="e-name" msg={errors.name} />
              </div>
              <div id="f-age-wrap">
                <label htmlFor="f-age" className="field-label">Age <span className="text-coral">*</span></label>
                <input id="f-age" value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value.replace(/\D/g, "").slice(0, 3) }))} inputMode="numeric" placeholder="Years"
                  className={`field-input font-mono ${errors.age ? "field-invalid" : ""}`} aria-invalid={!!errors.age} aria-describedby={errors.age ? "e-age" : undefined} />
                <Err id="e-age" msg={errors.age} />
              </div>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div id="f-gender-wrap">
                <span className="field-label" id="gender-label">Gender <span className="text-coral">*</span></span>
                <div role="radiogroup" aria-labelledby="gender-label" className="flex flex-wrap gap-2">
                  {["Male", "Female", "Other"].map((g, i) => (
                    <button key={g} id={i === 0 ? "f-gender" : undefined} type="button" role="radio" aria-checked={form.gender === g} onClick={() => setForm((f) => ({ ...f, gender: g }))}
                      className={`min-h-[48px] flex-1 rounded-lg border px-4 font-display text-[14.5px] font-semibold transition-all duration-200 ease-out ${form.gender === g ? "border-brand bg-brand text-cream shadow-card" : `bg-white text-ink hover:border-brand hover:text-brand ${errors.gender ? "border-coral" : "border-line"}`}`}>
                      {g}
                    </button>
                  ))}
                </div>
                <Err id="e-gender" msg={errors.gender} />
              </div>
              <div id="f-phone-wrap">
                <label htmlFor="f-phone" className="field-label">Mobile number <span className="text-coral">*</span></label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[14px] text-slate">+91</span>
                  <input id="f-phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d\s-]/g, "").slice(0, 12) }))} autoComplete="tel-national" inputMode="numeric" placeholder="98765 43210"
                    className={`field-input pl-14 font-mono ${errors.phone ? "field-invalid" : ""}`} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : "h-phone"} />
                </div>
                {errors.phone ? <Err id="e-phone" msg={errors.phone} /> : <p id="h-phone" className="mt-2 text-[12.5px] text-slate">10 digits. Used to find your token later.</p>}
              </div>
            </div>
            <div id="f-symptoms-wrap" className="mt-5">
              <label htmlFor="f-symptoms" className="field-label">Disease / symptoms <span className="text-coral">*</span></label>
              <textarea id="f-symptoms" rows={3} value={form.symptoms} onChange={set("symptoms")} placeholder="e.g. Fever since 2 days with body ache"
                className={`field-input resize-y ${errors.symptoms ? "field-invalid" : ""}`} aria-invalid={!!errors.symptoms} aria-describedby={errors.symptoms ? "e-symptoms" : undefined} />
              <div className="mt-3 flex flex-wrap gap-2" aria-label="Quick add symptoms">
                {SYMPTOM_TAGS.map((t) => (
                  <button key={t} type="button" aria-pressed={symptomOn(t)} onClick={() => addSymptom(t)} className={symptomOn(t) ? "chip-on" : "chip-off"}>
                    {symptomOn(t) ? <Check size={13} aria-hidden="true" /> : <span aria-hidden="true">+</span>} {t}
                  </button>
                ))}
              </div>
              <Err id="e-symptoms" msg={errors.symptoms} />
            </div>
          </StepCard>

          {/* Step 2 */}
          <StepCard id="step-doctor" n={2} title="Select doctor" sub="Fee and available slots update as soon as you choose." icon={Stethoscope} done={!!doctor}>
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter doctors by specialty">
              {["All", ...SPECIALTIES.map((s) => s.key)].map((s) => (
                <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)} className={filter === s ? "chip-on" : "chip-off"}>{s}</button>
              ))}
            </div>
            <div role="radiogroup" aria-label="Doctor" className="grid gap-3 sm:grid-cols-2">
              {visibleDocs.map((d) => {
                const on = d.id === doctorId;
                return (
                  <button key={d.id} type="button" role="radio" aria-checked={on} onClick={() => chooseDoctor(d.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ease-out ${on ? "border-brand bg-brand-soft ring-2 ring-brand/20" : "border-line bg-white hover:border-brand/50 hover:bg-cream"}`}>
                    <DoctorPhoto doctor={d} rounded="rounded-lg" className="h-14 w-14 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[15px] font-bold">{d.name}</span>
                      <span className="block truncate text-[12.5px] text-slate">{d.specialty} · {daysText(d.days)}</span>
                    </span>
                    <span className="flex flex-col items-end gap-1">
                      <span className="font-mono text-[14px] font-bold text-brand">{inr(d.fee)}</span>
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200 ${on ? "border-brand bg-brand text-cream" : "border-line"}`}>{on && <Check size={12} aria-hidden="true" />}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <Err id="e-doctor" msg={errors.doctor} />
          </StepCard>

          {/* Step 3 */}
          <StepCard id="step-slot" n={3} title="Date & time slot" sub={doctor ? `${doctor.name} sees patients ${daysText(doctor.days)}.` : "Choose a doctor first to see their open slots."} icon={CalendarDays} done={!!slot}>
            <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:items-end">
              <div>
                <label htmlFor="f-date" className="field-label">Appointment date <span className="text-coral">*</span></label>
                <input id="f-date" type="date" value={date} min={todayISO()} onChange={(e) => { const v = e.target.value; setDate(v && v < todayISO() ? todayISO() : v); setSlot(""); }}
                  className={`field-input font-mono ${errors.date ? "field-invalid" : ""}`} />
              </div>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Quick date picks">
                {nextDays.slice(0, 7).map((x) => {
                  const dt = parseISO(x); const off = doctor && !doctor.days.includes(dt.getDay()); const on = x === date;
                  return (
                    <button key={x} type="button" disabled={off} onClick={() => { setDate(x); setSlot(""); }} aria-pressed={on}
                      className={`flex min-w-[58px] flex-col items-center rounded-lg border px-2 py-1.5 transition-all duration-200 ease-out ${on ? "border-brand bg-brand text-cream" : off ? "cursor-not-allowed border-line bg-sand/60 text-slate/50" : "border-line bg-white hover:border-brand"}`}>
                      <span className="text-[11px] font-semibold uppercase">{x === todayISO() ? "Today" : DAY[dt.getDay()].slice(0, 3)}</span>
                      <span className="font-mono text-[15px] font-bold">{dt.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <Err id="e-date" msg={errors.date} />

            <div className="mt-6">
              {!doctor && (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-line bg-cream px-5 py-6 text-[14px] text-slate">
                  <Info size={18} className="text-brand" aria-hidden="true" /> Select a doctor in Step 2 to load their morning and evening slots.
                </div>
              )}
              {doctor && !dayOk && (
                <div className="flex items-center gap-3 rounded-xl border border-coral/30 bg-coral-soft px-5 py-5 text-[14px] text-coral-ink">
                  <CalendarDays size={18} aria-hidden="true" /> {doctor.name} doesn't hold OPD on {DAY[parseISO(date).getDay()]}s. Please pick another date ({daysText(doctor.days)}).
                </div>
              )}
              {slotInfo && (
                <div className="space-y-6">
                  {[["morning", "Morning Slots", "09:00 AM – 12:00 PM", Sun], ["evening", "Evening Slots", "04:00 PM – 07:30 PM", Sunset]].map(([key, label, range, I]) => (
                    <div key={key}>
                      <p className="mb-3 flex items-center gap-2 font-display text-[14.5px] font-bold">
                        <I size={17} className={key === "morning" ? "text-coral" : "text-brand"} aria-hidden="true" /> {label}
                        <span className="font-mono text-[12px] font-medium text-slate">{range}</span>
                      </p>
                      {slotInfo[key].length ? (
                        <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                          {slotInfo[key].map(({ s, state }) => {
                            const on = s === slot;
                            return (
                              <button key={s} type="button" role="radio" aria-checked={on} disabled={state !== "open"} onClick={() => setSlot(s)}
                                title={state === "booked" ? "Already booked" : state === "past" ? "Time has passed" : undefined}
                                className={`relative flex min-h-[48px] flex-col items-center justify-center rounded-lg border font-mono text-[13.5px] font-semibold transition-all duration-200 ease-out ${
                                  on ? "border-brand bg-brand text-cream shadow-lift"
                                    : state === "booked" ? "cursor-not-allowed border-line bg-sand text-slate/60"
                                    : state === "past" ? "cursor-not-allowed border-line bg-white text-slate/40"
                                    : "border-line bg-white text-ink hover:border-mint hover:bg-mint-soft"}`}>
                                <span className={state === "booked" ? "line-through" : ""}>{s}</span>
                                {state === "booked" && <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-coral-ink">Booked</span>}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="rounded-lg bg-cream px-4 py-3 text-[13.5px] text-slate">{doctor.name} has no {key} OPD.</p>
                      )}
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-4 text-[12.5px] text-slate">
                    <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-line bg-white" /> Available</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-brand" /> Selected</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-line bg-sand" /> Booked</span>
                    <span className="ml-auto font-semibold text-mint-ink">{openCount} slots open</span>
                  </div>
                </div>
              )}
              <Err id="e-slot" msg={errors.slot} />
            </div>
          </StepCard>

          <div className="lg:hidden">
            <button type="submit" className="btn-primary w-full min-h-[54px] text-[16px]"><Ticket size={19} aria-hidden="true" /> Confirm Appointment &amp; Generate Token</button>
          </div>
        </div>

        {/* Live summary */}
        <aside className="lg:sticky lg:top-[96px]" aria-label="Appointment summary">
          <div className="card overflow-hidden">
            <div className="bg-brand px-5 py-4 text-cream">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/70">Live appointment summary</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-mint transition-all duration-300 ease-out" style={{ width: `${pct}%` }} /></div>
                <span className="font-mono text-[12px]">{pct}%</span>
              </div>
            </div>
            <div className="p-5">
              {doctor ? (
                <div className="flex items-center gap-3 animate-fadeIn" key={doctor.id}>
                  <DoctorPhoto doctor={doctor} rounded="rounded-lg" className="h-16 w-16 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate font-display font-bold">{doctor.name}</p>
                    <p className="truncate text-[12.5px] text-slate">{doctor.qual}</p>
                    <div className="mt-1"><SpecBadge>{doctor.specialty}</SpecBadge></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-line p-3 text-[13.5px] text-slate"><Stethoscope size={18} aria-hidden="true" /> No doctor selected yet</div>
              )}

              <dl className="mt-5 divide-y divide-line text-[14px]">
                {[
                  ["Patient", form.name.trim() || "—"],
                  ["Age / Gender", form.age || form.gender ? `${form.age ? form.age + " yrs" : "—"}${form.gender ? " · " + form.gender : ""}` : "—"],
                  ["Phone", form.phone ? `+91 ${form.phone}` : "—", true],
                  ["Date", date ? prettyDate(date) : "—"],
                  ["Time slot", slot || "—", true],
                ].map(([k, v, mono]) => (
                  <div key={k} className="flex items-start justify-between gap-4 py-2.5">
                    <dt className="text-slate">{k}</dt>
                    <dd className={`text-right font-semibold ${v === "—" ? "text-slate/50" : "text-ink"} ${mono ? "font-mono text-[13.5px]" : ""}`}>{v}</dd>
                  </div>
                ))}
                <div className="py-2.5">
                  <dt className="text-slate">Symptoms</dt>
                  <dd className={`mt-1 line-clamp-3 text-[13.5px] ${form.symptoms.trim() ? "text-ink" : "text-slate/50"}`}>{form.symptoms.trim() || "—"}</dd>
                </div>
              </dl>

              <div className="mt-2 flex items-center justify-between rounded-lg bg-cream px-4 py-3">
                <span className="text-[13.5px] font-semibold">Consultation fee</span>
                <span className="font-mono text-xl font-bold text-brand">{doctor ? inr(doctor.fee) : "₹—"}</span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[12px] text-slate"><Lock size={12} aria-hidden="true" /> Pay at clinic. No online payment needed.</p>

              <button type="submit" className="btn-primary mt-5 hidden w-full min-h-[54px] lg:inline-flex"><Ticket size={19} aria-hidden="true" /> Confirm Appointment &amp; Generate Token</button>
            </div>
          </div>
          <div className="mt-4 space-y-2 rounded-xl border border-line bg-white/60 p-4 text-[13px] text-slate">
            <p className="flex items-center gap-2"><ShieldCheck size={15} className="text-mint" aria-hidden="true" /> Your details stay on this device.</p>
            <p className="flex items-center gap-2"><Clock size={15} className="text-mint" aria-hidden="true" /> Arrive 15 minutes before your slot.</p>
            <p className="flex items-center gap-2"><Phone size={15} className="text-mint" aria-hidden="true" /> Help: <a href={CLINIC.phoneHref} className="font-mono text-ink hover:underline">{CLINIC.phone}</a></p>
          </div>
        </aside>
      </form>
    </>
  );
}
