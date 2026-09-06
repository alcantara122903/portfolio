"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, registerGsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DATA_FLOW_LABELS } from "@/lib/constants";
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
    label: DATA_FLOW_LABELS[0],
    kicker: "01 · Interface",
    copy: "Users touch the system here — screens, flows, and real actions.",
  },
  {
    label: DATA_FLOW_LABELS[1],
    kicker: "02 · Logic",
    copy: "Requests travel through APIs — auth, validation, and business rules.",
  },
  {
    label: DATA_FLOW_LABELS[2],
    kicker: "03 · Memory",
    copy: "Data lands in the database — the source of truth that keeps everything consistent.",
  },
] as const;

export function ScrollSignalTheater() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dashRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countRef = useRef<HTMLSpanElement>(null);
  const activeIndex = useRef(0);

  useEffect(() => {
    if (reducedMotion || isMobile || !panelRef.current) return;
    registerGsap();

    const chapters = chapterRefs.current.filter(Boolean) as HTMLDivElement[];
    const dashes = dashRefs.current.filter(Boolean) as HTMLDivElement[];

    gsap.set(chapters, { autoAlpha: 0, y: 28 });
    gsap.set(chapters[0], { autoAlpha: 1, y: 0 });
    gsap.set(dashes, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(dashes[0], { scaleX: 1 });

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
        end: "+=280%",
        pin: true,
        scrub: 0.9,
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
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reducedMotion, isMobile]);

  if (reducedMotion || isMobile) {
    return (
      <section className="border-y border-white/8 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-sky-400/80">
            System flow
          </p>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {CHAPTERS.map((chapter) => (
              <div key={chapter.label} className="border-t border-white/8 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  {chapter.kicker}
                </p>
                <h3 className="font-display mt-3 text-2xl font-semibold text-zinc-50">
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
    <section className="relative z-10" aria-label="Scroll-driven system flow">
      <div
        ref={panelRef}
        className="relative flex h-dvh w-full items-center overflow-hidden bg-[#07090d]"
      >
        <div className="absolute inset-0 opacity-55">
          <TheaterCanvas progressRef={progressRef} />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(56,189,248,0.08),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#07090d] via-[#07090d]/75 to-[#07090d]/25" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#07090d] via-transparent to-[#07090d]/85" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-sky-400/80">
              Scroll to explore the system
            </p>
            <p className="font-mono text-[11px] tabular-nums text-zinc-500">
              <span ref={countRef}>01</span>
              <span className="text-zinc-700"> / 03</span>
            </p>
          </div>

          <div className="relative max-w-xl overflow-hidden">
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
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  {chapter.kicker}
                </p>
                <h2 className="font-display mt-4 text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
                  {chapter.label}
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
                  {chapter.copy}
                </p>
              </div>
            ))}
            <div className="invisible" aria-hidden="true">
              <p className="font-mono text-[11px]">00</p>
              <h2 className="font-display mt-4 text-5xl sm:text-6xl lg:text-7xl">
                Database
              </h2>
              <p className="mt-5 max-w-md text-base sm:text-lg">
                Data lands in the database — the source of truth that keeps
                everything consistent.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              <span>Signal path</span>
              <span>Keep scrolling</span>
            </div>
            <div className="h-[2px] overflow-hidden rounded-full bg-white/8">
              <div
                ref={fillRef}
                className="h-full origin-left scale-x-0 rounded-full bg-linear-to-r from-sky-500 via-cyan-300 to-sky-200"
              />
            </div>
            <div className="mt-4 flex gap-2">
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
