import React, { useMemo, useState } from "react";
import { Search, ArrowRight, CalendarPlus, Compass, ShieldCheck, Users, Building2, Timer, Ticket, CheckCircle2, Stethoscope, ClipboardList, FileCheck2, Quote, Sparkles, ConciergeBell, BadgeCheck } from "lucide-react";
import { DOCTORS, SPECIALTIES, IMAGES, TESTIMONIALS, CLINIC } from "../data.js";
import { navigate } from "../router.js";
import { nextAvailable, doctorById } from "../lib.js";
import { Icon, Img, SectionHead, Stars, DoctorPhoto } from "../components/ui.jsx";
import { useHoverPreview, HoverPreviewCard } from "../components/HoverPreview.jsx";
import { DoctorRow, DOCTOR_PREVIEWS } from "../components/Directory.jsx";
import { useProfile } from "../components/Profile.jsx";

function clinicStatus(now = new Date()) {
  const day = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
  const open = day !== 0 && m >= 480 && m < 1200;
  return { open, label: open ? "Open Now" : day === 0 ? "Closed Today" : "Closed Now", sub: open ? "Closes at 8:00 PM" : "Opens 8:00 AM, Mon – Sat" };
}

function Hero() {
  const openProfile = useProfile();
  const [q, setQ] = useState("");
  const status = clinicStatus();
  const soonest = useMemo(() => {
    let best = null;
    DOCTORS.forEach((d) => { const n = nextAvailable(d); if (n && (!best || n.date + n.slot < best.n.date + best.n.slot)) best = { d, n }; });
    return best;
  }, []);
  const featured = doctorById("meera-joshi");
  const quick = ["Fever", "Chest pain", "Back pain", "Skin rash", "Migraine"];
  const go = (e) => { e.preventDefault(); navigate("explore", { q: q.trim(), tab: "doctors" }); };

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-mint/10 blur-3xl" />
      <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-soft px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-brand">
            <ShieldCheck size={14} aria-hidden="true" /> Trusted Multispecialty Care
          </span>
          <h1 className="mt-6 font-display text-[40px] font-extrabold leading-[1.06] text-ink sm:text-[54px] lg:text-[60px]">
            Unhurried care from doctors <span className="text-brand">who know you</span><span className="text-coral">.</span>
          </h1>
          <p className="lead mt-5 max-w-xl">
            Eight senior specialists, same-day diagnostics and a 24/7 pharmacy under one warm, calm roof. Book a slot in a minute and walk in with your digital OPD token.
          </p>

          <form onSubmit={go} role="search" className="mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-line bg-white p-2 shadow-card transition-all duration-200 ease-out focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
            <Search size={20} className="ml-2 shrink-0 text-slate" aria-hidden="true" />
            <label htmlFor="hero-search" className="sr-only">Search doctors, specialties, or symptoms</label>
            <input id="hero-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctors, specialties, or symptoms..."
              className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[15px] outline-none placeholder:text-[#9AA39F]" />
            <button type="submit" className="btn-primary min-h-[42px] px-4">Search</button>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-slate">
            <span>Popular:</span>
            {quick.map((t) => (
              <button key={t} type="button" onClick={() => navigate("explore", { q: t, tab: "doctors" })} className="rounded-full border border-line bg-white px-3 py-1 transition-all duration-200 hover:border-brand hover:text-brand">{t}</button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn-primary px-6" onClick={() => navigate("book")}><CalendarPlus size={18} aria-hidden="true" /> Take Appointment</button>
            <button type="button" className="btn-secondary px-6" onClick={() => navigate("explore")}><Compass size={18} aria-hidden="true" /> Explore Clinic &amp; Doctors</button>
          </div>

          <div className="mt-9 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["arjun-mehta", "priya-nair", "vikram-rao", "kavya-iyer"].map((id) => {
                const d = doctorById(id);
                return (
                  <button key={id} type="button" onClick={() => openProfile(d)} aria-label={`View profile of ${d.name}`} title={d.name}
                    className="relative rounded-full transition-transform duration-200 ease-out hover:z-10 hover:-translate-y-0.5">
                    <DoctorPhoto doctor={d} rounded="rounded-full" className="h-10 w-10 border-2 border-cream" initialsClass="text-[12px]" />
                  </button>
                );
              })}
            </div>
            <p className="text-[13.5px] text-slate"><Stars /> <span className="ml-1 font-semibold text-ink">4.9</span> from 3,200+ patient reviews</p>
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-slate">
            <BadgeCheck size={16} className="text-mint-ink" aria-hidden="true" />
            <span><span className="font-semibold text-ink">{CLINIC.accreditation.title}</span> · {CLINIC.accreditation.hygiene}</span>
          </p>
        </div>

        {/* Showcase */}
        <div className="relative mx-auto w-full max-w-[540px]">
          <figure className="relative">
            <Img src={IMAGES.hero} alt="Bright, modern reception desk at the clinic entrance" eager className="aspect-[4/5] rounded-2xl border border-line shadow-float" />
            <figcaption className="absolute bottom-4 left-4 hidden sm:flex items-center gap-3 rounded-lg bg-ink/60 px-4 py-2.5 text-[12.5px] text-cream">
              <span className="flex items-center gap-2"><ConciergeBell size={15} className="text-mint" aria-hidden="true" /> Reception &amp; registration</span>
              <span className="font-mono text-cream/80">Ground floor</span>
            </figcaption>
          </figure>

          {/* Live status card */}
          <div className="absolute -left-4 top-8 w-[250px] rounded-xl border border-line bg-white p-4 shadow-float sm:-left-10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {status.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-50" />}
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.open ? "bg-mint" : "bg-coral"}`} />
              </span>
              <p className="font-display text-[14px] font-bold">{status.label}</p>
            </div>
            <p className="mt-0.5 pl-[18px] text-[12px] text-slate">{status.sub}</p>
            {soonest && (
              <div className="mt-3 rounded-lg bg-cream p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate">Next available slot</p>
                <p className="mt-1 font-mono text-[15px] font-bold text-brand">{soonest.n.label}, {soonest.n.slot}</p>
                <p className="text-[12.5px] text-slate">{soonest.d.name} · {soonest.d.specialty}</p>
              </div>
            )}
          </div>

          {/* Specialist card (portrait from the supplied reference image) */}
          {featured && (
            <button type="button" onClick={() => openProfile(featured)} aria-label={`View profile of ${featured.name}`}
              className="absolute -bottom-6 -right-2 flex w-[260px] items-center gap-3 rounded-xl border border-line bg-white p-3 text-left shadow-float transition-all duration-200 ease-out hover:-translate-y-0.5 sm:-right-8">
              <DoctorPhoto doctor={featured} rounded="rounded-lg" className="h-16 w-16 shrink-0" initialsClass="text-lg" />
              <span className="min-w-0">
                <span className="block font-display text-[14px] font-bold">{featured.name}</span>
                <span className="block text-[12px] text-slate">{featured.specialty} · {featured.exp}+ yrs</span>
                <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-brand">View profile <ArrowRight size={13} aria-hidden="true" /></span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  const items = [
    { icon: Users, value: "08+", label: "Senior Specialists", note: "MD / DM qualified" },
    { icon: Building2, value: "10+", label: "Modern Facilities", note: "Lab, imaging, pharmacy" },
    { icon: Timer, value: "15 Min", label: "Avg. Wait Time", note: "With a booked slot" },
    { icon: Ticket, value: "Instant", label: "Digital OPD Token", note: "Printable slip in seconds" },
  ];
  return (
    <section aria-label="Clinic highlights" className="container-x pb-6 pt-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: I, value, label, note }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><I size={22} aria-hidden="true" /></span>
            <div>
              <p className="font-display text-2xl font-extrabold text-ink">{value}</p>
              <p className="text-[14px] font-semibold text-ink">{label}</p>
              <p className="text-[12.5px] text-slate">{note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Specialties() {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHead eyebrow="Departments" title="Six specialties, one front desk" lead="Pick a department to see its doctors, timings and fees. Not sure who to see? Start with General Medicine."
          action={<button type="button" className="btn-ghost" onClick={() => navigate("explore")}>All doctors <ArrowRight size={16} aria-hidden="true" /></button>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALTIES.map((s, i) => {
            const count = DOCTORS.filter((d) => d.specialty === s.key).length;
            return (
              <button key={s.key} type="button" onClick={() => navigate("explore", { spec: s.key, tab: "doctors" })}
                className="card card-hover group flex items-start gap-4 p-6 text-left">
                <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ease-out group-hover:bg-brand group-hover:text-cream ${i % 3 === 1 ? "bg-coral-soft text-coral-ink" : "bg-mint-soft text-mint-ink"}`}>
                  <Icon name={s.icon} size={24} />
                </span>
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg font-bold">{s.key}</span>
                    <ArrowRight size={18} className="text-slate transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:text-brand" aria-hidden="true" />
                  </span>
                  <span className="mt-1.5 block text-[14.5px] leading-relaxed text-slate">{s.blurb}</span>
                  <span className="mt-3 inline-block text-[12.5px] font-semibold text-brand">{count} {count === 1 ? "specialist" : "specialists"}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedDoctors() {
  const pv = useHoverPreview();
  return (
    <section className="section bg-sand">
      <div className="container-x">
        <SectionHead eyebrow="Our specialists" title="Meet our senior doctors" lead="Every consultant sees patients personally. No juniors standing in, no rushed five-minute visits. Tap or click a doctor for the full profile."
          action={<button type="button" className="btn-secondary" onClick={() => navigate("explore", { tab: "doctors" })}>Search &amp; filter doctors <ArrowRight size={16} aria-hidden="true" /></button>} />
        <ol {...pv.listProps} className="space-y-3" aria-label="Doctors">
          {DOCTORS.map((d, i) => <DoctorRow key={d.id} d={d} i={i} pv={pv} />)}
        </ol>
      </div>
      <HoverPreviewCard preview={pv} items={DOCTOR_PREVIEWS} />
    </section>
  );
}

