// Privacy: this script only watches how LONG the newest AI reply is, to know when a new reply
// starts. It never stores, sends or logs any chat text.
(() => {
  const SITES = {
    "chatgpt.com": '[data-message-author-role="assistant"]',
    "claude.ai": ".font-claude-message, [data-is-streaming]",
    "gemini.google.com": "model-response, .model-response-text",
  };
  const selector = SITES[location.hostname];
  if (!selector) return;

  const MIN_GAP_MS = 20000;    // at most one ad per 20 seconds
  const REWARD_VIEW_MS = 1000; // ad must be on screen this long to count

  const seen = new WeakSet();
  let tracked = null, lastLen = 0, lastAdAt = 0;
  // Replies already on the page when it loads never get an ad.
  setTimeout(() => document.querySelectorAll(selector).forEach((e) => seen.add(e)), 1500);

  function newestReply() {
    const all = document.querySelectorAll(selector);
    return all.length ? all[all.length - 1] : null;
  }

  // A new reply has started when the newest reply element begins to grow.
  function poll() {
    const el = newestReply();
    if (!el) return;
    const len = el.textContent ? el.textContent.length : 0;
    if (el !== tracked) { tracked = el; lastLen = len; return; }
    if (len === lastLen) return;
    lastLen = len;
    if (!seen.has(el) && len > 0) { seen.add(el); maybeShowAd(el); }
  }

  function maybeShowAd(reply) {
    if (!chrome.runtime || !chrome.runtime.id) return; // extension was reloaded; stop quietly
    if (Date.now() - lastAdAt < MIN_GAP_MS || document.visibilityState !== "visible") return;
    chrome.storage.local.get({ enabled: true, session: null }, ({ enabled, session }) => {
      if (!enabled || !session) return; // ads only for signed-in users, so every view belongs to an account
      lastAdAt = Date.now();
      getAd().then((ad) => ad && placeAd(reply, ad));
    });
  }

  // Inserts a one-line ad just above the AI reply, inside the chat.
  function placeAd(reply, ad) {
    if (!reply.isConnected || !reply.parentNode) return;
    const host = document.createElement("div");
    host.setAttribute("data-glance-ad", "");
    const root = host.attachShadow({ mode: "closed" });
    root.innerHTML = `<style>
      :host{display:block}
      .row{display:flex;align-items:center;gap:10px;padding:10px 0;margin-bottom:10px;border-bottom:1px solid rgba(128,128,128,.25);font:inherit;color:inherit}
      .ic{flex:none;width:22px;height:22px;border-radius:5px;display:grid;place-items:center;font:700 13px system-ui,sans-serif;color:#121212}
      a{color:#3b82f6;font-weight:600;text-decoration:none}
      a:hover{text-decoration:underline}
      .tag{margin-left:auto;flex:none;font:11px ui-monospace,Consolas,monospace;letter-spacing:.06em;opacity:.55}
    </style><div class="row"><span class="ic"></span><a target="_blank" rel="noopener noreferrer"></a><span class="tag"></span></div>`;
    const row = root.querySelector(".row");
    const ic = root.querySelector(".ic");
    ic.textContent = (ad.title || "A").charAt(0).toUpperCase();
    ic.style.background = ad.color || "#22c55e";
    const a = root.querySelector("a");
    a.textContent = ad.text || ad.title;
    a.href = ad.url;
    root.querySelector(".tag").textContent = ad.label || "AD";
    reply.parentNode.insertBefore(host, reply);

    let viewTimer = null, counted = false;
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(viewTimer);
      if (e.isIntersecting && e.intersectionRatio >= 0.5 && !counted) {
        viewTimer = setTimeout(() => {
          if (document.visibilityState === "visible") { counted = true; io.disconnect(); countImpression(ad); }
        }, REWARD_VIEW_MS);
      }
    }, { threshold: [0.5] });
    io.observe(row);
  }

  function countImpression(ad) {
    chrome.storage.local.get({ session: null, stats: {} }, ({ session, stats }) => {
      if (!session || !session.email) return;
      const key = session.email.toLowerCase();
      const now = Date.now();
      const day = new Date(now).toISOString().slice(0, 10);
      const cur = stats[key] || { total: 0, day, today: 0, history: [], paise: 0 };
      const paise = ad.paid ? Math.round(USER_PAYOUT_RUPEES * 100) : 0;
      stats[key] = {
        total: cur.total + 1,
        day,
        today: cur.day === day ? cur.today + 1 : 1,
        paise: (cur.paise || 0) + paise,
        history: [{ ad: ad.title, ts: now, paise }, ...(cur.history || [])].slice(0, 50),
      };
      chrome.storage.local.set({ stats });
    });
  }

  setInterval(poll, 1000);
})();