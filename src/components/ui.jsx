import React, { useState } from "react";
import {
  Stethoscope, HeartPulse, Bone, ScanFace, Baby, Brain, FlaskConical, ScanLine, Pill, DoorOpen, Siren, ClipboardCheck,
} from "lucide-react";
import { initials, inr, daysText, hoursText } from "../lib.js";

export const ICONS = { Stethoscope, HeartPulse, Bone, ScanFace, Baby, Brain, FlaskConical, ScanLine, Pill, DoorOpen, Siren, ClipboardCheck };

/** Grayscale photo on a #EAEAEA box. A failed image hides itself: never a broken-image icon. */
export function Photo({ src, alt, className = "", imgClassName = "" }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className={`media ${className}`}>
      {!broken && (
        <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} className={`img-mono absolute inset-0 ${imgClassName}`} />
      )}
      {broken && <span className="sr-only">{alt}</span>}
    </div>
  );
}

export function Eyebrow({ children, className = "", inverse = false }) {
  return <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${inverse ? "text-neutral-400" : "text-muted"} ${className}`}>{children}</p>;
}

export function Badge({ children, inverse = false }) {
  return (
    <span className={`inline-block border px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest leading-5 ${inverse ? "border-white text-white" : "border-ink bg-white text-ink"}`}>
      {children}
    </span>
  );
}

export function Monogram({ name, size = "h-14 w-14 text-lg" }) {
  return <span aria-hidden="true" className={`flex shrink-0 items-center justify-center bg-ink font-bold tracking-wider text-white ${size}`}>{initials(name)}</span>;
}

export function SectionHead({ eyebrow, title, children, className = "" }) {
  return (
    <div className={`mb-12 max-w-3xl ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">{title}</h2>
      {children && <p className="mt-4 text-lg text-muted">{children}</p>}
    </div>
  );
}

export function PageHead({ eyebrow, title, children }) {
  return (
    <div className="border-b border-line no-print">
      <div className="container-x py-14 md:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">{title}</h1>
        {children && <p className="mt-4 max-w-2xl text-lg text-muted">{children}</p>}
      </div>
    </div>
  );
}

export const docSchedule = (d) => `${daysText(d.days)} · ${hoursText(d)}`;
export { inr };
