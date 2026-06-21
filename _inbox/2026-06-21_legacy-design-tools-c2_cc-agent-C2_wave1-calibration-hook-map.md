---
id: 2026-06-21_legacy-design-tools-c2_cc-agent-C2_wave1-calibration-hook-map
title: cc-agent-C2 — Wave 1 calibration-engine hook map (design only)
date: 2026-06-21
agent: cc-agent-C2
repo: legacy-design-tools-c2
branch: cortex/precedence-taxonomy-intra-federal
dispatch: Calibrated Spine Wave 1 — calibration-engine hook map (S1, S2, S3, K3, K5); NO build
tasks: [Wave-1-design]
blocks_unblocked: [K3, K5, S1, S2, S3 — Wave 3/4 build when dependencies met]
---

# Close — Wave 1 calibration-engine hook map (design only)

## Summary

Design-only hook map for cc-agent-C2's calibration-engine lane on the **legacy-design-tools-c2** clone. **No code landed this wave.** The map anchors every engine on **real outcomes and inter-adjudicator agreement**, never on the system's own beliefs. All posteriors, reliability scores, model weights, de-confounded labels, and weak-prior triage ranks are **derived at read time** from the F3 rich raw ledger and K2 backtest deposits; nothing in this lane writes derived numbers back to Postgres.

Ground truth for the substrate shape comes from cc-agent-C's Wave 1 F0 close ([`2026-06-21_legacy-design-tools_cc-agent-C_wave1-verify-and-read-apis.md`](2026-06-21_legacy-design-tools_cc-agent-C_wave1-verify-and-read-apis.md)) and cc-agent-AC's read-contract type ([`2026-06-21_hauska-atom-contract_cc-agent-AC_wave1-read-contract-type.md`](2026-06-21_hauska-atom-contract_cc-agent-AC_wave1-read-contract-type.md)). The c2 clone today has Phase-1 adjudication evidence ledger routes but **lacks** `lib/engine-core`, migration `0037`, outcome capture, and calibration overlay — those live on the main clone and are cc-agent-C's deposit-loop territory.

---

## Cortex-api topology (where hooks live)

cortex-api = `artifacts/api-server/` in legacy-design-tools. C2 adds **new read-only modules** under a disjoint package; C owns all write/deposit paths.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  WRITE PATH (cc-agent-C — main clone, DO NOT TOUCH from C2)             │
│  findings.ts accept/reject/override → atom_events (F3 stamps)           │
│  findingOutcomeObservation.ts → finding.outcome.recorded (X2 live)     │
│  K2 retrodiction harness → same ledger, provenance=backtest (future)    │
│  warming / reasoning_atoms UPSERT (W1–W5)                               │
│  POST /findings/calibration/recompute → atom_calibration_overlay (legacy)│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼  read-only joins
┌─────────────────────────────────────────────────────────────────────────┐
│  READ PATH (cc-agent-C2 — c2 clone, NEW)                                │
│  lib/calibration-engines/                                               │
│    raw-events/          ← F3 ledger + K2 deposits                         │
│    outcome-deconfound/  ← K3                                            │
│    weak-priors/         ← K5                                            │
│    grader/              ← S1                                            │
│    meta-calibration/    ← S2                                            │
│    model-weighting/     ← S3                                            │
│  artifacts/api-server/src/routes/calibrationEngines.ts (internal only)  │
│  artifacts/api-server/src/lib/calibrationEngineAdapter.ts (thin wire)   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼  feeds (post-F4 propagation)
┌─────────────────────────────────────────────────────────────────────────┐
│  READ-CONTRACT ASSEMBLY (cc-agent-AC type + cc-agent-C F9 wire)         │
│  assembleReadContract() → ThreeAxisConfidence + modelAttribution        │
│  C2 supplies calibratedConfidence axis derivation only                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Existing substrate hooks C2 reads (does not own)

