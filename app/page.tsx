import Image from "next/image";
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
        <div className="av-hero-copy">
          <p className="av-eyebrow"><span className="av-eyebrow-mark" /> Independent shopping field notes · US + Canada</p>
          <h1><span className="av-vs-amazon">Amazon</span> vs <span className="av-vs-costco">Costco</span><br />Receipts, not hype.</h1>
          <p className="av-lede">We compare the same item, the bundle, and the cost per use. Every verdict comes with a date and a source. When Costco wins, we say so.</p>
          <div className="av-hero-actions">
            <Link className="av-button" href="/us">Explore US receipts <span aria-hidden="true">↗</span></Link>
            <Link className="av-button av-button-ghost" href="/ca">Canada in CAD</Link>
          </div>
          <div className="av-hero-proof"><span>01 / PRICE</span><span>02 / DATE</span><span>03 / VERDICT</span></div>
        </div>
        <figure className="av-hero-media">
          <Image src="/images/kitchen.jpg" alt="A home cook preparing a meal in a bright kitchen" width={1200} height={800} priority />
          <figcaption><span>THE KITCHEN EDIT</span><span>Illustrative scene · sample comparisons</span></figcaption>
          <span className="av-hero-stamp" aria-hidden="true">FIELD<br />TESTED*</span>
        </figure>
      </section>

      <section className="av-container av-section" aria-labelledby="score-title">
        <div className="av-section-head"><h2 id="score-title">Season scoreboard</h2><Link href="/how-we-compare" className="av-small">How verdicts work</Link></div>
        <div className="av-scoreboards"><Scoreboard market="us" /><Scoreboard market="ca" /></div>
      </section>

      <section className="av-container av-section" aria-labelledby="featured-title">
        <div className="av-section-head"><div><p className="av-kicker">Fresh from the notebook</p><h2 id="featured-title">Latest showdowns <span className="av-heading-note">/ US</span></h2></div><Link href="/us" className="av-small av-arrow-link">All US items <span aria-hidden="true">↗</span></Link></div>
        <div className="av-grid">{featured.map((item) => <ItemCard key={item.slug} item={item} market="us" />)}</div>
      </section>

      <section className="av-container av-section" aria-labelledby="categories-title">
        <div className="av-section-head"><div><p className="av-kicker">Browse the shelves</p><h2 id="categories-title">Categories</h2></div></div>
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
        <div className="av-section-head"><div><p className="av-kicker">Watch, then check the receipt</p><h2 id="videos-title">From our videos</h2></div></div>
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
