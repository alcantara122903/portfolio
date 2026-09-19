"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function BootCore({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    if (!group.current || !core.current || !wire.current || !ring.current || !ring2.current)
      return;

    group.current.rotation.y = t * (0.35 + p * 1.1);
    group.current.rotation.x = Math.sin(t * 0.4) * 0.18 + p * 0.25;
    group.current.scale.setScalar(0.55 + p * 0.55);

    core.current.rotation.z = -t * (0.4 + p * 0.8);
    wire.current.rotation.y = t * 0.25;

    ring.current.rotation.x = Math.PI / 2 + t * 0.15;
    ring.current.rotation.z = t * (0.3 + p);
    ring2.current.rotation.y = Math.PI / 2 - t * 0.2;
    ring2.current.rotation.z = -t * 0.25;

    const mat = core.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.35 + p * 1.1;
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial
          color="#5eb8e8"
          emissive="#0ea5e9"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.16}
        />
      </mesh>
      <mesh ref={wire} scale={1.28}>
        <icosahedronGeometry args={[0.72, 0]} />
        <meshBasicMaterial
          color="#7dd3fc"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
      <mesh ref={ring} scale={1.55}>
        <torusGeometry args={[0.85, 0.008, 8, 96]} />
        <meshBasicMaterial color="#5eb8e8" transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring2} scale={1.85}>
        <torusGeometry args={[0.85, 0.006, 8, 96]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0.28} />
      </mesh>
      <pointLight color="#5eb8e8" intensity={2.4} distance={8} />
      <pointLight
        color="#e0f2fe"
        intensity={0.8}
        distance={6}
        position={[1.2, 0.8, 1]}
      />
    </group>
  );
}

export function BootSignalCanvas({
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
      <PerspectiveCamera makeDefault position={[0, 0.15, 4.2]} fov={40} />
      <color attach="background" args={["#0a0b0d"]} />
      <fog attach="fog" args={["#0a0b0d", 3.5, 9]} />
      <ambientLight intensity={0.25} />
      <BootCore progressRef={progressRef} />
    </Canvas>
  );
}
