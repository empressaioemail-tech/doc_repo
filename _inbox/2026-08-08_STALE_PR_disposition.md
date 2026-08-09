---
title: Stale open PR disposition — four-program review
date: 2026-08-08
status: recommendation (planner executes)
author: disposition analyst (read-only session)
repos: [empressaioemail-tech/hauska-engine, empressaioemail-tech/legacy-design-tools]
main_shas: [hauska-engine 4bfff71, legacy-design-tools 85f3c370]
---

# Stale open PR disposition

Four PRs from pre-pivot programs, reviewed 2026-08-08 against standing decisions and live `origin/main`. This document recommends; the master planner decides and executes.

Standing decisions applied:

- `_decisions/2026-08-01_scale_before_new_layers_sequencing.md` — scale certified assembly layers first; statewide-uniform layers (including OZ) ride as a cheap parallel track; per-jurisdiction assembly layers and competitive-gap exceptions are deferred.
- `_decisions/2026-08-08_layer_first_statewide_fabric_sequence.md` — jurisdiction-first replaced by layer-first (L0–L5); bulk statewide uniform layers before jurisdiction backfill.
- `_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md` — Geometry Law (txgio serving ring, RAW ring measurement, write-then-verify, predicate == plain geometry).
- `90_operations/QUEUE_parked_work_index.md` — W3 RRC / PR #90 explicitly HELD; T3 rule: RRC pipelines NEVER mint `utility-easement` atoms.

---

## hauska-engine #90 — feat(c6): Reeves County O&G mint

**Branch:** `feat/c6-reeves-mint` | **Last updated:** 2026-07-08 | **4 commits, 19 files (+2921 / −78)**

### 1. What does it actually do?

Adds a new `packages/og-mint` pipeline (acquire → normalize → report → twin-export) plus committed artifacts and a 20-test eval suite. It mints **Reeves County (FIPS 389) O&G atoms** from RRC sources:

| Atom family | Source | PR head state |
|---|---|---|
| `entityType: "well"` | RRC W-1 drilling permits | 47 honest atoms in final C6c round (20 wells + 27 production-timeseries in sample); branch tip commit claims full Struts pagination solved (3,887 rows / 2,696 distinct permits) in `packages/og-sources/src/adapters/rrc-w1/client.ts` |
| `entityType: "production-timeseries"` | PDQ/H-10 **fixture samples** only | 27 fixture atoms (not live county coverage) |

Key implementation surfaces (from diff):

- `packages/og-mint/src/normalize.ts` — `WELL_SCHEMA.parse`, `accessPolicy: "platform-internal"`, county-segment invariant on API-14 (`389`), refuses records without API number; uses **county centroid** `(31.4018, -103.8447)` when W-1 index grain lacks coordinates.
- `packages/og-sources/src/adapters/rrc-w1/client.ts` — branch adds Struts pager loop (`pager.pageSize`, `pager.offset`, GET page template); **main at `4bfff71` lacks this loop** (banner regex only, no multi-page fetch).
- Artifacts: `reeves-mint-report.md`, `reeves-atom-sample.ndjson`, `twin-export.json`; task files `.pr-body.md`, `CURSOR_TASK_FIX.md` also committed (hygiene debt).

Does **not** mint `utility-easement`, pipeline encumbrance, or any easement atom family — only `well` and `production-timeseries` per diff and sample NDJSON lines.

### 2. Merge cleanly?

| Signal | Value |
|---|---|
| GitHub `mergeable` | **MERGEABLE** |
| GitHub `mergeStateStatus` | **UNSTABLE** (checks/status, not conflict-free guarantee on rebase) |
| Divergence vs `4bfff71` | **4 commits ahead, 282 commits behind**, status `diverged` |
| `packages/og-mint` on main | **404 — package does not exist** |

GitHub reports mergeable today, but the branch is **282 commits stale**. A rebase onto current main will touch `pnpm-lock.yaml`, CI workflow (main added Python worker steps PR branch predates), and any shared `og-sources` paths. Expect **manual rebase conflict surface** in:

