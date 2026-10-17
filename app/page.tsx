import Link from "next/link";
import { EmailSignup } from "@/components/email-signup";
import { ItemCard } from "@/components/item-card";
import { Scoreboard } from "@/components/scoreboard";
import { categories, itemsFor, videoKind, videos, videoStatus } from "@/lib/catalog";
import { marketInfo } from "@/lib/markets";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/",
  title: "Amazon vs Costco, with receipts",
  description: "Home and kitchen price comparisons between Amazon and Costco in the US and Canada, with dated sources and honest verdicts.",
});

export default function HomePage() {
  const featured = itemsFor("us").slice(0, 3);
  return (
    <>
      <section className="av-container av-hero">
        <p className="av-eyebrow">Home &amp; kitchen · US and Canada</p>
        <h1><span className="av-vs-amazon">Amazon</span> vs <span className="av-vs-costco">Costco</span>. Receipts, not hype.</h1>
        <p className="av-lede">Every verdict shows the price, the date, and where it came from. When Costco wins, we say so, even though Costco pays us nothing.</p>
        <div className="av-hero-actions">
          <Link className="av-button" href="/us">US comparisons</Link>
          <Link className="av-button av-button-ghost" href="/ca">Canada comparisons</Link>
        </div>
      </section>

      <section className="av-container av-section" aria-labelledby="score-title">
        <div className="av-section-head"><h2 id="score-title">Season scoreboard</h2><Link href="/how-we-compare" className="av-small">How verdicts work</Link></div>
        <div className="av-scoreboards"><Scoreboard market="us" /><Scoreboard market="ca" /></div>
      </section>

      <section className="av-container av-section" aria-labelledby="featured-title">
        <div className="av-section-head"><h2 id="featured-title">Latest showdowns (US)</h2><Link href="/us" className="av-small">All US items</Link></div>
        <div className="av-grid">{featured.map((item) => <ItemCard key={item.slug} item={item} market="us" />)}</div>
      </section>

      <section className="av-container av-section" aria-labelledby="categories-title">
        <div className="av-section-head"><h2 id="categories-title">Categories</h2></div>
        <div className="av-grid">
          {categories.map((category) => (
            <article className="av-card" key={category.slug}>
              <h3>{category.name}</h3>
              <p className="av-muted av-small">{category.blurb}</p>
              <div className="av-card-markets">
                <Link href={`/us/${category.slug}`}>US ({itemsFor("us", category.slug).length})</Link>
                <Link href={`/ca/${category.slug}`}>Canada ({itemsFor("ca", category.slug).length})</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="av-container av-section" aria-labelledby="videos-title">
        <div className="av-section-head"><h2 id="videos-title">From our videos</h2></div>
        <div className="av-panel">
          {videos.map((video) => (
            <div className="av-video" key={video.id}>
              <div>
                <Link href={`/v/${video.id}`}><strong>{video.title}</strong></Link>
                <p className="av-small av-muted">{videoKind(video)} · {video.format === "long" ? `${video.entries.length} items` : "1 item"} · {marketInfo[video.market].label} · prices from {video.priceDate} · sample video record</p>
              </div>
              {videoStatus(video) === "current" ? <span className="av-badge">All verdicts still hold</span> : <span className="av-badge av-verdict-pending">Verdict updated since this video</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="av-container av-section"><EmailSignup /></section>
    </>
  );
}
