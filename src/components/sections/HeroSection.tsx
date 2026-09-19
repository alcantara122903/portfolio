"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";
import { portfolio } from "@/data/portfolio";
import { useStableMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollProgressRef } from "@/hooks/useScrollProgressRef";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, registerGsap } from "@/lib/gsap";
import { onPortfolioReady } from "@/lib/portfolioReady";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { GsapHeroIntro } from "@/components/gsap/GsapHeroIntro";
import { Container } from "@/components/layout/Container";
import { SceneFallback } from "@/components/three/SceneFallback";
import { Button } from "@/components/ui/Button";
import { handleHashNavClick } from "@/lib/scrollToSection";

const HeroScene = dynamic(
  () =>
    import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <SceneFallback />,
  },
);

const SIGNAL = [
  { n: "01", label: "Mobile" },
  { n: "02", label: "API" },
  { n: "03", label: "Database" },
] as const;

function HeroSignalPath() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !fillRef.current) return;
    registerGsap();

    let ctx: gsap.Context | null = null;

    const start = () => {
      if (!rootRef.current || !fillRef.current) return;
      ctx = gsap.context(() => {
        const nodes = rootRef.current!.querySelectorAll("[data-signal-node]");
        gsap.set(fillRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(nodes, { autoAlpha: 0.35 });

        const tl = gsap.timeline({ delay: 0.35 });
        tl.to(fillRef.current, {
          scaleX: 1,
          duration: 1.4,
          ease: "power2.inOut",
        });
        nodes.forEach((node, i) => {
          tl.to(
            node,
            { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
            0.35 + i * 0.35,
          );
        });
      }, rootRef);
    };

    const stop = onPortfolioReady(start);
    return () => {
      stop();
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} data-hero="signal" className="mt-10 max-w-md">
      <div className="relative mb-4 h-px bg-white/10">
        <div
          ref={fillRef}
          className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-[var(--accent)]"
        />
      </div>
      <ol className="grid grid-cols-3 gap-3">
        {SIGNAL.map((step) => (
          <li key={step.n} data-signal-node className="min-w-0">
            <p className="font-mono text-[10px] tabular-nums text-zinc-600">
              {step.n}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-200">{step.label}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Subconscious depth — a few pixels only, fine pointer devices. */
function useHeroPointerDepth(
  sectionRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled || !sectionRef.current) return;
    registerGsap();

    const section = sectionRef.current;
    const title = section.querySelector("[data-hero='title']");
    const stage = section.querySelector("[data-hero='stage']");
    if (!title && !stage) return;

    const proxy = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = section.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      proxy.x = nx;
      proxy.y = ny;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (title) {
          gsap.to(title, {
            x: proxy.x * 4,
            y: proxy.y * 2,
            duration: 0.9,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
        if (stage) {
          gsap.to(stage, {
            x: proxy.x * -6,
            y: proxy.y * -3,
            duration: 1.1,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      if (title) {
        gsap.to(title, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
      }
      if (stage) {
        gsap.to(stage, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
      }
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, sectionRef]);
}

export function HeroSection() {
  const { personal } = portfolio;
  const isMobile = useStableMediaQuery("(max-width: 1023px)");
  const isTouch = useStableMediaQuery("(hover: none), (pointer: coarse)");
  const showScene = !isMobile;
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { progressRef } = useScrollProgressRef(sectionRef, [
    "start start",
    "end start",
  ]);

  useHeroPointerDepth(sectionRef, !reducedMotion && !isTouch && !isMobile);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-dvh overflow-hidden !py-0"
      data-story="hero"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_85%_40%,rgba(94,184,232,0.06),transparent_55%)]"
        aria-hidden="true"
      />

      <Container className="relative flex min-h-dvh flex-col justify-center pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8 lg:items-center">
          <GsapHeroIntro className="min-w-0 overflow-visible lg:col-span-7 xl:col-span-6">
            <div
              data-hero="eyebrow"
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500"
            >
              <span className="font-mono text-[11px] tabular-nums text-[var(--accent)]">
                01
              </span>
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
              <span>{personal.availability}</span>
            </div>

            <h1
              data-hero="title"
              className="font-display mt-6 text-[clamp(2.75rem,9.5vw,5.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--foreground)]"
            >
              <span
                data-hero-line
                className="block will-change-transform"
              >
                {personal.firstName}
              </span>
              <span
                data-hero-line
                className="mt-2 block text-zinc-400 will-change-transform"
              >
                {personal.lastName}
              </span>
            </h1>

            <div
              data-hero="rule"
              className="mt-7 h-px w-16 origin-left scale-x-0 bg-[var(--accent)]"
              aria-hidden="true"
            />

            <p
              data-hero="role"
              className="mt-6 overflow-hidden text-xl font-medium tracking-tight text-zinc-100 sm:text-2xl"
            >
              {personal.role}
            </p>

            <p
              data-hero="tagline"
              className="mt-4 max-w-sm text-[15px] leading-relaxed text-zinc-400 sm:text-base"
            >
              Capstone-built systems: React Native on device, Laravel APIs,
              PostgreSQL underneath for real campus workflows.
            </p>

            <HeroSignalPath />

            <div
              data-hero="actions"
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <MagneticButton>
                <Button href="#projects" className="min-h-11 px-6">
                  See NU-SECURE
                </Button>
              </MagneticButton>
              <MagneticButton strength={0.22}>
                <Button href="#contact" variant="outline" className="min-h-11">
                  Contact
                </Button>
              </MagneticButton>
              <a
                href={personal.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-1 text-sm text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-200 hover:underline"
              >
                Resume
              </a>
            </div>

            <p
              data-hero="bio"
              className="mt-8 max-w-md font-mono text-[11px] leading-relaxed tracking-wide text-zinc-500"
            >
              TypeScript / Next.js / React Native / Laravel / Supabase
            </p>
          </GsapHeroIntro>

          <div
            data-hero="stage"
            className="relative min-w-0 will-change-transform lg:col-span-5 xl:col-span-6"
          >
            <div className="pointer-events-none absolute -inset-x-4 -top-8 bottom-0 hidden lg:block">
              <div className="absolute right-0 top-1/2 h-[120%] w-[115%] -translate-y-1/2 border-l border-white/8 bg-[linear-gradient(90deg,rgba(255,255,255,0.02),transparent_40%)]" />
            </div>

            <div className="relative">
              <p className="mb-3 hidden font-mono text-[10px] tracking-[0.2em] text-zinc-600 lg:block">
                PLAY TO LOCK SCREEN · A/D TO DODGE · DRAG TO ORBIT
              </p>
              {showScene ? (
                <Suspense fallback={<SceneFallback />}>
                  <HeroScene scrollProgressRef={progressRef} />
                </Suspense>
              ) : (
                <SceneFallback />
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-white/8 pt-5 text-[11px] text-zinc-600 sm:mt-16">
          <span>{personal.education}</span>
          <span className="hidden sm:inline">{personal.location}</span>
            <a
              href="#about"
              onClick={handleHashNavClick}
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Scroll
            </a>
        </div>
      </Container>
    </section>
  );
}
