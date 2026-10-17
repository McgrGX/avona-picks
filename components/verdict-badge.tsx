import type { Verdict } from "@/lib/compare";
import { TIE_BAND_PERCENT } from "@/lib/compare";

export const verdictLabel: Record<Verdict, string> = {
  amazon: "Amazon wins",
  costco: "Costco wins",
  tie: `Tie (within ${TIE_BAND_PERCENT}%)`,
  pending: "Pending live Amazon price",
};

export function VerdictBadge({ verdict, prefix }: { verdict: Verdict; prefix?: string }) {
  return <span className={`av-badge av-verdict-${verdict}`}>{prefix ? `${prefix}: ` : ""}{verdictLabel[verdict]}</span>;
}
