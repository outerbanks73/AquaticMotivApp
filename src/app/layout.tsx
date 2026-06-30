import type { Metadata } from "next";
import "./globals.css";
import { CareFooter } from "@/components/layout/CareFooter";
import { CareHeader } from "@/components/layout/CareHeader";

export const metadata: Metadata = {
  title: {
    default: "Freshwater Aquarium Care Guides | Aquatic Motiv",
    template: "%s | Aquatic Motiv",
  },
  description:
    "Freshwater aquarium plant and invertebrate care guides from Aquatic Motiv.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white antialiased">
        <CareHeader />
        {children}
        <CareFooter />
      </body>
    </html>
  );
}
