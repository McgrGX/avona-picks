"use client";

import Link from "next/link";
import { useId, useState } from "react";

export function EmailSignup() {
  const id = useId();
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="av-signup" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Get the weekly Amazon vs Costco scoreboard</h2>
      <p>One email a week with new verdicts, flipped verdicts, and holiday price checks. Links go to Avona Picks pages, not straight to retailers.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.currentTarget.reset();
          setSubmitted(true);
        }}
      >
        <div className="av-signup-row">
          <label className="av-sr-only" htmlFor={`${id}-email`}>Email address</label>
          <input id={`${id}-email`} type="email" name="email" required autoComplete="email" placeholder="you@example.com" />
          <button className="av-button" type="submit">Subscribe</button>
        </div>
        <label className="av-consent" htmlFor={`${id}-consent`} style={{ marginTop: ".8rem" }}>
          <input id={`${id}-consent`} type="checkbox" name="consent" required />
          <span>Yes, I agree to receive the Avona Picks weekly email from <span className="av-placeholder" style={{ color: "#1b1a17" }}>[Company legal name]</span>. I can unsubscribe at any time.</span>
        </label>
      </form>
      {submitted && <p className="av-signup-status" role="status">Prototype only: no email provider is connected. Nothing was sent or stored.</p>}
      <p className="av-signup-fine"><span className="av-placeholder" style={{ color: "#1b1a17" }}>[Company legal name], [mailing address], [contact email]</span>. See our <Link href="/privacy">privacy policy</Link>.</p>
    </section>
  );
}
