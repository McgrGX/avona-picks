import type { Metadata } from "next";
import { marketInfo, type Market } from "./markets";
import { getSiteConfig } from "./site-config";

type Options = { path: string; title: string; description: string; marketPaths?: Partial<Record<Market, string>>; modified?: string; index?: false };

export function pageMetadata({ path, title, description, marketPaths, modified, index }: Options): Metadata {
  const site = getSiteConfig();
  const absolute = (p: string) => new URL(p, site.origin).href;
  const canonical = absolute(path);
  let languages: Record<string, string> | undefined;
  if (marketPaths) {
    languages = {};
    for (const [market, marketPath] of Object.entries(marketPaths) as [Market, string][]) languages[marketInfo[market].hreflang] = absolute(marketPath);
    languages["x-default"] = absolute(marketPaths.us ?? path);
  }
  return {
    title,
    description,
    metadataBase: new URL(site.origin),
    alternates: { canonical, languages },
    robots: { index: index ?? site.indexable, follow: site.indexable },
    openGraph: {
      title: `${title} | Avona Picks`, description, url: canonical, siteName: "Avona Picks",
      ...(modified ? { type: "article", modifiedTime: modified } : { type: "website" }),
    },
  };
}
