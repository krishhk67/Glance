import { LegalPage, H, P, L } from "@/components/Legal";
import { OPERATOR, CONTACT_EMAIL, CITY, SITE } from "@/lib/legal";

export const metadata = { title: "Terms of Use | Glance" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Use">
      <P>These terms are between you and {OPERATOR} (“Glance”, “we”, “us”). By creating an account or using the Glance website ({SITE}) or Chrome extension, you agree to them. If you do not agree, please do not use Glance.</P>

      <H>1. Who can use Glance</H>
      <P>You must be 18 or older and able to enter a binding contract. You are responsible for the information you give us and for keeping your login safe.</P>

      <H>2. What Glance is</H>
      <P>The Glance extension shows a one-line ad above AI replies on ChatGPT, Claude and Gemini. Glance is not affiliated with, endorsed by or sponsored by OpenAI, Anthropic or Google. Those services have their own terms, and you are responsible for following them.</P>

      <H>3. Earnings</H>
      <L>
        <li>You earn money only when a <b>paid</b> ad is shown and counted as a valid view. Ads that promote Glance or our partners may not pay anything.</li>
        <li>Examples and calculators on our website are <b>estimates</b>, not promises. Real earnings depend on advertisers, their budgets, and your usage.</li>
        <li>A view counts only if the ad was actually on screen for a short time in an active browser tab, and the amount per view is decided by us.</li>
        <li>Until paid ads are live, you may see a balance of ₹0.00. That is expected.</li>
      </L>

      <H>4. Payouts</H>
      <L>
        <li>You can request a payout once your balance reaches the minimum for your chosen method (currently gift cards and vouchers, and PayPal).</li>
        <li>Payouts can take time to review. We may ask for more information before paying.</li>
        <li>You are responsible for any taxes on what you earn.</li>
        <li>UPI payouts are not available yet.</li>
      </L>

      <H>5. Fair use and fraud</H>
      <P>You must not:</P>
      <L>
        <li>use bots, scripts, automation or other tools to create views or clicks;</li>
        <li>create more than one account, or use someone else’s account;</li>
        <li>click on or view ads in a way meant to inflate earnings, or ask others to;</li>
        <li>interfere with the extension, the ads, or our systems, or try to get around limits;</li>
        <li>use Glance for anything illegal.</li>
      </L>
      <P>If we reasonably believe you broke these rules, we may remove the affected earnings, withhold a payout, or suspend or close your account.</P>

      <H>6. Ads and third-party sites</H>
      <P>Ads link to websites that are not ours. We are not responsible for those sites or for what advertisers offer. You can close any ad with its × button or switch ads off in the extension’s Settings.</P>

      <H>7. Your data</H>
      <P>How we handle personal data is described in our <a href="/privacy" className="text-lilac underline">Privacy Policy</a>.</P>

      <H>8. Our rights</H>
      <P>Glance, its design and its code belong to us or our licensors. You get a personal, non-exclusive, non-transferable right to use the extension and website while these terms apply. You may not copy, resell or reverse engineer them, except where the law allows it.</P>

      <H>9. Changes and availability</H>
      <P>Glance is an early-stage product. We may change, pause or stop features, payout methods, the amounts we pay, or the whole service. If we change these terms in a way that matters, we will tell you on the website or by email. Using Glance after a change means you accept it.</P>

      <H>10. Ending your account</H>
      <P>You can stop using Glance at any time and ask us to delete your account. We may suspend or close accounts that break these terms. Any valid, unpaid earnings that reached the payout minimum before closing will be handled in line with section 4, unless they were affected by fraud.</P>

      <H>11. Disclaimer</H>
      <P>Glance is provided “as is” and “as available”. We do not promise it will be uninterrupted, error-free, or that it will keep working with ChatGPT, Claude or Gemini, which can change at any time.</P>

      <H>12. Limit of liability</H>
      <P>To the extent the law allows, we are not liable for indirect or consequential losses, lost profits or lost earnings. Our total liability to you for any claim is limited to the amount you earned and had not yet been paid, or ₹1,000, whichever is higher. Nothing in these terms limits liability that cannot be limited by law.</P>

      <H>13. Governing law</H>
      <P>These terms are governed by the laws of India. Courts in {CITY} have jurisdiction over disputes, unless the law says otherwise.</P>

      <H>14. Contact</H>
      <P>{OPERATOR}<br />Email: {CONTACT_EMAIL}</P>
    </LegalPage>
  );
}