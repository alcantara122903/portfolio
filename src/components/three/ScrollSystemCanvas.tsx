"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const ACCENT = "#5eb8e8";
const INK = "#f2f2f0";

/** Nodes along the vertical system the camera travels through. */
const NODES: Array<{
  pos: [number, number, number];
  label: string;
  at: number;
}> = [
  { pos: [0, 3.2, 0], label: "signal", at: 0 },
  { pos: [-0.9, 1.8, 0.4], label: "interface", at: 0.15 },
  { pos: [0.85, 0.6, -0.3], label: "app", at: 0.32 },
  { pos: [-0.55, -0.7, 0.5], label: "api", at: 0.5 },
  { pos: [0.7, -2.0, -0.2], label: "data", at: 0.68 },
  { pos: [0, -3.4, 0.15], label: "ship", at: 0.88 },
];

function SystemGrid() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.z =
      ((state.clock.elapsedTime * 0.15) % 2) - 1;
  });

  return (
    <group ref={ref} rotation={[-Math.PI / 2.35, 0, 0]} position={[0, -1.2, 0]}>
      <gridHelper
        args={[24, 24, ACCENT, "#1a1c20"]}
        position={[0, 0, 0]}
      />
      <gridHelper
        args={[24, 24, ACCENT, "#1a1c20"]}
        position={[0, 0, -8]}
      />
    </group>
  );
}

function SystemNodes({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const mats = useMemo(
    () =>
      NODES.map(
        () =>
          new THREE.MeshStandardMaterial({
            color: ACCENT,
            emissive: ACCENT,
            emissiveIntensity: 0.15,
            metalness: 0.55,
            roughness: 0.35,
            transparent: true,
            opacity: 0.85,
          }),
      ),
    [],
  );

  useFrame(() => {
    const p = progressRef.current;
    if (!group.current) return;

    group.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return;
      const node = NODES[i];
      const active = p >= node.at - 0.04;
      const peak = 1 - Math.min(1, Math.abs(p - node.at) * 3.5);
      const scale = active ? 0.55 + peak * 0.55 : 0.28;
      child.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      mats[i].emissiveIntensity = active ? 0.2 + peak * 0.55 : 0.08;
      mats[i].opacity = active ? 0.9 : 0.35;
    });
  });

  return (
    <group ref={group}>
      {NODES.map((node, i) => (
        <mesh key={node.label} position={node.pos} material={mats[i]}>
          <octahedronGeometry args={[0.22, 0]} />
        </mesh>
      ))}
    </group>
  );
}

function SystemLinks({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const lines = useMemo(() => {
    return NODES.slice(0, -1).map((node, i) => {
      const next = NODES[i + 1];
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...node.pos),
        new THREE.Vector3(...next.pos),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
      });
      return new THREE.Line(geo, mat);
    });
  }, []);

  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = progressRef.current;
    lines.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial;
      const on = p >= NODES[i + 1].at - 0.08;
      mat.opacity = on ? 0.35 : 0.08;
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

function DataPulse({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      NODES.map((n) => new THREE.Vector3(...n.pos)),
    );
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    const p = Math.max(0.001, Math.min(0.999, progressRef.current));
    const pt = curve.getPointAt(p);
    mesh.current.position.copy(pt);
    mesh.current.scale.setScalar(0.7 + Math.sin(p * Math.PI) * 0.4);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshBasicMaterial color={INK} transparent opacity={0.9} />
    </mesh>
  );
}

function ScrollCamera({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  useFrame((state) => {
    const p = progressRef.current;
    const cam = state.camera;
    const targetY = THREE.MathUtils.lerp(2.4, -2.8, p);
    const targetZ = THREE.MathUtils.lerp(7.2, 5.4, p);
    const targetX = Math.sin(p * Math.PI * 2) * 0.55;

    cam.position.x += (targetX - cam.position.x) * 0.06;
    cam.position.y += (targetY - cam.position.y) * 0.06;
    cam.position.z += (targetZ - cam.position.z) * 0.06;
    cam.lookAt(0, targetY - 0.4, 0);
  });

  return <PerspectiveCamera makeDefault position={[0, 2.4, 7.2]} fov={42} />;
}

function Scene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const world = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!world.current) return;
    const p = progressRef.current;
    // Slow ambient spin — scroll does the storytelling
    world.current.rotation.y =
      state.clock.elapsedTime * 0.03 + p * 0.45;
  });

  return (
    <>
      <ScrollCamera progressRef={progressRef} />
      <color attach="background" args={["#0a0b0d"]} />
      <fog attach="fog" args={["#0a0b0d", 6, 16]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={0.7} color="#f0f9ff" />
      <pointLight position={[0, 0, 3]} intensity={0.45} color={ACCENT} />

      <group ref={world}>
        <SystemGrid />
        <SystemLinks progressRef={progressRef} />
        <SystemNodes progressRef={progressRef} />
        <DataPulse progressRef={progressRef} />
      </group>
    </>
  );
}

export function ScrollSystemCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
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
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
