import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Geist_Mono, Libre_Caslon_Display, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";

// The Members' Ledger type system (docs/styles/clubhouse.md), self-hosted at build by next/font.
// Each exposes a CSS variable that globals.css maps to font-display / font-serif / font-sans / font-numeral.
const caslonDisplay = Libre_Caslon_Display({ weight: "400", subsets: ["latin"], variable: "--font-caslon-display" });
const caslonText = Libre_Caslon_Text({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-caslon-text" });
const barlow = Barlow({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-barlow" });
const barlowCondensed = Barlow_Condensed({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-barlow-condensed" });
// The hub's progress labels still use font-mono.
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "18 Eagles · Assignment 3", template: "%s · 18 Eagles" },
  description: "A personal golf round journal: play hole by hole, keep every card, and watch your handicap move.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${caslonDisplay.variable} ${caslonText.variable} ${barlow.variable} ${barlowCondensed.variable} ${geistMono.variable} h-full bg-paper text-ink antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
