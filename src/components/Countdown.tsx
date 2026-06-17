"use client";

import { useEffect, useState } from "react";
import { rsvp, hosts } from "@/lib/content";
import Reveal from "./Reveal";
import { MotifDivider } from "./motifs";

// Wedding begins 27 February 2027, 09:00 IST
const TARGET = new Date("2027-02-27T09:00:00+05:30").getTime();

type Parts = { days: number; hours: number; mins: number; secs: number };

function diff(): Parts {
  const ms = Math.max(0, TARGET - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}

export default function Countdown() {
  // null until mounted, so server and client first paint match (no hydration mismatch)
  const [t, setT] = useState<Parts | null>(null);

  useEffect(() => {
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const units: { label: string; value: number | null }[] = [
    { label: "Days", value: t?.days ?? null },
    { label: "Hours", value: t?.hours ?? null },
    { label: "Minutes", value: t?.mins ?? null },
    { label: "Seconds", value: t?.secs ?? null },
  ];

  return (
    <section className="relative px-6 pb-12 pt-2">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-saffron-deep">
            Counting down to the celebration
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-5 flex items-stretch justify-center gap-3 sm:gap-5">
            {units.map((u) => (
              <div
                key={u.label}
                className="min-w-[64px] rounded-2xl border border-gold/40 bg-cream/70 px-3 py-3.5 shadow-card backdrop-blur-sm sm:min-w-[88px] sm:px-5 sm:py-5"
              >
                <div className="font-display text-3xl tabular-nums text-red-deep sm:text-5xl">
                  {u.value === null ? "––" : String(u.value).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-ink-soft sm:text-xs">
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="rounded-full border border-gold/60 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-red">
              {rsvp.tag}
            </span>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{rsvp.note}</p>
            <p className="text-xs italic text-ink-soft">{hosts.formalNote}</p>
          </div>
          <MotifDivider className="mt-8" />
        </Reveal>
      </div>
    </section>
  );
}
