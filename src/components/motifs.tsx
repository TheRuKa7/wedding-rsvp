/*
  Hand-drawn SVG motifs that braid the two traditions.
  - HexagonMonogram: the Dejhoor six-point star (Shiva–Shakti union) = the couple's mark.
  - ChinarLeaf: the signature Kashmiri emblem.
  - PhulkariFlower: the radiant geometric Punjabi flower.
  - MotifDivider: chinar ⟷ phulkari pairing — the heart of the blend.
  Richer art (Ganesha line-art, papier-mâché borders) can be dropped into /public later
  as Higgsfield-generated assets; these vector motifs carry the design until then.
*/

type SvgProps = React.SVGProps<SVGSVGElement>;

export function HexagonMonogram({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden {...props}>
      {/* two overlapping triangles — Shiva (down) + Shakti (up) */}
      <path
        d="M60 14 L99 82 L21 82 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.9"
      />
      <path
        d="M60 106 L21 38 L99 38 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.9"
      />
      <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="0.8" opacity="0.55" />
      <circle cx="60" cy="60" r="22" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

export function ChinarLeaf({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 100 110" fill="none" className={className} aria-hidden {...props}>
      <path
        d="M50 104 L50 58 M50 58 C50 40 38 30 24 22 M50 58 C50 40 62 30 76 22 M50 64 C42 56 28 54 14 56 M50 64 C58 56 72 54 86 56 M50 50 C46 42 36 38 30 40 M50 50 C54 42 64 38 70 40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M50 8 C66 22 84 30 88 50 C90 64 78 74 64 70 C58 80 50 86 50 86 C50 86 42 80 36 70 C22 74 10 64 12 50 C16 30 34 22 50 8 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.95"
      />
    </svg>
  );
}

export function PhulkariFlower({ className, ...props }: SvgProps) {
  const petals = Array.from({ length: 8 });
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...props}>
      <g transform="translate(50 50)">
        {petals.map((_, i) => (
          <path
            key={i}
            d="M0 0 L7 -22 L0 -40 L-7 -22 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r="7" stroke="currentColor" strokeWidth="1.5" />
        <circle r="44" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      </g>
    </svg>
  );
}

/** chinar ⟷ phulkari divider: leaf · flower · monogram · flower · leaf */
export function MotifDivider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-gold ${className ?? ""}`}
      aria-hidden
    >
      <span className="h-px w-10 bg-current opacity-40 sm:w-20" />
      <ChinarLeaf className="h-5 w-5 opacity-80" />
      <PhulkariFlower className="h-4 w-4 opacity-70" />
      <HexagonMonogram className="h-6 w-6" />
      <PhulkariFlower className="h-4 w-4 opacity-70" />
      <ChinarLeaf className="h-5 w-5 opacity-80" />
      <span className="h-px w-10 bg-current opacity-40 sm:w-20" />
    </div>
  );
}

/** A single drifting marigold petal (used by the ambient petal layer). */
export function Petal({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 24 28" className={className} aria-hidden {...props}>
      <path
        d="M12 0 C19 7 22 16 12 28 C2 16 5 7 12 0 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M12 4 L12 24" stroke="#fff" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

/** Layered marigold (genda) flower — two petal rings + a seeded centre. */
export function Marigold({ className, ...props }: SvgProps) {
  const outer = Array.from({ length: 12 });
  const inner = Array.from({ length: 10 });
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden {...props}>
      <g transform="translate(50 50)" stroke="currentColor" strokeWidth="1.2">
        {outer.map((_, i) => (
          <ellipse key={`o${i}`} cx="0" cy="-34" rx="7" ry="13" transform={`rotate(${i * 30})`} />
        ))}
        {inner.map((_, i) => (
          <ellipse
            key={`i${i}`}
            cx="0"
            cy="-22"
            rx="5"
            ry="10"
            transform={`rotate(${i * 36 + 18})`}
            opacity="0.85"
          />
        ))}
        <circle r="9" />
        <circle r="3.5" opacity="0.7" />
      </g>
    </svg>
  );
}

/** Ornate corner flourish: a curved vine with a marigold, a chinar leaf and buds. */
export function CornerFlourish({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden {...props}>
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        {/* sweeping vine from the corner */}
        <path d="M4 4 C40 6 70 18 96 44 M4 4 C8 40 22 72 50 98" opacity="0.9" />
        {/* small buds along the vine */}
        <path d="M30 9 c6 -5 12 -3 12 4 c0 6 -7 8 -12 4 Z" opacity="0.8" />
        <path d="M9 30 c-5 6 -3 12 4 12 c6 0 8 -7 4 -12 Z" opacity="0.8" />
        {/* leaf */}
        <path d="M60 20 c14 0 22 8 24 22 c-14 0 -24 -8 -24 -22 Z" opacity="0.85" />
        <path d="M60 20 c2 10 8 16 18 20" opacity="0.6" />
        {/* marigold tip */}
        <g transform="translate(96 44)">
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={i} cx="0" cy="-9" rx="2.6" ry="5.5" transform={`rotate(${i * 45})`} />
          ))}
          <circle r="3" />
        </g>
      </g>
    </svg>
  );
}

/** Auspicious Om mark for the invocation. */
export function OmMark({ className, ...props }: SvgProps) {
  return (
    <span
      className={`font-script leading-none ${className ?? ""}`}
      aria-label="Om"
      {...(props as React.HTMLAttributes<HTMLSpanElement>)}
    >
      ॐ
    </span>
  );
}
