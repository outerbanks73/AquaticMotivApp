import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { CareFooter } from "@/components/layout/CareFooter";
import { CareHeader } from "@/components/layout/CareHeader";

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

export const metadata: Metadata = {
  title: {
    default: "Aquarium Plants: Care Guides, Setup & Troubleshooting",
    template: "%s | Aquatic Motiv",
  },
  description:
    "Aquarium plant care guides, planted-tank setup help, and supporting invertebrate care guides from Aquatic Motiv.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={[display.variable, body.variable, "flex min-h-screen flex-col bg-white antialiased"].join(" ")}
        style={{ fontFamily: "var(--font-body), ui-sans-serif, system-ui, sans-serif" }}
      >
        <CareHeader />
        {children}
        <CareFooter />
      </body>
    </html>
  );
}
