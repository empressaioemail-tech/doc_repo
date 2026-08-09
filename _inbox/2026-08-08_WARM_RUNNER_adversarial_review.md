# ADVERSARIAL REVIEW — depth-warm unified city-batch runner (PR #287)

**Repo:** P:\hauska-engine
**Branch:** feat/depth-warm-unified-runner @ a15f7b7 (on top of 9040c45, base 82728c3)
**Reviewer posture:** adversarial (Geometry Law rule 5, instrument independence) — attempting to REFUTE, not grade.

Untracked file present on the branch at review time: `packages/engine-core/scripts/_equiv_bastrop_main.mjs` (the planner's copy of the retired Bastrop script, used to produce `compare-report.json`). This harness is not committed — the equivalence proof is not reproducible from the PR diff alone.

---

## 1. Attempted attacks (what I checked)

1. Read `depth-warm-city-batch.mjs` in full (1190 lines) and diffed it line-for-line against `origin/main`'s three retired scripts (extracted via `git show origin/main:...`, re-encoded UTF-8 to avoid a false "binary files differ" from PowerShell's default redirection encoding).
2. Diffed `jurisdiction-registry.ts` against `origin/main` to determine which `warmRunner` field values are literal restatements of pre-existing source vs. newly authored by this PR.
3. Read the fix commit `a15f7b7` in isolation to see what the *first* generalization attempt (`9040c45`) got wrong, and whether the fix is now correct.
4. Read `bastrop-batch-bulk-prefetch.mjs`, `parcel-geometry-resolver.ts`, `promote.ts`, `warm-then-verify.ts` to check bulk-vs-per-parcel semantic equivalence and the dry-run/apply compute path.
5. Read `jurisdiction-registry.test.ts` (new, 67 lines) to see what is actually asserted vs. merely documented.
6. Read `compare-report.json` and cross-referenced every row against the actual cohort composition it was run against.
7. Checked `package.json` script table for the Caldwell/Lockhart naming footgun.
8. Grepped for `liveHttpCallsInLoop` increments in both old and new scripts.

---

## 2. Fatal findings

### F1 — The equivalence proof in `compare-report.json` exercises **zero** of the logic the claims are about

`compare-report.json`'s cohort (`--city-cohort --dry-run --limit=40`) hit `declines.no-parcel-node-anchor: 40` and `refusedCount: 40` on **both** legacy and unified — i.e. **all 40 parcels in the tested cohort were refused at the very first gate** (the C1/C5 parcel-node-anchor preflight, `depth-warm-city-batch.mjs:697-705`), before a single parcel reached:

