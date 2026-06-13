"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CareHeader } from "./CareHeader";
import { CareFooter } from "./CareFooter";

// Picks the chrome by route: the care-guides system (/a/careguides/*) gets a
// minimal proxy-safe header/footer; everything else keeps the content-site nav.
// Care pages provide their own <main>, so we don't wrap them in another one.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isCare = pathname.startsWith("/a/careguides");

  if (isCare) {
    return (
      <>
        <CareHeader />
        {children}
        <CareFooter />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
