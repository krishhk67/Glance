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

  const DEBUG = false; // set to true to see step-by-step logs in the page console (counts only, never chat text)
  const log = (...a) => { if (DEBUG) console.log("[Glance]", ...a); };

  const MIN_GAP_MS = 20000;    // at most one ad per 20 seconds
  const REWARD_VIEW_MS = 1000; // ad must be on screen this long to count

  const seen = new WeakSet();
  let tracked = null, lastLen = 0, lastAdAt = 0;
  // Replies already on the page when it loads never get an ad.
  setTimeout(() => document.querySelectorAll(selector).forEach((e) => seen.add(e)), 1500);
  log("content script loaded on", location.hostname);

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
    if (!chrome.runtime || !chrome.runtime.id) { log("stopped: extension was reloaded, refresh this tab"); return; }
    if (Date.now() - lastAdAt < MIN_GAP_MS) { log("skipped: less than 20s since the last ad"); return; }
    if (document.visibilityState !== "visible") { log("skipped: tab not visible"); return; }
    chrome.storage.local.get({ enabled: true, session: null }, ({ enabled, session }) => {
      if (!enabled) { log("skipped: ads switched off in the popup"); return; }
      if (!session) { log("skipped: not signed in to the extension"); return; } // ads only for signed-in users
      lastAdAt = Date.now();
      getAd().then((ad) => ad && placeAd(reply, ad));
    });
  }

  // True when the page is dark (its text is light), so we pick a link blue that stays readable.
  function isDarkPage(el) {
    const m = (getComputedStyle(el).color || "").match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return true;
    const [r, g, b] = m.map(Number);
    return 0.299 * r + 0.587 * g + 0.114 * b > 128;
  }

  // Inserts a one-line ad just above the AI reply, inside the chat.
  function placeAd(reply, ad) {
    if (!reply.isConnected || !reply.parentNode) return;
    const host = document.createElement("div");
    host.setAttribute("data-glance-ad", "");
    const root = host.attachShadow({ mode: "closed" });
    root.innerHTML = `<style>
      :host{display:block}
      .row{display:flex;align-items:center;gap:12px;padding:12px 0;margin-bottom:10px;border-bottom:1px solid rgba(128,128,128,.25);font:inherit;color:inherit}
      .ic{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:700 15px system-ui,sans-serif;color:#121212}
      a{font-size:17px;font-weight:700;line-height:1.3;text-decoration:none}
      a:hover{text-decoration:underline}
      .tag{margin-left:auto;flex:none;font:11px ui-monospace,Consolas,monospace;letter-spacing:.06em;opacity:.6}
      .x{flex:none;background:none;border:0;color:inherit;opacity:.55;font:22px/1 system-ui,sans-serif;cursor:pointer;padding:0 4px}
      .x:hover{opacity:1}
      .x:focus-visible{outline:2px solid #3b82f6;outline-offset:2px;opacity:1}
    </style><div class="row"><span class="ic"></span><a target="_blank" rel="noopener noreferrer"></a><span class="tag"></span><button class="x" type="button" aria-label="Remove this ad">×</button></div>`;
    const row = root.querySelector(".row");
    const ic = root.querySelector(".ic");
    ic.textContent = (ad.title || "A").charAt(0).toUpperCase();
    ic.style.background = ad.color || "#22c55e";
    const a = root.querySelector("a");
    a.textContent = ad.text || ad.title;
    a.href = /^https:\/\//.test(ad.url) ? ad.url : "#";
    a.style.color = isDarkPage(reply) ? "#60a5fa" : "#2563eb";
    root.querySelector(".tag").textContent = ad.label || "AD";
    reply.parentNode.insertBefore(host, reply);
    log("ad placed:", ad.title);

    let viewTimer = null, counted = false;
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(viewTimer);
      if (e.isIntersecting && e.intersectionRatio >= 0.5 && !counted) {
        viewTimer = setTimeout(() => {
          if (document.visibilityState === "visible") { counted = true; io.disconnect(); countImpression(ad); log("view counted"); }
        }, REWARD_VIEW_MS);
      }
    }, { threshold: [0.5] });
    io.observe(row);

    // Cross button: lets anyone remove the ad manually.
    root.querySelector(".x").addEventListener("click", () => {
      io.disconnect();
      clearTimeout(viewTimer);
      host.remove();
    });
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