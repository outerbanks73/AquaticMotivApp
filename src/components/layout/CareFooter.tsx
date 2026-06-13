import Link from "next/link";

// Minimal footer for the care-guides system. In-system links relative;
// store links absolute to aquaticmotiv.com.

export function CareFooter() {
  return (
    <footer className="border-t border-ocean-100 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 text-sm text-ocean-900/60">
        <Link href="/a/careguides" className="font-semibold text-aqua-800">
          AquaticMotiv Care Guides
        </Link>
        <Link href="/a/careguides/plants" className="hover:text-aqua-700">
          Plant database
        </Link>
        <Link href="/a/careguides/inverts" className="hover:text-aqua-700">
          Invertebrate guides
        </Link>
        <Link href="/a/careguides/finder" className="hover:text-aqua-700">
          Plant finder
        </Link>
        <a
          href="https://aquaticmotiv.com"
          className="hover:text-aqua-700"
        >
          Main store
        </a>
        <span className="ml-auto">© AquaticMotiv</span>
      </div>
    </footer>
  );
}
