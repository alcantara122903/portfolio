"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { onPortfolioReady } from "@/lib/portfolioReady";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Smooth hero intro — no clip masks (prevents letter cutoff). */
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
        const lines = rootRef.current!.querySelectorAll<HTMLElement>(
          "[data-hero-line]",
        );
        const eyebrow = rootRef.current!.querySelector("[data-hero='eyebrow']");
        const rule = rootRef.current!.querySelector("[data-hero='rule']");
        const role = rootRef.current!.querySelector("[data-hero='role']");
        const tagline = rootRef.current!.querySelector("[data-hero='tagline']");
        const signal = rootRef.current!.querySelector("[data-hero='signal']");
        const actions = rootRef.current!.querySelector("[data-hero='actions']");
        const bio = rootRef.current!.querySelector("[data-hero='bio']");
        const stage = document.querySelector("[data-hero='stage']");

        gsap.set(
          [eyebrow, role, tagline, signal, actions, bio, stage].filter(Boolean),
          { autoAlpha: 0 },
        );
        gsap.set(lines, { autoAlpha: 0, y: 28 });
        if (role) gsap.set(role, { y: 12 });
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out", force3D: true },
        });

        if (eyebrow) {
          tl.to(eyebrow, { autoAlpha: 1, duration: 0.45 }, 0);
        }

        if (lines.length) {
          tl.to(
            lines,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "power4.out",
            },
            0.08,
          );
        }

        if (rule) {
          tl.to(rule, { scaleX: 1, duration: 0.55 }, 0.55);
        }
        if (role) {
          tl.to(role, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.65);
        }
        if (tagline) {
          tl.fromTo(
            tagline,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            0.78,
          );
        }
        if (signal) {
          tl.fromTo(
            signal,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.45 },
            0.9,
          );
        }
        if (actions) {
          tl.fromTo(
            actions,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.45 },
            1.0,
          );
        }
        if (bio) {
          tl.to(bio, { autoAlpha: 1, duration: 0.4 }, 1.1);
        }
        if (stage) {
          tl.fromTo(
            stage,
            { autoAlpha: 0, x: 20 },
            { autoAlpha: 1, x: 0, duration: 0.95 },
            0.2,
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
