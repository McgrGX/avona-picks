import Link from "next/link";
import { notFound } from "next/navigation";
import { VerdictBadge, verdictLabel } from "@/components/verdict-badge";
import { compareItem, entryStatus, getItem, getVideo, videoKind, videos } from "@/lib/catalog";
import { marketInfo } from "@/lib/markets";
import { pageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return videos.map((video) => ({ id: video.id }));
}

async function resolve(params: Props["params"]) {
  const video = getVideo((await params).id);
  if (!video) notFound();
  return video;
}

export async function generateMetadata({ params }: Props) {
  const video = await resolve(params);
  return pageMetadata({ path: `/v/${video.id}`, title: `Receipts: ${video.title}`, description: `Prices and current verdicts for every item in "${video.title}".`, index: false });
}

export default async function VideoReceiptsPage({ params }: Props) {
  const video = await resolve(params);
  const info = marketInfo[video.market];
  return (
    <div className="av-container">
      <header className="av-item-head" style={{ paddingTop: "2rem" }}>
        <p className="av-eyebrow">Video receipts · {videoKind(video)} · {info.label}</p>
        <h1>{video.title}</h1>
        <p className="av-lede">Prices in this video are from <time dateTime={video.priceDate}>{video.priceDate}</time>. Here is every item, the verdict we gave, and the verdict now.</p>
      </header>
      <ol className="av-grid" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {video.entries.map((entry, index) => {
          const item = getItem(entry.itemSlug)!;
          const now = compareItem(item, video.market).member;
          const updated = entryStatus(video, entry) === "updated";
          return (
            <li className="av-card" key={entry.itemSlug}>
              <p className="av-small av-muted">{video.format === "long" ? `Item ${index + 1}` : "Featured item"}</p>
              <h2 style={{ fontSize: "1.1rem" }}><Link className="av-card-link" href={`/${video.market}/${item.category}/${item.slug}`}>{item.name}</Link></h2>
              <p className="av-small">In the video: {verdictLabel[entry.verdict]}</p>
              <div className="av-card-meta"><VerdictBadge verdict={now} prefix="Now" /></div>
              {updated && <p className="av-alert">Verdict updated since this video</p>}
            </li>
          );
        })}
      </ol>
      <p className="av-small av-muted" style={{ marginTop: "1.5rem" }}>Amazon links may earn us a commission once approved. Costco pays us nothing. <Link href="/how-we-compare">How we compare</Link> · <Link href="/disclosure">Affiliate disclosure</Link></p>
    </div>
  );
}
