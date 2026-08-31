"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import type { Group } from "three";
import { FloatingGem } from "@/components/three/FloatingGem";

const GEM_LAYOUT: Array<{
  position: [number, number, number];
  scale: number;
  color: string;
  wireframe?: boolean;
  speed?: number;
}> = [
  { position: [-2.8, 1.2, -1.5], scale: 0.9, color: "#22d3ee" },
  { position: [2.6, 0.4, -2], scale: 0.55, color: "#818cf8", wireframe: true, speed: 0.8 },
  { position: [-1.5, -1.8, -1.2], scale: 0.4, color: "#34d399", speed: 1.2 },
  { position: [3.2, -1.4, -1.8], scale: 0.35, color: "#a78bfa", wireframe: true },
  { position: [0.5, 2.2, -2.5], scale: 0.5, color: "#38bdf8" },
  { position: [-3.5, -0.5, -2.2], scale: 0.3, color: "#67e8f9", wireframe: true, speed: 1.4 },
];

function AmbientOrbit({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const progress = progressRef.current;
    const t = state.clock.elapsedTime;

    groupRef.current.rotation.y = progress * Math.PI * 1.5 + t * 0.04;
    groupRef.current.rotation.z = Math.sin(progress * Math.PI) * 0.12;
    groupRef.current.position.y = -progress * 1.5 + Math.sin(t * 0.3) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {GEM_LAYOUT.map((gem, index) => (
        <FloatingGem key={index} {...gem} />
      ))}
    </group>
  );
}

function AmbientCamera({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  useFrame((state) => {
    const progress = progressRef.current;
    const cam = state.camera;
    cam.position.x = Math.sin(progress * Math.PI * 2) * 0.35;
    cam.position.y = Math.cos(progress * Math.PI) * 0.2;
    cam.lookAt(0, 0, 0);
  });

  return <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />;
}

export function ScrollAmbientCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full opacity-35"
    >
      <AmbientCamera progressRef={progressRef} />
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 2, 2]} intensity={0.6} color="#38bdf8" />
      <pointLight position={[-2, -1, 1]} intensity={0.35} color="#818cf8" />
      <AmbientOrbit progressRef={progressRef} />
    </Canvas>
  );
}