| Location | Role today | C2 use |
|---|---|---|
| `atom_events` + `findings.citations[].atomId` | Phase-1 adjudication join (`lib/engine-core/src/signals.ts` pattern on main; `artifacts/api-server/src/lib/atomAdjudicationEvidenceLedger.ts` on c2) | Primary F3 raw-event source |
| `findings.confidence` | LLM-stated confidence on finding row | **Input feature only** — never the calibration anchor |
| `finding.accepted` / `finding.rejected` / `finding.overridden` | Adjudication events | Inter-adjudicator agreement + grader fuel (with actor.id) |
| `finding.outcome.recorded` (main only today) | Phase-2 outcome capture (`findingOutcomeObservation.ts`) | Ground-truth anchor for S1/S3; K2 backtest uses same event shape with `provenance: backtest` in payload once F3 rich ledger lands |
| `GET /findings/adjudication-evidence` | Tier-1a derived projection | Health/debug only; engines re-derive from raw events |
| `GET /findings/outcome-observations` | Outcome listing (main) | K3 de-confound input scan |
| `GET /findings/calibration-overlay` | Materialized overlay (main, legacy) | **Deprecated target** — see gap contradictions; C2 supersedes at read time post-M1 |
| `reasoning_atoms` / `code_atoms` + citations | Atom context, asserted baseline | Source-quality axis + model-attribution join keys |
| F5 raw-conflict log (future, C) | Disagreeing inputs + provenance + vintage | K5 weak-prior cross-source signal |
| F8 amendment hazard (cc-agent-E, hauska-engine) | Code-amendment atoms → hazard rate | S2 active-learning rank input |
| F1 per-atom read attribution (future) | Retrieval/MCP logs at atom grain | S2 value-of-information routing |
| F2 consequence metadata (future, E) | ASCE 7 / IBC on code atoms | S2/S3 stratum conditioning |
| `@hauska/atom-contract/read-contract` | WidthedConfidence + provenance enum | Output contract for all engines |

---

## Hook map — K3 Historical-outcome de-confounding

**Task:** K3 · **Owner:** cc-agent-C2 · **Depends:** K2 retrodiction deposits

### Where in cortex-api

| Hook | Path (new on c2) | Type |
|---|---|---|
| De-confound filter | `lib/calibration-engines/outcome-deconfound/filter.ts` | Pure function |
| Outcome label resolver | `lib/calibration-engines/outcome-deconfound/labels.ts` | Pure function |
| Pipeline seam | `lib/calibration-engines/raw-events/collect.ts` → calls filter before any grader | Read pipeline |
| Internal debug route | `GET /findings/calibration/outcome-labels` | Internal audience only |

### Raw signals read (never stored)

| Source | Fields | Notes |
|---|---|---|
| K2 backtest deposits | `atom_events.payload.outcomeKind`, `payload.provenance` (= `backtest`), `payload.historicalCaseId`, permit-record metadata stamps from K1/K2 | Primary pre-client fuel |
| X2 live outcomes | Same event type, `provenance: live` | Post–tenant-leg fuel |
| K1 acquisition metadata | Variance/condition flags on public-record rows (joined by `historicalCaseId` or subject key) | Distinguishes clean vs conditional approval |
| `findings.citations[].atomId` | Cited atoms under test | Join key to atom grain |
| `engagements.cortexJurisdictionKey` | Tenant partition | Sovereignty boundary |

### Derived at read (never stored)

| Output | Description |
|---|---|
| `DeconfoundedOutcomeLabel` | `approved-clean` \| `approved-with-condition` \| `approved-with-variance` \| `denied` \| `unknown` |
| `observedSuccess` (de-confounded) | `1` clean approve · `0.5` conditional/variance · `0` deny · excluded if `unknown` |
| `outcomeStratum` | Tags for Measurement A backtest slices |
| Filtered event stream | Subset passed to S1 grader — **variance-as-clean never reaches grader anchor** |

### Grader anchor rule

K3 is upstream of S1. No de-confounded label enters the grader without explicit outcome stratum. Approved-with-variance is **not** treated as full success.

---

## Hook map — K5 Labeled weak priors

**Task:** K5 · **Owner:** cc-agent-C2 · **Depends:** F5 raw-conflict log

### Where in cortex-api

| Hook | Path (new on c2) | Type |
|---|---|---|
| Cross-source comparer | `lib/calibration-engines/weak-priors/crossSourceAgreement.ts` | Pure function |
| Model-as-judge triage pass | `lib/calibration-engines/weak-priors/modelJudgeTriage.ts` | Pure function — **triage only** |
| Triage queue | `lib/calibration-engines/weak-priors/prioritizeReviewBudget.ts` | Pure function |
| Internal route | `GET /findings/calibration/triage-queue` | Internal; labels every row `provenance: asserted`, never `backtest`/`live`/`seed` |

### Raw signals read (never stored)

