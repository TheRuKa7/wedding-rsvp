"use client";

import { useEffect, useState } from "react";

/**
 * Decorative looping background video. Picks the desktop (16:9) or mobile (9:16)
 * source for the current viewport. Renders nothing under Reduce Motion or if the
 * file fails to load, so the caller's static fallback always shows through.
 */
export default function AmbientVideo({
  src,
  srcDesktop,
  className = "",
  poster,
}: {
  src: string;
  srcDesktop?: string;
  className?: string;
  poster?: string;
}) {
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    setChosen(isDesktop && srcDesktop ? srcDesktop : src);
  }, [src, srcDesktop]);

  if (!chosen) return null;

  return (
    <video
      key={chosen}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden
      onError={(e) => {
        (e.currentTarget as HTMLVideoElement).style.display = "none";
      }}
    >
      <source src={chosen} type="video/mp4" />
    </video>
  );
}
