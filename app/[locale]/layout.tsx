import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LocaleLang } from "@/components/LocaleLang";
import { t } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/locale";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = t(isLocale(locale) ? locale : "ko");
  return {
    title: {
      default: copy.meta.title,
      template: "%s · Global Stage Group",
    },
    description: copy.meta.description,
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
  return (
    <>
      <LocaleLang locale={locale} />
      <Header locale={locale} />
      <main id="content">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
