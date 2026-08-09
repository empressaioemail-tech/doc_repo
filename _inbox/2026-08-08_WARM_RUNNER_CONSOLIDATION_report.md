---
title: Warm runner consolidation report
status: active
created: 2026-08-08
last_updated: 2026-08-08
owner: warm-runner-consolidation-planner
related:
  - hauska-engine PR #287
  - _inbox/2026-08-08_WARM_RUNNER_adversarial_review.md
  - _inbox/2026-08-08_WARM_RUNNER_bastrop_equivalence_compare.json
memory_graded: false
---

# Warm runner consolidation (2026-08-08)

Operator-authorized. Repo `hauska-engine` branch `feat/depth-warm-unified-runner` @ `a15f7b7` on base `82728c3`. PR: https://github.com/empressaioemail-tech/hauska-engine/pull/287. No merge, no deploy, no promote apply.

## Verdict (one line)

Three near-duplicate warm scripts are collapsed into one registry-parameterized runner; Bastrop gate-path dry-run counters match the retired script exactly (0 mismatches); adversarial review is **PARTIAL HOLD** — compute-path and Elgin/Lockhart cohorts remain unproven on live substrate because parcel-node anchors are currently empty.

---

## 1. Three-way diff — per-city vs accidental drift

Sources: `depth-warm-bastrop-batch.mjs` (~1117), `depth-warm-elgin-batch.mjs` (~653), `depth-warm-caldwell-batch.mjs` (~453) on `origin/main`.

### Genuinely per-city (keep as data)

| Concern | Bastrop | Elgin | Lockhart (was Caldwell script) |
|---|---|---|---|
| FIPS | 48021 | 48021 | 48055 |
| City bbox | BASTROP_CITY_BBOX | ELGIN_CITY_BBOX | LOCKHART_CITY_BBOX |
| Descriptor | bastrop_tx | elgin_tx | caldwell_tx |
| Setback strategy | layer-23 per-parcel overlay | static descriptor table | static descriptor table |
| District alias | none | GIS `A` → canonical `R-4` | none |
| BCAD bulk | yes (same county CAD) | yes (same 48021 CAD) | no |
| Manufacturing cohorts | dominant-district / layer23 / Block-13 quarantine | no | no |
| Cost event name | `R4-depth-cost.done` | `RECIPE-PROOF-48021-elgin-depth-cost.done` | `RECIPE-PROOF-48055-depth-cost.done` |

### Accidental drift (the finding)

These are same-intent divergences that happened while nobody looked. They are why Elgin could not emit reconciliation terms.

1. **#281 bulk acquisition — Bastrop only.** Elgin still called `fetchBcadParcelRings([propId])` inside the loop (main lines 405, 418). Caldwell/Elgin also did per-parcel SQL for already-promoted, situs, geom, and boundary edges. Bastrop prefetched all six maps once.
2. **Uncapped refused roster — Bastrop only.** Elgin capped diagnostic samples at 8 (30 under `--diagnose-failures`) and never wrote a roster file. Caldwell wrote neither.
3. **Typed promote errors — Bastrop only.** Elgin and Caldwell used bare `stats.declines.other++`. Bastrop branched `EnvelopeGroundTruthPromoteDeclineError` / `EnvelopeWriteThenVerifyMismatchError`.
4. **#279 dry-run predict — partial everywhere, documented only on Bastrop.** Storage was always created; `promote: !dryRun`. Elgin/Caldwell lacked the write-gate comment and still mixed per-parcel I/O into dry-run cost paths.
5. **Parcel-node warm gate (C1/C5) — Bastrop only.** Elgin and Caldwell could warm recipe-eligible parcels with no parcel-node anchor.
6. **R28/R30 + serve-consistency + `rawParcelRing` — Bastrop+Elgin, missing Caldwell.** Caldwell passed scrubbed ring only and never relabeled.
7. **Force-overwrite / honest-decline — Bastrop+Elgin, missing Caldwell.**
8. **Verify-fail gate list — Caldwell only counted 3 of 6 gates** and lacked `bucketVerifyFailReasons`.
9. **Cost event naming drift** — three different event strings for the same job class.
10. **Caldwell `wdll9Note` was a Bastrop Spring Street copy-paste.**

Named thesis: **this is the hardcoded-list defect class as whole FILES.** Three parallel programs drifted; the fix is one program + registry rows, not a fourth script.

