#!/usr/bin/env python3
"""Generate src/data/guides/hub.json for the / hub.

Source of truth: AquaticMotiv Shopify blog articles (pulled via Admin GraphQL
2026-06-21 — all 65 articles in the `news` blog, each with its CDN image).
Every card therefore has a real image, a care-guide link, and a shop link to a
VERIFIED collection (handles checked against the live store). Plants lead, per
the SEO strategy (the page targets plant care-guide queries); snail/invert
guides follow and feed authority via internal links.

Re-run after adding/retitling guides:  python3 scripts/gen_careguides_hub.py
"""
import json, os, re

CDN = "https://cdn.shopify.com/s/files/1/0271/2505/5523/articles/"
BLOG = "https://aquaticmotiv.com/blogs/news/"
PAGE = "https://aquaticmotiv.com/pages/"
STORE = "https://aquaticmotiv.com"

# Category 1 merges the per-species plant content from BOTH stores into one section:
# the human-written Shopify care PAGES (aquaticmotiv.com/pages/*) plus the blog plant
# PROFILES. Pages are derived at gen time from src/data/plants/care-page-links.json
# (species -> page handle) joined to species.json (name + product handle); their card
# image comes from src/data/guides/page-card-images.json (pages have no og image).
# When a species has BOTH a page and a profile, the converting PAGE wins (one card/species).
PLANT_CARE_CATEGORY = (
    "freshwater-plant-care", "Freshwater Aquatic Plant Care Guides",
    "Species-by-species care for every freshwater plant we grow and ship — light, CO2, "
    "placement, parameters, and propagation, each linked to the live plant to buy.",
)

# Blog plant-profile handle -> species slug. Used to de-dupe against the care PAGES and
# to fold the remaining profiles (species with no page) into category 1.
PROFILE_SPECIES = {
    "plant-profile-monte-carlo": "monte-carlo",
    "plant-profile-dwarf-hairgrass": "dwarf-hairgrass",
    "plant-profile-dwarf-baby-tear": "dwarf-baby-tears",
    "plant-profile-java-moss": "java-moss",
    "plant-profile-bacopa": "bacopa-caroliniana",
    "plant-profile-water-wisteria": "water-wisteria",
    "plant-profile-water-sprite": "water-sprite",
    "plant-profile-alternanthera-reineckii": "alternanthera-reineckii",
    "plant-profile-limnophila-hippuridoides": "limnophila-hippuridoides",
    "plant-profile-mermaid-weed": "mermaid-weed",
    "plant-profile-ammannia-gracilis": "ammannia-gracilis",
    "plant-profile-ludwigia-ovalis": "ludwigia-ovalis",
    "plant-profile-ludwigia-super-red-mini": "ludwigia-super-red-mini",
    "bucephalandra-master-care-guide-unlocking-the-secrets-of-borneo-s-royal-plant": "bucephalandra",
}

