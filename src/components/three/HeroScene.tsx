"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { HERO_TECH_NODES } from "@/lib/constants";
import { DeveloperDevice } from "@/components/three/DeveloperDevice";
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
    <mesh position={[0, 0, -2.5]} scale={[9, 7, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#0a0b0d" />
    </mesh>
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
      <color attach="background" args={["#0a0b0d"]} />
      <SceneBackdrop />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#5eb8e8", "#18181b", 0.35]} />
      <directionalLight position={[4, 5, 4]} intensity={1.25} color="#f0f9ff" />
      <pointLight position={[-2.5, 1.5, 2.5]} intensity={0.6} color="#5eb8e8" />

      <DeveloperDevice orbitRef={orbitRef} />

      <group ref={ambientGroup}>
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
        "relative h-[28rem] w-full overflow-hidden border border-white/10 sm:h-[32rem] lg:h-[min(36rem,70vh)]",
        dragging ? "cursor-grabbing" : "cursor-grab",
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label="Interactive 3D phone — drag to rotate"
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
        />
      </Canvas>
    </div>
  );
}
