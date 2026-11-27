"use client";

import { useLayoutEffect, useMemo, useRef, type ReactNode, type Ref, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Tuple = [number, number, number];
type Segment = { a: THREE.Vector3; b: THREE.Vector3 };

const up = new THREE.Vector3(0, 1, 0);

export const aluminum = { color: "#cfd3d8", metalness: 0.92, roughness: 0.3 };

function TubeSet({
  segments,
  radius,
  sides = 8,
  children,
}: {
  segments: Segment[];
  radius: number;
  sides?: number;
  children: ReactNode;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const target = mesh.current;
    if (!target) return;
    const direction = new THREE.Vector3();
    const mid = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const turn = new THREE.Quaternion();
    const matrix = new THREE.Matrix4();
    segments.forEach(({ a, b }, index) => {
      direction.subVectors(b, a);
      const length = direction.length();
      mid.addVectors(a, b).multiplyScalar(0.5);
      turn.setFromUnitVectors(up, direction.normalize());
      scale.set(1, length, 1);
      matrix.compose(mid, turn, scale);
      target.setMatrixAt(index, matrix);
    });
    target.instanceMatrix.needsUpdate = true;
    target.computeBoundingSphere();
  }, [segments]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, segments.length]}>
      <cylinderGeometry args={[radius, radius, 1, sides]} />
      {children}
    </instancedMesh>
  );
}

export function BoxTruss({
  from,
  to,
  size = 0.16,
  radius = 0.02,
  color = aluminum.color,
  braces = 4,
  ends = true,
}: {
  from: Tuple;
  to: Tuple;
  size?: number;
  radius?: number;
  color?: string;
  braces?: number;
  ends?: boolean;
}) {
  const fx = from[0];
  const fy = from[1];
  const fz = from[2];
  const tx = to[0];
  const ty = to[1];
  const tz = to[2];

  const parts = useMemo(() => {
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

    const chords = corners.map((offset) => ({
      a: start.clone().add(offset),
      b: end.clone().add(offset),
    }));

    const webs: Segment[] = [];
    for (let face = 0; face < 4; face += 1) {
      const c0 = corners[face];
      const c1 = corners[(face + 1) % 4];
      for (let index = 0; index < braces; index += 1) {
        const t0 = index / braces;
        const t1 = (index + 1) / braces;
        const flip = index % 2 === 0;
        webs.push({
          a: start.clone().add(direction.clone().multiplyScalar(t0)).add(flip ? c0 : c1),
          b: start.clone().add(direction.clone().multiplyScalar(t1)).add(flip ? c1 : c0),
        });
      }
    }

    const facing = new THREE.Quaternion().setFromUnitVectors(up, axis);
    const plates = [start, end].map((point) => ({ position: point.clone(), facing }));

    return { chords, webs, plates };
  }, [fx, fy, fz, tx, ty, tz, size, braces]);

  return (
    <group>
      <TubeSet segments={parts.chords} radius={radius}>
        <meshStandardMaterial color={color} metalness={aluminum.metalness} roughness={aluminum.roughness} />
      </TubeSet>
      <TubeSet segments={parts.webs} radius={radius * 0.58} sides={6}>
        <meshStandardMaterial color={color} metalness={aluminum.metalness} roughness={0.38} />
      </TubeSet>
      {ends &&
        parts.plates.map((plate, index) => (
          <mesh key={index} position={plate.position} quaternion={plate.facing}>
            <boxGeometry args={[size * 2.2, 0.018, size * 2.2]} />
            <meshStandardMaterial color="#9ea3aa" metalness={0.85} roughness={0.35} />
          </mesh>
        ))}
    </group>
  );
}

export function CornerBlock({ position, size = 0.16 }: { position: Tuple; size?: number }) {
  return (
    <RoundedBox args={[size * 2.25, size * 2.25, size * 2.25]} radius={0.03} smoothness={3} position={position}>
      <meshStandardMaterial color="#a3a9b0" metalness={0.9} roughness={0.32} />
    </RoundedBox>
  );
}

export function BasePlate({ position, size = 0.16 }: { position: Tuple; size?: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[size * 4.2, 0.025, size * 4.2]} />
      <meshStandardMaterial color="#5d6168" metalness={0.8} roughness={0.45} />
    </mesh>
  );
}

const cubeCorners = [-1, 1].flatMap((x) =>
  [-1, 1].flatMap((y) => [-1, 1].map((z) => new THREE.Vector3(x, y, z))),
);

