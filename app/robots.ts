import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteConfig();
  return site.indexable
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", site.origin).href }
    : { rules: { userAgent: "*", disallow: "/" } };
}
