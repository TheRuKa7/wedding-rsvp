"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** stagger delay in ms */
  delay?: number;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Reveals children on scroll into view via IntersectionObserver.
 * Animates transform/opacity only. The CSS `.reveal-init` start state means
 * Reduce Motion users get the final state immediately (no observer needed).
 */
export default function Reveal({ children, className = "", delay = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-init transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? "!opacity-100 !translate-y-0" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
