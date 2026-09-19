"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

type Particle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
};

/**
 * Unique canvas-particle boot theme.
 * @see https://demos.gsap.com/demo/canvas-particles/
 */
export function BootParticlesCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const proxy = useRef({ gather: 0, pulse: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    registerGsap();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    const COUNT = 140;

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
      // Core sits mid-right so it shares the screen with left typography
      cx = w * 0.62;
      cy = h * 0.48;
      seed();
    };

    const seed = () => {
      const list: Particle[] = [];
      for (let i = 0; i < COUNT; i++) {
        const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.3;
        // Spread across full viewport, not a tiny cluster
        const radius =
          50 + Math.random() * Math.hypot(w, h) * (0.18 + Math.random() * 0.28);
        const homeR = radius * (0.12 + Math.random() * 0.35);
        list.push({
          x: cx + Math.cos(angle) * (radius + 80),
          y: cy + Math.sin(angle) * (radius + 80),
          ox: cx + Math.cos(angle) * homeR,
          oy: cy + Math.sin(angle) * homeR,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: 0.7 + Math.random() * 2.1,
          a: 0.22 + Math.random() * 0.55,
        });
      }
      // Extra field particles across empty corners
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        list.push({
          x,
          y,
          ox: x + (Math.random() - 0.5) * 40,
          oy: y + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 0.5 + Math.random() * 1.2,
          a: 0.15 + Math.random() * 0.3,
        });
      }
      particlesRef.current = list;
    };

    resize();
    window.addEventListener("resize", resize);

    const animProxy = proxy.current;
    gsap.to(animProxy, {
      gather: 1,
      duration: 1.7,
      ease: "power2.inOut",
    });
    const pulseTween = gsap.to(animProxy, {
      pulse: 1,
      duration: 1.9,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    const draw = () => {
      const particles = particlesRef.current;
      const gather = animProxy.gather;
      const pulse = animProxy.pulse;
      const boot = progressRef.current;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0a0b0d";
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.min(w, h) * 0.4,
      );
      glow.addColorStop(0, `rgba(94,184,232,${0.07 + boot * 0.06})`);
      glow.addColorStop(1, "rgba(94,184,232,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Links into core
      ctx.strokeStyle = `rgba(94,184,232,${0.1 + boot * 0.12})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 6) {
        const p = particles[i];
        const tx = gsap.utils.interpolate(p.x, p.ox, gather);
        const ty = gsap.utils.interpolate(p.y, p.oy, gather);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }

      // Orbit — larger to claim more of the field
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.12 + boot * 28 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(94,184,232,${0.2 + boot * 0.25})`;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.22 + boot * 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(94,184,232,${0.08 + boot * 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Core
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5 + boot * 4 + pulse * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(94,184,232,${0.8 + boot * 0.2})`;
      ctx.fill();

      for (const p of particles) {
        p.x += p.vx * (0.35 + (1 - gather) * 0.9);
        p.y += p.vy * (0.35 + (1 - gather) * 0.9);
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const x = gsap.utils.interpolate(p.x, p.ox, gather);
        const y = gsap.utils.interpolate(p.y, p.oy, gather);
        const scale =
          1 + Math.sin((x + y) * 0.02 + pulse * Math.PI) * 0.14 * gather;

        ctx.beginPath();
        ctx.arc(x, y, p.r * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,184,232,${p.a * (0.4 + gather * 0.55)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      pulseTween.kill();
      gsap.killTweensOf(animProxy);
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
