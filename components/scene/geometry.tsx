"use client";

import { useMemo } from "react";
import * as THREE from "three";

type Tuple = [number, number, number];

function Tube({
  a,
  b,
  radius,
  color,
}: {
  a: Tuple;
  b: Tuple;
  radius: number;
  color: string;
}) {
  const pose = useMemo(() => {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const direction = end.clone().sub(start);
    const length = direction.length();
    if (length < 0.001) return null;
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );
    return { mid, quaternion, length };
  }, [a, b]);

  if (!pose) return null;

  return (
    <mesh position={pose.mid} quaternion={pose.quaternion}>
      <cylinderGeometry args={[radius, radius, pose.length, 6]} />
      <meshStandardMaterial color={color} metalness={0.86} roughness={0.28} />
    </mesh>
  );
}

export function BoxTruss({
  from,
  to,
  size = 0.16,
  radius = 0.02,
  color = "#d7d9de",
  braces = 4,
}: {
  from: Tuple;
  to: Tuple;
  size?: number;
  radius?: number;
  color?: string;
  braces?: number;
}) {
  const fx = from[0];
  const fy = from[1];
  const fz = from[2];
  const tx = to[0];
  const ty = to[1];
  const tz = to[2];

  const tubes = useMemo(() => {
    const start = new THREE.Vector3(fx, fy, fz);
    const end = new THREE.Vector3(tx, ty, tz);
    const direction = end.clone().sub(start);
    const axis = direction.clone().normalize();
    const helper =
      Math.abs(axis.y) > 0.85
        ? new THREE.Vector3(1, 0, 0)
        : new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(axis, helper).normalize();
    const lift = new THREE.Vector3().crossVectors(side, axis).normalize();
    const corners = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ].map(([sx, sy]) =>
      side
        .clone()
        .multiplyScalar(sx * size)
        .add(lift.clone().multiplyScalar(sy * size)),
    );

    const list: { a: Tuple; b: Tuple }[] = [];
    const asTuple = (vector: THREE.Vector3): Tuple => [
      vector.x,
      vector.y,
      vector.z,
    ];

    corners.forEach((offset) => {
      list.push({
        a: asTuple(start.clone().add(offset)),
        b: asTuple(end.clone().add(offset)),
      });
    });

    for (let face = 0; face < 4; face += 1) {
      const c0 = corners[face];
      const c1 = corners[(face + 1) % 4];
      for (let index = 0; index < braces; index += 1) {
        const t0 = index / braces;
        const t1 = (index + 1) / braces;
        const flip = index % 2 === 0;
        const p0 = start
          .clone()
          .add(direction.clone().multiplyScalar(t0))
          .add(flip ? c0 : c1);
        const p1 = start
          .clone()
          .add(direction.clone().multiplyScalar(t1))
          .add(flip ? c1 : c0);
        list.push({ a: asTuple(p0), b: asTuple(p1) });
      }
    }

    return list;
  }, [fx, fy, fz, tx, ty, tz, size, braces]);

  return (
    <group>
      {tubes.map((tube, index) => (
        <Tube key={index} a={tube.a} b={tube.b} radius={radius} color={color} />
      ))}
    </group>
  );
}

export function Mark({ scale = 1 }: { scale?: number }) {
  return (
    <mesh scale={scale}>
      <icosahedronGeometry args={[0.62, 0]} />
      <meshStandardMaterial
        color="#E36B2C"
        metalness={0.2}
        roughness={0.4}
        emissive="#E36B2C"
        emissiveIntensity={0.45}
      />
    </mesh>
  );
}
