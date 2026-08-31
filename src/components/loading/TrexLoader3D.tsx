"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import {
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type Points,
} from "three";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const GRAVITY = -0.02;
const JUMP_V = 0.46;
const RUN_SPEED = 0.135;

export type TrexPhase = "run" | "roar" | "idle";

type Obstacle = { id: number; x: number; h: number };

const ARMOR = "#6b7280";
const ARMOR_DARK = "#3f4654";
const ACCENT = "#38bdf8";
const ACCENT_SOFT = "#7dd3fc";
const PLATE = "#8b93a1";

function LabGround({ groupRef }: { groupRef: React.RefObject<Group | null> }) {
  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[48, 10]} />
        <meshStandardMaterial color="#0c1018" metalness={0.35} roughness={0.85} />
      </mesh>

      {/* Neon runway */}
      <mesh position={[0, 0.01, 0.55]}>
        <boxGeometry args={[48, 0.02, 0.04]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.01, -0.55]}>
        <boxGeometry args={[48, 0.02, 0.04]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} />
      </mesh>

      {Array.from({ length: 28 }).map((_, i) => (
        <mesh key={i} name={`dash-${i}`} position={[i * 1.5 - 14, 0.04, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.08]} />
          <meshStandardMaterial
            color="#94a3b8"
            emissive={ACCENT}
            emissiveIntensity={0.15}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Side rails */}
      <mesh position={[0, 0.08, 1.4]}>
        <boxGeometry args={[48, 0.06, 0.06]} />
        <meshStandardMaterial color={ARMOR_DARK} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.08, -1.4]}>
        <boxGeometry args={[48, 0.06, 0.06]} />
        <meshStandardMaterial color={ARMOR_DARK} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function DataSpire({ h }: { h: number }) {
  return (
    <group>
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.22, h, 0.22]} />
        <meshStandardMaterial
          color="#14532d"
          emissive="#22c55e"
          emissiveIntensity={0.25}
          metalness={0.3}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, h * 0.35, 0]}>
        <boxGeometry args={[0.28, 0.08, 0.28]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[-0.2, -h * 0.1, 0]} castShadow>
        <boxGeometry args={[0.14, h * 0.4, 0.14]} />
        <meshStandardMaterial color="#166534" emissive="#16a34a" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0.2, h * 0.05, 0]} castShadow>
        <boxGeometry args={[0.14, h * 0.32, 0.14]} />
        <meshStandardMaterial color="#166534" emissive="#16a34a" emissiveIntensity={0.12} />
      </mesh>
    </group>
  );
}

function FloatingSignal({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 1.4 + position[0]) * 0.15;
    ref.current.rotation.y = t * 0.8;
    ref.current.rotation.z = Math.sin(t) * 0.2;
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.14, 0]} />
      <meshStandardMaterial
        color={ACCENT_SOFT}
        emissive={ACCENT}
        emissiveIntensity={0.8}
        metalness={0.5}
        roughness={0.2}
        wireframe
      />
    </mesh>
  );
}

function RoarBurst({ active }: { active: boolean }) {
  const ringRef = useRef<Mesh>(null);
  const pointsRef = useRef<Points>(null);
  const tRef = useRef(0);

  const positions = useMemo(() => {
    const arr = new Float32Array(48 * 3);
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * 0.2;
      arr[i * 3 + 1] = 0.8;
      arr[i * 3 + 2] = Math.sin(a) * 0.2;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!active) {
      tRef.current = 0;
      if (ringRef.current) ringRef.current.scale.setScalar(0.01);
      return;
    }
    tRef.current += delta;
    const t = tRef.current;

    if (ringRef.current) {
      const s = 0.4 + t * 4.5;
      ringRef.current.scale.set(s, s, s);
      const mat = ringRef.current.material as MeshStandardMaterial;
      mat.opacity = Math.max(0, 0.85 - t * 0.7);
      mat.emissiveIntensity = Math.max(0, 1.4 - t);
    }

    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const r = 0.3 + t * 2.8;
        pos.setXYZ(i, Math.cos(a) * r, 0.7 + Math.sin(t * 8 + i) * 0.2, Math.sin(a) * r * 0.4);
      }
      pos.needsUpdate = true;
      const mat = pointsRef.current.material as { opacity: number };
      mat.opacity = Math.max(0, 1 - t * 0.85);
    }
  });

  return (
    <group position={[-0.6, 0.2, 0]} visible={active}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <torusGeometry args={[0.55, 0.035, 8, 48]} />
        <meshStandardMaterial
          color={ACCENT_SOFT}
          emissive={ACCENT}
          emissiveIntensity={1.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT_SOFT}
          size={0.06}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function SpeedSparks({ active }: { active: boolean }) {
  const ref = useRef<Points>(null);
  const count = 24;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = -2.2 - Math.random() * 1.5;
      arr[i * 3 + 1] = 0.3 + Math.random() * 1.1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || !active) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let x = pos.getX(i) - delta * 4.5;
      if (x < -4.5) {
        x = -1.6;
        pos.setY(i, 0.3 + Math.random() * 1.1);
        pos.setZ(i, (Math.random() - 0.5) * 0.8);
      }
      pos.setX(i, x);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} visible={active}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={ACCENT} size={0.045} transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

