// Shared guide card + types used by the hub launchpad and every category page,
// so the card looks and links identically everywhere. The image/title link to
// the care guide; a separate Shop link splits commercial intent off to the
// matching collection (informational vs. transactional).

export interface HubGuide {
  title: string;
  href: string;
  image: string;
  alt: string;
  shopHref: string;
}

export function GuideCard({ guide }: { guide: HubGuide }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-leaf-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-leaf-400 hover:shadow-lg">
      <a href={guide.href} className="relative block aspect-square overflow-hidden bg-leaf-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={guide.image}
          alt={guide.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-leaf-950 shadow">
          Guide
        </span>
      </a>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-bold leading-snug text-leaf-900">
          <a href={guide.href} className="hover:text-leaf-600">
            {guide.title}
          </a>
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <a
            href={guide.href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-600 hover:text-leaf-800"
          >
            Read guide
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href={guide.shopHref}
            className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-800 ring-1 ring-inset ring-leaf-200 transition-colors hover:bg-gold-400 hover:text-leaf-950 hover:ring-gold-400"
          >
            Shop
          </a>
        </div>
      </div>
    </article>
  );
}

// A plain server-rendered grid of guide cards — used by category pages. Every
// card link is a real <a href> in the initial HTML, so the full list is
// crawlable even though the hub only features a subset (progressive disclosure).
export function GuideCardGrid({ guides }: { guides: HubGuide[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {guides.map((g) => (
        <li key={g.href}>
          <GuideCard guide={g} />
        </li>
      ))}
    </ul>
  );
}
