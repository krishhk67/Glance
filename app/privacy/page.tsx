import { LegalPage, H, P, L } from "@/components/Legal";
import { OPERATOR, CONTACT_EMAIL, SITE } from "@/lib/legal";

export const metadata = { title: "Privacy Policy | Glance" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <P>This policy explains what {OPERATOR} (“Glance”, “we”, “us”) collects when you use the Glance website at {SITE} and the Glance Chrome extension, and what we do with it. We keep it short and specific on purpose.</P>

      <H>What Glance does</H>
      <P>Glance is a browser extension that shows a small, one-line ad above AI replies on ChatGPT, Claude and Gemini. Signed-in users can earn a share of what advertisers pay, once paid ads are running.</P>

      <H>What we collect</H>
      <L>
        <li><b>Account details.</b> Your email address and how you signed in (email and password, Google or GitHub). Passwords are handled by our authentication provider and are stored only in hashed form. If you sign in with Google or GitHub we receive your email and basic profile information, and nothing else.</li>
        <li><b>Extension data stored on your device.</b> Your login session, your settings (theme, ads on or off), and your ad activity: the name of each ad shown, the time, and any amount credited. At the moment this stays on your device and is not sent to us.</li>
        <li><b>Waitlist emails.</b> If you join the UPI waitlist, we store the email you enter.</li>
        <li><b>Payout details, later.</b> When payouts open, we will need your email and the payout amount and method to send you a voucher or a PayPal payment.</li>
        <li><b>Basic hosting logs.</b> Our hosting provider may record technical details such as IP address and browser type when you visit the website.</li>
      </L>

      <H>What we do not collect</H>
      <L>
        <li>We do <b>not</b> read, store or send the text of your chats or the AI’s replies. To tell when a new reply has started, the extension measures only the <i>length</i> of the newest reply, which is a number. The text itself is never recorded.</li>
        <li>We do not track your browsing. The extension runs only on chatgpt.com, claude.ai, gemini.google.com and our own website.</li>
        <li>We do not sell your personal data, and we do not use it to decide credit or lending.</li>
        <li>We do not use third-party advertising cookies or analytics tools on the website at present.</li>
      </L>

      <H>Permissions the extension asks for</H>
      <L>
        <li><b>Storage:</b> to keep your login, settings and ad activity on your device.</li>
        <li><b>Identity:</b> to open the Google or GitHub sign-in window when you choose “Continue with Google/GitHub” in the extension.</li>
        <li><b>Access to the four sites above:</b> to show the ad line in the chat and, on our website, to recognise that you are signed in.</li>
      </L>

      <H>How we use your data</H>
      <L>
        <li>To run your account and sign you in, on the website and in the extension.</li>
        <li>To show ads and to count which ads were viewed.</li>
        <li>To work out earnings and pay you, when payouts are available.</li>
        <li>To prevent fraud and abuse, for example fake views or multiple accounts.</li>
        <li>To contact you about your account or about changes to this policy.</li>
      </L>
      <P>Right now the extension keeps your ad counts on your device. When we begin crediting earnings on our servers, the extension will send ad view events (which ad, when, and your account) to us. We will update this policy before that starts.</P>

      <H>Who we share data with</H>
      <P>We use a few service providers who process data for us, only to run Glance:</P>
      <L>
        <li><b>Supabase</b>: authentication and our database (hosted in Mumbai, India).</li>
        <li><b>Vercel</b>: hosting of the website.</li>
        <li><b>Google and GitHub</b>: only if you choose to sign in with them.</li>
        <li><b>Payout providers</b> (for example a gift-card or PayPal provider): your email and payout amount, only when you request a payout.</li>
      </L>
      <P>Ads link to other websites. When you click an ad, that site’s own privacy policy applies. We may also disclose information if the law requires it.</P>

      <H>Google and Chrome Web Store data rules</H>
      <P>Our use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. We use Google sign-in data only to create and sign you into your Glance account. We do not transfer or sell this data, and we do not use it for advertising.</P>

      <H>How long we keep data</H>
      <P>We keep your account data while your account is active. If you ask us to delete your account, we delete your account and related data, except what we must keep for legal, tax or fraud-prevention reasons. Data stored by the extension on your device is removed when you uninstall it.</P>

      <H>Your rights and choices</H>
      <L>
        <li>You can ask to see, correct or delete the personal data we hold about you.</li>
        <li>You can turn ads off in the extension’s Settings, sign out, or uninstall the extension at any time.</li>
        <li>You can withdraw consent at any time. This may mean we can no longer provide the service.</li>
        <li>Under India’s Digital Personal Data Protection Act, 2023 you also have the right to grievance redressal. Write to us at the address below and we will respond within a reasonable time.</li>
      </L>

      <H>Security</H>
      <P>We use reputable providers and encrypted connections, and each user can only access their own account data. No system is perfectly secure, so we cannot guarantee absolute security.</P>

      <H>Children</H>
      <P>Glance is meant for people aged 18 and over. We do not knowingly collect data from anyone under 18. If you think a child has given us data, contact us and we will delete it.</P>

      <H>Changes to this policy</H>
      <P>If we change this policy, we will update the date at the top. If the changes are significant, for example a new kind of data collection, we will tell you on the website or by email.</P>

      <H>Contact and grievance officer</H>
      <P>{OPERATOR}<br />Email: {CONTACT_EMAIL}</P>
    </LegalPage>
  );
}