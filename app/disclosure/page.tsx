import Link from "next/link";
import { DraftNotice, Placeholder } from "@/components/legal";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({ path: "/disclosure", title: "Affiliate disclosure", description: "How Avona Picks earns money and how that affects (and does not affect) our verdicts." });

export default function DisclosurePage() {
  return (
    <article className="av-container av-prose">
      <DraftNotice />
      <h1>Affiliate disclosure</h1>
      <p>Last updated: <Placeholder>date</Placeholder></p>
      <p>Avona Picks is operated by <Placeholder>Company legal name</Placeholder>, a corporation registered in Canada (&ldquo;we&rdquo;).</p>

      <h2>How we make money</h2>
      <ul>
        <li><strong>Amazon.</strong> When we are approved, some Amazon links will be affiliate links. If you buy after clicking one, we may earn a commission at no extra cost to you. Those links will be labeled next to the button.</li>
        <li><strong>Costco.</strong> Costco has no affiliate program with us. We earn nothing from Costco links, and we say so on every Costco button.</li>
        <li><strong>Sponsorships.</strong> If a brand ever pays for a placement or video, it will be labeled as paid in the video and on the page, using each platform&apos;s paid-partnership tools.</li>
      </ul>

      <h2>What money does not change</h2>
      <p>Verdicts come from the prices and method on <Link href="/how-we-compare">How we compare</Link>. We publish Costco wins even though they earn us nothing. Retailers and brands do not review or approve verdicts.</p>

      <h2>Required statements</h2>
      <p>Once approved by the Amazon Associates programs, this page and every page with Amazon links will include the statement Amazon requires, word for word: <Placeholder>Amazon Associates required statement, copied from the current Operating Agreement</Placeholder>.</p>
      <p>Avona Picks is not affiliated with, endorsed by, or sponsored by Amazon or Costco. Amazon and Costco names are used only to identify the retailers being compared.</p>

      <h2>Contact</h2>
      <p><Placeholder>contact email</Placeholder> · <Placeholder>mailing address</Placeholder></p>
    </article>
  );
}
