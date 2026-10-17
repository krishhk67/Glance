const RATE = 0.8 * 0.7; // illustrative: ₹ per ad shown x 70% share
const MIN_PAYOUT = 100;
const $ = (id) => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const day = new Date().toISOString().slice(0, 10);

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

chrome.storage.local.get({ enabled: true, day, today: 0, total: 0 }, (s) => {
  const today = s.day === day ? s.today : 0;
  const balance = s.total * RATE;
  const pct = Math.min(100, (balance / MIN_PAYOUT) * 100);

  countUp($("today"), today, (n) => Math.round(n));
  countUp($("total"), s.total, (n) => Math.round(n));
  countUp($("sim"), balance, (n) => "₹" + n.toFixed(2));
  countUp($("pct"), pct, (n) => Math.round(n) + "%");
  setTimeout(() => { $("bar").style.width = pct + "%"; }, 50);

  $("on").checked = s.enabled;
  $("on").addEventListener("change", () => chrome.storage.local.set({ enabled: $("on").checked }));
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
});