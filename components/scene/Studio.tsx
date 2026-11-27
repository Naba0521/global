"use client";

import { Environment, Lightformer } from "@react-three/drei";

export function Studio() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer form="rect" intensity={2.4} position={[0, 5, 1]} scale={[10, 2, 1]} />
      <Lightformer form="rect" intensity={1.3} color="#d5e2f0" position={[-5, 2, 3]} scale={[3, 5, 1]} />
      <Lightformer form="rect" intensity={2.6} color="#E36B2C" position={[5, 1.2, -2]} scale={[2, 5, 1]} />
      <Lightformer form="ring" intensity={1.2} position={[0, 1.5, 7]} scale={3} />
      <Lightformer form="rect" intensity={0.5} position={[0, -3, 0]} scale={[10, 10, 1]} />
    </Environment>
  );
}
