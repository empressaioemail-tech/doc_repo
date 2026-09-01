---
id: 2026-07-23_phase0_spine_readiness_audit_GATE_A
title: Phase-0 spine-readiness audit (Gate A) — property reasoning substrate
status: active
date: 2026-07-23
last_updated: 2026-07-23
applies_to: hauska-engine, hauska-atom-contract, hauska-mcp-server, legacy-design-tools, property-explorer
related: [2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_atoms_first_central_tx_execution_plan, 2026-07-23_pe_envelope_atom_spine_and_post_map_truth_pickups, 25b_monetization_provenance_storage_stack, _architecture_homes/01_homes_and_topology]
owner: nick
gate: A
gate_a_ruling: option_a_2026-07-23
---

# Phase-0 spine-readiness audit (Gate A)

Read-only. No atom-producing build code. Grades master WDLL items 2.1–2.4 against LIVE state. Planner verification pasted below (I-I).

## Gate A ruling (operator go, 2026-07-23)

Doc_repo planner verified the escalation against live state (disjoint write/read families + StoragePort 404 confirmed independently). **Operator go: Option A.**

- **2.1** graded **PARTIAL-with-escalation-noted** (not a silent pass). Phase 1a (StoragePort, master item 3.1) is a **HARD prerequisite**: not done until it demonstrates durable-write-PLUS-retrieval-serve on one atom family. Phase 1b atom kinds cannot land until 1a clears that bar.
- **2.2** (NET-NEW), **2.3** (spine home), **2.4** (collision freeze) accepted as graded.
- Proceed to Phase 0.5 contract-extension design; stop at Gate B before publishing.
- Do not re-own Overpass; replace the I-2 shim only at Gate C cutover.

## Scorecard

