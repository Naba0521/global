import Image from "next/image";
import Link from "next/link";
import { HeroCanvas } from "@/components/StageCanvas";
import { notFound } from "next/navigation";
import { projects, services, t } from "@/lib/content";
import { isLocale } from "@/lib/locale";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const copy = t(locale);
  const featured = projects.filter((project) => project.featured);
  const latest = projects.filter((project) => project.latest);
  const lines = copy.hero.title.split("\n");

  return (
    <div>
      <section className="relative h-[100svh]">
        <div className="absolute inset-0">
          <HeroCanvas />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[46%] bg-gradient-to-t from-ink via-ink/75 to-transparent" />
        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-5 pb-[max(3.5rem,env(safe-area-inset-bottom))] md:px-8 md:pb-20">
          <p className="text-xs tracking-[0.28em] text-paper/80">{copy.hero.kicker}</p>
          <h1 className="font-display mt-4 max-w-4xl text-[clamp(1.7rem,7.4vw,3rem)] leading-[1.2] text-paper md:text-7xl md:leading-[0.95]">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 text-sm tracking-[0.18em] text-mist">{copy.hero.sub}</p>
        </div>
        <p className="absolute bottom-8 right-6 hidden origin-bottom-right -rotate-90 text-[10px] tracking-[0.35em] text-mist md:block">
          {copy.hero.scroll}
        </p>
      </section>

      <section className="grid border-y border-white/10 md:grid-cols-3">
        {copy.stats.map((stat) => (
          <div key={stat.label} className="border-t border-white/10 px-5 py-8 first:border-t-0 md:border-t-0 md:border-l md:px-8 md:py-10 md:first:border-l-0">
            <p className="font-display text-4xl text-paper md:text-5xl">{stat.value}</p>
            <p className="mt-2 text-xs tracking-[0.2em] text-ember">{stat.unit}</p>
            <p className="mt-3 text-sm text-mist">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="px-5 py-16 md:px-8 md:py-20">
        <p className="text-xs tracking-[0.22em] text-ember">{copy.servicesTitle}</p>
        <h2 className="font-display mt-3 max-w-xl text-3xl leading-tight text-paper md:text-4xl">{copy.servicesLead}</h2>
        <ul className="mt-12">
          {services.map((service) => (
            <li key={service.id} className="border-t border-white/12">
              <Link
                href={`/${locale}/business/${service.id}`}
                className="grid items-baseline gap-4 py-8 md:grid-cols-[8rem_1fr]"
              >
                <span className="font-display text-ember">{service.index}</span>
                <span>
                  <span className="font-display block text-3xl text-paper md:text-5xl">
                    {service[locale].name}
                  </span>
                  <span className="mt-2 block text-mist">{service[locale].line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-8">
        <div className="flex flex-col gap-4 px-5 sm:flex-row sm:items-end sm:justify-between md:px-8">
          <div>
            <p className="text-xs tracking-[0.22em] text-ember">{copy.workTitle}</p>
            <h2 className="font-display mt-3 text-3xl leading-tight md:text-4xl">{copy.workLead}</h2>
          </div>
          <Link href={`/${locale}/work`} className="text-sm text-mist">
            {copy.nav.work}
          </Link>
        </div>
        <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:gap-4 md:px-8 [&::-webkit-scrollbar]:hidden">
          {featured.map((project) => (
            <Link
              key={project.id}
              href={`/${locale}/work#${project.id}`}
              className="relative flex min-h-[62vh] w-[82%] shrink-0 snap-start flex-col justify-end overflow-hidden border border-white/10 p-5 md:min-h-[68vh] md:w-[42%] md:p-6"
            >
              <Image
                src={project.image}
                alt={project[locale].title}
                fill
                sizes="(min-width: 768px) 42vw, 82vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/10" />
              <div className="relative">
                <p className="text-xs tracking-[0.18em] text-ember">{project.date}</p>
                <h3 className="font-display mt-3 text-2xl leading-tight md:text-3xl">{project[locale].title}</h3>
                <p className="mt-2 text-sm text-mist md:text-base">{project[locale].place}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <h2 className="font-display text-3xl">{copy.latestTitle}</h2>
        <div className="mt-8 grid gap-px bg-white/10 md:grid-cols-3">
          {latest.map((project) => (
            <Link key={project.id} href={`/${locale}/work#${project.id}`} className="grid grid-cols-[7.25rem_1fr] bg-ink md:block">
              <div className="relative min-h-36 md:aspect-[4/5]">
                <Image
                  src={project.image}
                  alt={project[locale].title}
                  fill
                  sizes="(min-width: 768px) 34vw, 7.5rem"
                  className="object-cover"
                />
              </div>
              <div className="p-4 md:p-6">
                <p className="text-xs tracking-[0.16em] text-ember">{project.date}</p>
                <h3 className="font-display mt-2 text-xl leading-tight md:mt-4 md:text-2xl">{project[locale].title}</h3>
                <p className="mt-2 text-sm text-mist">{project[locale].place}</p>
                <p className="mt-4 text-xs tracking-[0.14em] text-mist md:mt-6">
                  {project.systems.map((system) => copy.system[system]).join(" · ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-20 md:px-8">
        <h2 className="font-display text-3xl md:text-4xl">{copy.whyTitle}</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {copy.why.map((item) => (
            <article key={item.index}>
              <p className="text-ember">{item.index}</p>
              <h3 className="font-display mt-3 text-2xl">{item.title}</h3>
              <p className="mt-3 text-mist">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8">
        <div className="flex flex-col justify-between gap-8 border border-white/10 px-6 py-10 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl leading-tight md:text-6xl">{copy.cta.title}</h2>
            <p className="mt-4 text-mist">{copy.cta.body}</p>
          </div>
          <a href="tel:+821066166491" className="font-display text-[clamp(1.6rem,7vw,3rem)] text-ember md:text-5xl">
            {copy.cta.phone}
          </a>
        </div>
      </section>
    </div>
  );
}