| Source | Fields | Notes |
|---|---|---|
| F5 raw-conflict log (future) | Disagreeing input atom ids, provenance, vintage per disagreeing source | Primary conflict signal |
| Engine corpus vs ICC deeplink | Same `codeRef` + edition, different source bodies/versions | Cross-source agreement score |
| D8 vs FEMA hydrology | Adapter layer outputs for same parcel (`lib/adapters`, site-context overlays) | Existing contested-ground pattern |
| Precedence unresolved conflicts | `finding-engine` precedence `conflicts[]` with `competingAtomIds` | From synthesis, not typed enum |
| Consequence stratum (F2) | High-consequence tail weighting for budget | Prioritization weight only |

### Derived at read (never stored)

| Output | Description |
|---|---|
| `WeakPriorTriageScore` | 0–1 priority rank for expert seed budget (K4) |
| `crossSourceAgreementRate` | Agreement fraction across sources on same subject |
| `triageRationale` | Human-readable label: "ICC vs engine corpus disagree on §X" |
| `calibrationProvenance` | **Always `asserted`** on any surface that accidentally exposes this — weak priors are never calibration anchors |

### Circular-trap guard

K5 output **must not** connect to S1 grader anchor inputs. Enforced by module boundary: `weak-priors/` exports only to `triage-queue` route and K4 tooling, not to `grader/`.

---

## Hook map — S1 Grader model

**Task:** S1 · **Owner:** cc-agent-C2 · **Depends:** F3, K2 (then X2), K4 seed agreement

### Where in cortex-api

| Hook | Path (new on c2) | Type |
|---|---|---|
| Adjudicator grader | `lib/calibration-engines/grader/adjudicatorReliability.ts` | Pure function |
| Model grader | `lib/calibration-engines/grader/modelReliability.ts` | Pure function |
| Agreement estimator | `lib/calibration-engines/grader/interAdjudicatorAgreement.ts` | Pure function |
| Read-contract feed | `lib/calibration-engines/grader/toWidthedConfidence.ts` | Maps grader posterior → `WidthedConfidence` |
| Internal route | `GET /findings/calibration/grader` | Per adjudicator / per model / per atom |
| F9 consumption point | Called from future `assembleReadContract()` — **C wires, C2 implements** | Read-time only |

### Raw signals read (never stored)

| Source | Fields | Notes |
|---|---|---|
| F3 rich ledger — adjudication | `event_type`, `actor.id`, `actor.roleAtJudgment` (future F3), `payload.subjectKey`, success/trial counts at finest grain | Reviewer-as-grader |
| F3 rich ledger — outcomes | K3-filtered outcome events | **Only ground-truth anchor** |
| K4 expert seed set | Multiple `actor.id` on same `subjectKey` | Inter-adjudicator agreement seed |
| F3 model-attribution stamp | `modelId`, `modelVersion`, `retrievedAtomSetId`, sampling params | Model-as-grader identity |
| `findings.citations[].atomId` | Atom under test | Grain key |
| Partition keys | `jurisdictionTenant`, `accessPolicy`, `sharedWithTenants` | Sovereignty — same rules as `signals.ts` / I5 |

### Derived at read (never stored)

| Output | Description |
|---|---|
| `adjudicatorReliability(adjudicatorId, stratum)` | Beta posterior or isotonic curve vs de-confounded outcomes |
| `modelReliability(modelId, stratum)` | Same, from attribution stamp × outcome join |
| `interAdjudicatorAgreement(subjectKey)` | Agreement rate on seed/gold items — **not** model self-agreement |
| `graderWeightedObservedRate(atomId, partition)` | Input to calibratedConfidence axis |
| `WidthedConfidence` | `{ estimate, n, intervalWidth, provenance }` where provenance reflects fuel source (`backtest` \| `seed` \| `live`) |

### Anchor discipline (non-negotiable)

| Allowed anchors | Forbidden anchors |
|---|---|
| De-confounded real outcomes (K3 → K2/X2) | LLM `findings.confidence` |
| Inter-adjudicator agreement on expert seed (K4) | Model-grading-model without outcome join |
| Historical backtest ground truth | Cross-source agreement (K5) |
| Live AHJ outcomes (X2, post–tenant leg) | System's own calibrated overlay belief |

---

## Hook map — S2 Meta-calibration and active learning

**Task:** S2 · **Owner:** cc-agent-C2 · **Depends:** S1, F8, F1, F7

