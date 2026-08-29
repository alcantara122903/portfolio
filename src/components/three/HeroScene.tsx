"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { HERO_TECH_NODES } from "@/lib/constants";
import { DeveloperDevice } from "@/components/three/DeveloperDevice";
import { TechNodeRing } from "@/components/three/TechNode";
import { DataFlowLines } from "@/components/three/ConnectionLine";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Group, Mesh } from "three";

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

function FloatingGem({
  position,
  scale = 1,
  color = "#38bdf8",
  wireframe = false,
  speed = 1,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  wireframe?: boolean;
  speed?: number;
}) {
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

function SceneContent({ mouse }: { mouse: { x: number; y: number } }) {
  const ambientGroup = useRef<Group>(null);

  useFrame((state) => {
    if (!ambientGroup.current) return;
    ambientGroup.current.rotation.y = state.clock.elapsedTime * 0.015;
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

      <group ref={ambientGroup}>
        <DeveloperDevice mouse={mouse} />

        {/* Hero gems — large diamond left, accents around phone */}
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

export function HeroScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x, y: -y });
  };

  return (
    <div
      className="relative h-80 w-full overflow-hidden rounded-2xl border border-zinc-800/70 sm:h-100 lg:h-130"
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sky-950/50 via-zinc-950 to-indigo-950/40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(56,189,248,0.14)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_75%,rgba(129,140,248,0.1)_0%,transparent_50%)]" />

      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        className="absolute! inset-0"
      >
        <SceneContent mouse={mouse} />
      </Canvas>

      <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-6 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 lg:flex">
        <span className="text-sky-300/80">Mobile App</span>
        <span className="text-sky-400/70">↓</span>
        <span className="text-indigo-300/70">REST API</span>
        <span className="text-sky-400/70">↓</span>
        <span className="text-emerald-300/70">Database</span>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex flex-wrap justify-center gap-2 px-2">
        {HERO_TECH_NODES.map((node, i) => (
          <span
            key={node}
            className="rounded-full border border-zinc-700/60 bg-zinc-950/70 px-2 py-0.5 text-[10px] text-zinc-400 backdrop-blur-sm"
            style={{
              borderColor:
                i === 0
                  ? "rgba(56,189,248,0.3)"
                  : i === 3
                    ? "rgba(52,211,153,0.3)"
                    : undefined,
            }}
          >
            {node}
          </span>
        ))}
      </div>
    </div>
  );
}
