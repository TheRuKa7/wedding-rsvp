"use client";

import { useEffect, useState } from "react";
import { nav, couple } from "@/lib/content";
import { HexagonMonogram } from "./motifs";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/85 shadow-[0_1px_0_rgba(201,162,39,0.3)] backdrop-blur-md" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2 text-red" aria-label="Home">
          <HexagonMonogram className="h-7 w-7" />
          <span className="font-display text-lg tracking-wide">
            {couple.bride.first[0]}&nbsp;&amp;&nbsp;{couple.groom.first[0]}
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-xs uppercase tracking-[0.22em] text-ink-soft md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a className="transition-colors hover:text-red" href={n.href}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#rsvp"
          className="hidden rounded-full border border-gold px-5 py-2 text-xs uppercase tracking-[0.22em] text-red transition-colors hover:bg-red hover:text-cream md:inline-block"
        >
          RSVP
        </a>

        <button
          className="text-red md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </div>
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-gold/30 bg-cream px-6 py-4 text-sm uppercase tracking-[0.22em] text-ink md:hidden">
          {[...nav].map((n) => (
            <li key={n.href}>
              <a
                className="block py-2 transition-colors hover:text-red"
                href={n.href}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
