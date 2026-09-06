"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { onPortfolioReady } from "@/lib/portfolioReady";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HERO_KEYS = [
  "eyebrow",
  "title",
  "role",
  "tagline",
  "bio",
  "actions",
  "meta",
] as const;

export function GsapHeroIntro({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;
    registerGsap();

    let ctx: gsap.Context | null = null;

    const start = () => {
      if (!rootRef.current) return;

      ctx = gsap.context(() => {
        const nodes = HERO_KEYS.map((key) =>
          rootRef.current!.querySelector(`[data-hero='${key}']`),
        ).filter(Boolean) as HTMLElement[];

        gsap.set(nodes, { autoAlpha: 0 });

        const eyebrow = rootRef.current!.querySelector("[data-hero='eyebrow']");
        const title = rootRef.current!.querySelector("[data-hero='title']");
        const role = rootRef.current!.querySelector("[data-hero='role']");
        const tagline = rootRef.current!.querySelector("[data-hero='tagline']");
        const bio = rootRef.current!.querySelector("[data-hero='bio']");
        const actions = rootRef.current!.querySelector("[data-hero='actions']");
        const meta = rootRef.current!.querySelector("[data-hero='meta']");

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (eyebrow) {
          tl.fromTo(
            eyebrow,
            { autoAlpha: 0, y: 16, letterSpacing: "0.45em" },
            { autoAlpha: 1, y: 0, letterSpacing: "0.25em", duration: 0.7 },
            0.05,
          );
        }
        if (title) {
          tl.fromTo(
            title,
            { autoAlpha: 0, y: 64, filter: "blur(12px)", scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              scale: 1,
              duration: 1.05,
            },
            0.12,
          );
        }
        if (role) {
          tl.fromTo(
            role,
            { autoAlpha: 0, x: -28 },
            { autoAlpha: 1, x: 0, duration: 0.65 },
            0.35,
          );
        }
        if (tagline) {
          tl.fromTo(
            tagline,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            0.45,
          );
        }
        if (bio) {
          tl.fromTo(
            bio,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.65 },
            0.58,
          );
        }
        if (actions) {
          tl.fromTo(
            actions,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.6 },
            0.72,
          );
        }
        if (meta) {
          tl.fromTo(
            meta,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            0.88,
          );
        }
      }, rootRef);
    };

    const stopReady = onPortfolioReady(start);

    return () => {
      stopReady();
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
