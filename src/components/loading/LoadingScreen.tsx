"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { signalPortfolioReady } from "@/lib/portfolioReady";

const Particles = dynamic(
  () =>
    import("@/components/loading/BootParticlesCanvas").then(
      (m) => m.BootParticlesCanvas,
    ),
  { ssr: false },
);

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const STATUS = ["Initialize", "Calibrate", "Connect", "Ready"] as const;

/** Full-viewport boot — every edge of the screen is used. */
export function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLSpanElement>(null);
  const lastRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const reducedMotion = useReducedMotion();
  const hydrated = useHydrated();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!hydrated) return;

    if (reducedMotion) {
      const t = window.setTimeout(() => {
        setVisible(false);
        signalPortfolioReady();
      }, 100);
      return () => window.clearTimeout(t);
    }

    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set(veilRef.current, { autoAlpha: 1 });
      gsap.set(stageRef.current, { autoAlpha: 0 });
      gsap.set([firstRef.current, lastRef.current], { autoAlpha: 0, y: 28 });
      gsap.set(roleRef.current, { autoAlpha: 0, y: 14 });
      gsap.set(chromeRef.current, { autoAlpha: 0 });
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left center" });

      const proxy = { p: 0 };
      progressRef.current = 0;

      const exit = () => {
        const out = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            setVisible(false);
            signalPortfolioReady();
          },
        });

        out
          .to(chromeRef.current, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(
            [roleRef.current, firstRef.current, lastRef.current],
            { autoAlpha: 0, y: -14, duration: 0.35, stagger: 0.04 },
            0.05,
          )
          .to(stageRef.current, { autoAlpha: 0, duration: 0.4 }, 0.12)
          .to(
            veilRef.current,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.65,
              ease: "power4.inOut",
            },
            0.28,
          )
          .set(root, { autoAlpha: 0 });
      };

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: exit,
      });

      tl.to(stageRef.current, { autoAlpha: 1, duration: 0.5 }, 0);
      tl.to(chromeRef.current, { autoAlpha: 1, duration: 0.45 }, 0.2);

      tl.to(
        proxy,
        {
          p: 1,
          duration: 2.0,
          ease: "power1.inOut",
          onUpdate: () => {
            const p = proxy.p;
            progressRef.current = p;
            if (barRef.current) gsap.set(barRef.current, { scaleX: p });
            if (percentRef.current) {
              percentRef.current.textContent = String(
                Math.round(p * 100),
              ).padStart(2, "0");
            }
            if (statusRef.current) {
              const idx = Math.min(
                STATUS.length - 1,
                Math.floor(p * STATUS.length),
              );
              statusRef.current.textContent = STATUS[idx];
            }
          },
        },
        0.25,
      );

      tl.to(
        firstRef.current,
        { autoAlpha: 1, y: 0, duration: 0.85, ease: "power4.out" },
        0.55,
      );
      tl.to(
        lastRef.current,
        { autoAlpha: 1, y: 0, duration: 0.85, ease: "power4.out" },
        0.7,
      );
      tl.to(roleRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, 1.0);

      tl.to({}, { duration: 0.35 });
    }, root);

    return () => ctx.revert();
  }, [hydrated, reducedMotion]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      data-portfolio-loader
      className="fixed inset-0 z-[100] h-dvh w-screen overflow-hidden bg-[var(--background)]"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div
        ref={veilRef}
        className="absolute inset-0 h-full w-full"
        style={{ clipPath: "inset(0 0 0 0)" }}
      >
        {/* Full-bleed particles */}
        <div ref={stageRef} className="absolute inset-0 h-full w-full opacity-0">
          <Particles progressRef={progressRef} />
        </div>

        {/* Full-screen frame — corners + center + bottom edge */}
        <div
          ref={chromeRef}
          className="pointer-events-none absolute inset-0 z-10 flex h-full w-full flex-col opacity-0"
        >
          {/* Top bar */}
          <div className="flex shrink-0 items-start justify-between px-5 pt-5 sm:px-8 sm:pt-8 lg:px-12 lg:pt-10">
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500">
              SYSTEM BOOT
            </p>
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-600">
              2026
            </p>
          </div>

          {/* Center identity — owns the middle of the viewport */}
          <div className="flex min-h-0 flex-1 flex-col justify-center px-5 sm:px-8 lg:px-12">
            <h1 className="font-display max-w-[min(100%,52rem)] text-[clamp(3.5rem,14vw,8rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-zinc-50">
              <span ref={firstRef} className="block opacity-0">
                Ivan
              </span>
              <span
                ref={lastRef}
                className="mt-1 block text-zinc-500 opacity-0 sm:mt-2"
              >
                Alcantara
              </span>
            </h1>
            <p
              ref={roleRef}
              className="mt-6 max-w-xl text-lg text-zinc-400 opacity-0 sm:mt-8 sm:text-xl lg:text-2xl"
            >
              Mobile & Web Developer
            </p>
          </div>

          {/* Bottom edge — full-width progress */}
          <div className="shrink-0 px-5 pb-5 sm:px-8 sm:pb-8 lg:px-12 lg:pb-10">
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <p ref={statusRef} className="text-sm text-zinc-500">
                {STATUS[0]}
              </p>
              <p className="font-mono text-sm tabular-nums text-zinc-200">
                <span ref={percentRef}>00</span>
                <span className="text-zinc-600">%</span>
              </p>
            </div>
            <div className="h-[2px] w-full overflow-hidden bg-white/10">
              <div
                ref={barRef}
                className="h-full w-full origin-left scale-x-0 bg-[var(--accent)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
