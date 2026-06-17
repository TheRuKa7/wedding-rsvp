"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
    const stop = onGateOpen(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          "[data-fade]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, immediateRender: false, clearProps: "opacity,transform" },
        ).fromTo(
          "[data-name]",
          { opacity: 0, y: 36, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1.05, stagger: 0.16, immediateRender: false, clearProps: "opacity,transform" },
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
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
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
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(255,249,238,0.5) 0%, rgba(251,244,230,0.25) 45%, rgba(243,231,207,0.12) 100%)",
        }}
        aria-hidden
      />

      <div className="flex flex-col items-center gap-2" data-fade>
        {media.ganesha ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.ganesha} alt="" className="h-12 w-auto opacity-90" aria-hidden />
        ) : (
          <OmMark className="text-3xl text-saffron-deep" />
        )}
        <p className="font-script text-2xl text-red">{saveTheDate.invocation}</p>
      </div>

      <span
        data-fade
        className="mt-6 rounded-full border border-gold/60 px-5 py-1.5 text-[11px] uppercase tracking-[0.34em] text-saffron-deep"
      >
        {hosts.saveTheDate}
      </span>

      <p data-fade className="mt-7 font-script text-2xl text-saffron-deep">
        {hosts.intro}
      </p>
      <p data-fade className="mt-2 font-display text-2xl text-ink sm:text-3xl">
        {hosts.brideParents}
      </p>
      <p
        data-fade
        className="mt-2 text-[11px] uppercase leading-relaxed tracking-[0.24em] text-ink-soft sm:text-xs"
      >
        {hosts.requestLine}
      </p>

      <p data-fade className="mt-5 font-display text-3xl text-red sm:text-4xl">
        {wedding.dates}
      </p>

      <p
        data-fade
        className="mt-5 max-w-xs text-[11px] uppercase leading-relaxed tracking-[0.2em] text-ink-soft sm:max-w-sm sm:text-xs"
      >
        {hosts.forLine}
      </p>

      {/* couple's names with the portrait alongside */}
      <div className="mt-6 flex items-center justify-center gap-5 sm:gap-8">
        <div data-fade className="w-24 shrink-0 sm:w-28">
          <div className="overflow-hidden rounded-t-[80px] rounded-b-xl border border-gold/50 p-1 shadow-card">
            <Image
              src="/ghibli-1.webp"
              alt={`${couple.bride.first} with ${couple.groom.first}`}
              width={896}
              height={1200}
              priority
              sizes="(min-width: 640px) 112px, 96px"
              className="h-auto w-full rounded-t-[76px] rounded-b-lg object-cover"
            />
          </div>
        </div>

        <h1 className="flex flex-col items-start leading-[0.95]">
          <span data-name className="hero-name font-display text-5xl font-semibold text-red-deep sm:text-7xl">
            {couple.bride.first}
          </span>
          <span data-fade className="my-0.5 font-display text-base italic text-saffron-deep sm:text-lg">
            with
          </span>
          <span data-name className="hero-name font-display text-5xl font-semibold text-red-deep sm:text-7xl">
            {couple.groom.first}
          </span>
        </h1>
      </div>

      <p data-fade className="mt-4 text-sm text-ink-soft">
        {hosts.groomLine}
      </p>

      <div data-fade className="mt-7">
        <MotifDivider />
      </div>

      <p data-fade className="mt-6 font-display text-lg text-red sm:text-xl">
        {wedding.venue}
      </p>
      <p data-fade className="mt-1.5 text-xs uppercase tracking-[0.22em] text-ink-soft">
        {wedding.venueCity}
      </p>

      <p data-fade className="mt-7 text-sm italic text-ink-soft">
        {hosts.formalNote}.
      </p>
    </section>
  );
}
