"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Group, PerspectiveCamera, PointLight } from "three";
import {
  BasePlate,
  BoxTruss,
  Chain,
  CornerBlock,
  CubeMark,
  Hoist,
  cubeReach,
  fitDistance,
  hoistDrop,
} from "./geometry";
import { Studio } from "./Studio";

type Tuple = [number, number, number];

const half = 0.8;
const high = 1.85;
const size = 0.09;
const edge = 0.56;
const reach = cubeReach(edge);
const hook = high - size;
const chain = 0.16;
const markY = -(hoistDrop + chain + reach);
const block = size * 1.125;
const turn = 0.62;
const corners = [-half, half].flatMap((x) => [-half, half].map((z) => [x, z] as const));
const ring: [number, number, number, number][] = [
  [-half, -half, half, -half],
  [half, -half, half, half],
  [half, half, -half, half],
  [-half, half, -half, -half],
];

const easeOut = (value: number) => 1 - (1 - value) ** 3;
const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

function beams(y: number) {
  return ring.map(([ax, az, bx, bz]) => {
    const dx = Math.sign(bx - ax) * block;
    const dz = Math.sign(bz - az) * block;
    return { from: [ax + dx, y, az + dz] as Tuple, to: [bx - dx, y, bz - dz] as Tuple };
  });
}

export function AboutScene({ still }: { still: boolean }) {
  const rig = useRef<Group>(null);
  const parts = useRef<(Group | null)[]>([]);
  const mark = useRef<Group>(null);
  const glow = useRef<PointLight>(null);
  const age = useRef(0);
  const { camera, size: view, invalidate } = useThree();

  useEffect(() => {
    const lens = camera as PerspectiveCamera;
    const aspect = view.width / Math.max(view.height, 1);
    const radius = half * Math.SQRT2 + size * 1.4;
    const centerY = (high + 0.05) / 2;
    const distance = (fitDistance(lens.fov, aspect, radius, centerY + 0.12) + radius * 0.4) * 1.12;
    lens.position.set(0, centerY + distance * 0.42, distance);
    lens.lookAt(0, centerY - 0.08, 0);
    invalidate();
  }, [camera, view, invalidate]);

  useFrame((_, delta) => {
    if (still) return;
    age.current += Math.min(delta, 0.1);
    const time = age.current;
    parts.current.forEach((part, index) => {
      if (!part) return;
      const t = clamp((time - 0.2 - index * 0.11) / 0.55);
      part.position.y = (1 - easeOut(t)) * 1.6;
      part.visible = t > 0;
    });
    if (mark.current) {
      const grow = clamp((time - 0.2 - parts.current.length * 0.11) / 0.7);
      const pop = grow < 1 ? easeOut(grow) * (1 + Math.sin(grow * Math.PI) * 0.12) : 1;
      mark.current.scale.setScalar(Math.max(pop, 0.0001));
      if (glow.current) glow.current.intensity = 2.2 * easeOut(grow);
      mark.current.rotation.y = -(turn + time * 0.16) + Math.sin(time * 0.6) * 0.08;
    }
    if (rig.current) rig.current.rotation.y = turn + time * 0.16;
  });

  let order = 0;
  const drop = (key: string, child: ReactNode) => {
    const index = order++;
    return (
      <group
        key={key}
        ref={(node) => {
          parts.current[index] = node;
        }}
        visible={still}
      >
        {child}
      </group>
    );
  };

  return (
    <>
      <Studio />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 4]} intensity={1.8} color="#fff6ef" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#b8c6ff" />
      <group ref={rig} rotation={[0, turn, 0]}>
        {corners.map(([x, z]) => (
          <BasePlate key={`p${x}${z}`} position={[x, 0.0125, z]} size={size} />
        ))}
        {corners.map(([x, z]) =>
          drop(
            `v${x}${z}`,
            <BoxTruss from={[x, 0.025, z]} to={[x, high - block, z]} size={size} radius={0.013} braces={3} />,
          ),
        )}
        {corners.map(([x, z]) => drop(`t${x}${z}`, <CornerBlock position={[x, high, z]} size={size} />))}
        {beams(high).map((beam, index) => drop(`h${index}`, <BoxTruss {...beam} size={size} radius={0.013} braces={3} ends={false} />))}
        {drop(
          "m",
          <group>
            <BoxTruss from={[-half + size / 2, high, 0]} to={[half - size / 2, high, 0]} size={size * 0.8} radius={0.011} braces={3} ends={false} />
            <group position={[0, hook, 0]}>
              <Hoist />
              <group position={[0, -hoistDrop, 0]}>
                <Chain length={chain} />
              </group>
            </group>
          </group>,
        )}
        <group position={[0, hook, 0]}>
          <group ref={mark} position={[0, markY, 0]} rotation={[0, -turn, 0]} scale={still ? 1 : 0.0001}>
            <CubeMark edge={edge} />
          </group>
        </group>
        <pointLight ref={glow} position={[0, hook + markY, 0]} intensity={still ? 2.2 : 0} color="#E36B2C" distance={2.2} />
      </group>
      <ContactShadows position={[0, 0.002, 0]} opacity={0.55} scale={5} blur={2.4} far={2} frames={still ? 1 : Infinity} />
    </>
  );
}
