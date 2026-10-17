import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { isSampleData } from "@/lib/catalog";

export const metadata: Metadata = {
  title: { default: "Avona Picks: Amazon vs Costco, with receipts", template: "%s | Avona Picks" },
  description: "Amazon vs Costco price comparisons for home and kitchen, with dated sources and honest verdicts.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="av-skip" href="#main">Skip to content</a>
        {isSampleData() && <p className="av-proto" role="note">Prototype: all prices are sample data and no link is an affiliate link.</p>}
        <header className="av-header">
          <div className="av-container av-header-inner">
            <Link href="/" className="av-logo"><span className="av-logo-mark" aria-hidden="true">A</span>Avona Picks</Link>
            <nav aria-label="Main" className="av-nav">
              <Link href="/us">US</Link>
              <Link href="/ca">Canada</Link>
              <Link href="/how-we-compare">How we compare</Link>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="av-footer">
          <div className="av-container av-footer-inner">
            <p>Avona Picks compares prices independently. We are not affiliated with, endorsed by, or sponsored by Amazon or Costco. Costco links never earn us a commission. Prices change; check the retailer before buying.</p>
            <nav aria-label="Legal">
              <Link href="/disclosure">Affiliate disclosure</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/how-we-compare">How we compare</Link>
            </nav>
            <p className="av-small">&copy; 2026 <span className="av-placeholder">[Company legal name]</span>. Avona Picks&trade;</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
