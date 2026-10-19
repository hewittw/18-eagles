import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Barlow, Barlow_Condensed, Libre_Caslon_Display, Libre_Caslon_Text } from "next/font/google";
import { palette } from "./palette";
import "./mood-board.css";

// Fonts are scoped to this route: they load only under /mood-board, self-hosted at build by next/font.
const display = Libre_Caslon_Display({ weight: "400", subsets: ["latin"], variable: "--font-mb-display" });
const text = Libre_Caslon_Text({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-mb-text" });
const sans = Barlow({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-mb-sans" });
const cond = Barlow_Condensed({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-mb-cond" });

export const metadata: Metadata = {
  title: "Mood board · The Members' Ledger",
  description:
    "The clubhouse direction for 18 Eagles: Ceremonial, Tailored, Sunlit. References, collected images, and studies drawn in code.",
};

// The palette is the single source of truth: palette.ts → CSS custom properties on the route wrapper.
const vars = Object.fromEntries(
  Object.entries(palette).map(([k, v]) => [`--mb-${k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}`, v.hex]),
) as CSSProperties;

export default function MoodBoardLayout({ children }: LayoutProps<"/mood-board">) {
  return (
    <div
      style={vars}
      className={`mb ${display.variable} ${text.variable} ${sans.variable} ${cond.variable} flex-1`}
    >
      <a href="#main" className="mb-skip">
        Skip to main content
      </a>
      {children}
    </div>
  );
}
