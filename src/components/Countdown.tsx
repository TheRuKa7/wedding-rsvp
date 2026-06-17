"use client";

import { Fragment, useEffect, useState } from "react";
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
    <section className="relative px-6 pb-16 pt-8">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.32em] text-saffron-deep">
            Counting down to the celebration
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-7 flex items-center justify-center gap-5 sm:gap-9">
            {units.map((u, i) => (
              <Fragment key={u.label}>
                {i > 0 && <span className="h-10 w-px bg-gold/30 sm:h-12" aria-hidden />}
                <div className="flex min-w-[44px] flex-col items-center sm:min-w-[56px]">
                  <span className="font-display text-4xl font-medium tabular-nums text-red sm:text-5xl">
                    {u.value === null ? "––" : String(u.value).padStart(2, "0")}
                  </span>
                  <span className="mt-2 text-[9px] uppercase tracking-[0.28em] text-ink-soft sm:text-[10px]">
                    {u.label}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <MotifDivider className="mt-12" />
        </Reveal>
      </div>
    </section>
  );
}
