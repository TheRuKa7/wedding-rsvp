"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: an instant gold dot + a trailing ring that grows over links.
 * Mounts only on fine-pointer, motion-OK devices, and sits ABOVE everything
 * (including the invitation gate) so the pointer is never lost.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("cursor-none");
    let x = innerWidth / 2,
      y = innerHeight / 2,
      rx = x,
      ry = y,
      raf = 0;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = !!t.closest("a, button, input, textarea, select, label, [role='button']");
      // over interactive elements the native pointer shows, so hide the custom dot/ring
      if (dot.current) dot.current.style.opacity = interactive ? "0" : "1";
      if (ring.current) {
        ring.current.style.opacity = interactive ? "0" : "1";
        ring.current.dataset.hover = interactive ? "1" : "0";
      }
    };
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] hidden md:block" aria-hidden>
      <div
        ref={ring}
        data-hover="0"
        className="cursor-ring fixed left-0 top-0 h-9 w-9 rounded-full border border-red/60 transition-[width,height,background-color] duration-200"
      />
      <div
        ref={dot}
        className="cursor-dot fixed left-0 top-0 h-2 w-2 rounded-full bg-red"
      />
    </div>
  );
}
