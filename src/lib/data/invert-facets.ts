// Facet definitions for the invertebrate knowledge graph SEO pages.
// Each facet is a reserved slug under /a/careguides/inverts/[slug] — same
// pattern as plant-facets.ts. A facet only renders (is "active") when at
// least MIN_SPECIES_PER_FACET species match its predicate.

import type { InvertSpecies, InvertFaq } from "@/types/inverts";
import { getAllInverts, getInvertSlugs } from "@/lib/data/inverts";

export type InvertFacetGroup = "type" | "goal";

export interface InvertFacet {
  slug: string;
  group: InvertFacetGroup;
  /** H1, phrased as the search query */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** 2–4 sentence original answer paragraph, quotable by AI assistants */
  directAnswer: string;
  faqs: InvertFaq[];
  predicate: (i: InvertSpecies) => boolean;
  /**
   * When true, the facet page renders and stays reachable (no 404) but is served
   * `robots: noindex,follow`. Mirrors the plant-facets mechanism — see
   * docs/CARE-GUIDES-SCALING-PLAN.md Phase 0.
   */
  noindex?: boolean;
}

export const MIN_SPECIES_PER_FACET = 4;

const FACETS: InvertFacet[] = [
  // ── By type ───────────────────────────────────────────────────────────
  {
    slug: "snails",
    group: "type",
    title: "Freshwater aquarium snails",
    metaTitle: "Freshwater Aquarium Snails — Every Species Compared | AquaticMotiv",
    metaDescription:
      "Every freshwater snail we track with verified care data: size, lifespan, GH and calcium needs, breeding behavior, and whether it will overrun your tank.",
    directAnswer:
      "Freshwater aquarium snails span a far wider range than the pest-or-pet debate suggests: algae-grazing nerites that never breed in freshwater, slow livebearing trapdoors and rabbit snails, burrowing sand-keepers, and even a predatory species that hunts other snails. The two questions that actually sort them are shell chemistry — every snail needs hardness and calcium, and most want pH at 7.0 or above — and reproduction, which ranges from physically impossible in freshwater to exponential. Match those two traits to your tank and there is a snail for nearly every setup.",
    faqs: [
      {
        question: "What water do aquarium snails need to keep their shells healthy?",
        answer:
          "Hard, alkaline water: pH at or above 7.0 and GH of roughly 8 dGH or more for most species. In soft or acidic water the shell dissolves faster than the snail can build it, producing pits and white erosion that never heal. Cuttlebone, crushed coral, or calcium-rich foods cover the gap when tap water runs soft.",
      },
      {
        question: "Which aquarium snails will not multiply in my tank?",
        answer:
          "Snails whose larvae need brackish water — nerites, black devil snails, and chopstick snails — can never establish a population in freshwater. Livebearing species like trapdoor, rabbit, and white wizard snails do reproduce, but a baby at a time, slowly enough that offspring are a bonus rather than a problem.",
      },
      {
        question: "Are snails good or bad for a planted tank?",
        answer:
          "The species sold for aquariums are overwhelmingly good: they graze algae and biofilm, eat decaying leaves before they foul the water, and several turn the substrate the way earthworms turn soil. The plant-eating reputation belongs to wild pond snails and large apple snails, not to the cleanup-crew species in this list.",
      },
    ],
    predicate: (i) => i.type === "snail",
  },
  {
    slug: "shrimp",
    group: "type",
    title: "Freshwater aquarium shrimp",
    metaTitle: "Freshwater Aquarium Shrimp — Species & Care Compared | AquaticMotiv",
    metaDescription:
      "Cherry, Amano, ghost, bamboo, and crystal shrimp compared on verified data: water parameters, breeding, algae-eating ability, and tankmate safety.",
    directAnswer:
      "Freshwater shrimp divide into a few honest tiers: hardy Neocaridina like cherry shrimp that thrive in ordinary tap water and breed readily, the larger Amano and bamboo shrimp whose larvae need saltwater and so never overpopulate, and the soft-water Caridina show shrimp that demand remineralized RO water and a dedicated tank. All of them are molting animals, which makes stable water chemistry — especially GH — matter more than any single parameter. Pick the tier that matches your water before you pick a color.",
    faqs: [
      {
        question: "What is the easiest aquarium shrimp for a beginner?",
        answer:
          "Cherry shrimp (Neocaridina davidi). They tolerate the widest parameter range of any dwarf shrimp, breed in plain freshwater without help, and a starter group of ten becomes a self-sustaining colony within months in a stable, predator-free tank.",
      },
      {
        question: "Why do shrimp die when they molt?",
        answer:
          "Failed molts almost always trace to water chemistry — GH too low to build a proper new shell, or a sudden large water change that triggered a premature molt. Keep GH in the species' range, change water in small regular amounts, and leave shed shells in the tank for the shrimp to recycle.",
      },
      {
        question: "Can shrimp live with fish?",
        answer:
          "Adults of the larger species (Amano, bamboo, ghost) coexist with most community fish; dwarf shrimp adults survive alongside small peaceful fish if the tank has moss and cover. Shrimplets are food to anything with a mouth, so a colony only grows where dense planting tips the odds — or where fish are absent.",
      },
    ],
    predicate: (i) => i.type === "shrimp",
  },

  // ── By goal ───────────────────────────────────────────────────────────
  {
    slug: "best-algae-eaters",
    group: "goal",
    title: "The best algae-eating snails and shrimp",
    metaTitle: "Best Algae Eaters — Snails & Shrimp That Actually Work | AquaticMotiv",
    metaDescription:
      "Invertebrates ranked by real algae-eating ability: nerites for glass and hardscape, Amano shrimp for hair algae, and the honest limits of each.",
    directAnswer:
      "No single invertebrate eats every kind of algae, so the right cleanup crew is a pairing: nerite snails are the unmatched specialists for the hard films — green spot and diatoms on glass and hardscape — while Amano shrimp are the best in the hobby against soft hair and thread algae. Around that core, mystery snails, ramshorns, and cherry shrimp handle the easy soft films and edible leftovers. None of them touch established black beard algae, and none of them fix the light or nutrient surplus that grew the algae in the first place.",
    faqs: [
      {
        question: "What is the single best algae eater for a small tank?",
        answer:
          "A nerite snail. One nerite per five gallons of algae-growing surface erases green spot and diatom films that nothing else grazes as hard, it cannot reproduce in freshwater, and it is safe with bettas, shrimp, and plants. In nano tanks, the half-inch horned nerite does the same job between carpet plants.",
      },
      {
        question: "Do algae eaters mean I never have to clean the tank?",
        answer:
          "No — they are maintenance, not magic. Grazers keep surfaces clean in a tank that is already roughly in balance; they cannot outpace algae driven by excess light or nutrients. If algae is winning, shorten the photoperiod and check fertilization first, then let the crew handle the residue.",
      },
      {
        question: "Why are my Amano shrimp not eating the algae?",
        answer:
          "Usually because fish food is easier. Amanos are opportunists that prefer pellets and wafers to working; cut back feeding for a week and they return to grazing. Also check the algae type — Amanos specialize in soft hair and thread algae and ignore green spot entirely.",
      },
    ],
    predicate: (i) => i.roles.includes("algae-eater"),
  },
  {
    slug: "wont-overrun-tank",
    group: "goal",
    title: "Snails and shrimp that won't overrun your tank",
    metaTitle: "Inverts That Won't Overrun Your Tank — No Population Explosions | AquaticMotiv",
    metaDescription:
      "Snails, shrimp, and other inverts verified not to multiply out of control: species that can't breed in freshwater plus slow livebearers.",
    directAnswer:
      "Fear of a snail explosion keeps a lot of aquarists from excellent animals, but population growth is a species trait you can select for. The bulletproof choices are the brackish-larvae group — nerites, Amano and bamboo shrimp, black devil and chopstick snails — whose young physically cannot survive in freshwater, so the number you buy is the number you have. Just behind them are the slow livebearers like rabbit, trapdoor, and white wizard snails, which produce single fully formed babies at a pace collectors celebrate rather than control.",
    faqs: [
      {
        question: "Which snails are guaranteed never to breed in my tank?",
        answer:
          "Nerites (zebra, horned, tiger, and related), black devil snails, and chopstick snails. All three lay eggs whose larvae require brackish or marine water to develop, so nothing ever hatches in freshwater. The only side effect is cosmetic: nerite eggs sit on hardscape as hard white dots for months.",
      },
      {
        question: "What makes pest snails different from these species?",
        answer:
          "Pest species — bladder snails, ramshorns, Malaysian trumpets — are hermaphroditic or parthenogenetic fast breeders whose numbers track food supply, so one hitchhiker becomes hundreds in an overfed tank. The species on this list either cannot reproduce in freshwater at all or bear single live young a few times a year.",
      },
      {
        question: "Do I need a male and female for the slow-breeding snails?",
        answer:
          "Yes — rabbit, trapdoor, white wizard, and blueberry snails all have separate sexes, so a single animal will never reproduce. Mystery snails too, though a female can store sperm for months after purchase and surprise you with one clutch laid above the waterline, where it is easy to remove.",
      },
    ],
    predicate: (i) =>
      i.populationGrowth === "none" || i.populationGrowth === "slow",
  },
  {
    slug: "betta-safe-tankmates",
    group: "goal",
    title: "Betta-safe invertebrate tankmates",
    metaTitle: "Betta-Safe Tankmates — Snails & Inverts That Work | AquaticMotiv",
    metaDescription:
      "Invertebrates verified to coexist with bettas: armored snails the betta ignores, plus the shrimp and crabs that need more caution.",
    directAnswer:
      "The invertebrates that reliably work with a betta share one trait: armor. Snails carry their defense with them, so nerites, trapdoors, rabbit snails, and the other shelled grazers shrug off the curiosity nips a betta delivers and then get ignored. Soft-bodied tankmates are a different bet — dwarf shrimp read as prey to many bettas — which is why everything on this list rates a clean 'yes' rather than a hopeful 'maybe'. The snails also cover the jobs a betta tank actually needs done: algae on the glass and leftover pellets on the floor.",
    faqs: [
      {
        question: "Will my betta attack a snail?",
        answer:
          "Most bettas investigate a new snail with a nip or two, get nothing for the effort, and lose interest permanently. Watch for the exception: a persistently aggressive betta can bite at extended eye stalks and stress the snail. Snails with trapdoors or low-profile shells, like nerites and trapdoor snails, handle the introduction best.",
      },
      {
        question: "Why are shrimp not on this list?",
        answer:
          "Because the outcome depends on the individual betta. Many bettas hunt cherry shrimp like live food, while others ignore even shrimplets — and you cannot know which you have until shrimp are in the tank. Larger Amano shrimp survive more often, but they rate 'caution', not 'safe'. Snails remove the gamble.",
      },
      {
        question: "How many snails can live with a betta in a 5 gallon tank?",
        answer:
          "One or two small snails — a nerite or horned nerite is ideal — is the practical ceiling. Snails add real bioload, and a 5-gallon is already a small system; a single hard-grazing nerite keeps the glass clean without tipping the balance. Skip the larger mystery and rabbit snails until 10 gallons.",
      },
    ],
    predicate: (i) => i.bettaCompatible === "yes",
  },
  {
    slug: "plant-safe",
    group: "goal",
    title: "Plant-safe snails, shrimp, and inverts",
    metaTitle: "Plant-Safe Aquarium Inverts — Cleanup Crew That Won't Eat Plants | AquaticMotiv",
    metaDescription:
      "Invertebrates verified safe with live plants: species that graze algae and biofilm off leaves without eating healthy plant tissue.",
    directAnswer:
      "Almost every invertebrate sold for aquariums grazes biofilm, algae, and decaying matter — not healthy plant tissue — so a planted tank and a cleanup crew are natural partners, not a conflict. Every species on this list is verified plant-safe: their mouthparts rasp surfaces clean, which generally leaves plants looking better. What gets blamed on snails is usually scavenging — a leaf that was already dying gets eaten, and the snail takes the fall. The genuine plant-eaters in the hobby are wild pond snails and large apple snails, and they are exactly what this list screens out.",
    faqs: [
      {
        question: "Something is eating my plants — is it the snails or shrimp?",
        answer:
          "Check whether the damaged leaves were healthy. Inverts on this list eat tissue only after it starts dying, so holes in firm green leaves point elsewhere: nutrient deficiency, a plant-eating fish, or normal melt on a newly planted stem. Holes in yellowing leaves are the cleanup crew doing its job.",
      },
      {
        question: "Are plant fertilizers and root tabs safe with snails and shrimp?",
        answer:
          "Standard aquarium plant fertilizers dose copper at trace levels far below what harms invertebrates — they are designed for shrimp tanks. The real chemical risks are snail-killing medications and some fish treatments containing copper sulfate; read labels before treating a tank that houses inverts.",
      },
      {
        question: "Will big snails crush or uproot plants even if they don't eat them?",
        answer:
          "The heavyweights can bulldoze: a three-inch black devil snail plowing through sand will flatten a fragile carpet, and any large snail can knock over an unrooted stem. Let plants root before adding big snails, attach epiphytes to hardscape, and the problem disappears.",
      },
    ],
    predicate: (i) => i.plantSafe,
  },
  {
    slug: "no-heater",
    group: "goal",
    title: "Inverts for unheated tanks",
    metaTitle: "Cold Water Aquarium Inverts — No Heater Needed | AquaticMotiv",
    metaDescription:
      "Snails and shrimp verified to tolerate 64°F and below — for unheated tanks, cool rooms, and outdoor ponds. Real temperature floors.",
    directAnswer:
      "Most aquarium invertebrates are tropical, but a hardy minority tolerates 64°F and below — enough to live in an unheated tank in a normal room, and in some cases under pond ice. Japanese trapdoor snails are the standard-bearers, comfortable into the low 50s and routinely overwintering outdoors. Expect everything on this list to run slower in cold water: metabolism tracks temperature, so grazing, growth, and breeding all downshift together.",
    faqs: [
      {
        question: "Which snail is best for an unheated tank or pond?",
        answer:
          "The Japanese trapdoor snail, without much competition: hardy from the low 50s through the high 70s, long-lived, and a slow livebearer that never overpopulates. It is the snail sold for ponds precisely because it survives winters that kill tropical species.",
      },
      {
        question: "Can cherry shrimp live without a heater?",
        answer:
          "In a genuinely room-temperature tank, often yes — they tolerate down to about 65°F, and many keepers run them unheated. Below that they stop breeding and grazing slows. In a cold room or near a drafty window, a small heater set to 70°F is cheap insurance.",
      },
    ],
    predicate: (i) => i.temperatureF.min <= 64,
  },
  {
    slug: "beginner",
    group: "goal",
    title: "Aquarium inverts for beginners",
    metaTitle: "Best Aquarium Inverts for Beginners — Easy Snails & Shrimp | AquaticMotiv",
    metaDescription:
      "Every snail, shrimp, and crab here is rated easy on verified care data — forgiving species for a first invertebrate, with honest caveats.",
    directAnswer:
      "Every species on this list carries our 'easy' difficulty rating, which for invertebrates means three specific things: it tolerates ordinary tap-water parameters, it does not need target feeding to survive in a typical stocked tank, and it has no hidden requirement like brackish water or a land area. Inverts are less forgiving than fish in exactly one way — they are far more sensitive to copper medications and sudden water-chemistry swings — so the beginner skill is stability, not precision. Start with a nerite or a few cherry shrimp and let the tank teach you the rest.",
    faqs: [
      {
        question: "What is the best first invertebrate for a new aquarium?",
        answer:
          "A nerite snail, by a wide margin: hardy, useful from day one against algae, incapable of overpopulating, and safe with plants, bettas, and shrimp. If you want something more active, a small group of cherry shrimp in a planted tank is the classic next step.",
      },
      {
        question: "What kills beginner snails and shrimp most often?",
        answer:
          "Three things in order: copper-based fish medications dosed into the same tank, big abrupt water changes that swing chemistry mid-molt, and soft acidic water slowly dissolving snail shells. None of these is hard to avoid once named — check medicine labels, change water in modest amounts, and keep pH at 7 or above for snails.",
      },
      {
        question: "Do easy inverts still need to be acclimated slowly?",
        answer:
          "Yes — more slowly than fish. Shrimp especially should be drip-acclimated over an hour or more, because they respond to sudden parameter shifts by molting before the new shell is ready. Snails are tougher but still appreciate a gradual introduction.",
      },
    ],
    predicate: (i) => i.difficulty === "easy",
  },
  {
    slug: "pest-control",
    group: "goal",
    title: "Inverts that control pest snails and hydra",
    metaTitle: "Biological Pest Control — Assassin Snails & Hydra Eaters | AquaticMotiv",
    metaDescription:
      "Invertebrates that hunt aquarium pests for you: assassin snails for pest-snail outbreaks and spixi snails for hydra, with honest caveats.",
    directAnswer:
      "Two invertebrates earn their keep as biological pest control: assassin snails, which actively hunt and collapse outbreaks of bladder, ramshorn, and trumpet snails within a couple of months, and spixi snails, the one animal in the hobby documented to eat hydra — the stinging pest that plagues shrimp-breeding tanks. Both work without the collateral damage of chemical treatments, which routinely kill shrimp, filter bacteria, and the snails you wanted to keep. The price of biological control is an obligation: once the pests run out, the controllers need feeding.",
    faqs: [
      {
        question: "How many assassin snails do I need to clear an infestation?",
        answer:
          "A common working rate is one assassin per 5–10 gallons for a visible outbreak; a group of three to five clears a typical 20-gallon within two months. They hunt continuously but slowly — expect a steady decline in pest numbers, not an overnight purge — and feed less so the pest population stops replacing itself.",
      },
      {
        question: "What happens after the pest snails are gone?",
        answer:
          "Assassins are carnivores and will slowly starve in a clean tank, so transition them onto frozen bloodworms or protein-rich sinking foods dropped near the substrate at dusk. Spixis are easier — they fall back on algae, biofilm, and vegetables like any apple snail.",
      },
    ],
    predicate: (i) => i.roles.includes("pest-control"),
  },
];