# (handle, title, image-file) — image-file is the part after /articles/
ARTICLES = [
    # --- Plant profiles (species deep-dives) ---
    ("plant-profile-monte-carlo", "Monte Carlo (Micranthemum tweediei)", "plant-profile-monte-carlo.webp?v=1764725742"),
    ("plant-profile-dwarf-hairgrass", "Dwarf Hairgrass (Eleocharis parvula)", "plant-profile-dwarf-hairgrass.webp?v=1764725713"),
    ("plant-profile-dwarf-baby-tear", "Dwarf Baby Tears (HC Cuba)", "plant-profile-dwarf-baby-tear.webp?v=1764725683"),
    ("plant-profile-java-moss", "Java Moss (Taxiphyllum barbieri)", "plant-profile-java-moss.webp?v=1764725809"),
    ("plant-profile-bacopa", "Bacopa Caroliniana", "plant-profile-bacopa.webp?v=1764725840"),
    ("plant-profile-water-wisteria", "Water Wisteria (Hygrophila difformis)", "plant-profile-water-wisteria.webp?v=1764725867"),
    ("plant-profile-water-sprite", "Water Sprite (Ceratopteris thalictroides)", "plant-profile-water-sprite.webp?v=1764725892"),
    ("plant-profile-alternanthera-reineckii", "Alternanthera Reineckii", "plant-profile-alternanthera-reineckii.webp?v=1764725916"),
    ("plant-profile-limnophila-hippuridoides", "Limnophila Hippuridoides", "plant-profile-limnophila-hippuridoides.webp?v=1764725949"),
    ("plant-profile-mermaid-weed", "Mermaid Weed (Proserpinaca palustris)", "plant-profile-mermaid-weed.webp?v=1764725975"),
    ("plant-profile-ammannia-gracilis", "Ammannia Gracilis", "plant-profile-ammannia-gracilis.webp?v=1764726001"),
    ("plant-profile-ludwigia-ovalis", "Ludwigia Ovalis", "plant-profile-ludwigia-ovalis.webp?v=1764725774"),
    ("plant-profile-ludwigia-super-red-mini", "Ludwigia Super Red Mini", "plant-profile-ludwigia-super-red-mini.webp?v=1764726025"),
    ("bucephalandra-master-care-guide-unlocking-the-secrets-of-borneo-s-royal-plant", "Bucephalandra Master Care Guide", "bucephalandra-master-care-guide-unlocking-the-secrets-of-borneos.webp?v=1781054541"),
    # --- Beginner plant guides ---
    ("top-10-easy-aquarium-plants-for-beginners", "Top 10 Easy Aquarium Plants for Beginners", "top-10-easy-aquarium-plants-for-beginners.webp?v=1764725590"),
    ("top-5-best-foreground-plants-for-beginners", "Top 5 Best Foreground Plants for Beginners", "top-5-best-foreground-plants-for-beginners.webp?v=1764725662"),
    ("dwarf-baby-tears-hc-cuba-vs-monte-carlo-the-ultimate-aquarium-carpet-guide", "HC Cuba vs. Monte Carlo: Carpet Guide", "dwarf-baby-tears-hc-cuba-vs-monte-carlo-the-ultimate-aquarium.webp?v=1781054434"),
    ("tissue-culture-vs-potted-bunched-aquatic-plants-the-ultimate-aquasaper-s-guide", "Tissue Culture vs. Potted & Bunched Plants", "tissue-culture-vs-potted-bunched-aquatic-plants-the-ultimate.webp?v=1781903853"),
    ("top-5-best-floating-aquarium-plants-to-lower-nitrates-fast", "Top 5 Floating Plants to Lower Nitrates", "top-5-best-floating-aquarium-plants-to-lower-nitrates-fast.webp?v=1782264538"),
    # --- Plant health & troubleshooting ---
    ("why-do-my-aquarium-plant-leaves-have-holes-in-them-diagnosis-fixes", "Why Do My Plant Leaves Have Holes?", "why-do-my-aquarium-plant-leaves-have-holes-in-them-diagnosis.webp?v=1782263955"),
    ("why-are-my-aquarium-plants-losing-leaves", "Why Are My Aquarium Plants Losing Leaves?", "why-are-my-aquarium-plants-losing-leaves.webp?v=1782263898"),
    ("why-is-my-aquarium-plant-growing-roots-from-the-stem-aerial-roots-guide", "Aerial Roots: Why Plants Grow Roots from Stems", "why-is-my-aquarium-plant-growing-roots-from-the-stem-aerial-guide.webp?v=1781054447"),
    ("top-5-aquarium-plant-deficiencies-in-a-freshwater-aquarium", "Top 5 Aquarium Plant Deficiencies", "top-5-aquarium-plant-deficiencies-in-a-freshwater.webp?v=1781054460"),
    ("root-feeders-vs-column-feeders-aquarium-plants-how-do-aquarium-plants-actually-eat", "Root Feeders vs. Column Feeders", "root-feeders-vs-column-aquarium-plants-how-do-plants-actually-eat.webp?v=1782263884"),
    ("crypt-melt-explained-the-complete-guide-for-aquarium-hobbyists", "Crypt Melt Explained", "crypt-melt-explained-the-complete-guide-for-aquarium-hobbyists.webp?v=1781876217"),
    ("the-ultimate-guide-to-increasing-red-coloration-in-aquarium-plants", "How to Get Redder Aquarium Plants", "the-ultimate-guide-to-increasing-red-coloration-in-aquarium-plants.webp?v=1781054352"),
    ("the-ultimate-guide-to-stem-plant-propagation-how-to-trim-replant-and-double-your-plant-biomass", "Stem Plant Propagation Guide", "the-ultimate-guide-to-stem-plant-propagation-how-trim-replant.webp?v=1782263940"),
    ("how-to-use-aquarium-glue-to-secure-epiphytes-to-hardscape", "How to Glue Epiphytes to Hardscape", "how-to-use-aquarium-glue-secure-epiphytes-hardscape.webp?v=1782263872"),
    ("aquarium-green-water-causes-and-how-to-get-rid-of-it", "Green Water: Causes & How to Fix It", "aquarium-green-water-causes-and-how-to-get-rid.webp?v=1764726475"),
    ("how-to-get-rid-of-black-beard-algae", "How to Get Rid of Black Beard Algae", "how-to-get-rid-of-black-beard-algae.webp?v=1764726442"),
    # --- CO2, fertilization & lighting ---
    ("the-ultimate-guide-to-co2-in-planted-aquariums-unlock-lush-algae-free-growth", "The Ultimate Guide to CO2", "the-ultimate-guide-to-co2-in-planted-aquariums-unlock-lush-algae.webp?v=1781054388"),
    ("the-truth-about-liquid-carbon-what-is-it-and-how-does-it-work", "The Truth About Liquid Carbon", "the-truth-about-liquid-carbon-what-is-it-and-how-does-work.webp?v=1764726344"),
    ("carbon-dioxide-supplementation-what-plants-need-it-and-what-plants-don-t", "Which Plants Actually Need CO2", "carbon-dioxide-supplementation-what-plants-need-it-and-dont_cbea3ed7-5d2c-4ba1-8725-abb9e4afe68a.webp?v=1782740256"),
    ("top-5-red-plants-you-can-grow-without-co2-supplementation", "Top 5 Red Plants Without CO2", "top-5-red-plants-you-can-grow-without-co2-supplementation.webp?v=1764726116"),
    ("how-many-hours-of-light-do-aquarium-plants-need", "How Many Hours of Light Do Plants Need?", "how-many-hours-of-light-do-aquarium-plants-need.webp?v=1782263928"),
    ("par-a-look-at-photosynthetically-active-radiation", "PAR Explained", "par-a-look-at-photosynthetically-active-radiation.webp?v=1764726240"),
    ("light-spectrum-a-look-at-what-wavelengths-are-most-utilized", "Light Spectrum & Wavelengths", "light-spectrum-a-look-at-what-wavelengths-are-most-utilized.webp?v=1764726403"),
    ("spectrum-balance-vs-light-brightness-growth", "Spectrum Balance vs. Brightness", "how-does-spectrum-balance-affect-plant-growth-more-than-brightness.webp?v=1764727388"),
    ("cri-influence-aquascape-realism-lighting", "How CRI Affects Aquascape Realism", "how-does-cri-color-rendering-index-influence-aquascape-realism.webp?v=1764727340"),
    ("choose-right-week-aqua-light", "Choosing the Right Week Aqua Light", "how-to-choose-the-right-week-aqua-light-series-l-m-p-v-a-or-z.webp?v=1764727446"),
    ("week-aqua-l-series-pro-k-setup-guide", "Week Aqua L Series PRO-K Setup", "how-to-set-up-the-week-aqua-l-series-pro-k-for-maximum-plant-growth.webp?v=1764727476"),
    ("what-differentiates-week-aqua-l", "What Makes the Week Aqua L Series Unique", "what-makes-the-week-aqua-l-series-unique-among-aquarium-lights.webp?v=1764727547"),
    ("why-aquascapers-prefer-week-aqua", "Why Aquascapers Prefer Week Aqua", "why-do-aquascapers-prefer-week-aqua-over-other-led-brands.webp?v=1764727575"),
    ("week-aqua-light-long-term-investment", "Is a Week Aqua Light Worth It?", "is-a-week-aqua-light-long-term-investment-for-serious-aquascaping.jpg?v=1764727504"),
    # These 2 have no featured image on Shopify (og:image = logo); reuse representative Week Aqua art until unique images are set.
    ("week-aqua-light-buying-guide", "Complete Week Aqua Buying Guide", "how-to-choose-the-right-week-aqua-light-series-l-m-p-v-a-or-z.webp?v=1764727446"),
    ("week-aqua-bluetooth-module-automation-guide", "Week Aqua Bluetooth Module 3.0 Setup", "how-to-set-up-the-week-aqua-l-series-pro-k-for-maximum-plant-growth.webp?v=1764727476"),
    # --- Aquascaping & setup ---
    ("choosing-the-best-planted-aquarium-substrate-aquasoil-vs-sand-vs-gravel", "Best Substrate: Aquasoil vs. Sand vs. Gravel", "choosing-the-best-planted-aquarium-substrate-aquasoil-vs-sand.webp?v=1781054471"),
    ("low-tech-vs-high-tech-aquascaping-which-is-right-for-you", "Low-Tech vs. High-Tech Aquascaping", "low-tech-vs-high-aquascaping-which-is-right.webp?v=1781877699"),
    ("a-beginners-guide-to-the-aquarium-nitrogen-cycle", "Beginner's Guide to the Nitrogen Cycle", "a-beginners-guide-to-the-aquarium-nitrogen-cycle.webp?v=1764726185"),
    ("how-often-should-you-actually-change-your-aquarium-water-the-definitive-guide", "How Often to Change Aquarium Water", "how-often-should-you-actually-change-your-aquarium-water.webp?v=1782052833"),
    ("how-deep-should-your-aquarium-substrate-be-the-ultimate-guide", "How Deep Should Your Substrate Be?", "how-deep-should-your-aquarium-substrate-be-the-ultimate-guide.webp?v=1782264480"),
    # --- Snail & invertebrate care guides ---
    ("ultimate-aquarium-snail-care-guide", "Ultimate Aquarium Snail Care Guide", "ultimate-aquarium-snail-care-guide-how-to-choose-introduce.webp?v=1764727052"),
    ("the-mystery-snail-care-guide-keeping-pomacea-bridgesii-thriving", "Mystery Snail Care Guide", "the-mystery-snail-care-guide-keeping-pomacea-bridgesii-thriving.webp?v=1782264126"),
    ("nerite-snail-care-guide-the-best-algae-eaters-for-your-tank", "Nerite Snail Care Guide", "nerite-snail-care-guide-the-best-algae-eaters-for-your-tank.webp?v=1782264210"),
    ("rabbit-snail-care-guide-the-fascinating-tylomelania-genus", "Rabbit Snail Care Guide", "rabbit-snail-care-guide-the-fascinating-tylomelania-genus.webp?v=1782264281"),
    ("assassin-snail-care-guide-care-diet-behavior-parameters-habitat-health", "Assassin Snail Care Guide", "assassin-snail-care-guide-diet-behavior-parameters-habitat-health.webp?v=1764726673"),
    ("trapdoor-snails-in-outdoor-ponds", "Trapdoor Snails for Outdoor Ponds", "trapdoor-snails-for-outdoor-ponds-benefits-care-and-types-aquatic.webp?v=1764726801"),
    ("nerite-snails-vs-mystery-snails-best-choice-for-your-aquarium-aquatic-motiv", "Nerite Snails vs. Mystery Snails", "nerite-snails-vs-mystery-snails-best-choice-for-your-aquarium.webp?v=1764726743"),
    ("nerite-snails-algae-cleaners", "Why Nerite Snails Are the Best Algae Cleaners", "why-nerite-snails-are-the-best-algae-cleaners.webp?v=1764727287"),
    ("snails-are-essential-for-a-self-sustaining-aquarium", "Why Snails Are Essential for Your Tank", "why-snails-are-essential-for-a-self-sustaining-aquarium-ecosystem.webp?v=1764727315"),
    ("rabbit-snails-tylomelania-aquascaping", "Why Aquascapers Love Rabbit Snails", "why-are-rabbit-snails-tylomelania-sp-favorite-among-aquascapers.webp?v=1764727228"),
    ("best-snail-pack-balanced-aquarium", "Which Snail Pack Is Best?", "which-snail-pack-is-best-for-a-balanced-aquarium.webp?v=1764727164"),
    ("mystery-snails-are-perfect-for-beginner-tanks", "Are Mystery Snails Good for Beginners?", "what-makes-mystery-snails-pomacea-bridgesii-ideal-for-beginner.webp?v=1764727096"),
    ("mystery-snails-diet", "Do Mystery Snails Eat Algae or Plants?", "do-mystery-snails-eat-algae-or-live-plants.webp?v=1764726969"),
    ("rabbit-snails-with-mystery-nerite", "Can Rabbit Snails Live with Other Snails?", "can-rabbit-snails-live-with-mystery-or-nerite-snails.webp?v=1764726910"),
    ("can-nerite-snails-reproduce-in-freshwater", "Can Nerite Snails Reproduce in Freshwater?", "can-nerite-snails-reproduce-in-freshwater-myth-vs-fact.webp?v=1764726844"),
    # --- Shrimp & betta care guides ---
    ("the-neocaridina-shrimp-care-guide-keeping-dwarf-shrimp", "Neocaridina Shrimp Care Guide", "the-neocaridina-shrimp-care-guide-keeping-dwarf.webp?v=1782264424"),
    ("the-ultimate-betta-fish-care-guide-how-to-keep-your-siamese-fighting-fish-happy-and-healthy", "Ultimate Betta Fish Care Guide", "the-ultimate-betta-fish-care-guide-how-to-keep-your-siamese-fighting.webp?v=1782264338"),
    ("the-best-aquarium-plants-for-bettas-detailed-guide", "Best Aquarium Plants for Bettas", "the-best-aquarium-plants-for-bettas-detailed-guide.webp?v=1782264028"),
]

