import { couple, wedding } from "@/lib/content";
import { MotifDivider, OmMark } from "./motifs";

export default function Footer() {
  return (
    <footer className="relative bg-red-deep px-6 py-16 text-center text-cream">
      <OmMark className="text-3xl text-gold-soft" />
      <p className="mt-3 font-script text-2xl text-gold-soft">शुभ विवाह</p>
      <p className="mt-4 font-display text-4xl">
        {couple.bride.first} &amp; {couple.groom.first}
      </p>
      <p className="mt-2 text-sm tracking-[0.2em] text-cream/80">{wedding.dates}</p>

      <MotifDivider className="mt-8 text-gold-soft" />

      <p className="mt-8 max-w-md mx-auto text-sm text-cream/70">
        Travel & stay details will follow with the formal invitation. For any questions, please
        reach the families directly.
      </p>
      <p className="mt-6 text-xs uppercase tracking-[0.3em] text-cream/50">{wedding.hashtag}</p>
    </footer>
  );
}
