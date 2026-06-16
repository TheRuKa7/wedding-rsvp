import { comingSoon } from "@/lib/content";
import Reveal from "./Reveal";
import { MotifDivider, ChinarLeaf, PhulkariFlower } from "./motifs";

export default function ComingSoon() {
  return (
    <section id="details" className="relative px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-[32px] border border-gold/40 bg-cream-deep/30 px-8 py-14 text-center sm:px-14">
          {/* faint corner motifs */}
          <ChinarLeaf className="pointer-events-none absolute -left-3 -top-3 h-16 w-16 text-gold/20" />
          <PhulkariFlower className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 text-gold/20" />

          <p className="font-script text-2xl text-saffron">{comingSoon.hindi}</p>
          <h2 className="mt-3 font-display text-4xl text-red sm:text-5xl">{comingSoon.title}</h2>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink/85">
            {comingSoon.body}
          </p>
          <MotifDivider className="mt-8" />
          <span className="mt-6 inline-block rounded-full border border-gold/60 px-5 py-2 text-xs uppercase tracking-[0.28em] text-gold">
            {comingSoon.badge}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
