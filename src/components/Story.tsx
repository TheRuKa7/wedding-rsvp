import { story } from "@/lib/content";
import Reveal from "./Reveal";
import { ChinarLeaf, PhulkariFlower, MotifDivider } from "./motifs";

export default function Story() {
  return (
    <section id="story" className="section-pad relative mx-auto max-w-3xl px-6 text-center">
      <Reveal>
        <div className="mb-6 flex items-center justify-center gap-4 text-gold">
          <ChinarLeaf className="h-8 w-8" />
          <PhulkariFlower className="h-7 w-7" />
        </div>
      </Reveal>

      <Reveal delay={80}>
        <p className="font-script text-xl text-saffron-deep">{story.hindi}</p>
        <h2 className="mt-2 font-display text-4xl text-red sm:text-5xl">{story.title}</h2>
      </Reveal>

      <div className="mt-10 space-y-7">
        {story.paragraphs.map((p, i) => (
          <Reveal key={i} delay={i * 120} as="div">
            <p className="text-lg leading-relaxed text-ink/85 sm:text-xl">{p}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <MotifDivider className="mt-12" />
      </Reveal>
    </section>
  );
}