### Where in cortex-api

| Hook | Path (new on c2) | Type |
|---|---|---|
| Posterior-at-grain | `lib/calibration-engines/meta-calibration/posteriorAtGrain.ts` | Replaces materialized overlay compute at read |
| Width derivation | `lib/calibration-engines/meta-calibration/intervalWidth.ts` | Feeds read-contract `intervalWidth` |
| Active-learning ranker | `lib/calibration-engines/meta-calibration/activeLearningQueue.ts` | Shares ranking signal with F8 drift |
| Hazard coupling | `lib/calibration-engines/meta-calibration/driftCoupling.ts` | Reads F8 hazard + discrete invalidation |
| Internal routes | `GET /findings/calibration/posterior` · `GET /findings/calibration/active-learning-queue` | Internal |

### Raw signals read (never stored)

| Source | Fields | Notes |
|---|---|---|
| S1 grader outputs | Reliability posteriors (derived, same request) | Parent — not persisted between requests |
| F3 success/trial counts | Finest-grain counts from ledger | Posterior-at-grain input |
| F8 amendment hazard rate | Derived from code-amendment atoms (E) | Cold-start floor + drift rank |
| F7/F8 discrete invalidation | Section-plus-dependents invalidation events | Event-driven validity discount |
| F1 read attribution | Per-atom retrieval frequency | Value-of-information |
| F2 consequence stratum | `routine` / `elevated` / `critical` / `essential` | Tail-aware routing |
| K3 de-confounded stream | Filtered outcomes | Same as S1 |

### Derived at read (never stored)

| Output | Description |
|---|---|
| `posteriorAtGrain(atomId, partition)` | Atom-level if n ≥ MIN_DENSE_SIGNAL, else class-within-partition |
| `intervalWidth` | Credible interval width for `WidthedConfidence` |
| `validityDiscount` | Hazard + event combined staleness factor |
| `activeLearningRank[]` | Ordered `{ atomId, jurisdictionTenant, consequenceStratum, voiScore, driftScore }` |
| `metaCalibrationProvenance` | Propagates underlying fuel (`backtest`/`seed`/`live`) — never upgrades base to live |

---

## Hook map — S3 Earned model weighting

**Task:** S3 · **Owner:** cc-agent-C2 · **Depends:** S1, S2, F3 model-attribution

### Where in cortex-api

| Hook | Path (new on c2) | Type |
|---|---|---|
| Weight derivation | `lib/calibration-engines/model-weighting/deriveWeights.ts` | Pure function |
| Stratum router | `lib/calibration-engines/model-weighting/consequenceStratumWeights.ts` | Pairs with S5 (R owns routing wire) |
| Internal route | `GET /findings/calibration/model-weights` | Internal |
| Synthesis consumption | Called at model-selection time in finding-engine / plan-review path | **R + C wire; C2 computes** |

### Raw signals read (never stored)

| Source | Fields | Notes |
|---|---|---|
| F3 model-attribution stamp | Full stamp on each synthesis deposit | Join key model → outcome |
| K3 + K2/X2 outcomes | De-confounded success on attributed findings | Earned weight fuel |
| S1 `modelReliability` | Per-model posterior | Grader problem inheritance |
| S2 posterior + width | Uncertainty on model stratum | Down-weight thin models |
| F2 consequence stratum | High-consequence stratum | Stronger model bias when earned |

### Derived at read (never stored)

| Output | Description |
|---|---|
| `modelWeight(modelId, stratum, partition)` | 0–1 routing weight, normalized within stratum |
| `routingRecommendation` | `{ modelId, weight, provenance, n }` — labeled `asserted` until S3 n threshold met |
| `weightRationale` | Outcome-joined count backing the weight |

S5 (cc-agent-R) ships consequence-gated routing with **asserted** labels first; S3 replaces labels with earned weights when fuel exists — same route, different derivation call.

---

## Collision-avoidance plan vs cc-agent-C

### Clone and branch discipline

| Agent | Clone | Branch policy |
|---|---|---|
| cc-agent-C | `legacy-design-tools` (main) | Deposit loop, warming, K2, F3/F5/F9 writes, overlay recompute |
| cc-agent-C2 | `legacy-design-tools-c2` | **This hook map only** — new `lib/calibration-engines/**` + internal routes |

