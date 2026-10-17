import { DraftNotice, Placeholder } from "@/components/legal";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({ path: "/privacy", title: "Privacy policy", description: "What Avona Picks collects, why, and your choices." });

export default function PrivacyPage() {
  return (
    <article className="av-container av-prose">
      <DraftNotice />
      <h1>Privacy policy</h1>
      <p>Last updated: <Placeholder>date</Placeholder></p>
      <p><Placeholder>Company legal name</Placeholder> (&ldquo;we&rdquo;) operates Avona Picks. This policy explains how we handle personal information under Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA), applicable provincial laws, and applicable US state laws.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Email sign-up:</strong> your email address, the date and wording of the consent you gave, and your unsubscribe status.</li>
        <li><strong>Site visits:</strong> <Placeholder>analytics provider and data collected, or &ldquo;We do not use analytics.&rdquo;</Placeholder></li>
        <li><strong>Retailer links:</strong> when you click to Amazon or Costco, that retailer&apos;s own privacy policy applies. Amazon may use cookies to attribute affiliate purchases.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To send the email you asked for, and only that email.</li>
        <li>To keep records showing you consented, as required by Canada&apos;s Anti-Spam Legislation (CASL).</li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>Service providers and storage</h2>
      <p>We use <Placeholder>email provider</Placeholder> to send email and <Placeholder>hosting provider</Placeholder> to run this site. They may store information outside Canada, including in the United States, where it may be accessible to authorities under local law.</p>

      <h2>How long we keep it</h2>
      <p><Placeholder>retention period, e.g. while subscribed plus the period needed to prove consent</Placeholder></p>

      <h2>Your choices</h2>
      <ul>
        <li>Unsubscribe at any time using the link in every email. We process requests within 10 business days.</li>
        <li>Ask to access or correct your information, or withdraw consent, by contacting our privacy officer.</li>
        <li>You may complain to the Office of the Privacy Commissioner of Canada.</li>
      </ul>

      <h2>Quebec</h2>
      <p>We do not currently target residents of Quebec. <Placeholder>Counsel to confirm Law 25 obligations for Quebec residents who sign up.</Placeholder></p>

      <h2>Privacy officer</h2>
      <p><Placeholder>name or title</Placeholder> · <Placeholder>privacy email</Placeholder> · <Placeholder>mailing address</Placeholder></p>
    </article>
  );
}
