"use client";

import { useEffect, useState } from "react";
import { Petal, Marigold, ChinarLeaf } from "./motifs";

type Drift = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  hue: string;
  kind: "petal" | "marigold" | "leaf";
  sway: number;
};

/**
 * Ambient drifting flowers, petals and leaves. Decorative; mounts nothing under
 * Reduce Motion. Count scales down on small screens to stay light.
 */
export default function Petals() {
  const [items, setItems] = useState<Drift[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const count = window.innerWidth < 640 ? 6 : 11;
    const hues = ["text-marigold", "text-saffron", "text-gold-soft", "text-pine"];
    const kinds: Drift["kind"][] = ["petal", "petal", "marigold", "leaf"];
    setItems(
      Array.from({ length: count }, (_, i) => ({
        left: (i / count) * 100 + (i % 3) * 3,
        delay: -(i * 1.6),
        duration: 15 + (i % 5) * 3,
        size: 12 + (i % 4) * 6,
        hue: kinds[i % kinds.length] === "leaf" ? "text-pine" : hues[i % hues.length],
        kind: kinds[i % kinds.length],
        sway: 24 + (i % 4) * 14,
      })),
    );
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden>
      {items.map((p, i) => {
        const Shape = p.kind === "marigold" ? Marigold : p.kind === "leaf" ? ChinarLeaf : Petal;
        return (
          <span
            key={i}
            className={`petal-fall absolute -top-12 ${p.hue}`}
            style={
              {
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                "--sway": `${p.sway}px`,
              } as React.CSSProperties
            }
          >
            <Shape style={{ width: p.size, height: p.size * (p.kind === "petal" ? 1.16 : 1) }} />
          </span>
        );
      })}
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
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(110vh) translateX(var(--sway)) rotate(460deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
