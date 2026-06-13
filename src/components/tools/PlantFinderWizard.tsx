"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import type { PlantSpecies } from "@/types/plants";
import type {
  RecommenderInput,
  RecommenderGoal,
  CO2Setup,
  FertRoutine,
  Experience,
  ScoredPlant,
} from "@/lib/recommender/types";
import { recommendPlants } from "@/lib/recommender/engine";
import { TANK_SIZES } from "@/data/tanks";

export interface FinderProductInfo {
  price: number;
  availableForSale: boolean;
  image: string | null;
  variantId: string;
}

interface Props {
  plants: PlantSpecies[];
  productInfo: Record<string, FinderProductInfo>;
}

const GOALS: { id: RecommenderGoal; label: string; hint: string }[] = [
  { id: "carpet", label: "A carpet", hint: "low lawn across the foreground" },
  { id: "attach_to_hardscape", label: "Attach to stone & wood", hint: "no substrate needed" },
  { id: "background_wall", label: "Background wall", hint: "fill the back glass" },
  { id: "red_accents", label: "Red accents", hint: "color beyond green" },
  { id: "snail_safe", label: "Snail & shrimp safe", hint: "survives grazing crews" },
  { id: "low_maintenance", label: "Low maintenance", hint: "minimal trimming" },
  { id: "floating_cover", label: "Floating cover", hint: "shade and security" },
  { id: "betta_tank", label: "Betta tank", hint: "resting spots, gentle flow" },
];

const LIGHT_OPTIONS = [
  { id: "low", label: "Low", hint: "Stock hood or basic LED — you've never fought algae from light" },
  { id: "medium", label: "Medium", hint: "A dedicated planted-tank LED at honest settings" },
  { id: "high", label: "High", hint: "High-output fixture — carpets pearl, algae keeps you honest" },
] as const;

const CO2_OPTIONS: { id: CO2Setup; label: string; hint: string }[] = [
  { id: "none", label: "No CO2", hint: "The natural way — most plants here don't need it" },
  { id: "liquid", label: "Liquid carbon", hint: "Daily bottle dosing" },
  { id: "pressurized", label: "Pressurized CO2", hint: "Regulator, diffuser, the works" },
];

const FERT_OPTIONS: { id: FertRoutine; label: string }[] = [
  { id: "none", label: "None yet" },
  { id: "root_tabs", label: "Root tabs" },
  { id: "liquid", label: "Liquid dosing" },
  { id: "comprehensive", label: "Full routine (liquid + tabs)" },
];

const EXPERIENCE_OPTIONS: { id: Experience; label: string }[] = [
  { id: "beginner", label: "First planted tank" },
  { id: "intermediate", label: "A few tanks in" },
  { id: "advanced", label: "I trim with intent" },
];

const STEPS = ["Tank", "Light", "CO2 & ferts", "Goals"] as const;

function tankHeight(dimensions: string): number | null {
  const nums = dimensions.match(/\d+/g);
  return nums && nums.length >= 3 ? Number(nums[2]) : null;
}

function variantNumericId(gid: string): string | null {
  const m = gid.match(/ProductVariant\/(\d+)/);
  return m ? m[1] : null;
}

