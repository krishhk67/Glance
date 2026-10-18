const MIN_PAYOUT = 100;
const SUPABASE_URL = "https://ofybiuthkpfnbcadhdjp.supabase.co";
const SUPABASE_KEY = "sb_publishable_WO0YoJ6Od4-ZkKJHxz_eZQ_pU9lnGNj"; // public key, safe in the extension

const $ = (id) => document.getElementById(id);
const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
const setText = (id, t) => { const el = $(id); if (el) el.textContent = t; };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const day = new Date().toISOString().slice(0, 10);

/* ---------- theme ---------- */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  const b = $("theme");
  if (!b) return;
  b.textContent = t === "light" ? "☾" : "☀";
  b.setAttribute("aria-label", t === "light" ? "Switch to dark theme" : "Switch to light theme");
}
chrome.storage.local.get({ theme: "dark" }, ({ theme }) => applyTheme(theme));
on("theme", "click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(next);
  chrome.storage.local.set({ theme: next });
});

/* ---------- stats + earnings log ---------- */
function countUp(id, to, fmt) {
  const el = $(id);
  if (!el) return;
  if (reduce || to === 0) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 700);
    el.textContent = fmt(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function renderLog(history) {
  const ul = $("log");
  if (!ul) return;
  ul.textContent = "";
  const empty = $("empty");
  if (empty) empty.style.display = history.length ? "none" : "block";
  history.forEach((h, i) => {
    const li = document.createElement("li");
    li.style.setProperty("--d", Math.min(i, 8) * 70 + "ms");
    const left = document.createElement("div");
    const name = document.createElement("b");
    name.textContent = h.ad;
    if (Date.now() - h.ts < 5 * 60 * 1000) {
      const tag = document.createElement("span");
      tag.className = "new";
      tag.textContent = "NEW";
      name.appendChild(tag);
    }
    const when = document.createElement("span");
    when.className = "mono";
    when.textContent = new Date(h.ts).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
    left.append(name, when);
    const amt = document.createElement("span");
    amt.className = h.paise > 0 ? "amt" : "amt dim";
    amt.textContent = h.paise > 0 ? "+₹" + (h.paise / 100).toFixed(2) : "Viewed";
    li.append(left, amt);
    ul.appendChild(li);
  });
}

function renderStats() {
  chrome.storage.local.get({ enabled: true, session: null, stats: {} }, (s) => {
    const key = s.session && s.session.email ? s.session.email.toLowerCase() : null;
    const cur = (key && s.stats[key]) || { total: 0, today: 0, day, history: [], paise: 0 };
    const today = cur.day === day ? cur.today : 0;
    const balance = (cur.paise || 0) / 100;
    const pct = Math.min(100, (balance / MIN_PAYOUT) * 100);
    countUp("today", today, (n) => Math.round(n));
    countUp("total", cur.total, (n) => Math.round(n));
    countUp("sim", balance, (n) => "₹" + n.toFixed(2));
    countUp("pct", pct, (n) => Math.round(n) + "%");
    setTimeout(() => { const bar = $("bar"); if (bar) bar.style.width = pct + "%"; }, 50);
    renderLog(cur.history || []);
    const box = $("on");
    if (box) box.checked = s.enabled;
  });
}
renderStats();
on("on", "change", () => chrome.storage.local.set({ enabled: $("on").checked }));
chrome.storage.onChanged.addListener((c) => { if (c.session || c.stats) renderStats(); });

on("accBtn", "click", () => {
  const panel = $("accPanel");
  if (!panel) return;
  const open = panel.classList.toggle("open");
  $("accBtn").setAttribute("aria-expanded", open);
});

/* ---------- tabs + payout chips ---------- */
document.querySelectorAll("nav button[data-tab]").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll("nav button[data-tab]").forEach((x) => x.setAttribute("aria-selected", x === b));
    document.querySelectorAll("section").forEach((s) => s.classList.toggle("on", s.id === b.dataset.tab));
  });
});
document.querySelectorAll(".chip2[data-m]").forEach((c) => {
  c.addEventListener("click", () => {
    document.querySelectorAll(".chip2[data-m]").forEach((x) => x.setAttribute("aria-pressed", x === c));
  });
});

