"use client";

import { useEffect, useRef } from "react";

/** Dot + trailing ring. Mounts only on fine-pointer, motion-OK devices. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("cursor-fine-hide");
    let rx = 0, ry = 0, x = 0, y = 0, raf = 0;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-fine-hide");
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden>
      <div
        ref={ring}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-gold/70"
      />
      <div ref={dot} className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-red" />
    </div>
  );
}