- `packages/og-sources/src/adapters/rrc-w1/client.ts` (main client is 10,967 bytes; branch rewrites pagination — high overlap risk)
- `pnpm-lock.yaml`
- `.github/workflows/ci.yml` (merge-tree preview shows main added Python/DXF/IFC/hydrology CI steps absent on branch base)

Treat as **rebase-heavy**, not click-merge safe.

### 3. Is the premise still valid?

**No — strategically parked, not queue-ready.**

- `QUEUE_parked_work_index.md:46` — W3 RRC layer **HELD** by 2026-08-01 scale-before-new-layers ruling; PR #90 stays parked; **no competitive-gap exception granted**.
- Same ruling (`2026-08-01`:17–19) — new layers that are not the certified assembly mold wait; O&G mint is a **new vertical corpus**, not parcel/zoning/buildable scale.
- `2026-08-08_layer_first_statewide_fabric_sequence.md` — program pivot to layer-first fabric (parcels, roads, topo, FEMA bulk, etc.); Reeves O&G mint does not advance the active L0–L5 sequence.
- `_inbox/2026-08-08_lightbox_gap_closure_spec.md:150` — explicitly: "Engine PR #90 stays parked… Collapsing these is how an O&G vertical revival eats a Smart Site sprint."

The **W-1 client pagination fix** on the branch tip is technically valuable and **not present on main** (verified: main client has `searchArgs.*` form posts and pager banner regex; branch adds Struts `pager.pageSize`/`pager.offset` loop). That salvage is separate from merging the full mint PR.

### 4. Standing-decision violations?

| Rule | Verdict |
|---|---|
| RRC / utility-easement separation (`QUEUE:46`, LightBox spec W3) | **PASS** — no `utility-easement` atoms; well + production-timeseries only |
| Scale-before-new-layers | **FAIL (strategic)** — W3 explicitly HELD |
| Geometry Law | **N/A** — no envelope geometry |
| Honest reporting | **PARTIAL** — C6c improved over C6b fabrication, but county-centroid `surfaceLocation` and default `wellType: "oil"` are documented approximations, not source coordinates |

### 5. Cost: revive vs rebuild vs close

| Path | Cost | Yield |
|---|---|---|
| **Merge as-is** | High rebase (282 behind) + UNSTABLE CI + merges task junk (`.pr-body.md`, `CURSOR_TASK_FIX.md`) + platform-internal corpus with fixture PDQ/H-10 | Activates parked W3 without operator override — **wrong** |
| **Revive (cherry-pick W-1 client only)** | Low–medium: one focused PR on `rrc-w1/client.ts` + tests, no `og-mint` package | Preserves pagination work for future W3 dispatch |
| **Close** | Minimal | Clears ambient uncertainty; pagination preserved in branch history for cherry-pick |

### 6. RECOMMENDATION: **CLOSE**

Close PR #90. **Salvage:** cherry-pick or rewrite-from-diff the Struts pagination block from branch tip `72e0638` into a **new scoped dispatch** slotted under W3 when `QUEUE_parked_work_index.md:46` trigger fires (holistic process review or explicit operator override). Do not merge `packages/og-mint`, artifacts, or task markdown.

**If planner revives W3 later, verification gate:** W-1 live fetch ≥3,000 Reeves permits; zero `(0,0)` coords; no `utility-easement` atom type; `accessPolicy` per ADR-025 (`public-free` for RRC streams per LightBox spec W3, not `platform-internal` as minted here); eval non-vacuous on live data.

---

## hauska-engine #75 — Calibrated-spine wave-2 + arch-audit: corpus re-mint

**Branch:** `feat/calibrated-spine-wave-2` | **Last updated:** 2026-06-22 | **1 commit, 24 files (+1549 / −86)**

### 1. What does it actually do?

Single commit `159f1abb` from the June 2026 calibrated-spine program:

- Adds **`packages/corpus/src/conformance/`** module (`mint.ts`, tests, scripts `audit-snapshot-conformance.mjs`, `remint-snapshot-conformance.ts`) to re-mint corpus snapshot atoms as born-conformant to atom-contract schemas.
- Bumps **`packages/atom-contract-pin`** toward `@hauska/atom-contract ^1.5.0` (legacy package name) with new export map entries (`./conformance`, `./read-contract`, etc.).
- Modifies **`packages/adapters/src/national/cotalityClient.ts`** (+194 lines) — OAuth URL split (`api1.cotality.com` vs `api.cotality.com`), HTTP Basic auth path, token handling changes; test updates in `cotalityAdapters.test.ts`, `cotalityFullDataLayer.test.ts`.
- Adds engine-repo **`_inbox/` session close markdown** (wrong repo placement).
- Adds deploy scripts: `scripts/cloudbuild-engine-api.yaml`, `scripts/deploy-engine-api.ps1`, `scripts/sync-cotality-secrets.ps1`.
- Touches `services/retrieval-api/corpus/snapshot.json` (+1/−1).

**Main at `4bfff71`:** `packages/corpus/src/conformance/` → **404 (does not exist)**. Atom-contract pin → `@empressaio/atom-contract ^1.11.0` (not 1.5.0).

### 2. Merge cleanly?

| Signal | Value |
|---|---|
| GitHub `mergeable` | **CONFLICTING** |
| GitHub `mergeStateStatus` | **DIRTY** |
| Divergence vs `4bfff71` | **1 commit ahead, ~282 commits behind** (compare to PR head SHA) |

Expected conflict surface (high confidence from overlapping paths):

- `packages/atom-contract-pin/package.json` / `package-lock.json` — PR pins legacy `@hauska/atom-contract@1.5.0`; main pins `@empressaio/atom-contract@^1.11.0`
- `packages/atoms/src/instances.ts`, `packages/corpus/src/atomization/index.ts`
- `pnpm-lock.yaml`
- `packages/adapters/src/national/cotalityClient.ts` — main has evolved Cotality-decommission posture; PR expands live client

Does **not** merge cleanly without substantial manual resolution.

### 3. Is the premise still valid?

**No — superseded on multiple axes.**

- **Cotality is EXTINGUISHED** (standing decision in `_STATE.md`, `QUEUE_parked_work_index.md:105` orphan Cotality memories). PR's largest adapter delta is Cotality OAuth client hardening — opposite of current direction.
- **Atom contract moved:** PR targets `@hauska/atom-contract@1.5.0`; main is `@empressaio/atom-contract@^1.11.0` — four major versions and a rename later.
- **Corpus conformance module never landed** on main; corpus maintenance has since run through other paths (34 jurisdictions / 21k+ atoms per recon; ongoing county onboarding). A June re-mint against 1.5.0 schemas is not the current conformance story (Geometry Law conformance suite on engine main post-envelope saga).
- Calibrated-spine wave-2 was a **June 2026 program**; August pivot is layer-first fabric + Bastrop envelope re-warm through `bde34ed` pipeline (`2026-08-07`:34–35).

### 4. Standing-decision violations?

| Rule | Verdict |
|---|---|
| Cotality extinguished | **FAIL** — PR extends Cotality client and adds `sync-cotality-secrets.ps1` |
| Geometry Law | **N/A** |
| RRC/easement | **N/A** |

### 5. Cost: revive vs rebuild vs close

| Path | Cost | Yield |
|---|---|---|
| **Revive/rebase** | High — resolve conflicts across contract pin, adapters, corpus; then strip Cotality; re-validate against 1.11.0 schemas | Mostly obsolete intent |
| **Rebuild conformance remint** | Medium — if still needed, new dispatch against `@empressaio/atom-contract@^1.11.0` with current snapshot path | Correct approach if corpus drift is real |
| **Close** | Minimal | Removes zombie PR; no unique capability that main lacks except ideas in `conformance/mint.ts` |

### 6. RECOMMENDATION: **CLOSE**

Close PR #75. **Salvage (optional, low priority):** read `packages/corpus/src/conformance/mint.ts` from branch as a design reference if a corpus conformance remint is re-requested; do not rebase this PR. Queue row: none — superseded by current contract pin and Cotality retirement.

---

## legacy-design-tools #319 — feat(warm-up): Tier-2 node facets

**Branch:** `feat/node-facet-bake-tier2` | **Last updated:** 2026-07-21 | **1 commit, 4 files (+1629)**

### 1. What does it actually do?

Adds Tier-2 of the **node-facet bake** warm-up path (4 new files, ~1,628 lines):

