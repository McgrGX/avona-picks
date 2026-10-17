import { compare, type Comparison, type Verdict } from "./compare";
import { marketInfo, markets, type Market } from "./markets";

export type CategorySlug = "air-fryers" | "coffee-espresso" | "vacuums" | "cookware" | "blenders-juicers" | "tumblers" | "seasonal-decor";

export const categories: readonly { slug: CategorySlug; name: string; blurb: string }[] = [
  { slug: "air-fryers", name: "Air fryers", blurb: "Basket, dual-zone, and oven-style fryers head to head." },
  { slug: "coffee-espresso", name: "Coffee & espresso", blurb: "Espresso machines, pod brewers, and the bundles Costco adds." },
  { slug: "vacuums", name: "Vacuums", blurb: "Cordless sticks and robots, including Costco battery bundles." },
  { slug: "cookware", name: "Cookware sets", blurb: "Stainless and nonstick sets compared piece for piece." },
  { slug: "blenders-juicers", name: "Blenders & juicers", blurb: "High-performance blenders and slow juicers." },
  { slug: "tumblers", name: "Tumblers", blurb: "Insulated tumblers: multipacks versus singles." },
  { slug: "seasonal-decor", name: "Seasonal decor", blurb: "Trees and lights: closest alternatives, not identical items." },
];

export type ComparisonType = "same-model" | "costco-variant" | "closest-alternative";

export const comparisonTypeLabel: Record<ComparisonType, { label: string; explain: string }> = {
  "same-model": { label: "Same model", explain: "Identical model number at both retailers." },
  "costco-variant": { label: "Costco variant", explain: "Costco sells its own model number or bundle; differences are listed below." },
  "closest-alternative": { label: "Closest alternative", explain: "Not the same item. We compare the closest Amazon option to the Costco item." },
};

export type PriceSource =
  | { kind: "sample" }
  | { kind: "costco-online"; checkedOn: string }
  | { kind: "in-warehouse"; observedOn: string; region: string }
  | { kind: "amazon-api"; asin: string };

export type AmazonOffer = { kind: "sample"; url: string } | { kind: "affiliate"; url: string; disclosure: string };
// Costco has no public affiliate program, so its links are sample placeholders or plain direct links.
export type CostcoOffer = { kind: "sample"; url: string } | { kind: "direct"; url: string };

// Amazon prices may only be stored as labeled sample data; real ones come from the API at render time.
export type AmazonListing = { packLabel: string; offer: AmazonOffer } & (
  | { source: { kind: "sample" }; price: number; delivery?: number }
  | { source: { kind: "amazon-api"; asin: string }; price?: never; delivery?: never }
);

export type CostcoListing = {
  packLabel: string;
  price: number;
  delivery?: number;
  source: Exclude<PriceSource, { kind: "amazon-api" }>;
  offer: CostcoOffer;
};

export type MarketComparison = { checkedOn: string; amazon: AmazonListing; costco: CostcoListing };

export type Item = {
  slug: string;
  name: string;
  category: CategorySlug;
  comparison: ComparisonType;
  summary: string;
  differences: readonly string[];
  markets: Partial<Record<Market, MarketComparison>>;
};

export type VideoEntry = { itemSlug: string; verdict: Verdict };

export type Video = {
  id: string;
  platform: "youtube" | "tiktok";
  format: "short" | "long";
  title: string;
  market: Market;
  priceDate: string;
  entries: readonly VideoEntry[];
};

const sampleLink = { us: { amazon: "https://www.amazon.com/", costco: "https://www.costco.com/" }, ca: { amazon: "https://www.amazon.ca/", costco: "https://www.costco.ca/" } } as const;

