#!/usr/bin/env python3
"""Validates src/data/plants/species.json: schema, enums, ranges, cross-references,
and (when /tmp/aquaticmotiv-catalog.json exists) live Shopify handle matching.

Refresh the catalog snapshot with:
  python3 -c "see scripts/sync-plant-metafields.mjs header" or re-run the paginated
  fetch of https://aquaticmotiv.com/products.json?limit=250&page=N
"""
import json, os, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

species = json.load(open(os.path.join(ROOT, "src/data/plants/species.json")))
GUIDE_WHITELIST = ['aquarium-maintenance-schedule', 'aquarium-water-chemistry', 'betta-fish-care', 'community-tank-guide', 'how-to-cycle-aquarium', 'planted-tank-setup']
FISH_WHITELIST = ['amano-shrimp', 'angelfish', 'betta-splendens', 'cardinal-tetra', 'cherry-barb', 'corydoras-catfish', 'dwarf-gourami', 'german-blue-ram', 'guppy', 'mystery-snail', 'neon-tetra', 'oscar', 'plecostomus', 'zebra-danio']
catalog = {}
if os.path.exists("/tmp/aquaticmotiv-catalog.json"):
    catalog = {p["handle"]: p for p in json.load(open("/tmp/aquaticmotiv-catalog.json"))}

enums = {
    "type": {"stem", "rosette", "rhizome", "moss", "carpet", "floating", "bulb"},
    "difficulty": {"easy", "medium", "advanced"},
    "light": {"low", "medium", "high"},
    "co2": {"none", "beneficial", "required"},
    "fertDemand": {"low", "medium", "high"},
    "growthRate": {"slow", "medium", "fast"},
    "color": {"green", "red", "orange", "variegated"},
    "trimming": {"minimal", "regular", "frequent"},
}
placements = {"foreground", "midground", "background", "floating", "epiphyte"}
styles = {"iwagumi", "nature", "dutch", "jungle", "biotope"}
required = ["slug", "commonName", "scientificName", "synonyms", "type", "difficulty",
            "light", "co2", "fertDemand", "maxHeightIn", "growthRate", "placement",
            "attachesToHardscape", "snailSafe", "styles", "temperatureF", "ph", "color",
            "trimming", "propagation", "careSummary", "faqs", "relatedGuides", "relatedFish"]

errors = []
slugs = [s["slug"] for s in species]
dupes = [s for s, c in Counter(slugs).items() if c > 1]
if dupes:
    errors.append(f"duplicate slugs: {dupes}")

for s in species:
    sl = s.get("slug", "<missing slug>")
    for f_ in required:
        if f_ not in s:
            errors.append(f"{sl}: missing {f_}")
    for k, allowed in enums.items():
        if s.get(k) not in allowed:
            errors.append(f"{sl}: bad {k}={s.get(k)!r}")
    if not set(s.get("placement", [])) <= placements:
        errors.append(f"{sl}: bad placement {s.get('placement')}")
    if not set(s.get("styles", [])) <= styles:
        errors.append(f"{sl}: bad styles {s.get('styles')}")
    t = s.get("temperatureF", {})
    if not (isinstance(t.get("min"), (int, float)) and t.get("min") < t.get("max", -1)):
        errors.append(f"{sl}: bad temperature range")
    p = s.get("ph", {})
    if not (isinstance(p.get("min"), (int, float)) and p.get("min") < p.get("max", -1)):
        errors.append(f"{sl}: bad ph range")
    if s.get("parMin") is not None and s.get("parMax") is not None and s["parMin"] >= s["parMax"]:
        errors.append(f"{sl}: bad PAR range")
    if len(s.get("faqs", [])) < 2:
        errors.append(f"{sl}: fewer than 2 faqs")
    h = s.get("shopifyHandle")
    if h and catalog and h not in catalog:
        errors.append(f"{sl}: handle NOT in catalog snapshot: {h}")
    for g in s.get("relatedGuides", []):
        if g not in GUIDE_WHITELIST:
            errors.append(f"{sl}: guide not in whitelist: {g}")
    for f_ in s.get("relatedFish", []):
        if f_ not in FISH_WHITELIST:
            errors.append(f"{sl}: fish not in whitelist: {f_}")

print(f"species: {len(species)}")
print(f"with SKU: {sum(1 for s in species if s.get('shopifyHandle'))}")
print("light:", dict(Counter(s.get("light") for s in species)))
print("type:", dict(Counter(s.get("type") for s in species)))
if not catalog:
    print("(catalog snapshot missing — handle check skipped)")
if errors:
    print(f"\n{len(errors)} ERRORS:")
    for e in errors:
        print(" -", e)
    sys.exit(1)
print("\nALL CHECKS PASSED")
