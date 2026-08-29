"use client";

import { useCallback, useEffect, useRef } from "react";

const CANVAS_W = 640;
const CANVAS_H = 160;
const GROUND_Y = 132;
const GRAVITY = 0.65;
const JUMP_V = -11.5;

type Obstacle = { x: number; w: number; h: number };

function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

function drawDino(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  legUp: boolean,
) {
  const c = "#535353";
  drawPixelRect(ctx, x + 8, y - 44, 22, 24, c);
  drawPixelRect(ctx, x + 26, y - 36, 10, 10, c);
  drawPixelRect(ctx, x + 32, y - 40, 6, 6, c);
  drawPixelRect(ctx, x + 4, y - 24, 8, 14, c);
  drawPixelRect(ctx, x + 10, y - 12, 14, 12, c);
  drawPixelRect(ctx, x + 20, y - 8, 16, 8, c);
  drawPixelRect(ctx, x + 30, y - 4, 8, 4, c);
  if (legUp) {
    drawPixelRect(ctx, x + 12, y, 6, 6, c);
    drawPixelRect(ctx, x + 24, y - 4, 6, 10, c);
  } else {
    drawPixelRect(ctx, x + 12, y - 4, 6, 10, c);
    drawPixelRect(ctx, x + 24, y, 6, 6, c);
  }
}

function drawCactus(ctx: CanvasRenderingContext2D, x: number, h: number) {
  const c = "#34d399";
  const dark = "#059669";
  drawPixelRect(ctx, x + 8, GROUND_Y - h, 8, h, c);
  drawPixelRect(ctx, x, GROUND_Y - h + 14, 8, 8, dark);
  drawPixelRect(ctx, x + 16, GROUND_Y - h + 22, 8, 8, dark);
  if (h > 30) {
    drawPixelRect(ctx, x + 4, GROUND_Y - h - 8, 16, 8, c);
  }
}

interface TrexLoaderGameProps {
  active: boolean;
}

export function TrexLoaderGame({ active }: TrexLoaderGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    dinoY: GROUND_Y,
    vy: 0,
    grounded: true,
    frame: 0,
    groundX: 0,
    obstacles: [] as Obstacle[],
    spawnTimer: 0,
    score: 0,
    alive: true,
  });

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s.alive) {
      s.dinoY = GROUND_Y;
      s.vy = 0;
      s.grounded = true;
      s.obstacles = [];
      s.spawnTimer = 0;
      s.alive = true;
      return;
    }
    if (s.grounded && s.alive) {
      s.vy = JUMP_V;
      s.grounded = false;
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const loop = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.fillStyle = "#f7f7f7";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      if (active && s.alive) {
        s.frame += 1;
        s.groundX = (s.groundX - 6) % 24;
        s.spawnTimer += 1;

        if (s.spawnTimer > 90 + Math.random() * 60) {
          s.spawnTimer = 0;
          const h = 28 + Math.floor(Math.random() * 18);
          s.obstacles.push({ x: CANVAS_W + 10, w: 24, h });
        }

        s.vy += GRAVITY;
        s.dinoY += s.vy;
        if (s.dinoY >= GROUND_Y) {
          s.dinoY = GROUND_Y;
          s.vy = 0;
          s.grounded = true;
        }

        s.obstacles.forEach((o) => {
          o.x -= 6;
        });
        s.obstacles = s.obstacles.filter((o) => o.x > -40);

        for (const o of s.obstacles) {
          if (
            52 < o.x + o.w &&
            52 + 36 > o.x &&
            s.dinoY - 44 < GROUND_Y - o.h + 10
          ) {
            s.alive = false;
          }
        }

        if (s.alive) s.score += 1;
      }

      ctx.strokeStyle = "#535353";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 1);
      ctx.lineTo(CANVAS_W, GROUND_Y + 1);
      ctx.stroke();

      ctx.fillStyle = "#535353";
      for (let gx = s.groundX; gx < CANVAS_W; gx += 24) {
        ctx.fillRect(gx, GROUND_Y + 6, 14, 2);
      }

      s.obstacles.forEach((o) => drawCactus(ctx, o.x, o.h));

      const legUp = active && s.alive && s.grounded && Math.floor(s.frame / 6) % 2 === 0;
      drawDino(ctx, 44, s.dinoY, legUp);

      ctx.fillStyle = "#535353";
      ctx.font = "12px monospace";
      ctx.fillText(`HI ${String(Math.floor(s.score / 6)).padStart(5, "0")}`, CANVAS_W - 100, 24);

      if (!s.alive) {
        ctx.font = "13px monospace";
        ctx.fillText("Press SPACE to retry", CANVAS_W / 2 - 72, 56);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const handleTap = () => jump();

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className="h-auto w-full max-w-full cursor-pointer rounded-lg border border-zinc-300/80"
      onPointerDown={handleTap}
      aria-label="T-Rex loading mini game. Press space or tap to jump."
    />
  );
}
