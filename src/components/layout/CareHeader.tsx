import Link from "next/link";

// Minimal standalone header for the care-guides site.
// In-system links are root-relative on careguides.aquaticmotiv.com; Shop is the store.

const NAV = [
  { label: "Plants", href: "/plants" },
  { label: "Invertebrates", href: "/inverts" },
  { label: "Plant Finder", href: "/finder" },
];

export function CareHeader() {
  return (
    <header className="border-b border-leaf-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold tracking-wide"
          aria-label="AquaticMotiv care guides"
        >
          <span className="text-leaf-900">AQUATIC</span>
          <span className="text-leaf-600">MOTIV</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm sm:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-leaf-900/70 transition-colors hover:text-leaf-700"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <a
          href="https://aquaticmotiv.com/collections/all"
          className="ml-auto rounded-full bg-gold-400 px-4 py-1.5 text-sm font-semibold text-leaf-950 transition-colors hover:bg-gold-500"
        >
          Shop
        </a>
      </div>
    </header>
  );
}
