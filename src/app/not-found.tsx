import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="mb-4 text-6xl font-bold text-aqua-600">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-ocean-900">
        Page Not Found
      </h2>
      <p className="mb-8 text-gray-600">
        Looks like this page swam away. Try one of these popular sections
        instead.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/plants"
          className="rounded-lg bg-aqua-600 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-700"
        >
          Plant Guides
        </Link>
        <Link
          href="/inverts"
          className="rounded-lg bg-ocean-800 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-900"
        >
          Invertebrate Guides
        </Link>
        <Link
          href="https://aquaticmotiv.com/collections/all"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-ocean-900 hover:bg-gray-50"
        >
          Shop
        </Link>
      </div>
    </div>
  );
}
