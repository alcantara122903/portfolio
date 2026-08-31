"use client";

import { useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

interface FloatingGemProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  wireframe?: boolean;
  speed?: number;
}

export function FloatingGem({
  position,
  scale = 1,
  color = "#38bdf8",
  wireframe = false,
  speed = 1,
}: FloatingGemProps) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.y = t * 0.5;
    ref.current.rotation.x = Math.sin(t * 0.6) * 0.25;
  });

  return (
    <Float speed={speed * 1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={wireframe ? 0.45 : 0.65}
          metalness={0.4}
          roughness={0.2}
          wireframe={wireframe}
          transparent={!wireframe}
          opacity={wireframe ? 1 : 0.92}
        />
      </mesh>
    </Float>
  );
}
