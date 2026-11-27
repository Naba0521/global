"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { phone, t } from "@/lib/content";
import type { Locale } from "@/lib/locale";

export function CallBar({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const pathname = usePathname();
  const [past, setPast] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const hidden = pathname.endsWith("/contact");

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const watch = new IntersectionObserver(([entry]) => setAtFooter(entry.isIntersecting));
    watch.observe(footer);
    return () => watch.disconnect();
  }, [pathname]);

  const shown = past && !atFooter && !hidden;

  return (
    <a
      href={phone.href}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={`fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex items-center justify-between border border-ember bg-ink/95 px-5 py-4 backdrop-blur-md transition duration-300 md:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="text-sm tracking-[0.18em] text-paper">{copy.nav.call}</span>
      <span className="font-display text-lg text-ember">{phone.display}</span>
    </a>
  );
}