export function CubeMark({ edge = 0.85 }: { edge?: number }) {
  const joints = useRef<THREE.InstancedMesh>(null);
  const { segments, points } = useMemo(() => {
    const align = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(1, 1, 1).normalize(),
      new THREE.Vector3(0, 0, 1),
    );
    const placed = cubeCorners.map((corner) => corner.clone().applyQuaternion(align));
    const tip = placed.reduce((best, point) => (point.y > best.y ? point : best));
    const spin = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      Math.atan2(tip.x, tip.y),
    );
    const corners = placed.map((point) => point.applyQuaternion(spin).multiplyScalar(edge / 2));
    const pivot = new THREE.Vector3(tip.x, 0, tip.z);
    corners.forEach((point) => point.sub(pivot));
    const lines: Segment[] = [];
    cubeCorners.forEach((a, i) =>
      cubeCorners.forEach((b, j) => {
        if (j > i && a.distanceTo(b) === 2) lines.push({ a: corners[i], b: corners[j] });
      }),
    );
    return { segments: lines, points: corners };
  }, [edge]);

  useLayoutEffect(() => {
    const target = joints.current;
    if (!target) return;
    const matrix = new THREE.Matrix4();
    points.forEach((point, index) => target.setMatrixAt(index, matrix.makeTranslation(point)));
    target.instanceMatrix.needsUpdate = true;
    target.computeBoundingSphere();
  }, [points]);

  return (
    <group>
      <TubeSet segments={segments} radius={edge * 0.045}>
        <meshStandardMaterial
          color="#E36B2C"
          emissive="#E36B2C"
          emissiveIntensity={0.55}
          metalness={0.35}
          roughness={0.35}
        />
      </TubeSet>
      <instancedMesh ref={joints} args={[undefined, undefined, points.length]}>
        <sphereGeometry args={[edge * 0.07, 12, 8]} />
        <meshStandardMaterial color="#f08a4b" emissive="#E36B2C" emissiveIntensity={0.6} roughness={0.3} />
      </instancedMesh>
    </group>
  );
}

export function cubeReach(edge: number) {
  return edge * Math.sqrt(2 / 3);
}

export const chainLink = 0.034;

export function Chain({
  length,
  reveal,
}: {
  length: number;
  reveal?: RefObject<number>;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = Math.max(1, Math.floor(length / chainLink));

  useLayoutEffect(() => {
    const target = mesh.current;
    if (!target) return;
    const matrix = new THREE.Matrix4();
    const turn = new THREE.Quaternion();
    const quarter = new THREE.Quaternion().setFromAxisAngle(up, Math.PI / 2);
    const stand = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    const one = new THREE.Vector3(1, 1, 1);
    for (let index = 0; index < count; index += 1) {
      turn.copy(stand);
      if (index % 2 === 1) turn.premultiply(quarter);
      matrix.compose(new THREE.Vector3(0, -index * chainLink - chainLink / 2, 0), turn, one);
      target.setMatrixAt(index, matrix);
    }
    target.instanceMatrix.needsUpdate = true;
    target.computeBoundingSphere();
  }, [count]);

  useFrame(() => {
    if (!mesh.current || !reveal) return;
    mesh.current.count = Math.max(1, Math.round(count * reveal.current));
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <torusGeometry args={[chainLink * 0.62, chainLink * 0.17, 6, 12]} />
      <meshStandardMaterial color="#4a4e55" metalness={0.85} roughness={0.35} />
    </instancedMesh>
  );
}

export function Hoist() {
  return (
    <group>
      <mesh position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.06, 6]} />
        <meshStandardMaterial color="#8d9299" metalness={0.9} roughness={0.3} />
      </mesh>
      <RoundedBox args={[0.15, 0.18, 0.13]} radius={0.015} smoothness={2} position={[0, -0.15, 0]}>
        <meshStandardMaterial color="#25272b" metalness={0.55} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, -0.12, 0.067]}>
        <boxGeometry args={[0.15, 0.025, 0.004]} />
        <meshStandardMaterial color="#E36B2C" emissive="#E36B2C" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

export const hoistDrop = 0.24;

export const glowLayer = 1;

const glowBlend = {
  transparent: true,
  depthWrite: false,
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.OneFactor,
  blendDstAlpha: THREE.OneFactor,
} as const;

const glowOut = /* glsl */ `
  gl_FragColor = vec4(light, max(light.r, max(light.g, light.b)));
`;

const beamVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-view.xyz);
    gl_Position = projectionMatrix * view;
  }
`;

const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fade = pow(vUv.y, 1.8);
    float core = pow(abs(dot(vNormal, vView)), 2.0);
    vec3 light = uColor * fade * core * uOpacity;
    ${glowOut}
  }
`;

export const beamColor = "#ffd7b0";

export function LightBeam({
  length = 2.4,
  spread = 0.5,
  opacity = 0.32,
  power,
}: {
  length?: number;
  spread?: number;
  opacity?: number;
  power?: RefObject<number>;
}) {
  const cone = useRef<THREE.Mesh>(null);
  const lens = useRef<THREE.MeshBasicMaterial>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(beamColor) }, uOpacity: { value: opacity } }),
    [opacity],
  );
  const lit = useMemo(() => new THREE.Color(beamColor), []);
  const dark = useMemo(() => new THREE.Color("#2a2a2a"), []);

  useLayoutEffect(() => {
    cone.current?.layers.set(glowLayer);
  }, []);

  useFrame(() => {
    const level = power?.current ?? 1;
    const live = material.current?.uniforms;
    if (live) live.uOpacity.value = opacity * level;
    lens.current?.color.copy(dark).lerp(lit, level);
  });

  return (
    <group>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.055, 0.07, 0.12, 12]} />
        <meshStandardMaterial color="#1d1f22" metalness={0.6} roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.112, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial ref={lens} color={beamColor} toneMapped={false} />
      </mesh>
      <mesh ref={cone} position={[0, -0.11 - length / 2, 0]}>
        <cylinderGeometry args={[0.045, spread, length, 32, 1, true]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={beamVertex}
          fragmentShader={beamFragment}
          side={THREE.DoubleSide}
          {...glowBlend}
        />
      </mesh>
    </group>
  );
}

const poolFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = 1.0 - smoothstep(0.15, 1.0, d);
    vec3 light = uColor * a * a * uOpacity;
    ${glowOut}
  }
`;

const flatVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function BeamPool({
  ref,
  opacity = 0.5,
  power,
}: {
  ref?: Ref<THREE.Mesh>;
  opacity?: number;
  power?: RefObject<number>;
}) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(beamColor) }, uOpacity: { value: opacity } }),
    [opacity],
  );
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame(() => {
    const live = material.current?.uniforms;
    if (live) live.uOpacity.value = opacity * (power?.current ?? 1);
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={flatVertex} fragmentShader={poolFragment} {...glowBlend} />
    </mesh>
  );
}

export function StageDeck({
  width,
  depth,
  height,
}: {
  width: number;
  depth: number;
  height: number;
}) {
  const panels = useRef<THREE.InstancedMesh>(null);
  const columns = Math.max(2, Math.round(width / 0.62));
  const rows = 2;
  const gap = 0.008;
  const panelWidth = width / columns - gap;
  const panelDepth = depth / rows - gap;

  useLayoutEffect(() => {
    const target = panels.current;
    if (!target) return;
    const matrix = new THREE.Matrix4();
    for (let column = 0; column < columns; column += 1) {
      for (let row = 0; row < rows; row += 1) {
        const x = -width / 2 + (column + 0.5) * (width / columns);
        const z = -depth / 2 + (row + 0.5) * (depth / rows);
        target.setMatrixAt(column * rows + row, matrix.makeTranslation(x, height - 0.02, z));
      }
    }
    target.instanceMatrix.needsUpdate = true;
    target.computeBoundingSphere();
  }, [columns, width, depth, height]);

  return (
    <group>
      <instancedMesh ref={panels} args={[undefined, undefined, columns * rows]}>
        <boxGeometry args={[panelWidth, 0.04, panelDepth]} />
        <meshStandardMaterial color="#1e2024" metalness={0.25} roughness={0.62} />
      </instancedMesh>
      <mesh position={[0, (height - 0.04) / 2, depth / 2 - 0.01]}>
        <boxGeometry args={[width, height - 0.04, 0.02]} />
        <meshStandardMaterial color="#0e0f11" roughness={0.9} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * width) / 2 - side * 0.01, (height - 0.04) / 2, 0]}>
          <boxGeometry args={[0.02, height - 0.04, depth]} />
          <meshStandardMaterial color="#0e0f11" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, height - 0.055, depth / 2 + 0.002]}>
        <boxGeometry args={[width - 0.04, 0.012, 0.01]} />
        <meshBasicMaterial color="#E36B2C" toneMapped={false} />
      </mesh>
    </group>
  );
}

const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  attribute float aSeed;
  varying float vSeed;
  void main() {
    vec3 p = position;
    p.y = 0.4 + mod(p.y + uTime * (0.03 + aSeed * 0.04), 1.8);
    p.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.06;
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uScale * (0.6 + aSeed) / -view.z;
    vSeed = aSeed;
    gl_Position = projectionMatrix * view;
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = 1.0 - smoothstep(0.0, 1.0, d);
    vec3 light = uColor * a * uOpacity * (0.4 + vSeed * 0.6);
    ${glowOut}
  }
`;

export function Dust({
  count,
  width,
  power,
}: {
  count: number;
  width: number;
  power?: RefObject<number>;
}) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const geometry = useMemo(() => {
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (random() - 0.5) * width;
      positions[index * 3 + 1] = random() * 1.8;
      positions[index * 3 + 2] = (random() - 0.3) * 1.1;
      seeds[index] = random();
    }
    const shape = new THREE.BufferGeometry();
    shape.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    shape.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return shape;
  }, [count, width]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScale: { value: 1 },
      uColor: { value: new THREE.Color(beamColor) },
      uOpacity: { value: 0.55 },
    }),
    [],
  );

  useLayoutEffect(() => {
    points.current?.layers.set(glowLayer);
    return () => geometry.dispose();
  }, [geometry]);

  useFrame(({ clock }) => {
    const live = material.current?.uniforms;
    if (!live) return;
    live.uTime.value = clock.elapsedTime;
    live.uScale.value = size.height * viewport.dpr * 0.034;
    live.uOpacity.value = 0.75 * (power?.current ?? 1);
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={dustVertex} fragmentShader={dustFragment} {...glowBlend} />
    </points>
  );
}

export function fitDistance(
  fov: number,
  aspect: number,
  halfWidth: number,
  halfHeight: number,
) {
  const tanV = Math.tan((fov * Math.PI) / 360);
  return Math.max(halfHeight / tanV, halfWidth / (tanV * aspect));
}
