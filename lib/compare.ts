import type { Retailer } from "./markets";

export type Verdict = "amazon" | "costco" | "tie" | "pending";

export const TIE_BAND_PERCENT = 5;

export function totalCost(listing: { price: number; delivery?: number }): number {
  if (!Number.isFinite(listing.price) || listing.price < 0) throw new Error("Price must be a non-negative number");
  const delivery = listing.delivery ?? 0;
  if (!Number.isFinite(delivery) || delivery < 0) throw new Error("Delivery must be a non-negative number");
  return Math.round((listing.price + delivery) * 100) / 100;
}

export function decideVerdict(amazonTotal: number | undefined, costcoTotal: number, tieBandPercent = TIE_BAND_PERCENT): Verdict {
  if (amazonTotal === undefined) return "pending";
  const cheaper = Math.min(amazonTotal, costcoTotal);
  const gap = Math.abs(amazonTotal - costcoTotal);
  if (cheaper === 0 ? gap === 0 : (gap / cheaper) * 100 <= tieBandPercent) return "tie";
  return amazonTotal < costcoTotal ? "amazon" : "costco";
}

export type Comparison = {
  amazonTotal?: number;
  costcoTotal: number;
  /** Already a Costco member: the fee is sunk. */
  member: Verdict;
  /** Joining only for this purchase: the full fee counts. */
  joiner: Verdict;
  savings?: { winner: Retailer; amount: number };
};

export function compare(amazon: { price: number; delivery?: number } | undefined, costco: { price: number; delivery?: number }, membershipFee: number): Comparison {
  const amazonTotal = amazon ? totalCost(amazon) : undefined;
  const costcoTotal = totalCost(costco);
  const member = decideVerdict(amazonTotal, costcoTotal);
  const joiner = decideVerdict(amazonTotal, costcoTotal + membershipFee);
  const savings = amazonTotal !== undefined && (member === "amazon" || member === "costco")
    ? { winner: member, amount: Math.round(Math.abs(amazonTotal - costcoTotal) * 100) / 100 }
    : undefined;
  return { amazonTotal, costcoTotal, member, joiner, savings };
}