/* ---------- coin celebration ---------- */
const NOTE = `<svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true"><path d="M14 30C6 26 2 20 4 12c6 2 10 6 12 12z" fill="#efede8" stroke="#121212" stroke-width="3" stroke-linejoin="round"/><path d="M50 30c8-4 12-10 10-18-6 2-10 6-12 12z" fill="#efede8" stroke="#121212" stroke-width="3" stroke-linejoin="round"/><rect x="12" y="22" width="40" height="24" rx="3" fill="#22c55e" stroke="#121212" stroke-width="3"/><circle cx="32" cy="34" r="8" fill="#bbf7d0" stroke="#121212" stroke-width="2"/><path d="M28.5 30h7M28.5 33h7M28.5 30h2.5a3 3 0 0 1 0 6h-2.5l4.5 4" fill="none" stroke="#121212" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
on("coin", "click", (e) => {
  if (reduce) return;
  const r = e.currentTarget.getBoundingClientRect();
  const colors = ["#22c55e", "#c084fc", "#f59e0b", "#efede8"];
  for (let i = 0; i < 10; i++) {
    const d = document.createElement("div");
    d.style.cssText = `position:fixed;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:6px;height:6px;background:${colors[i % 4]};pointer-events:none;z-index:9`;
    document.body.appendChild(d);
    const a = (Math.PI * 2 * i) / 10, dist = 40 + Math.random() * 30;
    d.animate(
      [{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${Math.cos(a) * dist}px,${Math.sin(a) * dist}px)`, opacity: 0 }],
      { duration: 600, easing: "ease-out" }
    ).onfinish = () => d.remove();
  }
  for (let i = 0; i < 4; i++) {
    const m = document.createElement("div");
    m.innerHTML = NOTE;
    m.style.cssText = `position:fixed;left:${r.left + 4 + i * 14}px;top:${r.top}px;pointer-events:none;z-index:9`;
    document.body.appendChild(m);
    m.animate(
      [{ transform: "translateY(0) rotate(0)", opacity: 1 }, { transform: `translateY(-64px) rotate(${(i - 1.5) * 22}deg)`, opacity: 0 }],
      { duration: 900, delay: i * 80, easing: "ease-out", fill: "backwards" }
    ).onfinish = () => m.remove();
  }
});

/* ---------- account ---------- */
function showAccount(session) {
  const out = $("authOut"), inn = $("authIn");
  if (out) out.style.display = session ? "none" : "block";
  if (inn) inn.style.display = session ? "block" : "none";
  if (session) setText("who", session.email || "Signed in");
}
chrome.storage.local.get({ session: null }, ({ session }) => showAccount(session));
chrome.storage.onChanged.addListener((changes) => {
  if (changes.session) showAccount(changes.session.newValue || null);
});

async function doSignIn() {
  setText("authMsg", "Signing in…");
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
      body: JSON.stringify({ email: $("email").value.trim(), password: $("pw").value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.error_description || "Sign in failed");
    const session = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at, email: data.user.email };
    await chrome.storage.local.set({ session });
    $("pw").value = "";
    setText("authMsg", "");
    showAccount(session);
  } catch (e) {
    setText("authMsg", e.message);
  }
}
on("signin", "click", doSignIn);
on("pw", "keydown", (e) => { if (e.key === "Enter") doSignIn(); });

on("signout", "click", async () => {
  const { session } = await chrome.storage.local.get({ session: null });
  if (session) {
    fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session.access_token}` } }).catch(() => {});
  }
  await chrome.storage.local.remove("session");
  showAccount(null);
});

function oauthLogin(provider) {
  setText("authMsg", "Finish signing in in the window that opens, then click the Glance icon again.");
  chrome.runtime.sendMessage({ type: "oauth", provider });
}
on("oauthGoogle", "click", () => oauthLogin("google"));
on("oauthGithub", "click", () => oauthLogin("github"));