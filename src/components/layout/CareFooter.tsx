import Link from "next/link";

// Minimal footer for the care-guides system. In-system links point at
// the canonical Shopify app-proxy URL; store links point at aquaticmotiv.com.

export function CareFooter() {
  return (
    <footer className="border-t border-leaf-100 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 text-sm text-leaf-900/60">
        <Link href="https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide" className="font-semibold text-leaf-800">
          AquaticMotiv Care Guides
        </Link>
        <Link href="https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/plants" className="hover:text-leaf-700">
          Plant database
        </Link>
        <Link href="https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/inverts" className="hover:text-leaf-700">
          Invertebrate guides
        </Link>
        <Link href="https://aquaticmotiv.com/a/freshwater-aquatic-planted-tank-guide/finder" className="hover:text-leaf-700">
          Plant finder
        </Link>
        <a
          href="https://aquaticmotiv.com"
          className="hover:text-leaf-700"
        >
          Main store
        </a>
        <span className="ml-auto">© AquaticMotiv</span>
      </div>
    </footer>
  );
}
