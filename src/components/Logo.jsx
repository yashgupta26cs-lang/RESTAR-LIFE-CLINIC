import React from "react";

/** Emblem: rounded emerald tile, cream medical cross, coral pulse line running through a leaf-heart. */
export function LogoMark({ size = 40, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} role="img" aria-label="DOCTOR'S CLINIC emblem">
      <rect width="48" height="48" rx="12" fill="#0F5C52" />
      <path d="M19.5 9.5h9a1 1 0 0 1 1 1v8h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8v8a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-8h-8a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h8v-8a1 1 0 0 1 1-1z" fill="#FAF7F2" />
      <path d="M24 34.5c-4.6-3-7.2-5.7-7.2-8.7a3.9 3.9 0 0 1 7.2-2.1 3.9 3.9 0 0 1 7.2 2.1c0 3-2.6 5.7-7.2 8.7z" fill="#14B8A6" opacity="0.18" />
      <path d="M11.5 25h7l2.2-4.6 3.6 9 2.6-6.2 1.6 1.8h8" fill="none" stroke="#E86A4A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ size = 40, inverse = false, sub = "Multispecialty OPD & Diagnostics", className = "", subClass = "" }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[19px] font-extrabold tracking-[0.02em] ${inverse ? "text-cream" : "text-ink"}`}>
          DOCTOR<span className="text-coral">'</span>S CLINIC
        </span>
        {sub && <span className={`${subClass} mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.2em] ${inverse ? "text-cream/60" : "text-slate"}`}>{sub}</span>}
      </span>
    </span>
  );
}
