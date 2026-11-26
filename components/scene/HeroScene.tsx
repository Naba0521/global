"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Group } from "three";
import { BoxTruss, Mark } from "./geometry";

export function HeroScene({
  simple,
  still,
}: {
  simple: boolean;
  still: boolean;
}) {
  const group = useRef<Group>(null);
  const aim = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useEffect(() => {
    if (still) return;
    const onMove = (event: PointerEvent) => {
      aim.current.x = (event.clientX / window.innerWidth - 0.5) * 0.35;
      aim.current.y = (event.clientY / window.innerHeight - 0.5) * 0.16;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  useFrame((_, delta) => {
    const rig = group.current;
    if (!rig) return;
    const glide = 1 - Math.pow(0.001, delta);
    current.current.x += (aim.current.x - current.current.x) * glide;
    current.current.y += (aim.current.y - current.current.y) * glide;
    if (!still) {
      rig.rotation.y = current.current.x;
      rig.rotation.x = current.current.y * 0.35;
    }
    const progress = simple || still ? 0 : Math.min(window.scrollY / window.innerHeight, 1);
    camera.position.z = 5.6 - progress * 1.35;
    camera.position.y = simple ? 2.15 : 1.25;
    camera.lookAt(0, simple ? 2.15 : 1.15, 0);
  });

  return (
    <>
      <color attach="background" args={["#0B0B0C"]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4.5, 6, 3.5]} intensity={3.4} color="#fff8f2" />
      <directionalLight position={[-3.5, 2.2, 2]} intensity={1.6} color="#d5e2f0" />
      <pointLight position={[1.6, 1.6, 1.8]} intensity={6} color="#E36B2C" distance={8} />
      <group ref={group}>
        {simple ? (
          <group position={[0, 2.15, 0]}>
            <Mark scale={1.05} />
          </group>
        ) : (
          <>
            <BoxTruss from={[-1.55, 0.15, 0]} to={[-1.55, 2.35, 0]} braces={5} />
            <BoxTruss from={[1.55, 0.15, 0]} to={[1.55, 2.35, 0]} braces={5} />
            <BoxTruss
              from={[-1.55, 2.35, 0]}
              to={[1.55, 2.35, 0]}
              braces={6}
            />
            <group position={[0, 1.22, 0]}>
              <Mark />
            </group>
          </>
        )}
      </group>
      {!simple && (
        <ContactShadows
          position={[0, 0.02, 0]}
          opacity={0.45}
          scale={8}
          blur={2.4}
          far={4}
        />
      )}
    </>
  );
}
