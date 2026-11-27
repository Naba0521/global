type Point = [number, number];

function lattice(from: Point, to: Point, width: number, bays: number) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  const nx = (-dy / length) * width;
  const ny = (dx / length) * width;
  const at = (t: number, side: number): string =>
    `${(from[0] + dx * t + nx * side).toFixed(1)} ${(from[1] + dy * t + ny * side).toFixed(1)}`;
  const parts = [`M${at(0, -1)} L${at(1, -1)}`, `M${at(0, 1)} L${at(1, 1)}`];
  let zig = `M${at(0, -1)}`;
  for (let index = 1; index <= bays; index += 1) {
    zig += ` L${at(index / bays, index % 2 === 0 ? -1 : 1)}`;
  }
  parts.push(zig);
  return parts.join(" ");
}

const frame = [
  lattice([-95, 235], [-95, 15], 9, 10),
  lattice([95, 235], [95, 15], 9, 10),
  lattice([-95, 15], [95, 15], 9, 9),
].join(" ");

export function StagePoster({ variant }: { variant: "hero" | "service" }) {
  return (
    <div className="relative h-full w-full bg-ink" aria-hidden>
      <svg
        viewBox="-160 -10 320 270"
        className={
          variant === "hero"
            ? "absolute inset-x-0 top-[10%] mx-auto h-[48%] w-full md:top-[16%] md:h-[58%]"
            : "absolute inset-0 m-auto h-[78%] w-full"
        }
        fill="none"
      >
        <path d={frame} stroke="#d7d9de" strokeOpacity={0.42} strokeWidth={1.4} />
        <path d="M0 100 L22 130 L0 160 L-22 130 Z" fill="#E36B2C" fillOpacity={0.85} />
      </svg>
    </div>
  );
}
