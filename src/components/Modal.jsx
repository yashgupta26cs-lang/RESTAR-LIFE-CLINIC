import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Shared popup shell: centered panel, dimmed backdrop, closes on X, Esc or a click
 * outside, locks page scroll, keeps keyboard focus inside and restores it on close.
 */
export default function ModalShell({ onClose, labelledBy, describedBy, closeLabel = "Close", maxW = "max-w-[660px]", children }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const last = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const els = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!els.length) return;
      const first = els[0], lastEl = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; last?.focus?.({ preventScroll: true }); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 p-3 backdrop-blur-[2px] animate-fadeIn sm:p-6 no-print"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()} data-testid="modal-backdrop">
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy} aria-describedby={describedBy}
        className={`relative flex max-h-[calc(100dvh-24px)] w-full ${maxW} flex-col overflow-hidden rounded-2xl bg-white shadow-float animate-popIn sm:max-h-[88vh]`}>
        {children}
        <button ref={closeRef} type="button" onClick={onClose} aria-label={closeLabel}
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-card transition-all duration-200 ease-out hover:border-brand hover:text-brand">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export function SubHead({ icon: I, children }) {
  return <h3 className="mb-2.5 flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.12em] text-ink"><I size={15} className="text-brand" aria-hidden="true" />{children}</h3>;
}
