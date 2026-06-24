// Facet definitions for the plant knowledge graph SEO pages.
// Each facet is a reserved slug under /a/careguides/plants/[slug] — see docs/PLANT_FINDER_SPEC.md §5.
// A facet only renders (is "active") when at least MIN_SPECIES_PER_FACET species
// match its predicate — the thin-content gate.

import type { PlantSpecies, PlantFaq } from "@/types/plants";
import { getAllPlants, getPlantSlugs } from "@/lib/data/plants";

export type FacetGroup = "light" | "placement" | "goal" | "style";

export interface PlantFacet {
  slug: string;
  group: FacetGroup;
  /** H1, phrased as the search query */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** 2–4 sentence original answer paragraph, quotable by AI assistants */
  directAnswer: string;
  faqs: PlantFaq[];
  predicate: (p: PlantSpecies) => boolean;
  /** Querystring preset for the finder CTA, e.g. "light=low" */
  finderParams?: string;
  /**
   * When true, the facet page renders and stays reachable (no 404) but is served
   * `robots: noindex,follow` — links pass equity, the page does not compete in
   * search. Use for facets whose data isn't a real discriminator yet, and (at
   * Phase 1) for any combinable multi-facet/sort URLs that would otherwise be
   * crawl-trap duplicates. See docs/CARE-GUIDES-SCALING-PLAN.md Phase 0.
   */
  noindex?: boolean;
}

export const MIN_SPECIES_PER_FACET = 6;

