export function DraftNotice() {
  return <p className="av-draft" role="note">Draft for legal review. Not reviewed by counsel and not in effect. Bracketed text is a placeholder.</p>;
}

export function Placeholder({ children }: { children: React.ReactNode }) {
  return <span className="av-placeholder">[{children}]</span>;
}
