"use client";

import Image from "next/image";
import { useState } from "react";
import { projects, t, type Category } from "@/lib/content";
import type { Locale } from "@/lib/locale";

const filters: (Category | "all")[] = [
  "all",
  "concert",
  "festival",
  "exhibition",
  "broadcast",
];

export function WorkGrid({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const list = projects.filter(
    (project) => filter === "all" || project.category === filter,
  );
  const labels = copy.workPage;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`min-h-10 border px-3 py-2 text-xs tracking-[0.16em] ${
              filter === item
                ? "border-ember bg-ember text-ink"
                : "border-white/20 text-paper"
            }`}
          >
            {labels[item]}
          </button>
        ))}
      </div>
      <ul className="mt-10">
        {list.map((project) => {
          const text = project[locale];
          return (
            <li
              key={project.id}
              id={project.id}
              className="grid scroll-mt-28 grid-cols-[5.5rem_1fr] items-center gap-4 border-t border-white/12 py-4 md:grid-cols-12 md:py-7"
            >
              <div className="relative aspect-[3/4] md:col-span-2">
                <Image
                  src={project.image}
                  alt={text.title}
                  fill
                  sizes="(min-width: 768px) 18vw, 5.5rem"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 md:col-span-10 md:grid md:grid-cols-10 md:items-end">
                <p className="font-display text-sm text-ember md:col-span-2 md:text-base">{project.date}</p>
                <div className="md:col-span-5">
                  <h2 className="font-display text-xl leading-tight text-paper md:text-3xl">{text.title}</h2>
                  <p className="mt-1 text-sm text-mist">{text.place}</p>
                </div>
                <p className="mt-2 text-xs tracking-[0.14em] text-mist md:col-span-3 md:mt-0 md:text-right">
                  {project.systems.map((system) => copy.system[system]).join(" · ")}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
