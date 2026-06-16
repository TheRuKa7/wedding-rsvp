"use client";

import { useEffect, useState } from "react";
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
    <section className="section-pad relative px-6">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="font-script text-2xl text-saffron-deep">गिनती शुरू</p>
          <h2 className="mt-2 font-display text-4xl text-red sm:text-5xl">The countdown is on</h2>
          <p className="mx-auto mt-3 max-w-md text-ink/80">
            Until we say our vows at The Jungle Trail Corbett Resort &amp; Spa.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-9 flex items-stretch justify-center gap-3 sm:gap-5">
            {units.map((u) => (
              <div
                key={u.label}
                className="min-w-[68px] rounded-2xl border border-gold/40 bg-cream/70 px-3 py-4 shadow-card backdrop-blur-sm sm:min-w-[96px] sm:px-5 sm:py-6"
              >
                <div className="font-display text-4xl tabular-nums text-red-deep sm:text-6xl">
                  {u.value === null ? "––" : String(u.value).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-ink-soft sm:text-xs">
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <MotifDivider className="mt-10" />
        </Reveal>
      </div>
    </section>
  );
}
