// Privacy: this script only measures the LENGTH of the newest AI reply to know when it has
// finished. It never stores, sends or logs any chat text.
(() => {
  const SITES = {
    "chatgpt.com": '[data-message-author-role="assistant"]',
    "claude.ai": ".font-claude-message, [data-is-streaming]",
    "gemini.google.com": "model-response, .model-response-text",
  };
  const selector = SITES[location.hostname];
  if (!selector) return;

  const SETTLE_POLLS = 3;      // reply must stop changing for ~3 seconds
  const MIN_GAP_MS = 20000;    // at most one ad per 20 seconds
  const AD_LIFETIME_MS = 15000;
  const REWARD_VIEW_MS = 1000; // ad must be on screen this long to count

  const seen = new WeakSet();
  let tracked = null, lastLen = 0, stable = 0, baseline = true, lastAdAt = 0;

  function newestReply() {
    const all = document.querySelectorAll(selector);
    return all.length ? all[all.length - 1] : null;
  }

  function poll() {
    const el = newestReply();
    if (!el) return;
    const len = el.textContent ? el.textContent.length : 0;
    if (baseline) { seen.add(el); tracked = el; lastLen = len; baseline = false; return; }
    if (el !== tracked) { tracked = el; lastLen = len; stable = 0; return; }
    if (len !== lastLen) { lastLen = len; stable = 0; return; }
    if (len > 0 && ++stable >= SETTLE_POLLS && !seen.has(el)) { seen.add(el); maybeShowAd(); }
  }

  function maybeShowAd() {
    if (Date.now() - lastAdAt < MIN_GAP_MS || document.visibilityState !== "visible") return;
    chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
      if (!enabled) return;
      lastAdAt = Date.now();
      showAd(GLANCE_ADS[Math.floor(Math.random() * GLANCE_ADS.length)]);
    });
  }

  function showAd(ad) {
    const host = document.createElement("div");
    const root = host.attachShadow({ mode: "closed" });
    root.innerHTML = `<style>
      .c{position:fixed;right:16px;bottom:16px;z-index:2147483647;width:280px;background:#1b1b1b;color:#efede8;
        font:14px system-ui,sans-serif;padding:14px;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
      .l{font:11px ui-monospace,monospace;letter-spacing:.08em;color:#8a8a8a}
      .t{font-weight:700;margin:6px 0 4px}.b{color:#b5b5b5;line-height:1.4}
      a{display:inline-block;margin-top:10px;background:#efede8;color:#121212;padding:6px 12px;text-decoration:none;font-weight:600}
      button{position:absolute;top:6px;right:8px;background:none;border:0;color:#8a8a8a;font-size:18px;cursor:pointer}
    </style><div class="c"><button aria-label="Close ad">×</button><div class="l">AD · GLANCE TEST</div>
    <div class="t"></div><div class="b"></div><a target="_blank" rel="noopener noreferrer"></a></div>`;
    const card = root.querySelector(".c");
    root.querySelector(".t").textContent = ad.title;
    root.querySelector(".b").textContent = ad.body;
    const a = root.querySelector("a"); a.textContent = ad.cta; a.href = ad.url;
    const remove = () => { io.disconnect(); clearTimeout(viewTimer); host.remove(); };
    root.querySelector("button").addEventListener("click", remove);
    document.body.appendChild(host);

    let viewTimer = null, counted = false;
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(viewTimer);
      if (e.isIntersecting && e.intersectionRatio >= 0.5 && !counted) {
        viewTimer = setTimeout(() => {
          if (document.visibilityState === "visible") { counted = true; countImpression(); }
        }, REWARD_VIEW_MS);
      }
    }, { threshold: [0.5] });
    io.observe(card);
    setTimeout(remove, AD_LIFETIME_MS);
  }

  function countImpression() {
    const day = new Date().toISOString().slice(0, 10);
    chrome.storage.local.get({ total: 0, day, today: 0 }, (s) => {
      const today = s.day === day ? s.today + 1 : 1;
      chrome.storage.local.set({ total: s.total + 1, day, today });
    });
  }

  setInterval(poll, 1000);
})();
