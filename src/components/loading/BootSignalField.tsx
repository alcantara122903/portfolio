"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

/**
 * Loader background — editorial signal field (not particle cloud).
 * Complements typography-led boot: thin path, grid, one traveling pulse.
 */
export function BootSignalField({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const proxy = useRef({ breathe: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    registerGsap();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const anim = proxy.current;
    const breatheTween = gsap.to(anim, {
      breathe: 1,
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Path through composition — same language as site system path
    const pathAt = (t: number) => {
      const x = w * (0.12 + t * 0.76);
      const y =
        h * 0.28 +
        Math.sin(t * Math.PI * 1.6) * h * 0.12 +
        t * h * 0.38;
      return { x, y };
    };

    const draw = () => {
      const boot = progressRef.current;
      const breathe = anim.breathe;

      ctx.clearRect(0, 0, w, h);

      // Quiet paper field
      ctx.fillStyle = "#0a0b0d";
      ctx.fillRect(0, 0, w, h);

      // Soft vertical wash (restrained)
      const wash = ctx.createLinearGradient(0, 0, 0, h);
      wash.addColorStop(0, "rgba(94,184,232,0.03)");
      wash.addColorStop(0.45, "rgba(94,184,232,0)");
      wash.addColorStop(1, "rgba(94,184,232,0.04)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      // Technical grid (faint)
      const step = 64;
      ctx.strokeStyle = "rgba(242,242,240,0.035)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Guide path (undrawn full track)
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const p = pathAt(i / 40);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Drawn path follows boot progress
      const drawT = Math.max(0.02, boot);
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const t = (i / 48) * drawT;
        const p = pathAt(t);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = `rgba(94,184,232,${0.45 + boot * 0.35})`;
      ctx.lineWidth = 1.25;
      ctx.lineCap = "round";
      ctx.stroke();

      // Waypoint ticks along path
      const ticks = [0.15, 0.4, 0.65, 0.9];
      ticks.forEach((t) => {
        const p = pathAt(t);
        const on = boot >= t;
        ctx.beginPath();
        ctx.arc(p.x, p.y, on ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = on
          ? "rgba(94,184,232,0.85)"
          : "rgba(255,255,255,0.18)";
        ctx.fill();
      });

      // Traveling signal head
      const head = pathAt(drawT);
      const r = 3.5 + breathe * 1.2;
      ctx.beginPath();
      ctx.arc(head.x, head.y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(94,184,232,0.95)";
      ctx.fill();

      // Tiny trailing pulse
      const trail = pathAt(Math.max(0, drawT - 0.06));
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(94,184,232,0.35)";
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      breatheTween.kill();
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
