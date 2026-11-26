"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { services, t } from "@/lib/content";
import { isLocale, otherLocale, type Locale } from "@/lib/locale";
import { Logo } from "./Logo";

export function Header({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }
  const other = otherLocale(locale);
  const swapped = swapLocale(pathname, locale, other);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const main = document.getElementById("content");
    const footer = document.querySelector("footer");
    if (main) main.inert = open;
    if (footer) footer.inert = open;
    return () => {
      document.body.style.overflow = "";
      if (main) main.inert = false;
      if (footer) footer.inert = false;
    };
  }, [open]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const closeIfWide = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener("change", closeIfWide);
    return () => wide.removeEventListener("change", closeIfWide);
  }, []);

  const links = [
    { href: `/${locale}/about`, label: copy.nav.about },
    { href: `/${locale}/work`, label: copy.nav.work },
    { href: `/${locale}/contact`, label: copy.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="relative z-50 flex items-center justify-between bg-ink/90 px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-md md:px-8 md:pt-4 md:pb-4">
        <Link
          href={`/${locale}`}
          aria-label="Global Stage Group"
          className="flex min-w-0 items-center gap-2.5 text-ember"
          onClick={() => setOpen(false)}
        >
          <Logo className="h-8 w-8 shrink-0" />
          <span className="font-display whitespace-nowrap text-[10px] tracking-[0.14em] sm:text-xs sm:tracking-[0.18em]">
            GLOBAL STAGE GROUP
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-paper md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="tracking-wide">
              {link.label}
            </Link>
          ))}
          <LocaleSwitch locale={locale} href={swapped} />
        </nav>
        <button
          type="button"
          className="min-h-11 min-w-11 px-2 text-sm tracking-[0.16em] text-paper md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {open ? copy.nav.close : copy.nav.menu}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink px-6 pb-10 pt-24 text-paper md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-t border-white/15 py-5 font-display text-4xl"
              onClick={(event) => {
                event.preventDefault();
                go(link.href);
              }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col text-mist">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/${locale}/business/${service.id}`}
                className="py-3"
                onClick={(event) => {
                  event.preventDefault();
                  go(`/${locale}/business/${service.id}`);
                }}
              >
                {service.index} {service[locale].name}
              </Link>
            ))}
          </div>
          <LocaleSwitch
            locale={locale}
            href={swapped}
            onNavigate={() => go(swapped)}
          />
        </div>
      )}
    </header>
  );
}

function swapLocale(pathname: string, from: Locale, to: Locale) {
  const parts = pathname.split("/");
  if (parts[1] === from) parts[1] = to;
  else parts.splice(1, 0, to);
  const next = parts.join("/");
  return next.startsWith("/") ? next : `/${to}`;
}

function LocaleSwitch({
  locale,
  href,
  onNavigate,
}: {
  locale: Locale;
  href: string;
  onNavigate?: () => void;
}) {
  const safe = isLocale(locale) ? locale : "ko";
  return (
    <Link
      href={href}
      className="mt-8 inline-flex gap-2 text-sm tracking-[0.18em] text-paper md:mt-0"
      onClick={
        onNavigate
          ? (event) => {
              event.preventDefault();
              onNavigate();
            }
          : undefined
      }
    >
      <span className={safe === "ko" ? "text-ember" : "text-white/50"}>KR</span>
      <span className="text-white/30">/</span>
      <span className={safe === "en" ? "text-ember" : "text-white/50"}>EN</span>
    </Link>
  );
}