---

## 2. Design — where per-city config lives

Per operator decision: extend `JurisdictionRegistryRow` with optional `warmRunner` (operate-not-rebuild on the frozen registry).

```ts
warmRunner?: {
  descriptorId: string;
  setbackStrategy: "layer23" | "descriptor-table";
  cityBbox: { south, west, north, east };
  bulkBcad: boolean;
  costEventName: string;
  refusedRosterPrefix: string;
  layer23CityKey?: string;
  placeTypeDistrictPrefixes?: readonly string[];
  block13Quarantine?: readonly string[];
  gisDistrictAliases?: Readonly<Record<string, string>>;
  jurisdictionLabel?: string;
}
```

| Row | Status | Notes |
|---|---|---|
| `Bastrop` | active + warmRunner | layer23, bulkBcad true, Block-13 quarantine, cost event preserved for equivalence |
| `Elgin` | pre-flight-pending + warmRunner | descriptor-table, `A→R-4`, bulkBcad true, bbox from AGOL extent |
| `Lockhart` | **NEW** pre-flight-pending + warmRunner | descriptorId `caldwell_tx`, bulkBcad false, Lockhart bbox; Rail A layer 49 flagged `RAIL_A_FIELDS_NEEDS_FREEZE_REVIEW` (district polygons, no prop_id) |

**Registry gaps flagged (not invented away):**

- Lockhart Rail A `propIdField` is a county-pattern guess; layer 49 has no prop_id. Warm path uses descriptor-table + zoning-fact stamps, not Rail A per-parcel cohort queries, until freeze review.
- Caldwell County (unincorporated) remains unzoned / no warmRunner (correct — the old script targeted Lockhart city, not the unincorporated county).
- Elgin `bulkBcad: true` is a deliberate extend-the-proven-artifact choice (adversarial review F2). It is NOT a restatement of Elgin's prior in-loop live BCAD probe; it upgrades Elgin onto Bastrop's bulk currency gate. Operator accepted registry-extend posture; Elgin dry-run must confirm the new decline surface before apply.

**Unified entrypoint:**

```bash
pnpm --filter @hauska-engine/engine-core run depth-warm-city-batch -- \
  --row-id=Bastrop|Elgin|Lockhart --dry-run --city-cohort ...
```

Retired stubs (`depth-warm-{bastrop,elgin,caldwell}-batch.mjs`) exit 2 and point at the runner (caldwell → `--row-id=Lockhart`), matching `bastrop-district-cert-grade.mjs` retirement pattern.

Gates preserved in the unified Bastrop path: dry-run compute with writes gated; write-then-verify via typed promote errors; Block-13 quarantine from registry; R28/R30; store-truth sizing at execution time via live SQL cohorts; uncapped refused roster; `liveHttpCallsInLoop` remains 0 by construction (bulk only).

---

## 3. Verbatim Bastrop equivalence proof

Protocol: same substrate secrets (`DATABASE_URL` + `CORTEX_DATABASE_URL` as `TXGIO_DATABASE_URL`), `NODE_OPTIONS=--use-system-ca`, `--dry-run --city-cohort --limit=40 --offset=0`.

Legacy harness: `origin/main` script staged as `_equiv_bastrop_main.mjs` (not committed). Unified: `depth-warm-city-batch.mjs --row-id=Bastrop` after currency-before-setback order fix (`a15f7b7`).

### Compare summary (verbatim from `compare-report.json`)

```json
{
  "comparedRows": 35,
  "mismatches": 0,
  "refuseReasonMismatches": 0
}
```

All 35 compared counter fields matched, including every decline key, every failure bucket, `liveHttpCallsInLoop: 0`, event `R4-depth-cost.done`, and the full refused roster (40/40 parcel reasons identical).

Artifact: `_inbox/2026-08-08_WARM_RUNNER_bastrop_equivalence_compare.json`.

### Scope honesty (required)