function Showcase() {
  const tiles = [
    { src: IMAGES.lounge, alt: "Clean patient waiting lounge with teal sofas", cap: "Patient waiting lounge", sub: "Air-purified, with a live token display board", cls: "md:col-span-2 md:row-span-2 min-h-[320px]" },
    { src: IMAGES.reception, alt: "Registration counter at the front desk", cap: "Front desk & registration", sub: "Show your token, pay and go in", cls: "min-h-[200px]" },
    { src: IMAGES.consult, alt: "Doctor consulting a patient in a private room", cap: "Consultation rooms", sub: "8 private, sound-insulated rooms", cls: "min-h-[200px]" },
    { src: IMAGES.cardiac, alt: "3D heart model in the cardiac care unit", cap: "Cardiac care unit", sub: "ECG and heart-health checks", cls: "min-h-[200px]" },
    { src: IMAGES.labTubes, alt: "Blood sample tubes in the pathology lab", cap: "Automated pathology", sub: "Same-day reports", cls: "min-h-[200px]" },
  ];
  return (
    <section className="section">
      <div className="container-x">
        <SectionHead eyebrow="Clinic gallery" title="Built for comfort, hygiene and fast diagnostics"
          action={<button type="button" className="btn-ghost" onClick={() => navigate("explore", { tab: "facilities" })}>All facilities <ArrowRight size={16} aria-hidden="true" /></button>} />
        <div className="grid auto-rows-[200px] gap-4 md:grid-cols-4">
          {tiles.map((t) => (
            <figure key={t.cap} className={`group relative overflow-hidden rounded-xl border border-line ${t.cls}`}>
              <Img src={t.src} alt={t.alt} className="absolute inset-0" imgClass="transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent p-4 pt-12 text-cream">
                <p className="font-display text-[15px] font-bold">{t.cap}</p>
                <p className="text-[12.5px] text-cream/80">{t.sub}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const points = ["Consultants with 9 to 21 years of experience", "Every doctor's medical registration number shown on their profile", "Lab, X-ray, ECG and pharmacy in the same building", "Transparent fees, shown before you book", "Digital OPD tokens: no queue at the front desk"];
  const meera = doctorById("meera-joshi");
  const openProfile = useProfile();
  return (
    <section className="section bg-white border-y border-line">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <Img src={IMAGES.about} alt="Doctor checking a patient's blood pressure during a consultation" className="aspect-[5/4] rounded-2xl border border-line" />
          <button type="button" onClick={() => openProfile(meera)} aria-label={`View profile of ${meera.name}`}
            className="absolute -bottom-8 right-4 w-44 rounded-xl border border-line bg-white p-2 text-left shadow-float transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lift sm:right-8">
            <DoctorPhoto doctor={meera} rounded="rounded-lg" className="aspect-square" />
            <span className="block px-1 pb-1 pt-2">
              <span className="block font-display text-[13px] font-bold">{meera.name}</span>
              <span className="block text-[11.5px] text-slate">Cardiologist · Tue, Thu, Sat</span>
            </span>
          </button>
        </div>
        <div>
          <p className="eyebrow mb-3"><Sparkles size={14} aria-hidden="true" /> About the clinic</p>
          <h2 className="h2">A neighbourhood clinic with hospital-grade depth</h2>
          <p className="lead mt-5">
            DOCTOR'S CLINIC brings senior specialists and modern diagnostics together in {CLINIC.addressShort}. We keep appointments on time, explain every test, and send you home with a clear plan.
          </p>
          <ul className="mt-7 space-y-3">
            {points.map((p) => <li key={p} className="flex items-start gap-3 text-[15px]"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-mint" aria-hidden="true" />{p}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={() => navigate("explore")}>Explore the clinic <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const steps = [
    { n: "01", icon: Stethoscope, t: "Choose Doctor & Slot", d: "Search by name, specialty or symptom, then pick an open morning or evening slot." },
    { n: "02", icon: ClipboardList, t: "Enter Patient Details", d: "Name, age, phone and what's bothering you. It takes under a minute." },
    { n: "03", icon: FileCheck2, t: "Get Instant OPD Token Sheet", d: "Receive a token like DC-101 and a printable slip. Show it at reception." },
  ];
  return (
    <section className="section">
      <div className="container-x">
        <SectionHead align="center" eyebrow="How booking works" title="Three steps from search to seat" />
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(({ n, icon: I, t, d }, i) => (
            <li key={n} className="card relative p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-4xl font-bold text-brand/20">{n}</span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-cream"><I size={22} aria-hidden="true" /></span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-slate">{d}</p>
              {i < 2 && <ArrowRight size={20} className="absolute -right-[19px] top-1/2 hidden -translate-y-1/2 rounded-full bg-cream text-brand md:block" aria-hidden="true" />}
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <button type="button" className="btn-primary px-7" onClick={() => navigate("book")}><CalendarPlus size={18} aria-hidden="true" /> Start booking</button>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section bg-sand">
      <div className="container-x">
        <SectionHead eyebrow="Patient stories" title="What our patients say" />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex flex-col p-7">
              <Quote size={28} className="text-coral" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-[15.5px] leading-relaxed text-ink">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center justify-between border-t border-line pt-5">
                <span>
                  <span className="block font-display font-bold">{t.name}</span>
                  <span className="block text-[13px] text-slate">{t.meta}</span>
                </span>
                <Stars n={t.rating} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="container-x py-16">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-brand px-8 py-10 text-cream sm:px-12">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Already booked? Find your token in seconds.</h2>
          <p className="mt-2 text-cream/75">Enter your token number or phone number to view and re-print your slip.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn bg-cream text-brand hover:bg-white" onClick={() => navigate("token")}><Ticket size={18} aria-hidden="true" /> Find My Token</button>
          <button type="button" className="btn border border-cream/30 text-cream hover:bg-white/10" onClick={() => navigate("book")}>Take Appointment</button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Metrics />
      <Specialties />
      <FeaturedDoctors />
      <Showcase />
      <About />
      <Journey />
      <Testimonials />
      <CtaBand />
    </>
  );
}
