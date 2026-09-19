"use client";

import { useEffect, useMemo, useRef } from "react";
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
  gameHudRef: React.MutableRefObject<GameHud>;
  inputRef: React.MutableRefObject<GameInput>;
  reducedMotion?: boolean;
}

export type GameHud = {
  score: number;
  lives: number;
  combo: number;
  playing: boolean;
  status: "demo" | "play" | "hit" | "over";
};

export type GameInput = {
  laneDelta: number;
  start: boolean;
  focused: boolean;
};

const W = 0.76;
const H = 1.56;
const D = 0.085;
const R = 0.075;
const SCREEN_W = W - 0.08;
const SCREEN_H = H - 0.1;
const Z_FACE = D / 2 + 0.004;

const LANE_X = [-0.16, 0, 0.16] as const;
const PLAYER_Y = -0.38;
const HIT_Y = -0.36;
const HIT_WINDOW = 0.09;

type ObstacleState = {
  lane: number;
  y: number;
  scored: boolean;
  active: boolean;
};

function PhoneGame({
  gameHudRef,
  inputRef,
  reducedMotion,
}: {
  gameHudRef: React.MutableRefObject<GameHud>;
  inputRef: React.MutableRefObject<GameInput>;
  reducedMotion?: boolean;
}) {
  const player = useRef<Group>(null);
  const obstacles = useRef<Group>(null);
  const scoreBar = useRef<Mesh>(null);
  const hitFlash = useRef<Mesh>(null);
  const laneDots = useRef<(Mesh | null)[]>([]);

  const lane = useRef(1);
  const playing = useRef(false);
  const demoLaneTimer = useRef(0);
  const spawnTimer = useRef(0);
  const speed = useRef(0.72);
  const score = useRef(0);
  const lives = useRef(3);
  const combo = useRef(0);
  const hitFlashT = useRef(0);
  const status = useRef<GameHud["status"]>("demo");

  const pool = useRef<ObstacleState[]>(
    Array.from({ length: 8 }, () => ({
      lane: 1,
      y: 0.7,
      scored: false,
      active: false,
    })),
  );

  const obstacleSeeds = useMemo(
    () => Array.from({ length: 8 }, (_, i) => i),
    [],
  );

  const syncHud = () => {
    gameHudRef.current = {
      score: score.current,
      lives: lives.current,
      combo: combo.current,
      playing: playing.current,
      status: status.current,
    };
  };

  const spawn = (forcedLane?: number) => {
    const slot = pool.current.find((o) => !o.active);
    if (!slot) return;
    let nextLane =
      forcedLane ?? Math.floor(Math.random() * LANE_X.length);
    // Prefer not stacking same lane as last active
    const last = pool.current.find((o) => o.active && o.y > 0.3);
    if (last && nextLane === last.lane && Math.random() > 0.35) {
      nextLane = (nextLane + 1 + Math.floor(Math.random() * 2)) % 3;
    }
    slot.lane = nextLane;
    slot.y = 0.58;
    slot.scored = false;
    slot.active = true;
  };

  const resetRun = () => {
    score.current = 0;
    lives.current = 3;
    combo.current = 0;
    speed.current = 0.72;
    lane.current = 1;
    pool.current.forEach((o) => {
      o.active = false;
      o.scored = false;
    });
    spawnTimer.current = 0.35;
    status.current = "play";
    playing.current = true;
    syncHud();
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Start from input
    if (inputRef.current.start) {
      inputRef.current.start = false;
      if (status.current === "over" || !playing.current) {
        resetRun();
      } else if (status.current === "demo") {
        resetRun();
      }
    }

    // Lane input
    if (inputRef.current.laneDelta !== 0) {
      if (!playing.current && status.current === "demo") {
        resetRun();
      }
      if (status.current !== "over") {
        lane.current = Math.max(
          0,
          Math.min(2, lane.current + inputRef.current.laneDelta),
        );
      }
      inputRef.current.laneDelta = 0;
    }

    // Demo auto-play when idle
    if (!playing.current && status.current === "demo") {
      demoLaneTimer.current -= dt;
      if (demoLaneTimer.current <= 0) {
        lane.current = (lane.current + (Math.random() > 0.5 ? 1 : 2)) % 3;
        demoLaneTimer.current = 0.9 + Math.random() * 0.6;
      }
      spawnTimer.current -= dt;
      if (spawnTimer.current <= 0) {
        spawn();
        spawnTimer.current = 0.55;
      }
      speed.current = 0.55;
    }

    // Active run
    if (playing.current && status.current !== "over") {
      spawnTimer.current -= dt;
      const interval = Math.max(0.32, 0.62 - score.current * 0.008);
      if (spawnTimer.current <= 0) {
        spawn();
        spawnTimer.current = interval;
      }
      speed.current = Math.min(1.45, 0.72 + score.current * 0.012);
    }

    // Move obstacles + collisions
    pool.current.forEach((o) => {
      if (!o.active) return;
      o.y -= speed.current * dt;

      if (
        playing.current &&
        !o.scored &&
        Math.abs(o.y - HIT_Y) < HIT_WINDOW
      ) {
        if (o.lane === lane.current) {
          // Collision — miss
          o.scored = true;
          o.active = false;
          lives.current = Math.max(0, lives.current - 1);
          combo.current = 0;
          hitFlashT.current = 0.35;
          status.current = lives.current === 0 ? "over" : "hit";
          if (lives.current === 0) {
            playing.current = false;
          }
          syncHud();
        }
      }

      if (
        playing.current &&
        !o.scored &&
        o.y < HIT_Y - HIT_WINDOW
      ) {
        // Dodged
        o.scored = true;
        score.current += 1;
        combo.current += 1;
        if (combo.current > 0 && combo.current % 5 === 0) {
          score.current += 2;
        }
        status.current = "play";
        syncHud();
      }

      if (o.y < -0.62) {
        o.active = false;
      }
    });

    // Demo: no lives/score pressure — recycle quietly
    if (!playing.current && status.current === "demo") {
      pool.current.forEach((o) => {
        if (o.active && o.y < -0.55) o.active = false;
      });
    }

    // Clear brief "hit" status
    if (status.current === "hit") {
      hitFlashT.current -= dt;
      if (hitFlashT.current <= 0) status.current = "play";
    }

    // Visuals
    if (player.current) {
      const targetX = LANE_X[lane.current];
      player.current.position.x +=
        (targetX - player.current.position.x) * 0.22;
      player.current.position.y =
        PLAYER_Y + Math.sin(t * 8) * (reducedMotion ? 0 : 0.01);
      player.current.rotation.z = Math.sin(t * 6) * (reducedMotion ? 0 : 0.06);
    }

    if (obstacles.current) {
      obstacles.current.children.forEach((child, i) => {
        const o = pool.current[i];
        if (!o) return;
        child.visible = o.active;
        if (o.active) {
          child.position.y = o.y;
          child.position.x = LANE_X[o.lane];
        }
      });
    }

    laneDots.current.forEach((dot, i) => {
      if (!dot) return;
      const mat = Array.isArray(dot.material) ? dot.material[0] : dot.material;
      if (mat && "color" in mat) {
        (mat as { color: { set: (c: string) => void } }).color.set(
          i === lane.current ? "#38bdf8" : "#164e63",
        );
      }
    });

    if (scoreBar.current) {
      const mat = scoreBar.current.material as { opacity: number };
      const pulse =
        status.current === "hit"
          ? 0.9
          : 0.35 + Math.min(combo.current, 10) * 0.04;
      mat.opacity = pulse;
    }

    if (hitFlash.current) {
      const mat = hitFlash.current.material as { opacity: number };
      mat.opacity = Math.max(0, hitFlashT.current * 1.8);
    }

    syncHud();
  });

  // Seed a few obstacles for first paint
  useEffect(() => {
    spawn(0);
    spawn(2);
    syncHud();
  }, []);

  return (
    <group position={[0, 0, 0.002]}>
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial color="#061018" />
      </mesh>

      <mesh position={[0, SCREEN_H / 2 - 0.09, 0]}>
        <planeGeometry args={[SCREEN_W - 0.04, 0.1]} />
        <meshBasicMaterial color="#0b1c2c" />
      </mesh>
      <mesh position={[-0.18, SCREEN_H / 2 - 0.09, 0.001]}>
        <planeGeometry args={[0.2, 0.035]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh ref={scoreBar} position={[0.18, SCREEN_H / 2 - 0.09, 0.001]}>
        <planeGeometry args={[0.16, 0.028]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.45} />
      </mesh>

      {/* Hit flash overlay */}
      <mesh ref={hitFlash} position={[0, 0, 0.003]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={0} />
      </mesh>

      {LANE_X.map((x) => (
        <mesh key={x} position={[x, -0.02, 0]}>
          <planeGeometry args={[0.01, 0.95]} />
          <meshBasicMaterial color="#164e63" transparent opacity={0.45} />
        </mesh>
      ))}

      <mesh position={[0, 0.52, 0]}>
        <planeGeometry args={[SCREEN_W - 0.1, 0.008]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>

      {/* Catch line */}
      <mesh position={[0, HIT_Y, 0.001]}>
        <planeGeometry args={[SCREEN_W - 0.12, 0.006]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>

      <group ref={obstacles}>
        {obstacleSeeds.map((i) => (
          <mesh key={i} position={[0, 0.7, 0.001]} visible={false}>
            <planeGeometry args={[0.12, 0.1]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#f472b6" : "#a78bfa"} />
          </mesh>
        ))}
      </group>

      <group ref={player} position={[0, PLAYER_Y, 0.002]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.09, 0.09]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, -0.05, -0.0005]}>
          <planeGeometry args={[0.035, 0.1]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.35} />
        </mesh>
      </group>

      <mesh position={[0, -SCREEN_H / 2 + 0.1, 0]}>
        <planeGeometry args={[SCREEN_W - 0.04, 0.1]} />
        <meshBasicMaterial color="#0b1c2c" />
      </mesh>
      {[-0.14, 0, 0.14].map((x, i) => (
        <mesh
          key={x}
          ref={(el) => {
            laneDots.current[i] = el;
          }}
          position={[x, -SCREEN_H / 2 + 0.1, 0.001]}
        >
          <circleGeometry args={[0.022, 12]} />
          <meshBasicMaterial color={i === 1 ? "#38bdf8" : "#164e63"} />
        </mesh>
      ))}
    </group>
  );
}

export function DeveloperDevice({
  orbitRef,
  gameHudRef,
  inputRef,
  reducedMotion,
}: DeveloperDeviceProps) {
  const groupRef = useRef<Group>(null);
  const floatY = useRef(0);
  const locked = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const orbit = orbitRef.current;
    const t = state.clock.elapsedTime;
    const playing =
      gameHudRef.current.playing && gameHudRef.current.status !== "over";

    // Lock phone face-on while playing so the screen is readable
    if (playing) {
      locked.current = true;
      orbit.dragging = false;
      orbit.vx = 0;
      orbit.vy = 0;
      // Ease toward a slight front-facing pose
      orbit.x += (0.06 - orbit.x) * Math.min(1, delta * 8);
      orbit.y += (0 - orbit.y) * Math.min(1, delta * 8);
      floatY.current += (0 - floatY.current) * Math.min(1, delta * 6);
    } else {
      if (locked.current) {
        // Soft handoff back to free orbit after game ends
        locked.current = false;
        orbit.vx = 0;
        orbit.vy = 0;
      }

      if (!orbit.dragging) {
        orbit.y += orbit.vy;
        orbit.x += orbit.vx;
        orbit.vy *= 0.94;
        orbit.vx *= 0.94;

        if (Math.abs(orbit.vy) < 0.0008) {
          orbit.y += delta * 0.35;
        }
      }

      floatY.current = Math.sin(t * 1.1) * 0.04;
    }

    groupRef.current.rotation.y = orbit.y;
    groupRef.current.rotation.x = orbit.x;
    groupRef.current.rotation.z = playing
      ? 0
      : Math.sin(t * 0.2) * 0.02;
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
        <PhoneGame
          gameHudRef={gameHudRef}
          inputRef={inputRef}
          reducedMotion={reducedMotion}
        />
      </group>

      <mesh
        position={[0, H / 2 - 0.14, Z_FACE + 0.014]}
        rotation={[0, 0, Math.PI / 2]}
      >
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
