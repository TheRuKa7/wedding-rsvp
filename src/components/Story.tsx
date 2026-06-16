import Image from "next/image";
import { story, couple } from "@/lib/content";
import Reveal from "./Reveal";
import { ChinarLeaf, PhulkariFlower, MotifDivider } from "./motifs";

export default function Story() {
  return (
    <section id="story" className="section-pad relative px-6">
      <div className="mx-auto grid max-w-5xl items-center gap-10 sm:grid-cols-2 sm:gap-16">
        <Reveal className="order-2 sm:order-1 text-center sm:text-left">
          <div className="mb-5 flex items-center justify-center gap-4 text-gold sm:justify-start">
            <ChinarLeaf className="h-8 w-8" />
            <PhulkariFlower className="h-7 w-7" />
          </div>
          <p className="font-script text-xl text-saffron-deep">{story.hindi}</p>
          <h2 className="mt-2 font-display text-4xl text-red sm:text-5xl">{story.title}</h2>
          <div className="mt-7 space-y-5">
            {story.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink/85">
                {p}
              </p>
            ))}
          </div>
          <MotifDivider className="mt-9 sm:justify-start" />
        </Reveal>

        <Reveal delay={120} className="order-1 sm:order-2">
          <div className="float-soft relative mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="overflow-hidden rounded-[26px] border border-gold/45 p-2 shadow-card">
              <Image
                src="/ghibli-2.webp"
                alt={`${couple.bride.first} and ${couple.groom.first}, illustrated`}
                width={896}
                height={1200}
                className="h-auto w-full rounded-[20px] object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