Both runs reported `anchorsFound: 0`, `warmEligible: 0`, `declines.no-parcel-node-anchor: 40`. The live store currently has no parcel-node anchors for this city cohort (consistent with C1/C3 post-#285 warm preflight + statewide re-acquire hold). Equivalence is proven on the **warm-gate refusal path** — the live reality today — not on geometry/R28/warmThenVerify compute. Single-parcel probe `48021:33512` also declined identically on both (`no-parcel-node-anchor: 1`). Operator accepted gate-path equivalence; compute-path re-proof is owed once parcel-nodes are restocked.

Order-fix note: first push (`9040c45`) put setback resolution before currency; that would miscount when both fire. Caught and fixed in `a15f7b7` before this report.

---

## 4. Adversarial review — verdict verbatim

Full review: `_inbox/2026-08-08_WARM_RUNNER_adversarial_review.md`.

**FINAL VERDICT (verbatim):**

> **PARTIAL HOLD**
>
> The Bastrop-specific mechanics (currency-before-setback ordering, dry-run/write gating, uncapped roster, bulk pre-fetch replacing Bastrop's own per-parcel calls) are genuinely, verifiably preserved byte-for-byte modulo the registry indirection — confirmed by direct diff against `origin/main`, not by trusting the builder's summary. The self-caught ordering bug (`a15f7b7`) is real evidence the generalization was fragile, but it was caught for the one jurisdiction with an equivalence run.
>
> The claims fail to hold with confidence for Elgin and Lockhart specifically, because:
> 1. The only equivalence evidence in hand never ran against Elgin or Lockhart cohorts, and even for Bastrop it only exercised the front gate (F1).
> 2. Both non-Bastrop jurisdictions receive materially new gates/inputs (Elgin: upfront BCAD currency gate it never had; Lockhart: C1/C5 preflight, situs-driven verify input, R28/R30 machinery) that are inferences dressed as generalization, not verified restatements of prior behavior (F2, F3).
> 3. Both jurisdictions are currently `pre-flight-pending`, limiting blast radius today, but that makes the claims untested rather than disproven — and they go live untested the moment either row flips to `active`.

Fatal findings from the review (planner accept):

- **F1** — compare-report never left the front gate. Agreed; reported above.
- **F2** — Elgin gets upfront BCAD currency gate. Agreed; intentional operate-not-rebuild upgrade onto Bastrop's proven bulk path. Elgin dry-run of decline distribution is a pre-apply must.
- **F3** — Lockhart inherits full hardening stack Caldwell lacked. Agreed; that is the point of consolidation (raise floor to Bastrop), but untested on a Lockhart cohort.

---

## 5. What remains before Elgin can run

1. **Merge PR #287** (planner/operator — not this seat).
2. **Restock or confirm parcel-node anchors** for Elgin cohort parcels (C1/C5). Until anchors exist, every warm run refuses at `no-parcel-node-anchor` and cannot emit promote/apply reconciliation terms that matter for apply. This is the same hard wall Bastrop's equivalence cohort hit.
3. **Elgin dry-run on the unified runner** after merge:
   ```bash
   pnpm --filter @hauska-engine/engine-core run depth-warm-city-batch -- \
     --row-id=Elgin --dry-run --city-cohort --diagnose-failures \
     --refused-roster-out=depth-warm-elgin-refused-roster-dry.json
   ```
   Inspect: `liveHttpCallsInLoop === 0`, uncapped refused roster written, typed promote decline keys present, and that `superseded-prop-id` (new vs old Elgin) is not an unexpected wall.
4. **Dry-run must still predict apply** on a cohort that reaches `warmThenVerify` (requires anchors). Do not apply until that paired dry/apply gate is measurable.
5. **Do not flip Elgin registry `status` to active** until FLIP-BLOCKED S4 callers migrate to rowId-keyed cohort loaders (pre-existing; documented on the registry).
6. Lockhart is out of the Elgin critical path; Rail A freeze review (`RAIL_A_FIELDS_NEEDS_FREEZE_REVIEW`) before any Lockhart apply.

---

## Artifacts

| Path | What |
|---|---|
| https://github.com/empressaioemail-tech/hauska-engine/pull/287 | Code + stubs + registry |
| `_inbox/2026-08-08_WARM_RUNNER_CONSOLIDATION_report.md` | This report |
| `_inbox/2026-08-08_WARM_RUNNER_adversarial_review.md` | Full adversarial review |
| `_inbox/2026-08-08_WARM_RUNNER_bastrop_equivalence_compare.json` | Counter compare (0 mismatches) |

## Commits

- `9040c45` — feat: unified city-batch runner + registry warmRunner + Lockhart row + retire stubs
- `a15f7b7` — fix: currency-before-setback loop order (Bastrop equivalence)
