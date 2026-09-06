"use client";

import { useEffect } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function GsapPageEffects() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reducedMotion || isMobile) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-gsap='reveal']").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-gsap='heading']").forEach((el) => {
        const eyebrow = el.querySelector("[data-gsap='eyebrow']");
        const title = el.querySelector("[data-gsap='title']");
        const subtitle = el.querySelector("[data-gsap='subtitle']");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        if (eyebrow) {
          tl.fromTo(
            eyebrow,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
            0,
          );
        }
        if (title) {
          tl.fromTo(
            title,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" },
            0.06,
          );
        }
        if (subtitle) {
          tl.fromTo(
            subtitle,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
            0.16,
          );
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-gsap='parallax']").forEach((el) => {
        const speed = Number(el.dataset.speed ?? 0.12);
        gsap.to(el, {
          yPercent: speed * -80,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("main > section").forEach((section) => {
        gsap.fromTo(
          section,
          { "--section-glow": 0 },
          {
            "--section-glow": 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "top 25%",
              scrub: true,
            },
          },
        );
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reducedMotion, isMobile]);

  return null;
}
