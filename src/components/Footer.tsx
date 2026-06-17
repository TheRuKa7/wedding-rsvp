import { couple, wedding } from "@/lib/content";
import { media } from "@/lib/media";
import AmbientVideo from "./AmbientVideo";
import { OmMark } from "./motifs";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-red-deep px-6 py-10 text-center text-cream">
      {media.footerVideo && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <AmbientVideo src={media.footerVideo} className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-red-deep/55" />
        </div>
      )}

      <div className="relative">
        <OmMark className="text-2xl text-gold-soft" />
        <p className="mt-3 font-display text-3xl">
          {couple.bride.first} with {couple.groom.first}
        </p>
        <p className="mt-2 text-sm tracking-[0.2em] text-cream/85">{wedding.dates}</p>
        <p className="mt-2 font-display text-lg text-gold-soft">{wedding.venue}</p>
        <p className="mt-5 text-xs uppercase tracking-[0.3em] text-gold-soft">{wedding.hashtag}</p>
      </div>
    </footer>
  );
}
