"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { HERO_TECH_NODES } from "@/lib/constants";
import {
  DeveloperDevice,
  type GameHud,
  type GameInput,
} from "@/components/three/DeveloperDevice";
import { TechNodeRing } from "@/components/three/TechNode";
import { DataFlowLines } from "@/components/three/ConnectionLine";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { Group } from "three";

type OrbitState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dragging: boolean;
};

const INITIAL_HUD: GameHud = {
  score: 0,
  lives: 3,
  combo: 0,
  playing: false,
  status: "demo",
};

function SceneBackdrop() {
  return (
    <mesh position={[0, 0, -2.5]} scale={[9, 7, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#0a0b0d" />
    </mesh>
  );
}

function SceneContent({
  orbitRef,
  scrollProgressRef,
  gameHudRef,
  inputRef,
  reducedMotion,
}: {
  orbitRef: React.MutableRefObject<OrbitState>;
  scrollProgressRef?: React.MutableRefObject<number>;
  gameHudRef: React.MutableRefObject<GameHud>;
  inputRef: React.MutableRefObject<GameInput>;
  reducedMotion: boolean;
}) {
  const ambientGroup = useRef<Group>(null);

  useFrame((state) => {
    if (!ambientGroup.current) return;
    const scroll = scrollProgressRef?.current ?? 0;
    ambientGroup.current.rotation.y =
      state.clock.elapsedTime * 0.015 + scroll * 0.35;
    ambientGroup.current.rotation.x = scroll * 0.18;
    ambientGroup.current.position.y = -scroll * 0.25;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.05, 4.1]} fov={40} />
      <color attach="background" args={["#0a0b0d"]} />
      <SceneBackdrop />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#5eb8e8", "#18181b", 0.35]} />
      <directionalLight position={[4, 5, 4]} intensity={1.25} color="#f0f9ff" />
      <pointLight position={[-2.5, 1.5, 2.5]} intensity={0.6} color="#5eb8e8" />

      <DeveloperDevice
        orbitRef={orbitRef}
        gameHudRef={gameHudRef}
        inputRef={inputRef}
        reducedMotion={reducedMotion}
      />

      <group ref={ambientGroup}>
        <TechNodeRing nodes={HERO_TECH_NODES} />
        <DataFlowLines />
      </group>
    </>
  );
}

function GameHudOverlay({
  hud,
  onLane,
  onStart,
  reducedMotion,
}: {
  hud: GameHud;
  onLane: (delta: number) => void;
  onStart: () => void;
  reducedMotion: boolean;
}) {
  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-3 sm:p-4">
      <div className="flex items-end justify-between gap-3">
        <div className="font-mono text-[10px] tabular-nums tracking-wide text-zinc-400">
          <span className="text-zinc-200">{String(hud.score).padStart(3, "0")}</span>
          <span className="mx-2 text-zinc-600">/</span>
          <span className="text-zinc-500">{hud.lives} lives</span>
          {hud.combo > 1 && (
            <span className="ml-2 text-[var(--accent)]">x{hud.combo}</span>
          )}
        </div>
        <p className="max-w-[11rem] text-right font-mono text-[9px] leading-relaxed tracking-wide text-zinc-500 sm:max-w-none sm:text-[10px]">
          {hud.status === "over"
            ? "Game over - Space to retry"
            : hud.status === "demo"
              ? "A D or arrows to play"
              : "Phone locked - A D to dodge"}
        </p>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => onLane(-1)}
          className="min-h-9 min-w-9 border border-white/12 bg-black/40 text-sm text-zinc-300 transition-colors hover:border-white/25 hover:text-zinc-50"
          aria-label="Move left"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => onLane(1)}
          className="min-h-9 min-w-9 border border-white/12 bg-black/40 text-sm text-zinc-300 transition-colors hover:border-white/25 hover:text-zinc-50"
          aria-label="Move right"
        >
          →
        </button>
        <button
          type="button"
          onClick={onStart}
          className="min-h-9 flex-1 border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 font-mono text-[10px] tracking-[0.14em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/20"
        >
          {hud.status === "over"
            ? "RETRY"
            : hud.playing
              ? "RUNNING"
              : "PLAY"}
        </button>
      </div>
    </div>
  );
}