/** All facet definitions, regardless of how many species match. */
export function getAllInvertFacets(): InvertFacet[] {
  return FACETS;
}

export function getInvertFacet(slug: string): InvertFacet | undefined {
  return FACETS.find((f) => f.slug === slug);
}

/** Species matching a facet's predicate. */
export function getInvertFacetSpecies(facet: InvertFacet): InvertSpecies[] {
  return getAllInverts().filter(facet.predicate);
}

/**
 * Facets that pass the thin-content gate (>= MIN_SPECIES_PER_FACET matching
 * species). Only active facets get pages, sitemap entries, and internal links.
 */
export function getActiveInvertFacets(): InvertFacet[] {
  return FACETS.filter(
    (f) => getInvertFacetSpecies(f).length >= MIN_SPECIES_PER_FACET
  );
}

/** Active facets a given species belongs to — for related-facet chips. */
export function getInvertFacetsForSpecies(species: InvertSpecies): InvertFacet[] {
  return getActiveInvertFacets().filter((f) => f.predicate(species));
}

/**
 * Build-time guard: facet slugs and species slugs share one URL namespace
 * (/a/careguides/inverts/[slug]); a collision would shadow a species page.
 * Throws so the build fails loudly.
 */
export function assertNoInvertFacetSpeciesSlugCollision(): void {
  const speciesSlugs = new Set(getInvertSlugs());
  const collisions = FACETS.filter((f) => speciesSlugs.has(f.slug)).map(
    (f) => f.slug
  );
  if (collisions.length > 0) {
    throw new Error(
      `Facet slug(s) collide with invert species slug(s): ${collisions.join(", ")}. ` +
        "Rename the facet slug(s) in src/lib/data/invert-facets.ts or the species slug(s) in src/data/inverts/species.json."
    );
  }
}
