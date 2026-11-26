import { notFound } from "next/navigation";
import { WorkGrid } from "@/components/WorkGrid";
import { t } from "@/lib/content";
import { isLocale } from "@/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = t(isLocale(locale) ? locale : "ko");
  return { title: copy.workPage.title };
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
      <h1 className="font-display text-4xl md:text-7xl">{copy.workPage.title}</h1>
      <p className="mt-4 max-w-xl text-mist">{copy.workLead}</p>
      <div className="mt-12">
        <WorkGrid locale={raw} />
      </div>
    </article>
  );
}
