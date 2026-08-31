"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import type { Mesh } from "three";

const STEPS = [
  { x: -2.4, color: "#38bdf8", label: 0 },
  { x: -0.8, color: "#67e8f9", label: 1 },
  { x: 0.8, color: "#818cf8", label: 2 },
  { x: 2.4, color: "#34d399", label: 3 },
];

function ProcessPipeline({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const pulseRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    const progress = progressRef.current;
    const t = state.clock.elapsedTime;

    if (pulseRef.current) {
      const minX = STEPS[0].x;
      const maxX = STEPS[STEPS.length - 1].x;
      pulseRef.current.position.x = minX + (maxX - minX) * progress;
      pulseRef.current.position.y = Math.sin(t * 2 + progress * 6) * 0.08;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.25;
      ringRef.current.scale.setScalar(1 + progress * 0.15);
    }
  });

  return (
    <>
      {STEPS.map((step, index) => (
        <group key={step.label} position={[step.x, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial
              color={step.color}
              emissive={step.color}
              emissiveIntensity={0.35}
              metalness={0.45}
              roughness={0.35}
              transparent
              opacity={0.9}
            />
          </mesh>
          {index < STEPS.length - 1 && (
            <mesh
              position={[(STEPS[index + 1].x - step.x) / 2, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.02, 0.02, STEPS[index + 1].x - step.x, 8]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={0.25}
                transparent
                opacity={0.5}
              />
            </mesh>
          )}
        </group>
      ))}

      <mesh ref={pulseRef} position={[STEPS[0].x, 0, 0.35]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#fafafa"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.1, 0.012, 8, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.4}
          transparent
          opacity={0.35}
        />
      </mesh>
    </>
  );
}

export function ProcessScrollCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} className="h-full w-full">
      <PerspectiveCamera makeDefault position={[0, 0.2, 4.2]} fov={42} />
      <color attach="background" args={["#09090b"]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 2, 3]} intensity={0.8} color="#38bdf8" />
      <pointLight position={[-2, -1, 2]} intensity={0.35} color="#818cf8" />
      <ProcessPipeline progressRef={progressRef} />
    </Canvas>
  );
}
