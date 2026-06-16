"use client";

import { useEffect, useState } from "react";
import { Petal } from "./motifs";

/**
 * Ambient drifting marigold petals — purely decorative.
 * Mounts nothing under Reduce Motion. Kept light (count scales down on small screens).
 */
export default function Petals() {
  const [petals, setPetals] = useState<
    { left: number; delay: number; duration: number; size: number; hue: string }[]
  >([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const count = window.innerWidth < 640 ? 7 : 14;
    const hues = ["text-marigold", "text-saffron", "text-gold-soft"];
    setPetals(
      Array.from({ length: count }, (_, i) => ({
        left: (i / count) * 100 + (i % 3) * 4,
        delay: -(i * 1.7),
        duration: 14 + (i % 5) * 3,
        size: 12 + (i % 4) * 5,
        hue: hues[i % hues.length],
      })),
    );
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petal-fall absolute -top-10 ${p.hue}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <Petal style={{ width: p.size, height: p.size * 1.16 }} />
        </span>
      ))}
      <style jsx>{`
        .petal-fall {
          animation-name: petal-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @keyframes petal-fall {
          0% {
            transform: translateY(-5vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          90% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(108vh) translateX(40px) rotate(420deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
