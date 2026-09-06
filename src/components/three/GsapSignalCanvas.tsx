"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 360;

function SignalCore({
  progressRef,
  phaseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  phaseRef: React.MutableRefObject<number>;
}) {
  const core = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    const phase = phaseRef.current;
    if (!core.current || !inner.current || !outer.current || !shell.current) {
      return;
    }

    const spin = 0.28 + p * 1.4 + phase * 0.15;
    core.current.rotation.y = t * spin + p * Math.PI * 1.6;
    core.current.rotation.x = Math.sin(t * 0.35) * 0.18 + p * 0.5;
    core.current.rotation.z = Math.sin(p * Math.PI) * 0.2;

    const pulse =
      0.85 +
      Math.sin(t * 2) * 0.03 +
      p * 0.45 +
      Math.sin(phase * Math.PI) * 0.08;
    core.current.scale.setScalar(pulse);
    core.current.position.y = Math.sin(p * Math.PI * 2) * 0.25;

    inner.current.rotation.z = -t * (0.4 + p);
    outer.current.rotation.y = t * 0.22;
    shell.current.rotation.x = t * 0.18;
    shell.current.rotation.y = -t * 0.12;

    const mat = inner.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.55 + p * 0.9 + phase * 0.15;
  });

  return (
    <group ref={core}>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.7}
          metalness={0.6}
          roughness={0.18}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh ref={outer} scale={1.32}>
        <icosahedronGeometry args={[0.48, 0]} />
        <meshBasicMaterial
          color="#7dd3fc"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
      <mesh ref={shell} scale={1.75}>
        <octahedronGeometry args={[0.48, 0]} />
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.14}
        />
      </mesh>
      <pointLight color="#38bdf8" intensity={2} distance={9} />
    </group>
  );
}

function ParticleField({
  progressRef,
  mouseRef,
  phaseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  phaseRef: React.MutableRefObject<number>;
}) {
  const points = useRef<THREE.Points>(null);
  const { positions, colors, seeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    const colorA = new THREE.Color("#38bdf8");
    const colorB = new THREE.Color("#a5f3fc");
    const colorC = new THREE.Color("#67e8f9");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const radius = 1.4 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 1.2;
      seeds[i] = Math.random() * Math.PI * 2;

      const mix = Math.random();
      const c = mix > 0.66 ? colorC : mix > 0.33 ? colorB : colorA;
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
    const phase = phaseRef.current;
    const helixBlend = Math.sin(p * Math.PI); // peaks mid-page
    const arr = points.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const seed = seeds[i];
      const expand = 1 + p * 0.7 + phase * 0.12;

      // Cloud base
      const cx = positions[i3] * expand;
      const cy = positions[i3 + 1] * expand;
      const cz = positions[i3 + 2] * expand;

      // Helix target — unique scroll morph
      const angle = seed + t * 0.35 + (i / PARTICLE_COUNT) * Math.PI * 8;
      const radius = 1.1 + (i % 7) * 0.18 + p * 0.4;
      const hx = Math.cos(angle) * radius;
      const hy = ((i / PARTICLE_COUNT) * 4 - 2) * (0.8 + p * 0.4);
      const hz = Math.sin(angle) * radius - 0.5;

      const mix = helixBlend * 0.85;
      const breathe = Math.sin(t * 0.8 + seed) * (0.05 + p * 0.08);

      arr[i3] = cx * (1 - mix) + hx * mix + breathe;
      arr[i3 + 1] = cy * (1 - mix) + hy * mix;
      arr[i3 + 2] = cz * (1 - mix) + hz * mix + breathe * 0.6;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y = t * 0.04 + p * 1.1;
    points.current.rotation.x = mouseRef.current.y * 0.12 + p * 0.15;
    points.current.rotation.z = mouseRef.current.x * 0.06;
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
        size={0.028}
        vertexColors
        transparent
        opacity={0.75}
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
    group.current.rotation.z = t * 0.1 + p * 1.1;
    group.current.rotation.x = 0.6 + Math.sin(p * Math.PI) * 0.35;
    group.current.scale.setScalar(0.85 + p * 0.55);
  });

  return (
    <group ref={group}>
      {[1.05, 1.45, 1.95].map((radius, i) => (
        <mesh key={radius} rotation={[Math.PI / 2, 0, i * 0.9]}>
          <torusGeometry args={[radius, 0.006, 10, 96]} />
          <meshBasicMaterial
            color={i === 1 ? "#67e8f9" : "#38bdf8"}
            transparent
            opacity={0.22 - i * 0.04}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({
  progressRef,
  mouseRef,
  phaseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  phaseRef: React.MutableRefObject<number>;
}) {
  useFrame((state) => {
    const p = progressRef.current;
    const phase = phaseRef.current;
    const cam = state.camera;

    // Cinematic dolly + orbit path scrubbed by scroll
    const angle = p * Math.PI * 1.35;
    const radius = 5.4 - p * 2.1;
    const targetX =
      Math.sin(angle) * (0.9 + phase * 0.15) + mouseRef.current.x * 0.35;
    const targetY =
      Math.cos(p * Math.PI) * 0.45 +
      Math.sin(phase) * 0.12 +
      mouseRef.current.y * 0.22;
    const targetZ = radius;

    cam.position.x += (targetX - cam.position.x) * 0.05;
    cam.position.y += (targetY - cam.position.y) * 0.05;
    cam.position.z += (targetZ - cam.position.z) * 0.05;
    cam.lookAt(0, Math.sin(p * Math.PI) * 0.2, -0.4);
  });

  return <PerspectiveCamera makeDefault position={[0, 0, 5.4]} fov={46} />;
}

function SceneContent({
  progressRef,
  mouseRef,
  phaseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  phaseRef: React.MutableRefObject<number>;
}) {
  return (
    <>
      <CameraRig
        progressRef={progressRef}
        mouseRef={mouseRef}
        phaseRef={phaseRef}
      />
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#07090d", 5, 13]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[4, 5, 3]} intensity={0.65} color="#e0f2fe" />
      <pointLight position={[-3, 2, 2]} intensity={1} color="#38bdf8" />
      <pointLight position={[3, -2, 1]} intensity={0.4} color="#67e8f9" />

      <SignalCore progressRef={progressRef} phaseRef={phaseRef} />
      <OrbitRings progressRef={progressRef} />
      <ParticleField
        progressRef={progressRef}
        mouseRef={mouseRef}
        phaseRef={phaseRef}
      />
    </>
  );
}

export function GsapSignalCanvas({
  progressRef,
  mouseRef,
  phaseRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  phaseRef: React.MutableRefObject<number>;
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
      <SceneContent
        progressRef={progressRef}
        mouseRef={mouseRef}
        phaseRef={phaseRef}
      />
    </Canvas>
  );
}
