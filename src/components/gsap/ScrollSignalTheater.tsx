"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, registerGsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const TheaterCanvas = dynamic(
  () =>
    import("@/components/three/ScrollTheaterCanvas").then(
      (m) => m.ScrollTheaterCanvas,
    ),
  { ssr: false },
);

const CHAPTERS = [
  {
    label: "I am a web and mobile developer",
    kicker: "01 · Who I am",
    copy: "I build clean interfaces people can actually use — on the web and on mobile.",
  },
  {
    label: "Web & mobile apps",
    kicker: "02 · What I ship",
    copy: "I build products end to end — interfaces, logic, and the systems behind them.",
  },
  {
    label: "Beyond the stack",
    kicker: "03 · How I work",
    copy: "Tools change. I learn fast, adapt, and ship whatever the product needs.",
  },
] as const;

export function ScrollSignalTheater() {
  const reducedMotion = useReducedMotion();
  const isNarrow = useMediaQuery("(max-width: 768px)");
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const compactRef = useRef(false);
  const fillRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dashRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countRef = useRef<HTMLSpanElement>(null);
  const activeIndex = useRef(0);

  compactRef.current = isNarrow;

  useEffect(() => {
    if (reducedMotion || !panelRef.current) return;
    registerGsap();

    const chapters = chapterRefs.current.filter(Boolean) as HTMLDivElement[];
    const dashes = dashRefs.current.filter(Boolean) as HTMLDivElement[];

    gsap.set(chapters, { autoAlpha: 0, y: 28 });
    gsap.set(chapters[0], { autoAlpha: 1, y: 0 });
    gsap.set(dashes, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(dashes[0], { scaleX: 1 });
    activeIndex.current = 0;

    if (countRef.current) {
      countRef.current.textContent = "01";
    }

    const showChapter = (index: number) => {
      if (index === activeIndex.current) return;
      activeIndex.current = index;

      chapters.forEach((chapter, i) => {
        gsap.to(chapter, {
          autoAlpha: i === index ? 1 : 0,
          y: i === index ? 0 : i < index ? -20 : 20,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      });

      dashes.forEach((dash, i) => {
        gsap.to(dash, {
          scaleX: i <= index ? 1 : 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
      });

      if (countRef.current) {
        countRef.current.textContent = String(index + 1).padStart(2, "0");
      }
    };

    const tween = gsap.to(fillRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: panelRef.current,
        start: "top top",
        end: "+=240%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const idx = Math.min(
            chapters.length - 1,
            Math.floor(self.progress * chapters.length),
          );
          showChapter(idx);
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill(true);
      tween.kill();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="border-y border-white/8 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-sky-400/80 sm:text-[11px]">
            Who I am
          </p>
          <div className="mt-8 grid gap-8 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {CHAPTERS.map((chapter) => (
              <div key={chapter.label} className="border-t border-white/8 pt-5 sm:pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  {chapter.kicker}
                </p>
                <h3 className="font-display mt-3 text-xl font-semibold text-zinc-50 sm:text-2xl">
                  {chapter.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {chapter.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10" aria-label="Who I am">
      <div
        ref={panelRef}
        className="relative flex min-h-dvh w-full items-center overflow-hidden bg-[#07090d]"
      >
        <div
          className={cn(
            "absolute inset-0",
            isNarrow ? "opacity-40" : "opacity-55",
          )}
        >
          <TheaterCanvas progressRef={progressRef} compactRef={compactRef} />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(56,189,248,0.08),transparent_50%)] max-md:bg-[radial-gradient(ellipse_at_80%_20%,rgba(56,189,248,0.1),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#07090d] via-[#07090d]/80 to-[#07090d]/30 max-md:via-[#07090d]/90 max-md:to-[#07090d]/55" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#07090d] via-transparent to-[#07090d]/85" />

        <div
          className={cn(
            "relative z-10 mx-auto flex h-full min-h-dvh w-full max-w-7xl flex-col justify-between",
            "px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]",
            "sm:px-6 sm:py-12 lg:px-8 lg:py-14",
          )}
        >
          <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
            <p className="max-w-[70%] font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-sky-400/80 sm:max-w-none sm:text-[11px] sm:tracking-[0.28em]">
              <span className="sm:hidden">Who I am</span>
              <span className="hidden sm:inline">
                I am a web and mobile developer
              </span>
            </p>
            <p className="shrink-0 font-mono text-[10px] tabular-nums text-zinc-500 sm:text-[11px]">
              <span ref={countRef}>01</span>
              <span className="text-zinc-700"> / 03</span>
            </p>
          </div>

          <div className="relative my-8 w-full max-w-xl overflow-hidden sm:my-0">
            {CHAPTERS.map((chapter, index) => (
              <div
                key={chapter.label}
                ref={(el) => {
                  chapterRefs.current[index] = el;
                }}
                className="absolute inset-x-0 top-0"
                style={{
                  opacity: index === 0 ? 1 : 0,
                  visibility: index === 0 ? "visible" : "hidden",
                }}
                aria-hidden={index !== 0}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:text-[11px] sm:tracking-[0.24em]">
                  {chapter.kicker}
                </p>
                <h2 className="font-display mt-3 text-[clamp(1.75rem,6.5vw,3.75rem)] font-semibold leading-[1.1] tracking-tight text-zinc-50 sm:mt-4">
                  {chapter.label}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400 sm:mt-5 sm:text-base lg:text-lg">
                  {chapter.copy}
                </p>
              </div>
            ))}
            <div className="invisible" aria-hidden="true">
              <p className="font-mono text-[10px] sm:text-[11px]">00</p>
              <h2 className="font-display mt-3 text-[clamp(1.75rem,6.5vw,3.75rem)] leading-[1.1] sm:mt-4">
                I am a web and mobile developer
              </h2>
              <p className="mt-4 max-w-md text-sm sm:mt-5 sm:text-base lg:text-lg">
                I build clean interfaces people can actually use — on the web
                and on mobile.
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="mb-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600 sm:mb-3 sm:text-[10px] sm:tracking-[0.2em]">
              <span>My path</span>
              <span className="hidden sm:inline">Keep scrolling</span>
              <span className="sm:hidden">Scroll</span>
            </div>
            <div className="h-[2px] overflow-hidden rounded-full bg-white/8">
              <div
                ref={fillRef}
                className="h-full origin-left scale-x-0 rounded-full bg-linear-to-r from-sky-500 via-cyan-300 to-sky-200"
              />
            </div>
            <div className="mt-3 flex gap-1.5 sm:mt-4 sm:gap-2">
              {CHAPTERS.map((chapter, i) => (
                <div
                  key={chapter.label}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/8"
                >
                  <div
                    ref={(el) => {
                      dashRefs.current[i] = el;
                    }}
                    className={cn(
                      "h-full origin-left rounded-full bg-sky-400/80",
                      i === 0 ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
