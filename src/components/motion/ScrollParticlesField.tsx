"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStableMediaQuery } from "@/hooks/useMediaQuery";

type Particle = {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  layer: number;
};

/**
 * Homepage canvas-particle field — same unique theme as the loader.
 * Scroll-scrubbed flow (down/up) + subtle pointer interaction.
 * @see https://demos.gsap.com/demo/canvas-particles/
 */
export function ScrollParticlesField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useStableMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    registerGsap();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let scrollP = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let hasPointer = false;

    const COUNT = isMobile ? 55 : 110;
    const particles: Particle[] = [];
    const breathe = { v: 0 };

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({
          x,
          y,
          homeX: x,
          homeY: y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 0.7 + Math.random() * 1.6,
          a: 0.2 + Math.random() * 0.45,
          layer: Math.random(),
        });
      }
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();
    window.addEventListener("resize", resize);

    const breatheTween = gsap.to(breathe, {
      v: 1,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      onUpdate: (self) => {
        scrollP = self.progress;
      },
    });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hasPointer = true;
      pointerX = e.clientX / w;
      pointerY = e.clientY / h;
    };

    const onLeave = () => {
      hasPointer = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Graphite paper
      ctx.fillStyle = "#0a0b0d";
      ctx.fillRect(0, 0, w, h);

      // Soft accent wash that drifts with scroll
      const wx = w * (0.2 + scrollP * 0.55);
      const wy = h * (0.15 + scrollP * 0.5);
      const wash = ctx.createRadialGradient(wx, wy, 0, wx, wy, Math.min(w, h) * 0.45);
      wash.addColorStop(0, `rgba(94,184,232,${0.05 + scrollP * 0.04})`);
      wash.addColorStop(1, "rgba(94,184,232,0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      // Faint grid
      const step = 72;
      const gridShift = scrollP * 48;
      ctx.strokeStyle = "rgba(242,242,240,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = -step; y < h + step; y += step) {
        const yy = y + (gridShift % step);
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(w, yy);
        ctx.stroke();
      }

      // Flow path guide (unique system spine)
      ctx.beginPath();
      for (let i = 0; i <= 32; i++) {
        const t = i / 32;
        const x = w * (0.1 + t * 0.55 + Math.sin(t * Math.PI * 2 + scrollP) * 0.04);
        const y = h * (0.05 + t * 0.9);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(94,184,232,${0.08 + scrollP * 0.12})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      const px = pointerX * w;
      const py = pointerY * h;
      const flowY = scrollP * h * 0.35;

      // Connections (sparse)
      ctx.strokeStyle = `rgba(94,184,232,${0.06 + scrollP * 0.08})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 8) {
        const a = particles[i];
        const b = particles[(i + 5) % particles.length];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy < 140 * 140) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        // Scroll-synced vertical flow (reverses when scrolling up via scrollP)
        const layerDrift = (0.4 + p.layer * 0.9) * flowY * 0.02;
        p.y += p.vy + (scrollP - 0.5) * (0.15 + p.layer * 0.35);
        p.x += p.vx;

        // Soft wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Pointer interaction — subtle pull
        let drawX = p.x;
        let drawY = p.y + layerDrift;
        if (hasPointer) {
          const dx = px - drawX;
          const dy = py - drawY;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 160) {
            const force = (1 - dist / 160) * 14;
            drawX -= (dx / dist) * force;
            drawY -= (dy / dist) * force;
          }
        }

        const breatheScale =
          1 + Math.sin((p.x + p.y) * 0.015 + breathe.v * Math.PI) * 0.12;
        const alpha = p.a * (0.45 + scrollP * 0.35);

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.r * breatheScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,184,232,${alpha})`;
        ctx.fill();
      }

      // Core signal that travels down the spine with scroll
      const spineT = scrollP;
      const sx =
        w * (0.1 + spineT * 0.55 + Math.sin(spineT * Math.PI * 2) * 0.04);
      const sy = h * (0.05 + spineT * 0.9);
      ctx.beginPath();
      ctx.arc(sx, sy, 3.2 + breathe.v * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(94,184,232,0.9)";
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      breatheTween.kill();
      st.kill();
    };
  }, [reducedMotion, isMobile]);

  if (reducedMotion) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-[0.85]" />
      {/* Keep copy readable */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,11,13,0.35)_0%,rgba(10,11,13,0.15)_40%,rgba(10,11,13,0.45)_100%)]" />
    </div>
  );
}
