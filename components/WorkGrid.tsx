"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { projects, t, type Category } from "@/lib/content";
import { rise } from "@/lib/rise";
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
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`min-h-10 text-xs tracking-[0.18em] underline-offset-8 ${
              filter === item ? "text-ember underline decoration-ember" : "text-mist"
            }`}
          >
            {labels[item]}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((project, index) => {
          const text = project[locale];
          return (
            <li key={project.id} id={project.id} className="scroll-mt-28">
              <Link href={`/${locale}/work/${project.id}`} {...rise(index % 3)} data-frame="" className="group relative block aspect-[4/5] overflow-hidden">
                <Image
                  src={project.image}
                  alt={text.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="frame-photo object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs tracking-[0.16em] text-ember">{project.date}</p>
                  <h2 className="font-display mt-2 text-2xl leading-tight text-paper">{text.title}</h2>
                  <p className="mt-2 text-sm text-paper/75">{text.place}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
