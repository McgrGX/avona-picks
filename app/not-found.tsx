import Link from "next/link";

export default function NotFound() {
  return (
    <section className="av-container av-prose">
      <h1>No showdown here</h1>
      <p className="av-lede">That page doesn&apos;t exist, or this item isn&apos;t compared in this market yet.</p>
      <p><Link className="av-button" href="/">Back to the scoreboard</Link></p>
    </section>
  );
}
