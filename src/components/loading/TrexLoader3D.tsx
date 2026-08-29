"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import type { Group } from "three";

const GRAVITY = -0.022;
const JUMP_V = 0.38;
const RUN_SPEED = 0.14;

type Obstacle = { id: number; x: number; h: number };

function Ground({ groupRef }: { groupRef: React.RefObject<Group | null> }) {
  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial color="#f7f7f7" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[40, 0.06, 0.2]} />
        <meshStandardMaterial color="#d4d4d4" />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} name={`dash-${i}`} position={[i * 2 - 10, 0.08, 0.35]}>
          <boxGeometry args={[0.8, 0.04, 0.04]} />
          <meshStandardMaterial color="#a3a3a3" />
        </mesh>
      ))}
    </group>
  );
}

function Cactus({ h }: { h: number }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.25, h, 0.25]} />
        <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[-0.22, -h * 0.15, 0]} castShadow>
        <boxGeometry args={[0.18, h * 0.35, 0.18]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <mesh position={[0.22, h * 0.05, 0]} castShadow>
        <boxGeometry args={[0.18, h * 0.28, 0.18]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
    </group>
  );
}

function Trex3D({ groupRef }: { groupRef: React.RefObject<Group | null> }) {
  return (
    <group ref={groupRef} position={[-1.8, 0.45, 0]} rotation={[0, 0.15, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.55, 0.45, 0.35]} />
        <meshStandardMaterial color="#52525b" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0.32, 0.52, 0]} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.22]} />
        <meshStandardMaterial color="#52525b" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0.48, 0.62, 0]} castShadow>
        <boxGeometry args={[0.38, 0.22, 0.24]} />
        <meshStandardMaterial color="#52525b" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.62, 0.56, 0]} castShadow>
        <boxGeometry args={[0.18, 0.08, 0.16]} />
        <meshStandardMaterial color="#3f3f46" />
      </mesh>
      <mesh position={[0.58, 0.68, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#fafafa" emissive="#38bdf8" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.42, 0.38, 0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[0.45, 0.1, 0.12]} />
        <meshStandardMaterial color="#52525b" />
      </mesh>
      <group name="front-leg" position={[0.12, 0.05, 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.35, 0.1]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
      </group>
      <group name="back-leg" position={[-0.12, 0.05, -0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.38, 0.12]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
      </group>
      <mesh position={[0.28, 0.28, 0.12]} rotation={[0.6, 0, 0.4]} castShadow>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshStandardMaterial color="#52525b" />
      </mesh>
    </group>
  );
}

function RunnerScene({
  active,
  jumpRef,
}: {
  active: boolean;
  jumpRef: React.MutableRefObject<(() => void) | null>;
}) {
  const dinoRef = useRef<Group>(null);
  const groundRef = useRef<Group>(null);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const syncFrame = useRef(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const stateRef = useRef({
    dinoY: 0,
    vy: 0,
    grounded: true,
    groundOffset: 0,
    spawnTimer: 0,
    nextId: 0,
    legPhase: 0,
    alive: true,
  });

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s.alive) {
      s.dinoY = 0;
      s.vy = 0;
      s.grounded = true;
      obstaclesRef.current = [];
      setObstacles([]);
      s.spawnTimer = 0;
      s.alive = true;
      return;
    }
    if (s.grounded) {
      s.vy = JUMP_V;
      s.grounded = false;
    }
  }, []);

  useEffect(() => {
    jumpRef.current = jump;
    return () => {
      jumpRef.current = null;
    };
  }, [jump, jumpRef]);

  useFrame((state, delta) => {
    const s = stateRef.current;
    const dino = dinoRef.current;
    const ground = groundRef.current;

    if (active && s.alive) {
      s.legPhase += delta;
      s.groundOffset = (s.groundOffset - RUN_SPEED * 60 * delta) % 2;
      s.spawnTimer += delta;

      if (s.spawnTimer > 1.6 + Math.random() * 0.8) {
        s.spawnTimer = 0;
        obstaclesRef.current.push({
          id: s.nextId++,
          x: 9,
          h: 0.55 + Math.random() * 0.35,
        });
      }

      s.vy += GRAVITY;
      s.dinoY += s.vy;
      if (s.dinoY <= 0) {
        s.dinoY = 0;
        s.vy = 0;
        s.grounded = true;
      }

      obstaclesRef.current = obstaclesRef.current
        .map((o) => ({ ...o, x: o.x - RUN_SPEED * 60 * delta }))
        .filter((o) => o.x > -10);

      for (const o of obstaclesRef.current) {
        if (o.x > -2.1 && o.x < -1.3 && s.dinoY < o.h - 0.15) {
          s.alive = false;
        }
      }
    }

    if (dino) {
      dino.position.y = 0.45 + s.dinoY + Math.sin(state.clock.elapsedTime * 14) * 0.015;
      const legSwing = active && s.alive ? Math.sin(s.legPhase * 12) * 0.55 : 0;
      const frontLeg = dino.getObjectByName("front-leg");
      const backLeg = dino.getObjectByName("back-leg");
      if (frontLeg) frontLeg.rotation.x = legSwing;
      if (backLeg) backLeg.rotation.x = -legSwing;
    }

    if (ground) {
      ground.children.forEach((child) => {
        if (child.name?.startsWith("dash-")) {
          const idx = Number(child.name.split("-")[1]);
          child.position.x = idx * 2 + s.groundOffset - 10;
        }
      });
    }

    syncFrame.current += 1;
    if (syncFrame.current % 3 === 0) {
      setObstacles([...obstaclesRef.current]);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.2, 5.5]} fov={42} />
      <color attach="background" args={["#f7f7f7"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#38bdf8" />

      <Ground groupRef={groundRef} />
      <Trex3D groupRef={dinoRef} />

      {obstacles.map((o) => (
        <group key={o.id} position={[o.x, o.h / 2, 0]}>
          <Cactus h={o.h} />
        </group>
      ))}
    </>
  );
}

interface TrexLoaderGameProps {
  active: boolean;
  jumpRef: React.MutableRefObject<(() => void) | null>;
}

export function TrexLoaderGame({ active, jumpRef }: TrexLoaderGameProps) {
  const handlePointerDown = () => jumpRef.current?.();

  return (
    <div
      className="relative h-48 w-full overflow-hidden rounded-xl border border-zinc-300/80 sm:h-56"
      onPointerDown={handlePointerDown}
      role="img"
      aria-label="3D T-Rex loading game. Press space or tap to jump."
    >
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
        <RunnerScene active={active} jumpRef={jumpRef} />
      </Canvas>
    </div>
  );
}
