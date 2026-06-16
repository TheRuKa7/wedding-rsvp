"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { onGateOpen } from "@/lib/gate";

/**
 * The painted ornate card border (border-image) plus a traveling-gold-light glow
 * ring (motion graphic). Hidden until the invitation opens, then fades in. The
 * centre is transparent so the page scrolls within the frame.
 */
export default function OrnateFrame() {
  const frame = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [frame.current, glow.current].filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((e) => (e.style.opacity = "1"));
      return;
    }
    const stop = onGateOpen(() => {
      gsap.to(els, { opacity: 1, duration: 1.5, ease: "power2.out", stagger: 0.2 });
    });
    return () => stop();
  }, []);

  return (
    <>
      <div ref={frame} className="ornate-frame" style={{ opacity: 0 }} aria-hidden />
      <div ref={glow} className="frame-glow" style={{ opacity: 0 }} aria-hidden />
    </>
  );
}
