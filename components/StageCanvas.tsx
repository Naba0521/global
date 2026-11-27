"use client";

import dynamic from "next/dynamic";
import type { ServiceId } from "@/lib/content";
import { StagePoster } from "./StagePoster";

const HeroStage = dynamic(() => import("./scene/Stage").then((module) => module.HeroStage), {
  ssr: false,
  loading: () => <StagePoster variant="hero" />,
});

const ServiceStage = dynamic(
  () => import("./scene/Stage").then((module) => module.ServiceStage),
  {
    ssr: false,
    loading: () => <StagePoster variant="service" />,
  },
);

export function HeroCanvas() {
  return <HeroStage />;
}

export function ServiceCanvas({ kind }: { kind: ServiceId }) {
  return <ServiceStage kind={kind} />;
}
