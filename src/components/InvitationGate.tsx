"use client";

import { useEffect, useState } from "react";
import { couple, wedding } from "@/lib/content";
import { markGateOpen } from "@/lib/gate";
import { media } from "@/lib/media";
import AmbientVideo from "./AmbientVideo";
import { HexagonMonogram, OmMark } from "./motifs";

type Phase = "loading" | "ready" | "opening" | "open";
const SEEN_KEY = "invitation-opened";

/**
 * The site opens like an invitation card. A brief loading beat, then a warm
 * "Open the invitation" cue. On tap the two panels part and the site is revealed.
 * Under Reduce Motion we skip straight in so nobody gets stuck behind an animation.
 */
export default function InvitationGate() {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1";
    if (reduced || alreadySeen) {
      setPhase("open");
      markGateOpen();
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setPhase("ready"), 1300);
    return () => clearTimeout(t);
  }, []);

  function open() {
    setPhase("opening");
    sessionStorage.setItem(SEEN_KEY, "1");
    markGateOpen();
    setTimeout(() => {
      setPhase("open");
      document.body.style.overflow = "";
    }, 1150);
  }

  if (phase === "open") return null;

  const parting = phase === "opening";

  return (
    <div
      className={`fixed inset-0 z-[100] ${phase === "ready" ? "cursor-pointer" : ""}`}
      aria-hidden={phase === "opening"}
      onClick={phase === "ready" ? open : undefined}
    >
      {/* two panels that part to the sides */}
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={`absolute top-0 h-full w-1/2 bg-cream transition-transform duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
            side === "left" ? "left-0" : "right-0"
          } ${parting ? (side === "left" ? "-translate-x-full" : "translate-x-full") : ""}`}
          style={{
            background:
              "radial-gradient(120% 120% at 50% 0%, #fff9ee 0%, var(--color-cream) 60%, var(--color-cream-deep) 100%)",
            boxShadow: "inset 0 0 120px rgba(201,162,39,0.12)",
          }}
        >
          {/* thin gold seam down the centre */}
          <span
            className={`absolute top-0 h-full w-px bg-gold/40 ${side === "left" ? "right-0" : "left-0"}`}
          />
        </div>
      ))}

      {/* centred card content, fades as the panels part */}
      <div
        className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-500 ${
          parting ? "opacity-0" : "opacity-100"
        }`}
      >
        {media.gateVideo && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
            <AmbientVideo src={media.gateVideo} className="h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-cream/55" />
          </div>
        )}

        {media.ganesha ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.ganesha} alt="" className="h-12 w-auto opacity-90" aria-hidden />
        ) : (
          <OmMark className="text-2xl text-saffron" />
        )}
        <p className="mt-2 font-script text-xl text-red">शुभ विवाह</p>

        <div className="my-7 flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-[0.3em] text-ink-soft">
            Together with our families
          </span>
          <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">
            {couple.bride.first} <span className="font-script text-red">&amp;</span>{" "}
            {couple.groom.first}
          </h1>
          <span className="mt-3 text-sm tracking-[0.2em] text-ink-soft">{wedding.dates}</span>
        </div>

        {phase === "loading" ? (
          <div className="flex flex-col items-center gap-3">
            <HexagonMonogram className="h-9 w-9 animate-pulse text-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-ink-soft">Loading</span>
          </div>
        ) : (
          <button
            onClick={open}
            className="gate-cta pointer-events-auto group flex flex-col items-center gap-3"
          >
            <span className="relative grid h-16 w-16 place-items-center rounded-full border border-gold bg-cream transition-transform duration-500 group-hover:scale-110">
              <HexagonMonogram className="h-8 w-8 text-gold transition-transform duration-700 group-hover:rotate-180" />
            </span>
            <span className="font-display text-xl text-red">Open the invitation</span>
          </button>
        )}
      </div>

      <style jsx>{`
        .gate-cta {
          animation: gate-rise 0.7s ease both;
        }
        @keyframes gate-rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
