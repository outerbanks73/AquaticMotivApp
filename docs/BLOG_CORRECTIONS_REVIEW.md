# Blog & care-guide corrections for owner review

## URGENT — care-guide Pages (/pages/*) errors found in the 2026-06-12 audit

These live on the 30 care-guide Pages. If the 301-redirect consolidation is approved,
the pages disappear and only the graph needs to be right (it already is, for all of
these). If pages are kept, these need fixing:

1. **salvinia-minima page — false legal claim.** States S. minima "is classified as a
   Federal Noxious Weed in the United States under USDA APHIS regulations." That is
   FALSE (the federal listing covers Salvinia molesta / the S. auriculata complex);
   S. minima is restricted only in some states. A legally significant error on a
   commerce site — fix or redirect with priority.
2. **pogostemon-stellatus page — misleads buyers.** Overview table says Easy / Medium
   light / "CO2 not necessary"; the plant is advanced, high-light, effectively
   CO2-required (the page's own intro contradicts its table). Buyers set up for failure.
3. monte-carlo page: temperature 74–82°F (should be ~68–80°F).
4. dwarf-baby-tears page: 70–82°F (should be 68–78°F).
5. water-wisteria page: overstates light demand (it is a canonical low-light plant).
6. lobelia-cardinalis page: promises red/purple submerged coloration (submerged dwarf
   growth is green).
7. ludwigia-super-red-mini page: overstates light/CO2 demands for a cultivar whose
   selling point is staying red in modest setups.
8. hornwort/anacharis/duckweed pages: understate cold tolerance (all are pond-hardy).

Former graph-side fix from this audit: fissidens-nobilis temperatureF.max 80 -> 78
(warm water browns the fronds; the page was right).

---

# Blog corrections for owner review

Source: consistency audit (2026-06-12) of 12 published "Plant Profile" posts. The published profiles appear
to have been built from a loose template — several share identical "Temperature:
74–82°F", understated "Low" light, and inflated "Very Fast" growth values. In 5 of 6
material conflicts the structured graph is correct; the graph was wrong once
(Dwarf Baby Tears temperature ceiling — already fixed in the graph and re-synced).

Nothing below has been changed on the live blog. On approval, these are applied via
the Admin API as part of the Phase 6 retrofit (each edit also adds a link to the
matching `/plants/...` page).

| Post | Field | Published says | Should say | Why |
|---|---|---|---|---|
| Plant Profile: Dwarf Hairgrass | Light | Low | Medium (35–70 PAR) | Under low light it grows leggy and never carpets |
| Plant Profile: Alternanthera Reineckii | Light | Low | Medium (40–70 PAR) | Needs at least medium light to hold red color |
| Plant Profile: Ammannia Gracilis | Placement | Midground | Background | 15–20" architectural stem |
| Plant Profile: Ammannia Gracilis | Growth rate | Very Fast | Moderate | Bulky, moderate grower |
| Plant Profile: Ludwigia Super Red Mini | Max height | 16" | ~8" | Compact selected form; 16" describes the full-size species |
| Plant Profile: Ludwigia Ovalis | Light | Low/Medium | High | Needs high light for copper/pink color; stays green when dim |
| Plant Profile: Ludwigia Ovalis | Max height | 20" | ~12" | Species typically 10–30 cm |

## Minor drift (optional tidy-ups, lower priority)

- Monte Carlo: temp 74–82°F → 68–80°F; "Very Easy" → "Easy–Medium (medium without CO2)"
- Water Wisteria: height 24" → ~20"
- Water Sprite: height 24" → ~18"
- Limnophila Hippuridoides: remove "also known as L. aromatica" (different species)
- Several posts share the templated 74–82°F line — worth normalizing per species during retrofit

## Historical graph-side fix

- `dwarf-baby-tears.temperatureF.max`: 82 -> 78. The carpet-guide article was right: HC 'Cuba' melts in warm tanks.