Never commit C2 engine code to main clone without explicit merge/reconcile. Never commit C deposit-loop changes to c2 clone.

### Disjoint file sets

**C2 may create/modify (c2 clone only):**

```
lib/calibration-engines/**
artifacts/api-server/src/routes/calibrationEngines.ts
artifacts/api-server/src/lib/calibrationEngineAdapter.ts
artifacts/api-server/src/__tests__/calibration-engines/**
```

**C2 must not touch:**

```
lib/engine-core/**                          # C — overlay recompute, signals, compute
artifacts/api-server/src/routes/findings.ts # C — F9, adjudication writes
artifacts/api-server/src/lib/findingOutcomeObservation.ts
artifacts/api-server/src/routes/findingOutcomes.ts
artifacts/api-server/src/routes/findingsCalibrationOverlay.ts
lib/codes/src/reasoningAtoms/**             # C — warming UPSERT
W1–W5 warming harness paths
K2 retrodiction harness (future, C)
lib/db/drizzle/*                            # schema migrations — C or planner only
```

**Shared read contract (stable join, no write):**

C2 imports `@workspace/db` tables read-only and mirrors the join pattern in `atomAdjudicationEvidenceLedger.ts` / `signals.ts`. When F3 adds payload fields, C2 reads them without changing write paths.

### Integration seam (merge-time)

1. C lands F3 rich stamps on main → C2 rebases c2 clone → engines read new fields.
2. C lands K2 backtest deposits → same event type + `provenance: backtest` in payload.
3. AC publishes `@hauska/atom-contract@1.4.0` → C2 depends on read-contract types for output.
4. C lands F9 `assembleReadContract()` → imports `@workspace/calibration-engines` (package extracted from c2 at merge) for calibratedConfidence axis only.
5. Until merge, C2 internal routes prove derivation against fixture DB; no production recompute POST.

### Runtime isolation

C2 engines are **pure functions + read queries**. No background jobs, no UPSERT, no `POST /findings/calibration/recompute` changes. C's warming cascade and overlay recompute continue unchanged on main during Wave 2–3.

---

## Contradictions of `03_gap_analysis.md`

F0 verify (cc-agent-C, 2026-06-21) supersedes several gap rows. Contradictions and corrections:

| Gap row / claim | Ground truth (2026-06-21) | Impact on C2 hook map |
|---|---|---|
| **F3 PARTIAL** — "Phase 1 evidence ledger exists" | Confirmed. Missing model-attribution, role-at-judgment, source-event-type, finest-grain counts. | C2 engines must tolerate absent F3 fields in Wave 2; gate S1 build on F3 completion. |
| **F4 GAP** — scalar confidence | Confirmed. `EngineEnvelope { value, kind }` on main; AC read-contract type drafted locally. | C2 outputs `WidthedConfidence`, not overlay row shape. |
| **F6 PARTIAL** — split exists, no severity axis | Confirmed at DB; no three-axis wire. | S2/S3 stratum conditioning blocked on F2. |
| **S1–S5 "GAP, deferred"** — "Calibration overlay (0037) exists as substrate; no grader…" | **Partially stale.** Main has full Phase-3 overlay + `lib/engine-core` (`a431e8e` per 04a). c2 clone **lacks** engine-core entirely. | C2 lane is net-new **read-time** engines that supersede overlay materialization per keystone principle — not greenfield from zero signal. |
| **K1–K6 all NEW** | Phase-2 outcome capture exists on **main** (`finding.outcome.recorded`); K2 backtest harness still NEW. | K3/S1 read live outcome shape now; backtest provenance tag is K2 add-on. |
| **F9 GAP** — LLM confidence still displayed | Confirmed. | F9 wires C2 grader output through read-contract; C owns route, C2 owns derivation. |
| **F5 GAP** — conflict not logged | Confirmed. | K5 blocked until F5 lands. |
| **Keystone vs overlay** — gap silent | **Direct contradiction.** `atom_calibration_overlay` stores `calibrated_confidence`, `signal_count` (migration 0037). Architecture addendum bans persisting derived numbers. | C2 design explicitly **derive-at-read**; overlay recompute is legacy bootstrap until M1 go, then read-contract assembly replaces displayed path. |
| **S1 naming collision** — gap "S1 grader" vs finding-engine "S1 precedence wire" | Different tasks, same label. | C2 S1 = grader model. Precedence S1 = cc-agent-C2 R5 lane in finding-engine — disjoint code paths. |
| **"Two weeks stale"** | F0 close ran 2026-06-21. | This close is the C2-side F0 for engine hooks. |

