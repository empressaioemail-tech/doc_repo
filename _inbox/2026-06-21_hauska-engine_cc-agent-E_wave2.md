---
id: 2026-06-21_hauska-engine_cc-agent-E_wave2
title: cc-agent-E — Wave 2 F2/F7/F8 + K2 edition ingest (Calibrated Spine)
date: 2026-06-21
agent: cc-agent-E
repo: hauska-engine
dispatch: Calibrated Spine Wave 2 — consequence metadata, granular invalidation, hazard scaffold, K2 edition ingest
tasks: [F2, F7, F8, K2-unblocker]
blocks_unblocked: [F6 severity axis inputs, S5 consequence-gated routing, V5 consequence layer, K2 retrodiction (once acquisition delivers bundles)]
wave: 2
---

# Close — Wave 2 F2 / F7 / F8 + K2 edition ingest

## Summary

Landings on `hauska-engine` for Calibrated Spine Wave 2:

| Task | Deliverable |
|---|---|
| **F2** | `consequenceInputs` typed field on `code-section` atoms; prose parser; atomization hook; atom-trace exposure |
| **F7** | `invalidateStaleCalibrationForSectionChange()` — section-plus-dependents closure via xref graph |
| **F8** | `computeAmendmentHazardRate()` scaffold with cold-start prior floor (0.02); earns when amendments ingest |
| **K2 unblocker** | `hauska-edition-bundle/1` contract + `ingestEditionBundle()` + `resolveEditionAtDate()` + CLI |

**Tests:** corpus 102/102, engine-core 172/172, retrieval-api 19/19.

**Not done this wave:** committed `snapshot.json` backfill (requires re-ingest or `ingest-edition-bundle --snapshot-in/out` once acquisition delivers bundles).

---

## F2 — Consequence metadata (typed fields)

### Schema

Optional field on `CodeSectionAtomInstance` (`packages/atoms/src/instances.ts`):

```typescript
consequenceInputs?: {
  asce7RiskCategories?: ("I" | "II" | "III" | "IV")[];
  ibcOccupancyGroups?: string[];
  ibcImportanceFactors?: string[];  // "1.0" | "1.25" | "1.5" — no severity scalar
  sourceSpans?: { field: string; excerpt: string }[];
  parsedAt?: string;
};
```

Strata derived at read via `deriveConsequenceStrata()` — explicit classification axes only.

### Parser + ingest hook

- `packages/corpus/src/consequence/parse.ts` — extracts ASCE 7 risk category, IBC occupancy group, IBC importance factor from section prose
- `packages/corpus/src/consequence/enrich.ts` — wired into `atomize()` (`packages/corpus/src/atomization/index.ts`)
- `GET /atoms/trace/:did` now returns `consequenceInputs` + `consequenceStrata`

### Coverage on committed snapshot (honest)

Wave 1 reported **58 ASCE / 140 IBC** via loose substring (`asce`, `ibc` anywhere in body). Re-verify with structural patterns:

```text
$ node tools/f0-verify-corpus.mjs  (F2 PARSE COVERAGE section)

{
  "totalSections": 17799,
  "sectionsMatchingParser": 1,
  "withAsce7RiskCategory": 0,
  "withIbcOccupancyGroup": 1,
  "withIbcImportanceFactor": 0,
  "note": "Committed snapshot lacks consequenceInputs until re-ingest/backfill"
}
```

Structural pattern counts on snapshot bodyText:

| Pattern | Sections |
|---|---|
| `risk category` | 0 |
| `occupancy group` | 2 |
| `importance factor` | 0 |
| `ASCE 7` | 0 |
| IBC adopted-by-reference | 1 |

**Interpretation:** L3 zoning/UDC corpus rarely carries normative ASCE/IBC classification prose. F2 machinery is in place; **thick consequence coverage requires Layer 1 model-code ingest (ICC) + acquisition edition bundles**, not substring mentions in L3 text. Wave 1 prose counts were **false-positive inflated** (e.g. "purpo**se**", "pro**ces**s" matched `asce`).

---

## F7 — Section-plus-dependents invalidation

### Before (Wave 1)

`invalidateStaleCalibrationForAtom()` — per overlay atom key, stale when `codeRef + edition + sourceSetVersion` stamp triple drifts (source-set grain).

### After (Wave 2)

`packages/engine-core/src/calibration/sectionInvalidation.ts`:

- `computeSectionDependentsClosure(seedSectionIds, links)` — BFS on inbound `cites | see-also | subject-to | as-defined-in | amends` section→section edges
- `invalidateStaleCalibrationForSectionChange(repo, { edition, changedSectionEntityIds, sectionNumberByEntityId, links, sourceSetVersion })` — invalidates calibrated overlay rows for **closure sections matching edition**, not unrelated editions

`CalibrationGrain` extended: `"section-plus-dependents"` in `dbShim.ts`.

### Verified

```text
$ pnpm --filter @hauska-engine/engine-core test -- sectionInvalidation
✓ computeSectionDependentsClosure — includes inbound dependents
✓ invalidateStaleCalibrationForSectionChange — invalidates seed + dependent rows; preserves other edition
```

---

## F8 — Amendment hazard scaffold

`packages/engine-core/src/calibration/hazard.ts`:

| Symbol | Value / behavior |
|---|---|
| `AMENDMENT_HAZARD_COLD_START_PRIOR` | `0.02` (events / section-year) |
| `computeAmendmentHazardRate({ atomClass, amendments, asOf })` | Returns `{ rate, source, amendmentCount, observationYears, atomClass, asOf }` |
| Zero amendments (production snapshot today) | `source: "cold-start-prior"`, `rate: 0.02` |
| With amendment atoms | `source: "amendment-history"`, `rate = max(floor, count / observationYears)` |
| `validityDecayFromHazard(rate, ageYears)` | `exp(-λ × age)` for V8 vintage-decay wiring |

**Wave 1 finding honored:** production snapshot has **0** `code-amendment` atoms — hazard runs at cold-start prior until task 4 (edition/amendment ingest) lands fuel.

---

## K2 unblocker — Edition + adoption ordinance ingest contract

### Acquisition ↔ engine contract

Format: **`hauska-edition-bundle/1`** (`packages/corpus/src/edition-history/bundle.ts`)

```typescript
{
  format: "hauska-edition-bundle/1",
  generatedAt: string,          // ISO
  jurisdictionTenant: string,     // e.g. "bastrop_tx"
  jurisdictionName: string,
  provenance?: string,            // e.g. "K1-W2-A Bastrop edition bundle v0"
  entries: [{
    edition: {
      entityId: string,
      editionLabel: string,
      effectiveFrom: string,      // ISO — adoption effective date (NOT ingest timestamp)
      effectiveTo: string | null,
      sourceAdapter: string,
      sourceUrl: string,
      modelCodeBase?: "IRC"|"IBC"|"IECC"|...,
      modelCodeYear?: number,
    },
    adoptionOrdinance?: {
      ordinanceId: string,
      effectiveDate: string,
      authority: string,
      title: string,
      sourceUrl: string,
      amendmentText?: string,
      affectedSectionIds?: string[],
      modelCodeBase?: ...,
      modelCodeYear?: number,
    },
    sectionCount?: number,
  }]
}
```

### Ingest + retrodiction lookup

| API | Path |
|---|---|
| `ingestEditionBundle(storage, bundle, { sections? })` | Writes `code-edition`, temporal `code-amendment`, updates `jurisdiction-corpus.adoptedEditionIds`, emits `contains` / `amends` links |
| `resolveEditionAtDate(storage, { jurisdictionTenant, asOf })` | Returns edition in effect for K2 retrodiction |
| `HybridRetrieval.resolveEditionAtDate()` | retrieval-api library wrapper |

### CLI (operator + acquisition handoff)

```powershell
pnpm --filter @hauska-engine/migrate-legacy-codes exec tsx src/index.ts ingest-edition-bundle `
  --bundle P:/path/to/bastrop-edition-bundle.json `
  --snapshot-in services/retrieval-api/corpus/snapshot.json `
  --snapshot-out services/retrieval-api/corpus/snapshot-with-history.json
```

Implementation: `tools/migrate-legacy-codes/src/ingest-edition-bundle.ts` + command registered in `index.ts`.

### Fixture test (edition-correct lookup)

```text
$ pnpm --filter @hauska-engine/corpus test -- edition-history
✓ ingestEditionBundle — 2023-06-15 → ibc-2021-adopted; 2025-06-01 → b3-april-2025
```

### Acquisition agent coordination

Acquisition delivers `hauska-edition-bundle/1` JSON per jurisdiction with:

1. One entry per historical edition window (`effectiveFrom` / `effectiveTo`)
2. Optional `adoptionOrdinance` per entry (becomes temporal `code-amendment` atom)
3. Optional full section payloads in a follow-on ingest pass (bundle currently supports edition timeline; section text can be merged via `sections` option or separate corpus ingest)

**K2 is unblocked on schema + ingest path** — blocked on acquisition **delivery** of bundles (K1-W2-A Bastrop/Austin v0 per acquisition close).

---

## Files touched

| Area | Files |
|---|---|
| F2 | `packages/atoms/src/instances.ts`, `packages/atoms/src/registry.ts`, `packages/corpus/src/consequence/*`, `packages/corpus/src/atomization/index.ts`, `packages/retrieval/src/atom-trace.ts` |
| F7 | `packages/engine-core/src/calibration/sectionInvalidation.ts`, `dbShim.ts`, `index.ts` |
| F8 | `packages/engine-core/src/calibration/hazard.ts` |
| K2 | `packages/corpus/src/edition-history/*`, `packages/retrieval/src/edition-at-date.ts`, `tools/migrate-legacy-codes/src/ingest-edition-bundle.ts` |
| Verify | `tools/f0-verify-corpus.mjs`, `tools/f2-consequence-coverage.mjs` |

---

## Blockers / next wave

1. **Acquisition** — deliver `hauska-edition-bundle/1` for Bastrop + Austin (historical IBC/IRC adoption chain)
2. **Snapshot backfill** — re-run `build-corpus-snapshot` or merge bundles into snapshot so F2 `consequenceInputs` and F8 amendment atoms appear in production artifact
3. **Layer 1 ICC ingest** — thick ASCE/IBC classification coverage (L3 corpus alone is insufficient)
4. **cc-agent-C** — wire `invalidateStaleCalibrationForSectionChange` into drift detection + F3 ledger events

No commit pushed in this close (operator to review + commit when ready).
