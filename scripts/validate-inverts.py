#!/usr/bin/env python3
"""Validates src/data/inverts/species.json: schema, enums, ranges, cross-references,
and (when /tmp/aquaticmotiv-catalog.json exists) Shopify handle matching.

Refresh the catalog snapshot with the paginated fetch of
https://aquaticmotiv.com/products.json?limit=250&page=N (see validate-plants.py).
"""
import json, os, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

species = json.load(open(os.path.join(ROOT, "src/data/inverts/species.json")))
plants = {p["slug"] for p in json.load(open(os.path.join(ROOT, "src/data/plants/species.json")))}
catalog = {}
if os.path.exists("/tmp/aquaticmotiv-catalog.json"):
    catalog = {p["handle"]: p for p in json.load(open("/tmp/aquaticmotiv-catalog.json"))}

GUIDE_WHITELIST = {
    "planted-tank-setup", "betta-fish-care", "community-tank-guide",
    "how-to-cycle-aquarium", "aquarium-water-chemistry", "aquarium-maintenance-schedule",
}

enums = {
    "type": {"snail", "shrimp", "clam", "crab", "crayfish"},
    "difficulty": {"easy", "medium", "advanced"},
    "bettaCompatible": {"yes", "caution", "no"},
    "populationGrowth": {"none", "slow", "fast"},
    "temperament": {"peaceful", "predatory"},
    "calciumNeeds": {"low", "medium", "high"},
}
roles = {"algae-eater", "scavenger", "filter-feeder", "pest-control", "showpiece"}
required = ["slug", "commonName", "scientificName", "synonyms", "type", "difficulty",
            "maxSizeIn", "lifespanYears", "temperatureF", "ph", "gh", "tankSizeMinGal",
            "diet", "roles", "plantSafe", "bettaCompatible", "breedsInFreshwater",
            "populationGrowth", "temperament", "calciumNeeds", "careSummary", "faqs",
            "relatedPlants", "relatedGuides"]

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
    if not s.get("roles") or not set(s.get("roles", [])) <= roles:
        errors.append(f"{sl}: bad roles {s.get('roles')}")
    for k in ("plantSafe", "breedsInFreshwater"):
        if not isinstance(s.get(k), bool):
            errors.append(f"{sl}: {k} must be boolean, got {s.get(k)!r}")
    for k in ("maxSizeIn", "tankSizeMinGal"):
        if not isinstance(s.get(k), (int, float)) or s.get(k, 0) <= 0:
            errors.append(f"{sl}: bad {k}={s.get(k)!r}")
    for rng in ("temperatureF", "ph", "gh", "lifespanYears"):
        r = s.get(rng, {})
        if not (isinstance(r, dict)
                and isinstance(r.get("min"), (int, float))
                and isinstance(r.get("max"), (int, float))
                and r["min"] < r["max"]):
            errors.append(f"{sl}: bad {rng} range (need numeric min < max)")
    if not s.get("diet") or not all(isinstance(d, str) for d in s.get("diet", [])):
        errors.append(f"{sl}: bad diet {s.get('diet')}")
    faqs = s.get("faqs", [])
    if len(faqs) < 2:
        errors.append(f"{sl}: fewer than 2 faqs")
    for f_ in faqs:
        if not (isinstance(f_, dict) and f_.get("question") and f_.get("answer")):
            errors.append(f"{sl}: malformed faq {f_}")
    h = s.get("shopifyHandle")
    if h and catalog and h not in catalog:
        errors.append(f"{sl}: handle NOT in catalog snapshot: {h}")
    for p in s.get("relatedPlants", []):
        if p not in plants:
            errors.append(f"{sl}: unknown plant {p}")
    for g in s.get("relatedGuides", []):
        if g not in GUIDE_WHITELIST:
            errors.append(f"{sl}: guide not in whitelist: {g}")

print(f"species: {len(species)}")
print(f"with SKU: {sum(1 for s in species if s.get('shopifyHandle'))}")
print("type:", dict(Counter(s.get("type") for s in species)))
print("difficulty:", dict(Counter(s.get("difficulty") for s in species)))
if not catalog:
    print("(catalog snapshot missing — handle check skipped)")
if errors:
    print(f"\n{len(errors)} ERRORS:")
    for e in errors:
        print(" -", e)
    sys.exit(1)
print("\nALL CHECKS PASSED")
