import Link from "next/link";
import { TIE_BAND_PERCENT } from "@/lib/compare";
import { comparisonTypeLabel, type ComparisonType } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  path: "/how-we-compare",
  title: "How we compare",
  description: "How Avona Picks compares Amazon and Costco prices: comparison types, sources, dates, tie bands, and corrections.",
});

export default function HowWeComparePage() {
  return (
    <article className="av-container av-prose">
      <p className="av-eyebrow">Methodology</p>
      <h1>How we compare</h1>
      <p className="av-lede">A verdict is only as good as its receipts. Every comparison shows what we compared, the price we used, where it came from, and when we checked it.</p>

      <h2>1. What counts as the same item</h2>
      <div className="av-table-wrap">
        <table className="av-table">
          <thead><tr><th scope="col">Label</th><th scope="col">Meaning</th></tr></thead>
          <tbody>{(Object.keys(comparisonTypeLabel) as ComparisonType[]).map((type) => <tr key={type}><th scope="row">{comparisonTypeLabel[type].label}</th><td>{comparisonTypeLabel[type].explain}</td></tr>)}</tbody>
        </table>
      </div>
      <p>Costco often sells its own model numbers or bundles. We list every difference we find, such as extra batteries, accessories, or pack sizes.</p>

      <h2>2. The price we use</h2>
      <ul>
        <li><strong>Total cost</strong> is the price plus delivery. Bundle extras are listed, not given a dollar value.</li>
        <li><strong>Amazon prices</strong> are shown only live from Amazon. Until we have live access, Amazon shows &ldquo;Check current price&rdquo; and the verdict is pending.</li>
        <li><strong>Costco prices</strong> are either the costco.com or costco.ca online price, or an in-warehouse price with the date and region. Online and warehouse prices often differ.</li>
        <li>US comparisons use USD and Canadian comparisons use CAD. We never convert currencies to pick a winner.</li>
      </ul>

      <h2>3. How we pick a winner</h2>
      <ul>
        <li>If the totals are within {TIE_BAND_PERCENT}% of each other, we call it a <strong>tie</strong>.</li>
        <li>The headline verdict assumes you already have a Costco membership. We also show the verdict if you would join just for this purchase.</li>
      </ul>

      <h2>4. Where leads come from</h2>
      <p>Deal communities, reader tips, and our own shopping point us to items worth checking. A tip is never published as a price. We verify it against the retailer first.</p>

      <h2>5. Videos and corrections</h2>
      <p>Each short is linked to the item page with the date of its prices. If a price or verdict changes, the item page says &ldquo;Verdict updated since this video.&rdquo; To report an error, email <span className="av-placeholder">[corrections email]</span>.</p>

      <h2>6. Money</h2>
      <p>We may earn from approved Amazon affiliate links. Costco does not pay us. Neither retailer reviews or approves our verdicts. See the <Link href="/disclosure">affiliate disclosure</Link>.</p>
    </article>
  );
}
