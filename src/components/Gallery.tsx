import Image from "next/image";
import Reveal from "./Reveal";
import { MotifDivider } from "./motifs";
import { couple, moments } from "@/lib/content";

/*
  A warm, simple portrait moment. The couple photo (background removed, isolated on
  the brand ground) sits in a soft arched frame with a heartfelt line beneath.
*/
export default function Gallery() {
  return (
    <section id="gallery" className="section-pad relative px-6">
      <div className="mx-auto grid max-w-4xl items-center gap-10 sm:grid-cols-2 sm:gap-14">
        <Reveal className="order-2 sm:order-1 text-center sm:text-left">
          <h2 className="font-display text-4xl text-red sm:text-5xl">{moments.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/85">{moments.caption}</p>
          <MotifDivider className="mt-8 sm:justify-start" />
          <p className="mt-5 font-script text-2xl text-saffron-deep">
            {couple.bride.first} &amp; {couple.groom.first}
          </p>
        </Reveal>

        <Reveal delay={120} className="order-1 sm:order-2">
          <div className="float-soft relative mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="overflow-hidden rounded-t-[160px] rounded-b-[28px] border border-gold/45 p-2 shadow-card">
              <div
                className="overflow-hidden rounded-t-[152px] rounded-b-[22px]"
                style={{
                  background:
                    "radial-gradient(120% 80% at 50% 12%, #fff9ee 0%, var(--color-cream) 55%, var(--color-cream-deep) 100%)",
                }}
              >
                <Image
                  src="/couple.webp"
                  alt={`${couple.bride.first} and ${couple.groom.first}`}
                  width={1100}
                  height={1231}
                  priority
                  className="mx-auto h-auto w-full select-none object-contain"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
