"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { ServiceId } from "@/lib/content";
import { BoxTruss } from "./geometry";

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
      <group ref={trolley} position={[0, 0.85, 0]}>
        <mesh>
          <boxGeometry args={[0.28, 0.16, 0.22]} />
          <meshStandardMaterial color="#E36B2C" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />
          <meshStandardMaterial color="#d7d9de" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export function ServiceScene({
  kind,
  still,
}: {
  kind: ServiceId;
  still: boolean;
}) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!group.current || still) return;
    group.current.rotation.y += delta * 0.18;
  });

  return (
    <>
      <color attach="background" args={["#0B0B0C"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 4]} intensity={2.2} color="#fff6ef" />
      <spotLight
        position={[-2, 2, 2]}
        intensity={8}
        angle={0.6}
        penumbra={1}
        color="#E36B2C"
      />
      <group ref={group} position={[0, -0.15, 0]}>
        {kind === "truss" && <TrussModel />}
        {kind === "steel" && <SteelModel />}
        {kind === "layher" && <LayherModel />}
        {kind === "stage" && <StageModel />}
        {kind === "automation" && <AutomationModel still={still} />}
      </group>
    </>
  );
}