const FACETS: PlantFacet[] = [
  // ── By light ──────────────────────────────────────────────────────────
  {
    slug: "low-light",
    group: "light",
    title: "Aquarium plants that grow in low light",
    metaTitle: "Low Light Aquarium Plants — No Special Fixture Needed | AquaticMotiv",
    metaDescription:
      "Aquarium plants that thrive under a stock hood or basic LED, roughly 10–40 µmol PAR. Real species data: height, CO2 needs, and temperature ranges.",
    directAnswer:
      "Low-light aquarium plants grow under a stock hood or basic LED — roughly 10 to 40 µmol PAR at the substrate, with no special fixture required. The classic choices are rhizome plants like Java Fern and Anubias, mosses, and Cryptocorynes, all of which grow slowly enough that weak light is an advantage rather than a limitation. Because slow growth also means slow nutrient uptake, low-light tanks need less fertilizer and rarely need CO2 injection.",
    faqs: [
      {
        question: "Do low-light aquarium plants need CO2?",
        answer:
          "No. Plants that tolerate low light grow slowly, and slow growth keeps their carbon demand low enough that the CO2 naturally dissolved in aquarium water is sufficient. Injected CO2 will speed them up but is never required.",
      },
      {
        question: "Will low-light plants survive with no aquarium light at all?",
        answer:
          "Not reliably. Even the toughest species need some usable light on a consistent schedule — a basic LED running 6–8 hours a day is the practical floor. Ambient room light alone usually leads to slow decline over a few months.",
      },
      {
        question: "Why do low-light tanks get less algae?",
        answer:
          "Algae outbreaks are usually driven by light outpacing what the plants can use. With modest light, slow-growing plants consume the available nutrients steadily and there is little surplus energy left for algae to exploit.",
      },
    ],
    predicate: (p) => p.light === "low",
    finderParams: "light=low",
  },
  {
    slug: "medium-light",
    group: "light",
    title: "Aquarium plants for medium light",
    metaTitle: "Medium Light Aquarium Plants — The Widest Selection | AquaticMotiv",
    metaDescription:
      "Species that do their best work under a dedicated planted-tank LED at moderate settings. The largest group of aquarium plants, with full care data.",
    directAnswer:
      "Medium light — a dedicated planted-tank LED run at honest, moderate settings — opens up the widest selection of aquarium plants. Most stem plants, swords, and foreground species sit in this band: enough energy for steady growth and good color, without the algae pressure and mandatory CO2 that high light brings. If you own a purpose-built planted-tank fixture, this list is your menu.",
    faqs: [
      {
        question: "What counts as medium light in an aquarium?",
        answer:
          "Roughly 30–80 µmol PAR at the substrate. In practice, that is a purpose-built planted-tank LED at around half to three-quarters intensity on a standard-depth tank — noticeably brighter than a stock hood, but short of the high-output fixtures used for demanding carpets.",
      },
      {
        question: "Do medium-light plants need CO2 injection?",
        answer:
          "Many grow well without it, but this is the band where CO2 starts paying visible dividends: faster growth, denser foliage, and better color. Species listed here as 'beneficial' for CO2 will live without it; species listed as 'required' will not thrive long-term.",
      },
    ],
    predicate: (p) => p.light === "medium",
    finderParams: "light=medium",
  },
  {
    slug: "high-light",
    group: "light",
    title: "Aquarium plants for high light setups",
    metaTitle: "High Light Aquarium Plants — Demanding Showpieces | AquaticMotiv",
    metaDescription:
      "Species that need a high-output fixture to perform: intense reds, dense carpets, and fast growers. PAR ranges, CO2 requirements, and trimming demands.",
    directAnswer:
      "High-light aquarium plants need a strong fixture — typically 80 µmol PAR or more at the substrate — to hold their color and compact form. This group includes the intense reds and the most demanding carpet species, and almost all of them also require pressurized CO2 and consistent fertilization; high light without CO2 mostly grows algae. These are showpiece plants for aquarists ready to run a complete system.",
    faqs: [
      {
        question: "Can I grow high-light plants without CO2?",
        answer:
          "Rarely, and not well. High light drives fast photosynthesis, which demands more carbon than aquarium water naturally holds. Without injected CO2 the plants stall, lose color, and algae takes over the surplus light.",
      },
      {
        question: "Why are my high-light plants green instead of red?",
        answer:
          "Red coloration is a response to intense light, and it sharpens further when nitrate is kept modest. If a red species stays green, the usual fixes are raising light intensity, extending the photoperiod slightly, and verifying CO2 is actually reaching the plants.",
      },
    ],
    predicate: (p) => p.light === "high",
    finderParams: "light=high",
  },

  // ── By placement ──────────────────────────────────────────────────────
  {
    slug: "carpet",
    group: "placement",
    title: "Carpet plants for aquariums",
    metaTitle: "Aquarium Carpet Plants — Build a Living Lawn | AquaticMotiv",
    metaDescription:
      "Species that spread by runners into a dense foreground lawn. Compare light and CO2 demands from easy carpets to the showpiece species.",
    directAnswer:
      "Carpet plants spread horizontally by runners until they form a dense, lawn-like mat across the aquarium foreground. The catch is energy: a tight, low carpet is a product of strong light reaching the substrate, and the most famous carpeting species also want injected CO2. There are genuinely easier options — but every carpet, easy or hard, fills in faster when planted as many small patches rather than one clump.",
    faqs: [
      {
        question: "What is the easiest aquarium carpet plant?",
        answer:
          "Carpets that tolerate medium light and skip CO2 — such as dwarf sagittaria-type runners and Marsilea — are the forgiving end of the range. They grow taller and fill in slower than the showpiece species, but they will actually carpet in an ordinary tank.",
      },
      {
        question: "How long does a carpet take to fill in?",
        answer:
          "With good light and CO2, expect 6–10 weeks from planting small, well-spaced patches. Without CO2, double that — and choose a species rated for it, or the runners simply stop spreading.",
      },
      {
        question: "Why is my carpet plant growing upward instead of spreading?",
        answer:
          "Vertical growth is a light-hunting response: the plant is not getting enough intensity at substrate level, so it reaches instead of running. More light at the substrate — a stronger fixture or shallower tank — is the fix.",
      },
    ],
    predicate: (p) => p.type === "carpet",
    finderParams: "goals=carpet",
  },
  {
    slug: "foreground",
    group: "placement",
    title: "Foreground plants for aquariums",
    metaTitle: "Foreground Aquarium Plants — Short Species for the Front | AquaticMotiv",
    metaDescription:
      "Short plants that stay low at the front glass without blocking the view: carpets, small rosettes, and compact crypts, with height and care data.",
    directAnswer:
      "Foreground plants stay short enough to sit at the front glass without blocking the view into the tank — generally under five inches at maturity. The group spans true carpets, compact Cryptocorynes, and small rosette plants, so there is a foreground option for every light level. Choosing by mature height matters more here than anywhere else in the scape: a 'small' plant that doubles in size will bury your sight lines.",
    faqs: [
      {
        question: "What is the difference between a foreground plant and a carpet plant?",
        answer:
          "All carpets are foreground plants, but not the reverse. Carpets actively spread sideways into a connected mat, while many foreground plants — compact crypts, small rosettes — grow as tidy individual clumps that stay put where you plant them.",
      },
      {
        question: "How short does a plant need to be for the foreground?",
        answer:
          "As a rule of thumb, under five inches at maturity for a standard tank, and under three for a nano. Heights listed on our species pages are realistic submerged maximums, not nursery-pot sizes.",
      },
    ],
    predicate: (p) => p.placement.includes("foreground"),
  },
  {
    slug: "midground",
    group: "placement",
    title: "Midground plants for aquariums",
    metaTitle: "Midground Aquarium Plants — The Transition Layer | AquaticMotiv",
    metaDescription:
      "Medium-height species that bridge foreground and background: crypts, ferns, and compact stems that give an aquascape its depth.",
    directAnswer:
      "Midground plants occupy the middle depth of the scape — taller than a carpet, shorter than the back wall — and they are what gives an aquascape its sense of depth. This is the natural home of Cryptocorynes, Java Fern, Anubias on hardscape, and compact stem species. Because the midground sits at the visual center of the tank, these are usually the plants you actually look at, so texture contrast between neighbors matters more than raw color.",
    faqs: [
      {
        question: "What makes a good midground aquarium plant?",
        answer:
          "A mature height between roughly four and ten inches, a growth habit that holds its shape, and a leaf texture that contrasts with what is in front of and behind it. Plants that attach to hardscape are especially useful here because you can position them at exactly the height you want.",
      },
      {
        question: "Why do my Cryptocorynes melt after planting?",
        answer:
          "Crypt melt is a normal adjustment response: the emersed-grown leaves from the nursery dissolve and are replaced by submerged growth. Leave the roots undisturbed, keep up light and ferts, and new leaves typically appear within two to four weeks.",
      },
    ],
    predicate: (p) => p.placement.includes("midground"),
  },
  {
    slug: "background",
    group: "placement",
    title: "Background plants for aquariums",
    metaTitle: "Background Aquarium Plants — Fill the Back Wall | AquaticMotiv",
    metaDescription:
      "Tall, fast species that build a green wall along the back glass, hide equipment, and give fish cover. Heights, growth rates, trimming needs.",
    directAnswer:
      "Background plants are the tall, usually fast-growing species that build a wall of green along the back glass — hiding heaters and filters, giving skittish fish cover, and framing everything planted in front. Most are stem plants sold in bunches: plant the stems individually a finger-width apart and they thicken into a hedge within weeks. Fast growth is the point here, but it comes with a standing appointment: regular topping and replanting keeps the wall dense instead of leggy.",
    faqs: [
      {
        question: "How do I make background plants grow thick and bushy?",
        answer:
          "Top and replant. Cut each stem a few inches below the tip, replant the healthy top, and the rooted base sends out multiple side shoots. Two or three rounds of this turns a sparse bunch into a dense wall.",
      },
      {
        question: "What background plants grow fastest?",
        answer:
          "Classic bunch stems — hygrophilas, hornwort-type species, and the large rotalas — can put on an inch or more a week in good conditions. Fast species double as nutrient sponges in a new tank, soaking up the excess that would otherwise feed algae.",
      },
    ],
    predicate: (p) => p.placement.includes("background"),
    finderParams: "goals=background_wall",
  },
  {
    slug: "floating",
    group: "placement",
    title: "Floating plants for aquariums",
    metaTitle: "Floating Aquarium Plants — Shade, Cover & Nitrate Control | AquaticMotiv",
    metaDescription:
      "Surface plants that need no substrate or CO2: instant shade, fry cover, and serious nitrate uptake. Species data and management tips.",
    directAnswer:
      "Floating plants live at the water surface with their roots trailing into the column, which means no substrate, no CO2, and first claim on both light and airborne carbon dioxide. That privileged position makes them the fastest nutrient consumers in the hobby — excellent for soaking up nitrates and shading skittish fish — but it also means they multiply quickly and need regular thinning. They are the rare plant group where the maintenance task is removal, not encouragement.",
    faqs: [
      {
        question: "Are floating plants good for aquariums?",
        answer:
          "Genuinely useful, not just decorative: they strip nitrate faster than rooted plants, dim the tank for shy or surface-oriented fish like bettas and gouramis, and give fry somewhere to hide. The trade-off is shade — whatever floats above a light-hungry carpet is stealing its PAR.",
      },
      {
        question: "How do I keep floating plants from taking over the tank?",
        answer:
          "Net out a portion weekly — most species can double in a week or two under good light. A feeding ring or a length of airline tubing corralled into a circle also keeps them penned to one area of the surface.",
      },
      {
        question: "Do floating plants need fertilizer?",
        answer:
          "They feed entirely from the water column, so in a stocked tank fish waste usually covers them. If leaves yellow in a lightly stocked tank, a standard liquid fertilizer brings them back.",
      },
    ],
    predicate: (p) => p.type === "floating" || p.placement.includes("floating"),
    finderParams: "goals=floating_cover",
  },
  {
    slug: "attach-to-stone",
    group: "placement",
    title: "Aquarium plants you can attach to stone",
    metaTitle: "Aquarium Plants That Attach to Rocks & Stone | AquaticMotiv",
    metaDescription:
      "Epiphytes that grow glued or tied to rock — no substrate needed. Java Fern, Anubias, mosses, and more, with attachment technique.",
    directAnswer:
      "Epiphytic aquarium plants — Java Fern, Anubias, Bucephalandra, and the mosses — feed through their leaves and anchor with their roots, so they grow happily glued or tied directly to stone with no substrate at all. A dab of cyanoacrylate gel (superglue) on dry rock holds them instantly and is fish-safe once cured. The one rule: never bury the rhizome, because an epiphyte's rhizome rots in substrate — on stone, it cannot.",
    faqs: [
      {
        question: "How do I attach aquarium plants to rocks?",
        answer:
          "Pat the rock dry, apply a small dab of cyanoacrylate gel to the plant's rhizome or root mat, and press it onto the stone for ten seconds. The glue cures white but disappears under new growth. Cotton thread works too and dissolves on its own once the roots take hold.",
      },
      {
        question: "Is superglue safe for aquariums?",
        answer:
          "Yes — cyanoacrylate is inert once cured and is the same chemistry used in aquarium-specific glues and even surgical adhesives. Use the gel form, not the runny liquid, and let it set for a minute before submerging.",
      },
      {
        question: "Will plants attached to stone grow as fast as planted ones?",
        answer:
          "Epiphytes grow at the same (typically slow) pace whether on rock or wood — they were never substrate feeders. Feed them through the water column with a liquid fertilizer rather than root tabs.",
      },
    ],
    // Shares its predicate with `attach-to-wood` by design, not by oversight:
    // epiphytes attach to stone and driftwood identically (they feed through
    // their leaves and grip any inert surface), so the same species qualify for
    // both. The two pages are kept distinct because "plants for rocks" and
    // "plants for driftwood" are separate search queries — they carry different
    // titles, meta, directAnswer, and FAQs, and each canonicals to itself.
    predicate: (p) => p.attachesToHardscape,
    finderParams: "goals=attach_to_hardscape",
  },
  {
    slug: "attach-to-wood",
    group: "placement",
    title: "Aquarium plants you can attach to driftwood",
    metaTitle: "Aquarium Plants That Attach to Driftwood | AquaticMotiv",
    metaDescription:
      "Species that root onto driftwood and branches for an instant aged look: ferns, Anubias, Bucephalandra, and mosses, with placement tips.",
    directAnswer:
      "Driftwood is the easiest surface in the hobby to plant: its grain and crevices give epiphytes like Java Fern, Anubias, and mosses something to grip, and within weeks their roots wrap the wood on their own. Wood also offers what stone cannot — branches. Moss wrapped along a branch line or a fern tucked into a fork instantly reads as a mature, grown-in scape. As with stone, attach to the surface and keep the rhizome exposed; epiphytes feed from the water, not the wood.",
    faqs: [
      {
        question: "What is the best plant to attach to driftwood?",
        answer:
          "Mosses for branches and fine detail, Anubias and Bucephalandra for crevices and shaded forks, Java Fern for larger vertical surfaces. All of them tolerate low light, which suits the shaded zones driftwood naturally creates.",
      },
      {
        question: "Will plants attached to driftwood survive tannins and low pH?",
        answer:
          "Yes — the classic epiphytes evolved on wood and rock in soft, tannin-stained streams, so blackwater conditions are home turf. The slight pH drop from new driftwood is no threat to them.",
      },
    ],
    predicate: (p) => p.attachesToHardscape,
    finderParams: "goals=attach_to_hardscape",
  },

  // ── By goal ───────────────────────────────────────────────────────────
  {
    slug: "no-co2",
    group: "goal",
    title: "Aquarium plants that don't need CO2",
    metaTitle: "Aquarium Plants That Don't Need CO2 Injection | AquaticMotiv",
    metaDescription:
      "Species that grow well on the CO2 naturally present in aquarium water — no regulator, no diffuser. Full care data for every no-CO2 plant we track.",
    directAnswer:
      "A large share of aquarium plants grow well without injected CO2, living on the small amount of carbon dioxide that dissolves naturally from the air and from fish respiration. The pattern to look for is slow-to-moderate growth and low-to-medium light demand: ferns, Anubias, Cryptocorynes, mosses, and most floating plants all qualify. Growth is slower than in an injected tank — but so is the maintenance, and the algae pressure.",
    faqs: [
      {
        question: "Can I have a lush planted tank without CO2?",
        answer:
          "Yes — some of the most admired low-tech tanks in the hobby run nothing but moderate light, a nutritious substrate, and patience. The trick is choosing species rated for it rather than fighting demanding plants into slow decline.",
      },
      {
        question: "Is liquid carbon the same as CO2 injection?",
        answer:
          "No. Liquid carbon products supply a fraction of the carbon a pressurized system delivers and act partly as an algicide. They can nudge a low-tech tank along, but a plant listed as requiring CO2 still needs the real thing.",
      },
      {
        question: "Why do plants that 'don't need CO2' still grow better with it?",
        answer:
          "Carbon is the rate limit in almost every tank, so adding it speeds up nearly any plant. 'Doesn't need CO2' means the species stays healthy and grows steadily without it — not that it is indifferent to a richer supply.",
      },
    ],
    predicate: (p) => p.co2 === "none",
  },
  {
    slug: "under-3-inches",
    group: "goal",
    title: "Aquarium plants that stay under 3 inches",
    metaTitle: "Aquarium Plants Under 3 Inches Tall | AquaticMotiv",
    metaDescription:
      "Truly small species with a verified mature height of 3 inches or less — for foregrounds, nano tanks, and detail work between hardscape.",
    directAnswer:
      "These species top out at three inches or less when grown submerged — verified mature heights, not nursery-pot sizes. Staying genuinely small is rarer than plant labels suggest: many 'compact' plants double once established. The under-three-inch club is mostly carpets, mosses, and miniature rosettes, and they are the only safe choices for the front of a nano tank or the gaps between hardscape where anything taller would swallow the layout.",
    faqs: [
      {
        question: "Why did my 'small' aquarium plant outgrow its label?",
        answer:
          "Nursery labels describe the plant as sold, grown emersed in a pot — not its submerged adult size. Our heights are realistic submerged maximums, which is the number that actually determines whether a plant fits its spot.",
      },
      {
        question: "Do tiny aquarium plants need special care?",
        answer:
          "The main constraint is light reaching them: at substrate level in a deep tank, intensity drops fast, and a three-inch plant cannot grow toward the fixture the way a stem can. Shallow tanks and strong fixtures favor small species.",
      },
    ],
    predicate: (p) => p.maxHeightIn <= 3,
  },
  {
    slug: "nano-tank",
    group: "goal",
    title: "Aquarium plants for nano tanks",
    metaTitle: "Best Plants for Nano Aquariums (5–10 Gallons) | AquaticMotiv",
    metaDescription:
      "Species that stay in scale in a 5–10 gallon tank — 8 inches or under at maturity. Compact carpets, small epiphytes, and slow growers.",
    directAnswer:
      "In a nano tank — five to ten gallons — scale is everything: a plant that reads as 'compact' in a 40-gallon becomes a hedge in a cube. The species here stay at eight inches or under at maturity, so even the tallest of them works as a nano background. Slow growers and epiphytes earn extra credit in small tanks, because in five gallons a fast stem plant needs trimming weekly just to keep the water surface visible.",
    faqs: [
      {
        question: "What are the best plants for a 5 gallon tank?",
        answer:
          "Build around epiphytes on small hardscape — Anubias petite types, Bucephalandra, a moss — plus a compact crypt or two. They grow slowly, stay in scale, and leave swimming room, which is the scarcest resource in five gallons.",
      },
      {
        question: "Can I grow a carpet in a nano tank?",
        answer:
          "Yes, and nanos are actually good at it: shallow water means more light reaches the substrate. The usual carpet rules still apply — strong light, and CO2 for the demanding species — but the short light path works in your favor.",
      },
      {
        question: "How many plants fit in a nano tank?",
        answer:
          "Fewer, larger gestures beat variety: three to five species is plenty in ten gallons. Crowding many species into a small footprint reads as clutter and forces constant editing as they grow into each other.",
      },
    ],
    predicate: (p) => p.maxHeightIn <= 8,
    finderParams: "tank=5g",
  },
  {
    slug: "snail-safe",
    group: "goal",
    title: "Snail-safe aquarium plants",
    metaTitle: "Snail-Safe Aquarium Plants — Survive the Cleanup Crew | AquaticMotiv",
    metaDescription:
      "Plants that common aquarium snails and shrimp graze over without damaging — verified species data for tanks with a cleanup crew.",
    directAnswer:
      "Common aquarium snails — nerites, mystery snails, ramshorns — and dwarf shrimp graze on biofilm and algae, not healthy plant tissue, so the plants listed here coexist with a cleanup crew without damage. What looks like snail damage is usually scavenging: snails eat leaves that were already dying, and get blamed for the decline. Truly soft, thin-leaved species can be an exception around large or hungry snail populations, which is exactly what this list screens out.",
    faqs: [
      {
        question: "Do snails eat live aquarium plants?",
        answer:
          "The species sold for aquariums rarely eat healthy plants — they rasp biofilm, algae, and decaying matter off surfaces. If a snail appears to be eating a leaf, the leaf was almost always dying first. The notable exceptions are wild pond snails and large apple snails, which genuinely do eat plants.",
      },
      {
        question: "Are these plants shrimp-safe too?",
        answer:
          "Yes — dwarf shrimp are even gentler grazers than snails. Our snail-safe flag means the plant survives grazing by both common aquarium snails and shrimp. The bigger shrimp consideration is copper in fertilizers, and standard aquarium plant fertilizers dose copper at trace levels far below harm.",
      },
    ],
    predicate: (p) => p.snailSafe,
    finderParams: "goals=snail_safe",
    // noindex: `snailSafe` is true on all 102 species, so this facet matches
    // every plant and screens nothing — it is not a real discriminator. That
    // is also broadly *correct* (the snails sold in the hobby graze biofilm and
    // decaying matter, not healthy plants — see this facet's own directAnswer),
    // so there is no meaningful subset to surface. Kept reachable for the few
    // genuinely-soft exceptions, but noindex'd until species-level data marks
    // the real exceptions. Re-index once snailSafe carries discriminating data.
    noindex: true,
  },
  {
    slug: "red",
    group: "goal",
    title: "Red aquarium plants",
    metaTitle: "Red Aquarium Plants — Real Color Beyond Green | AquaticMotiv",
    metaDescription:
      "Species with genuine red and orange coloration, and what it actually takes to keep them red: light intensity, CO2, and nutrient balance.",
    directAnswer:
      "Red and orange aquarium plants get their color from pigments the plant produces in response to intense light — which means redness is earned, not guaranteed. Under weak light, most red species drift back toward green or melt away entirely. The dependable pattern: strong light produces the pigment, injected CO2 supports the fast growth that intense light drives, and keeping nitrate modest pushes the color deeper. A few easier species hold a red tint at medium light, and they are flagged in the list below.",
    faqs: [
      {
        question: "Why is my red aquarium plant turning green?",
        answer:
          "Insufficient light intensity is the cause in nearly every case. Red pigments are a high-light response; under weaker light the plant reverts to efficient green chlorophyll. Raising intensity — not duration — restores the color.",
      },
      {
        question: "Do red aquarium plants need iron supplements?",
        answer:
          "Iron helps but is overrated as a magic fix: it supports pigment production once light and CO2 are right, and does little when they are not. A comprehensive liquid fertilizer with chelated iron covers the need — get the light right first.",
      },
      {
        question: "Are there red plants that don't need high light?",
        answer:
          "A handful hold reddish or orange tones at medium light, and they are the honest starting point for a first red accent. Check the light rating on each species page below rather than buying on photo color, which is usually shot under showroom lighting.",
      },
    ],
    predicate: (p) => p.color === "red" || p.color === "orange",
    finderParams: "goals=red_accents",
  },
  {
    slug: "fast-growing",
    group: "goal",
    title: "Fast-growing aquarium plants",
    metaTitle: "Fast-Growing Aquarium Plants — Cycle Helpers & Algae Fighters | AquaticMotiv",
    metaDescription:
      "Species that grow an inch or more a week in good conditions — ideal for new tanks, nutrient export, and outcompeting algae.",
    directAnswer:
      "Fast-growing aquarium plants — mostly bunch stems and floaters — can add an inch or more a week in good conditions, and that speed is a tool: they soak up the ammonia and nitrate spikes of a new tank and starve algae of the surplus. The honest trade-off is labor. Anything that grows an inch a week needs topping and replanting on a schedule, or the lower portions shade out and go leggy. Plant fast species heavily at setup, then swap some out for slower growers once the tank matures.",
    faqs: [
      {
        question: "Do fast-growing plants help cycle a new aquarium?",
        answer:
          "They help meaningfully — fast growers consume ammonia directly, softening the spikes that stress early fish and feed algae blooms. A heavily planted new tank with fast species is the closest thing to a shortcut the nitrogen cycle allows.",
      },
      {
        question: "How often do fast-growing aquarium plants need trimming?",
        answer:
          "In a fertilized, well-lit tank, expect to top stems every one to two weeks. The trim itself is quick — cut, replant the tops, discard or share the rest — but it is a standing appointment, not an occasional chore.",
      },
    ],
    predicate: (p) => p.growthRate === "fast",
  },
  {
    slug: "slow-growing",
    group: "goal",
    title: "Slow-growing aquarium plants",
    metaTitle: "Slow-Growing Aquarium Plants — Plant Once, Trim Rarely | AquaticMotiv",
    metaDescription:
      "Species that hold their shape for months between trims: ferns, Anubias, Bucephalandra, and crypts. The backbone of low-maintenance scapes.",
    directAnswer:
      "Slow-growing aquarium plants — the ferns, Anubias, Bucephalandra, mosses, and Cryptocorynes — are the set-and-keep core of the hobby: plant them once and they hold their shape for months between trims. Slow growth also means low demand, so most of this group is content with low light and no CO2. The one cost is patience at setup; a scape built on slow growers looks sparse for its first few months, which is why aquascapers often pair them with fast stems early and remove the stems later.",
    faqs: [
      {
        question: "Why would I want a slow-growing aquarium plant?",
        answer:
          "Maintenance. A slow grower needs trimming a few times a year instead of weekly, never overruns its neighbors, and keeps a layout looking the way you designed it. For epiphytes on hardscape, slow growth is what keeps the composition intact.",
      },
      {
        question: "Do slow-growing plants get more algae on their leaves?",
        answer:
          "They can — a leaf that lives for months collects what a fast-replaced leaf never has time to. Modest light, decent flow across the leaves, and an algae-grazing cleanup crew keep long-lived foliage clean.",
      },
    ],
    predicate: (p) => p.growthRate === "slow",
    finderParams: "goals=low_maintenance",
  },
  {
    slug: "low-maintenance",
    group: "goal",
    title: "Low-maintenance aquarium plants",
    metaTitle: "Low-Maintenance Aquarium Plants — Minimal Trimming | AquaticMotiv",
    metaDescription:
      "Species that need only occasional attention: minimal trimming, no fast growth to chase. The honest list for aquarists short on time.",
    directAnswer:
      "Low-maintenance here means specific, verifiable traits: minimal trimming needs and a growth rate that never becomes a weekly chore. These are the plants you can leave alone for a month and return to a tank that looks the same — ferns and Anubias on hardscape, slow rosettes, and undemanding crypts. Most of the list also tolerates low light and skips CO2, which is no coincidence: the same slow metabolism drives all three traits.",
    faqs: [
      {
        question: "What is the absolute lowest-maintenance aquarium plant setup?",
        answer:
          "Epiphytes glued to hardscape: Anubias and Java Fern on stone or driftwood, with a moss if you like the texture. No substrate to manage, no replanting, trimming a few times a year, and a dose of liquid fertilizer weekly. It is the closest the hobby comes to plant-and-forget.",
      },
      {
        question: "Do low-maintenance plants still need fertilizer?",
        answer:
          "Lightly, yes. Slow growers draw few nutrients, and in a stocked tank fish waste covers much of it — but a weekly half-dose of a comprehensive liquid fertilizer prevents the slow yellowing that otherwise creeps in over months.",
      },
    ],
    predicate: (p) => p.trimming === "minimal" && p.growthRate !== "fast",
    finderParams: "goals=low_maintenance",
  },
  {
    slug: "beginner",
    group: "goal",
    title: "Aquarium plants for beginners",
    metaTitle: "Best Aquarium Plants for Beginners — Hard to Kill | AquaticMotiv",
    metaDescription:
      "Easy-rated species that forgive missed ferts, modest light, and learning-curve mistakes. Every plant here is rated easy on verified care data.",
    directAnswer:
      "Every plant on this list carries our 'easy' difficulty rating, which means it forgives the mistakes every first planted tank makes: inconsistent fertilizing, modest stock lighting, no CO2, and the occasional missed water change. Beginner-friendly is not a vibe — it is a pattern of low light demand, no CO2 requirement, and tolerance for a wide temperature and pH range. Start with three or four species from this list, let them establish, and upgrade ambitions after your first successful trim.",
    faqs: [
      {
        question: "What is the single best aquarium plant for a complete beginner?",
        answer:
          "Java Fern or Anubias, glued to a rock or driftwood. Neither needs substrate, special light, or CO2, neither gets eaten, and both signal their needs visibly. If you can keep water in the tank, you can keep these alive.",
      },
      {
        question: "Why do my new aquarium plants keep dying?",
        answer:
          "The usual culprits, in order: a species mismatched to your light and CO2 (check the rating before buying), rhizome plants buried in substrate, and judging too early — many plants melt back and regrow when they transition to submerged growth. Give a new plant four to six weeks before declaring it dead.",
      },
      {
        question: "Should beginners start with CO2?",
        answer:
          "No. A first planted tank built on easy species needs nothing but a light on a timer and occasional fertilizer. CO2 adds cost, equipment, and a new failure mode — it belongs in your second act, once the basics are boring.",
      },
    ],
    predicate: (p) => p.difficulty === "easy",
    finderParams: "exp=beginner",
  },
  {
    slug: "betta-tank",
    group: "goal",
    title: "Aquarium plants for betta tanks",
    metaTitle: "Best Plants for Betta Tanks — Resting Spots & Cover | AquaticMotiv",
    metaDescription:
      "Plants suited to betta life: broad leaves to rest on, floating cover to patrol under, and tolerance for the warm, calm water bettas need.",
    directAnswer:
      "Betta tanks favor a specific kind of plant: broad leaves near the surface for the betta to rest on, floating cover to patrol beneath, and tolerance for warm (76–82°F), gently filtered water with modest light. Epiphytes like Anubias and Java Fern are ideal — their stiff leaves double as hammocks — and floating plants give a betta the shaded, still surface its labyrinth-breathing instincts expect. Everything here either attaches to hardscape, floats, or thrives in the low-light conditions a typical betta setup provides.",
    faqs: [
      {
        question: "Do bettas like planted tanks?",
        answer:
          "Visibly so. A betta in a planted tank rests on leaves, patrols lanes between stems, and flares less at its own reflection thanks to softened light. Dense planting is the single best upgrade for betta behavior short of a bigger tank.",
      },
      {
        question: "Will a betta eat or damage aquarium plants?",
        answer:
          "No — bettas are carnivores and ignore plants entirely. Torn leaves in a betta tank are almost always physical damage from rough décor or a leaf dying naturally, not the fish.",
      },
      {
        question: "What plants float well in a betta tank?",
        answer:
          "Any of the smaller floating species work; the goal is partial cover, not a sealed surface. Bettas breathe at the surface, so keep at least a third of it open — a feeding ring or tubing corral keeps the floaters to their side of the line.",
      },
    ],
    predicate: (p) =>
      p.attachesToHardscape ||
      p.type === "floating" ||
      (p.light === "low" && p.relatedFish.includes("betta-splendens")),
    finderParams: "goals=betta_tank",
  },
  {
    slug: "cold-water",
    group: "goal",
    title: "Cold water aquarium plants",
    metaTitle: "Cold Water Aquarium Plants — No Heater Required | AquaticMotiv",
    metaDescription:
      "Species verified to tolerate 62°F and below — for unheated tanks, goldfish setups, and cool rooms. Real minimum temperatures, not guesses.",
    directAnswer:
      "Every species here is verified to tolerate water at 62°F or below, which covers unheated tanks in normal rooms, goldfish setups, and cool-water biotopes. Most tropical aquarium plants stall or melt below the mid-60s, so this list is genuinely selective — the survivors are mostly adaptable hardy species whose wild ranges extend into temperate streams and ponds. Expect slower growth in cold water across the board; metabolism tracks temperature for plants just as it does for fish.",
    faqs: [
      {
        question: "What aquarium plants survive with goldfish?",
        answer:
          "Cold tolerance is half the battle; the other half is the goldfish themselves, which uproot and nibble. Tough-leaved cold-tolerant species, plants attached to hardscape out of digging range, and fast floaters that outgrow the grazing are the proven combinations.",
      },
      {
        question: "How cold is too cold for aquarium plants?",
        answer:
          "Most tropical species decline below about 65°F. The plants on this list are verified to at least 62°F, and several go lower — check the temperature row on each species page for its actual floor rather than assuming all 'coldwater' plants are equal.",
      },
    ],
    predicate: (p) => p.temperatureF.min <= 62,
    finderParams: "unheated=1",
  },

  // ── By style ──────────────────────────────────────────────────────────
  {
    slug: "iwagumi",
    group: "style",
    title: "Plants for iwagumi aquascapes",
    metaTitle: "Iwagumi Aquascape Plants — Carpets & Restraint | AquaticMotiv",
    metaDescription:
      "The short list of species that suit iwagumi: low carpets and fine-textured accents that keep the stone arrangement as the subject.",
    directAnswer:
      "Iwagumi is the aquascaping style of restraint: a stone arrangement is the subject, and plants exist to support it — which means low carpets, fine textures, and usually a single species or two across the whole tank. The plant list for iwagumi is deliberately short, dominated by carpeting species and the occasional fine-leaved accent that does not compete with the rockwork. Because carpets carry the style, most iwagumi setups run strong light and CO2; the minimalism is visual, not technical.",
    faqs: [
      {
        question: "How many plant species should an iwagumi have?",
        answer:
          "One is classic, two is common, three is pushing it. The style reads as a single gesture — a field of one texture around deliberate stones — and each added species dilutes that. Variety is what the other styles are for.",
      },
      {
        question: "Is iwagumi a good style for beginners?",
        answer:
          "It is the hardest of the major styles, despite looking the simplest. A bare, carpet-dependent layout has nowhere to hide algae or patchy growth, and the carpet species generally demand strong light and CO2. Beginners get more forgiveness from nature- or jungle-style layouts.",
      },
    ],
    predicate: (p) => p.styles.includes("iwagumi"),
    finderParams: "goals=carpet",
  },
  {
    slug: "dutch-style",
    group: "style",
    title: "Plants for Dutch-style aquascapes",
    metaTitle: "Dutch Aquascape Plants — Stems, Color & Contrast | AquaticMotiv",
    metaDescription:
      "Species suited to the Dutch style: colorful stem plants arranged in dense, contrasting groups. The full stem palette with care data.",
    directAnswer:
      "The Dutch style is a planted garden with no hardscape at all: dense groups of stem plants arranged in terraced 'streets,' chosen so that every group contrasts with its neighbors in color, leaf size, or texture. That makes the Dutch plant list a stem-plant palette — reds beside greens, fine leaves beside broad ones — and it makes maintenance the price of admission, since stems need constant topping to hold their terraced shapes. It is the most horticultural of the aquascaping styles, and the most rewarding for aquarists who actually enjoy trimming.",
    faqs: [
      {
        question: "What defines a Dutch-style aquascape?",
        answer:
          "Dense plant groups with strong mutual contrast, arranged in streets that rise from front to back, and traditionally no stone or wood at all. Judging standards even specify proportions — no species occupying too much of the layout, every group distinct from its neighbors.",
      },
      {
        question: "How much work is a Dutch-style tank?",
        answer:
          "The most of any style: weekly topping and replanting of multiple stem groups, plus consistent CO2 and fertilization to keep growth dense and colorful. A Dutch tank that skips two weeks of trimming visibly loses its architecture.",
      },
    ],
    predicate: (p) => p.styles.includes("dutch"),
    finderParams: "goals=red_accents",
  },
  {
    slug: "jungle-style",
    group: "style",
    title: "Plants for jungle-style aquascapes",
    metaTitle: "Jungle Aquascape Plants — Dense, Wild & Forgiving | AquaticMotiv",
    metaDescription:
      "Species for the jungle look: big leaves, tall stems, mosses, and floaters growing into each other. The most forgiving aquascaping style.",
    directAnswer:
      "Jungle style is the aquascape that embraces overgrowth: large-leaved swords, tall stems, ferns spilling off driftwood, mosses blurring every edge, and floaters dappling the light. Plants are allowed to grow into each other, so the species list is the broadest of any style — and the maintenance is the lightest, since 'overgrown' is the goal rather than the failure state. It is the best style match for low-tech tanks and the one that fish, who evolved in overgrown water, visibly prefer.",
    faqs: [
      {
        question: "What is the difference between jungle style and nature style?",
        answer:
          "Nature style composes an idealized landscape with deliberate focal points and negative space; jungle style lets density win. A nature scape is maintained back to its design — a jungle is steered, not maintained, with intervention limited to keeping light paths open.",
      },
      {
        question: "Is jungle style good for fish?",
        answer:
          "The best of the major styles. Dense cover in every layer mirrors the overgrown habitats most aquarium species evolved in — shy fish surface more often, fry survive in numbers, and aggression diffuses when sight lines break up.",
      },
      {
        question: "Do jungle tanks need CO2?",
        answer:
          "Usually not. The style leans on undemanding, naturally vigorous species and tolerates the looser growth that low-tech conditions produce. CO2 accelerates a jungle but changes nothing about whether it works.",
      },
    ],
    predicate: (p) => p.styles.includes("jungle"),
  },
];

