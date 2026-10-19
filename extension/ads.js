const GLANCE_SITE = "https://glancepay.vercel.app";

// ONE switch for local testing. true = every ad credits money in YOUR browser only (fake, for testing).
// Must be false for anything you publish or share. Real earnings will come from the server.
const TEST_PAID = true;

// House ads promote Glance itself and pay nothing when TEST_PAID is false.
// A real advertiser ad will have paid: true, decided by the server.
// title = short name (shown in your earnings log), text = the one-line headline shown in the chat.
const GLANCE_ADS = [
  { title: "Get paid for AI chats", text: "Get paid for the AI chats you already have. Join Glance.", url: GLANCE_SITE, label: "AD", color: "#22c55e", paid: TEST_PAID },
  { title: "Advertise on Glance", text: "Reach people while they use AI tools. Advertise on Glance.", url: GLANCE_SITE, label: "AD", color: "#22c55e", paid: TEST_PAID },
  { title: "KrystlChat", text: "Check out KrystlChat.", url: "https://krystlchat.vercel.app", label: "SPONSORED", color: "#c084fc", paid: TEST_PAID },
  { title: "UPI payouts coming soon", text: "UPI payouts are coming soon. Join the waitlist on Glance.", url: GLANCE_SITE + "/#earn", label: "AD", color: "#f59e0b", paid: TEST_PAID },
];

// Placeholder for what one paid ad credits. Replaced by the server when real ads go live.
const USER_PAYOUT_RUPEES = 0.56;

// ===== AD PROVIDER =====
// The ONLY function to change when real ads arrive. It must resolve to
// { title, text, url, label?, color?, paid } or null (null = show nothing).
async function getAd() {
  return GLANCE_ADS[Math.floor(Math.random() * GLANCE_ADS.length)];
}