"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { onGateOpen } from "@/lib/gate";

/**
 * The painted ornate card border (border-image). Hidden until the invitation
 * opens, then fades in. Sits above content but is non-interactive; its centre is
 * transparent so the page scrolls within the frame.
 */
export default function OrnateFrame() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }
    const stop = onGateOpen(() => {
      gsap.to(el, { opacity: 1, duration: 1.5, ease: "power2.out" });
    });
    return () => stop();
  }, []);

  return <div ref={ref} className="ornate-frame" style={{ opacity: 0 }} aria-hidden />;
}
