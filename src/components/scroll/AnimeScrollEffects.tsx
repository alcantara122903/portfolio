"use client";

import { useEffect } from "react";
import { animate, createScope, onScroll, stagger } from "animejs";
import { ANIME_DURATION, ANIME_EASE } from "@/lib/anime";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AnimeScrollEffects() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const main = document.querySelector("main");
    if (!main) return;

    const scope = createScope({ root: main }).add(() => {
      main.querySelectorAll('[data-anime="section-heading"]').forEach((heading) => {
        const eyebrow = heading.querySelector('[data-anime="eyebrow"]');
        const title = heading.querySelector('[data-anime="title"]');
        const subtitle = heading.querySelector('[data-anime="subtitle"]');

        if (eyebrow) {
          animate(eyebrow, {
            opacity: [0, 1],
            translateX: [-18, 0],
            duration: ANIME_DURATION.fast,
            ease: ANIME_EASE.outSoft,
            autoplay: onScroll({
              target: heading,
              enter: "bottom top+=12%",
            }),
          });
        }

        if (title) {
          animate(title, {
            opacity: [0, 1],
            translateY: [32, 0],
            duration: ANIME_DURATION.medium,
            ease: ANIME_EASE.out,
            autoplay: onScroll({
              target: heading,
              enter: "bottom top+=10%",
            }),
          });
        }

        if (subtitle) {
          animate(subtitle, {
            opacity: [0, 1],
            translateY: [22, 0],
            duration: ANIME_DURATION.medium,
            delay: 100,
            ease: ANIME_EASE.outSoft,
            autoplay: onScroll({
              target: heading,
              enter: "bottom top+=10%",
            }),
          });
        }
      });

      animate('[data-anime="card"]', {
        opacity: [0, 1],
        translateY: [36, 0],
        rotateX: [12, 0],
        duration: ANIME_DURATION.medium,
        ease: ANIME_EASE.outSoft,
        delay: stagger(90),
        autoplay: onScroll({
          target: '[data-anime="card"]',
          enter: "bottom top+=14%",
        }),
      });

      animate('[data-anime="timeline-item"]', {
        opacity: [0, 1],
        translateX: [-28, 0],
        duration: ANIME_DURATION.medium,
        ease: ANIME_EASE.outSoft,
        delay: stagger(110),
        autoplay: onScroll({
          target: '[data-anime="timeline-item"]',
          enter: "bottom top+=15%",
        }),
      });

      animate('[data-anime="timeline-dot"]', {
        scale: [0.4, 1],
        opacity: [0, 1],
        duration: ANIME_DURATION.fast,
        ease: ANIME_EASE.out,
        delay: stagger(110),
        autoplay: onScroll({
          target: '[data-anime="timeline-item"]',
          enter: "bottom top+=15%",
        }),
      });

      const processSection = document.querySelector("#process");
      const processBeam = document.querySelector('[data-anime="process-beam"]');
      if (processSection && processBeam) {
        animate(processBeam, {
          translateX: ["0%", "720%"],
          ease: "linear",
          autoplay: onScroll({
            target: processSection,
            sync: true,
          }),
        });
      }

      const scrollAccent = document.querySelector('[data-anime="scroll-accent"]');
      if (scrollAccent) {
        animate(scrollAccent, {
          scaleY: [0, 1],
          opacity: [0, 0.55],
          ease: ANIME_EASE.outSoft,
          duration: ANIME_DURATION.slow,
          autoplay: onScroll({
            target: document.documentElement,
            sync: true,
          }),
        });
      }

      animate('[data-anime="parallax-gem"]', {
        translateY: ["0vh", "-18vh"],
        rotate: ["0deg", "180deg"],
        ease: "linear",
        autoplay: onScroll({
          target: '[data-anime="parallax-gem"]',
          sync: true,
        }),
      });
    });

    return () => scope.revert();
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <div
        data-anime="scroll-accent"
        className="pointer-events-none fixed left-3 top-0 z-20 hidden h-full w-px origin-top bg-linear-to-b from-sky-400/70 via-sky-500/25 to-transparent md:left-5 lg:block"
        aria-hidden="true"
      />
      <div
        data-anime="parallax-gem"
        className="pointer-events-none fixed right-[8%] top-[18%] z-0 hidden h-3 w-3 rotate-45 border border-sky-400/30 bg-sky-400/10 lg:block"
        aria-hidden="true"
      />
      <div
        data-anime="parallax-gem"
        className="pointer-events-none fixed left-[6%] top-[42%] z-0 hidden h-2 w-2 rotate-45 border border-indigo-400/25 bg-indigo-400/10 lg:block"
        aria-hidden="true"
      />
      <div
        data-anime="parallax-gem"
        className="pointer-events-none fixed right-[14%] top-[62%] z-0 hidden h-2.5 w-2.5 rotate-45 border border-emerald-400/25 bg-emerald-400/10 lg:block"
        aria-hidden="true"
      />
    </>
  );
}