| File | Role |
|---|---|
| `artifacts/api-server/src/lib/nodeFacetBakeTier2.ts` | Core: `computeTier2Envelope()` calls **`deriveBuildableEnvelope`** from `./buildableEnvelope/derive` with OSM road candidates for front-edge labeling; FEMA NFHL point query per node; separate adapter key `node-facets:tier2` with monotonic promote guard |
| `artifacts/api-server/src/nodeFacetBakeTier2Cli.ts` | County bake CLI: tile-batched road fetch (0.001° grid) + FEMA tiles (0.005° grid); bounded concurrency; `--skip-roads` / `--skip-fema` flags |
| `artifacts/api-server/src/nodeFacetBakeTier2.test.ts` | 14 tests: road signal upgrade, honest degradation to point/shape, FEMA SFHA/outside/unavailable, monotonic guard |

PR body documents measured rates: FEMA ~12 nodes/sec (feasible); **OSM roads ~0.1 nodes/sec with 100% Overpass 504** in Bastrop sample — road leg not bakeable on public Overpass.

Builds on Tier-1 (`nodeFacetBakeTier1`), which on **main** returns `status: "declined"`, `declineReason: "atom_path_pending"` — anti-zombie (`nodeFacetBakeTier1.ts` on main, corroborated by `90_operations/FINDING_2026-08-03_factory_product_setback_disconnect.md:16`).

### 2. Merge cleanly?

| Signal | Value |
|---|---|
| GitHub `mergeable` | **CONFLICTING** |
| GitHub `mergeStateStatus` | **DIRTY** |
| Divergence vs `85f3c370` | **1 commit ahead, 100 commits behind** |

All four files are **additions** — conflicts will come from import paths / shared modules (`buildableEnvelope/derive`, `roads.ts`, package.json scripts) that main has moved in 100 commits. Merge-tree preview against shallow main clone showed drift in `.github/workflows/cloud-run-deploy.yml`, `Dockerfile`, deploy env vars (OVERPASS_URL, VPC connector) — branch base predates PE paywall / deploy hardening on main.

### 3. Is the premise still valid?

**No — superseded by Geometry Law + layer-first + anti-zombie factory posture.**

