"use client";

import { Component, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import type { ServiceId } from "@/lib/content";
import { StagePoster } from "../StagePoster";
import { HeroScene } from "./HeroScene";
import { ServiceScene } from "./ServiceScene";

type Mode = "wait" | "full" | "lite" | "still" | "none";

let webgl: boolean | undefined;

function canRender() {
  if (webgl === undefined) {
    try {
      const probe = document.createElement("canvas");
      webgl = Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

function useStageMode() {
  const [mode, setMode] = useState<Mode>("wait");

  useEffect(() => {
    if (!canRender()) {
      setMode("none");
      return;
    }
    const narrow = window.matchMedia("(max-width: 760px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (reduce.matches) setMode("still");
      else if (narrow.matches) setMode("lite");
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

function useOnScreen(target: RefObject<HTMLDivElement | null>) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const node = target.current;
    if (!node) return;
    const watch = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px 0px" },
    );
    watch.observe(node);
    return () => watch.disconnect();
  }, [target]);
  return visible;
}

class Guard extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Stage({
  variant,
  camera,
  children,
}: {
  variant: "hero" | "service";
  camera: { position: [number, number, number]; fov: number };
  children: (mode: Mode) => ReactNode;
}) {
  const mode = useStageMode();
  const box = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(box);
  const [lost, setLost] = useState(false);
  const poster = <StagePoster variant={variant} />;

  return (
    <div ref={box} className="h-full w-full" aria-hidden>
      {mode === "wait" || mode === "none" || lost ? (
        poster
      ) : (
        <Guard fallback={poster}>
          <Canvas
            camera={camera}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            frameloop={mode === "still" ? "demand" : visible ? "always" : "never"}
            style={{ touchAction: "pan-y" }}
            onCreated={({ gl }) => {
              gl.setClearColor("#000000", 0);
              gl.domElement.addEventListener(
                "webglcontextlost",
                (event) => {
                  event.preventDefault();
                  setLost(true);
                },
                { once: true },
              );
            }}
          >
            {children(mode)}
          </Canvas>
        </Guard>
      )}
    </div>
  );
}

export function HeroStage() {
  return (
    <Stage variant="hero" camera={{ position: [0, 1.25, 5.6], fov: 36 }}>
      {(mode) => <HeroScene lite={mode !== "full"} still={mode === "still"} />}
    </Stage>
  );
}

export function ServiceStage({ kind }: { kind: ServiceId }) {
  return (
    <Stage variant="service" camera={{ position: [0, 1.15, 4.4], fov: 35 }}>
      {(mode) => <ServiceScene kind={kind} still={mode === "still"} />}
    </Stage>
  );
}
