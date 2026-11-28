import Link from "next/link";
import { phone, services, t } from "@/lib/content";
import type { Locale } from "@/lib/locale";

export function Footer({ locale }: { locale: Locale }) {
  const copy = t(locale);
  return (
    <footer className="border-t border-white/10 px-5 pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-sm text-mist md:px-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-paper">{copy.about.officeLabel}</p>
          <p className="mt-2 max-w-xs">{copy.about.office}</p>
        </div>
        <div>
          <p className="text-paper">{copy.about.yardLabel}</p>
          <p className="mt-2 max-w-xs">{copy.about.yard}</p>
        </div>
        <div className="md:text-right">
          <a className="font-display text-2xl text-paper" href={phone.href}>
            {phone.display}
          </a>
          <p className="mt-2">
            <a href="https://www.instagram.com/globalstagegroup/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </p>
        </div>
      </div>
      <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs tracking-[0.14em]">
        {services.map((service) => (
          <Link key={service.id} href={`/${locale}/business/${service.id}`}>
            {service[locale].name}
          </Link>
        ))}
      </nav>
      <div className="mt-8 flex flex-col gap-3 text-xs tracking-[0.16em] sm:flex-row sm:items-center sm:justify-between">
        <span>
          {copy.footer.rights} · {copy.about.repLabel} {copy.about.rep} · {copy.about.regLabel}{" "}
          {copy.about.reg}
        </span>
        <Link href={`/${locale}/contact`}>{copy.nav.contact}</Link>
      </div>
    </footer>
  );
}