export function PlantFinderWizard({ plants, productInfo }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState(() => {
    const s = Number(params.get("step") ?? 0);
    return Number.isFinite(s) ? Math.min(Math.max(s, 0), STEPS.length) : 0;
  });
  const [tankId, setTankId] = useState(params.get("tank") ?? "");
  const [light, setLight] = useState<RecommenderInput["light"]>(
    (params.get("light") as RecommenderInput["light"]) || null,
  );
  const [co2, setCo2] = useState<CO2Setup>((params.get("co2") as CO2Setup) || "none");
  const [fert, setFert] = useState<FertRoutine>((params.get("fert") as FertRoutine) || "none");
  const [experience, setExperience] = useState<Experience>(
    (params.get("exp") as Experience) || "beginner",
  );
  const [goals, setGoals] = useState<RecommenderGoal[]>(
    () => (params.get("goals")?.split(",").filter(Boolean) as RecommenderGoal[]) ?? [],
  );
  const [unheated, setUnheated] = useState(params.get("unheated") === "1");
  const [showAll, setShowAll] = useState(false);
  const [showExcluded, setShowExcluded] = useState(false);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  // Keep the URL shareable without polluting history.
  useEffect(() => {
    const q = new URLSearchParams();
    if (step) q.set("step", String(step));
    if (tankId) q.set("tank", tankId);
    if (light) q.set("light", light);
    if (co2 !== "none") q.set("co2", co2);
    if (fert !== "none") q.set("fert", fert);
    if (experience !== "beginner") q.set("exp", experience);
    if (goals.length) q.set("goals", goals.join(","));
    if (unheated) q.set("unheated", "1");
    router.replace(`?${q.toString()}`, { scroll: false });
  }, [step, tankId, light, co2, fert, experience, goals, unheated, router]);

  const tank = TANK_SIZES.find((t) => t.id === tankId) ?? null;

  const input: RecommenderInput = useMemo(
    () => ({
      tankGallons: tank && tank.gallons > 0 ? tank.gallons : null,
      tankHeightIn: tank && tank.gallons > 0 ? tankHeight(tank.dimensions) : null,
      light,
      co2,
      fertilization: fert,
      experience,
      goals,
      temperatureF: unheated ? 66 : null,
    }),
    [tank, light, co2, fert, experience, goals, unheated],
  );

  const stockByHandle = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const [handle, info] of Object.entries(productInfo)) {
      m.set(handle, info.availableForSale);
    }
    return m;
  }, [productInfo]);

  const result = useMemo(
    () => recommendPlants(plants, input, { stockByHandle }),
    [plants, input, stockByHandle],
  );

  const atResults = step >= STEPS.length;
  const visible = showAll ? result.recommendations : result.recommendations.slice(0, 10);

  const onAquaticMotiv =
    typeof window !== "undefined" && /(^|\.)aquaticmotiv\.com$/.test(window.location.hostname);

  const addToCart = useCallback(
    async (handle: string) => {
      const info = productInfo[handle];
      const id = info && variantNumericId(info.variantId);
      if (!id) return;
      try {
        const res = await fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: Number(id), quantity: 1 }),
        });
        if (res.ok) setAdded((a) => ({ ...a, [handle]: true }));
      } catch {
        // Swallow — the View link remains as fallback.
      }
    },
    [productInfo],
  );

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24">
        {/* Depth stepper */}
        <nav aria-label="Progress" className="-mt-5 mb-10">
          <ol className="flex overflow-hidden rounded-full border border-aqua-200 bg-white shadow-lg shadow-ocean-950/5">
            {STEPS.map((label, i) => (
              <li key={label} className="flex-1">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-current={step === i ? "step" : undefined}
                  className={`w-full px-2 py-3 text-xs font-semibold transition-colors sm:text-sm ${
                    step === i
                      ? "bg-aqua-600 text-white"
                      : i < step || atResults
                        ? "text-aqua-700 hover:bg-aqua-50"
                        : "text-ocean-900/40"
                  }`}
                >
                  <span className="hidden sm:inline">{i + 1}. </span>
                  {label}
                </button>
              </li>
            ))}
            <li className="flex-1">
              <span
                className={`block px-2 py-3 text-center text-xs font-semibold sm:text-sm ${
                  atResults ? "bg-ocean-900 text-aqua-300" : "text-ocean-900/40"
                }`}
              >
                Results
              </span>
            </li>
          </ol>
        </nav>

        {/* Step 1 — Tank */}
        {step === 0 && (
          <section aria-labelledby="step-tank">
            <h2 id="step-tank" className="text-xl font-bold text-ocean-950">
              What are you working with?
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TANK_SIZES.filter((t) => t.gallons > 0).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTankId(t.id);
                    setStep(1);
                  }}
                  className={`rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    tankId === t.id
                      ? "border-aqua-600 bg-aqua-50"
                      : "border-ocean-100 bg-white hover:border-aqua-300"
                  }`}
                >
                  <span className="block text-lg font-bold text-ocean-950">{t.gallons}g</span>
                  <span className="block text-xs text-ocean-900/60">{t.dimensions}</span>
                </button>
              ))}
            </div>
            <label className="mt-6 flex items-center gap-3 text-sm text-ocean-900">
              <input
                type="checkbox"
                checked={unheated}
                onChange={(e) => setUnheated(e.target.checked)}
                className="h-4 w-4 accent-aqua-600"
              />
              This tank is unheated (room temperature)
            </label>
            <button
              type="button"
              onClick={() => {
                setTankId("");
                setStep(1);
              }}
              className="mt-4 text-sm font-medium text-aqua-700 underline-offset-2 hover:underline"
            >
              Skip — recommend for any tank size
            </button>
          </section>
        )}

        {/* Step 2 — Light */}
        {step === 1 && (
          <section aria-labelledby="step-light">
            <h2 id="step-light" className="text-xl font-bold text-ocean-950">
              How much light is over it?
            </h2>
            <div className="mt-5 grid gap-3">
              {LIGHT_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setLight(o.id);
                    setStep(2);
                  }}
                  className={`rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    light === o.id
                      ? "border-aqua-600 bg-aqua-50"
                      : "border-ocean-100 bg-white hover:border-aqua-300"
                  }`}
                >
                  <span className="block font-bold text-ocean-950">{o.label} light</span>
                  <span className="block text-sm text-ocean-900/60">{o.hint}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 3 — CO2 & ferts */}
        {step === 2 && (
          <section aria-labelledby="step-co2">
            <h2 id="step-co2" className="text-xl font-bold text-ocean-950">
              CO2 and fertilizer?
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {CO2_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setCo2(o.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    co2 === o.id
                      ? "border-aqua-600 bg-aqua-50"
                      : "border-ocean-100 bg-white hover:border-aqua-300"
                  }`}
                >
                  <span className="block font-bold text-ocean-950">{o.label}</span>
                  <span className="block text-xs text-ocean-900/60">{o.hint}</span>
                </button>
              ))}
            </div>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ocean-900/60">
              Fertilization
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {FERT_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setFert(o.id)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    fert === o.id
                      ? "border-aqua-600 bg-aqua-600 text-white"
                      : "border-ocean-100 bg-white text-ocean-900 hover:border-aqua-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="mt-8 rounded-full bg-ocean-950 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Continue
            </button>
          </section>
        )}

        {/* Step 4 — Goals */}
        {step === 3 && (
          <section aria-labelledby="step-goals">
            <h2 id="step-goals" className="text-xl font-bold text-ocean-950">
              What do you want from this scape?
            </h2>
            <p className="mt-1 text-sm text-ocean-900/60">Pick as many as you like.</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {GOALS.map((g) => {
                const active = goals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setGoals((cur) =>
                        active ? cur.filter((x) => x !== g.id) : [...cur, g.id],
                      )
                    }
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      active
                        ? "border-aqua-600 bg-aqua-50"
                        : "border-ocean-100 bg-white hover:border-aqua-300"
                    }`}
                  >
                    <span className="block font-bold text-ocean-950">{g.label}</span>
                    <span className="block text-xs text-ocean-900/60">{g.hint}</span>
                  </button>
                );
              })}
            </div>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ocean-900/60">
              Your experience
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXPERIENCE_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setExperience(o.id)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    experience === o.id
                      ? "border-aqua-600 bg-aqua-600 text-white"
                      : "border-ocean-100 bg-white text-ocean-900 hover:border-aqua-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="mt-8 rounded-full bg-aqua-600 px-8 py-3 font-semibold text-white shadow-lg shadow-aqua-600/25 transition-transform hover:scale-[1.02]"
            >
              Show my plants
            </button>
          </section>
        )}

        {/* Results */}
        {atResults && (
          <section aria-labelledby="results">
            <div className="flex items-end justify-between gap-4">
              <h2 id="results" className="text-xl font-bold text-ocean-950">
                {result.recommendations.length} plants fit this tank
              </h2>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="text-sm font-medium text-aqua-700 underline-offset-2 hover:underline"
              >
                Change answers
              </button>
            </div>

            <ol className="mt-6 space-y-4">
              {visible.map((r, i) => (
                <ResultCard
                  key={r.plant.slug}
                  rank={i + 1}
                  scored={r}
                  info={r.plant.shopifyHandle ? productInfo[r.plant.shopifyHandle] : undefined}
                  onAquaticMotiv={onAquaticMotiv}
                  added={!!added[r.plant.shopifyHandle ?? ""]}
                  onAdd={addToCart}
                />
              ))}
            </ol>

            {!showAll && result.recommendations.length > 10 && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="mt-6 w-full rounded-xl border-2 border-dashed border-aqua-300 py-3 font-medium text-aqua-700 hover:bg-aqua-50"
              >
                Show all {result.recommendations.length} matches
              </button>
            )}

            {result.excluded.length > 0 && (
              <div className="mt-10">
                <button
                  type="button"
                  onClick={() => setShowExcluded((v) => !v)}
                  aria-expanded={showExcluded}
                  className="text-sm font-semibold text-ocean-900/60 hover:text-ocean-950"
                >
                  {showExcluded ? "▾" : "▸"} Not for this tank ({result.excluded.length}) — and why
                </button>
                {showExcluded && (
                  <ul className="mt-3 space-y-2">
                    {result.excluded.map((e) => (
                      <li
                        key={e.plant.slug}
                        className="rounded-lg border border-ocean-100 bg-white/60 px-4 py-2 text-sm"
                      >
                        <span className="font-semibold text-ocean-950">{e.plant.commonName}</span>{" "}
                        <span className="text-ocean-900/60">— {e.hardFails.join(" ")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        )}
    </main>
  );
}

function ResultCard({
  rank,
  scored,
  info,
  onAquaticMotiv,
  added,
  onAdd,
}: {
  rank: number;
  scored: ScoredPlant;
  info?: FinderProductInfo;
  onAquaticMotiv: boolean;
  added: boolean;
  onAdd: (handle: string) => void;
}) {
  const { plant, score, reasons, cautions } = scored;
  const inStock = info?.availableForSale ?? false;
  const storeUrl = plant.shopifyHandle
    ? `https://aquaticmotiv.com/products/${plant.shopifyHandle}`
    : null;

  return (
    <li className="overflow-hidden rounded-2xl border border-ocean-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-950 text-sm font-bold text-aqua-300">
            {rank}
          </span>
          {info?.image && (
            <Image
              src={info.image}
              alt={plant.commonName}
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg object-cover"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="text-lg font-bold text-ocean-950">{plant.commonName}</h3>
            <span className="text-sm italic text-ocean-900/50">{plant.scientificName}</span>
          </div>

          {/* Fit meter */}
          <div className="mt-2 flex items-center gap-2" aria-label={`Fit score ${score} of 100`}>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-ocean-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-aqua-400 to-aqua-600"
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-aqua-700">{score}% fit</span>
          </div>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="rounded-full bg-aqua-100 px-2.5 py-0.5 text-xs font-medium text-aqua-800"
              >
                {reason}
              </li>
            ))}
          </ul>

          {cautions.length > 0 && (
            <ul className="mt-2 space-y-1">
              {cautions.map((c) => (
                <li key={c} className="text-xs text-amber-700">
                  ⚠ {c}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {info && (
              <span className="text-sm font-bold text-ocean-950">
                ${info.price.toFixed(2)}{" "}
                <span
                  className={`ml-1 text-xs font-semibold ${inStock ? "text-green-700" : "text-ocean-900/40"}`}
                >
                  {inStock ? "In stock" : "Out of stock"}
                </span>
              </span>
            )}
            {storeUrl && onAquaticMotiv && inStock && plant.shopifyHandle && (
              <button
                type="button"
                onClick={() => onAdd(plant.shopifyHandle!)}
                disabled={added}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  added
                    ? "bg-green-100 text-green-800"
                    : "bg-aqua-600 text-white hover:bg-aqua-700"
                }`}
              >
                {added ? "Added ✓" : "Add to cart"}
              </button>
            )}
            {storeUrl && (!onAquaticMotiv || !inStock) && (
              <a
                href={storeUrl}
                className="rounded-full border-2 border-aqua-600 px-4 py-1.5 text-sm font-semibold text-aqua-700 hover:bg-aqua-50"
              >
                View at AquaticMotiv →
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
