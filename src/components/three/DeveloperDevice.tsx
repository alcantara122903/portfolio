"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Mesh } from "three";

interface DeveloperDeviceProps {
  orbitRef: React.MutableRefObject<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    dragging: boolean;
  }>;
}

const W = 0.76;
const H = 1.56;
const D = 0.085;
const R = 0.075;
const SCREEN_W = W - 0.08;
const SCREEN_H = H - 0.1;
const Z_FACE = D / 2 + 0.004;

const LANE_X = [-0.16, 0, 0.16] as const;

function PhoneGame() {
  const player = useRef<Group>(null);
  const obstacles = useRef<Group>(null);
  const scoreFlash = useRef<Mesh>(null);
  const lane = useRef(1);
  const nextSwitch = useRef(0);
  const speed = useRef(0.55);

  const obstacleSeeds = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        lane: i % 3,
        offset: i * 0.42,
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (t > nextSwitch.current) {
      lane.current = (lane.current + (Math.random() > 0.5 ? 1 : 2)) % 3;
      nextSwitch.current = t + 0.85 + Math.random() * 0.7;
    }

    if (player.current) {
      const targetX = LANE_X[lane.current];
      player.current.position.x +=
        (targetX - player.current.position.x) * 0.14;
      player.current.position.y = -0.38 + Math.sin(t * 8) * 0.012;
      player.current.rotation.z = Math.sin(t * 6) * 0.08;
    }

    speed.current = 0.55 + Math.sin(t * 0.2) * 0.08;

    if (obstacles.current) {
      obstacles.current.children.forEach((child, i) => {
        const seed = obstacleSeeds[i];
        const travel = ((t * speed.current + seed.offset) % 1.55) - 0.55;
        child.position.y = 0.55 - travel;
        child.position.x = LANE_X[seed.lane];
        child.visible = child.position.y < 0.62 && child.position.y > -0.55;
      });
    }

    if (scoreFlash.current) {
      const mat = scoreFlash.current.material as {
        opacity: number;
      };
      mat.opacity = 0.35 + Math.sin(t * 4) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0.002]}>
      {/* Game backdrop */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial color="#061018" />
      </mesh>

      {/* Top HUD bar */}
      <mesh position={[0, SCREEN_H / 2 - 0.09, 0]}>
        <planeGeometry args={[SCREEN_W - 0.04, 0.1]} />
        <meshBasicMaterial color="#0b1c2c" />
      </mesh>
      <mesh position={[-0.18, SCREEN_H / 2 - 0.09, 0.001]}>
        <planeGeometry args={[0.2, 0.035]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh ref={scoreFlash} position={[0.18, SCREEN_H / 2 - 0.09, 0.001]}>
        <planeGeometry args={[0.16, 0.028]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.45} />
      </mesh>

      {/* Lane guides */}
      {LANE_X.map((x) => (
        <mesh key={x} position={[x, -0.02, 0]}>
          <planeGeometry args={[0.01, 0.95]} />
          <meshBasicMaterial color="#164e63" transparent opacity={0.45} />
        </mesh>
      ))}

      {/* Horizon line */}
      <mesh position={[0, 0.52, 0]}>
        <planeGeometry args={[SCREEN_W - 0.1, 0.008]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>

      {/* Obstacles (incoming blocks) */}
      <group ref={obstacles}>
        {obstacleSeeds.map((seed, i) => (
          <mesh key={i} position={[LANE_X[seed.lane], 0.4, 0.001]}>
            <planeGeometry args={[0.12, 0.1]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#f472b6" : "#a78bfa"}
            />
          </mesh>
        ))}
      </group>

      {/* Player ship / gem */}
      <group ref={player} position={[0, -0.38, 0.002]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.09, 0.09]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, -0.05, -0.0005]}>
          <planeGeometry args={[0.035, 0.1]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Bottom controls hint */}
      <mesh position={[0, -SCREEN_H / 2 + 0.1, 0]}>
        <planeGeometry args={[SCREEN_W - 0.04, 0.1]} />
        <meshBasicMaterial color="#0b1c2c" />
      </mesh>
      {[-0.14, 0, 0.14].map((x) => (
        <mesh key={x} position={[x, -SCREEN_H / 2 + 0.1, 0.001]}>
          <circleGeometry args={[0.022, 12]} />
          <meshBasicMaterial
            color={x === 0 ? "#38bdf8" : "#164e63"}
          />
        </mesh>
      ))}
    </group>
  );
}

export function DeveloperDevice({ orbitRef }: DeveloperDeviceProps) {
  const groupRef = useRef<Group>(null);
  const floatY = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const orbit = orbitRef.current;
    const t = state.clock.elapsedTime;

    if (!orbit.dragging) {
      orbit.y += orbit.vy;
      orbit.x += orbit.vx;
      orbit.vy *= 0.94;
      orbit.vx *= 0.94;

      // Idle auto-spin so it keeps showing all sides
      if (Math.abs(orbit.vy) < 0.0008) {
        orbit.y += delta * 0.35;
      }
    }

    floatY.current = Math.sin(t * 1.1) * 0.04;

    groupRef.current.rotation.y = orbit.y;
    groupRef.current.rotation.x = orbit.x;
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.02;
    groupRef.current.position.y = floatY.current;
  });

  return (
    <group ref={groupRef} position={[0.05, 0, 0]}>
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

        <RoundedBox args={[W, H, D]} radius={R} smoothness={6} castShadow>
          <meshStandardMaterial
            color="#18181b"
            metalness={0.92}
            roughness={0.18}
            emissive="#0ea5e9"
            emissiveIntensity={0.025}
          />
        </RoundedBox>

        <RoundedBox
          args={[W - 0.012, H - 0.012, D - 0.01]}
          radius={R - 0.01}
          smoothness={6}
          position={[0, 0, 0.002]}
        >
          <meshStandardMaterial color="#27272a" metalness={0.95} roughness={0.12} />
        </RoundedBox>

        {[-0.22, -0.12].map((y) => (
          <mesh key={y} position={[-W / 2 - 0.008, y, 0]}>
            <boxGeometry args={[0.014, 0.1, 0.03]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}

        <mesh position={[W / 2 + 0.008, 0.18, 0]}>
          <boxGeometry args={[0.014, 0.14, 0.03]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.25} />
        </mesh>

        <RoundedBox
          args={[SCREEN_W + 0.02, SCREEN_H + 0.02, 0.014]}
          radius={R - 0.015}
          smoothness={6}
          position={[0, 0, Z_FACE]}
        >
          <meshStandardMaterial color="#030712" metalness={0.4} roughness={0.65} />
        </RoundedBox>

        <mesh position={[0, 0, Z_FACE + 0.008]}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          <meshPhysicalMaterial
            color="#061018"
            metalness={0.05}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.12}
            emissive="#0ea5e9"
            emissiveIntensity={0.04}
          />
        </mesh>

        <group position={[0, 0, Z_FACE + 0.012]}>
          <PhoneGame />
        </group>

        <mesh position={[0, H / 2 - 0.14, Z_FACE + 0.014]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.028, 0.1, 4, 8]} />
          <meshStandardMaterial color="#000000" metalness={0.6} roughness={0.3} />
        </mesh>

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
  );
}
