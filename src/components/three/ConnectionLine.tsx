"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}

export function ConnectionLine({
  start,
  end,
  color = "#38bdf8",
}: ConnectionLineProps) {
  const particleRef = useRef<Mesh>(null);
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 - 0.15,
    (start[2] + end[2]) / 2,
  ];

  useFrame((state) => {
    if (!particleRef.current) return;
    const t = (Math.sin(state.clock.elapsedTime * 1.5) + 1) / 2;
    particleRef.current.position.set(
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
      start[2] + (end[2] - start[2]) * t,
    );
  });

  return (
    <group>
      <mesh position={mid} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 1.2, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          transparent
          opacity={0.65}
        />
      </mesh>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

export function DataFlowLines() {
  const steps: [number, number, number][] = [
    [0, 1.8, 0],
    [0, 0.6, 0],
    [0, -0.6, 0],
  ];

  return (
    <group position={[1.8, 0, 0]}>
      {steps.slice(0, -1).map((start, i) => {
        const end = steps[i + 1];
        if (!end) return null;
        return (
          <ConnectionLine
            key={`flow-${i}`}
            start={start}
            end={end}
            color="#67e8f9"
          />
        );
      })}
    </group>
  );
}