- **Geometry Law** (`2026-08-07`:19–27) — envelopes must be built FROM txgio serving ring, write-then-verify, predicate == plain geometry. This PR re-derives envelopes via **`deriveBuildableEnvelope`** in the api-server bake path — the same pre-saga kernel the envelope saga replaced on engine main (#266–#275 chain cited in decision record).
- **Anti-zombie** — Tier-1 on main explicitly refuses to author envelope confidence (`atom_path_pending`). Tier-2 re-introduces envelope authoring via bake — contradicts factory disconnect finding.
- **Layer-first** (`2026-08-08`:63–65) — FEMA NFHL should become **bulk statewide L4**, not per-node point-query facet bake. Roads are **L3 statewide twins**, not per-parcel Overpass during warm.
- PR's own feasibility verdict: road upgrade blocked without private Overpass — aligns with layer-first L3 road acquisition, not this CLI.

### 4. Standing-decision violations?

| Rule | Verdict |
|---|---|
| Geometry Law | **FAIL** — bake-path envelope re-derive via legacy `deriveBuildableEnvelope`, not txgio ring + write-then-verify pipeline |
| Layer-first sequence | **FAIL** — per-node warm contradicts bulk L3/L4 fabric |
| Honest degradation | **PASS in intent** (PR degrades road failures to point/shape; FEMA unavailable honest) — insufficient to override Geometry Law |

### 5. Cost: revive vs rebuild vs close

| Path | Cost | Yield |
|---|---|---|
| **Revive/rebase + Geometry Law retrofit** | Very high — rebase 100 commits, rewire envelope leg to engine atom-chain path, replace bake model with bulk L4 | Cheaper to greenfield L4 FEMA bulk per layer-first |
| **Revive FEMA-only leg** | Medium — still wrong architecture (node facets vs statewide layer) | Partial; tile-batch pattern is the only salvage |
| **Close** | Minimal | Clears zombie; pattern notes filed below |

### 6. RECOMMENDATION: **CLOSE**

Close PR #319. **Salvage to queue:** FEMA tile amortization pattern (`0.005°` grid, cache-first, honest `unavailable` / `outside-sfha`) → reference for **L4 FEMA bulk ingest** dispatch under `2026-08-08_layer_first_statewide_fabric_sequence.md` L4. Do **not** salvage road-based envelope upgrade or `node-facets:tier2` storage model.

---

## legacy-design-tools #276 — feat(oz): refresh OZ layer + oz-deal-crossfilter

**Branch:** `feat/oz-crossfilter-derivation` | **Last updated:** 2026-07-17 | **6 commits, 7 files (+3523 / −142)**

### 1. What does it actually do?

Started as "amazing map" executor sub-track; **scope expanded across 6 commits** on one branch:

| Commit phase | What landed |
|---|---|
| A–B (OZ core) | Replace synthetic single-feature `oz-1.0.geojson` (638 bytes on main) with **68 real CDFI/HUD tracts** (Central TX wedge, ~0.7MB); add `opportunityZoneAdapter.ts` coverage envelope helpers; **`deriveOzDealCrossfilter(bbox)`** — deterministic OZ designation membership, no fabricated `dealScore`/`radarTier` |
| Adversarial fix | Out-of-scope viewports → `degraded:true` (coverage honesty); national count 8765 vs canonical 8764 noted |
| C–E (scope creep) | **`deriveBuildableEnvelope`** — parcel + zoning + code corpus; **`centroid-inset-approximation`** for setback (explicitly NOT true polygon offset; "floor not exact") |
| D | **`deriveConstraintDensity`** — FEMA/SSURGO/aquifer/MUD stack |
| E | **`deriveMotivatedSellerHeat`** — public-record weighted sum (absentee only live; other signals `not-evaluated-pending-ingest`) |

Main still serves **638-byte synthetic OZ fixture** and has a simpler `opportunityZoneAdapter.ts` (lookup only, no coverage envelope / crossfilter derivation).

### 2. Merge cleanly?

| Signal | Value |
|---|---|
| GitHub `mergeable` | **MERGEABLE** |
| GitHub `mergeStateStatus` | **UNSTABLE** |
| Divergence vs `85f3c370` | **6 commits ahead, 146 commits behind** |

GitHub reports mergeable, but **146 commits stale**. High conflict risk in:

- `artifacts/api-server/src/lib/brokerageGisCompositeLayers.ts` (+2,214 lines on branch vs evolved main)
- `brokerageMapData.ts` (async routing changes)
- Deploy workflow / env vars (merge-tree preview: OVERPASS_URL, VPC connector, PE secrets differ)

Large geojson replacement may merge cleanly; composite layer file will not.

### 3. Is the premise still valid?

**Split — OZ yes; composite map derivations no.**

**Still valid (OZ portion):**

- `2026-08-01_scale_before_new_layers_sequencing.md:18` — OZ listed as **statewide-uniform cheap parallel track** ("wire-one-source job like the OZ layer").
- `2026-08-08_layer_first_statewide_fabric_sequence.md` L4 — uniform federal/state layers include items wireable like OZ.
- Main still has **synthetic OZ fixture** — real-data refresh is unpaid technical debt.

**Superseded / invalid (commits C–E):**

- **`deriveBuildableEnvelope` with centroid-inset** — violates Geometry Law (product envelopes come from engine txgio ring + half-plane offset core on main, not api-server centroid inset). Diff explicitly: `kind: "centroid-inset-approximation"`, `BUILDABLE_METHOD_NOTE` admits no true polygon buffer.
- **"Amazing map" composite program** — predates Smart Site GTM, layer-first fabric, and envelope saga close; motivated-seller / constraint-density are Radar/brokerage surfaces, not current factory priority.
- **Cotality references in buildable path** — diff routes parcel lookup through county-GIS/Cotality paths; Cotality extinguished.

### 4. Standing-decision violations?

| Rule | Verdict |
|---|---|
| Geometry Law | **FAIL** on `deriveBuildableEnvelope` (centroid-inset, not txgio ring / write-then-verify) |
| Scale-before-new-layers | **PASS** for OZ refresh; **FAIL** for treating composite derivations as merge-ready product work |
| Cotality | **FAIL** on buildable-envelope parcel resolution path |
| RRC/easement | **N/A** |

### 5. Cost: revive vs rebuild vs close

| Path | Cost | Yield |
|---|---|---|
| **Merge whole PR** | High rebase + ships Geometry-Law-violating buildable path + 2,214-line composite file | **Harmful** |
| **Revive OZ-only (commits 1–3)** | Medium — extract ~3 commits / 3 files into fresh branch off `85f3c370`: geojson, adapter coverage helpers, `deriveOzDealCrossfilter` + tests | Delivers parallel-track OZ refresh aligned with L4 |
| **Revive composite layers** | High + wrong architecture | Do not |
| **Close entire PR** | Minimal | Loses OZ work unless cherry-picked |

### 6. RECOMMENDATION: **CLOSE the PR; REVIVE OZ subset as new dispatch**

Close PR #276 as a monolith. **Revive (new PR, not rebase of #276):**

1. Real Central TX `oz-1.0.geojson` fixture + metadata/provenance from commits `e19b979` / `5917d22`.
2. `opportunityZoneAdapter.ts` coverage envelope + out-of-scope honesty.
3. `deriveOzDealCrossfilter` + tests (deterministic confidence, no Cotality propensity).

**Drop from revive:** `deriveBuildableEnvelope`, `deriveConstraintDensity`, `deriveMotivatedSellerHeat`, `brokerageMotivatedSellerSignals.ts`.

**Verification for OZ revive:** `vitest` OZ tests green; bundled fixture 68 tracts / 9 counties; out-of-scope bbox returns `degraded:true`; operator GCS publish job documented (PR body: `scripts/ingest-opportunity-zones.mjs` + GCS publish — not merge blocker).

**Queue row:** parallel cheap track under `2026-08-01` ordering step 3 / layer-first L4 — "OZ statewide fixture refresh (LDT)".

---

## Recommendation summary

| PR | Repo | Last updated | Merge status | Recommendation | Salvage |
|---|---|---|---|---|---|
| **#90** | hauska-engine | 2026-07-08 | MERGEABLE / UNSTABLE; 282 behind | **CLOSE** | Cherry-pick W-1 Struts pagination (`rrc-w1/client.ts`) when W3 unblocks |
| **#75** | hauska-engine | 2026-06-22 | **CONFLICTING** / DIRTY | **CLOSE** | Optional read of `conformance/mint.ts` as design note only |
| **#319** | legacy-design-tools | 2026-07-21 | **CONFLICTING** / DIRTY | **CLOSE** | FEMA tile-batch pattern → L4 bulk spec reference |
| **#276** | legacy-design-tools | 2026-07-17 | MERGEABLE / UNSTABLE; 146 behind | **CLOSE** monolith; **REVIVE OZ-only** as new PR | OZ geojson + adapter + crossfilter (commits A–B + coverage fix); drop buildable/composite commits |

---

## WHAT I COULD NOT DETERMINE

1. **Exact conflict hunk list for MERGEABLE PRs (#90, #276)** — GitHub API reports `mergeable: true`, but local `git merge --no-commit` against shallow clones failed with unrelated histories; did not run a full clone merge simulation. Planner should run `gh pr checkout` + rebase on a throwaway worktree before any merge attempt.

2. **Whether PR #90 branch-tip W-1 pagination (`72e0638`) still passes CI on current main** — UNSTABLE status not decoded to specific failing checks in this session (no check-run name fetch).

3. **Whether any `conformance/` remint logic from #75 was reimplemented elsewhere on main under a different path** — `packages/corpus/src/conformance/` returns 404 on main; grep of main for equivalent module names not performed (would require broader code search in engine repo).

4. **Live production OZ hydration state** — main bundles 638-byte synthetic fixture; unknown whether GCS national OZ set is already hydrated in deployed api-server independent of git fixture (deploy env `BROKERAGE_FEDERAL_DATA_GCS_PREFIX` not probed).

5. **Operator appetite to override W3 HELD for #90** — disposition treats queue row as binding; only operator can grant competitive-gap exception referenced in LightBox spec.

---

*Generated 2026-08-08. Read-only session — no PRs closed, no branches modified, no commits.*