# Per-handle shop collection override (snail species → their collection).
SHOP = {
    "the-mystery-snail-care-guide-keeping-pomacea-bridgesii-thriving": "mystery-snails",
    "mystery-snails-are-perfect-for-beginner-tanks": "mystery-snails",
    "mystery-snails-diet": "mystery-snails",
    "nerite-snail-care-guide-the-best-algae-eaters-for-your-tank": "nerite-snails",
    "nerite-snails-algae-cleaners": "nerite-snails",
    "can-nerite-snails-reproduce-in-freshwater": "nerite-snails",
    "nerite-snails-vs-mystery-snails-best-choice-for-your-aquarium-aquatic-motiv": "nerite-snails",
    "rabbit-snail-care-guide-the-fascinating-tylomelania-genus": "rabbit-snails",
    "rabbit-snails-tylomelania-aquascaping": "rabbit-snails",
    "rabbit-snails-with-mystery-nerite": "rabbit-snails",
    "assassin-snail-care-guide-care-diet-behavior-parameters-habitat-health": "assassin-snails",
    "trapdoor-snails-in-outdoor-ponds": "trapdoor-snails",
    "ultimate-aquarium-snail-care-guide": "snails",
    "snails-are-essential-for-a-self-sustaining-aquarium": "snails",
    "best-snail-pack-balanced-aquarium": "snails",
    "the-neocaridina-shrimp-care-guide-keeping-dwarf-shrimp": "shrimp",
    "the-ultimate-betta-fish-care-guide-how-to-keep-your-siamese-fighting-fish-happy-and-healthy": "bettas",
    "the-best-aquarium-plants-for-bettas-detailed-guide": "bettas",
    "bucephalandra-master-care-guide-unlocking-the-secrets-of-borneo-s-royal-plant": "bucephalandra",
    "top-5-best-foreground-plants-for-beginners": "foreground-plants",
    "top-10-easy-aquarium-plants-for-beginners": "beginner-plants",
}

