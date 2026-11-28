import type { CSSProperties } from "react";

export function delay(step = 0): CSSProperties {
  return { "--d": step } as CSSProperties;
}

export function rise(step = 0) {
  return {
    "data-rise": "",
    style: delay(step),
  };
}
