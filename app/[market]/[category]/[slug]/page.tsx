import Link from "next/link";
import { notFound } from "next/navigation";
import { VerdictBadge, verdictLabel } from "@/components/verdict-badge";
import { comparisonTypeLabel, compareItem, entryStatus, getCategory, getItem, items, videoKind, videosFor, type AmazonListing, type CostcoListing, type PriceSource } from "@/lib/catalog";
import { TIE_BAND_PERCENT } from "@/lib/compare";
import { formatMoney, isMarket, marketInfo, markets, retailerName, type Market, type Retailer } from "@/lib/markets";
import { getLinkNote, getOutboundRel, getOutboundUrl } from "@/lib/outbound";
import { pageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ market: string; category: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return items.flatMap((item) => markets.filter((market) => item.markets[market]).map((market) => ({ market, category: item.category, slug: item.slug })));
}

async function resolve(params: Props["params"]) {
  const { market, category, slug } = await params;
  const item = getItem(slug);
  if (!isMarket(market) || !item || item.category !== category || !item.markets[market]) notFound();
  return { market, item, listing: item.markets[market]!, category: getCategory(category)! };
}

function marketPaths(item: NonNullable<ReturnType<typeof getItem>>) {
  const paths: Partial<Record<Market, string>> = {};
  for (const market of markets) if (item.markets[market]) paths[market] = `/${market}/${item.category}/${item.slug}`;
  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { market, item, listing } = await resolve(params);
  return pageMetadata({
    path: `/${market}/${item.category}/${item.slug}`,
    title: `${item.name}: Amazon vs Costco (${marketInfo[market].shortLabel})`,
    description: `${item.summary} ${verdictLabel[compareItem(item, market).member]} on member prices.`,
    marketPaths: marketPaths(item),
    modified: listing.checkedOn,
  });
}

function sourceLabel(source: PriceSource): string {
  switch (source.kind) {
    case "sample": return "Sample price (prototype data)";
    case "costco-online": return `Costco online price, checked ${source.checkedOn}`;
    case "in-warehouse": return `In-warehouse price, ${source.region}, ${source.observedOn}`;
    case "amazon-api": return "Live from Amazon at page load";
  }
}

function Side({ retailer, listing, total, market }: { retailer: Retailer; listing: AmazonListing | CostcoListing; total?: number; market: Market }) {
  const name = retailerName[retailer];
  return (
    <section className={`av-side av-side-${retailer}`} aria-labelledby={`side-${retailer}`}>
      <h2 id={`side-${retailer}`}><span className={`av-vs-${retailer}`}>{name}</span><span className="av-badge">{retailer === "costco" ? "Membership required" : "No membership needed"}</span></h2>
      {total === undefined ? <p className="av-price-pending">Check current price on {name}</p> : <p className="av-price">{formatMoney(total, market)}</p>}
      <dl className="av-dl">
        <dt>Pack</dt><dd>{listing.packLabel}</dd>
        {listing.price !== undefined && <><dt>Price</dt><dd>{formatMoney(listing.price, market)}</dd><dt>Delivery</dt><dd>{listing.delivery ? formatMoney(listing.delivery, market) : "Included or free"}</dd></>}
        <dt>Source</dt><dd>{sourceLabel(listing.source)}</dd>
      </dl>
      <a className={`av-button av-button-${retailer}`} href={getOutboundUrl(listing.offer, retailer, market)} target="_blank" rel={getOutboundRel(listing.offer)}>
        Visit {name}<span className="av-sr-only"> (opens in a new tab)</span>
      </a>
      <p className="av-link-note">{getLinkNote(listing.offer, retailer)}</p>
    </section>
  );
}

export default async function ItemPage({ params }: Props) {
  const { market, item, listing, category } = await resolve(params);
  const result = compareItem(item, market);
  const info = marketInfo[market];
  const paths = marketPaths(item);
  const itemVideos = videosFor(item.slug, market);
  return (
    <div className="av-container">
      <Link className="av-back" href={`/${market}/${item.category}`}>← {category.name} ({info.shortLabel})</Link>
      <header className="av-item-head">
        <div className="av-card-meta">
          <span className="av-badge" title={comparisonTypeLabel[item.comparison].explain}>{comparisonTypeLabel[item.comparison].label}</span>
          <span className="av-badge">{info.label} · {info.currency}</span>
        </div>
        <h1>{item.name}</h1>
        <p className="av-lede">{item.summary}</p>
        <p className="av-small av-muted">Prices checked <time dateTime={listing.checkedOn}>{listing.checkedOn}</time>. {comparisonTypeLabel[item.comparison].explain}</p>
        <nav className="av-market-switch" aria-label="Market">
          <span className="av-muted">Market:</span>
          {markets.filter((m) => paths[m]).map((m) => <Link key={m} href={paths[m]!} aria-current={m === market ? "page" : undefined}>{marketInfo[m].label}</Link>)}
        </nav>
      </header>

      <section className={`av-verdict-card av-verdict-${result.member}`} aria-labelledby="verdict-title">
        <p className="av-eyebrow" style={{ margin: 0 }}>Verdict for Costco members</p>
        <h2 id="verdict-title" className={`av-verdict-title av-vs-${result.member === "amazon" || result.member === "costco" ? result.member : "tie"}`}>{verdictLabel[result.member]}</h2>
        {result.savings && <p>Saves {formatMoney(result.savings.amount, market)} at {retailerName[result.savings.winner]} on the sample prices.</p>}
        {result.member === "tie" && <p>The gap is within {TIE_BAND_PERCENT}%. Buy wherever is more convenient.</p>}
        {result.member === "pending" && <p>Amazon prices are shown only live from Amazon. Until then, there is no verdict.</p>}
        <p className="av-small">Not a member? Including the {formatMoney(info.sampleMembershipFee, market)} sample membership fee: <VerdictBadge verdict={result.joiner} /></p>
      </section>

      <div className="av-faceoff">
        <Side retailer="amazon" listing={listing.amazon} total={result.amazonTotal} market={market} />
        <Side retailer="costco" listing={listing.costco} total={result.costcoTotal} market={market} />
      </div>

      <section className="av-panel" aria-labelledby="diff-title">
        <h2 id="diff-title">What&apos;s different</h2>
        <ul>{item.differences.map((difference) => <li key={difference}>{difference}</li>)}</ul>
        <p className="av-small av-muted">Return, warranty, and delivery terms vary. Check each retailer&apos;s current policy before buying.</p>
      </section>

      {itemVideos.length > 0 && (
        <section className="av-panel" aria-labelledby="videos-title">
          <h2 id="videos-title">In our videos</h2>
          {itemVideos.map((video) => {
            const entry = video.entries.find((e) => e.itemSlug === item.slug)!;
            return (
              <div className="av-video" key={video.id}>
                <div>
                  <Link href={`/v/${video.id}`}><strong>{video.title}</strong></Link>
                  <p className="av-small av-muted">{videoKind(video)} · video verdict: {verdictLabel[entry.verdict]} · prices from {video.priceDate}</p>
                </div>
                {entryStatus(video, entry) === "updated" && <p className="av-alert" role="status">Verdict updated since this video. The prices above are newer.</p>}
              </div>
            );
          })}
        </section>
      )}

      <p className="av-small av-muted" style={{ marginTop: "1rem" }}>Avona Picks is not affiliated with Amazon or Costco. <Link href="/disclosure">Affiliate disclosure</Link> · <Link href="/how-we-compare">How we compare</Link></p>
    </div>
  );
}
