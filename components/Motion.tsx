"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function Motion() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scope = document.getElementById("content");
    if (!scope) return;

    const watch = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          watch.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    const scan = () => {
      scope.querySelectorAll<HTMLElement>("[data-rise]:not(.in)").forEach((node) => {
        const rect = node.getBoundingClientRect();
        const shown = rect.top < window.innerHeight * 0.9 && rect.bottom > 24;
        if (shown) node.classList.add("in");
        else watch.observe(node);
      });
    };

    const reveal = () => {
      scope.querySelectorAll<HTMLElement>("[data-rise]:not(.in)").forEach((node) => {
        if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
          node.classList.add("in");
          watch.unobserve(node);
        }
      });
    };
    scan();
    root.classList.add("io");
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        reveal();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const changes = new MutationObserver(scan);
    changes.observe(scope, { childList: true, subtree: true });
    return () => {
      watch.disconnect();
      changes.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
