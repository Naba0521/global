import Image from "next/image";
import { notFound } from "next/navigation";
import { ServiceCanvas } from "@/components/StageCanvas";
import { phone, t } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ko";
  const copy = t(locale);
  return {
    title: copy.about.title,
    description: copy.about.body,
    alternates: alternatesFor(locale, "/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const copy = t(raw);

  return (
    <article className="px-5 pb-24 pt-28 md:px-8 md:pt-32">
      <p className="text-xs tracking-[0.22em] text-ember">{copy.meta.title}</p>
      <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight md:text-7xl">{copy.about.lead}</h1>
      <div className="mt-12 grid items-center gap-10 md:grid-cols-[16rem_1fr]">
        <div className="h-56 md:h-64">
          <ServiceCanvas kind="truss" />
        </div>
        <div className="max-w-xl">
          <p className="text-lg text-paper">{copy.about.body}</p>
          <p className="mt-8 text-mist">{copy.about.letter}</p>
          <p className="mt-6 text-sm tracking-[0.16em] text-ember">{copy.about.sign}</p>
        </div>
      </div>
      <dl className="mt-16 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs tracking-[0.18em] text-ember">{copy.about.foundedLabel}</dt>
          <dd className="mt-2 text-lg">{copy.about.founded}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.18em] text-ember">{copy.about.repLabel}</dt>
          <dd className="mt-2 text-lg">{copy.about.rep}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.18em] text-ember">{copy.about.regLabel}</dt>
          <dd className="mt-2 text-lg">{copy.about.reg}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.18em] text-ember">{copy.about.phoneLabel}</dt>
          <dd className="mt-2 text-lg">
            <a href={phone.href}>{phone.display}</a>
          </dd>
        </div>
      </dl>
      <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.18em] text-ember">{copy.about.officeLabel}</p>
          <p className="mt-3 max-w-sm text-xl">{copy.about.office}</p>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-ember">{copy.about.yardLabel}</p>
          <p className="mt-3 max-w-sm text-xl">{copy.about.yard}</p>
        </div>
      </div>
      <figure className="mt-16">
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-[16/9]">
          <Image
            src="/work/physical.jpg"
            alt={copy.about.photoAlt}
            fill
            sizes="(min-width: 768px) 90vw, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3 text-sm text-mist">{copy.about.photoCaption}</figcaption>
      </figure>
    </article>
  );
}
