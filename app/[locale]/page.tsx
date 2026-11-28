import Image from "next/image";
import Link from "next/link";
import { delay, rise } from "@/lib/rise";
import { HeroCanvas } from "@/components/StageCanvas";
import { notFound } from "next/navigation";
import { phone, projects, services, t } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { alternatesFor } from "@/lib/site";

const clients = ["MAMA", "Netflix", "Chanel", "Audemars Piguet", "SBS", "MBC", "Seoul Fashion Week"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { alternates: alternatesFor(isLocale(locale) ? locale : "ko") };
}

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
          <p className="enter text-xs tracking-[0.28em] text-paper/80">{copy.hero.kicker}</p>
          <h1 className="font-display mt-4 max-w-4xl text-[clamp(1.7rem,7.4vw,3rem)] leading-[1.15] text-paper md:text-7xl md:leading-[1.02]">
            {lines.map((line, index) => (
              <span key={line} className="mask">
                <span className="enter block" style={delay(index + 1)}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="enter mt-6 text-sm tracking-[0.18em] text-mist" style={delay(lines.length + 1)}>
            {copy.hero.sub}
          </p>
        </div>
        <p className="enter absolute bottom-8 right-6 hidden origin-bottom-right -rotate-90 text-[11px] tracking-[0.35em] text-mist md:block" style={delay(4)}>
          {copy.hero.scroll}
        </p>
      </section>

      <section className="grid border-y border-white/10 md:grid-cols-3">
        {copy.stats.map((stat, index) => (
          <div key={stat.label} {...rise(index)} className="border-t border-white/10 px-5 py-8 first:border-t-0 md:border-t-0 md:border-l md:px-8 md:py-10 md:first:border-l-0">
            <p className="font-display text-4xl text-paper md:text-6xl">{stat.value}</p>
            <span className="rule mt-4 block h-px w-16 bg-ember" />
            <p className="mt-3 text-xs tracking-[0.2em] text-ember">{stat.unit}</p>
            <p className="mt-3 text-sm text-mist">{stat.label}</p>
          </div>
        ))}
      </section>

      <section id="business" className="scroll-mt-16 py-16 md:py-24">
        <div {...rise()} className="px-5 md:px-8">
          <p className="text-xs tracking-[0.22em] text-ember">{copy.servicesTitle}</p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl leading-[1.05] text-paper md:text-6xl">
            {copy.servicesLead}
          </h2>
        </div>
        <ul className="mt-12 border-t border-white/12">
          {services.map((service, index) => (
            <li key={service.id} {...rise(index)} className="border-b border-white/12">
              <Link
                href={`/${locale}/business/${service.id}`}
                className="group relative grid items-end gap-2 overflow-hidden px-5 py-6 md:grid-cols-[4.5rem_1fr_auto] md:items-center md:gap-8 md:px-8 md:py-9"
              >
                <span className="absolute inset-y-0 left-0 w-0 bg-ember/10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                <span className="absolute bottom-0 left-0 h-px w-0 bg-ember transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                <span className="relative font-display text-sm text-ember">{service.index}</span>
                <span className="relative min-w-0">
                  <span className="font-display block text-[clamp(2rem,6vw,4.25rem)] leading-none text-paper transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                    {service[locale].name}
                  </span>
                  <span className="mt-2 block text-sm text-mist md:text-base">{service[locale].line}</span>
                </span>
                <span className="relative hidden font-display text-3xl text-ember transition-transform duration-700 group-hover:translate-x-2 md:block">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-8">
        <div {...rise()} className="flex flex-col gap-4 px-5 sm:flex-row sm:items-end sm:justify-between md:px-8">
          <div>
            <p className="text-xs tracking-[0.22em] text-ember">{copy.workTitle}</p>
            <h2 className="font-display mt-3 text-3xl leading-tight md:text-4xl">{copy.workLead}</h2>
          </div>
          <Link href={`/${locale}/work`} className="text-sm text-mist">
            {copy.nav.work}
          </Link>
        </div>
        <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:gap-4 md:px-8 [&::-webkit-scrollbar]:hidden">
          {featured.map((project, index) => (
            <Link
              key={project.id}
              href={`/${locale}/work/${project.id}`}
              {...rise(Math.min(index, 3))}
              data-frame=""
              className="group relative flex min-h-[70vh] w-[84%] shrink-0 snap-start flex-col justify-end overflow-hidden md:min-h-[78vh] md:w-[46%]"
            >
              <Image
                src={project.image}
                alt={project[locale].title}
                fill
                sizes="(min-width: 768px) 46vw, 84vw"
                className="frame-photo object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/15" />
              <div className="relative p-5 md:p-7">
                <p className="text-xs tracking-[0.18em] text-ember">{project.date}</p>
                <h3 className="font-display mt-3 max-w-md text-3xl leading-tight md:text-4xl">{project[locale].title}</h3>
                <p className="mt-2 text-sm text-paper/80 md:text-base">{project[locale].place}</p>
                <span className="mt-5 inline-block text-ember transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <h2 {...rise()} className="font-display text-3xl">{copy.latestTitle}</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {latest.map((project, index) => (
            <Link key={project.id} href={`/${locale}/work/${project.id}`} {...rise(index)} data-frame="" className="group relative block aspect-[4/5] overflow-hidden">
              <Image
                src={project.image}
                alt={project[locale].title}
                fill
                sizes="(min-width: 768px) 34vw, 100vw"
                className="frame-photo object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs tracking-[0.16em] text-ember">{project.date}</p>
                <h3 className="font-display mt-2 text-2xl leading-tight">{project[locale].title}</h3>
                <p className="mt-2 text-sm text-paper/75">{project[locale].place}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden border-t border-white/10 py-12 md:py-16">
        <h2 {...rise()} className="px-5 text-xs tracking-[0.22em] text-ember md:px-8">{copy.clientsTitle}</h2>
        <div className="marquee-track mt-6 flex w-max">
          {[0, 1].map((copyIndex) => (
            <p
              key={copyIndex}
              aria-hidden={copyIndex === 1}
              className="flex shrink-0 items-center gap-8 pr-8 font-display text-3xl text-paper md:gap-12 md:pr-12 md:text-5xl"
            >
              {clients.map((name) => (
                <span key={`${copyIndex}-${name}`} className="flex items-center gap-8 md:gap-12">
                  {name}
                  <span className="text-ember">·</span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-20 md:px-8 md:py-28">
        <h2 {...rise()} className="font-display text-4xl md:text-6xl">{copy.whyTitle}</h2>
        <div className="mt-12 grid md:grid-cols-3">
          {copy.why.map((item, index) => (
            <article key={item.index} {...rise(index)} className="border-t border-white/12 py-8 md:border-t-0 md:border-l md:px-8 md:py-0 md:first:border-l-0 md:first:pl-0">
              <span className="rule mb-6 block h-px w-full bg-ember/70" />
              <p className="font-display text-6xl text-white/12 md:text-7xl">{item.index}</p>
              <h3 className="font-display mt-6 text-2xl text-paper">{item.title}</h3>
              <p className="mt-3 max-w-sm text-mist">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section {...rise()} className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
        <h2 className="font-display max-w-4xl text-4xl leading-[1.05] md:text-7xl">{copy.cta.title}</h2>
        <p className="mt-6 max-w-md text-mist">{copy.cta.body}</p>
        <a href={phone.href} className="group relative mt-10 inline-flex items-center gap-4 font-display text-[clamp(1.8rem,6vw,3.5rem)] text-ember">
          {phone.display}
          <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
          <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-500 group-hover:scale-x-100" />
        </a>
      </section>
    </div>
  );
}
