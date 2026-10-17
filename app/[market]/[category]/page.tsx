import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemCard } from "@/components/item-card";
import { categories, getCategory, itemsFor } from "@/lib/catalog";
import { isMarket, marketInfo, markets } from "@/lib/markets";
import { pageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ market: string; category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return markets.flatMap((market) => categories.map((category) => ({ market, category: category.slug })));
}

async function resolve(params: Props["params"]) {
  const { market, category: slug } = await params;
  const category = getCategory(slug);
  if (!isMarket(market) || !category) notFound();
  return { market, category };
}

export async function generateMetadata({ params }: Props) {
  const { market, category } = await resolve(params);
  return pageMetadata({
    path: `/${market}/${category.slug}`,
    title: `${category.name}: Amazon vs Costco (${marketInfo[market].shortLabel})`,
    description: category.blurb,
    marketPaths: { us: `/us/${category.slug}`, ca: `/ca/${category.slug}` },
  });
}

export default async function CategoryPage({ params }: Props) {
  const { market, category } = await resolve(params);
  const list = itemsFor(market, category.slug);
  return (
    <div className="av-container">
      <Link className="av-back" href={`/${market}`}>← All {marketInfo[market].label} comparisons</Link>
      <header className="av-item-head">
        <p className="av-eyebrow">{marketInfo[market].label} · {marketInfo[market].currency}</p>
        <h1>{category.name}: Amazon vs Costco</h1>
        <p className="av-lede">{category.blurb}</p>
      </header>
      {list.length ? <div className="av-grid">{list.map((item) => <ItemCard key={item.slug} item={item} market={market} />)}</div> : <p className="av-muted">No comparisons in this category yet.</p>}
    </div>
  );
}
