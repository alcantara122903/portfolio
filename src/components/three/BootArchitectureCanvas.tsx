"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const ACCENT = "#5eb8e8";

/** Clean single-core boot mark — no stacked rings/wireframe clutter. */
function BootCore({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const rim = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    if (!group.current || !core.current || !rim.current) return;

    group.current.rotation.y = t * 0.22 + p * 0.9;
    group.current.rotation.x = 0.35;
    group.current.scale.setScalar(0.85 + p * 0.35);

    core.current.rotation.y = -t * 0.15;
    rim.current.rotation.z = t * 0.2;

    const mat = core.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.2 + p * 0.45;
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={0.25}
          metalness={0.55}
          roughness={0.3}
        />
      </mesh>
      <mesh ref={rim} rotation={[Math.PI / 2, 0, 0]} scale={1.45}>
        <torusGeometry args={[0.72, 0.006, 8, 72]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.4} />
      </mesh>
      <pointLight color={ACCENT} intensity={1.1} distance={5} />
    </group>
  );
}

export function BootArchitectureCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <PerspectiveCamera makeDefault position={[0, 0.05, 3.4]} fov={36} />
      <ambientLight intensity={0.35} />
      <BootCore progressRef={progressRef} />
    </Canvas>
  );
}
