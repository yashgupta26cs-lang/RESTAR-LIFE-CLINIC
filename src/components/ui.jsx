import React, { useState } from "react";
import { Stethoscope, HeartPulse, Bone, ScanFace, Baby, Brain, FlaskConical, ScanLine, Pill, DoorOpen, Siren, ClipboardCheck, Circle, Star } from "lucide-react";

const ICONS = { Stethoscope, HeartPulse, Bone, ScanFace, Baby, Brain, FlaskConical, ScanLine, Pill, DoorOpen, Siren, ClipboardCheck };
import { initials, daysText, hoursText } from "../lib.js";

export function Icon({ name, ...props }) {
  const C = ICONS[name] || Circle;
  return <C aria-hidden="true" {...props} />;
}

/** Image with a branded fallback, so a failed load never shows a broken image. */
export function Img({ src, alt, className = "", fallback, eager = false, imgClass = "" }) {
  const [failed, setFailed] = useState(!src);
  return (
    <div className={`media ${className}`}>
      {failed ? (
        fallback || (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-soft via-sand to-[#EADFCF]" role="img" aria-label={alt}>
            <HeartPulse className="h-10 w-10 text-brand/40" aria-hidden="true" />
          </div>
        )
      ) : (
        <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClass}`} />
      )}
    </div>
  );
}

const TONES = ["from-brand to-[#1F7A6D]", "from-[#1F7A6D] to-mint-ink", "from-coral-ink to-coral", "from-[#2E5B57] to-brand"];

export function DoctorPhoto({ doctor: d, className = "", eager = false, rounded = "rounded-xl", initialsClass }) {
  const tone = TONES[d.name.length % TONES.length];
  return (
    <Img src={d.photo} alt={`Portrait of ${d.name}`} eager={eager} className={`${rounded} ${className}`} imgClass="object-top"
      fallback={
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${tone}`} role="img" aria-label={d.name}>
          <span className={`font-display font-bold text-cream/95 ${initialsClass || (/h-1[0-6]|w-1[0-6]/.test(className) ? "text-lg" : "text-3xl")}`}>{initials(d.name)}</span>
        </div>
      } />
  );
}

export function SpecBadge({ children }) {
  return <span className="badge-brand">{children}</span>;
}

export function Stars({ n = 5 }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} className={i < n ? "fill-coral text-coral" : "text-line"} aria-hidden="true" />)}
    </span>
  );
}

export function SectionHead({ eyebrow, title, lead, align = "left", action }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-6 mb-10 ${align === "center" ? "text-center justify-center" : ""}`}>
      <div className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="h2">{title}</h2>
        {lead && <p className="lead mt-4">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/** "Next Available Today · 04:30 PM" (or the next day with an open slot). `overlay` adds a solid background for use on photos. */
export function NextSlot({ next, overlay = false, className = "" }) {
  if (!next) return <span className={`badge ${overlay ? "bg-white/95 shadow-card" : "bg-sand"} text-slate ${className}`}>Fully booked for 3 weeks</span>;
  const today = next.label === "Today";
  const bg = overlay ? "bg-white/95 shadow-card" : today ? "bg-mint-soft" : "border border-line bg-white";
  return (
    <span className={`badge ${bg} ${today ? "text-mint-ink" : "text-slate"} ${className}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${today ? "bg-mint" : "bg-slate/40"}`} aria-hidden="true" />
      <span>{today ? "Next Available Today" : `Next: ${next.label}`}</span>
      <span className="font-mono font-medium">· {next.slot}</span>
    </span>
  );
}

export const docSchedule = (d) => ({ days: daysText(d.days), hours: hoursText(d) });
