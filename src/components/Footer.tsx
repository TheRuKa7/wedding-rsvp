import { couple, wedding } from "@/lib/content";
import { media } from "@/lib/media";
import AmbientVideo from "./AmbientVideo";
import { MotifDivider, OmMark } from "./motifs";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-red-deep px-6 py-16 text-center text-cream">
      {media.footerVideo && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <AmbientVideo src={media.footerVideo} className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-red-deep/55" />
        </div>
      )}

      <div className="relative">
        <OmMark className="text-3xl text-gold-soft" />
        <p className="mt-3 font-script text-2xl text-gold-soft">शुभ विवाह</p>
        <p className="mt-4 font-display text-4xl">
          {couple.bride.first} &amp; {couple.groom.first}
        </p>
        <p className="mt-2 text-sm tracking-[0.2em] text-cream/80">{wedding.dates}</p>

        <MotifDivider className="mt-8 text-gold-soft" />

        <p className="mx-auto mt-8 max-w-md text-sm text-cream/75">
          Travel and stay details will follow with the formal invitation. For anything at all,
          please reach out to our families directly.
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold-soft">{wedding.hashtag}</p>
      </div>
    </footer>
  );
}
