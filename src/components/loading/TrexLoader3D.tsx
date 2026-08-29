"use client";

import { useCallback, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import type { Group } from "three";

const GRAVITY = -0.018;
const JUMP_V = 0.42;
const RUN_SPEED = 0.12;

type Obstacle = { id: number; x: number; h: number };

function Ground({ groupRef }: { groupRef: React.RefObject<Group | null> }) {
  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 8]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[40, 0.06, 0.2]} />
        <meshStandardMaterial color="#27272a" />
      </mesh>
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={i} name={`dash-${i}`} position={[i * 1.6 - 12, 0.08, 0.35]}>
          <boxGeometry args={[0.6, 0.03, 0.03]} />
          <meshStandardMaterial color="#52525b" emissive="#71717a" emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function Cloud({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.35, 10, 10]} />
        <meshStandardMaterial color="#3f3f46" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.28, -0.05, 0]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#52525b" transparent opacity={0.45} />
      </mesh>
      <mesh position={[-0.25, -0.03, 0.05]}>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color="#52525b" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Cactus({ h }: { h: number }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.25, h, 0.25]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#059669"
          emissiveIntensity={0.18}
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[-0.22, -h * 0.15, 0]} castShadow>
        <boxGeometry args={[0.18, h * 0.35, 0.18]} />
        <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0.22, h * 0.05, 0]} castShadow>
        <boxGeometry args={[0.18, h * 0.28, 0.18]} />
        <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.08} />
      </mesh>
    </group>
  );
}

function Trex3D({ groupRef }: { groupRef: React.RefObject<Group | null> }) {
  return (
    <group ref={groupRef} position={[-1.8, 0.45, 0]} rotation={[0, 0.15, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.55, 0.45, 0.35]} />
        <meshStandardMaterial color="#71717a" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0.32, 0.52, 0]} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.22]} />
        <meshStandardMaterial color="#71717a" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.48, 0.62, 0]} castShadow>
        <boxGeometry args={[0.38, 0.22, 0.24]} />
        <meshStandardMaterial color="#71717a" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.62, 0.56, 0]} castShadow>
        <boxGeometry args={[0.18, 0.08, 0.16]} />
        <meshStandardMaterial color="#52525b" />
      </mesh>
      <mesh position={[0.58, 0.68, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#fafafa" emissive="#38bdf8" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[-0.42, 0.38, 0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[0.45, 0.1, 0.12]} />
        <meshStandardMaterial color="#71717a" />
      </mesh>
      <group name="front-leg" position={[0.12, 0.05, 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.35, 0.1]} />
          <meshStandardMaterial color="#52525b" />
        </mesh>
      </group>
      <group name="back-leg" position={[-0.12, 0.05, -0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.38, 0.12]} />
          <meshStandardMaterial color="#52525b" />
        </mesh>
      </group>
    </group>
  );
}

function RunnerScene({ active }: { active: boolean }) {
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
  });

  const tryJump = useCallback(() => {
    const s = stateRef.current;
    if (s.grounded) {
      s.vy = JUMP_V;
      s.grounded = false;
    }
  }, []);

  useFrame((state, delta) => {
    const s = stateRef.current;
    const dino = dinoRef.current;
    const ground = groundRef.current;
    const dt = Math.min(delta, 0.032);

    if (active) {
      s.legPhase += dt;
      s.groundOffset = (s.groundOffset - RUN_SPEED * 60 * dt) % 1.6;
      s.spawnTimer += dt;

      if (s.spawnTimer > 2 + Math.random() * 0.8) {
        s.spawnTimer = 0;
        obstaclesRef.current.push({
          id: s.nextId++,
          x: 9,
          h: 0.5 + Math.random() * 0.4,
        });
      }

      obstaclesRef.current = obstaclesRef.current
        .map((o) => ({ ...o, x: o.x - RUN_SPEED * 60 * dt }))
        .filter((o) => o.x > -10);

      for (const o of obstaclesRef.current) {
        if (o.x < 1.2 && o.x > -2.8 && s.grounded && s.dinoY < o.h - 0.05) {
          tryJump();
        }
      }

      s.vy += GRAVITY;
      s.dinoY += s.vy;
      if (s.dinoY <= 0) {
        s.dinoY = 0;
        s.vy = 0;
        s.grounded = true;
      }
    }

    if (dino) {
      const bob = active ? Math.sin(state.clock.elapsedTime * 16) * 0.01 : 0;
      dino.position.y = 0.45 + s.dinoY + bob;
      const legSwing = active ? Math.sin(s.legPhase * 14) * 0.6 : 0;
      const frontLeg = dino.getObjectByName("front-leg");
      const backLeg = dino.getObjectByName("back-leg");
      if (frontLeg) frontLeg.rotation.x = legSwing;
      if (backLeg) backLeg.rotation.x = -legSwing;
    }

    if (ground) {
      ground.children.forEach((child) => {
        if (child.name?.startsWith("dash-")) {
          const idx = Number(child.name.split("-")[1]);
          child.position.x = idx * 1.6 + s.groundOffset - 12;
        }
      });
    }

    const cam = state.camera;
    const targetY = 2.05 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    const targetZ = 5.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
    cam.position.y += (targetY - cam.position.y) * 0.06;
    cam.position.z += (targetZ - cam.position.z) * 0.06;
    cam.lookAt(0, 0.5, 0);

    syncFrame.current += 1;
    if (syncFrame.current % 4 === 0) {
      setObstacles([...obstaclesRef.current]);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.05, 5.1]} fov={42} />
      <color attach="background" args={["#09090b"]} />
      <fog attach="fog" args={["#09090b", 8, 18]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} castShadow color="#e4e4e7" />
      <pointLight position={[-2, 2, 2]} intensity={0.5} color="#38bdf8" />
      <pointLight position={[3, 1, -1]} intensity={0.25} color="#818cf8" />

      <Cloud position={[-3, 2.2, -2]} scale={1.2} />
      <Cloud position={[2, 2.5, -3]} scale={0.9} />
      <Cloud position={[5, 2, -2.5]} scale={1} />

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

export function TrexLoaderGame({ active }: { active: boolean }) {
  return (
    <div
      className="relative h-44 w-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_40px_-12px_rgba(56,189,248,0.2)] sm:h-52"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-sky-500/40 to-transparent" />
      <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
        <RunnerScene active={active} />
      </Canvas>
    </div>
  );
}
