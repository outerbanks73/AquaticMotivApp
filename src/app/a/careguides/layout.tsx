import type { ReactNode } from "react";
import { Fraunces, Hanken_Grotesk } from "next/font/google";

// Typography scoped to the care-guides system only (/a/careguides/*) — a
// distinctive editorial-botanical pairing that does NOT affect the rest of the
// app (admin/dashboard keep the root font). Fraunces = display serif (headings,
// stat numerals); Hanken Grotesk = body. Exposed as CSS vars so headings can opt
// in with `font-[family-name:var(--font-display)]`.
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export default function CareGuidesLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{ fontFamily: "var(--font-body), ui-sans-serif, system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
