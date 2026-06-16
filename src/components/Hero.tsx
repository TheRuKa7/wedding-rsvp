"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { couple, wedding, saveTheDate } from "@/lib/content";
import { onGateOpen } from "@/lib/gate";
import { media } from "@/lib/media";
import AmbientVideo from "./AmbientVideo";
import { OmMark, MotifDivider } from "./motifs";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: gsap.Context;
    let cleanup = () => {};
    let cancelled = false;

    // wait for the invitation to be opened, so the name reveal isn't wasted behind the gate
    const stop = onGateOpen(() => {
      (async () => {
        const { SplitText } = await import("gsap/SplitText");
        if (cancelled) return;
        gsap.registerPlugin(SplitText);
        ctx = gsap.context(() => {
          const names = root.current?.querySelectorAll<HTMLElement>("[data-split]") ?? [];
          const splits = Array.from(names).map((el) => new SplitText(el, { type: "chars" }));
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.from("[data-fade]", { opacity: 0, y: 18, duration: 0.9, stagger: 0.12 })
            .from(
              splits.flatMap((s) => s.chars),
              { opacity: 0, yPercent: 120, rotateX: -40, duration: 1, stagger: 0.035 },
              "-=0.4",
            );
          cleanup = () => splits.forEach((s) => s.revert());
        }, root);
      })();
    });

    return () => {
      cancelled = true;
      stop();
      cleanup();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* optional ambient video, behind a cream veil so the names stay crisp */}
      {media.heroVideo && (
        <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden" aria-hidden>
          <AmbientVideo src={media.heroVideo} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-cream/70" />
        </div>
      )}

      {/* soft radial ground so petals read against the cream */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: media.heroVideo
            ? "radial-gradient(120% 90% at 50% 0%, rgba(255,249,238,0.6) 0%, rgba(251,244,230,0.35) 45%, rgba(243,231,207,0.2) 100%)"
            : "radial-gradient(120% 90% at 50% 0%, #fff9ee 0%, var(--color-cream) 45%, var(--color-cream-deep) 100%)",
        }}
        aria-hidden
      />

      <div className="flex flex-col items-center gap-2" data-fade>
        {media.ganesha ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.ganesha} alt="" className="h-14 w-auto opacity-90" aria-hidden />
        ) : (
          <OmMark className="text-3xl text-saffron sm:text-4xl" />
        )}
        <p className="font-script text-2xl text-red sm:text-3xl">{saveTheDate.invocation}</p>
      </div>

      <p
        data-fade
        className="mt-8 max-w-md text-[13px] uppercase tracking-[0.25em] text-ink-soft sm:text-sm"
      >
        {saveTheDate.intro}
      </p>

      <h1 className="mt-5 flex flex-col items-center leading-[0.92]">
        <span
          data-split
          className="gold-foil font-display text-6xl font-medium sm:text-8xl md:text-9xl"
          style={{ perspective: 600 }}
        >
          {couple.bride.first}
        </span>
        <span data-fade className="font-script my-1 text-3xl text-red sm:text-4xl">
          &amp;
        </span>
        <span
          data-split
          className="gold-foil font-display text-6xl font-medium sm:text-8xl md:text-9xl"
          style={{ perspective: 600 }}
        >
          {couple.groom.first}
        </span>
      </h1>

      <div data-fade className="mt-8">
        <MotifDivider />
      </div>

      <p data-fade className="mt-8 font-display text-3xl text-ink sm:text-4xl">
        {wedding.dates}
      </p>
      <p data-fade className="mt-3 max-w-sm text-base leading-relaxed text-ink/75">
        {wedding.detailsTeaser}
      </p>

      <a
        data-fade
        href="#rsvp"
        className="mt-9 rounded-full bg-red px-9 py-3.5 font-display text-lg tracking-wide text-cream shadow-card transition-transform hover:scale-[1.04]"
      >
        RSVP
      </a>

      <a
        data-fade
        href="#story"
        className="absolute bottom-8 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink-soft transition-colors hover:text-red"
      >
        Scroll
        <span className="h-10 w-px animate-pulse bg-gold" />
      </a>
    </section>
  );
}