- the currency check / `superseded-prop-id` gate (claim 2B's subject),
- setback-descriptor resolution (claim 2B's currency-vs-setback ordering — the thing `a15f7b7` was fixing),
- boundary-edge / R28 winding-gate / R30 relabel logic,
- `warmThenVerify` at all (so claim 3, "dry-run truly predicts apply," is **not evidenced by this artifact** — the loop body containing the `storage`/`promote` branch never ran),
- any promote-error path (claim 2D).

The `"parcelNodePreflight": {"legacy": null, "unified": null, "match": true}` row in the report is comparing two absent fields (neither script's `costJson` has a top-level `parcelNodePreflight` key) — a vacuous match, not evidence.

**Consequence:** "0 mismatches / 35 compared rows" is a true statement about a cohort that never left the front gate. It proves the preflight-gate wiring and the config-loading path are equivalent. It does **not** prove claims 2A/2B/2C/3 for Bastrop, and it says nothing whatsoever about Elgin or Lockhart (see F2, F3) since it was only ever run against Bastrop.

This is the single most important gap: the planner's own comparison artifact, read honestly, does not support "the four Bastrop fixes are genuinely present and working" — it only supports "the code compiles and the outermost gate fires the same." The task prompt's attack vector `no-parcel-node-anchor:0)` framing is confirmed: the run's `anchorsFound` was 0 for the full 40-row sample, not merely a subset.

### F2 — Elgin gets a brand-new decline gate under the unified runner that Elgin's own retired script never had, unverified by any equivalence run

`origin/main:packages/engine-core/scripts/depth-warm-elgin-batch.mjs` never imports or calls `parcelCurrencyFromBcadMap`, never declines `superseded-prop-id`, and only ever touches BCAD reactively inside the ring-swap fallback (`fetchBcadParcelRings([propId])`, main-elgin.mjs:403-419) — a live HTTP call, not a gate.

The unified runner sets `ELGIN_REGISTRY_ROW.warmRunner.bulkBcad = true` (new field, added by this PR — confirmed absent from `origin/main`'s registry via `git diff --no-index` against the extracted main copy). Because `bulkBcad` is true, every Elgin parcel now runs through the same upfront currency gate Bastrop uses (`depth-warm-city-batch.mjs:730-750`, `if (propId && warmRunner.bulkBcad) { currencyResult = parcelCurrencyFromBcadMap(...) ; if (!currencyResult.ok) { decline superseded-prop-id } }`).

This is not a "silent drop" in the literal sense of claim 1 — it's a silent **addition**: Elgin parcels whose `prop_id` is absent from (or stale in) the bulk BCAD cadastral fetch will now be declined `superseded-prop-id` before setback resolution even runs, a decline path that did not exist for Elgin before this PR and that the `compare-report.json` run never touched (it only ran `--row-id` implicitly via the retired script, on Bastrop, and never on Elgin at all). Whether this is desirable (arguably yes — it's the same rigor Bastrop already gets) is a real decision, but it was made by inference ("Elgin is in the same county as Bastrop, so bulk BCAD coverage should apply"), not read from Elgin's own prior behavior, and it is untested. If it fires unexpectedly wide on Elgin's cohort, actual promotions could drop wholesale the day Elgin flips from `pre-flight-pending` to `active` — with no dry-run evidence in hand to catch it, because no dry-run against Elgin's real cohort exists in this PR's artifacts.

This directly weakens claim 4 ("Caldwell and Elgin config was read from source... not inferred") for the `bulkBcad` field specifically: `cityBbox`, `costEventName`, `gisDistrictAliases: {A: "R-4"}`, `descriptorId`, and `jurisdictionLabel` are all verified byte-identical to values hardcoded in `origin/main`'s `depth-warm-elgin-batch.mjs` / `fetch-overpass-bbox.ts` (checked directly). `bulkBcad: true` is not sourced the same way — it is a new judgment call this PR is making on Elgin's behalf.

### F3 — Lockhart is handed the entire Bastrop-hardening stack (C1/C5 preflight, R28 winding gate, R30 relabel, situs-driven edge labeling) that Caldwell's retired script never had, also unverified

`origin/main:packages/engine-core/scripts/depth-warm-caldwell-batch.mjs` (the Lockhart-relevant retired script — `COUNTY_FIPS = "48055"`, `LOCKHART_CITY_BBOX`, cost event `RECIPE-PROOF-48055-depth-cost.done`) is a materially older, simpler script:

- **No parcel-node C1/C5 preflight gate at all.** No `gateWarmCohort` / `assertWarmGateApplied` / anchor check. The unified runner applies this gate to Lockhart unconditionally (`depth-warm-city-batch.mjs:560-606`, not gated by `isLayer23` or any `warmRunner` field).
- **No situs address ever computed or passed.** Main-caldwell's `labelEdgesFromRoads({ parcelRing: geom.ring, roads })` call (main-caldwell.mjs:298-301) omits `situsAddress` entirely, and `warmThenVerify` is called without it too. The unified runner bulk-loads `situsByPropId` and threads `situsAddress` into both `labelEdgesFromRoads` and `warmThenVerify` for **every** row including Lockhart (`depth-warm-city-batch.mjs:725-726, 937-941, 995`). `situsAddress` is documented elsewhere in this same file as "R31 — situs for front-orientation verify gate" (`warm-then-verify.ts:23`) — i.e. it can change verify outcomes, not just logging. This is new, untested input into Lockhart's verify path.
- **No R28 winding-gate / normals-agreement rebuild, no R30 relabel-from-road-labels, no ring-swap / `rawParcelRing` / PARCEL-RING-SOURCE-DIVERGENCE instrumentation.** All of that machinery is now applied uniformly to Lockhart.
- **No `no-zoning-fact-stamp` decline is newly meaningful** (this one is benign — `zoning_fact_did` is the zoning-fact atom's own DID from the same query, so it is always truthy for Caldwell/Lockhart's cohort shape; not a real risk).

None of this touched Lockhart in `compare-report.json` — the artifact only ran against Bastrop's cohort. Given Lockhart's own registry row is flagged `RAIL_A_FIELDS_NEEDS_FREEZE_REVIEW` and `status: "pre-flight-pending"`, the operational blast radius today is zero, but the claim under review is about the code, not the flag — and the code change for Lockhart is the *largest* unverified generalization in this PR, not a minor one.

---

## 3. Non-fatal gaps / residual risk

- **`liveHttpCallsInLoop` is dead instrumentation, inherited unchanged from Bastrop main.** It's declared (`let liveHttpCallsInLoop = 0;`, line 608) and reported in the cost JSON with a comment demanding it "must be 0" — but it is never incremented anywhere in either the unified script or the pre-existing `depth-warm-bastrop-batch.mjs`. Claim 2B ("zero live HTTP in loop") is real by construction (bulk maps replace per-parcel fetches) but this specific counter cannot detect a regression if one were introduced later; it would silently keep reporting 0. Pre-existing bug, not introduced by this PR, but claim 2B leaning on "cost.liveHttpCallsInLoop: 0" in the compare report as evidence is leaning on a counter that cannot fail.
- **`wdll9Note` (a Bastrop-specific and a separately-worded Caldwell-specific annotation about ROW/OSM-centerline approximation) is dropped from the unified `costJson` with no replacement field.** Cosmetic/reporting-only, not gating, but it is a concrete instance of "per-city content silently absent post-generalization" (claim 1's literal subject) even if low-stakes.
- **`centroidLngLat` local variable removal in the main loop is confirmed dead code removal, not a behavior change** — it was computed via `ringCentroidLngLat(currencyResult.ring)` in Bastrop main and never read afterward in that script either. Verified via grep; not a defect.
- **Claim 2D ("three promote error types counted separately") overstates precision.** There are exactly two *typed* promote error classes (`EnvelopeGroundTruthPromoteDeclineError`, `EnvelopeWriteThenVerifyMismatchError`, `promote.ts:43,73`); the third decline bucket is a generic `catch { declineKey = "other" }` that catches *any* exception from `warmThenVerify`, not specifically a promote error. This is unchanged from Bastrop main (not a regression) but the claim's framing is slightly generous to itself.
- **`package.json` still registers `depth-warm-caldwell-batch` and `depth-warm-elgin-batch` (and `depth-warm-bastrop-batch`) as pnpm scripts pointing at the now-stub `.mjs` files** (`package.json:81,93,94`). Not a functional bug — the stubs fail loud with `process.exit(2)` and print the correct `--row-id` redirect — but it is a real footgun: an operator typing `pnpm run depth-warm-caldwell-batch` gets a message about `--row-id=Lockhart`, a rowId that does not appear anywhere in the command they just ran. Cheap to fix (delete or rename the three script entries); not done here.
- **Bulk vs. per-parcel semantic equivalence for Elgin/Lockhart (situs lookup, geometry lookup, already-promoted lookup) checks out on inspection** (`bulkLoadSitusByPropId`, `bulkLoadTxgioGeometryByPropId`, `bulkLoadAlreadyPromotedSet` reproduce the same WHERE-predicate and trim/null semantics as the per-parcel queries in `depth-warm-elgin-batch.mjs` / `depth-warm-caldwell-batch.mjs`) — this is a legitimate, faithful generalization, not a finding, but it was not exercised by any test or by `compare-report.json` since neither Elgin nor Lockhart data was run.
- **The self-correction on record**: the first generalization pass (`9040c45`) put setback resolution *before* the currency check, which would have counted a parcel that fails both as `no-setback-row` instead of `superseded-prop-id` — a real divergence from Bastrop main. This was caught and fixed same-day in `a15f7b7`. That the bug existed at all, and needed a dedicated fix commit with the explicit message "Equivalence with the retired bastrop batch requires currency-before-setback," is evidence *for* the general concern in this review (fast generalization work drops per-city/per-rule ordering silently) even though this particular instance was caught before merge. It was caught for Bastrop, where an equivalence run existed. Elgin and Lockhart have no equivalent run to catch an analogous ordering or gating mistake for them.
- **The equivalence harness itself (`_equiv_bastrop_main.mjs`) is untracked.** The `compare-report.json` is not reproducible from the committed diff; a reviewer (or CI) cannot re-run the comparison without the planner's private script.

---

## 4. Claim-by-claim disposition

| # | Claim | Verdict |
|---|---|---|
| 1 | No per-city behavior silently dropped | **Not established.** Literal drops are minor (`wdll9Note` text). The real risk is the opposite and larger: per-city behavior silently **added** to Elgin (F2) and Lockhart (F3) that changes their decline/verify surface, unverified by any run against their actual cohorts. |
| 2A | Dry-run predicts apply (`!dryRun` only gates writes) | **True at the code level** (`warm-then-verify.ts` confirms `computeWarmCandidate`/`verifyWarmCandidateMechanically` never branch on `promote`/`storage`), but **not evidenced by `compare-report.json`** — the tested cohort never reached `warmThenVerify`. |
| 2B | Bulk acquisition, zero live HTTP in loop | **True by construction** for the code paths exercised (Bastrop's currency/geometry/edges are bulk-loaded pre-loop) and now correctly generalized to Elgin/Lockhart's equivalent bulk loads — but the `liveHttpCallsInLoop` instrument that's supposed to police this is dead (always 0), and Elgin's original live-HTTP ring-swap fallback path was never actually exercised as "removed" by a real Elgin run. |
| 2C | Uncapped refused-parcel roster | **Holds.** `recordRefusedParcel` pushes unconditionally with no cap, unchanged from Bastrop main, applies uniformly to all rowIds. |
| 2D | Three promote error types counted separately | **Holds mechanically**, with the caveat that one of the three is a generic catch-all, not a distinct promote-specific error type (pre-existing, not a regression). |
| 3 | Dry-run truly predicts apply | **Code-level yes; empirically unproven** — no dry-run/apply pair in this review's evidence ever reached a parcel that got past the C1/C5 gate. |
| 4 | Caldwell/Elgin config read from source, not inferred | **Mostly holds** (bbox, cost event names, `gisDistrictAliases`, descriptor IDs all verified byte-identical to pre-existing source). **Does not hold** for `bulkBcad` on either row: Lockhart's `false` is a defensible inference from Caldwell's script never touching BCAD; Elgin's `true` is a new judgment call that changes Elgin's decline surface (see F2), not a restatement of anything Elgin's script did. |

---

## 5. FINAL VERDICT

**PARTIAL HOLD**

The Bastrop-specific mechanics (currency-before-setback ordering, dry-run/write gating, uncapped roster, bulk pre-fetch replacing Bastrop's own per-parcel calls) are genuinely, verifiably preserved byte-for-byte modulo the registry indirection — confirmed by direct diff against `origin/main`, not by trusting the builder's summary. The self-caught ordering bug (`a15f7b7`) is real evidence the generalization was fragile, but it was caught for the one jurisdiction with an equivalence run.

The claims fail to hold with confidence for Elgin and Lockhart specifically, because:
1. The only equivalence evidence in hand (`compare-report.json`) never ran against Elgin or Lockhart cohorts, and even for Bastrop it only exercised the front gate (F1).
2. Both non-Bastrop jurisdictions receive materially new gates/inputs (Elgin: upfront BCAD currency gate it never had; Lockhart: C1/C5 preflight, situs-driven verify input, R28/R30 machinery it never had) that are inferences dressed as generalization, not verified restatements of prior behavior (F2, F3).
3. Both jurisdictions are currently `pre-flight-pending`, which limits blast radius today but does not make the claims true — it means the claims are untested rather than disproven, and will go live untested the moment either row flips to `active` unless a dry-run equivalence pass against Elgin's and Lockhart's real cohorts is run before that flip.

Recommend before treating this as ship-ready for anything beyond Bastrop: run `--row-id=Elgin --dry-run --city-cohort` and `--row-id=Lockhart --dry-run --city-cohort` against real cohorts and confirm the decline-code distribution is sane (not dominated by a newly-introduced `superseded-prop-id` wall for Elgin, and not silently swallowing parcels into `no-parcel-node-anchor` for Lockhart the way the Bastrop run's cohort was entirely swallowed).
