"use client";

import { useEffect, useState } from "react";

/**
 * Decorative looping background video. Renders nothing under Reduce Motion or if
 * the file fails to load, so the caller's static fallback always shows through.
 */
export default function AmbientVideo({
  src,
  className = "",
  poster,
}: {
  src: string;
  className?: string;
  poster?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShow(true);
  }, []);

  if (!src || !show) return null;

  return (
    <video
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
      <source src={src} type="video/mp4" />
    </video>
  );
}
