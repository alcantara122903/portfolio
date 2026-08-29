"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrexLoaderGame } from "@/components/loading/TrexLoaderGame";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const MIN_LOAD_MS = 2200;

export function LoadingScreen() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      return;
    }

    const start = Date.now();
    const finishLoad = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_LOAD_MS - elapsed);
      window.setTimeout(() => setPhase("ready"), wait);
    };

    if (document.readyState === "complete") {
      finishLoad();
    } else {
      window.addEventListener("load", finishLoad, { once: true });
    }
  }, [reducedMotion]);

  const enterSite = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (phase === "ready") {
        enterSite();
        return;
      }
      if (!started) setStarted(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, started, enterSite]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-zinc-950 px-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <div className="w-full max-w-2xl">
            <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
              Loading portfolio
            </p>
            <h2 className="mb-4 text-center text-lg font-medium text-zinc-100 sm:text-xl">
              {phase === "ready" ? "Ready!" : started ? "Loading..." : "T-Rex Runner"}
            </h2>

            <TrexLoaderGame active={started && phase === "loading"} />

            <p className="mt-4 text-center font-mono text-xs text-zinc-400">
              {phase === "ready" ? (
                <span className="text-sky-400">Press SPACE to enter portfolio</span>
              ) : started ? (
                "Use SPACE or tap to jump while the site loads"
              ) : (
                "Press SPACE to start"
              )}
            </p>

            {phase === "ready" && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={enterSite}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:border-sky-500/50 hover:text-white"
                >
                  Enter Portfolio
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
