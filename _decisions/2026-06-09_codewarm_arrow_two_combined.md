---
decision_id: 2026-06-09_codewarm_arrow_two_combined
date: 2026-06-09
owner: Nick
status: active
refines: [2026-06-08_reasoning_not_text_grounding_and_web_first_gtm, 2026-06-08_websearch_code_grounding_supersedes_interim_atoms]
related_canonical: [57_national_code_warming_sprint, 04a_arrow_two_calibration_capture, 55_spine_data_intelligence_stack, 56_engine_extraction_sprint, 03_structural_constitution_and_drift_guard, 03a_positioning_framework, 08_tiered_access_model, 00_current_state]
related_adr: [80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_021_constraint_resolution_and_precedence, 80_adrs/adr_005_multitenancy, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_008_engine_factor_out]
related_dispatch: [_dispatches/2026-06-09_cc-agent-C_codewarm_harness, _dispatches/2026-06-09_cc-agent-C_codewarm_runs, _dispatches/2026-06-07_cc-agent-C_arrow2_phase3_calibration]
---

## Decision

Run a national web-first code-warming first pass across the model building codes (I-Code family first, 2021 base) and integrate it with arrow-two calibration into one cohesive build whose end state is a clean, uniformly-instrumented base across everything already ingested and everything about to be ingested. The warming populates cortex-local reasoning atoms (web-first, mutable, no verbatim text). Arrow-two calibration lands on a single id-keyed calibration overlay that covers both the new reasoning atoms and the existing immutable engine corpus, fed by the already-merged adjudication evidence ledger. The engine code-section corpus is never mutated.

Nine commitments make the base clean rather than two-tiered:

1. **Web-first reasoning-atom warming, corpus-aware.** Cold-warm produces citation/structure reasoning atoms (reference, edition, multi-deeplink, asserted confidence, verification state, snippet at most 600 chars, no building-specific finding and no verbatim section text). It checks corpus coverage first and warms the gaps; where the corpus already covers a reference, the reasoning layer adds multi-link plus the calibration overlay rather than re-grounding text. Precedence is corpus (licensed/structural), then reasoning (web-first), then live web-fetch.

2. **Two confidence numbers, never one.** `assertedConfidence` is owned by cold-warm and set on every warm and re-warm. `calibratedConfidence` is owned by arrow-two Phase 3 and computed from adjudication evidence. The cold-warm UPSERT `ON CONFLICT` updates only the asserted fields and the sources array, and must preserve the calibration columns. A test asserts re-warm never erases calibration.

3. **One calibration overlay covering both stores.** Arrow-two applies to the existing 21,126 engine atoms through an overlay keyed by `(atomId, jurisdictionTenant)`, attributed via the `findings.citations[].atomId` lineage, not by mutating the immutable corpus. The same overlay carries calibration for the new reasoning atoms. There is one adjudication ledger and one calibration surface, not two.

4. **Asserted baseline for the existing corpus.** The engine code-section atoms are confidence-blind today. For a uniform base the overlay carries an asserted baseline for corpus atoms, seeded from source quality (born-digital PDF, Municode, web), so every served atom carries confidence plus provenance plus verification regardless of which store produced it.

5. **Launch honesty and cold-start prior.** Calibration is earned from usage; at launch it is sparse. The clean base at launch is asserted confidence plus provenance plus verification everywhere, with the earning-loop wired and live. At read time `calibratedConfidence` falls back to `assertedConfidence` until signal accrues; it never renders uncalibrated as zero.

6. **Sovereignty split (load-bearing).** A shared model-code atom's public `calibratedConfidence` is computed only from non-tenant-private signal. Tenant-private adjudications never reach the shared number; each tenant's calibration is a per-tenant overlay row, `tenant-private` accessPolicy, that never pools. This holds for both the corpus overlay and the reasoning-atom overlay.

7. **Edition-scoped, grain-adaptive calibration.** Calibration is stamped with the (reference, edition, source-set) it was earned against; an edition change invalidates or carries forward deliberately, never silently. Calibration computes per-atom where signal is dense and per-class-within-jurisdiction where sparse, so a number is never computed off two events.

8. **Lineage completeness and rail-quiet.** Every emission surface that cites a code reference (Cortex findings, Codex, the MCP tools, the Brief extension) must carry the atom-id lineage so an adjudication can return as a deposit; any surface that cannot attribute is arrow-one-only withdrawal and is a launch gap to close (scoped as its own audit dispatch). Rail-quiet (I7) governs only that the calibration grade and any rev-share stay out of the buyer-facing MCP tool output schemas; it does not place calibration in any one product. Calibration lives on the spine and is served through the gate.

