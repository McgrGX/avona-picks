import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemCard } from "@/components/item-card";
import { Scoreboard } from "@/components/scoreboard";
import { categories, itemsFor } from "@/lib/catalog";
import { isMarket, marketInfo, markets } from "@/lib/markets";
import { pageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ market: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return markets.map((market) => ({ market }));
}

export async function generateMetadata({ params }: Props) {
  const { market } = await params;
  if (!isMarket(market)) notFound();
  return pageMetadata({
    path: `/${market}`,
    title: `Amazon vs Costco in ${marketInfo[market].label}`,
    description: `Home and kitchen price showdowns between Amazon and Costco in ${marketInfo[market].label}, in ${marketInfo[market].currency}.`,
    marketPaths: { us: "/us", ca: "/ca" },
  });
}

export default async function MarketPage({ params }: Props) {
  const { market } = await params;
  if (!isMarket(market)) notFound();
  const info = marketInfo[market];
  return (
    <>
      <section className="av-container av-hero">
        <p className="av-eyebrow">{info.label} · prices in {info.currency}</p>
        <h1><span className="av-vs-amazon">Amazon</span> vs <span className="av-vs-costco">Costco</span> in {info.label}</h1>
        <p className="av-lede">{market === "ca" ? "Comparisons use amazon.ca and costco.ca. Quebec coverage is paused for now." : "Comparisons use amazon.com and costco.com."}</p>
      </section>
      <section className="av-container av-section" aria-label="Scoreboard"><div className="av-scoreboards"><Scoreboard market={market} link={false} /></div></section>
      {categories.map((category) => (
        <section className="av-container av-section" key={category.slug} aria-labelledby={`cat-${category.slug}`}>
          <div className="av-section-head">
            <h2 id={`cat-${category.slug}`}>{category.name}</h2>
            <Link href={`/${market}/${category.slug}`} className="av-small">View category</Link>
          </div>
          <div className="av-grid">{itemsFor(market, category.slug).map((item) => <ItemCard key={item.slug} item={item} market={market} />)}</div>
        </section>
      ))}
    </>
  );
}