function sample(market: Market, amazon: { pack: string; price: number; delivery?: number } | { pack: string; asin: string }, costco: { pack: string; price: number; delivery?: number }, checkedOn = "2026-10-01"): MarketComparison {
  return {
    checkedOn,
    amazon: "asin" in amazon
      ? { packLabel: amazon.pack, source: { kind: "amazon-api", asin: amazon.asin }, offer: { kind: "sample", url: sampleLink[market].amazon } }
      : { packLabel: amazon.pack, price: amazon.price, delivery: amazon.delivery, source: { kind: "sample" }, offer: { kind: "sample", url: sampleLink[market].amazon } },
    costco: { packLabel: costco.pack, price: costco.price, delivery: costco.delivery, source: { kind: "sample" }, offer: { kind: "sample", url: sampleLink[market].costco } },
  };
}

export const items: readonly Item[] = [
  {
    slug: "dual-basket-air-fryer-8qt", name: "8-qt dual-basket air fryer", category: "air-fryers", comparison: "same-model",
    summary: "Two independent baskets for cooking a main and a side at once.",
    differences: ["Identical model and accessories at both retailers."],
    markets: { us: sample("us", { pack: "Single unit", price: 159.99 }, { pack: "Single unit", price: 129.99 }), ca: sample("ca", { pack: "Single unit", price: 196.99 }, { pack: "Single unit", price: 189.99 }) },
  },
  {
    slug: "air-fryer-toaster-oven", name: "Air fryer toaster oven", category: "air-fryers", comparison: "costco-variant",
    summary: "Countertop oven with air fry, bake, and toast modes.",
    differences: ["Costco bundle adds a second wire rack and a pizza pan.", "Costco model number differs by one suffix letter."],
    markets: { us: sample("us", { pack: "Oven only", price: 129.99 }, { pack: "Oven + rack + pizza pan", price: 149.99 }), ca: sample("ca", { pack: "Oven only", price: 169.99 }, { pack: "Oven + rack + pizza pan", price: 159.99 }) },
  },
  {
    slug: "semi-automatic-espresso-machine", name: "Semi-automatic espresso machine", category: "coffee-espresso", comparison: "same-model",
    summary: "Built-in grinder and steam wand for home espresso drinks.",
    differences: ["Identical model; check bundled accessories at checkout."],
    markets: { us: sample("us", { pack: "Machine", price: 549.95 }, { pack: "Machine", price: 499.99 }), ca: sample("ca", { pack: "Machine", price: 699.99 }, { pack: "Machine", price: 649.99 }) },
  },
  {
    slug: "pod-coffee-maker-bundle", name: "Pod coffee maker", category: "coffee-espresso", comparison: "costco-variant",
    summary: "Single-serve brewer; Costco sells it bundled with pods.",
    differences: ["Costco bundle includes a starter box of pods.", "Amazon price is the brewer alone."],
    markets: { us: sample("us", { pack: "Brewer only", price: 89.99 }, { pack: "Brewer + pods", price: 99.99 }), ca: sample("ca", { pack: "Brewer only", price: 119.99 }, { pack: "Brewer + pods", price: 114.99 }) },
  },
  {
    slug: "cordless-stick-vacuum", name: "Cordless stick vacuum", category: "vacuums", comparison: "costco-variant",
    summary: "Lightweight cordless vacuum with swappable battery.",
    differences: ["Costco bundle includes a second battery.", "Tool set differs slightly."],
    markets: { us: sample("us", { pack: "Vacuum + 1 battery", price: 449.99 }, { pack: "Vacuum + 2 batteries", price: 399.99 }), ca: sample("ca", { pack: "Vacuum + 1 battery", price: 549.99 }, { pack: "Vacuum + 2 batteries", price: 529.99 }) },
  },
  {
    slug: "self-emptying-robot-vacuum", name: "Self-emptying robot vacuum", category: "vacuums", comparison: "same-model",
    summary: "Robot vacuum with an auto-empty base station.",
    differences: ["Identical model and base station."],
    markets: { us: sample("us", { pack: "Robot + base", price: 299.99 }, { pack: "Robot + base", price: 349.99 }), ca: sample("ca", { pack: "Robot + base", price: 399.99 }, { pack: "Robot + base", price: 379.99 }) },
  },
  {
    slug: "stainless-cookware-set-10pc", name: "10-piece stainless cookware set", category: "cookware", comparison: "same-model",
    summary: "Tri-ply stainless set with saucepans, sauté pan, and stockpot.",
    differences: ["Identical piece count and lids."],
    markets: { us: sample("us", { pack: "10 pieces", price: 299.95 }, { pack: "10 pieces", price: 249.99 }), ca: sample("ca", { pack: "10 pieces", price: 379.99 }, { pack: "10 pieces", price: 349.99 }) },
  },
  {
    slug: "nonstick-cookware-set-12pc", name: "12-piece nonstick cookware set", category: "cookware", comparison: "closest-alternative",
    summary: "Everyday nonstick set; Costco's set is a different brand.",
    differences: ["Different brands; similar piece count and coating type.", "Costco set includes two utensils counted as pieces."],
    markets: { us: sample("us", { pack: "12 pieces", price: 119.99 }, { pack: "12 pieces", price: 129.99 }), ca: sample("ca", { pack: "12 pieces", price: 159.99 }, { pack: "12 pieces", price: 149.99 }) },
  },
  {
    slug: "high-performance-blender", name: "High-performance blender", category: "blenders-juicers", comparison: "costco-variant",
    summary: "Full-size blender for smoothies, soups, and nut butters.",
    differences: ["Costco variant includes an extra 20-oz cup.", "Warranty terms may differ; verify before buying."],
    markets: { us: sample("us", { pack: "Blender", price: 449.95 }, { pack: "Blender + cup", price: 379.99 }), ca: sample("ca", { pack: "Blender", price: 599.99 }, { pack: "Blender + cup", price: 549.99 }) },
  },
  {
    slug: "slow-masticating-juicer", name: "Slow masticating juicer", category: "blenders-juicers", comparison: "same-model",
    summary: "Cold-press style juicer for leafy greens and citrus.",
    differences: ["Identical model."],
    markets: { us: sample("us", { pack: "Juicer", asin: "SAMPLE-ASIN" }, { pack: "Juicer", price: 229.99 }), ca: sample("ca", { pack: "Juicer", price: 279.99 }, { pack: "Juicer", price: 289.99 }) },
  },
  {
    slug: "insulated-tumbler-40oz", name: "40-oz insulated tumbler", category: "tumblers", comparison: "costco-variant",
    summary: "Handled tumbler with straw lid; Costco sells a 2-pack.",
    differences: ["Costco sells a 2-pack; Amazon price is two single units.", "Colorways differ."],
    markets: { us: sample("us", { pack: "2 × single unit", price: 70 }, { pack: "2-pack", price: 49.99 }), ca: sample("ca", { pack: "2 × single unit", price: 89.98 }, { pack: "2-pack", price: 59.99 }) },
  },
  {
    slug: "kids-tumbler-4-pack", name: "Kids' tumbler 4-pack", category: "tumblers", comparison: "closest-alternative",
    summary: "Spill-resistant kids' tumblers; brands differ.",
    differences: ["Different brands; similar size and lid style."],
    markets: { us: sample("us", { pack: "4-pack", price: 34.99 }, { pack: "4-pack", price: 29.99 }), ca: sample("ca", { pack: "4-pack", price: 39.99 }, { pack: "4-pack", price: 44.99 }) },
  },
  {
    slug: "pre-lit-tree-7-5ft", name: "7.5-ft pre-lit artificial tree", category: "seasonal-decor", comparison: "closest-alternative",
    summary: "Pre-lit tree with warm-white LEDs.",
    differences: ["Different makers; compare tip count and light count before buying.", "Costco seasonal stock varies by region."],
    markets: { us: sample("us", { pack: "Tree", price: 349.99 }, { pack: "Tree", price: 299.99 }), ca: sample("ca", { pack: "Tree", price: 399.99 }, { pack: "Tree", price: 449.99 }) },
  },
  {
    slug: "outdoor-led-light-set", name: "Outdoor LED light set", category: "seasonal-decor", comparison: "closest-alternative",
    summary: "Weather-resistant string lights for eaves and trees.",
    differences: ["Different makers; Costco set is longer per strand."],
    markets: { us: sample("us", { pack: "1 set", price: 59.99 }, { pack: "1 set", price: 64.99 }), ca: sample("ca", { pack: "1 set", price: 74.99 }, { pack: "1 set", price: 72.99 }) },
  },
];

