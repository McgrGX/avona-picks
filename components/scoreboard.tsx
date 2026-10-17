import Link from "next/link";
import { scoreboard } from "@/lib/catalog";
import { marketInfo, type Market } from "@/lib/markets";

export function Scoreboard({ market, link = true }: { market: Market; link?: boolean }) {
  const score = scoreboard(market);
  const label = marketInfo[market].label;
  return (
    <section className="av-scoreboard" aria-labelledby={`score-${market}`}>
      <h3 id={`score-${market}`}><span>{label} season score</span>{link && <Link href={`/${market}`} className="av-small">See all</Link>}</h3>
      <div className="av-score" role="group" aria-label={`${label}: Amazon ${score.amazon}, Costco ${score.costco}`}>
        <div className="av-score-side av-vs-amazon"><span className="av-score-num">{score.amazon}</span><span className="av-score-label">Amazon</span></div>
        <span className="av-score-dash" aria-hidden="true">–</span>
        <div className="av-score-side av-vs-costco"><span className="av-score-num">{score.costco}</span><span className="av-score-label">Costco</span></div>
      </div>
      <p className="av-score-foot">{score.tie} ties · {score.pending} pending · member prices</p>
    </section>
  );
}
