"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, registerGsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { signalPortfolioReady } from "@/lib/portfolioReady";

const LoaderCanvas = dynamic(
  () =>
    import("@/components/loading/LoaderSignalCanvas").then(
      (m) => m.LoaderSignalCanvas,
    ),
  { ssr: false },
);

const STATUS_LINES = [
  "Booting systems lab",
  "Calibrating signal core",
  "Linking particle field",
  "Syncing interface layer",
  "Signal locked",
];

export function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [visible, setVisible] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (reducedMotion) {
      const t = window.setTimeout(() => {
        setVisible(false);
        signalPortfolioReady();
      }, 250);
      return () => window.clearTimeout(t);
    }

    if (!rootRef.current) return;
    registerGsap();

    const proxy = { value: 0 };
    const duration = isMobile ? 1.9 : 2.75;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          setVisible(false);
          signalPortfolioReady();
        },
      });

      tl.fromTo(
        stageRef.current,
        { autoAlpha: 0, scale: 1.08 },
        { autoAlpha: 1, scale: 1, duration: 0.85, ease: "power2.out" },
        0,
      );

      tl.fromTo(
        brandRef.current,
        { autoAlpha: 0, y: 30, filter: "blur(12px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75 },
        0.15,
      );

      tl.fromTo(
        '[data-loader="hud"]',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55 },
        0.3,
      );

      tl.to(
        proxy,
        {
          value: 100,
          duration,
          ease: "power2.inOut",
          onUpdate: () => {
            const value = proxy.value;
            progressRef.current = value / 100;
            if (percentRef.current) {
              percentRef.current.textContent = `${Math.round(value)
                .toString()
                .padStart(2, "0")}%`;
            }
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${value / 100})`;
            }
            if (statusRef.current) {
              const idx = Math.min(
                STATUS_LINES.length - 1,
                Math.floor((value / 100) * STATUS_LINES.length),
              );
              statusRef.current.textContent = STATUS_LINES[idx];
            }
          },
        },
        0.35,
      );

      tl.fromTo(
        '[data-loader="lock"]',
        { autoAlpha: 0, scale: 0.85, y: 10 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.6)" },
        "-=0.4",
      );

      tl.to(
        '[data-loader="flash"]',
        { autoAlpha: 0.55, duration: 0.12, yoyo: true, repeat: 1 },
        "-=0.1",
      );

      tl.to(
        rootRef.current,
        {
          autoAlpha: 0,
          scale: 1.06,
          filter: "blur(16px)",
          duration: 0.8,
          ease: "power2.inOut",
        },
        "+=0.2",
      );
    }, rootRef);

    return () => ctx.revert();
  }, [hydrated, reducedMotion, isMobile]);

  if (!visible) return null;

  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center bg-zinc-950"
        data-portfolio-loader
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky-400">
          Loading
        </p>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-9999 flex min-h-dvh flex-col overflow-hidden bg-[#07090d]"
      aria-hidden="true"
      data-portfolio-loader
    >
      <div ref={stageRef} className="absolute inset-0 opacity-0">
        {hydrated && (
          <LoaderCanvas progressRef={progressRef} compact={isMobile} />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_0%,rgba(9,9,11,0.25)_45%,rgba(9,9,11,0.92)_78%)]" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-15" />
      <div
        data-loader="flash"
        className="pointer-events-none absolute inset-0 bg-sky-200/30 opacity-0"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-5 pb-6 sm:justify-center sm:pb-0">
        <div
          ref={brandRef}
          className="mb-[18vh] flex flex-col items-center text-center opacity-0 sm:mb-0 sm:mt-[42vh]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-sky-400/90">
            Systems Lab
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            IVAN<span className="text-sky-400">.</span>
          </h1>
          <p
            data-loader="lock"
            className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-sky-300/80 opacity-0"
          >
            Signal locked
          </p>
        </div>
      </div>

      <div
        data-loader="hud"
        className="relative z-10 mx-auto w-full max-w-md px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] opacity-0 sm:px-8"
      >
        <div className="mb-3 flex items-end justify-between gap-4">
          <p
            ref={statusRef}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500"
          >
            {STATUS_LINES[0]}
          </p>
          <span
            ref={percentRef}
            className="font-mono text-sm tabular-nums text-sky-400"
          >
            00%
          </span>
        </div>
        <div className="h-[2px] overflow-hidden rounded-full bg-zinc-800/90">
          <div
            ref={barRef}
            className="h-full origin-left rounded-full bg-linear-to-r from-sky-600 via-sky-300 to-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.55)]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
