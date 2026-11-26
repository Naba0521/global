import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceCanvas } from "@/components/StageCanvas";
import { projectsForSystem, serviceById, services, t } from "@/lib/content";
import { isLocale, locales } from "@/lib/locale";

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
  return { title: service ? service[lang].name : t(lang).servicesTitle };
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
          <h1 className="font-display text-4xl leading-tight md:text-7xl">{text.name}</h1>
          <p className="mt-4 text-lg text-ember">{text.line}</p>
          <p className="mt-8 max-w-xl text-lg text-paper">{text.body}</p>
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
          <ul className="mt-8 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((project) => (
              <li key={project.id} className="bg-ink">
                <Link href={`/${raw}/work#${project.id}`} className="grid grid-cols-[5.5rem_1fr] gap-4 p-4">
                  <span className="relative aspect-[3/4]">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="5.5rem"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs tracking-[0.14em] text-ember">{project.date}</span>
                    <span className="font-display mt-2 block text-xl leading-tight text-paper">
                      {project[raw].title}
                    </span>
                    <span className="mt-1 block text-sm text-mist">{project[raw].place}</span>
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
