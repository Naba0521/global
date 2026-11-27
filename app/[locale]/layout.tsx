import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CallBar } from "@/components/CallBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LocaleLang } from "@/components/LocaleLang";
import { phone, t } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/locale";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ko";
  const copy = t(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: copy.meta.title,
      template: "%s · Global Stage Group",
    },
    description: copy.meta.description,
    openGraph: {
      type: "website",
      siteName: "Global Stage Group",
      title: copy.meta.title,
      description: copy.meta.description,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      images: ["/work/mama.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <LocaleFrame locale={locale}>{children}</LocaleFrame>
  );
}

function LocaleFrame({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const copy = t(locale);
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: locale === "ko" ? "글로벌스테이지그룹" : "Global Stage Group",
    alternateName: locale === "ko" ? "Global Stage Group" : "글로벌스테이지그룹",
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/work/mama.jpg`,
    telephone: phone.href.replace("tel:", ""),
    description: copy.meta.description,
    foundingDate: "2022-03-17",
    taxID: copy.about.reg,
    address: {
      "@type": "PostalAddress",
      streetAddress: copy.about.office,
      addressLocality: locale === "ko" ? "파주시" : "Paju",
      addressRegion: locale === "ko" ? "경기도" : "Gyeonggi-do",
      addressCountry: "KR",
    },
    sameAs: ["https://www.instagram.com/globalstagegroup/"],
  };

  return (
    <>
      <LocaleLang locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
      />
      <Header locale={locale} />
      <main id="content">{children}</main>
      <Footer locale={locale} />
      <CallBar locale={locale} />
    </>
  );
}