# Ordered article categories (category 1, Freshwater Aquatic Plant Care Guides, is built
# separately by build_plant_care_section and prepended). Each = (id, title, blurb,
# default shop collection, [handles]).
CATEGORIES = [
    ("beginner-plants", "Beginner Plant Guides",
     "New to planted tanks? Start here — the easiest species, carpets, and tankmates to grow first.",
     "beginner-plants", [
        "top-10-easy-aquarium-plants-for-beginners","top-5-best-foreground-plants-for-beginners",
        "dwarf-baby-tears-hc-cuba-vs-monte-carlo-the-ultimate-aquarium-carpet-guide",
        "tissue-culture-vs-potted-bunched-aquatic-plants-the-ultimate-aquasaper-s-guide",
        "top-5-best-floating-aquarium-plants-to-lower-nitrates-fast",
        "the-best-aquarium-plants-for-bettas-detailed-guide"]),
    ("plant-health", "Plant Health & Troubleshooting",
     "Diagnose and fix the common problems — melting, holes, deficiencies, and algae.",
     "all-plants", [
        "why-do-my-aquarium-plant-leaves-have-holes-in-them-diagnosis-fixes",
        "why-are-my-aquarium-plants-losing-leaves",
        "why-is-my-aquarium-plant-growing-roots-from-the-stem-aerial-roots-guide",
        "top-5-aquarium-plant-deficiencies-in-a-freshwater-aquarium",
        "root-feeders-vs-column-feeders-aquarium-plants-how-do-aquarium-plants-actually-eat",
        "crypt-melt-explained-the-complete-guide-for-aquarium-hobbyists",
        "the-ultimate-guide-to-increasing-red-coloration-in-aquarium-plants",
        "the-ultimate-guide-to-stem-plant-propagation-how-to-trim-replant-and-double-your-plant-biomass",
        "how-to-use-aquarium-glue-to-secure-epiphytes-to-hardscape",
        "aquarium-green-water-causes-and-how-to-get-rid-of-it",
        "how-to-get-rid-of-black-beard-algae"]),
    ("planted-tank-setup", "Planted Tank Setup",
     "Build and dial in the tank — substrate, cycling, CO2, fertilization, lighting, and maintenance.",
     "co2", [
        "choosing-the-best-planted-aquarium-substrate-aquasoil-vs-sand-vs-gravel",
        "how-deep-should-your-aquarium-substrate-be-the-ultimate-guide",
        "low-tech-vs-high-tech-aquascaping-which-is-right-for-you",
        "a-beginners-guide-to-the-aquarium-nitrogen-cycle",
        "how-often-should-you-actually-change-your-aquarium-water-the-definitive-guide",
        "the-ultimate-guide-to-co2-in-planted-aquariums-unlock-lush-algae-free-growth",
        "the-truth-about-liquid-carbon-what-is-it-and-how-does-it-work",
        "carbon-dioxide-supplementation-what-plants-need-it-and-what-plants-don-t",
        "top-5-red-plants-you-can-grow-without-co2-supplementation",
        "how-many-hours-of-light-do-aquarium-plants-need",
        "par-a-look-at-photosynthetically-active-radiation",
        "light-spectrum-a-look-at-what-wavelengths-are-most-utilized",
        "spectrum-balance-vs-light-brightness-growth",
        "cri-influence-aquascape-realism-lighting",
        "choose-right-week-aqua-light","week-aqua-l-series-pro-k-setup-guide",
        "what-differentiates-week-aqua-l","why-aquascapers-prefer-week-aqua","week-aqua-light-long-term-investment",
        "week-aqua-light-buying-guide","week-aqua-bluetooth-module-automation-guide"]),
    ("snails-shrimp-inverts", "Snail, Shrimp & Invertebrate Care Guides",
     "The livestock we grow and ship from New Jersey — and where Aquatic Motiv ranks best. Organic guides are how buyers find these species.",
     "snails", [
        "ultimate-aquarium-snail-care-guide","the-mystery-snail-care-guide-keeping-pomacea-bridgesii-thriving",
        "nerite-snail-care-guide-the-best-algae-eaters-for-your-tank",
        "rabbit-snail-care-guide-the-fascinating-tylomelania-genus",
        "assassin-snail-care-guide-care-diet-behavior-parameters-habitat-health",
        "trapdoor-snails-in-outdoor-ponds","nerite-snails-vs-mystery-snails-best-choice-for-your-aquarium-aquatic-motiv",
        "nerite-snails-algae-cleaners","snails-are-essential-for-a-self-sustaining-aquarium",
        "rabbit-snails-tylomelania-aquascaping","best-snail-pack-balanced-aquarium",
        "mystery-snails-are-perfect-for-beginner-tanks","mystery-snails-diet",
        "rabbit-snails-with-mystery-nerite","can-nerite-snails-reproduce-in-freshwater",
        "the-neocaridina-shrimp-care-guide-keeping-dwarf-shrimp"]),
    ("other", "Other",
     "Everything else in the freshwater hobby we keep and ship.",
     "all-plants", [
        "the-ultimate-betta-fish-care-guide-how-to-keep-your-siamese-fighting-fish-happy-and-healthy"]),
]

