import { DraftNotice, Placeholder } from "@/components/legal";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({ path: "/terms", title: "Terms of use", description: "Terms for using Avona Picks." });

export default function TermsPage() {
  return (
    <article className="av-container av-prose">
      <DraftNotice />
      <h1>Terms of use</h1>
      <p>Last updated: <Placeholder>date</Placeholder></p>
      <p>These terms apply to Avona Picks, operated by <Placeholder>Company legal name</Placeholder>. By using the site you agree to them.</p>

      <h2>Information only</h2>
      <p>Comparisons are for general information. Prices, stock, bundles, and policies change often and vary by region. Always confirm with the retailer before buying. We do not sell products and are not responsible for retailer transactions.</p>

      <h2>No warranty</h2>
      <p>We work to keep information accurate and dated, but the site is provided &ldquo;as is&rdquo; without warranties, to the extent permitted by law.</p>

      <h2>Trademarks and content</h2>
      <p>Avona Picks&trade; and site content belong to <Placeholder>Company legal name</Placeholder>. Amazon, Costco, and product names belong to their owners and are used only to identify the items compared.</p>

      <h2>Limitation of liability</h2>
      <p><Placeholder>Counsel to draft.</Placeholder></p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of <Placeholder>province</Placeholder> and the federal laws of Canada that apply there.</p>

      <h2>Contact</h2>
      <p><Placeholder>contact email</Placeholder></p>
    </article>
  );
}
