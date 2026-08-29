"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { portfolio } from "@/data/portfolio";
import { HERO_TECH_NODES } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TrexLoaderGame = dynamic(
  () =>
    import("@/components/loading/TrexLoader3D").then((m) => m.TrexLoaderGame),
  { ssr: false },
);

const INTRO_LINES = [
  portfolio.personal.fullName,
  portfolio.personal.role,
  portfolio.personal.tagline,
  portfolio.personal.specialization,
  portfolio.personal.status,
] as const;

const INTRO_DURATION_MS = 1000;
const LINE_INTERVAL_MS = 220;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const lineVariants = {
  enter: {
    opacity: 0,
    y: 24,
    filter: "blur(8px)",
  },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(6px)",
  },
};

export function LoadingScreen() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      const t = window.setTimeout(() => setVisible(false), 350);
      return () => window.clearTimeout(t);
    }

    const start = performance.now();

    const lineTimer = window.setInterval(() => {
      setLineIndex((i) => Math.min(i + 1, INTRO_LINES.length - 1));
    }, LINE_INTERVAL_MS);

    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(1, elapsed / INTRO_DURATION_MS);
      setProgress(easeOutCubic(raw) * 100);

      if (elapsed < INTRO_DURATION_MS) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
      window.setTimeout(() => setVisible(false), 500);
    }, INTRO_DURATION_MS);

    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(exitTimer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  if (!visible && reducedMotion) return null;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          className="fixed inset-0 z-9999 flex min-h-dvh flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-zinc-950"
          initial={{ opacity: 1 }}
          animate={
            exiting
              ? { opacity: 0, scale: 1.015, filter: "blur(12px)" }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
          }
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
          <div className="pointer-events-none absolute inset-0 scanline opacity-30" />

          <motion.div
            className="pointer-events-none absolute -left-16 top-1/4 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl sm:-left-24 sm:h-72 sm:w-72"
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-10 bottom-1/4 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl sm:-right-16 sm:h-64 sm:w-64"
            animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.12)_0%,transparent_55%)]" />

          <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10">
            <div className="grid w-full max-w-4xl items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="order-1 w-full min-w-0 md:order-2"
              >
                <TrexLoaderGame active={!reducedMotion && !exiting} />
                <motion.p
                  className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600 sm:mt-3 sm:text-[10px] sm:tracking-[0.25em]"
                  animate={{ opacity: [0.45, 0.85, 0.45] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Preparing experience
                </motion.p>
              </motion.div>

              <div className="order-2 flex min-w-0 flex-col justify-center text-center md:order-1 md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-center gap-2.5 md:justify-start"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400/60 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
                  </span>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:text-[11px] sm:tracking-[0.35em]">
                    Portfolio
                  </p>
                </motion.div>

                <div className="mt-4 min-h-[108px] sm:mt-5 sm:min-h-[128px] md:min-h-[148px] lg:min-h-[168px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={lineIndex}
                      variants={lineVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {lineIndex === 0 ? (
                        <h1 className="text-gradient text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                          {INTRO_LINES[0]}
                        </h1>
                      ) : lineIndex === 1 ? (
                        <p className="text-balance bg-linear-to-r from-sky-300 via-cyan-300 to-sky-400 bg-clip-text text-lg font-medium text-transparent sm:text-xl md:text-2xl">
                          {INTRO_LINES[1]}
                        </p>
                      ) : (
                        <p className="text-balance text-sm leading-relaxed text-zinc-300 sm:text-base md:text-lg">
                          {INTRO_LINES[lineIndex]}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-4 flex justify-center gap-1.5 md:justify-start">
                  {INTRO_LINES.map((_, i) => (
                    <motion.span
                      key={i}
                      className="h-1 rounded-full bg-zinc-800"
                      animate={{
                        width: i === lineIndex ? 20 : 6,
                        backgroundColor:
                          i <= lineIndex
                            ? i === lineIndex
                              ? "rgba(56, 189, 248, 0.9)"
                              : "rgba(56, 189, 248, 0.35)"
                            : "rgba(39, 39, 42, 1)",
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </div>

                <motion.div
                  initial="hidden"
                  animate={lineIndex >= 2 ? "visible" : "hidden"}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.06, delayChildren: 0.15 },
                    },
                  }}
                  className="mt-5 flex flex-wrap justify-center gap-1.5 sm:mt-7 sm:gap-2 md:justify-start"
                >
                  {HERO_TECH_NODES.map((tech) => (
                    <motion.span
                      key={tech}
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.92 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { type: "spring", stiffness: 380, damping: 24 },
                        },
                      }}
                      className="rounded-full border border-zinc-800/80 bg-zinc-900/70 px-2 py-0.5 text-[9px] text-zinc-400 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[10px]"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="relative shrink-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 md:px-8 lg:px-10">
            <div className="mx-auto max-w-4xl">
              <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-widest text-zinc-600 sm:mb-2.5 sm:text-[10px]">
                <span className="truncate">Entering portfolio</span>
                <motion.span
                  key={Math.round(progress)}
                  initial={{ opacity: 0.5, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>
              <div className="relative h-1 overflow-hidden rounded-full bg-zinc-800/80">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-sky-500 via-cyan-400 to-sky-300"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.05 }}
                />
                <motion.div
                  className="absolute inset-y-0 w-16 bg-linear-to-r from-transparent via-white/30 to-transparent sm:w-24"
                  style={{ left: `${Math.max(0, progress - 12)}%` }}
                  animate={{ opacity: progress > 2 && progress < 98 ? 1 : 0 }}
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-full opacity-60"
                  style={{
                    boxShadow: `0 0 20px ${progress > 5 ? "rgba(56,189,248,0.45)" : "transparent"}`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
