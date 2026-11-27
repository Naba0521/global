import type { MetadataRoute } from "next";
import { projects, services } from "@/lib/content";
import { locales } from "@/lib/locale";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/about",
    "/work",
    "/contact",
    ...services.map((service) => `/business/${service.id}`),
    ...projects.map((project) => `/work/${project.id}`),
  ];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(locales.map((other) => [other, `${siteUrl}/${other}${path}`])),
      },
    })),
  );
}
