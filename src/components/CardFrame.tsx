import { ChinarLeaf, PhulkariFlower } from "./motifs";

/**
 * A fixed, decorative gold border with corner motifs that frames the whole
 * viewport, so the site reads like the inside of an ornate invitation card.
 * Purely decorative and non-interactive.
 */
export default function CardFrame() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden sm:block" aria-hidden>
      <div className="absolute inset-4 rounded-[26px] border border-gold/25" />
      <div className="absolute inset-[18px] rounded-[20px] border border-gold/15" />
      <ChinarLeaf className="absolute left-6 top-6 h-7 w-7 text-gold/40" />
      <PhulkariFlower className="absolute right-6 top-6 h-6 w-6 text-gold/40" />
      <PhulkariFlower className="absolute bottom-6 left-6 h-6 w-6 text-gold/40" />
      <ChinarLeaf className="absolute bottom-6 right-6 h-7 w-7 text-gold/40" />
    </div>
  );
}
