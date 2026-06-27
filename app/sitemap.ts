import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const pages = ["", "about", "services", "massage", "home-services", "barbers", "gallery", "offers", "membership", "pricing", "book", "reviews", "blog", "faq", "privacy", "terms", "careers", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ["en", "ar"].flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteConfig.url}/${locale}${page ? `/${page}` : ""}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "daily" : "weekly",
      priority: page === "" ? 1 : 0.7
    }))
  );
}
