import type { AmazonOffer, CostcoOffer } from "./catalog";
import { marketInfo, retailerName, type Market, type Retailer } from "./markets";

export function getOutboundUrl(offer: AmazonOffer | CostcoOffer, retailer: Retailer, market: Market): string {
  let url: URL;
  try {
    url = new URL(offer.url);
  } catch {
    throw new Error(`Invalid ${retailer} URL`);
  }
  if (url.protocol !== "https:" || !marketInfo[market].retailerHosts[retailer].includes(url.hostname) || url.username || url.password || url.port || url.hash) {
    throw new Error(`Untrusted ${retailer} URL for ${market}`);
  }
  if (offer.kind === "affiliate") {
    if (retailer !== "amazon") throw new Error("Only approved Amazon programs may carry affiliate links");
    if (!offer.disclosure.trim()) throw new Error("Affiliate links require disclosure");
  } else if (url.search) {
    throw new Error("Non-affiliate links must not contain tracking parameters");
  }
  return url.href;
}

export function getOutboundRel(offer: AmazonOffer | CostcoOffer): string {
  return offer.kind === "affiliate" ? "sponsored noopener noreferrer" : "noopener noreferrer";
}

export function getLinkNote(offer: AmazonOffer | CostcoOffer, retailer: Retailer): string {
  const name = retailerName[retailer];
  if (offer.kind === "affiliate") return `Affiliate link. ${offer.disclosure}`;
  if (offer.kind === "direct") return `Direct link. Avona Picks earns nothing from ${name}.`;
  return `Sample link to the ${name} home page. Not an affiliate link; Avona Picks earns nothing.`;
}
