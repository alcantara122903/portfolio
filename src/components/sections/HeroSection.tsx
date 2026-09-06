"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollProgressRef } from "@/hooks/useScrollProgressRef";
import { GsapHeroIntro } from "@/components/gsap/GsapHeroIntro";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Container } from "@/components/layout/Container";
import { SceneFallback } from "@/components/three/SceneFallback";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";

const HeroScene = dynamic(
  () =>
    import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <SceneFallback />,
  },
);

export function HeroSection() {
  const { personal } = portfolio;
  const isMobile = useMediaQuery("(max-width: 640px)");
  const showScene = !isMobile;
  const sectionRef = useRef<HTMLElement>(null);
  const { progressRef } = useScrollProgressRef(sectionRef, [
    "start start",
    "end start",
  ]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-dvh overflow-hidden !py-0 pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#07090d]/70 via-[#07090d]/40 to-[#07090d]" />

      <Container className="relative flex min-h-[calc(100dvh-6rem)] flex-col justify-center">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-14 lg:gap-16">
          <GsapHeroIntro className="min-w-0 max-w-xl">
            <p
              data-hero="eyebrow"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-zinc-500"
            >
              Systems Lab · {personal.location}
            </p>

            <h1
              data-hero="title"
              className="font-display mt-5 text-5xl font-semibold leading-[0.92] tracking-tight text-zinc-50 min-[380px]:text-6xl sm:text-7xl lg:text-[5.25rem]"
            >
              {personal.firstName}
              <br />
              <span className="text-zinc-100">
                {personal.lastName}
                <span className="text-sky-400">.</span>
              </span>
            </h1>

            <p
              data-hero="role"
              className="mt-6 text-base font-medium text-sky-400 sm:text-lg"
            >
              {personal.role}
            </p>

            <p
              data-hero="tagline"
              className="mt-4 max-w-md text-lg leading-snug text-zinc-300 sm:text-xl"
            >
              {personal.tagline}
            </p>

            <p
              data-hero="bio"
              className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500 sm:text-[15px]"
            >
              {personal.bio}
            </p>

            <div
              data-hero="actions"
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <MagneticButton>
                <Button href="#projects">Explore Work</Button>
              </MagneticButton>
              <MagneticButton>
                <Button href="#contact" variant="outline">
                  Contact
                </Button>
              </MagneticButton>
              <a
                href={personal.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 text-sm text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-200 hover:underline"
              >
                View résumé
              </a>
            </div>

            <div data-hero="meta" className="mt-8">
              <StatusIndicator label={personal.status} />
            </div>
          </GsapHeroIntro>

          <div data-gsap="reveal" className="relative min-w-0">
            <div data-gsap="parallax" data-speed="0.1">
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

        <div className="mt-auto flex justify-center pt-16">
          <a
            href="#about"
            className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600 transition-colors hover:text-zinc-400"
            aria-label="Scroll to about section"
          >
            <span>Scroll</span>
            <ArrowDown
              size={14}
              className="animate-bounce motion-reduce:animate-none"
            />
          </a>
        </div>
      </Container>
    </section>
  );
}
