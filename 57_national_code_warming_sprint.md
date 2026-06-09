---
id: 57_national_code_warming_sprint
title: National code-warming sprint (web-first reasoning atoms + arrow-two clean base)
status: active
last_updated: 2026-06-09
applies_to: cortex
owner: nick
related: [_decisions/2026-06-09_codewarm_arrow_two_combined, 04a_arrow_two_calibration_capture, 80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_021_constraint_resolution_and_precedence, 80_adrs/adr_005_multitenancy, 08_tiered_access_model, 03a_positioning_framework, _catalog/codes]
---

# National code-warming sprint

> The build that takes the web-first reasoning-atom grounding from a Miami patch to a national first pass across the model building codes, and integrates arrow-two calibration so the end state is a clean, uniformly-instrumented base across everything already ingested and everything about to be ingested. Decision: [`_decisions/2026-06-09_codewarm_arrow_two_combined.md`](_decisions/2026-06-09_codewarm_arrow_two_combined.md). Goal is launch-readiness for the architect-community launch with confidence, provenance, and a live earning-loop on every atom served.

## What clean means (the launch-readiness definition)

Every atom Cortex or the MCP serves, old corpus or new reasoning, carries asserted confidence plus provenance plus verification state. Every emission surface that cites a code reference carries the atom-id lineage so an adjudication can return as a deposit. Calibration accretes from usage under the tenant-sovereignty split, falling back to asserted confidence until earned. Nothing ships a bare or fake confidence number; nothing pools a tenant's judgment into a shared one.

## The two stores and the one overlay

The corpus (engine, 21,126 atoms across 34 jurisdictions, rebuilt-immutable, mostly Texas plus federal accessibility) is structural and licensed/deeplink. The reasoning layer (cortex-local `reasoning_atoms`, migration 0035, mutable UPSERT) is web-first and confidence-bearing. The calibration overlay, keyed `(atomId, jurisdictionTenant)` and fed by the merged adjudication ledger, carries calibration for both stores via the `findings.citations[].atomId` lineage. Precedence at read time is corpus, then reasoning, then live web-fetch. The corpus is never mutated; calibration lands on the overlay.

## Placement: spine substrate, served through the gate (not a Cortex feature)

The reasoning-atom corpus, the adjudication ledger, and the calibration overlay are Hauska spine substrate, not a Cortex product feature. They are the compounding reasoning asset the substrate thesis sells, and [`55_spine_data_intelligence_stack.md`](55_spine_data_intelligence_stack.md) Section 7 names calibration a spine-wide invariant. They are built in cortex-api now only because the capture surfaces (reviewer adjudication routes, finding generation) and the `citations[].atomId` lineage live there today, and because the live gate cannot reach the engine yet (the `HAUSKA_BACKEND_URL` placeholder, per the [`56`](56_engine_extraction_sprint.md) lift-status note, hard-blocks cutting consumers onto the gate). They are built behind a clean package seam and tagged as engine-core cargo, so they lift to `hauska-engine` with the finding engine as part of the engine extraction (56 step 4), not as a rewrite. The physical lift is not pulled forward; it stays on its existing gate (the build-out deploy plus M-Stabilize), per ADR-008 and 56.

In the target topology every consumer reaches reasoning through the MCP gate, so the national reasoning corpus is queryable by Codex (code lookups), Cortex (findings), and external agents alike, Layer-1 free and Layer-2 paid per [`08_tiered_access_model.md`](08_tiered_access_model.md). Rail-quiet (I7) is corrected here: it governs only that the calibration grade and any rev-share are not exposed in buyer-facing tool outputs. It does not mean calibration lives in Cortex. Calibration lives on the spine, is served through the gate, and the grade stays out of the tool output schema.

## Field contract (load-bearing)

`assertedConfidence` is owned by cold-warm, set on every warm and re-warm. `calibratedConfidence` is owned by arrow-two Phase 3. The cold-warm UPSERT `ON CONFLICT` updates only asserted fields plus the sources array and preserves the calibration columns; a test asserts re-warm never erases calibration. Calibration is stamped with the (reference, edition, source-set) it was earned against. At read time `calibratedConfidence` falls back to `assertedConfidence` until signal accrues (cold-start prior); uncalibrated never renders as zero.

## Sovereignty split (load-bearing)

A shared model-code atom's public `calibratedConfidence` draws only on non-tenant-private signal. Tenant-private adjudications stay in a per-tenant overlay row (`tenant-private` accessPolicy) that never pools into the shared number or into any other tenant. This holds for both stores. It is the partnership-first commitment expressed in the calibration mechanism and the line drawn with partner cities (ADR-005, ADR-017; 04a guardrail).

## Migrations

Reserved block after 0035, sequenced on the one legacy-design-tools clone (cc-agent-C), never concurrent: `0036` cold-warm (asserted/calibrated field split, UPSERT calibration-preservation, corpus-aware seam), `0037` arrow-two Phase 3 (public calibration columns, the `(atomId, jurisdictionTenant)` overlay table, the asserted-baseline-for-corpus column).

## Build DAG

