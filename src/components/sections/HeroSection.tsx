"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";
import { FileText, ArrowDown } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollProgressRef } from "@/hooks/useScrollProgressRef";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Container } from "@/components/layout/Container";
import { SceneFallback } from "@/components/three/SceneFallback";
import { Button } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/icons";
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
  const { personal, socials } = portfolio;
  const github = socials.find((s) => s.icon === "github");
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
      className="relative min-h-dvh overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 lg:pb-24"
    >
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-zinc-950 via-zinc-950/95 to-zinc-950" />

      <Container className="relative">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-8">
          <div className="min-w-0 max-w-xl">
            <FadeIn>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                Hello, I&apos;m
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="mt-3 text-4xl font-semibold leading-[0.95] tracking-tight text-zinc-50 min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
                {personal.firstName.toUpperCase()}
                <br />
                {personal.lastName.toUpperCase()}
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-4 text-lg font-medium text-sky-400/90 sm:text-xl">
                {personal.role}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="mt-4 text-xl font-medium leading-snug text-zinc-200 sm:text-2xl">
                {personal.tagline}
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
                {personal.bio}
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <MagneticButton>
                  <Button href="#projects">Explore My Work</Button>
                </MagneticButton>
                <MagneticButton>
                  <Button
                    href={personal.resumePath}
                    variant="secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={16} />
                    View Résumé
                  </Button>
                </MagneticButton>
                {github && (
                  <MagneticButton>
                    <Button
                      href={github.href}
                      variant="outline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitHubIcon size={16} />
                      GitHub
                    </Button>
                  </MagneticButton>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <StatusIndicator label={personal.status} />
                <span className="text-sm text-zinc-500">
                  Based in {personal.location}
                </span>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="relative min-w-0">
            {showScene ? (
              <Suspense fallback={<SceneFallback />}>
                <HeroScene scrollProgressRef={progressRef} />
              </Suspense>
            ) : (
              <SceneFallback />
            )}
          </FadeIn>
        </div>

        <div className="mt-16 flex justify-center lg:mt-20">
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-zinc-600 transition-colors hover:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
            aria-label="Scroll to about section"
          >
            <span>Scroll</span>
            <ArrowDown size={16} className="animate-bounce motion-reduce:animate-none" />
          </a>
        </div>
      </Container>
    </section>
  );
}
