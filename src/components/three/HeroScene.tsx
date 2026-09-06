"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { HERO_TECH_NODES } from "@/lib/constants";
import { DeveloperDevice } from "@/components/three/DeveloperDevice";
import { FloatingGem } from "@/components/three/FloatingGem";
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

function SceneBackdrop() {
  return (
    <>
      <mesh position={[0, 0, -2.5]} scale={[9, 7, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#0c1220" />
      </mesh>
      <mesh position={[0.6, 0.15, -1.8]} scale={[3.8, 3.8, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.05} />
      </mesh>
      <mesh position={[-1.1, -0.25, -1.6]} scale={[2.8, 2.8, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.04} />
      </mesh>
    </>
  );
}

function SceneContent({
  orbitRef,
  scrollProgressRef,
}: {
  orbitRef: React.MutableRefObject<OrbitState>;
  scrollProgressRef?: React.MutableRefObject<number>;
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
      <color attach="background" args={["#09090b"]} />
      <SceneBackdrop />
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#38bdf8", "#18181b", 0.5]} />
      <directionalLight position={[4, 5, 4]} intensity={1.5} color="#f0f9ff" />
      <directionalLight position={[-3, -1, 2]} intensity={0.35} color="#818cf8" />
      <pointLight position={[-2.5, 1.5, 2.5]} intensity={1} color="#38bdf8" />
      <pointLight position={[2.5, -0.5, 2]} intensity={0.5} color="#818cf8" />
      <spotLight
        position={[0, 2, 3]}
        intensity={0.6}
        angle={0.4}
        penumbra={0.8}
        color="#67e8f9"
      />

      {/* Phone orbits independently for full 360 drag */}
      <DeveloperDevice orbitRef={orbitRef} />

      <group ref={ambientGroup}>
        <FloatingGem position={[-1.35, 0.05, 0.35]} scale={1.15} color="#22d3ee" />
        <FloatingGem
          position={[-0.55, 0.95, -0.15]}
          scale={0.45}
          color="#818cf8"
          wireframe
          speed={0.8}
        />
        <FloatingGem position={[1.05, -0.75, 0.2]} scale={0.35} color="#34d399" speed={1.3} />
        <FloatingGem
          position={[0.85, 0.85, -0.3]}
          scale={0.28}
          color="#a78bfa"
          wireframe
          speed={1.1}
        />

        <TechNodeRing nodes={HERO_TECH_NODES} />
        <DataFlowLines />
      </group>
    </>
  );
}

export function HeroScene({
  scrollProgressRef,
}: {
  scrollProgressRef?: React.MutableRefObject<number>;
}) {
  const reducedMotion = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const orbitRef = useRef<OrbitState>({
    x: 0.12,
    y: -0.45,
    vx: 0,
    vy: 0,
    dragging: false,
  });
  const lastPointer = useRef({ x: 0, y: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    orbitRef.current.dragging = true;
    orbitRef.current.vx = 0;
    orbitRef.current.vy = 0;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !orbitRef.current.dragging) return;
    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;
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

  return (
    <div
      className={cn(
        "relative h-80 w-full overflow-hidden rounded-2xl border border-zinc-800/70 sm:h-100 lg:h-130",
        dragging ? "cursor-grabbing" : "cursor-grab",
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label="Interactive 3D phone — drag to rotate"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sky-950/50 via-zinc-950 to-indigo-950/40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(56,189,248,0.14)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_75%,rgba(129,140,248,0.1)_0%,transparent_50%)]" />

      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600">
        Drag to spin
      </p>

      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        className="pointer-events-none absolute! inset-0"
      >
        <SceneContent
          orbitRef={orbitRef}
          scrollProgressRef={scrollProgressRef}
        />
      </Canvas>
    </div>
  );
}
