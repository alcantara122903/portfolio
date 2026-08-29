"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import type { Group } from "three";

interface DeveloperDeviceProps {
  mouse: { x: number; y: number };
}

const W = 0.76;
const H = 1.56;
const D = 0.085;
const R = 0.075;
const SCREEN_W = W - 0.08;
const SCREEN_H = H - 0.1;
const Z_FACE = D / 2 + 0.004;

function ScreenUI() {
  return (
    <group position={[0, 0, 0.002]}>
      {/* Status / header bar */}
      <mesh position={[0, SCREEN_H / 2 - 0.1, 0]}>
        <planeGeometry args={[SCREEN_W - 0.04, 0.09]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#38bdf8"
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Hero card */}
      <mesh position={[0, 0.28, 0]}>
        <planeGeometry args={[SCREEN_W - 0.06, 0.22]} />
        <meshStandardMaterial color="#132337" emissive="#0ea5e9" emissiveIntensity={0.06} />
      </mesh>

      {/* Content cards row */}
      {[-0.14, 0.08, 0.3].map((y, i) => (
        <mesh key={y} position={[0, y, 0]}>
          <planeGeometry args={[SCREEN_W - 0.08, 0.11]} />
          <meshStandardMaterial
            color={i === 0 ? "#1a3352" : "#141c28"}
            emissive={i === 0 ? "#38bdf8" : "#000000"}
            emissiveIntensity={i === 0 ? 0.12 : 0}
          />
        </mesh>
      ))}

      {/* QR scan zone */}
      <mesh position={[0, -0.12, 0]}>
        <planeGeometry args={[0.34, 0.34]} />
        <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0, -0.12, 0.001]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.22, 0.025]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.12, 0.001]} rotation={[0, 0, -Math.PI / 4]}>
        <planeGeometry args={[0.22, 0.025]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
      </mesh>

      {/* Bottom nav */}
      <mesh position={[0, -SCREEN_H / 2 + 0.1, 0]}>
        <planeGeometry args={[SCREEN_W - 0.04, 0.08]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

export function DeveloperDevice({ mouse }: DeveloperDeviceProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y =
      -0.42 + mouse.x * 0.38 + Math.sin(t * 0.28) * 0.06;
    groupRef.current.rotation.x =
      mouse.y * 0.22 + Math.cos(t * 0.22) * 0.035;
    groupRef.current.rotation.z = -0.06 + Math.sin(t * 0.18) * 0.015;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.45}>
      <group ref={groupRef} position={[0.05, 0, 0]}>
        {/* Outer glow shell */}
        <RoundedBox
          args={[W + 0.018, H + 0.018, D + 0.01]}
          radius={R + 0.01}
          smoothness={6}
          position={[0, 0, -0.002]}
        >
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={0.08}
            transparent
            opacity={0.12}
          />
        </RoundedBox>

        {/* Phone chassis */}
        <RoundedBox args={[W, H, D]} radius={R} smoothness={6} castShadow>
          <meshStandardMaterial
            color="#18181b"
            metalness={0.92}
            roughness={0.18}
            emissive="#0ea5e9"
            emissiveIntensity={0.025}
          />
        </RoundedBox>

        {/* Side frame highlight */}
        <RoundedBox
          args={[W - 0.012, H - 0.012, D - 0.01]}
          radius={R - 0.01}
          smoothness={6}
          position={[0, 0, 0.002]}
        >
          <meshStandardMaterial color="#27272a" metalness={0.95} roughness={0.12} />
        </RoundedBox>

        {/* Volume buttons */}
        {[-0.22, -0.12].map((y) => (
          <mesh key={y} position={[-W / 2 - 0.008, y, 0]}>
            <boxGeometry args={[0.014, 0.1, 0.03]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}

        {/* Power button */}
        <mesh position={[W / 2 + 0.008, 0.18, 0]}>
          <boxGeometry args={[0.014, 0.14, 0.03]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Screen recess / bezel */}
        <RoundedBox
          args={[SCREEN_W + 0.02, SCREEN_H + 0.02, 0.014]}
          radius={R - 0.015}
          smoothness={6}
          position={[0, 0, Z_FACE]}
        >
          <meshStandardMaterial color="#030712" metalness={0.4} roughness={0.65} />
        </RoundedBox>

        {/* Glass screen */}
        <mesh position={[0, 0, Z_FACE + 0.008]}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          <meshPhysicalMaterial
            color="#0c1220"
            metalness={0.05}
            roughness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={0.9}
            emissive="#0ea5e9"
            emissiveIntensity={0.02}
          />
        </mesh>

        {/* On-screen UI */}
        <group position={[0, 0, Z_FACE + 0.012]}>
          <ScreenUI />
        </group>

        {/* Dynamic island */}
        <mesh position={[0, H / 2 - 0.14, Z_FACE + 0.014]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.028, 0.1, 4, 8]} />
          <meshStandardMaterial color="#000000" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Front camera lens */}
        <mesh position={[0.04, H / 2 - 0.14, Z_FACE + 0.018]}>
          <circleGeometry args={[0.012, 16]} />
          <meshStandardMaterial
            color="#1e3a5f"
            emissive="#38bdf8"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}
