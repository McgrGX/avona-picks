import Image from "next/image";
import Link from "next/link";
import { comparisonTypeLabel, compareItem, type Item } from "@/lib/catalog";
import { formatMoney, type Market } from "@/lib/markets";
import { VerdictBadge } from "./verdict-badge";

export function ItemCard({ item, market }: { item: Item; market: Market }) {
  const result = compareItem(item, market);
  const image = item.category === "coffee-espresso" ? "/images/kitchen.jpg" : "/images/appliance.jpg";
  return (
    <article className="av-card av-product-card">
      <div className="av-card-image-wrap">
        <Image className="av-card-image" src={image} alt={item.category === "coffee-espresso" ? "Illustrative home kitchen scene" : "Illustrative countertop appliance scene"} width={900} height={600} />
        <span className="av-image-tag">SAMPLE COMPARISON</span>
      </div>
      <div className="av-card-body">
        <div className="av-card-meta">
          <VerdictBadge verdict={result.member} />
          <span className="av-badge">{comparisonTypeLabel[item.comparison].label}</span>
        </div>
        <h3><Link className="av-card-link" href={`/${market}/${item.category}/${item.slug}`}>{item.name}</Link></h3>
        <p className="av-muted av-small">{item.summary}</p>
        <p className="av-small av-price-pair">
          <span className="av-vs-amazon">Amazon {result.amazonTotal === undefined ? "price pending" : formatMoney(result.amazonTotal, market)}</span>
          <span className="av-price-divider" aria-hidden="true">/</span>
          <span className="av-vs-costco">Costco {formatMoney(result.costcoTotal, market)}</span>
        </p>
      </div>
    </article>
  );
}
