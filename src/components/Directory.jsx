import React from "react";
import { Clock, Plus, MapPin } from "lucide-react";
import { DOCTORS, FACILITIES, IMAGES } from "../data.js";
import { navigate } from "../router.js";
import { inr, nextAvailable, daysText, facilityStatus, floorOf } from "../lib.js";
import { Icon, Img, DoctorPhoto } from "./ui.jsx";
import { useProfile, useFacilityInfo } from "./Profile.jsx";

/* Editorial directory rows (Home, Overview). Pair with useHoverPreview / HoverPreviewCard. */
const idx = (i) => `// ${String(i + 1).padStart(2, "0")}`;
const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
const STATUS_TAG = { coral: "tag-coral", mint: "tag-mint", muted: "tag-muted" };

export const DOCTOR_PREVIEWS = DOCTORS.map((d) => ({
  key: d.id, src: d.photo, badge: "Profile", tone: "coral", pos: "top",
  meta: `${d.specialty} • ${d.exp} Yrs Exp • ${inr(d.fee)}`, cta: "Click for full info +",
}));
export const FACILITY_PREVIEWS = FACILITIES.map((f) => ({
  key: f.id, src: IMAGES[f.img], badge: "Explore", tone: "brand",
  meta: `${floorOf(f)} • ${f.hoursShort}`, cta: "Click for full info +",
}));

/** Editorial directory row for a doctor. Click anywhere opens the doctor popup; Book goes straight to booking. */
export function DoctorRow({ d, i, pv }) {
  const openProfile = useProfile();
  const next = nextAvailable(d);
  const today = next?.label === "Today";
  const open = () => { pv.hide(); openProfile(d); };
  return (
    <li {...pv.rowProps(d.id)}>
      <article className="dir-row group" onClick={open} data-doctor={d.id}>
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <span className="w-10 shrink-0 pt-1.5 font-mono text-[12px] font-medium text-slate/70 transition-colors duration-200 group-hover:text-coral">{idx(i)}</span>
          {!pv.fine && <DoctorPhoto doctor={d} rounded="rounded-lg" className="h-[68px] w-14 shrink-0" initialsClass="text-base" />}
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-snug sm:text-[21px]">
              <button type="button" onClick={stop(open)} className="text-left transition-colors duration-200 group-hover:text-brand">{d.name}</button>
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="tag-brand">{d.specialty}</span>
              <span className={today ? "tag-mint" : "tag-muted"}>
                {today ? <><span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" />Available today</> : next ? `Next: ${next.label}` : "Fully booked"}
              </span>
              <span className="tag-muted">{d.exp} yrs exp</span>
            </div>
            <p className="mt-2 line-clamp-1 text-[13.5px] text-slate">{d.designation} · {d.conditions.slice(0, 3).join(", ")}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-3 md:justify-end md:gap-6 md:border-0 md:pt-0">
          <div className="hidden w-[230px] text-right xl:block">
            <p className="truncate text-[13px] font-medium text-ink">{d.qual}</p>
            <p className="truncate font-mono text-[11.5px] text-slate">Reg. {d.regNo} · {daysText(d.days)}</p>
          </div>
          <div className="md:w-[104px] md:text-right">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate">Consultation</p>
            <p className="font-mono text-xl font-bold text-brand">{inr(d.fee)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-primary min-h-[44px] px-5" onClick={stop(() => navigate("book", { doctor: d.id }))} aria-label={`Book appointment with ${d.name}`}>Book</button>
            <button type="button" onClick={stop(open)} aria-label={`View full info for ${d.name}`}
              className="dir-plus group-hover:border-coral group-hover:bg-coral group-hover:text-white"><Plus size={19} aria-hidden="true" /></button>
          </div>
        </div>
      </article>
    </li>
  );
}

/** Editorial directory row for a facility. Click opens the facility popup. */
export function FacilityRow({ f, i, pv }) {
  const openFacility = useFacilityInfo();
  const status = facilityStatus(f);
  const open = () => { pv.hide(); openFacility(f); };
  return (
    <li {...pv.rowProps(f.id)}>
      <article className="dir-row group" onClick={open} data-facility={f.id}>
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <span className="w-10 shrink-0 pt-1.5 font-mono text-[12px] font-medium text-slate/70 transition-colors duration-200 group-hover:text-brand">{idx(i)}</span>
          {!pv.fine && <Img src={IMAGES[f.img]} alt="" className="h-14 w-16 shrink-0 rounded-lg" />}
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold leading-snug sm:text-[21px]">
              <Icon name={f.icon} size={19} className="hidden shrink-0 text-brand sm:block" />
              <button type="button" onClick={stop(open)} className="text-left transition-colors duration-200 group-hover:text-brand">{f.title}</button>
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={STATUS_TAG[status.tone]}>{status.label}</span>
              <span className="tag-muted">{floorOf(f)}</span>
            </div>
            <p className="mt-2 line-clamp-1 text-[13.5px] text-slate">{f.summary}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-3 md:justify-end md:gap-6 md:border-0 md:pt-0">
          <div className="hidden w-[210px] text-right lg:block">
            <p className="flex items-center justify-end gap-1.5 font-mono text-[12.5px] text-ink"><Clock size={13} className="text-brand" aria-hidden="true" />{f.hoursShort}</p>
            <p className="mt-0.5 flex items-center justify-end gap-1.5 truncate text-[12px] text-slate"><MapPin size={12} className="text-brand" aria-hidden="true" />{f.location}</p>
          </div>
          <p className="text-[13.5px] font-bold text-brand md:w-[210px] md:text-right">{f.price}</p>
          <button type="button" onClick={stop(open)} aria-label={`View details for ${f.title}`}
            className="dir-plus group-hover:border-brand group-hover:bg-brand group-hover:text-cream"><Plus size={19} aria-hidden="true" /></button>
        </div>
      </article>
    </li>
  );
}
