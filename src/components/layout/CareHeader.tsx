import Link from "next/link";

// Minimal, proxy-safe header for the care-guides system (/a/careguides/*).
// Replaces the content-site nav, whose links fall outside the app proxy.
// In-system links are relative (stay under the proxy); Shop is the store.

const NAV = [
  { label: "Plants", href: "/a/careguides/plants" },
  { label: "Invertebrates", href: "/a/careguides/inverts" },
  { label: "Plant Finder", href: "/a/careguides/finder" },
];

export function CareHeader() {
  return (
    <header className="border-b border-ocean-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <Link href="/a/careguides" className="text-lg font-bold text-aqua-800">
          AquaticMotiv
        </Link>
        <nav className="hidden items-center gap-5 text-sm sm:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-ocean-900/70 transition-colors hover:text-aqua-700"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <a
          href="https://aquaticmotiv.com/collections/all"
          className="ml-auto rounded-full bg-aqua-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-aqua-700"
        >
          Shop
        </a>
      </div>
    </header>
  );
}
