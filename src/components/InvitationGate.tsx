"use client";

import { useEffect, useRef, useState } from "react";
import { couple, wedding } from "@/lib/content";
import { markGateOpen } from "@/lib/gate";
import { media } from "@/lib/media";
import { HexagonMonogram } from "./motifs";

type Phase = "idle" | "playing" | "open";
const SEEN_KEY = "invitation-opened";

/**
 * Action-controlled opening: the closed card waits on screen; tapping "Open the
 * invitation" plays the envelope-opening video through to the end, and only then
 * reveals the site. Skips under Reduce Motion or once opened this session.
 */
export default function InvitationGate() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [src, setSrc] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SEEN_KEY) === "1";
    if (reduced || seen || !media.gateVideo) {
      setPhase("open");
      markGateOpen();
      return;
    }
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    setSrc(isDesktop && media.gateVideoDesktop ? media.gateVideoDesktop : media.gateVideo);
    document.body.style.overflow = "hidden";
  }, []);

  function finish() {
    if (finished.current) return;
    finished.current = true;
    sessionStorage.setItem(SEEN_KEY, "1");
    markGateOpen();
    // let the final frame settle, then lift the cover
    setTimeout(() => {
      setPhase("open");
      document.body.style.overflow = "";
    }, 500);
  }

  function open() {
    setPhase("playing");
    const v = videoRef.current;
    if (!v) return finish();
    v.currentTime = 0;
    v.play().catch(() => finish());
    // safety: if the video stalls or "ended" never fires, open anyway
    setTimeout(finish, 11000);
  }

  if (phase === "open") return null;
  const playing = phase === "playing";

  return (
    <div className="fixed inset-0 z-[100] bg-cream" aria-hidden={playing}>
      {/* the card / envelope video, full-bleed */}
      {src && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-100"
          }`}
          src={src}
          poster="/video/gate-poster.webp"
          muted
          playsInline
          preload="auto"
          onEnded={finish}
          onError={() => finish()}
        />
      )}

      {/* idle overlay: legible scrim + invitation text + open cue. Fades out on play. */}
      <div
        className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-500 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cream/88 via-cream/68 to-cream/90" />

        <div className="relative flex flex-col items-center">
          {media.ganesha ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.ganesha} alt="" className="h-12 w-auto opacity-90" aria-hidden />
          ) : null}
          <p className="mt-2 font-script text-xl text-red">शुभ विवाह</p>

          <div className="my-7 flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-[0.3em] text-ink/80">
              Together with our families
            </span>
            <h1 className="mt-3 font-display text-5xl text-red-deep sm:text-6xl">
              {couple.bride.first} <span className="font-script text-saffron-deep">&amp;</span>{" "}
              {couple.groom.first}
            </h1>
            <span className="mt-3 text-sm tracking-[0.2em] text-ink/80">{wedding.dates}</span>
            <span className="mt-1 text-xs uppercase tracking-[0.22em] text-ink-soft">
              {wedding.venue}
            </span>
          </div>

          <button
            onClick={open}
            className="gate-cta pointer-events-auto group flex flex-col items-center gap-3"
          >
            <span className="relative grid h-16 w-16 place-items-center rounded-full border border-gold bg-cream/85 backdrop-blur transition-transform duration-500 group-hover:scale-110">
              <HexagonMonogram className="h-8 w-8 text-gold transition-transform duration-700 group-hover:rotate-180" />
            </span>
            <span className="font-display text-xl text-red">Open the invitation</span>
          </button>
        </div>
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
