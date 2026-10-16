"use client";
import { useEffect, useState } from "react";

const BRAND = "Glance"; // placeholder name, change anywhere here
const AD_VALUE = 0.8; // illustrative ₹ an advertiser pays per ad shown
const OUR_SHARE = 70; // illustrative % of ad money paid to users

const PAYOUTS = [
  { id: "amazon", name: "Amazon gift card", note: "Min ₹100", soon: false },
  { id: "flipkart", name: "Flipkart voucher", note: "Min ₹100", soon: false },
  { id: "paypal", name: "PayPal", note: "Min ₹500", soon: false },
  { id: "upi", name: "UPI", note: "Coming soon", soon: true },
];
const FAQ = [
  ["How do I earn?", "Install the extension, chat with your AI as usual. A small ad appears after replies and you earn for each one shown."],
  ["When can I cash out?", "Once you pass the minimum for your chosen method. Vouchers arrive by email, PayPal to your account."],
  ["Why no UPI yet?", "UPI payouts need a payments partner. It is next on the list, and you can join the waitlist below."],
];
const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`cut bg-panel p-6 ${className}`}>{children}</div>;
}

export default function Home() {
  const [bal, setBal] = useState(0);
  const [replies, setReplies] = useState(60);
  const [theirShare, setTheirShare] = useState(20);
  const [pick, setPick] = useState("amazon");
  const [open, setOpen] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setBal((b) => +(b + 0.05 + Math.random() * 0.3).toFixed(2)), 1400);
    return () => clearInterval(t);
  }, []);

  const monthly = (share: number) => replies * 30 * AD_VALUE * (share / 100);
  const ours = monthly(OUR_SHARE), theirs = monthly(theirShare);

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      <header className="flex items-center justify-between py-6">
        <span className="text-2xl font-bold">{BRAND.toLowerCase()}</span>
        <button className="cut bg-paper px-4 py-2 text-sm font-semibold text-ink" onClick={() => alert("Sign-in arrives with Supabase auth")}>Sign in</button>
      </header>

      <section className="grid gap-6 py-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="lbl">Revenue from your AI chats</p>
          <h1 className="mt-3 text-5xl font-bold leading-tight">Every AI reply earns you money.</h1>
          <p className="mt-4 max-w-md text-lg text-neutral-400">Install the extension, keep chatting. You keep {OUR_SHARE}% of what advertisers pay, and cash out without a wallet maze.</p>
          <div className="mt-6 flex gap-3">
            <a href="#earn" className="cut bg-paper px-5 py-3 font-semibold text-ink">Add to Chrome</a>
            <a href="#calc" className="cut border border-line px-5 py-3">Calculate earnings</a>
          </div>
        </div>
        <Box>
          <p className="lbl">Live demo balance</p>
          <p className="mt-2 text-5xl font-bold text-gain">{inr(bal)}</p>
          <p className="mt-2 text-sm text-neutral-400">Ticks up as ads are shown. Demo only.</p>
          <div className="mt-5 h-2 bg-line"><div className="h-2 bg-gain transition-all" style={{ width: `${Math.min(100, (bal / 100) * 100)}%` }} /></div>
          <p className="lbl mt-2">Progress to ₹100 minimum</p>
        </Box>
      </section>

      <section id="calc" className="grid gap-6 py-8 md:grid-cols-2">
        <Box>
          <p className="lbl">Earnings calculator</p>
          <label className="mt-4 block text-sm" htmlFor="r">AI replies per day: <b>{replies}</b></label>
          <input id="r" type="range" min={10} max={200} value={replies} onChange={(e) => setReplies(+e.target.value)} className="w-full accent-green-500" />
          <label className="mt-5 block text-sm" htmlFor="t">Other app's share to users: <b>{theirShare}%</b> (set to what they pay)</label>
          <input id="t" type="range" min={5} max={60} value={theirShare} onChange={(e) => setTheirShare(+e.target.value)} className="w-full accent-purple-400" />
        </Box>
        <Box>
          <p className="lbl">Per month</p>
          <p className="mt-2 text-4xl font-bold text-gain">{inr(ours)}</p>
          <p className="text-sm text-neutral-400">with {BRAND} at {OUR_SHARE}%</p>
          <p className="mt-4 text-2xl font-semibold text-lilac">{inr(theirs)}</p>
          <p className="text-sm text-neutral-400">with the other app at {theirShare}%</p>
          <p className="mt-4 font-semibold">You gain {inr(ours - theirs)} every month.</p>
          <p className="lbl mt-3">Illustrative: assumes {inr(AD_VALUE)} paid per ad</p>
        </Box>
      </section>

      <section id="earn" className="py-8">
        <p className="lbl">Cash out</p>
        <h2 className="mt-2 text-3xl font-bold">Pick how you get paid.</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {PAYOUTS.map((p) => (
            <button key={p.id} disabled={p.soon} aria-pressed={pick === p.id} onClick={() => setPick(p.id)}
              className={`cut p-5 text-left transition ${p.soon ? "bg-panel opacity-50" : pick === p.id ? "bg-gain text-ink" : "bg-panel hover:bg-line"}`}>
              <span className="block text-lg font-semibold">{p.name}</span>
              <span className="lbl" style={pick === p.id && !p.soon ? { color: "#121212" } : undefined}>{p.note}</span>
            </button>
          ))}
        </div>
        <Box className="mt-4">
          {joined ? <p className="text-gain">You're on the UPI waitlist.</p> : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email for UPI launch" className="flex-1 border border-line bg-ink px-4 py-3" />
              <button onClick={() => email.includes("@") && setJoined(true)} className="cut bg-paper px-5 py-3 font-semibold text-ink">Join UPI waitlist</button>
            </div>)}
        </Box>
      </section>

      <section className="py-8">
        <p className="lbl">Questions</p>
        <div className="mt-4 space-y-3">
          {FAQ.map(([q, a], i) => (
            <Box key={q} className="!p-0">
              <button className="w-full p-5 text-left font-semibold" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{q}</button>
              {open === i && <p className="px-5 pb-5 text-neutral-400">{a}</p>}
            </Box>
          ))}
        </div>
      </section>
    </main>
  );
}
