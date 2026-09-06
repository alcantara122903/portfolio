"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 280;

function BootCore({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const solid = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current || !solid.current || !wire.current || !shell.current) {
      return;
    }
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    const spin = 0.4 + p * 1.8;

    group.current.rotation.y = t * spin;
    group.current.rotation.x = Math.sin(t * 0.6) * 0.25 + p * 0.35;
    group.current.scale.setScalar(0.35 + p * 0.9 + Math.sin(t * 3) * 0.02);

    solid.current.rotation.z = -t * (0.5 + p);
    wire.current.rotation.y = t * 0.35;
    shell.current.rotation.x = t * 0.2;
    shell.current.rotation.z = -t * 0.15;

    const mat = solid.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.4 + p * 1.4;
  });

  return (
    <group ref={group}>
      <mesh ref={solid}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          metalness={0.65}
          roughness={0.18}
        />
      </mesh>
      <mesh ref={wire} scale={1.28}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial
          color="#7dd3fc"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh ref={shell} scale={1.7}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      <pointLight color="#38bdf8" intensity={3} distance={10} />
      <pointLight color="#67e8f9" intensity={1.2} distance={6} position={[1, 1, 1]} />
    </group>
  );
}

function AssemblingParticles({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const points = useRef<THREE.Points>(null);
  const { start, end, colors, seeds } = useMemo(() => {
    const start = new Float32Array(PARTICLE_COUNT * 3);
    const end = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    const cA = new THREE.Color("#38bdf8");
    const cB = new THREE.Color("#a5f3fc");
    const cC = new THREE.Color("#818cf8");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const scatter = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      start[i3] = scatter * Math.sin(phi) * Math.cos(theta);
      start[i3 + 1] = scatter * Math.sin(phi) * Math.sin(theta);
      start[i3 + 2] = scatter * Math.cos(phi);

      const r = 1.1 + Math.random() * 1.8;
      const t2 = Math.random() * Math.PI * 2;
      const p2 = Math.acos(2 * Math.random() - 1);
      end[i3] = r * Math.sin(p2) * Math.cos(t2);
      end[i3 + 1] = r * Math.sin(p2) * Math.sin(t2);
      end[i3 + 2] = r * Math.cos(p2);

      seeds[i] = Math.random();
      const mix = Math.random();
      const c = mix > 0.66 ? cC : mix > 0.33 ? cB : cA;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    return { start, end, colors, seeds };
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    const ease = p * p * (3 - 2 * p);
    const arr = points.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const wobble = Math.sin(t * 2 + seeds[i] * 10) * (1 - ease) * 0.15;
      arr[i3] = start[i3] + (end[i3] - start[i3]) * ease + wobble;
      arr[i3 + 1] =
        start[i3 + 1] + (end[i3 + 1] - start[i3 + 1]) * ease + wobble;
      arr[i3 + 2] =
        start[i3 + 2] + (end[i3 + 2] - start[i3 + 2]) * ease;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y = t * 0.12 + p * 0.8;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[start.slice(), 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function BootRings({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    group.current.rotation.x = 0.7 + p * 0.4;
    group.current.rotation.z = t * (0.2 + p * 0.6);
    group.current.scale.setScalar(0.6 + p * 0.7);
  });

  return (
    <group ref={group}>
      {[1.15, 1.55, 2.05].map((radius, i) => (
        <mesh key={radius} rotation={[Math.PI / 2, 0, i * 0.85]}>
          <torusGeometry args={[radius, 0.01, 10, 96]} />
          <meshBasicMaterial
            color={i === 1 ? "#67e8f9" : "#38bdf8"}
            transparent
            opacity={0.15 + progressRef.current * 0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

function BootCamera({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  useFrame((state) => {
    const p = progressRef.current;
    const cam = state.camera;
    const targetZ = 5.8 - p * 2.2;
    cam.position.z += (targetZ - cam.position.z) * 0.08;
    cam.position.y = Math.sin(p * Math.PI) * 0.2;
    cam.lookAt(0, 0, 0);
  });

  return <PerspectiveCamera makeDefault position={[0, 0, 5.8]} fov={45} />;
}

function Scene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <>
      <BootCamera progressRef={progressRef} />
      <color attach="background" args={["#09090b"]} />
      <fog attach="fog" args={["#09090b", 4, 11]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 2]} intensity={0.8} color="#e0f2fe" />
      <BootCore progressRef={progressRef} />
      <BootRings progressRef={progressRef} />
      <AssemblingParticles progressRef={progressRef} />
    </>
  );
}

export function LoaderSignalCanvas({
  progressRef,
  compact = false,
}: {
  progressRef: React.MutableRefObject<number>;
  compact?: boolean;
}) {
  return (
    <Canvas
      dpr={compact ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
