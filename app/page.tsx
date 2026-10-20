"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Coin, Sparkle, GiftCard, Zap } from "@/components/Stickers";

const BRAND = "Glance";
const CHROME_STORE_URL = ""; // paste your Chrome Web Store link here once published
const AD_VALUE = 0.8; // estimate: ₹ an advertiser pays per ad shown
const OUR_SHARE = 70; // % of ad money paid to users
const MIN_PAYOUT = 100;

const PAYOUTS = [
  { id: "amazon", name: "Amazon gift card", note: "Min ₹100", soon: false },
  { id: "flipkart", name: "Flipkart voucher", note: "Min ₹100", soon: false },
  { id: "paypal", name: "PayPal", note: "Min ₹500", soon: false },
  { id: "upi", name: "UPI", note: "Coming soon", soon: true },
];
const FAQ = [
  ["How do I earn?", "Install the extension and sign in. Use ChatGPT, Claude or Gemini as usual. A small, clearly labelled ad appears after replies, and paid ads earn you money."],
  ["When do ads start paying?", "Paid ads roll out with our first advertisers. Members who sign up now are first in line."],
  ["When can I cash out?", "Once your balance passes the minimum for your chosen method. Vouchers arrive by email, PayPal goes to your account."],
  ["Why no UPI yet?", "UPI payouts need a payments partner. It is next on the list, and you can join the waitlist below."],
];
const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`cut bg-panel p-6 ${className}`}>{children}</div>;
}