BY_HANDLE = {h: (h, t, img) for h, t, img in ARTICLES}


def alt_for(title):
    base = re.sub(r"[:?].*$", "", title).strip()
    return f"{base} — Aquatic Motiv care guide"


def load_json(here, *parts):
    with open(os.path.join(here, *parts)) as f:
        return json.load(f)


def build_plant_care_section(here):
    """Build category 1 ('Freshwater Aquatic Plant Care Guides').

    Merges the per-species content from both stores into one de-duped section:
      - Every Shopify care PAGE (care-page-links.json), card image from the linked
        product (page-card-images.json), shop link to the live product.
      - Each blog plant PROFILE whose species has NO page (the page wins when both exist).
    Returns (category, consumed_profile_handles) so main() can mark ALL profile handles
    handled — both the ones folded in and the ones dropped as duplicates.
    """
    cid, title, blurb = PLANT_CARE_CATEGORY
    links = {k: v for k, v in load_json(here, "src", "data", "plants", "care-page-links.json").items()
             if not k.startswith("_")}
    species = {s["slug"]: s for s in load_json(here, "src", "data", "plants", "species.json")}
    images = {k: v for k, v in load_json(here, "src", "data", "guides", "page-card-images.json").items()
              if not k.startswith("_")}
    page_species = set(links)

    guides = []
    # Shopify care PAGES (one per species).
    for slug, page_handle in links.items():
        s = species.get(slug)
        if not s:
            raise SystemExit(f"care-page-links slug not in species.json: {slug}")
        shop_handle = s.get("shopifyHandle", "")
        img = images.get(shop_handle)
        if not img:
            raise SystemExit(f"No card image for page '{page_handle}' (product '{shop_handle}'). Re-fetch page-card-images.json.")
        sci = s.get("scientificName", "").strip()
        gtitle = f"{s.get('commonName', slug)} ({sci})" if sci else s.get("commonName", slug)
        guides.append({
            "title": gtitle,
            "href": PAGE + page_handle,
            "image": img,
            "alt": alt_for(gtitle),
            "shopHref": f"{STORE}/products/{shop_handle}" if shop_handle else f"{STORE}/collections/all-plants",
        })

    # Blog plant PROFILES for species with no care page (dropped when a page exists).
    for handle, slug in PROFILE_SPECIES.items():
        if slug in page_species:
            continue  # page wins — drop the duplicate profile
        if handle not in BY_HANDLE:
            raise SystemExit(f"PROFILE_SPECIES handle not in ARTICLES: {handle}")
        _, gtitle, img = BY_HANDLE[handle]
        guides.append({
            "title": gtitle,
            "href": BLOG + handle,
            "image": CDN + img,
            "alt": alt_for(gtitle),
            "shopHref": f"{STORE}/collections/{SHOP.get(handle, 'all-plants')}",
        })

    guides.sort(key=lambda g: g["title"].lower())
    return {"id": cid, "title": title, "blurb": blurb, "guides": guides}, set(PROFILE_SPECIES)