9. **Spine substrate, not Cortex product (placement).** The reasoning-atom corpus, the adjudication ledger, and the calibration overlay are Hauska spine substrate, the compounding reasoning asset the thesis sells and a spine-wide invariant per `55_spine_data_intelligence_stack.md` Section 7. They are built in cortex-api now only because the capture surfaces and the `citations[].atomId` lineage live there today and the live gate cannot reach the engine yet (`HAUSKA_BACKEND_URL` placeholder). They are built behind a clean package seam and tagged as engine-core cargo, so they lift to `hauska-engine` with the finding engine as part of the engine extraction (`56_engine_extraction_sprint.md` step 4), not as a rewrite. The physical lift is not pulled forward; it stays on its existing gate (the build-out deploy plus M-Stabilize) per ADR-008. In the target topology the national reasoning corpus is queryable by every product (Codex, Cortex, external agents) through the gate, Layer-1 free and Layer-2 paid.

The migration block after 0035 is reserved: 0036 for the cold-warm field split and UPSERT preservation, 0037 for the arrow-two Phase 3 calibration columns and the overlay table. Both run on the single legacy-design-tools clone (cc-agent-C) and are sequenced, never concurrent, to avoid the recurring 0016/0017-style collision.

## Context

The 2026-06-08 decisions shipped web-first reasoning-atom grounding to production (legacy-design-tools PRs #150 through #153, cortex-api 00140 serving real web-grounded findings). The operator's direction 2026-06-09 is to drive a national first pass across all model building codes ahead of the roughly 7,000-architect launch, fold in arrow-two calibration (roadmap item 1) because the two builds meet on the same field, table, and agent, and ensure the end state is a clean uniformly-instrumented base rather than a new layer bolted onto an uninstrumented corpus. The v2 `reasoning_atoms` table (migration 0035) is mutable and confidence-bearing, which supersedes arrow-two's Phase-0 "no write target" blocker for the reasoning layer; the corpus stays immutable and is reached by the id-keyed overlay.

## Structural commitment check

Pre-mortem run 2026-06-09 via the premortem-check skill, green. Sell-reasoning (1, load-bearing): green, citation/structure atoms with snippet cap and no verbatim text, boundary test gates the harness. Partnership-first (2, load-bearing): green, model codes are public/model-code baseline outside the refusal scope; the sovereignty split keeps any tenant's adjudications from pooling into a shared number, which is the partnership-first guarantee expressed in the calibration mechanism. Cost-per-jurisdiction (3, load-bearing): green, per-query fetch is trivial marginal cost and the curated reference sets plus per-batch cost-record bound the spend. Quality-gate (7): green and strengthened, the asserted baseline plus overlay closes the corpus confidence-blindness so every served atom carries source, confidence, verification, timestamp. The two enforced conditions are the no-verbatim boundary test and the calibration-preservation UPSERT test.

## Reasoning

A single id-keyed overlay over both stores is the only design that yields a clean base without mutating an immutable corpus, and it makes arrow-two universal rather than reasoning-layer-only. Seeding an asserted baseline closes the corpus confidence-blindness that would otherwise ship a two-tiered base at launch. Lineage-completeness across all emission surfaces is what makes the flywheel real rather than rhetorical, because a surface that cannot attribute can never deposit. The sovereignty split is the partnership-first commitment made mechanical, and is the line the operator has already drawn with partner cities.

## Reversal criteria

Reverse the asserted-baseline-for-corpus commitment to overlay-reasoning-only if seeding a defensible per-source baseline proves unreliable, in which case corpus atoms stay structural-only and only the reasoning layer carries confidence until the next corpus rebuild can seed it natively. Reverse the no-verbatim-storage boundary never; full-text display is licensed display (ICC Code Connect / NFPA), not catalog storage. Reverse the corpus-immutability respect never; calibration lives on the overlay, the corpus is rebuilt, not mutated in place.

## Dependencies

Builds on the merged Miami chain and the live v1/v2 web-first grounding (reasoning_atoms migration 0035). Execution: the cold-warm harness dispatch, the cold-warm runs dispatch, and the arrow-two Phase 3 dispatch (retargeted onto the overlay). Sprint home: `57_national_code_warming_sprint.md`. Arrow-two Phase 2 outcome capture (queued, tenant leg) feeds Phase 3 and is unchanged.

## Counterparties

Internal direction. Serves the Cortex product line and the planned architect-community launch. ICC and NFPA are display-license counterparties (the enhance phase, parked on credential delivery); cities are proprietary-data and revenue-share counterparties under the sovereignty split. No counterparty commitment is made here beyond the posture already stated to ICC and Cotality.
