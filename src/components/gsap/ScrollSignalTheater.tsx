"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, registerGsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DATA_FLOW_LABELS } from "@/lib/constants";

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
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const fillRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countRef = useRef<HTMLSpanElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || isMobile || !panelRef.current || !sectionRef.current) {
      return;
    }

    registerGsap();

    const chapters = chapterRefs.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(chapters, { autoAlpha: 0, y: 28, filter: "blur(8px)" });
    gsap.set(chapters[0], { autoAlpha: 1, y: 0, filter: "blur(0px)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panelRef.current,
        start: "top top",
        end: "+=320%",
        pin: true,
        scrub: 1.05,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (fillRef.current) {
            fillRef.current.style.transform = `scaleX(${self.progress})`;
          }
          if (countRef.current) {
            const step = Math.min(
              3,
              Math.max(1, Math.ceil(self.progress * 3)),
            );
            countRef.current.textContent = String(step).padStart(2, "0");
          }
          if (beamRef.current) {
            beamRef.current.style.transform = `scaleX(${0.15 + self.progress * 0.85})`;
          }
        },
      },
    });

    // Chapter 1 holds, then crossfade to 2, then 3
    tl.to({}, { duration: 0.12 }, 0);

    tl.to(
      chapters[0],
      { autoAlpha: 0, y: -24, filter: "blur(8px)", duration: 0.18 },
      0.28,
    );
    tl.fromTo(
      chapters[1],
      { autoAlpha: 0, y: 28, filter: "blur(8px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.2 },
      0.3,
    );

    tl.to(
      chapters[1],
      { autoAlpha: 0, y: -24, filter: "blur(8px)", duration: 0.18 },
      0.58,
    );
    tl.fromTo(
      chapters[2],
      { autoAlpha: 0, y: 28, filter: "blur(8px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.2 },
      0.6,
    );

    tl.to({}, { duration: 0.18 }, 0.85);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
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
    <section
      ref={sectionRef}
      className="relative z-10"
      aria-label="Scroll-driven system flow"
    >
      <div
        ref={panelRef}
        className="relative flex h-dvh w-full items-center overflow-hidden bg-[#07090d]"
      >
        {/* Three.js scrubbed scene */}
        <div className="absolute inset-0 opacity-70">
          <TheaterCanvas progressRef={progressRef} />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(56,189,248,0.1),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#07090d] via-[#07090d]/55 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#07090d] via-transparent to-[#07090d]/80" />

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

          <div className="relative max-w-xl">
            {CHAPTERS.map((chapter, index) => (
              <div
                key={chapter.label}
                ref={(el) => {
                  chapterRefs.current[index] = el;
                }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2"
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
            {/* Spacer so absolute chapters have height */}
            <div className="invisible">
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
                className="h-full origin-left rounded-full bg-linear-to-r from-sky-500 via-cyan-300 to-sky-200"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <div className="mt-4 flex gap-2">
              {CHAPTERS.map((chapter, i) => (
                <div
                  key={chapter.label}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/8"
                >
                  <div
                    ref={i === 0 ? beamRef : undefined}
                    className="h-full origin-left rounded-full bg-sky-400/70"
                    style={{ transform: "scaleX(0.15)" }}
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
