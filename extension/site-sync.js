// Runs ONLY on glancepay.vercel.app. Copies the website login into the extension.
const KEY = "sb-ofybiuthkpfnbcadhdjp-auth-token";
let last = null;

function sync() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
  const token = s && s.access_token ? s.access_token : null;
  if (token === last) return;
  last = token;
  chrome.runtime.sendMessage({
    type: "site-session",
    session: token ? { access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at, email: s.user && s.user.email } : null,
  });
}
sync();
setInterval(sync, 1500);