"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Group, Mesh, PerspectiveCamera } from "three";
import {
  BasePlate,
  BeamPool,
  BoxTruss,
  Chain,
  CornerBlock,
  CubeMark,
  Dust,
  Hoist,
  LightBeam,
  StageDeck,
  cubeReach,
  fitDistance,
  glowLayer,
  hoistDrop,
} from "./geometry";
import { Studio } from "./Studio";

const wide = { span: 1.55, top: 2.35, posts: 5, beam: 6, markY: 1.18, edge: 0.7, lamps: 0.85, spread: 0.5 };
const tall = { span: 0.95, top: 2.35, posts: 5, beam: 4, markY: 1.3, edge: 0.5, lamps: 0.52, spread: 0.36 };
const base = 0.03;
const size = 0.16;
const deckHeight = 0.3;
const deckDepth = 1.2;
const tilt = -0.3;
const sweep = (time: number, index: number) =>
  (index === 0 ? 1 : -1) * (0.2 + Math.sin(time * 0.5 + index * 1.7) * 0.16);

export function HeroScene({ lite, still }: { lite: boolean; still: boolean }) {
  const group = useRef<Group>(null);
  const load = useRef<Group>(null);
  const mark = useRef<Group>(null);
  const lamps = useRef<(Group | null)[]>([]);
  const pools = useRef<(Mesh | null)[]>([]);
  const reveal = useRef(1);
  const lift = useRef(still ? 1 : 0);
  const power = useRef(still ? 1 : 0);
  const born = useRef<number | null>(null);
  const aim = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const pointer = useRef(false);
  const { camera, size: view } = useThree();
  const aspect = view.width / Math.max(view.height, 1);
  const portrait = aspect < 0.8;
  const frame = portrait ? tall : wide;
  const hook = frame.top - size;
  const reach = cubeReach(frame.edge);
  const chain = Math.max(hook - hoistDrop - (frame.markY + reach), 0.05);
  const slack = Math.max(hook - hoistDrop - deckHeight - reach * 2 - 0.01, chain);
  const deckWidth = frame.span * 2 - 0.5;
  const throwLength = (hook - deckHeight) / Math.cos(tilt) / Math.cos(0.36) + 0.05;

  useEffect(() => {
    camera.layers.enable(glowLayer);
  }, [camera]);

  useEffect(() => {
    if (still || !window.matchMedia("(hover: hover)").matches) return;
    pointer.current = true;
    const onMove = (event: PointerEvent) => {
      aim.current.x = (event.clientX / window.innerWidth - 0.5) * 0.35;
      aim.current.y = (event.clientY / window.innerHeight - 0.5) * 0.16;
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      pointer.current = false;
      window.removeEventListener("pointermove", onMove);
    };
  }, [still]);

  useFrame(({ clock }, delta) => {
    const rig = group.current;
    if (!rig) return;
    const time = clock.elapsedTime;
    born.current = (born.current ?? 0) + Math.min(delta, 0.1);
    const age = born.current;
    if (still) reveal.current = chain / slack;

    if (!still) {
      const raise = Math.min(Math.max((age - 0.3) / 2.4, 0), 1);
      lift.current = raise < 0.5 ? 4 * raise ** 3 : 1 - (-2 * raise + 2) ** 3 / 2;
      reveal.current = (slack + (chain - slack) * lift.current) / slack;
      const warm = Math.min(Math.max((age - 2.6) / 0.7, 0), 1);
      const flicker = warm > 0 && warm < 0.6 ? (Math.sin(age * 60) > 0 ? 1 : 0.35) : 1;
      power.current = warm * flicker;
      if (!pointer.current) {
        aim.current.x = Math.sin(time * 0.32) * 0.21;
        aim.current.y = Math.sin(time * 0.23) * 0.05;
      }
      const glide = 1 - Math.pow(0.001, delta);
      current.current.x += (aim.current.x - current.current.x) * glide;
      current.current.y += (aim.current.y - current.current.y) * glide;
      rig.rotation.y = current.current.x;
      rig.rotation.x = current.current.y * 0.35;

      if (load.current) {
        const settle = 0.025 + 0.06 * Math.exp(-Math.max(age - 2.6, 0) * 1.4);
        load.current.rotation.z = Math.sin(time * 0.9) * settle;
        load.current.rotation.x = Math.sin(time * 0.7 + 1) * settle * 0.6;
      }
      if (mark.current) {
        mark.current.position.y = -(hoistDrop + slack * reveal.current + reach);
        mark.current.rotation.y = Math.sin(time * 0.3) * 0.35 * lift.current;
      }
      lamps.current.forEach((lamp, index) => {
        if (lamp) lamp.rotation.z = sweep(time, index);
      });
    }

    lamps.current.forEach((lamp, index) => {
      const pool = pools.current[index];
      if (!lamp || !pool) return;
      const turn = lamp.rotation.z;
      const down = Math.cos(turn) * Math.cos(tilt);
      const forward = -Math.cos(turn) * Math.sin(tilt);
      const side = Math.sin(turn);
      let floor = deckHeight + 0.003;
      let reachOut = (hook - floor) / down;
      let x = lamp.position.x + reachOut * side;
      let z = reachOut * forward;
      if (Math.abs(x) > deckWidth / 2 || Math.abs(z) > deckDepth / 2) {
        floor = 0.006;
        reachOut = (hook - floor) / down;
        x = lamp.position.x + reachOut * side;
        z = reachOut * forward;
      }
      const radius = 0.045 + (frame.spread - 0.045) * Math.min(reachOut / throwLength, 1);
      pool.position.set(x, floor, z);
      pool.scale.set(radius * 3, radius * 3 / down, 1);
    });

    const lens = camera as PerspectiveCamera;
    const progress = still ? 0 : Math.min(window.scrollY / window.innerHeight, 1);
    const approach = still ? 1 : 1 - (1 - Math.min(Math.max(age / 3, 0), 1)) ** 3;
    const dolly = 1 + (1 - approach) * 0.28;
    if (portrait) {
      const tanV = Math.tan((lens.fov * Math.PI) / 360);
      const halfHeight = (frame.top - base) / 2 + 0.2;
      const centerY = (frame.top + base) / 2;
      const distance =
        Math.max(
          fitDistance(lens.fov, aspect, frame.span + 0.6, halfHeight),
          halfHeight / (tanV * 0.62),
        ) *
        (1 - progress * 0.12) *
        dolly;
      const lookY = centerY - distance * tanV * 0.3;
      lens.position.set(0, lookY + 0.2, distance);
      lens.lookAt(0, lookY, 0);
    } else {
      const distance = Math.max(5.6, fitDistance(lens.fov, aspect, frame.span + 0.45, 1.4));
      lens.position.set(0, 1.25, (distance - progress * 1.35) * dolly);
      lens.lookAt(0, 1.15, 0);
    }
  });

  return (
    <>
      <Studio />
      <ambientLight intensity={0.3} />
      <directionalLight position={[4.5, 6, 3.5]} intensity={2.2} color="#fff8f2" />
      <directionalLight position={[-3.5, 2.2, 2]} intensity={0.9} color="#d5e2f0" />
      <pointLight position={[0, frame.markY, 1.1]} intensity={3.5} color="#E36B2C" distance={4} />
      <group ref={group}>
        <StageDeck width={deckWidth} depth={deckDepth} height={deckHeight} />
        {[-frame.span, frame.span].map((x) => (
          <group key={x}>
            <BasePlate position={[x, 0.0125, 0]} size={size} />
            <BoxTruss from={[x, base, 0]} to={[x, frame.top, 0]} braces={frame.posts} size={size} />
            <CornerBlock position={[x, frame.top, 0]} size={size} />
          </group>
        ))}
        <BoxTruss
          from={[-frame.span, frame.top, 0]}
          to={[frame.span, frame.top, 0]}
          braces={frame.beam}
          size={size}
          ends={false}
        />
        {[-frame.lamps, frame.lamps].map((x, index) => (
          <group key={x}>
            <group
              position={[x, hook, 0]}
              rotation={[tilt, 0, sweep(0, index)]}
              ref={(node) => {
                lamps.current[index] = node;
              }}
            >
              <LightBeam
                length={throwLength}
                spread={frame.spread}
                opacity={lite ? 0.26 : 0.32}
                power={power}
              />
            </group>
            <BeamPool
              ref={(node) => {
                pools.current[index] = node;
              }}
              opacity={0.42}
              power={power}
            />
          </group>
        ))}
        {!still && <Dust count={lite ? 60 : 140} width={frame.lamps * 2 + 0.8} power={power} />}
        <group ref={load} position={[0, hook, 0]}>
          <Hoist />
          <group position={[0, -hoistDrop, 0]}>
            <Chain length={slack} reveal={reveal} />
          </group>
          <group ref={mark} position={[0, -(hoistDrop + (still ? chain : slack) + reach), 0]}>
            <CubeMark edge={frame.edge} />
          </group>
        </group>
      </group>
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.5}
        scale={8}
        blur={2.4}
        far={4}
        frames={lite || still ? 1 : Infinity}
      />
    </>
  );
}
