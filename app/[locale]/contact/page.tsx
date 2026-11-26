import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { t } from "@/lib/content";
import { isLocale } from "@/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = t(isLocale(locale) ? locale : "ko");
  return { title: copy.contact.title };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const copy = t(raw);
  const officeQuery = encodeURIComponent("경기도 파주시 와석순환로 507");
  const yardQuery = encodeURIComponent("경기도 파주시 조리읍 정문로 114-27");

  return (
    <article className="px-5 pb-24 pt-28 md:px-8 md:pt-32">
      <h1 className="font-display text-4xl md:text-7xl">{copy.contact.title}</h1>
      <p className="mt-4 max-w-xl text-mist">{copy.contact.lead}</p>
      <a href="tel:+821066166491" className="font-display mt-8 inline-block text-[clamp(1.75rem,8vw,3.75rem)] text-ember">
        010-6616-6491
      </a>
      <div className="mt-14 grid gap-16 md:grid-cols-2">
        <ContactForm locale={raw} />
        <div className="grid content-start gap-8">
          <Address
            label={copy.about.officeLabel}
            value={copy.about.office}
            href={`https://map.naver.com/p/search/${officeQuery}`}
            map={copy.contact.map}
          />
          <Address
            label={copy.about.yardLabel}
            value={copy.about.yard}
            href={`https://map.naver.com/p/search/${yardQuery}`}
            map={copy.contact.map}
          />
        </div>
      </div>
    </article>
  );
}

function Address({
  label,
  value,
  href,
  map,
}: {
  label: string;
  value: string;
  href: string;
  map: string;
}) {
  return (
    <div>
      <p className="text-xs tracking-[0.18em] text-ember">{label}</p>
      <p className="mt-3 text-xl">{value}</p>
      <a href={href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-mist">
        {map}
      </a>
    </div>
  );
}
