import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { rise } from "@/lib/rise";
import { ServiceCanvas } from "@/components/StageCanvas";
import { projectsForSystem, serviceById, services, t } from "@/lib/content";
import { isLocale, locales } from "@/lib/locale";
import { alternatesFor } from "@/lib/site";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = serviceById(slug);
  const lang = isLocale(locale) ? locale : "ko";
  if (!service) return { title: t(lang).servicesTitle };
  return {
    title: service[lang].name,
    description: service[lang].body,
    alternates: alternatesFor(lang, `/business/${service.id}`),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const service = serviceById(slug);
  if (!service) notFound();
  const text = service[raw];
  const copy = t(raw);
  const related = projectsForSystem(service.id);

  return (
    <article className="px-5 pb-24 pt-28 md:px-8">
      <p className="text-ember">{service.index}</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="order-2 h-[52vh] min-h-[320px] lg:sticky lg:top-24 lg:order-1 lg:h-[68vh]">
          <ServiceCanvas kind={service.id} />
        </div>
        <div className="order-1 lg:order-2 lg:pt-10">
          <h1 className="mask font-display text-4xl leading-tight md:text-7xl">
            <span className="enter block">{text.name}</span>
          </h1>
          <p className="mt-4 text-lg text-ember">{text.line}</p>
          <p className="mt-8 max-w-xl text-lg text-paper">{text.body}</p>
          {text.types && (
            <ul className="mt-8 grid max-w-xl grid-cols-3 gap-px bg-white/10">
              {text.types.map((type, index) => (
                <li key={type} className="bg-ink py-4 pr-3">
                  <span className="block text-xs text-ember">0{index + 1}</span>
                  <span className="mt-2 block text-sm text-paper md:text-base">{type}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-8 text-sm text-mist">{text.seen}</p>
          <Link href={`/${raw}/contact`} className="mt-10 inline-block text-sm tracking-[0.16em] text-paper">
            {copy.nav.contact}
          </Link>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20 border-t border-white/10 pt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl">{copy.relatedTitle}</h2>
            <Link href={`/${raw}/work`} className="text-sm text-mist">
              {copy.nav.work}
            </Link>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((project, index) => (
              <li key={project.id}>
                <Link href={`/${raw}/work/${project.id}`} {...rise(index % 3)} data-frame="" className="group relative block aspect-[4/5] overflow-hidden">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="frame-photo object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block text-xs tracking-[0.14em] text-ember">{project.date}</span>
                    <span className="font-display mt-2 block text-2xl leading-tight text-paper">
                      {project[raw].title}
                    </span>
                    <span className="mt-2 block text-sm text-paper/75">{project[raw].place}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
