import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { rise } from "@/lib/rise";
import { phone, projectAfter, projectById, projects, t } from "@/lib/content";
import { isLocale, locales } from "@/lib/locale";
import { alternatesFor } from "@/lib/site";

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, id: project.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const project = projectById(id);
  if (!project || !isLocale(locale)) return {};
  const text = project[locale];
  const copy = t(locale);
  const systems = project.systems.map((system) => copy.system[system]).join(", ");
  const description = [text.place, project.date, systems, text.note].filter(Boolean).join(" · ");
  return {
    title: text.title,
    description,
    alternates: alternatesFor(locale, `/work/${id}`),
    openGraph: { title: text.title, description, images: [project.image] },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const project = projectById(id);
  if (!project) notFound();
  const copy = t(locale);
  const text = project[locale];
  const next = projectAfter(project.id);

  return (
    <article className="pb-24 pt-24 md:pt-28">
      <div className="px-5 md:px-8">
        <Link href={`/${locale}/work`} className="text-xs tracking-[0.18em] text-mist">
          ← {copy.detail.all}
        </Link>
        <h1 className="mask mt-6 max-w-4xl font-display text-4xl leading-tight md:text-7xl">
          <span className="enter block">{text.title}</span>
        </h1>
        {text.note && <p className="mt-5 max-w-2xl text-lg text-ember md:text-2xl">{text.note}</p>}
      </div>

      <div {...rise()} data-frame="" className="group relative mt-10 aspect-[4/5] overflow-hidden md:mx-8 md:aspect-[16/9]">
        <Image
          src={project.image}
          alt={text.title}
          fill
          priority
          sizes="(min-width: 768px) 95vw, 100vw"
          className="frame-photo object-cover"
        />
      </div>

      <dl {...rise(1)} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 px-5 md:grid-cols-4 md:px-8">
        <div>
          <dt className="text-xs tracking-[0.18em] text-ember">{copy.detail.date}</dt>
          <dd className="mt-2 text-lg">{project.date}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.18em] text-ember">{copy.detail.place}</dt>
          <dd className="mt-2 text-lg">{text.place}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.18em] text-ember">{copy.detail.category}</dt>
          <dd className="mt-2 text-lg">{copy.workPage[project.category]}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.18em] text-ember">{copy.detail.systems}</dt>
          <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-lg">
            {project.systems.map((system) => (
              <Link key={system} href={`/${locale}/business/${system}`} className="underline decoration-white/25 underline-offset-4">
                {copy.system[system]}
              </Link>
            ))}
          </dd>
        </div>
      </dl>

      <section className="mx-5 mt-16 flex flex-col gap-6 border border-white/10 px-6 py-8 md:mx-8 md:flex-row md:items-end md:justify-between">
        <p className="max-w-md text-mist">{copy.detail.ask}</p>
        <a href={phone.href} className="font-display text-[clamp(1.6rem,7vw,3rem)] text-ember">
          {phone.display}
        </a>
      </section>

      <Link
        href={`/${locale}/work/${next.id}`}
        className="mx-5 mt-10 grid grid-cols-[6rem_1fr] items-center gap-4 border-t border-white/10 pt-6 md:mx-8"
      >
        <span className="relative aspect-[3/4]">
          <Image src={next.image} alt="" fill sizes="6rem" className="object-cover" />
        </span>
        <span>
          <span className="block text-xs tracking-[0.18em] text-ember">{copy.detail.next} →</span>
          <span className="font-display mt-2 block text-2xl leading-tight">{next[locale].title}</span>
        </span>
      </Link>
    </article>
  );
}
