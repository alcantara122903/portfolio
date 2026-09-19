"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type CursorMode = "default" | "hover" | "press";

const TRAIL_COUNT = 6;

export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = isFinePointer && !reducedMotion;
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const gemRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const overInteractive = useRef(false);

  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const trail = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 })),
  );
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("custom-cursor-active");

    const interactiveSelector =
      "a, button, [role='button'], input, textarea, select, label, summary, .cursor-hover";

    const syncMode = (pressed: boolean) => {
      if (pressed) setMode("press");
      else if (overInteractive.current) setMode("hover");
      else setMode("default");
    };

    const onMove = (event: MouseEvent) => {
      vel.current.x = event.clientX - pos.current.x;
      vel.current.y = event.clientY - pos.current.y;
      pos.current.x = event.clientX;
      pos.current.y = event.clientY;
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onDown = () => syncMode(true);
    const onUp = () => syncMode(false);

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(interactiveSelector)) {
        overInteractive.current = true;
        setMode((m) => (m === "press" ? "press" : "hover"));
      }
    };

    const onOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const related = event.relatedTarget as HTMLElement | null;
      if (
        target?.closest(interactiveSelector) &&
        !related?.closest(interactiveSelector)
      ) {
        overInteractive.current = false;
        setMode((m) => (m === "press" ? "press" : "default"));
      }
    };

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16;
      ring.current.y += (pos.current.y - ring.current.y) * 0.16;

      const vx = Math.max(-32, Math.min(32, vel.current.x));
      const vy = Math.max(-32, Math.min(32, vel.current.y));
      vel.current.x *= 0.84;
      vel.current.y *= 0.84;

      let prevX = pos.current.x;
      let prevY = pos.current.y;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const point = trail.current[i];
        const ease = 0.28 - i * 0.03;
        point.x += (prevX - point.x) * ease;
        point.y += (prevY - point.y) * ease;
        prevX = point.x;
        prevY = point.y;

        const el = trailRefs.current[i];
        if (el) {
          const scale = 1 - i * 0.12;
          el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${scale})`;
          el.style.opacity = String(0.55 - i * 0.08);
        }
      }

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (gemRef.current) {
        const rotX = Math.max(-34, Math.min(34, -vy * 1.25));
        const rotY = Math.max(-34, Math.min(34, vx * 1.25));
        const twist = Math.max(-18, Math.min(18, vx * 0.35));
        gemRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${45 + twist}deg)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = mode === "hover" ? 58 : mode === "press" ? 30 : 42;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[10000] hidden transition-opacity duration-200 md:block",
        visible ? "opacity-100" : "opacity-0",
      )}
      aria-hidden="true"
    >
      {/* Velocity trail sparks */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-sky-300/80 will-change-transform"
          style={{
            boxShadow: "0 0 10px rgba(56,189,248,0.55)",
          }}
        />
      ))}

      {/* Lagging orbital ring */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{ width: ringSize, height: ringSize }}
      >
        <div
          className={cn(
            "relative h-full w-full rounded-full border transition-[border-color,box-shadow] duration-200",
            mode === "hover" ? "border-sky-300/90" : "border-sky-400/50",
          )}
          style={{
            boxShadow:
              mode === "hover"
                ? "0 0 0 1px rgba(94,184,232,0.5)"
                : "0 0 0 1px rgba(94,184,232,0.28)",
          }}
        >
          <span className="absolute left-1/2 top-0 h-px w-1 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)]" />
          <span className="absolute bottom-0 left-1/2 h-px w-1 -translate-x-1/2 translate-y-1/2 bg-[var(--accent)]/70" />
        </div>
      </div>

      {/* Core */}
      <div
        ref={coreRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{ perspective: "700px" }}
      >
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/20 blur-sm transition-all duration-200",
            mode === "hover" ? "h-8 w-8" : mode === "press" ? "h-4 w-4" : "h-5 w-5",
          )}
        />

        <div
          ref={gemRef}
          className={cn(
            "relative will-change-transform transition-[width,height] duration-200",
            mode === "hover" ? "h-3.5 w-3.5" : mode === "press" ? "h-2 w-2" : "h-2.5 w-2.5",
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          <span
            className="absolute inset-0 bg-[var(--accent)]"
            style={{
              transform: "translateZ(2px)",
            }}
          />
          <span
            className="absolute inset-0 bg-zinc-700"
            style={{ transform: "translateZ(-2px) rotateY(180deg)" }}
          />
          <span
            className="absolute inset-[20%] bg-white/40"
            style={{ transform: "translateZ(3px)" }}
          />
        </div>
      </div>
    </div>
  );
}
