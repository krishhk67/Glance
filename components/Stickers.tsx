type P = { className?: string };
const S = { stroke: "#121212", strokeWidth: 3, strokeLinejoin: "round" as const };

export function Coin({ className }: P) {
  return (<svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="28" fill="#fbbf24" {...S} /><circle cx="32" cy="32" r="20" fill="#fde68a" {...S} strokeWidth={2} />
    <circle cx="25" cy="28" r="3" fill="#121212" /><circle cx="39" cy="28" r="3" fill="#121212" />
    <path d="M23 37q9 9 18 0" fill="none" stroke="#121212" strokeWidth="3" strokeLinecap="round" /></svg>);
}
export function Sparkle({ className }: P) {
  return (<svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <path d="M32 4l7 21 21 7-21 7-7 21-7-21-21-7 21-7z" fill="#c084fc" {...S} /></svg>);
}
export function GiftCard({ className }: P) {
  return (<svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <rect x="6" y="14" width="52" height="38" rx="6" fill="#22c55e" {...S} /><path d="M6 26h52" stroke="#121212" strokeWidth="3" />
    <path d="M32 14v38" stroke="#121212" strokeWidth="3" /><circle cx="32" cy="12" r="5" fill="#efede8" {...S} strokeWidth={2.5} /></svg>);
}
export function Zap({ className }: P) {
  return (<svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <path d="M36 4L12 36h16l-4 24 28-34H35z" fill="#f59e0b" {...S} /></svg>);
}