export default function Home() {
  const [replies, setReplies] = useState(60);
  const [theirShare, setTheirShare] = useState(20);
  const [pick, setPick] = useState("amazon");
  const [open, setOpen] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [signUp, setSignUp] = useState(true);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setBalance(0); return; }
    supabase.from("user_balance").select("balance_paise").maybeSingle()
      .then(({ data }) => setBalance((data?.balance_paise ?? 0) / 100));
  }, [user]);

  async function submitAuth() {
    setMsg("");
    const creds = { email, password: pw };
    const { error } = signUp ? await supabase.auth.signUp(creds) : await supabase.auth.signInWithPassword(creds);
    if (error) return setMsg(error.message);
    setMsg(signUp ? "Check your email to confirm, then sign in." : "");
    if (!signUp) setAuthOpen(false);
  }

  async function oauth(provider: "google" | "github") {
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
    if (error) setMsg(error.message);
  }

  async function joinWaitlist() {
    if (!email.includes("@")) return;
    const { error } = await supabase.from("upi_waitlist").insert({ email });
    if (!error || error.code === "23505") setJoined(true);
  }

  const monthly = (share: number) => replies * 30 * AD_VALUE * (share / 100);
  const ours = monthly(OUR_SHARE), theirs = monthly(theirShare);

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      <header className="flex items-center justify-between py-6">
        <span className="text-2xl font-bold">{BRAND.toLowerCase()}</span>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="lbl">{user.email}</span>
            <button className="cut bg-paper px-4 py-2 font-semibold text-ink" onClick={() => supabase.auth.signOut()}>Sign out</button>
          </div>
        ) : (
          <button className="cut bg-paper px-4 py-2 text-sm font-semibold text-ink" onClick={() => { setSignUp(false); setAuthOpen(true); }}>Sign in</button>
        )}
      </header>

      <section className="grid gap-6 py-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="lbl">Revenue from your AI chats</p>
          <h1 className="mt-3 text-5xl font-bold leading-tight">Every AI reply earns you money.</h1>
          <p className="mt-4 max-w-md text-lg text-neutral-400">Install the extension, keep chatting. You keep {OUR_SHARE}% of what advertisers pay, and cash out without a wallet maze.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {CHROME_STORE_URL && <a href={CHROME_STORE_URL} className="cut bg-paper px-5 py-3 font-semibold text-ink">Add to Chrome</a>}
            {!user && <button onClick={() => { setSignUp(true); setAuthOpen(true); }} className={`cut px-5 py-3 font-semibold ${CHROME_STORE_URL ? "border border-line" : "bg-paper text-ink"}`}>Get early access</button>}
            <a href="#calc" className="cut border border-line px-5 py-3">Calculate earnings</a>
          </div>
        </div>
        <div className="relative">
          <Sparkle className="float absolute -left-6 -top-6 h-12 w-12" />
          <GiftCard className="float absolute -bottom-6 -right-4 z-10 h-16 w-16 [--r:8deg]" />
          <Zap className="float absolute -right-3 -top-7 z-10 h-12 w-12 [--r:-10deg]" />
          <Box>
            <p className="lbl">Your balance</p>
            <p className="mt-2 text-5xl font-bold text-gain">{inr(balance)}</p>
            <p className="mt-2 text-sm text-neutral-400">
              {user ? "Earnings from paid ads appear here." : "Sign in to see your balance."}
            </p>
            <div className="mt-5 h-2 bg-line"><div className="h-2 bg-gain transition-all" style={{ width: `${Math.min(100, (balance / MIN_PAYOUT) * 100)}%` }} /></div>
            <p className="lbl mt-2">Progress to ₹{MIN_PAYOUT} minimum</p>
          </Box>
        </div>
      </section>

      <div className="my-6 overflow-hidden border-y border-line py-3" aria-hidden="true">
        <div className="marquee gap-8">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-8 pr-8 font-mono text-sm text-neutral-400">
              {["Amazon gift cards", "Flipkart vouchers", "PayPal", "UPI coming soon"].map((t) => (
                <span key={t} className="flex items-center gap-8"><Sparkle className="h-5 w-5" />{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="py-8">
        <p className="lbl">How it works</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {([[Zap, "1. Install", "Add the extension to Chrome and sign in."], [Coin, "2. Chat", "Use your AI as usual. A small ad shows after replies."], [GiftCard, "3. Cash out", "Pick a voucher or PayPal when you pass the minimum."]] as const).map(([Icon, t, d]) => (
            <Box key={t}><Icon className="h-14 w-14" /><h3 className="mt-3 text-xl font-semibold">{t}</h3><p className="mt-1 text-neutral-400">{d}</p></Box>
          ))}
        </div>
      </section>

      <section id="calc" className="grid gap-6 py-8 md:grid-cols-2">
        <Box>
          <p className="lbl">Earnings estimate</p>
          <label className="mt-4 block text-sm" htmlFor="r">AI replies per day: <b>{replies}</b></label>
          <input id="r" type="range" min={10} max={200} value={replies} onChange={(e) => setReplies(+e.target.value)} className="w-full accent-green-500" />
          <label className="mt-5 block text-sm" htmlFor="t">Other app's share to users: <b>{theirShare}%</b></label>
          <input id="t" type="range" min={5} max={60} value={theirShare} onChange={(e) => setTheirShare(+e.target.value)} className="w-full accent-purple-400" />
        </Box>
        <Box>
          <p className="lbl">Per month</p>
          <p className="mt-2 text-4xl font-bold text-gain">{inr(ours)}</p>
          <p className="text-sm text-neutral-400">with {BRAND} at {OUR_SHARE}%</p>
          <p className="mt-4 text-2xl font-semibold text-lilac">{inr(theirs)}</p>
          <p className="text-sm text-neutral-400">with the other app at {theirShare}%</p>
          <p className="mt-4 font-semibold">That is {inr(ours - theirs)} more every month.</p>
          <p className="lbl mt-3">Estimate only. Assumes {inr(AD_VALUE)} paid per ad shown; real earnings depend on advertisers.</p>
        </Box>
      </section>

      <section id="earn" className="py-8">
        <p className="lbl">Cash out</p>
        <h2 className="mt-2 text-3xl font-bold">Pick how you get paid.</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {PAYOUTS.map((p) => (
            <button key={p.id} disabled={p.soon} aria-pressed={pick === p.id} onClick={() => setPick(p.id)}
              className={`cut tilt p-5 text-left transition ${p.soon ? "bg-panel opacity-50" : pick === p.id ? "bg-gain text-ink" : "bg-panel hover:bg-line"}`}>
              <span className="block text-lg font-semibold">{p.name}</span>
              <span className="lbl" style={pick === p.id && !p.soon ? { color: "#121212" } : undefined}>{p.note}</span>
            </button>
          ))}
        </div>
        <Box className="mt-4">
          {joined ? <p className="text-gain">You're on the UPI waitlist.</p> : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email for UPI launch" className="flex-1 border border-line bg-ink px-4 py-3" />
              <button onClick={joinWaitlist} className="cut bg-paper px-5 py-3 font-semibold text-ink">Join UPI waitlist</button>
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
      <footer className="mt-12 flex flex-wrap items-center gap-6 border-t border-line pt-6 text-sm text-neutral-400">
        <a href="/privacy" className="hover:text-paper">Privacy</a>
        <a href="/terms" className="hover:text-paper">Terms</a>
        <span>© {new Date().getFullYear()} {BRAND}</span>
      </footer>
      {authOpen && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/70 p-5" onClick={() => setAuthOpen(false)}>
          <div className="cut w-full max-w-sm bg-panel p-6" role="dialog" aria-label="Sign in" onClick={(e) => e.stopPropagation()}>
            <p className="lbl">{signUp ? "Create account" : "Welcome back"}</p>
            <button onClick={() => oauth("google")} className="cut mt-4 flex w-full items-center justify-center gap-3 bg-ink px-5 py-3 font-semibold hover:bg-line">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true"><path d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"/></svg>
              Continue with Google
            </button>
            <button onClick={() => oauth("github")} className="cut mt-3 flex w-full items-center justify-center gap-3 bg-ink px-5 py-3 font-semibold hover:bg-line">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z"/></svg>
              Continue with GitHub
            </button>
            <p className="lbl my-4 text-center">or use email</p>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full border border-line bg-ink px-4 py-3" />
            <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="Password (min 6)" className="mt-3 w-full border border-line bg-ink px-4 py-3" />
            <button onClick={submitAuth} className="cut mt-4 w-full bg-gain px-5 py-3 font-semibold text-ink">{signUp ? "Sign up" : "Sign in"}</button>
            {msg && <p className="mt-3 text-sm text-amber" role="status">{msg}</p>}
            <button className="mt-4 text-sm text-neutral-400 underline" onClick={() => setSignUp(!signUp)}>{signUp ? "Have an account? Sign in" : "New here? Sign up"}</button>
          </div>
        </div>
      )}
    </main>
  );
}