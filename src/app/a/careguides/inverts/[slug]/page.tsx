import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllInverts, getInvertBySlug, getInvertSlugs } from "@/lib/data/inverts";
import { getPlantBySlug } from "@/lib/data/plants";
import {
  getActiveInvertFacets,
  getInvertFacetSpecies,
  getInvertFacetsForSpecies,
  assertNoInvertFacetSpeciesSlugCollision,
  type InvertFacet,
} from "@/lib/data/invert-facets";
import {
  invertUrl,
  leadSentences,
  sortInvertsByDifficultyThenName,
  getInvertCommerceByHandle,
  invertCommerceFor,
  findInStockInvertAlternatives,
} from "@/lib/data/invert-pages";
import { InvertProfile, type RelatedPlantLink } from "@/components/tools/InvertProfile";
import { InvertFacetPage } from "@/components/tools/InvertFacetPage";

interface Props {
  params: Promise<{ slug: string }>;
}

// One namespace serves facets and species; only build-time slugs resolve.
export const dynamicParams = false;

function getActiveFacet(slug: string): InvertFacet | undefined {
  return getActiveInvertFacets().find((f) => f.slug === slug);
}

export async function generateStaticParams() {
  // Build fails loudly if a facet slug shadows a species slug.
  assertNoInvertFacetSpeciesSlugCollision();
  const slugs = [
    ...getActiveInvertFacets().map((f) => f.slug),
    ...getInvertSlugs(),
  ];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const facet = getActiveFacet(slug);
  if (facet) {
    return {
      title: facet.metaTitle,
      description: facet.metaDescription,
      alternates: { canonical: invertUrl(facet.slug) },
      ...(facet.noindex && { robots: { index: false, follow: true } }),
    };
  }

  const invert = getInvertBySlug(slug);
  if (!invert) return {};
  return {
    title: `${invert.commonName} Care — Size, Lifespan & Tank Mates | AquaticMotiv`,
    description: leadSentences(invert.careSummary),
    alternates: { canonical: invertUrl(invert.slug) },
  };
}

export default async function InvertSlugRoute({ params }: Props) {
  const { slug } = await params;

  // Facet first, then species — facet slugs are the reserved list.
  const facet = getActiveFacet(slug);
  if (facet) {
    const commerceByHandle = await getInvertCommerceByHandle();
    const species = sortInvertsByDifficultyThenName(getInvertFacetSpecies(facet));
    const siblings = getActiveInvertFacets().filter((f) => f.slug !== facet.slug);
    return (
      <InvertFacetPage
        facet={facet}
        species={species}
        commerceByHandle={commerceByHandle}
        siblings={siblings}
      />
    );
  }

  const invert = getInvertBySlug(slug);
  if (!invert) notFound();

  const commerceByHandle = await getInvertCommerceByHandle();
  const commerce = invertCommerceFor(invert, commerceByHandle);
  const alternatives =
    !commerce || !commerce.availableForSale
      ? findInStockInvertAlternatives(invert, getAllInverts(), commerceByHandle)
      : [];

  // Resolve related plant slugs to names; drop any that no longer exist.
  const relatedPlants: RelatedPlantLink[] = invert.relatedPlants
    .map((plantSlug) => getPlantBySlug(plantSlug))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => ({ slug: p.slug, commonName: p.commonName }));

  return (
    <InvertProfile
      invert={invert}
      commerce={commerce}
      alternatives={alternatives}
      facets={getInvertFacetsForSpecies(invert)}
      relatedPlants={relatedPlants}
    />
  );
}
