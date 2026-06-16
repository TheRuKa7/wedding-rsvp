"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { couple, wedding, saveTheDate, hosts } from "@/lib/content";
import { onGateOpen } from "@/lib/gate";
import { media } from "@/lib/media";
import AmbientVideo from "./AmbientVideo";
import { OmMark, MotifDivider } from "./motifs";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: gsap.Context | undefined;
    // Reveal only once the invitation opens. immediateRender:false keeps everything
    // visible until the tween actually runs, so text can never get stuck hidden.
    const stop = onGateOpen(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          "[data-fade]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, immediateRender: false, clearProps: "opacity,transform" },
        ).fromTo(
          "[data-name]",
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.18,
            immediateRender: false,
            clearProps: "opacity,transform",
          },
          "-=0.5",
        );
      }, root);
    });
    return () => {
      stop();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28 text-center sm:pt-32"
    >
      {media.heroVideo && (
        <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden" aria-hidden>
          <AmbientVideo
            src={media.heroVideo}
            srcDesktop={media.heroVideoDesktop}
            poster="/video/hero-poster.webp"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-cream/82" />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: media.heroVideo
            ? "radial-gradient(120% 90% at 50% 0%, rgba(255,249,238,0.55) 0%, rgba(251,244,230,0.3) 45%, rgba(243,231,207,0.15) 100%)"
            : "radial-gradient(120% 90% at 50% 0%, #fff9ee 0%, var(--color-cream) 45%, var(--color-cream-deep) 100%)",
        }}
        aria-hidden
      />

      <div className="flex flex-col items-center gap-2" data-fade>
        {media.ganesha ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.ganesha} alt="" className="h-14 w-auto opacity-90" aria-hidden />
        ) : (
          <OmMark className="text-3xl text-saffron-deep sm:text-4xl" />
        )}
        <p className="font-script text-2xl text-red sm:text-3xl">{saveTheDate.invocation}</p>
      </div>

      <p data-fade className="mt-8 font-display text-2xl text-ink sm:text-3xl">
        {hosts.parents}
      </p>
      <p
        data-fade
        className="mt-2 max-w-md text-[12px] uppercase tracking-[0.22em] text-ink-soft sm:text-[13px]"
      >
        {hosts.inviteLine}
      </p>

      <h1 className="mt-5 flex flex-col items-center leading-[0.92]">
        <span
          data-name
          className="hero-name font-display text-6xl font-semibold text-red-deep sm:text-8xl md:text-9xl"
        >
          {couple.bride.first}
        </span>
        <span data-fade className="font-script my-1 text-3xl text-saffron-deep sm:text-4xl">
          &amp;
        </span>
        <span
          data-name
          className="hero-name font-display text-6xl font-semibold text-red-deep sm:text-8xl md:text-9xl"
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
      <p data-fade className="mt-4 font-display text-xl text-red sm:text-2xl">
        {wedding.venue}
      </p>
      <p data-fade className="mt-1 text-xs uppercase tracking-[0.25em] text-ink-soft sm:text-sm">
        {wedding.venueCity}
      </p>
      <p data-fade className="mt-5 max-w-md text-base leading-relaxed text-ink/80">
        The full itinerary will follow soon.
      </p>

      <a
        data-fade
        href="#rsvp"
        className="mt-9 rounded-full bg-red px-9 py-3.5 font-display text-lg tracking-wide text-cream shadow-card transition-transform hover:scale-[1.04]"
      >
        RSVP
      </a>
    </section>
  );
}
