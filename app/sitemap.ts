import type { MetadataRoute } from "next";
import { categories, items } from "@/lib/catalog";
import { markets } from "@/lib/markets";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { origin } = getSiteConfig();
  const url = (path: string) => new URL(path, origin).href;
  return [
    ...["/", "/how-we-compare", "/disclosure", "/privacy", "/terms"].map((path) => ({ url: url(path) })),
    ...markets.flatMap((market) => [
      { url: url(`/${market}`) },
      ...categories.map((category) => ({ url: url(`/${market}/${category.slug}`) })),
      ...items.filter((item) => item.markets[market]).map((item) => ({ url: url(`/${market}/${item.category}/${item.slug}`), lastModified: item.markets[market]!.checkedOn })),
    ]),
  ];
}
