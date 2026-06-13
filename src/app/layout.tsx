import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Aquatic Motiv - Your Complete Aquarium Resource",
  description:
    "Expert aquarium guides, fish profiles, product reviews, and care tips. Everything you need to build and maintain a thriving aquarium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <SessionProvider>
          <SiteChrome>{children}</SiteChrome>
        </SessionProvider>
      </body>
    </html>
  );
}
