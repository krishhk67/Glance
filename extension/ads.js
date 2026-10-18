const GLANCE_SITE = "https://glance-jade.vercel.app";

// Test-mode house ads (they promote Glance itself).
const GLANCE_ADS = [
  { title: "Get paid for AI chats", body: "Glance shares ad money with you. Cash out as vouchers or PayPal.", cta: "See how", url: GLANCE_SITE },
  { title: "Advertise on Glance", body: "Reach people while they use AI tools. Ad slots open soon.", cta: "Join the list", url: GLANCE_SITE },
  { title: "UPI payouts coming soon", body: "Join the waitlist and be first to cash out with UPI.", cta: "Join waitlist", url: GLANCE_SITE + "/#earn" },
];

// Test mode only: what one viewed ad "pays" the user. In live mode the SERVER decides this.
const USER_PAYOUT_RUPEES = 0.56;

// ===== AD PROVIDER =====
// The ONLY function to change when real ads arrive. It must resolve to
// { title, body, cta, url } or null (null = show nothing).
async function getAd() {
  return GLANCE_ADS[Math.floor(Math.random() * GLANCE_ADS.length)];
}