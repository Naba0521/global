"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { ServiceId } from "@/lib/content";
import { HeroScene } from "./scene/HeroScene";
import { ServiceScene } from "./scene/ServiceScene";

function useStageMode() {
  const [mode, setMode] = useState<"wait" | "full" | "simple" | "still">("wait");

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 760px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (reduce.matches) setMode("still");
      else if (narrow.matches) setMode("simple");
      else setMode("full");
    };
    apply();
    narrow.addEventListener("change", apply);
    reduce.addEventListener("change", apply);
    return () => {
      narrow.removeEventListener("change", apply);
      reduce.removeEventListener("change", apply);
    };
  }, []);

  return mode;
}

export function HeroCanvas() {
  const mode = useStageMode();
  if (mode === "wait") {
    return <div className="h-full w-full bg-ink" />;
  }
  return (
    <Canvas
      camera={{ position: [0, 1.25, 5.6], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      onCreated={({ gl }) => gl.setClearColor("#0B0B0C")}
    >
      <HeroScene simple={mode !== "full"} still={mode === "still"} />
    </Canvas>
  );
}

export function ServiceCanvas({ kind }: { kind: ServiceId }) {
  const mode = useStageMode();
  if (mode === "wait") {
    return <div className="h-full w-full bg-ink" />;
  }
  return (
    <Canvas
      camera={{ position: [0, 1.15, 4.4], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      onCreated={({ gl }) => gl.setClearColor("#0B0B0C")}
    >
      <ServiceScene kind={kind} still={mode === "still"} />
    </Canvas>
  );
}
