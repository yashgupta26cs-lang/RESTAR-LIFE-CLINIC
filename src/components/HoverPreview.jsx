import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const QUERY = "(hover: hover) and (pointer: fine)";
const W = 230, H = 280;          // card size
const OFFSET = 26;               // gap between cursor and card
const EDGE = 12;                 // keep this far from the viewport edge
const BADGE = 22;                // how far the round badge sticks out top-left
const LERP = 0.14;               // glide factor per frame

/** True on devices with a real mouse/trackpad. Touch screens get false, so no overlay ever sticks. */
export function useFinePointer() {
  const get = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(QUERY).matches;
  const [fine, setFine] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(QUERY);
    const on = () => setFine(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on));
  }, []);
  return fine;
}

/**
 * State for one hover-preview list.
 *   const pv = useHoverPreview();
 *   <ul {...pv.listProps}> <li {...pv.rowProps(key)}> … </ul>
 *   <HoverPreviewCard preview={pv} items={[…]} />
 * The card follows the cursor while it is over the list and fades out when the cursor leaves the list.
 */
export function useHoverPreview() {
  const fine = useFinePointer();
  const [activeKey, setActiveKey] = useState(null);
  const [visible, setVisible] = useState(false);
  const target = useRef({ x: -999, y: -999 });
  const fresh = useRef(true);        // next frame should jump to the cursor instead of gliding
  const visibleRef = useRef(false);
  const listRef = useRef(null);
  const hideTimer = useRef(null);

  const track = useCallback((e) => { target.current = { x: e.clientX, y: e.clientY }; }, []);
  const show = useCallback((key, e) => {
    if (!fine || (e && e.pointerType === "touch")) return;
    clearTimeout(hideTimer.current);
    if (e) track(e);
    if (!visibleRef.current) fresh.current = true;
    visibleRef.current = true;
    setActiveKey(key); setVisible(true);
  }, [fine, track]);
  const hide = useCallback(() => {
    if (!visibleRef.current) return;
    visibleRef.current = false;
    setVisible(false);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setActiveKey(null), 220);
  }, []);

  // Page scrolls under a still cursor: re-check which row (if any) is now under it.
  useEffect(() => {
    if (!fine) return;
    const onScroll = () => {
      if (!visibleRef.current) return;
      const { x, y } = target.current;
      const el = document.elementFromPoint(x, y);
      const row = el && listRef.current && listRef.current.contains(el) ? el.closest("[data-preview-key]") : null;
      if (row) setActiveKey(row.getAttribute("data-preview-key")); else hide();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(hideTimer.current); };
  }, [fine, hide]);

  // A real mouse was unplugged / window moved to a touch screen.
  useEffect(() => { if (!fine) { visibleRef.current = false; setVisible(false); setActiveKey(null); } }, [fine]);

  const listProps = fine ? { ref: listRef, onPointerMove: track, onPointerLeave: hide } : { ref: listRef };
  const rowProps = (key) => (fine ? { "data-preview-key": key, onPointerEnter: (e) => show(key, e) } : {});
  return { fine, activeKey, visible, target, fresh, listProps, rowProps, show, hide };
}

const TONES = {
  coral: "bg-coral text-white",
  brand: "bg-brand text-cream",
  mint: "bg-mint-ink text-white",
};

/**
 * Floating, cursor-following preview card (fixed, z-50, never takes pointer events).
 * items: [{ key, src, alt, badge, badgeSign, tone, lines?, meta, cta, pos? }]
 * Every photo is preloaded and stacked, so switching rows swaps the image with no flicker.
 */
export function HoverPreviewCard({ preview, items }) {
  const { fine, activeKey, visible, target, fresh } = preview;
  const boxRef = useRef(null);
  const cur = useRef({ x: 0, y: 0 });

  // Preload and decode every photo once.
  const srcKey = items.map((i) => i.src).join("|");
  useEffect(() => {
    if (!fine) return;
    items.forEach((i) => { const im = new Image(); im.decoding = "async"; im.src = i.src; im.decode?.().catch(() => {}); });
  }, [fine, srcKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // rAF loop with linear interpolation, clamped to the viewport.
  const running = fine && activeKey !== null;
  useEffect(() => {
    if (!running) return;
    let raf;
    const tick = () => {
      const t = target.current, vw = window.innerWidth, vh = window.innerHeight;
      let x = t.x + OFFSET, y = t.y + OFFSET;
      if (x + W + EDGE > vw) x = t.x - OFFSET - W;            // flip to the left of the cursor near the right edge
      if (y + H + EDGE > vh) y = t.y - OFFSET - H;            // flip above the cursor near the bottom edge
      x = Math.min(Math.max(x, EDGE + BADGE), vw - W - EDGE);
      y = Math.min(Math.max(y, EDGE + BADGE), vh - H - EDGE);
      if (fresh.current) { cur.current = { x, y }; fresh.current = false; }
      cur.current.x += (x - cur.current.x) * LERP;
      cur.current.y += (y - cur.current.y) * LERP;
      if (boxRef.current) boxRef.current.style.transform = `translate3d(${cur.current.x.toFixed(1)}px, ${cur.current.y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, target, fresh]);

  if (!fine) return null;
  const item = items.find((i) => i.key === activeKey) || null;
  // Portal to <body> so no transformed ancestor can trap the fixed card.
  return createPortal(
    <div ref={boxRef} aria-hidden="true" data-testid="hover-preview"
      className="pointer-events-none fixed left-0 top-0 z-50 no-print" style={{ width: W, height: H, transform: "translate3d(-9999px,-9999px,0)" }}>
      <div className={`pointer-events-none relative h-full w-full origin-top-left transition-[opacity,transform] duration-[180ms] ease-out ${visible && item ? "scale-100 opacity-100" : "scale-[0.92] opacity-0"}`}>
        {/* Framed photo */}
        <div className="absolute inset-0 rounded-2xl border border-line bg-white p-1.5 shadow-float">
          <div className="relative h-full w-full overflow-hidden rounded-[12px] bg-sand">
            {items.map((i) => (
              <img key={i.key} src={i.src} alt="" draggable="false" decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: item && i.key === item.key ? 1 : 0, objectPosition: i.pos || "center" }} />
            ))}
            {item && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1F1B]/95 via-[#0B1F1B]/65 to-transparent px-3.5 pb-3 pt-16">
                {item.lines?.map((l) => <p key={l} className="line-clamp-2 text-[11px] leading-snug text-cream/80">{l}</p>)}
                <p className="mt-1 font-mono text-[10.5px] leading-[1.45] text-cream/90">{item.meta}</p>
                <p className="mt-1.5 font-display text-[11.5px] font-extrabold uppercase leading-tight tracking-[0.12em] text-white">{item.cta}</p>
              </div>
            )}
          </div>
        </div>
        {/* Overlapping round badge */}
        {item && (
          <span className={`absolute -left-[22px] -top-[22px] flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full shadow-lift ring-4 ring-cream ${TONES[item.tone] || TONES.coral}`}>
            <span className="text-[9.5px] font-bold uppercase leading-none tracking-[0.14em]">{item.badge}</span>
            <span className="mt-1 text-[16px] font-bold leading-none">{item.badgeSign || "+"}</span>
          </span>
        )}
      </div>
    </div>,
    document.body
  );
}
