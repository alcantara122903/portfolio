"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { animate, createScope, createTimeline, spring } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { TrexPhase } from "@/components/loading/TrexLoader3D";

const TrexLoaderGame = dynamic(
  () =>
    import("@/components/loading/TrexLoader3D").then((m) => m.TrexLoaderGame),
  { ssr: false },
);

const LOAD_MS = 2200;
const ROAR_MS = 1200;

export function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<TrexPhase>("run");
  const [showRawr, setShowRawr] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      const t = window.setTimeout(() => setVisible(false), 300);
      return () => window.clearTimeout(t);
    }

    if (!rootRef.current) return;

    const progressProxy = { value: 0 };
    let roarTimer: number | undefined;

    const scope = createScope({ root: rootRef }).add(() => {
      const tl = createTimeline({
        defaults: { ease: "out(3)" },
      });

      tl.add('[data-loader="stage"]', {
        opacity: [0, 1],
        y: [20, 0],
        scale: [0.97, 1],
        duration: 700,
      }, 0);

      tl.add(progressProxy, {
        value: 100,
        duration: LOAD_MS,
        ease: "inOut(2)",
        onUpdate: () => setProgress(Math.round(progressProxy.value)),
        onComplete: () => {
          setProgress(100);
          setPhase("roar");
          setShowRawr(true);

          window.requestAnimationFrame(() => {
            animate('[data-loader="rawr"]', {
              opacity: [0, 1],
              scale: [0.35, 1.15, 1],
              rotate: [-10, 5, 0],
              duration: 720,
              ease: spring({ bounce: 0.55 }),
            });
          });

          roarTimer = window.setTimeout(() => {
            animate(rootRef.current!, {
              opacity: [1, 0],
              scale: [1, 1.03],
              filter: ["blur(0px)", "blur(12px)"],
              duration: 560,
              ease: "inOut(3)",
              onComplete: () => setVisible(false),
            });
          }, ROAR_MS);
        },
      }, 0);

      tl.add('[data-loader="bar"]', {
        scaleX: [0, 1],
        duration: LOAD_MS,
        ease: "inOut(2)",
      }, 0);
    });

    return () => {
      scope.revert();
      if (roarTimer) window.clearTimeout(roarTimer);
    };
  }, [reducedMotion]);

  if (!visible) return null;

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-zinc-950">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky-400">
          Loading
        </p>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-9999 flex min-h-dvh flex-col overflow-hidden bg-zinc-950"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(56,189,248,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-25" />
      <div className="pointer-events-none absolute inset-0 scanline opacity-20" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div data-loader="stage" className="relative w-full max-w-2xl opacity-0">
          <TrexLoaderGame active={!reducedMotion && visible} phase={phase} />

          {showRawr && (
            <div
              data-loader="rawr"
              className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
            >
              <span className="rounded-xl border border-sky-300/40 bg-zinc-950/75 px-6 py-2.5 text-4xl font-black tracking-[0.22em] text-sky-300 shadow-[0_0_50px_rgba(56,189,248,0.4)] backdrop-blur-sm sm:text-5xl">
                RAWR!
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
        <div className="mx-auto max-w-md">
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            <span>{progress >= 100 ? "Ready" : "Loading"}</span>
            <span className="tabular-nums text-sky-400">{progress}%</span>
          </div>
          <div className="h-[2px] overflow-hidden rounded-full bg-zinc-800">
            <div
              data-loader="bar"
              className="h-full origin-left rounded-full bg-linear-to-r from-sky-500 via-sky-300 to-cyan-200"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
