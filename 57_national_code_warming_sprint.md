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

The reasoning-atom corpus, the adjudication ledger, and the calibration overlay are Hauska spine substrate, not a Cortex product feature. They are the compounding reasoning asset the substrate thesis sells, and [`55_spine_data_intelligence_stack.md`](55_spine_data_intelligence_stack.md) Section 7 names calibration a spine-wide invariant. They are built in cortex-api now only because the capture surfaces (reviewer adjudication routes, finding generation) and the `citations[].atomId` lineage live there today, and because the reasoning engine-api on the spine is scaffold-only (hauska-engine #67) so there is no live spine reasoning service to build them into yet. (The gate itself is wired and healthy per [`_research/2026-06-09_cross_repo_recon.md`](_research/2026-06-09_cross_repo_recon.md); the block is engine-api maturity, not the gate.) They are built behind a clean package seam and tagged as engine-core cargo, so they lift to `hauska-engine` with the finding engine as part of the engine extraction (56 step 4), not as a rewrite. The physical lift is not pulled forward; it stays on its existing gate (the build-out deploy plus M-Stabilize), per ADR-008 and 56.

In the target topology every consumer reaches reasoning through the MCP gate, so the national reasoning corpus is queryable by Codex (code lookups), Cortex (findings), and external agents alike, Layer-1 free and Layer-2 paid per [`08_tiered_access_model.md`](08_tiered_access_model.md). Rail-quiet (I7) is corrected here: it governs only that the calibration grade and any rev-share are not exposed in buyer-facing tool outputs. It does not mean calibration lives in Cortex. Calibration lives on the spine, is served through the gate, and the grade stays out of the tool output schema.

## Field contract (load-bearing)

`assertedConfidence` is owned by cold-warm, set on every warm and re-warm. `calibratedConfidence` is owned by arrow-two Phase 3. The cold-warm UPSERT `ON CONFLICT` updates only asserted fields plus the sources array and preserves the calibration columns; a test asserts re-warm never erases calibration. Calibration is stamped with the (reference, edition, source-set) it was earned against, and source-set drift is a first-class invalidation trigger, not edition change alone: because cold-warm mutates the source-set via multi-link accretion, a same-edition source swap must not silently carry stale calibration. Cold-warm bumps a `sourceSetVersion` / sets `calibrationStale`; Phase 3 compares all three stamp fields. At read time `calibratedConfidence` falls back to `assertedConfidence` until signal accrues (cold-start prior); uncalibrated never renders as zero.

## Tenant data sovereignty (load-bearing, security)

Per the constitutional amendment ([`_decisions/2026-06-09_retire_partnership_first_amend_constitution.md`](_decisions/2026-06-09_retire_partnership_first_amend_constitution.md), which retires partnership-first and re-grounds invariant I5 on the tenant), this is an enterprise customer-trust and security commitment, not a sourcing ethic. A tenant's private adjudications stay isolated to that tenant and never pool into a shared or public number (`tenant-private` accessPolicy, ADR-005/017). Public-code calibration pools freely from anonymous and public-tier signal, which is what makes the public model-code grade easy to earn. Two partition rules are tested: `tenant-shared` pools only within its shared-with list, never into the global public number; and the per-class sparse fallback stays within-partition (within `(class, jurisdictionTenant)` for tenant-private signal, the public pool for public signal). The mechanism is unchanged from the earlier "no partner-judgment pooling" framing; only its justification changed.

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

**Phase 3, arrow-two calibration over both stores (cc-agent-C, migration 0037, after Phase 2 and the harness land).** Compute calibration per tenant from captured adjudications and outcomes, write to the overlay for both corpus atoms (via lineage) and reasoning atoms. Enforce tenant data sovereignty (public grade pools from anonymous/public-tier signal; tenant-private isolated and never pooled; tenant-shared pools only within its shared-with list). Adaptive grain within-partition (per-atom dense, per-class sparse, never crossing the partition). Edition-and-source-set-scoped (source-set drift invalidates, not edition alone). Attribution-coverage asserted. Seed the asserted baseline for corpus atoms. Keep the calibration grade out of the MCP output schema; the substrate lives on the spine, served through the gate.

## Cross-cutting launch-readiness gates

Lineage completeness audit across all emission surfaces (Cortex findings, Codex, MCP tools, Brief extension): any surface emitting a citation without an attributable atom id is arrow-one-only withdrawal and must be closed or explicitly accepted before launch. Scoped as its own recon dispatch ([`_dispatches/2026-06-09_cc-agent-C_lineage_completeness_audit.md`](_dispatches/2026-06-09_cc-agent-C_lineage_completeness_audit.md)). Two distinct starvation modes are covered: a lineage-health monitor on `invalidCitationCount` (generation-time token-stripping drops a citation), and a Phase-3 attribution-coverage metric (a citation resolves at generation but finds no overlay row at attribution because the citation-ref and overlay atomId key-spaces diverge). The 0037 fixture asserts a real structured-ref citation (e.g. `[[CODE:reasoning:fbc-2023:fbc-m601-6]]`) resolves to its overlay row. Quality-gate uniformity: asserted confidence plus provenance plus verification on every served atom, both stores. Rail-quiet (I7): the calibration grade stays out of the MCP tool output schemas; the calibration substrate itself lives on the spine and is served through the gate (see Placement).

### Gate-deposit-loop closure (from the lineage audit, 2026-06-09)

The lineage audit ([`_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md`](_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md)) found the arrow-two deposit loop closes today only on Cortex's direct HTTP path; every path through the MCP gate is partial or arrow-one-only. The server-side ledger join is gate-independent, so the loop does not break merely by decoupling, but two real failures exist and one bites now. Four-part closure:

- **P0b, canonical atom-id key (MERGED, #158).** Id key-spaces diverged (`code_atoms.id` UUID vs `did:hauska:code-section:{id}` vs `reasoning:`/`websearch:`), so the overlay silently missed on the HTTP path too. `canonicalOverlayAtomKey` (`lib/codes` / `@workspace/codes`) normalizes citations at write time, so stored citations are canonical and the ledger fans UUID + DID to one row. The gate does not import it — it reads the already-canonical stored citations. The HTTP-path now-fix is closed. Dispatch: [`_dispatches/2026-06-09_cc-agent-C_atomid_namespace_normalization.md`](_dispatches/2026-06-09_cc-agent-C_atomid_namespace_normalization.md).
- **P0a, gate threads finding citations on fetch.** `codex_finding_generation` returns no citations; add `codex_findings_fetch` so gate-consumers can see and deposit lineage, tenant-scoped.
- **P2, override-via-gate preserves citations.** `codex_override_write` plus the cortex-api override route must not drop citations, or an override-via-gate starves the ledger server-side. P0a + P2 dispatch: [`_dispatches/2026-06-09_cc-agent-M_gate_citation_lineage.md`](_dispatches/2026-06-09_cc-agent-M_gate_citation_lineage.md).
- **Briefing-source decision (DECIDED 2026-06-09: non-deposit for launch).** Briefing-source citations are outside the code-section ledger and stay there for launch — intentionally non-deposit for code calibration (code-section is the priority). Expanding to a separate briefing-source overlay class for site-context calibration is a deliberate later move, not a launch gap. Record: [`_decisions/2026-06-09_briefing_source_non_deposit.md`](_decisions/2026-06-09_briefing_source_non_deposit.md).

Plus a generation-persists-citations acceptance test (prove the server-side job persists citations, not assume it). **Sequencing dependency (P0b now done):** P0a + P2 have a single remaining gate, **sprint-54 step-1 gate tenant resolution** (the gate has product+tier but no tenant field, so the tenant-scoping acceptance cannot be built yet), **and must precede [`56`](56_engine_extraction_sprint.md) step 5 (cut consumers to the gate)**, otherwise the flywheel goes silent the moment adjudication is routed through the gate. Chain: **54 step 1 → P0a+P2 → 56 step 5.** Pre-mortem cleared green 2026-06-09 (tenant-scoping condition on `codex_findings_fetch` folded into the P0a dispatch).

## Settled in-sprint (2026-06-09)

Asserted baseline for the corpus is committed: the overlay seeds an asserted baseline on every existing corpus atom from source quality, so the base is uniform at launch (every served atom carries confidence plus provenance plus verification). Lineage-completeness audit across all emission surfaces is committed as its own recon dispatch. Substrate placement is settled as spine cargo (seam now, lift with the engine extraction), per the Placement section.

## ICC / NFPA enhance phase (parked)

The ICC meeting happened (2026-06-09); credentials are not yet delivered. The cc-agent-E ICC Layer-1 cutover dispatch stays gated on credential delivery. When it lands it upgrades the corpus to licensed full text and swaps the reasoning-atom `displayMode` from deeplink to licensed via the seam v2 left open. The NFPA track (NEC, NFPA 101) is parallel and reference-only until an NFPA data license lands. Neither gates this sprint.

## Revision history

- **2026-06-09 (origin):** Created as the home for the national code-warming first pass integrated with arrow-two. Two stores plus one overlay; field contract; sovereignty split; eight clean-base commitments; build DAG; four phases; cross-cutting launch-readiness gates; manifests authored. Per [`_decisions/2026-06-09_codewarm_arrow_two_combined.md`](_decisions/2026-06-09_codewarm_arrow_two_combined.md).