```
cold-warm harness (0036, cc-agent-C) ─┐
   └─> cold-warm runs over manifests ─┼─> arrow-two Phase 3 (0037, cc-agent-C)
cc-agent-M step 1 (gate tenant) ──┐   │     calibration over BOTH stores + sovereignty split
   └─> arrow-two Phase 2 (outcome capture, queued) ─┘
```

Cold-warm has no external dependency and runs first. Arrow-two Phase 2 (outcome capture, queued in the tenant leg) is append-only and collision-free with cold-warm. Phase 3 is the merge point: it needs the cold-warm write target landed and Phase 2 outcomes to compute against. All on one clone, so strict sequence, not parallel.

## Phases

**Phase 0, cold-warm harness (cc-agent-C, legacy-design-tools, migration 0036).** Build a batch job that takes a reference manifest and drives the merged v1 `fetchCodeSection` and v2 reasoning-atom persist path directly, outside `resolveEngineInputs`. Cold-warm output is a citation/structure atom (no finding, snippet capped, no verbatim text). Corpus-aware: query corpus coverage first, warm gaps, overlay-not-reground where corpus covers. Inherit edition/section verification and the `unverified-web-source` flag. Add per-batch `cost-record`, a budget cap, dry-run mode, and the calibration-preservation UPSERT. Boundary test (no full-section persistence) gates the harness. PR held.

**Phase 1, reference manifests (authored 2026-06-09).** Six curated high-traffic manifests in [`_catalog/codes/`](_catalog/codes/): IRC; IBC+IEBC; IECC; IMC+IPC+IFGC; IFC+IPMC; accessibility (A117.1) + NFPA-track. About 640 sections, 2021 base. Federal accessibility flagged `verify-existing-corpus` (diff before warming); NEC and NFPA 101 flagged `NFPA-license-required` (deeplink-only, no grounded text until the NFPA track lands). Sections the authoring agents were unsure of carry `verify: true`.

**Phase 2, cold-warm runs plus domain-assumption verification (cc-agent-C, after harness merges).** Run the harness per manifest. Receiving-agent recon gate: before grounding, verify each `verify: true` section and a sample of the rest against the authoritative source; report resolutions and any section that does not exist in the 2021 edition; the harness edition/section check is the backstop. Eval per family (edition-correct, multi-link present, snippet capped, verification state set, wrong-edition refusal test). Record cost per family. Skip or overlay refs already covered by corpus.

**Phase 3, arrow-two calibration over both stores (cc-agent-C, migration 0037, after Phase 2 and the harness land).** Compute calibration per tenant from captured adjudications and outcomes, write to the overlay for both corpus atoms (via lineage) and reasoning atoms. Enforce the sovereignty split (shared = non-tenant-private only; per-tenant overlay never pools). Adaptive grain (per-atom dense, per-class sparse). Edition-scoped. Seed the asserted baseline for corpus atoms. Keep calibration out of the MCP output schema; surface in Cortex.

## Cross-cutting launch-readiness gates

Lineage completeness audit across all emission surfaces (Cortex findings, Codex, MCP tools, Brief extension): any surface emitting a citation without an attributable atom id is arrow-one-only withdrawal and must be closed or explicitly accepted before launch. Scoped as its own recon dispatch ([`_dispatches/2026-06-09_cc-agent-C_lineage_completeness_audit.md`](_dispatches/2026-06-09_cc-agent-C_lineage_completeness_audit.md)). Lineage-health monitor on `invalidCitationCount` (token-stripping can silently drop a citation and starve the ledger). Quality-gate uniformity: asserted confidence plus provenance plus verification on every served atom, both stores. Rail-quiet (I7): the calibration grade stays out of the MCP tool output schemas; the calibration substrate itself lives on the spine and is served through the gate (see Placement).

## Settled in-sprint (2026-06-09)

Asserted baseline for the corpus is committed: the overlay seeds an asserted baseline on every existing corpus atom from source quality, so the base is uniform at launch (every served atom carries confidence plus provenance plus verification). Lineage-completeness audit across all emission surfaces is committed as its own recon dispatch. Substrate placement is settled as spine cargo (seam now, lift with the engine extraction), per the Placement section.

## ICC / NFPA enhance phase (parked)

The ICC meeting happened (2026-06-09); credentials are not yet delivered. The cc-agent-E ICC Layer-1 cutover dispatch stays gated on credential delivery. When it lands it upgrades the corpus to licensed full text and swaps the reasoning-atom `displayMode` from deeplink to licensed via the seam v2 left open. The NFPA track (NEC, NFPA 101) is parallel and reference-only until an NFPA data license lands. Neither gates this sprint.

## Revision history

- **2026-06-09 (origin):** Created as the home for the national code-warming first pass integrated with arrow-two. Two stores plus one overlay; field contract; sovereignty split; eight clean-base commitments; build DAG; four phases; cross-cutting launch-readiness gates; manifests authored. Per [`_decisions/2026-06-09_codewarm_arrow_two_combined.md`](_decisions/2026-06-09_codewarm_arrow_two_combined.md).
