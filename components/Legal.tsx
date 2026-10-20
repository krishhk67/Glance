import type { ReactNode } from "react";
import { UPDATED } from "@/lib/legal";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="flex items-center justify-between py-6">
        <a href="/" className="text-2xl font-bold">glance</a>
        <a href="/" className="lbl">← Back to site</a>
      </header>
      <h1 className="mt-6 text-4xl font-bold">{title}</h1>
      <p className="lbl mt-2">Last updated {UPDATED}</p>
      <div className="mt-6">{children}</div>
    </main>
  );
}
export const H = ({ children }: { children: ReactNode }) => <h2 className="mt-10 text-xl font-bold">{children}</h2>;
export const P = ({ children }: { children: ReactNode }) => <p className="mt-3 leading-relaxed text-neutral-300">{children}</p>;
export const L = ({ children }: { children: ReactNode }) => <ul className="mt-3 list-disc space-y-1.5 pl-6 leading-relaxed text-neutral-300">{children}</ul>;