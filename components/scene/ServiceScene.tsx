"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group, PerspectiveCamera } from "three";
import type { ServiceId } from "@/lib/content";
import { BoxTruss, Chain, fitDistance } from "./geometry";
import { Studio } from "./Studio";

function TrussModel() {
  const arc = [
    [-0.2, 0.2],
    [0.15, 0.7],
    [0.55, 1.05],
    [1.05, 1.15],
    [1.55, 0.95],
  ] as const;
  return (
    <group>
      <BoxTruss from={[-1.5, 0.35, 0.35]} to={[1.2, 0.35, 0.35]} braces={6} />
      {arc.slice(0, -1).map((point, index) => {
        const next = arc[index + 1];
        return (
          <BoxTruss
            key={index}
            from={[point[0] - 0.4, point[1] + 0.7, -0.35]}
            to={[next[0] - 0.4, next[1] + 0.7, -0.35]}
            size={0.1}
            radius={0.016}
            braces={2}
          />
        );
      })}
    </group>
  );
}

function SteelModel() {
  return (
    <group>
      <BoxTruss
        from={[0, 0, 0]}
        to={[0, 2.7, 0]}
        size={0.28}
        radius={0.04}
        color="#8e949c"
        braces={6}
      />
      <BoxTruss
        from={[0.95, 0, 0]}
        to={[0.95, 1.9, 0]}
        size={0.16}
        radius={0.028}
        color="#b7bcc3"
        braces={4}
      />
    </group>
  );
}

function LayherModel() {
  const posts: [number, number][] = [
    [-0.7, -0.45],
    [0.7, -0.45],
    [0.7, 0.45],
    [-0.7, 0.45],
  ];
  return (
    <group>
      {posts.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 1.05, z]}>
          <cylinderGeometry args={[0.035, 0.035, 2.1, 8]} />
          <meshStandardMaterial color="#c5c8ce" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
      {[0.4, 1.15, 1.9].map((y) => (
        <group key={y}>
          <BoxTruss
            from={[-0.7, y, -0.45]}
            to={[0.7, y, -0.45]}
            size={0.045}
            radius={0.012}
            braces={2}
          />
          <BoxTruss
            from={[-0.7, y, 0.45]}
            to={[0.7, y, 0.45]}
            size={0.045}
            radius={0.012}
            braces={2}
          />
        </group>
      ))}
      <mesh position={[0, 1.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[1.25, 0.75, 0.04]} />
        <meshStandardMaterial color="#3a3d42" metalness={0.4} roughness={0.55} />
      </mesh>
    </group>
  );
}

function StageModel() {
  return (
    <group position={[0, 0.2, 0]}>
      {[-0.7, 0, 0.7].map((x) =>
        [-0.35, 0.35].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.78, z]}>
            <boxGeometry args={[0.62, 0.08, 0.3]} />
            <meshStandardMaterial color="#c5c8ce" metalness={0.72} roughness={0.32} />
          </mesh>
        )),
      )}
      <BoxTruss from={[-1.2, 0, 0]} to={[-1.2, 0.74, 0]} size={0.12} radius={0.022} braces={2} />
      <BoxTruss from={[1.2, 0, 0]} to={[1.2, 0.74, 0]} size={0.12} radius={0.022} braces={2} />
    </group>
  );
}

function AutomationModel({ still }: { still: boolean }) {
  const trolley = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!trolley.current || still) return;
    trolley.current.position.x = Math.sin(clock.elapsedTime * 0.45) * 0.85;
  });
  return (
    <group>
      <BoxTruss from={[-1.5, 1.35, 0]} to={[1.5, 1.35, 0]} braces={6} />
      <group ref={trolley} position={[0, 1.13, 0]}>
        <mesh>
          <boxGeometry args={[0.26, 0.1, 0.2]} />
          <meshStandardMaterial color="#E36B2C" metalness={0.55} roughness={0.35} />
        </mesh>
        <group position={[0, -0.05, 0]}>
          <Chain length={0.5} />
        </group>
        <mesh position={[0, -0.78, 0]}>
          <boxGeometry args={[0.9, 0.5, 0.05]} />
          <meshStandardMaterial color="#141518" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.78, 0.027]}>
          <planeGeometry args={[0.84, 0.44]} />
          <meshStandardMaterial color="#1a1b1e" emissive="#E36B2C" emissiveIntensity={0.16} />
        </mesh>
      </group>
    </group>
  );
}

const bounds: Record<ServiceId, { radius: number; low: number; high: number }> = {
  truss: { radius: 1.75, low: 0.19, high: 1.95 },
  steel: { radius: 1.2, low: 0, high: 2.7 },
  layher: { radius: 0.92, low: 0, high: 2.1 },
  stage: { radius: 1.38, low: 0.2, high: 1.02 },
  automation: { radius: 1.55, low: 0.1, high: 1.51 },
};

export function ServiceScene({
  kind,
  still,
}: {
  kind: ServiceId;
  still: boolean;
}) {
  const group = useRef<Group>(null);
  const { camera, size, invalidate } = useThree();

  useEffect(() => {
    const lens = camera as PerspectiveCamera;
    const box = bounds[kind];
    const centerY = (box.low + box.high) / 2;
    const halfHeight = (box.high - box.low) / 2 + 0.1;
    const aspect = size.width / Math.max(size.height, 1);
    const distance =
      (fitDistance(lens.fov, aspect, box.radius, halfHeight) + box.radius * 0.35) * 1.06;
    lens.position.set(0, centerY + distance * 0.18, distance);
    lens.lookAt(0, centerY, 0);
    invalidate();
  }, [camera, size, kind, invalidate]);

  useFrame((_, delta) => {
    if (!group.current || still) return;
    group.current.rotation.y += delta * 0.18;
  });

  return (
    <>
      <Studio />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 4]} intensity={1.8} color="#fff6ef" />
      <spotLight
        position={[-2, 2, 2]}
        intensity={8}
        angle={0.6}
        penumbra={1}
        color="#E36B2C"
      />
      <group ref={group}>
        {kind === "truss" && <TrussModel />}
        {kind === "steel" && <SteelModel />}
        {kind === "layher" && <LayherModel />}
        {kind === "stage" && <StageModel />}
        {kind === "automation" && <AutomationModel still={still} />}
      </group>
    </>
  );
}
