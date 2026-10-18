const SUPABASE_URL = "https://ofybiuthkpfnbcadhdjp.supabase.co";
const SUPABASE_KEY = "sb_publishable_WO0YoJ6Od4-ZkKJHxz_eZQ_pU9lnGNj"; // public key

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "site-session") {
    if (msg.session) chrome.storage.local.set({ session: msg.session });
    else chrome.storage.local.remove("session");
    return;
  }
  if (msg.type !== "oauth") return;
  oauthLogin(msg.provider)
    .then(() => sendResponse({ ok: true }))
    .catch((e) => sendResponse({ ok: false, error: e.message }));
  return true; // keep the channel open for the async reply
});

async function oauthLogin(provider) {
  const redirectTo = chrome.identity.getRedirectURL();
  const url = `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
  const result = await chrome.identity.launchWebAuthFlow({ url, interactive: true });
  const params = new URLSearchParams(new URL(result).hash.slice(1));
  const access_token = params.get("access_token");
  if (!access_token) throw new Error(params.get("error_description") || "Sign in cancelled");
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${access_token}` },
  });
  const user = await res.json();
  if (!res.ok) throw new Error("Could not read your account");
  const session = { access_token, refresh_token: params.get("refresh_token"), expires_at: Number(params.get("expires_at")), email: user.email };
  await chrome.storage.local.set({ session });
}