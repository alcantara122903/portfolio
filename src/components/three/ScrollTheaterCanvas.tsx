"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function TheaterScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const core = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Group>(null);
  const links = useRef<THREE.Group>(null);

  const linkMeshes = useMemo(() => {
    const geos = [
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.6, 0.2, 0),
        new THREE.Vector3(0, 0.35, 0),
      ]),
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.35, 0),
        new THREE.Vector3(1.6, 0.1, 0),
      ]),
    ];
    return geos.map(
      (geo) =>
        new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({
            color: "#38bdf8",
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        ),
    );
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    const stage = p * 2; // 0..2 across three chapters

    if (core.current) {
      core.current.rotation.y = t * 0.4 + p * Math.PI;
      core.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      const scale = 0.7 + Math.min(1, stage) * 0.45 + Math.sin(t * 2) * 0.02;
      core.current.scale.setScalar(scale);
      core.current.position.x = THREE.MathUtils.lerp(-1.4, 1.4, p);
      core.current.position.y = Math.sin(p * Math.PI) * 0.25;
    }

    if (nodes.current) {
      nodes.current.children.forEach((child, i) => {
        const active = stage >= i * 0.85;
        const target = active ? 1 : 0.35;
        child.scale.lerp(
          new THREE.Vector3(target, target, target),
          0.08,
        );
        const mat = (child as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;
        if (mat?.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = active ? 0.9 : 0.2;
        }
      });
    }

    if (links.current) {
      linkMeshes.forEach((line, i) => {
        const mat = line.material as THREE.LineBasicMaterial;
        const on = stage > i + 0.35;
        mat.opacity = on ? 0.25 + Math.sin(t * 3 + i) * 0.1 : 0.05;
      });
    }

    const cam = state.camera;
    cam.position.x += (p * 0.6 - cam.position.x) * 0.06;
    cam.position.z += (5.2 - p * 0.8 - cam.position.z) * 0.06;
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.2, 5.2]} fov={42} />
      <color attach="background" args={["#07090d"]} />
      <fog attach="fog" args={["#07090d", 4, 11]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 3]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[-3, -1, 2]} intensity={0.5} color="#67e8f9" />

      <group ref={links}>
        {linkMeshes.map((line, i) => (
          <primitive key={i} object={line} />
        ))}
      </group>

      <group ref={nodes}>
        <mesh position={[-1.6, 0.2, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <icosahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial
            color="#7dd3fc"
            emissive="#38bdf8"
            emissiveIntensity={0.5}
            metalness={0.45}
            roughness={0.25}
            wireframe
          />
        </mesh>
        <mesh position={[1.6, 0.1, 0]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={0.6}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
      </group>

      <group ref={core} position={[-1.4, 0, 0.4]}>
        <mesh>
          <icosahedronGeometry args={[0.35, 1]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.85}
            metalness={0.55}
            roughness={0.18}
          />
        </mesh>
        <mesh scale={1.35}>
          <icosahedronGeometry args={[0.35, 0]} />
          <meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.35} />
        </mesh>
      </group>
    </>
  );
}

export function ScrollTheaterCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <TheaterScene progressRef={progressRef} />
    </Canvas>
  );
}
