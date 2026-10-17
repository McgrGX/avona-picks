export const markets = ["us", "ca"] as const;
export type Market = (typeof markets)[number];
export type Retailer = "amazon" | "costco";

type MarketInfo = {
  label: string;
  shortLabel: string;
  hreflang: string;
  currency: "USD" | "CAD";
  locale: string;
  /** Sample annual basic-membership fee; verify against Costco before publishing. */
  sampleMembershipFee: number;
  retailerHosts: Record<Retailer, readonly string[]>;
};

export const marketInfo: Record<Market, MarketInfo> = {
  us: {
    label: "United States", shortLabel: "US", hreflang: "en-US", currency: "USD", locale: "en-US", sampleMembershipFee: 65,
    retailerHosts: { amazon: ["www.amazon.com"], costco: ["www.costco.com"] },
  },
  ca: {
    label: "Canada", shortLabel: "Canada", hreflang: "en-CA", currency: "CAD", locale: "en-CA", sampleMembershipFee: 65,
    retailerHosts: { amazon: ["www.amazon.ca"], costco: ["www.costco.ca"] },
  },
};

export const retailerName: Record<Retailer, string> = { amazon: "Amazon", costco: "Costco" };

export function isMarket(value: string): value is Market {
  return (markets as readonly string[]).includes(value);
}

export function formatMoney(amount: number, market: Market): string {
  const { locale, currency } = marketInfo[market];
  return new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(amount) + ` ${currency}`;
}
