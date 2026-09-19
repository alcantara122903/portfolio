"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useStableMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Page chrome + section heading reveals.
 * Uses 3D line motion without SplitText masks (avoids letter clipping).
 */
export function GsapPageEffects() {
  const reducedMotion = useReducedMotion();
  const isMobile = useStableMediaQuery("(max-width: 768px)");
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    registerGsap();

    const ctx = gsap.context(() => {
      if (progressBarRef.current) {
        gsap.set(progressBarRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-gsap='heading']").forEach((block) => {
        const title = block.querySelector<HTMLElement>("[data-gsap='title']");
        const rule = block.querySelector<HTMLElement>("[data-gsap='rule']");
        const subtitle = block.querySelector<HTMLElement>("[data-gsap='subtitle']");
        const eyebrow = block.querySelector<HTMLElement>("[data-gsap='eyebrow']");

        if (rule) {
          gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
        }
        if (subtitle) gsap.set(subtitle, { autoAlpha: 0, y: 12 });
        if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0.35 });
        if (title) {
          gsap.set(title, {
            autoAlpha: 0,
            y: 28,
            rotateX: -18,
            transformOrigin: "50% 100%",
            transformPerspective: 800,
            force3D: true,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
          defaults: { force3D: true },
        });

        if (eyebrow) {
          tl.to(eyebrow, { autoAlpha: 1, duration: 0.35, ease: "power2.out" }, 0);
        }

        if (title) {
          tl.to(
            title,
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 0.85,
              ease: "power3.out",
            },
            0.05,
          );
        }

        if (rule) {
          tl.to(rule, { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0.3);
        }

        if (subtitle) {
          tl.to(
            subtitle,
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            0.4,
          );
        }
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [reducedMotion, isMobile]);

  if (reducedMotion || isMobile) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-px"
      aria-hidden="true"
    >
      <div
        ref={progressBarRef}
        className="h-full origin-left bg-[var(--accent)]"
      />
    </div>
  );
}