// Sample records; ids double as the spoken short links, e.g. avonapicks.com/v/yt-001.
export const videos: readonly Video[] = [
  { id: "yt-001", platform: "youtube", format: "short", title: "Amazon vs Costco: dual-basket air fryer", market: "us", priceDate: "2026-10-01", entries: [{ itemSlug: "dual-basket-air-fryer-8qt", verdict: "costco" }] },
  { id: "tt-002", platform: "tiktok", format: "short", title: "Costco's vacuum bundle vs Amazon", market: "ca", priceDate: "2026-09-15", entries: [{ itemSlug: "cordless-stick-vacuum", verdict: "costco" }] },
  { id: "yt-003", platform: "youtube", format: "short", title: "The tumbler 2-pack showdown", market: "us", priceDate: "2026-10-01", entries: [{ itemSlug: "insulated-tumbler-40oz", verdict: "costco" }] },
  {
    id: "yt-004", platform: "youtube", format: "long", title: "Amazon vs Costco: 7 kitchen buys before Black Friday", market: "us", priceDate: "2026-10-01",
    entries: [
      { itemSlug: "air-fryer-toaster-oven", verdict: "amazon" },
      { itemSlug: "semi-automatic-espresso-machine", verdict: "costco" },
      { itemSlug: "pod-coffee-maker-bundle", verdict: "tie" },
      { itemSlug: "stainless-cookware-set-10pc", verdict: "costco" },
      { itemSlug: "nonstick-cookware-set-12pc", verdict: "amazon" },
      { itemSlug: "high-performance-blender", verdict: "costco" },
      { itemSlug: "pre-lit-tree-7-5ft", verdict: "costco" },
    ],
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getItem(slug: string) {
  return items.find((item) => item.slug === slug);
}

export function itemsFor(market: Market, category?: CategorySlug): Item[] {
  return items.filter((item) => item.markets[market] && (!category || item.category === category));
}

export function compareItem(item: Item, market: Market): Comparison {
  const listing = item.markets[market];
  if (!listing) throw new Error(`${item.slug} is not listed in ${market}`);
  const amazon = listing.amazon.price === undefined ? undefined : { price: listing.amazon.price, delivery: listing.amazon.delivery };
  return compare(amazon, listing.costco, marketInfo[market].sampleMembershipFee);
}

export function scoreboard(market: Market): Record<Verdict, number> {
  const score: Record<Verdict, number> = { amazon: 0, costco: 0, tie: 0, pending: 0 };
  for (const item of itemsFor(market)) score[compareItem(item, market).member]++;
  return score;
}

export function entryStatus(video: Video, entry: VideoEntry): "current" | "updated" {
  const item = getItem(entry.itemSlug);
  const listing = item?.markets[video.market];
  if (!item || !listing) return "updated";
  return compareItem(item, video.market).member === entry.verdict && video.priceDate >= listing.checkedOn ? "current" : "updated";
}

export function videoStatus(video: Video): "current" | "updated" {
  return video.entries.every((entry) => entryStatus(video, entry) === "current") ? "current" : "updated";
}

export function getVideo(id: string) {
  return videos.find((video) => video.id === id);
}

export function videoKind(video: Video): string {
  if (video.platform === "tiktok") return "TikTok";
  return video.format === "short" ? "YouTube Shorts" : "YouTube";
}

export function videosFor(itemSlug: string, market: Market): Video[] {
  return videos.filter((video) => video.market === market && video.entries.some((entry) => entry.itemSlug === itemSlug));
}

export function isSampleData(): boolean {
  return markets.some((market) => items.some((item) => {
    const listing = item.markets[market];
    return listing && (listing.amazon.source.kind === "sample" || listing.costco.source.kind === "sample" || listing.amazon.offer.kind === "sample" || listing.costco.offer.kind === "sample");
  }));
}
