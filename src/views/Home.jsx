import React, { useMemo, useState } from "react";
import { ArrowRight, Search, CalendarClock } from "lucide-react";
import { DOCTORS, SPECIALTIES, IMAGES } from "../data.js";
import { navigate } from "../router.js";
import { inr, nextAvailable } from "../lib.js";
import { Photo, Eyebrow, Badge, Monogram, SectionHead, ICONS } from "../components/ui.jsx";

export default function Home() {
  const [q, setQ] = useState("");
  const featured = DOCTORS.filter((d) => d.featured);
  const next = useMemo(() => Object.fromEntries(featured.map((d) => [d.id, nextAvailable(d)])), []); // eslint-disable-line

  const submit = (e) => { e.preventDefault(); navigate("explore", { q: q.trim() }); };

  return (
    <>
      {/* 1. Asymmetric editorial hero */}
      <section className="border-b border-line">
        <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 py-16 lg:py-24">
          <div className="lg:col-span-6 flex flex-col justify-center min-w-0">
            <Eyebrow>Multispecialty Outpatient Clinic</Eyebrow>
            <h1 className="text-[36px] sm:text-[52px] lg:text-[60px] font-extrabold break-words leading-[1.02] tracking-[-0.03em]">
              Senior specialists.<br />Same-day diagnostics.<br />Zero queues.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Eight consultants, an automated lab and a 24/7 pharmacy under one roof. Book a fixed OPD slot
              online and walk in with your digital token.
            </p>

            <form onSubmit={submit} role="search" className="mt-10 flex border border-ink">
              <label htmlFor="home-search" className="sr-only">Search doctors, specialties, or symptoms</label>
              <span className="flex items-center pl-4 text-ink" aria-hidden="true"><Search size={20} strokeWidth={1.75} /></span>
              <input
                id="home-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search doctors, specialties, or symptoms..."
                className="min-w-0 flex-1 bg-white px-4 py-4 text-base outline-none placeholder:text-neutral-400"
              />
              <button type="submit" className="bg-ink px-6 text-[15px] font-semibold text-white hover:bg-neutral-800">Search</button>
            </form>
            <p className="mt-3 text-sm text-muted">
              Try{" "}
              {["Chest pain", "Skin rash", "Migraine", "Dr. Rao"].map((t, i) => (
                <React.Fragment key={t}>
                  {i > 0 && ", "}
                  <button type="button" onClick={() => navigate("explore", { q: t })} className="font-semibold text-ink underline underline-offset-4">{t}</button>
                </React.Fragment>
              ))}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate("book")} className="btn-primary">Take Appointment <ArrowRight size={18} aria-hidden="true" /></button>
              <button type="button" onClick={() => navigate("explore")} className="btn-secondary">Overview / Explore</button>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-[620px]">
            <Photo src={IMAGES.hero} alt="Modern hospital lobby with reception counter" className="absolute inset-0" />
            <div className="absolute bottom-0 left-0 max-w-[82%] bg-ink p-6 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Main Lobby · Ground Floor</p>
              <p className="mt-2 text-lg font-semibold leading-snug">Open Mon – Sat, 08:00 AM to 08:00 PM. Lab and emergency open 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Metrics strip */}
      <section className="container-x py-16">
        <dl className="grid grid-cols-2 lg:grid-cols-4 border-l border-t border-line">
          {[
            ["08+", "Senior Specialists"],
            ["12+", "Diagnostic Facilities"],
            ["15 Min", "Avg. OPD Wait"],
            ["100%", "Instant Digital Token"],
          ].map(([n, l]) => (
            <div key={l} className="border-r border-b border-line p-6 md:p-8">
              <dt className="sr-only">{l}</dt>
              <dd className="font-mono text-3xl md:text-[40px] font-semibold tracking-tight leading-none">{n}</dd>
              <dd className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 3. Specialties matrix */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow="Clinical Specialties" title="Six departments. One reception desk.">
            Choose a department to see its doctors, timings and fees.
          </SectionHead>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-line bg-white">
            {SPECIALTIES.map((s, i) => {
              const Icon = ICONS[s.icon];
              const count = DOCTORS.filter((d) => d.specialty === s.key).length;
              return (
                <button
                  key={s.key} type="button" onClick={() => navigate("explore", { spec: s.key })}
                  className="group flex flex-col items-start gap-5 border-r border-b border-line p-8 text-left hover:bg-ink hover:text-white"
                >
                  <div className="flex w-full items-start justify-between">
                    <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-mono text-sm text-muted group-hover:text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{s.key}</h3>
                    <p className="mt-2 text-[15px] text-muted group-hover:text-neutral-300">{s.blurb}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold">
                    {count} {count === 1 ? "doctor" : "doctors"} <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured doctors */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Featured Specialists" title="Meet some of our senior consultants." className="mb-0" />
            <a href="#/explore" className="inline-flex items-center gap-2 border-b border-ink pb-1 text-[15px] font-semibold">View All Doctors <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((d) => {
              const n = next[d.id];
              return (
                <article key={d.id} className="flex flex-col border border-line">
                  <div className="flex items-start gap-4 border-b border-line bg-surface p-6">
                    <Monogram name={d.name} />
                    <div>
                      <Badge>{d.specialty}</Badge>
                      <h3 className="mt-2 text-xl font-bold tracking-tight">{d.name}</h3>
                      <p className="text-sm text-muted">{d.qual}</p>
                    </div>
                  </div>
                  <dl className="px-6 text-sm">
                    <div className="flex justify-between gap-4 border-b border-line py-3.5"><dt className="text-muted">Experience</dt><dd className="font-medium">{d.exp} years</dd></div>
                    <div className="flex justify-between gap-4 border-b border-line py-3.5">
                      <dt className="text-muted inline-flex items-center gap-1.5"><CalendarClock size={15} aria-hidden="true" /> Next available</dt>
                      <dd className="font-mono font-semibold">{n ? `${n.label}, ${n.slot}` : "Fully booked"}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-3.5"><dt className="text-muted">Consultation fee</dt><dd className="font-mono text-2xl font-semibold">{inr(d.fee)}</dd></div>
                  </dl>
                  <div className="mt-auto p-6 pt-2">
                    <button type="button" onClick={() => navigate("book", { doctor: d.id, date: n?.date })} className="btn-primary w-full">Book Now</button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How it works */}
      <section className="bg-surface py-16 md:py-24 border-t border-line">
        <div className="container-x">
          <SectionHead eyebrow="How It Works" title="From booking to consultation in three steps." />
          <ol className="grid md:grid-cols-3 border-l border-t border-ink bg-white">
            {[
              ["01", "Select Specialist & Slot", "Pick a doctor and a fixed time slot that suits you. Booked slots are greyed out."],
              ["02", "Enter Patient Details", "Name, age, phone and symptoms, so your doctor is prepared before you arrive."],
              ["03", "Download / Print OPD Token Sheet", "Get your token number instantly. Print it, save it as a PDF or find it later."],
            ].map(([n, t, d], i) => (
              <li key={n} className="relative border-r border-b border-ink p-8 md:p-10">
                <span className="font-mono text-5xl font-semibold leading-none">{n}</span>
                <h3 className="mt-8 text-xl font-bold tracking-tight">{t}</h3>
                <p className="mt-3 text-[15px] text-muted">{d}</p>
                {i < 2 && <ArrowRight className="absolute right-8 top-10 hidden md:block" size={24} strokeWidth={1.5} aria-hidden="true" />}
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate("book")} className="btn-primary">Take Appointment</button>
            <button type="button" onClick={() => navigate("token")} className="btn-secondary">Find My Token</button>
          </div>
        </div>
      </section>
    </>
  );
}
