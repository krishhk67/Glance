const GLANCE_SITE = "https://glancepay.vercel.app";

// House ads promote Glance itself and pay nothing (paid: false).
// A real advertiser ad must have paid: true. The server decides what it pays.
const GLANCE_ADS = [
  { title: "Get paid for AI chats", body: "Glance shares ad money with you. Cash out as vouchers or PayPal.", cta: "See how", url: GLANCE_SITE, paid: false },
  { title: "Advertise on Glance", body: "Reach people while they use AI tools. Ad slots open soon.", cta: "Join the list", url: GLANCE_SITE, paid: false },
  { title: "UPI payouts coming soon", body: "Join the waitlist and be first to cash out with UPI.", cta: "Join waitlist", url: GLANCE_SITE + "/#earn", paid: false },
];

// Placeholder for what one paid ad credits. Replaced by the server when real ads go live.
const USER_PAYOUT_RUPEES = 0.56;

// ===== AD PROVIDER =====
// The ONLY function to change when real ads arrive. It must resolve to
// { title, body, cta, url, paid } or null (null = show nothing).
async function getAd() {
  return GLANCE_ADS[Math.floor(Math.random() * GLANCE_ADS.length)];
}