/** All facet definitions, regardless of how many species match. */
export function getAllFacets(): PlantFacet[] {
  return FACETS;
}

export function getFacet(slug: string): PlantFacet | undefined {
  return FACETS.find((f) => f.slug === slug);
}

/** Species matching a facet's predicate. */
export function getFacetSpecies(facet: PlantFacet): PlantSpecies[] {
  return getAllPlants().filter(facet.predicate);
}

/**
 * Facets that pass the thin-content gate (>= MIN_SPECIES_PER_FACET matching
 * species). Only active facets get pages, sitemap entries, and internal links.
 */
export function getActiveFacets(): PlantFacet[] {
  return FACETS.filter(
    (f) => getFacetSpecies(f).length >= MIN_SPECIES_PER_FACET
  );
}

/** Active facets a given species belongs to — for related-facet chips. */
export function getFacetsForSpecies(species: PlantSpecies): PlantFacet[] {
  return getActiveFacets().filter((f) => f.predicate(species));
}

/**
 * Build-time guard: facet slugs and species slugs share one URL namespace
 * (/a/careguides/plants/[slug]); a collision would shadow a species page. Throws so
 * the build fails loudly.
 */
export function assertNoFacetSpeciesSlugCollision(): void {
  const speciesSlugs = new Set(getPlantSlugs());
  const collisions = FACETS.filter((f) => speciesSlugs.has(f.slug)).map(
    (f) => f.slug
  );
  if (collisions.length > 0) {
    throw new Error(
      `Facet slug(s) collide with plant species slug(s): ${collisions.join(", ")}. ` +
        "Rename the facet slug(s) in src/lib/data/plant-facets.ts or the species slug(s) in src/data/plants/species.json."
    );
  }
}
