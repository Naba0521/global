import { notFound } from "next/navigation";
import { rise } from "@/lib/rise";
import { WorkGrid } from "@/components/WorkGrid";
import { t } from "@/lib/content";
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
    title: copy.workPage.title,
    description: copy.workLead,
    alternates: alternatesFor(locale, "/work"),
  };
}

export default async function WorkPage({
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
      <h1 className="mask mt-4 font-display text-4xl md:text-7xl">
        <span className="enter block">{copy.workPage.title}</span>
      </h1>
      <p {...rise(1)} className="mt-4 max-w-xl text-mist">{copy.workLead}</p>
      <div className="mt-12">
        <WorkGrid locale={raw} />
      </div>
    </article>
  );
}
