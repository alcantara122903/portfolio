"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

interface TechNodeProps {
  position: [number, number, number];
  color?: string;
}

export function TechNode({
  position,
  color = "#38bdf8",
}: TechNodeProps) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.08;
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          metalness={0.35}
          roughness={0.25}
        />
      </mesh>
      {/* Label rendered via HTML would be heavy; nodes are visual only */}
    </group>
  );
}

const NODE_COLORS = ["#38bdf8", "#818cf8", "#34d399", "#22d3ee", "#a78bfa"] as const;

export function TechNodeRing({ nodes }: { nodes: readonly string[] }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  const positions: [number, number, number][] = nodes.map((_, i) => {
    const angle = (i / nodes.length) * Math.PI * 2;
    const radius = 2.2;
    return [Math.cos(angle) * radius, Math.sin(i) * 0.3, Math.sin(angle) * radius];
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <TechNode
          key={nodes[i]}
          position={pos}
          color={NODE_COLORS[i % NODE_COLORS.length]}
        />
      ))}
    </group>
  );
}
