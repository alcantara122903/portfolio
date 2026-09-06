"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function GsapPageEffects() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    registerGsap();

    const ctx = gsap.context(() => {
      // Top signal progress bar
      if (progressBarRef.current) {
        gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
          },
        });
      }

      // Section chapters — soft rise + clip
      gsap.utils.toArray<HTMLElement>("[data-gsap='section']").forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0.35, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 92%",
              end: "top 45%",
              scrub: 0.8,
            },
          },
        );
      });

      // Headings
      gsap.utils.toArray<HTMLElement>("[data-gsap='heading']").forEach((el) => {
        const eyebrow = el.querySelector("[data-gsap='eyebrow']");
        const title = el.querySelector("[data-gsap='title']");
        const subtitle = el.querySelector("[data-gsap='subtitle']");
        const rule = el.querySelector("[data-gsap='rule']");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        });

        if (eyebrow) {
          tl.fromTo(
            eyebrow,
            { autoAlpha: 0, y: 12, letterSpacing: "0.4em" },
            {
              autoAlpha: 1,
              y: 0,
              letterSpacing: "0.28em",
              duration: 0.55,
              ease: "power2.out",
            },
            0,
          );
        }
        if (title) {
          tl.fromTo(
            title,
            { autoAlpha: 0, y: 40, filter: "blur(6px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power3.out",
            },
            0.05,
          );
        }
        if (rule) {
          tl.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.7, ease: "power2.out" },
            0.2,
          );
        }
        if (subtitle) {
          tl.fromTo(
            subtitle,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" },
            0.22,
          );
        }
      });

      // Generic reveals
      gsap.utils.toArray<HTMLElement>("[data-gsap='reveal']").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Project articles — staggered clean entrance
      gsap.utils.toArray<HTMLElement>("[data-gsap='project']").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 48, filter: "blur(4px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            delay: (i % 3) * 0.04,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Parallax layers
      gsap.utils.toArray<HTMLElement>("[data-gsap='parallax']").forEach((el) => {
        const speed = Number(el.dataset.speed ?? 0.12);
        gsap.to(el, {
          yPercent: speed * -70,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Section ambient glow intensity
      gsap.utils.toArray<HTMLElement>("main > section").forEach((section) => {
        gsap.fromTo(
          section,
          { "--section-glow": 0 },
          {
            "--section-glow": 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "top 25%",
              scrub: true,
            },
          },
        );
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
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
      aria-hidden="true"
    >
      <div
        ref={progressBarRef}
        className="h-full origin-left bg-linear-to-r from-sky-500 via-cyan-300 to-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.55)]"
      />
    </div>
  );
}