---

## Proposed Wave 2 / Wave 3 build order (C2 lane)

Waves follow [`06_agent_execution_model.md`](../_calibrated_spine_roadmap/06_agent_execution_model.md). C2 builds nothing in Wave 1. Dependencies named explicitly.

### Wave 2 — C2 prep only (parallel with C schema/warming; no S-track)

| Step | Task | Depends on | Deliverable |
|---|---|---|---|
| 2-C2-0 | Scaffold `lib/calibration-engines/` package + test fixtures | F0 verify (done) | Empty package, CI compiles on c2 clone |
| 2-C2-1 | `raw-events/collect.ts` read F3 ledger join | F3 rich stamps (C) | Raw event collector with fixture tests |

**Blocked in Wave 2:** K3, K5, S1, S2, S3 implementation.

### Wave 3 — Base calibration + measurement gate (C2 primary build)

| Step | Task | Depends on | Deliverable |
|---|---|---|---|
| 3-C2-1 | **K3** outcome de-confounding | K2 deposits (C), F3 | `outcome-deconfound/` + `GET …/outcome-labels` |
| 3-C2-2 | **K5** weak priors triage | F5 conflict log (C), F2 optional | `weak-priors/` + `GET …/triage-queue` |
| 3-C2-3 | Wire K3 filter into raw-events pipeline | 3-C2-1 | De-confounded stream consumed by downstream |
| — | **K6** calibration provenance on read-contract | F4 propagation (AC + C) | AC + C — C2 sets `provenance` field correctly on derived outputs |
| — | **M1** Measurement A/B | F1, F2, F3, F7, K2 + K3 | cc-agent-C + planner — **go/rework gate** |

**Parallel (not C2):** K4 expert seed (planner + experts), K2 retrodiction (C).

### Wave 4 — Model tier (after M1 go; backtest fuel first, then live)

| Step | Task | Depends on | Deliverable |
|---|---|---|---|
| 4-C2-1 | **S1** grader model | F3, K2, K3, K4 seed agreement, M1 go | `grader/` + read-contract calibratedConfidence feed |
| 4-C2-2 | **S2** meta-calibration + active learning | S1, F8 (E), F1, F7 | `meta-calibration/` + posterior + AL queue routes |
| 4-C2-3 | **S3** earned model weighting | S1, S2, F3 attribution, X2 live (optional enrich) | `model-weighting/` + S5 consumption contract |

**Not C2:** S4 actuation-refusal (C), S5 routing wire (R), X1–X3 fuel (C).

### Dependency graph (C2 lane only)

```
F3 (C) ──┬──► K3 ──► S1 ──► S2 ──► S3
K2 (C) ──┘      │
F5 (C) ──► K5   K4 (experts) ──► S1
F8 (E) ───────────────► S2
F1 (M+C) ─────────────► S2
F4/K6 (AC+C) ──► all read-contract outputs
M1 go ──► S1/S2/S3 resourced
X2 (C) ──► S1/S3 live-fuel enrichment (post Wave 4 start)
```

---

## Verified this wave

| Check | Result |
|---|---|
| Read roadmap docs 00, 01, 02, 04, 06 | Done |
| Read `03_gap_analysis.md` + cc-agent-C F0 close | Done |
| Inspected c2 clone: no `lib/engine-core`, no overlay routes, Phase-1 ledger present | Confirmed on `cortex/precedence-taxonomy-intra-federal` @ `db3719a` |
| Inspected main clone substrate: `signals.ts`, `overlay.ts`, `findingsCalibrationOverlay.ts`, outcome capture | Confirmed (read-only recon) |
| **Build** | **None — design only per dispatch** |

---

## Blocked on / unblocked

**Unblocked:** Wave 3 K3/K5 design is dispatch-ready; S1/S2/S3 hook points named; collision boundaries with cc-agent-C are explicit.

**Blocked on:**

- F3 rich raw ledger stamps (C) — S1 and raw-events collector
- F5 raw-conflict log (C) — K5
- K2 retrodiction deposits (C) — K3 primary fuel
- F4 read-contract propagation (AC + C) — production emission of derived outputs
- M1 go signal — S-track resourcing
- F8 hazard rate (E) — S2 drift coupling
