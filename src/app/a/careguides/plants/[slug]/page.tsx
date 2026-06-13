import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPlants, getPlantBySlug, getPlantSlugs, getArticlesForPlant, getCarePageForPlant } from "@/lib/data/plants";
import {
  getActiveFacets,
  getFacetSpecies,
  getFacetsForSpecies,
  assertNoFacetSpeciesSlugCollision,
  type PlantFacet,
} from "@/lib/data/plant-facets";
import {
  plantUrl,
  leadSentences,
  sortByDifficultyThenName,
  getPlantCommerceByHandle,
  commerceFor,
  findInStockAlternatives,
} from "@/lib/data/plant-pages";
import { PlantProfile } from "@/components/tools/PlantProfile";
import { PlantFacetPage } from "@/components/tools/PlantFacetPage";

interface Props {
  params: Promise<{ slug: string }>;
}

// One namespace serves facets and species; only build-time slugs resolve.
export const dynamicParams = false;

function getActiveFacet(slug: string): PlantFacet | undefined {
  return getActiveFacets().find((f) => f.slug === slug);
}

export async function generateStaticParams() {
  // Build fails loudly if a facet slug shadows a species slug.
  assertNoFacetSpeciesSlugCollision();
  const slugs = [
    ...getActiveFacets().map((f) => f.slug),
    ...getPlantSlugs(),
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
      alternates: { canonical: plantUrl(facet.slug) },
    };
  }

  const plant = getPlantBySlug(slug);
  if (!plant) return {};
  // Species with a live /pages/ care guide get a specs-intent title so the two
  // pages target different queries instead of competing (owner decision: the
  // converting care guides keep "care" intent; these pages own specs/stock).
  const hasCareGuide = Boolean(getCarePageForPlant(plant.slug));
  return {
    title: hasCareGuide
      ? `${plant.commonName} — Specs, Parameters & Live Stock | AquaticMotiv`
      : `${plant.commonName} Care — Light, CO2 & Growth | AquaticMotiv`,
    description: leadSentences(plant.careSummary),
    alternates: { canonical: plantUrl(plant.slug) },
  };
}

export default async function PlantSlugRoute({ params }: Props) {
  const { slug } = await params;

  // Facet first, then species — facet slugs are the reserved list.
  const facet = getActiveFacet(slug);
  if (facet) {
    const commerceByHandle = await getPlantCommerceByHandle();
    const species = sortByDifficultyThenName(getFacetSpecies(facet));
    const siblings = getActiveFacets().filter((f) => f.slug !== facet.slug);
    return (
      <PlantFacetPage
        facet={facet}
        species={species}
        commerceByHandle={commerceByHandle}
        siblings={siblings}
      />
    );
  }

  const plant = getPlantBySlug(slug);
  if (!plant) notFound();

  const commerceByHandle = await getPlantCommerceByHandle();
  const commerce = commerceFor(plant, commerceByHandle);
  const alternatives =
    !commerce || !commerce.availableForSale
      ? findInStockAlternatives(plant, getAllPlants(), commerceByHandle)
      : [];

  return (
    <PlantProfile
      plant={plant}
      commerce={commerce}
      alternatives={alternatives}
      facets={getFacetsForSpecies(plant)}
      articles={getArticlesForPlant(plant.slug)}
      carePageHandle={getCarePageForPlant(plant.slug)}
    />
  );
}
