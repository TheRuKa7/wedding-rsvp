"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { onGateOpen } from "@/lib/gate";
import { CornerFlourish } from "./motifs";

/**
 * Royal, animated invitation boundary: a double gold border with ornate corner
 * flourishes. Corners draw in (GSAP) when the invitation opens, then sway gently.
 * Decorative and non-interactive; static under Reduce Motion.
 */
export default function RoyalFrame() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: gsap.Context | undefined;
    const stop = onGateOpen(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".rf-corner",
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 1.1, stagger: 0.12, ease: "power3.out", immediateRender: false },
        );
        gsap.fromTo(
          ".rf-border",
          { opacity: 0 },
          { opacity: 1, duration: 1.4, ease: "power2.out", immediateRender: false },
        );
        gsap.to(".rf-corner", {
          y: "+=4",
          rotation: "+=1.5",
          duration: 4.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "center",
        });
      }, root);
    });
    return () => {
      stop();
      ctx?.revert();
    };
  }, []);

  const corners = [
    { pos: "left-3 top-3", rot: 0 },
    { pos: "right-3 top-3", rot: 90 },
    { pos: "right-3 bottom-3", rot: 180 },
    { pos: "left-3 bottom-3", rot: 270 },
  ];

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-30 hidden sm:block" aria-hidden>
      {/* double gold border */}
      <div
        className="rf-border absolute inset-4 rounded-[28px]"
        style={{ border: "1.5px solid rgba(201,162,39,0.5)" }}
      />
      <div
        className="rf-border absolute inset-[18px] rounded-[22px]"
        style={{ border: "1px solid rgba(201,162,39,0.28)" }}
      />
      {corners.map((c, i) => (
        <div key={i} className={`rf-corner absolute ${c.pos} h-20 w-20`}>
          <CornerFlourish
            className="h-full w-full text-gold"
            style={{ transform: `rotate(${c.rot}deg)` }}
          />
        </div>
      ))}
    </div>
  );
}
