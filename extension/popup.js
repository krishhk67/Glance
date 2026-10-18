const RATE = 0.8 * 0.7; // test mode: ₹ per ad shown x 70% share (live mode: the server decides)
const MIN_PAYOUT = 100;
const $ = (id) => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const day = new Date().toISOString().slice(0, 10);
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  const b = $("theme");
  b.textContent = t === "light" ? "☾" : "☀";
  b.setAttribute("aria-label", t === "light" ? "Switch to dark theme" : "Switch to light theme");
}
chrome.storage.local.get({ theme: "dark" }, ({ theme }) => applyTheme(theme));
$("theme").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(next);
  chrome.storage.local.set({ theme: next });
});

function countUp(el, to, fmt) {
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
  ul.textContent = "";
  $("empty").style.display = history.length ? "none" : "block";
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
    amt.className = "amt";
    amt.textContent = "+₹" + (h.paise / 100).toFixed(2);
    li.append(left, amt);
    ul.appendChild(li);
  });
}

chrome.storage.local.get({ enabled: true, day, today: 0, total: 0, history: [] }, (s) => {
  const today = s.day === day ? s.today : 0;
  const balance = s.total * RATE;
  const pct = Math.min(100, (balance / MIN_PAYOUT) * 100);

  countUp($("today"), today, (n) => Math.round(n));
  countUp($("total"), s.total, (n) => Math.round(n));
  countUp($("sim"), balance, (n) => "₹" + n.toFixed(2));
  countUp($("pct"), pct, (n) => Math.round(n) + "%");
  setTimeout(() => { $("bar").style.width = pct + "%"; }, 50);
  renderLog(s.history);

  $("on").checked = s.enabled;
  $("on").addEventListener("change", () => chrome.storage.local.set({ enabled: $("on").checked }));
});

// Slide-down earnings activity
$("accBtn").addEventListener("click", () => {
  const open = $("accPanel").classList.toggle("open");
  $("accBtn").setAttribute("aria-expanded", open);
});

// Tabs
document.querySelectorAll("nav button").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach((x) => x.setAttribute("aria-selected", x === b));
    document.querySelectorAll("section").forEach((s) => s.classList.toggle("on", s.id === b.dataset.tab));
  });
});

// Payout method chips
document.querySelectorAll(".chip2[data-m]").forEach((c) => {
  c.addEventListener("click", () => {
    document.querySelectorAll(".chip2[data-m]").forEach((x) => x.setAttribute("aria-pressed", x === c));
  });
});

// Coin celebration
$("coin").addEventListener("click", (e) => {
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
  const SUPABASE_URL = "https://ofybiuthkpfnbcadhdjp.supabase.co";
const SUPABASE_KEY = "sb_publishable_WO0YoJ6Od4-ZkKJHxz_eZQ_pU9lnGNj"; // public key, safe in the extension

function showAccount(session) {
  $("authOut").style.display = session ? "none" : "block";
  $("authIn").style.display = session ? "block" : "none";
  if (session) $("who").textContent = session.email;
}
chrome.storage.local.get({ session: null }, ({ session }) => showAccount(session));

async function doSignIn() {
  const msg = $("authMsg");
  msg.textContent = "Signing in…";
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
    msg.textContent = "";
    showAccount(session);
  } catch (e) {
    msg.textContent = e.message;
  }
}
$("signin").addEventListener("click", doSignIn);
$("pw").addEventListener("keydown", (e) => { if (e.key === "Enter") doSignIn(); });

$("signout").addEventListener("click", async () => {
  const { session } = await chrome.storage.local.get({ session: null });
  if (session) {
    fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session.access_token}` } }).catch(() => {});
  }
  await chrome.storage.local.remove("session");
  showAccount(null);
});
});