function MechTrex({
  groupRef,
  jawRef,
  eyeMatRef,
}: {
  groupRef: React.RefObject<Group | null>;
  jawRef: React.RefObject<Group | null>;
  eyeMatRef: React.RefObject<MeshStandardMaterial | null>;
}) {
  return (
    <group ref={groupRef} position={[-1.55, 0.5, 0]} rotation={[0, 0.2, 0]}>
      {/* Body core */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.72, 0.55, 0.42]} />
        <meshStandardMaterial color={ARMOR} metalness={0.65} roughness={0.28} />
      </mesh>
      {/* Chest plate */}
      <mesh position={[0.08, 0.4, 0.22]} castShadow>
        <boxGeometry args={[0.4, 0.35, 0.08]} />
        <meshStandardMaterial color={PLATE} metalness={0.7} roughness={0.22} />
      </mesh>
      {/* Glow core */}
      <mesh position={[0.05, 0.42, 0.27]}>
        <boxGeometry args={[0.18, 0.14, 0.03]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.1} />
      </mesh>
      {/* Shoulder armor */}
      <mesh position={[0.1, 0.62, 0.18]} castShadow>
        <boxGeometry args={[0.28, 0.12, 0.2]} />
        <meshStandardMaterial color={ARMOR_DARK} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Neck */}
      <mesh position={[0.38, 0.58, 0]} castShadow>
        <boxGeometry args={[0.22, 0.2, 0.2]} />
        <meshStandardMaterial color={ARMOR} metalness={0.55} roughness={0.32} />
      </mesh>

      {/* Head */}
      <mesh position={[0.62, 0.72, 0]} castShadow>
        <boxGeometry args={[0.42, 0.28, 0.3]} />
        <meshStandardMaterial color={ARMOR} metalness={0.6} roughness={0.28} />
      </mesh>
      {/* Crest */}
      <mesh position={[0.55, 0.92, 0]} castShadow>
        <boxGeometry args={[0.28, 0.12, 0.08]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.85} />
      </mesh>
      {/* Snout */}
      <mesh position={[0.88, 0.7, 0]} castShadow>
        <boxGeometry args={[0.28, 0.16, 0.22]} />
        <meshStandardMaterial color={PLATE} metalness={0.55} roughness={0.3} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.78, 0.8, 0.12]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          ref={eyeMatRef}
          color="#f0f9ff"
          emissive={ACCENT}
          emissiveIntensity={1.4}
        />
      </mesh>
      <mesh position={[0.78, 0.8, -0.12]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#f0f9ff" emissive={ACCENT} emissiveIntensity={1.4} />
      </mesh>

      {/* Jaw */}
      <group ref={jawRef} position={[0.82, 0.58, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.1, 0.2]} />
          <meshStandardMaterial color={ARMOR_DARK} metalness={0.5} roughness={0.35} />
        </mesh>
        {/* Teeth */}
        {[-0.06, 0, 0.06].map((z) => (
          <mesh key={z} position={[0.12, 0.07, z]}>
            <coneGeometry args={[0.025, 0.07, 4]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Tiny arms */}
      <group name="arm-r" position={[0.15, 0.28, 0.22]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.22, 0.08]} />
          <meshStandardMaterial color={ARMOR_DARK} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, -0.12, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.06]} />
          <meshStandardMaterial color={PLATE} />
        </mesh>
      </group>
      <group name="arm-l" position={[0.15, 0.28, -0.22]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.22, 0.08]} />
          <meshStandardMaterial color={ARMOR_DARK} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {/* Legs */}
      <group name="front-leg" position={[0.18, 0.02, 0.12]}>
        <mesh castShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[0.16, 0.42, 0.16]} />
          <meshStandardMaterial color={ARMOR_DARK} metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0.04, -0.2, 0]} castShadow>
          <boxGeometry args={[0.22, 0.08, 0.18]} />
          <meshStandardMaterial color={PLATE} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.04, -0.16, 0]}>
          <boxGeometry args={[0.1, 0.03, 0.1]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.6} />
        </mesh>
      </group>
      <group name="back-leg" position={[-0.15, 0.02, -0.1]}>
        <mesh castShadow position={[0, 0.06, 0]}>
          <boxGeometry args={[0.18, 0.46, 0.18]} />
          <meshStandardMaterial color={ARMOR_DARK} metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0.03, -0.22, 0]} castShadow>
          <boxGeometry args={[0.24, 0.09, 0.2]} />
          <meshStandardMaterial color={PLATE} metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Segmented tail */}
      <group name="tail" position={[-0.45, 0.38, 0]}>
        <mesh position={[-0.15, 0, 0]} castShadow rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.35, 0.16, 0.16]} />
          <meshStandardMaterial color={ARMOR} metalness={0.55} roughness={0.32} />
        </mesh>
        <mesh position={[-0.42, -0.05, 0]} castShadow rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.28, 0.12, 0.12]} />
          <meshStandardMaterial color={ARMOR} metalness={0.55} roughness={0.32} />
        </mesh>
        <mesh position={[-0.66, -0.12, 0]} castShadow rotation={[0, 0, 0.55]}>
          <boxGeometry args={[0.22, 0.08, 0.08]} />
          <meshStandardMaterial color={PLATE} metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[-0.78, -0.16, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.06]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.9} />
        </mesh>
      </group>

      {/* Circuit lines on body */}
      <mesh position={[-0.1, 0.55, 0.2]}>
        <boxGeometry args={[0.35, 0.02, 0.02]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0.2, 0.25, 0.2]}>
        <boxGeometry args={[0.02, 0.2, 0.02]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function RunnerScene({
  active,
  phase,
}: {
  active: boolean;
  phase: TrexPhase;
}) {
  const dinoRef = useRef<Group>(null);
  const jawRef = useRef<Group>(null);
  const eyeMatRef = useRef<MeshStandardMaterial>(null);
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
    roarT: 0,
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
    const jaw = jawRef.current;
    const dt = Math.min(delta, 0.032);
    const running = active && phase === "run";

    if (phase === "roar") s.roarT += dt;
    else s.roarT = 0;

    if (running) {
      s.legPhase += dt;
      s.groundOffset = (s.groundOffset - RUN_SPEED * 60 * dt) % 1.5;
      s.spawnTimer += dt;

      if (s.spawnTimer > 1.7 + Math.random() * 0.7) {
        s.spawnTimer = 0;
        obstaclesRef.current.push({
          id: s.nextId++,
          x: 9,
          h: 0.55 + Math.random() * 0.4,
        });
      }

      obstaclesRef.current = obstaclesRef.current
        .map((o) => ({ ...o, x: o.x - RUN_SPEED * 60 * dt }))
        .filter((o) => o.x > -10);

      for (const o of obstaclesRef.current) {
        if (o.x < 1.3 && o.x > -2.6 && s.grounded && s.dinoY < o.h - 0.05) {
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
      const tail = dino.getObjectByName("tail");
      const armR = dino.getObjectByName("arm-r");
      const armL = dino.getObjectByName("arm-l");

      if (phase === "roar") {
        const pulse = Math.sin(s.roarT * 20);
        dino.position.x = -0.85 + pulse * 0.05;
        dino.position.y = 0.62 + Math.abs(Math.sin(s.roarT * 12)) * 0.16;
        dino.rotation.z = pulse * 0.1;
        dino.rotation.x = -0.28 + Math.sin(s.roarT * 14) * 0.06;
        dino.rotation.y = 0.35 + pulse * 0.05;
        dino.scale.setScalar(1.12 + Math.abs(pulse) * 0.05);
        if (tail) tail.rotation.z = -0.25 + pulse * 0.2;
        if (armR) armR.rotation.x = -0.8 + pulse * 0.3;
        if (armL) armL.rotation.x = -0.8 - pulse * 0.3;
      } else {
        const bob = running ? Math.sin(state.clock.elapsedTime * 16) * 0.015 : 0;
        const lean = running ? 0.08 : 0;
        dino.position.x = -1.55;
        dino.position.y = 0.5 + s.dinoY + bob;
        dino.rotation.set(lean, 0.2, 0);
        dino.scale.setScalar(1);
        if (tail) {
          tail.rotation.z = running
            ? Math.sin(s.legPhase * 10) * 0.18
            : Math.sin(state.clock.elapsedTime * 2) * 0.06;
        }
        if (armR) armR.rotation.x = running ? Math.sin(s.legPhase * 12) * 0.35 : 0.15;
        if (armL) armL.rotation.x = running ? -Math.sin(s.legPhase * 12) * 0.35 : 0.15;
      }

      const legSwing = running ? Math.sin(s.legPhase * 14) * 0.7 : 0;
      const frontLeg = dino.getObjectByName("front-leg");
      const backLeg = dino.getObjectByName("back-leg");
      if (frontLeg) frontLeg.rotation.x = phase === "roar" ? -0.15 : legSwing;
      if (backLeg) backLeg.rotation.x = phase === "roar" ? 0.1 : -legSwing;
    }

    if (jaw) {
      if (phase === "roar") {
        jaw.rotation.z = 0.15 + Math.abs(Math.sin(s.roarT * 18)) * 0.55;
        jaw.position.y = 0.52;
      } else {
        jaw.rotation.z = running ? Math.abs(Math.sin(s.legPhase * 8)) * 0.08 : 0.05;
        jaw.position.y = 0.58;
      }
    }

    if (eyeMatRef.current) {
      const pulse =
        phase === "roar"
          ? 2.4 + Math.sin(s.roarT * 25) * 0.8
          : 1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
      eyeMatRef.current.emissiveIntensity = pulse;
      eyeMatRef.current.emissive.set(phase === "roar" ? ACCENT_SOFT : ACCENT);
    }

    if (ground && running) {
      ground.children.forEach((child) => {
        if (child.name?.startsWith("dash-")) {
          const idx = Number(child.name.split("-")[1]);
          child.position.x = idx * 1.5 + s.groundOffset - 14;
        }
      });
    }

    const cam = state.camera;
    if (phase === "roar") {
      const shake = Math.sin(s.roarT * 48) * 0.07;
      cam.position.set(shake, 2.15 + Math.abs(shake) * 0.5, 4.35);
    } else {
      const targetY = 2.0 + Math.sin(state.clock.elapsedTime * 0.7) * 0.05;
      const targetZ = 5.0 + Math.sin(state.clock.elapsedTime * 0.45) * 0.08;
      cam.position.x += (0 - cam.position.x) * 0.1;
      cam.position.y += (targetY - cam.position.y) * 0.07;
      cam.position.z += (targetZ - cam.position.z) * 0.07;
    }
    cam.lookAt(phase === "roar" ? -0.4 : -0.2, 0.55, 0);

    syncFrame.current += 1;
    if (syncFrame.current % 4 === 0) {
      setObstacles([...obstaclesRef.current]);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.0, 5.0]} fov={40} />
      <color attach="background" args={["#070b12"]} />
      <fog attach="fog" args={["#070b12", 7, 16]} />

      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#38bdf8", "#09090b", 0.35]} />
      <directionalLight position={[5, 7, 4]} intensity={1.25} castShadow color="#f8fafc" />
      <pointLight position={[-2.5, 2.2, 2]} intensity={0.7} color={ACCENT} />
      <pointLight
        position={[2.2, 1.4, 1]}
        intensity={phase === "roar" ? 1.8 : 0.35}
        color={phase === "roar" ? ACCENT_SOFT : "#64748b"}
      />
      <spotLight
        position={[0, 4, 2]}
        angle={0.45}
        penumbra={0.7}
        intensity={phase === "roar" ? 1.4 : 0.5}
        color={ACCENT_SOFT}
      />

      <FloatingSignal position={[-3.2, 1.8, -1.5]} />
      <FloatingSignal position={[3.4, 2.1, -2]} />
      <FloatingSignal position={[2.2, 1.4, -1.2]} />

      <LabGround groupRef={groundRef} />
      <MechTrex groupRef={dinoRef} jawRef={jawRef} eyeMatRef={eyeMatRef} />
      <SpeedSparks active={active && phase === "run"} />
      <RoarBurst active={phase === "roar"} />

      {obstacles.map((o) => (
        <group key={o.id} position={[o.x, o.h / 2, 0]}>
          <DataSpire h={o.h} />
        </group>
      ))}
    </>
  );
}

export function TrexLoaderGame({
  active,
  phase = "run",
}: {
  active: boolean;
  phase?: TrexPhase;
}) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div
      className="relative h-48 w-full min-w-0 overflow-hidden rounded-2xl border border-sky-500/20 bg-[#070b12] shadow-[inset_0_1px_0_rgba(56,189,248,0.08),0_0_50px_-10px_rgba(56,189,248,0.35)] sm:h-56 md:h-64"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-transparent via-sky-400/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-t from-[#070b12] to-transparent" />
      <Canvas
        shadows
        dpr={isMobile ? [1, 1.35] : [1, 1.85]}
        gl={{ antialias: true, alpha: false }}
        className="h-full! w-full!"
      >
        <RunnerScene active={active} phase={phase} />
      </Canvas>
    </div>
  );
}