def main():
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    used = set()

    # Category 1: merged plant care (Shopify care pages + de-duped blog profiles). Leads the hub.
    plant_cat, profile_handles = build_plant_care_section(here)
    used |= profile_handles
    cats = [plant_cat]

    # Categories 2..n: blog-article based.
    for cid, title, blurb, shop_default, handles in CATEGORIES:
        guides = []
        for h in handles:
            if h not in BY_HANDLE:
                raise SystemExit(f"Unknown handle in category {cid}: {h}")
            used.add(h)
            _, gtitle, img = BY_HANDLE[h]
            guides.append({
                "title": gtitle,
                "href": BLOG + h,
                "image": CDN + img,
                "alt": alt_for(gtitle),
                "shopHref": f"{STORE}/collections/{SHOP.get(h, shop_default)}",
            })
        cats.append({"id": cid, "title": title, "blurb": blurb, "guides": guides})

    missing = [h for h, _, _ in ARTICLES if h not in used]
    if missing:
        raise SystemExit(f"Articles not placed in any category: {missing}")

    out = {
        "_comment": "GENERATED by scripts/gen_careguides_hub.py. Do not hand-edit; re-run the script. Cards link OUT to live Shopify guides (blogs + pages, never 301'd) + de-duped plant species. Plants lead per SEO strategy.",
        "categories": cats,
    }
    path = os.path.join(here, "src", "data", "guides", "hub.json")
    with open(path, "w") as f:
        json.dump(out, f, indent=2)
        f.write("\n")
    total = sum(len(c["guides"]) for c in cats)
    print(f"Wrote {path}: {len(cats)} categories, {total} guides")


if __name__ == "__main__":
    main()
