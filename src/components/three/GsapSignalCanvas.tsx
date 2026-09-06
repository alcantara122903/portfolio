"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 420;
const RING_COUNT = 3;

function SignalCore({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const core = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    if (!core.current || !inner.current || !outer.current) return;

    core.current.rotation.y = t * 0.35 + p * Math.PI * 1.8;
    core.current.rotation.x = Math.sin(t * 0.4) * 0.2 + p * 0.45;
    const pulse = 1 + Math.sin(t * 2.2) * 0.04 + p * 0.35;
    core.current.scale.setScalar(pulse);

    inner.current.rotation.z = -t * 0.55;
    outer.current.rotation.y = t * 0.25;
    outer.current.rotation.x = t * 0.15;
  });

  return (
    <group ref={core}>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.85}
          metalness={0.55}
          roughness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={outer} scale={1.35}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#38bdf8"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh scale={1.85}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      <pointLight color="#38bdf8" intensity={2.2} distance={8} />
    </group>
  );
}

function ParticleField({
  progressRef,
  mouseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const points = useRef<THREE.Points>(null);
  const { positions, colors, seeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    const colorA = new THREE.Color("#38bdf8");
    const colorB = new THREE.Color("#a5f3fc");
    const colorC = new THREE.Color("#818cf8");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const radius = 1.2 + Math.random() * 4.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 1.5;
      seeds[i] = Math.random() * Math.PI * 2;

      const mix = Math.random();
      const c =
        mix > 0.7 ? colorC : mix > 0.35 ? colorB : colorA;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    return { positions, colors, seeds };
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    const pos = points.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const seed = seeds[i];
      const breathe = Math.sin(t * 0.7 + seed) * (0.08 + p * 0.12);
      const expand = 1 + p * 0.55;
      const baseX = positions[i3] * expand;
      const baseY = positions[i3 + 1] * expand;
      const baseZ = positions[i3 + 2] * expand;
      pos[i3] = baseX + Math.cos(t * 0.35 + seed) * breathe;
      pos[i3 + 1] = baseY + Math.sin(t * 0.4 + seed) * breathe;
      pos[i3 + 2] = baseZ + Math.sin(t * 0.25 + seed * 1.4) * breathe * 1.4;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y = t * 0.05 + p * 1.2;
    points.current.rotation.x = mouseRef.current.y * 0.15 + p * 0.2;
    points.current.rotation.z = mouseRef.current.x * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.slice(), 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function OrbitRings({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    group.current.rotation.z = t * 0.12 + p * 0.8;
    group.current.rotation.x = 0.55 + Math.sin(p * Math.PI) * 0.25;
    group.current.children.forEach((child, i) => {
      child.rotation.y = t * (0.2 + i * 0.08) * (i % 2 === 0 ? 1 : -1);
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.7]} scale={1.4 + i * 0.55}>
          <torusGeometry args={[1, 0.008, 12, 96]} />
          <meshBasicMaterial
            color={i === 1 ? "#67e8f9" : "#38bdf8"}
            transparent
            opacity={0.28 - i * 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

function SignalBeams({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const lines = useMemo(() => {
    const count = 18;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
          Math.cos(angle) * 3.2,
          Math.sin(angle) * 2.4,
          -1.5 - (i % 3) * 0.4,
        ),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: "#7dd3fc",
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Line(geo, mat);
    });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    group.current.rotation.y = t * 0.08 + p * Math.PI;
    lines.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 2 + i) * 0.04 + p * 0.12;
    });
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

function CameraRig({
  progressRef,
  mouseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  useFrame((state) => {
    const p = progressRef.current;
    const cam = state.camera;
    const targetZ = 5.2 - p * 2.4;
    const targetY = Math.sin(p * Math.PI) * 0.35 + mouseRef.current.y * 0.25;
    const targetX = Math.sin(p * Math.PI * 2) * 0.55 + mouseRef.current.x * 0.4;

    cam.position.x += (targetX - cam.position.x) * 0.06;
    cam.position.y += (targetY - cam.position.y) * 0.06;
    cam.position.z += (targetZ - cam.position.z) * 0.06;
    cam.lookAt(0, 0, -0.5);
  });

  return <PerspectiveCamera makeDefault position={[0, 0, 5.2]} fov={48} />;
}

function SceneContent({
  progressRef,
  mouseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <>
      <CameraRig progressRef={progressRef} mouseRef={mouseRef} />
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#09090b", 4.5, 12]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 3]} intensity={0.7} color="#e0f2fe" />
      <pointLight position={[-3, 2, 2]} intensity={1.1} color="#38bdf8" />
      <pointLight position={[3, -2, 1]} intensity={0.55} color="#818cf8" />

      <SignalCore progressRef={progressRef} />
      <OrbitRings progressRef={progressRef} />
      <SignalBeams progressRef={progressRef} />
      <ParticleField progressRef={progressRef} mouseRef={mouseRef} />
    </>
  );
}

export function GsapSignalCanvas({
  progressRef,
  mouseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      className="h-full w-full"
    >
      <SceneContent progressRef={progressRef} mouseRef={mouseRef} />
    </Canvas>
  );
}