export function HeroScene({
  scrollProgressRef,
}: {
  scrollProgressRef?: React.MutableRefObject<number>;
}) {
  const reducedMotion = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hud, setHud] = useState<GameHud>(INITIAL_HUD);

  const orbitRef = useRef<OrbitState>({
    x: 0.12,
    y: -0.45,
    vx: 0,
    vy: 0,
    dragging: false,
  });
  const lastPointer = useRef({ x: 0, y: 0 });
  const dragMoved = useRef(false);
  const gameHudRef = useRef<GameHud>({ ...INITIAL_HUD });
  const inputRef = useRef<GameInput>({
    laneDelta: 0,
    start: false,
    focused: false,
  });
  const rootRef = useRef<HTMLDivElement>(null);

  // Sync HUD from r3f loop
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const next = gameHudRef.current;
      setHud((prev) => {
        if (
          prev.score === next.score &&
          prev.lives === next.lives &&
          prev.combo === next.combo &&
          prev.playing === next.playing &&
          prev.status === next.status
        ) {
          return prev;
        }
        return { ...next };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    inputRef.current.focused = focused;
  }, [focused]);

  useEffect(() => {
    if (reducedMotion) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!inputRef.current.focused) return;
      const key = event.key.toLowerCase();

      if (
        key === "arrowleft" ||
        key === "a" ||
        key === "arrowright" ||
        key === "d" ||
        key === " " ||
        key === "enter"
      ) {
        event.preventDefault();
      }

      if (key === "arrowleft" || key === "a") {
        inputRef.current.laneDelta = -1;
      } else if (key === "arrowright" || key === "d") {
        inputRef.current.laneDelta = 1;
      } else if (key === " " || key === "enter") {
        inputRef.current.start = true;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reducedMotion]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    // Ignore UI buttons
    if ((event.target as HTMLElement).closest("button")) return;
    // Lock orbit while a run is active so the screen stays readable
    if (gameHudRef.current.playing && gameHudRef.current.status !== "over") {
      rootRef.current?.focus();
      return;
    }

    orbitRef.current.dragging = true;
    orbitRef.current.vx = 0;
    orbitRef.current.vy = 0;
    dragMoved.current = false;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    rootRef.current?.focus();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !orbitRef.current.dragging) return;
    if (gameHudRef.current.playing && gameHudRef.current.status !== "over") return;
    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved.current = true;
    orbitRef.current.y += dx * 0.012;
    orbitRef.current.x += dy * 0.01;
    orbitRef.current.vy = dx * 0.012;
    orbitRef.current.vx = dy * 0.01;
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    orbitRef.current.dragging = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const nudgeLane = (delta: number) => {
    inputRef.current.laneDelta = delta;
    rootRef.current?.focus();
  };

  const startGame = () => {
    inputRef.current.start = true;
    rootRef.current?.focus();
  };

  const playing =
    hud.playing && hud.status !== "over";

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className={cn(
        "relative h-[28rem] w-full overflow-hidden border border-white/10 outline-none sm:h-[32rem] lg:h-[min(36rem,70vh)]",
        playing
          ? "cursor-default"
          : dragging
            ? "cursor-grabbing"
            : "cursor-grab",
        focused && "ring-1 ring-[var(--accent)]/30",
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPointerEnter={() => {
        setFocused(true);
        inputRef.current.focused = true;
      }}
      onPointerLeave={() => {
        if (!dragging) {
          setFocused(false);
          inputRef.current.focused = false;
        }
      }}
      role="application"
      aria-label="Playable phone game. Use A and D or arrow keys to dodge blocks. Drag to orbit when not playing."
    >
      <div className="pointer-events-none absolute inset-0 bg-[var(--background)]" />

      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        className="pointer-events-none absolute! inset-0"
      >
        <SceneContent
          orbitRef={orbitRef}
          scrollProgressRef={scrollProgressRef}
          gameHudRef={gameHudRef}
          inputRef={inputRef}
          reducedMotion={reducedMotion}
        />
      </Canvas>

      <GameHudOverlay
        hud={hud}
        onLane={nudgeLane}
        onStart={startGame}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
