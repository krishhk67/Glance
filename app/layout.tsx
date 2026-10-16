import "./globals.css";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
const sans = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
export const metadata = { title: "Glance: get paid for the ads you see in AI chats", description: "Earn on every AI reply. Cash out as gift vouchers or PayPal." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${sans.variable} ${mono.variable} font-sans antialiased`}>{children}</body></html>);
}