| Item | Grade | One-line |
|---|---|---|
| 2.1 Spine-ready threshold | **PARTIAL-with-escalation-noted** (Option A) | Durable WRITE (document-ingest) and authenticated retrieval READ (code-section) both live, but **disjoint families**. `pg-storage.ts` 404. Cleared to proceed; 3.1 must close the gap before 1b. |
| 2.2 Contract-shape | **PASS (verdict: NET-NEW)** | `@empressaio/atom-contract@1.7.0` has no generic reasoning-chain primitive; Phase 0.5 required. |
| 2.3 Home ruling | **PASS** | ATOM HOME = spine; forbidden cortex deep-author named; write path named; no non-api-server staged-bake exists today. |
| 2.4 PE collision | **PASS** | One owner each: `buildableEnvelope/` = this atom program; Overpass remount = PE closed (#350); I-2 honesty = PE shim shipped, atom replaces at cutover only. |

## 2.1 Spine-ready threshold — PARTIAL-with-escalation-noted (Option A go)

WDLL check: live atom WRITE + retrieval READ for at least one existing atom family, AND gate→spine auth proven with a real call. Plan parenthetical claimed document-ingest qualifies; live audit **denies** that as an end-to-end family (write-only into Postgres; retrieval-api has zero `document_ingest` refs). Operator accepted Option A: proceed with honesty; Phase 1a (3.1) must demonstrate durable-write-PLUS-retrieval-serve before Phase 1b kinds.

### Sub-checks

| Sub | Grade | Evidence summary |
|---|---|---|
| Live WRITE (document-ingest) | PASS | engine-api health `documentIngestStore:"durable"`; `PgDocumentAtomStore` + migration 004 + `POST /v1/document-ingest` on main |
| Retrieval READ same family | FAIL | ZERO matches for document_ingest in `services/retrieval-api` |
| Retrieval READ any family (code-section) | PASS | authenticated `/search` + `/atoms/:did` 200 |
| Gate→spine wiring + auth | PASS (same GCP project) | MCP env points at retrieval + engine; unauth 401; Bearer retrieval 200; MCP health marks retrieval reachability ok |
| `pg-storage.ts` / link-graph StoragePort | ABSENT | file False; `port.ts` still says it "lands with the storage migration sprint"; in-memory StoragePort only |
| Calibration overlay 0037 | EXISTS (cortex Neon, not engine) | `legacy-design-tools/lib/db/drizzle/0037_atom_calibration_overlay.sql` |
| Setback tables | BOTH repos; product = LDT | engine thin (5); LDT Central-TX product tables (20+) |

### Named paths (if program proceeds)

| Role | Path |
|---|---|
| WRITE today | `POST /v1/document-ingest` on `hauska-engine-api` → `PgDocumentAtomStore` → `document_ingest_atoms` (+ GCS CID blobs) |
| READ today (corpus) | `GET /search` + `GET /atoms/:did` on `hauska-retrieval-api` (code-section snapshot corpus) |
| Link-graph owed (Phase 1 / 3.1) | `packages/storage/src/pg-storage.ts` + `atoms` / `atom_links` migration (404 today) |
| Forbidden authoring home | `legacy-design-tools/artifacts/api-server/src/lib/buildableEnvelope/` as the long-term home |

### Live deploy revisions (gcloud describe, 2026-07-23)

```
hauska-engine-api-00057-gic    https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app
hauska-retrieval-api-00010-bif https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app
hauska-mcp-server-map42        https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app
cortex-api-00428-fax           https://cortex-api-tds7av26va-uc.a.run.app
```

### Verbatim live probes (planner-run)

engine-api `/health`:

```json
{"status":"ok","service":"engine-api","adapters":true,"engineCore":true,"envelope":true,"documentIngest":true,"documentIngestStore":"durable","startedAt":"2026-07-22T16:09:28.595Z"}
```

retrieval-api `/health`:

```json
{"status":"ok","service":"retrieval-api","startedAt":"2026-07-21T04:06:02.282Z"}
```

mcp `/health` (truncated; Upstash down → overall degraded; retrieval dependency ok):

```json
{"status":"degraded","service":"hauska-mcp-server","dependencies":{"engine_retrieval_api":{"state":"ok","latency_ms":19,"detail":"HTTP 404"},"cortex_api":{"state":"ok","latency_ms":33},"postgres":{"state":"ok","latency_ms":240},"upstash":{"state":"down","latency_ms":7,"detail":"TypeError: fetch failed"}}}
```

Unauth retrieval search → `{"error":"unauthorized"}` HTTP 401.

Unauth `POST /v1/document-ingest` → `{"error":"gate_front_context_required",...}` HTTP 401.

Auth retrieval search (Bearer = live `RETRIEVAL_API_KEY` from Cloud Run env; key not pasted):

```json
{"results":[{"atomDid":"did:hauska:code-section:bastrop_tx/bastrop-b3-code-april-2025/p4-section-2-3-004/2-3-004","entityType":"code-section","entityId":"bastrop_tx/bastrop-b3-code-april-2025/p4-section-2-3-004/2-3-004","jurisdictionTenant":"bastrop_tx","sectionNumber":"2.3.004","snippet":"2.3.004 ANNUAL ADOPTION OF SCHEDULE OF UNIFORM SUBMITTAL DATES FOR SITE PLANS AND PLACETYPE ZONING CHANGES. 42\nINTRODUCTION 5 of 265\nLOT STRUCTURE DIAGRAM 115\nINTRODUCTION 6 of 265","score":1}],"totalCandidates":1}
```

Auth `GET /atoms/.../2-3-004` returns full code-section atom (`sourceAdapter":"bastrop-b3-pdf"`, `fetchedAt":"2026-05-26T14:55:58.605Z"`).

MCP env wiring (gcloud describe):

```
HAUSKA_BACKEND_URL=https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app
HAUSKA_ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app
LEGACY_BACKEND_URL=https://cortex-api-tds7av26va-uc.a.run.app
```

Note: MCP / retrieval / engine are same GCP project (`hauska-prod-497015`). Cross-GCP hop is MCP→cortex (`legacy-design-tools-prod`). Gate-front on engine-api is enforced (unproxied write 401).

### Fresh main SHAs audited

```
hauska-engine     40028e2 feat(adapters): DEM coverage-honesty for parcel terrain (Layer 0) (#97)
legacy-design-tools ab34b33 fix(property-explorer): durable Overpass mount + absent-zoning honesty (#350)
hauska-atom-contract 25215fd (npm gitHead match) @empressaio/atom-contract@1.7.0
```

File existence on engine main:

```
packages/storage/src/pg-storage.ts -> False
packages/document-ingest/src/pg-atom-store.ts -> True
packages/document-ingest/migrations/004_document_ingest.sql -> True
services/engine-api/src/routes/document-ingest.ts -> True
packages/storage/src/port.ts -> True (mentions ./pg-storage.ts as future)
```

`rg document_ingest|document-ingest|PgDocumentAtomStore services/retrieval-api` → ZERO matches.

### Escalation options (operator must pick)

**Option A — Proceed under narrowed readiness (recommended if operator accepts the gap as Phase-1 work already on the card).** Treat 2.1 as "substrate present enough to host": durable write path exists, retrieval read+auth exists for a corpus family, homes topology holds. The unified property fact→rule→derived link-graph is explicitly Phase 1 item 3.1 (StoragePort). Program shape unchanged. Grade 2.1 as PARTIAL with named gap; do not pretend document-ingest already satisfies retrieval-read.

**Option B — Reshape: build spine atom substrate first.** Before property atom kinds, land `pg-storage.ts` + `atoms`/`atom_links` + retrieval indexing/serving for the new family (and/or bridge document-ingest into retrieval). Atomize PE only after one family has write+retrieval-read end-to-end. Slower; matches the WDLL escalate clause literally ("build the spine atom substrate THEN atomize").

**Option C — Abort / re-home.** Only if operator rejects spine readiness entirely (not supported by evidence — substrate pieces exist; they are disconnected).

Planner recommendation: **Option A**, because the master WDLL already sequences StoragePort as 3.1 under the operator's full-chain ruling, and the fan correctly found the substrate "largely present." The escalate fires because the parenthetical "document-ingest qualifies" overclaimed end-to-end; the fix is honesty in the grade, not a program rewrite. Operator must still say go — this is not planner self-approve.

---

## 2.2 Contract-shape — PASS (NET-NEW → Phase 0.5)

Live: `npm view @empressaio/atom-contract version` → `1.7.0`; `gitHead` `25215fdd304f465652a7f10428ac3204f7c63004` matches local `origin/main`.

Verdict: **NET-NEW** generic derived-atom reasoning chain (multi input-atom refs + composed confidence). Fan reconfirmed:

- `AtomComposition` is a **render** parent-child edge (`childEntityType` / `childMode` / `dataKey`), not a reasoning edge.
- `consequence` axis is ASCE7/IBC life-safety-shaped (`Asce7RiskCategory`, strata routine|elevated|critical|essential).
- Adopt-don't-invent idiom exists on O&G `production-timeseries`: `derivesFromStreamDid` + `derivationMethod` + `WidthedConfidence` (stream-scoped; not a core multi-input chain).
- Grep for `derivesFromDid|reasoningChain|inputAtom|composedConfidence|sourceObligation` in `src/` → zero.

Phase 0.5 must publish (master 2.5.1–2.5.4): reasoning-chain primitive (minor, additive); consequence optional/honest for non-life-safety; provenance field map; source-obligation metadata with ICC as test account. Backward-compat: additive-only; do not mutate existing `consequence` requiredness on current read-contract consumers; leave `./og` / encumbrances / temporal exports intact.

---

## 2.3 Home ruling — PASS

**RULED:** ATOM HOME = `hauska-engine` + `@empressaio/atom-contract`. Sprint-56 envelope reasoning lift IS this atom refactor — once, in the spine.

**Named write path for property atoms (target):** hauska-engine StoragePort (`pg-storage.ts` + atoms/atom_links) once Phase 1 lands; transitional lineage for derived-fact embryos may start on document-ingest durable path (Lineage B) only if explicitly chosen — full-chain operator ruling prefers StoragePort up front.

**FORBIDDEN outcome (named and excluded):** author the zoning→setback→envelope family deep in `legacy-design-tools/artifacts/api-server` (including `buildableEnvelope/`) intending migrate-later. cortex-api remains reporting + current bake/orchestrator consumer during flag-gated dual-serve (I-J), then reads atoms.

**Branch-(c) staged-bake:** does **not** exist outside `artifacts/api-server` today. Grep shows `deriveBuildableEnvelope` only under api-server. Any future staged bake must be created in hauska-engine (or a non-cortex package) and proven NOT under `artifacts/api-server`.

Live kernel debt (evidence of lift, not a license to extend):

| Module | Path on LDT tip `ab34b33` |
|---|---|
| multiply | `artifacts/api-server/src/lib/buildableEnvelope/derive.ts:150` (`labeling.confidence * district.confidence`) |
| API route | `.../routes/brokeragePlaceBuildableEnvelope.ts` (~L961) |
| Tier-1 bake | `.../lib/nodeFacetBakeTier1.ts` (~L230) |
| Tier-2 bake | `.../lib/nodeFacetBakeTier2.ts` (~L213) |

---

## 2.4 Live-PE-sprint collision — PASS (owners frozen)

| Concern | ONE owner | Status | Atom-program role |
|---|---|---|---|
| `buildableEnvelope/` kernel | **This property-reasoning-substrate program** | PE map-truth invent closed; confidence unfinished = atom Phase 1 | Lift to spine; retire multiply across all THREE orchestrators; PE freeze except live-break hotfixes |
| Overpass remount (`OVERPASS_URL` + VPC in workflow) | **PE v1 sprint — CLOSED** | MET on tip `cortex-api-00428-fax`; LDT #350 / `ab34b33`; workflow-baked, not manual gcloud | Do **not** spawn a second remount; reference-only for front-edge upgrades |
| I-2 / absent-zoning honesty | **PE in-place shim — SHIPPED (#350)** | `absentZoningHonesty.ts` on tip; Bexar null→decline path live | Do **not** build a second parallel fix; atom Phase 1 honest-absence **replaces** shim at cutover only |

Supporting decision already filed: `_decisions/2026-07-23_pe_envelope_atom_spine_and_post_map_truth_pickups.md`.

---

## Negative-done-line watch (phase-0 posture)

None of the negative-done-line FAIL conditions can be graded at Phase 0 (no atom path yet). Documented live violations that Phase 1 must clear: I-F Stripe meter at gate (25b honest-state); I-A bespoke multiply still live on all three orchestrators; I-D Bexar invent path mitigated by PE shim but not yet atom honest-absence.

## What is NOT claimed

- Document-ingest atoms are not retrieval-served.
- Gate→spine "cross-project" is same-project for MCP↔spine; cross-GCP is MCP↔cortex.
- MCP health "ok" on retrieval uses `/healthz` 404-as-reachability; authenticated tool traffic proven separately via retrieval Bearer.
- No Phase 0.5 contract publish and no Phase 1 build until Gate A go.

## Amendment log

- 2026-07-23: Gate A Option A go from operator (via reviewing doc_repo planner). 2.1 → PARTIAL-with-escalation-noted. Phase 1a hard bar before 1b recorded. Proceeded to Phase 0.5 design; stop at Gate B.
