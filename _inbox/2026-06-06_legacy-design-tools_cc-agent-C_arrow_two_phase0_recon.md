---
id: 2026-06-06_legacy-design-tools_cc-agent-C_arrow_two_phase0_recon
title: Recon — Arrow two Phase 0, calibration-capture wiring design
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools (cross-repo read: hauska-atom-contract, hauska-engine, hauska-mcp-server)
kind: recon
status: complete
related: [04a_arrow_two_calibration_capture, 03_structural_constitution_and_drift_guard, 03a_positioning_framework, 50_hauska_mcp_server, 80_adrs/adr_018_atom_contract_substrate_layer, 80_adrs/adr_017_atom_access_control, _research/2026-06-06_cross_repo_recon]
---

# Recon — Arrow two Phase 0: calibration-capture wiring design

This is recon and design only. No code, no schema, no migration, no PR was written in any repo. The output is the wiring-design report the Phase 0 dispatch asked for, with every capture point and storage location cited by file plus symbol, verified against live source (HR-8). The task anchor is [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md).

## Headline finding (read this first)

The capture side is real and richer than the anchor assumed. The storage side is not where the anchor expected it. The single load-bearing discovery: the calibration targets the dispatch names, code-section and code-cross-reference atoms, do NOT carry a confidence field anywhere, and the engine has no path to recompute an atom's confidence after ingest. The confidence number that exists today lives on the finding, not on the atoms the finding cited. Arrow two as literally framed ("route accept/edit/reject into the cited atoms' confidence") therefore cannot land as a write to those atoms in Phase 1, because there is no field to write and the corpus is a rebuilt immutable snapshot. The honest Phase 1 slice is an append-only adjudication-to-atom evidence ledger that the later phases compute calibration from, built cortex-api-side where the captures and the citation lineage already live. The good news that makes this tractable: the finding-to-atom lineage already exists at per-finding granularity, so adjudications can be traced to the exact atoms whose calibration they bear on.

## Atom resolution note (HR-12 / atom-first)

The dispatch asked me to resolve `current-state:portfolio`, `finding:*`, `decision-event:*`, `submission:*`, `code-section:*`, `code-cross-reference:*` first. Of these, only `current-state:portfolio` is a doc_repo Phase 1 catalog atom ([`00_current_state.md`](../00_current_state.md) per [`01a_atom_conventions.md`](../01a_atom_conventions.md)). The substrate atoms (finding, decision-event, submission, code-section, code-cross-reference) are Hauska/cortex-api substrate atoms, not registered in the doc_repo portfolio catalog. Cortex MCP atom-resolve was not available in this session (no Cortex/Hauska MCP tool is mounted here), so per the dispatch fallback instruction I resolved these substrate atoms by direct repo recon instead, stated here verbatim as instructed.

## Item 1: Capture points (where adjudications are recorded today)

Three reviewer-adjudication HTTP routes, all in `artifacts/api-server/src/routes/findings.ts` (cortex-api), introduced in the PR #66 to #72 Codex reviewer surface:

- Accept: `router.post("/findings/:findingId/accept", ...)` at `findings.ts:1437`. Loads the finding by atom id, computes the next status via `nextStatusForAccept(row.status)`, and updates the row: `status`, `reviewerStatusBy`, `reviewerStatusChangedAt`, `acceptedByReviewerId`, `acceptedAt`.
- Reject: `router.post("/findings/:findingId/reject", ...)` at `findings.ts:1530`. Updates `status` (via `nextStatusForReject`), `reviewerStatusBy`, `reviewerStatusChangedAt`.
- Override (the reviewer edit): `router.post("/findings/:findingId/override", ...)` at `findings.ts:1612`. In one transaction it stamps the original row to `status: "overridden"` with `reviewerComment`, then inserts a new revision row carrying the reviewer-authored `text`, `severity`, `category`, and `revisionOf` pointing back at the original.

Each mutation also emits an event through `emitFindingMutationEvent(...)` at `findings.ts:673`, which calls `history.appendEvent({ entityType: "finding", entityId: <atomId>, eventType: "finding.accepted" | "finding.rejected" | "finding.overridden", actor, payload })` into the `atom_events` table. This append-only event stream is the natural seam for Phase 1 (see Item 5).

The submission-level verdict (the decision-event atom) is captured separately by `emitDecisionEventRecordedEvent(...)` in `artifacts/api-server/src/routes/engagementEvents.ts:352`, which appends `entityType: "decision-event"`, `eventType: "decision-event.recorded"`, with payload `{ submissionId, verdict, comment }` where `verdict` is `"approve" | "approve_with_conditions" | "return_for_revision"`. The finding-generation write path that seeds these rows is `persistFinding(...)` at `findings.ts:714`, which inserts with `status: "ai-produced"`, `citations: engineFinding.citations`, and `confidence: String(engineFinding.confidence)`.

`codex_override_write` is an MCP tool, not a separate cortex-api write path. It lives in `hauska-mcp-server` at `src/tools.ts:794` (`server.tool("codex_override_write", ...)`, gated by `requireProduct("codex_override_write", "codex")`), and its handler calls `legacyClient.overrideFinding(...)` defined in `hauska-mcp-server/src/legacy-client.ts:939`, which is a thin HTTP proxy: `POST /api/findings/${findingId}/override` against the cortex-api backend, body `{ text, severity, category, reviewerComment }`. So the MCP tool and the Codex UI both funnel into the same cortex-api override route at `findings.ts:1612`. There is one capture surface, two front doors. (hauska-mcp-server is outside the dispatch's listed in-scope repos but is named as a capture point, so I traced it and flag the placement here.) The other three Codex tools are `codex_finding_generation`, `codex_briefing_fetch`, `codex_snapshot_ingest`, all proxies onto the same backend.

Conclusion for Item 1: the capture points exist, are live, and are well-instrumented with an append-only event trail. Gap #1 in the anchor ("routing: adjudications are recorded but stranded") is confirmed precisely. The signal is captured into `findings` rows and `atom_events`; nothing carries it onward to the cited atoms.

## Item 2: Confidence storage (field shape and persistence)

Where a confidence number exists today:

- On the finding (cortex-api). `lib/db/src/schema/findings.ts:149`: `confidence: numeric("confidence").notNull()`, documented as the 0..1 confidence emitted by the engine, plus `lowConfidence: boolean("low_confidence").notNull().default(false)` at line 150. This is per-finding, set once at generation by `persistFinding`.
- On encumbrance and workspace atoms (atom contract). `hauska-atom-contract/src/encumbrances/common.ts:113`: `const CONFIDENCE = z.number().min(0).max(1)` inside `QUALITY_GATE_FIELDS`, spread into `restriction-clause`, `administrative-rule`, and (nested per rule) `constraint-resolution`. And `hauska-atom-contract/src/workspace/brief-run.ts:29`: `confidence: z.number().min(0).max(1)` on `BriefRun`.

Where confidence does NOT exist, and this is the load-bearing finding:

- The code-corpus atoms carry no confidence field. In `hauska-engine/packages/atoms/src/instances.ts`, `BaseAtomInstance` (line 16) has no confidence field; `CodeSectionAtomInstance` (line 31), `CodeCrossReferenceAtomInstance` (line 261), `CodeEditionAtomInstance` (line 277), and `JurisdictionCorpusAtomInstance` (line 286) none declare confidence. The only `confidence` in that file is `sourceConfidence` on `SheetTextSegment` (line 481) and the sheet annotation type (line 490), which is an OCR extraction-quality signal in [0,1], not an atom calibration score. The atom-contract package likewise carries no code-section type at all (it is framework-only; the code atom shapes live in the engine).

How confidence is set, and whether it is ever recomputed:

- Set: the only engine assignment is a pass-through. `hauska-engine/packages/workspace/src/emit.ts:129`, inside `emitBriefRun(...)`: `confidence: payload.confidence`. The value is validated against the contract schema and persisted verbatim; the engine derives nothing and computes nothing.
- Recompute: none. The storage port `hauska-engine/packages/storage/src/port.ts` exposes read methods (`getAtom`, `getAtomByDid`, `search`, `traverse`) and write-once methods (`writeAtom`, `writeAtoms`); there is no update or mutate operation. A search for `recompute` / `updateConfidence` / `recalibrate` across the engine returns nothing relevant (the one near-miss is the `"passing-recalibrated"` eval-state label on `jurisdiction-corpus`, unrelated to a confidence field). Atom confidence is write-once-at-ingest.
- Persistence: the committed `services/retrieval-api/corpus/snapshot.json` is the live read store, hydrated into `InMemoryStorage.fromSnapshot(...)` at retrieval-api boot. The Postgres path (`packages/storage/src/schema.ts`, `atoms` table with a JSONB `body` column) is defined but deferred per REPO_NOTES; no migration, no `pg-storage.ts` implementation. So even if code atoms gained a confidence field, the store they live in is a rebuilt artifact, not a mutable row.

Conclusion for Item 2: the calibration target named in the dispatch (code-section / code-cross-reference confidence) does not exist as a stored field, has no setter, and has no recompute path, and the corpus is immutable-by-rebuild. This reshapes Phase 1 (Item 5).

## Item 3: The link (finding to cited atoms lineage)

Lineage EXISTS, at per-finding granularity. This is the enabling fact for the whole build.

`lib/db/src/schema/findings.ts:143`: `citations: jsonb("citations").notNull().default(sql\`'[]'::jsonb\`)`, holding a `FindingCitation[]`. The code citation variant `lib/api-zod/src/generated/types/findingCodeCitation.ts:13` is `FindingCodeCitation { kind; atomId: string }`, where `atomId` is documented as "the atom id used in `[[CODE:<atomId>]]` tokens," resolved against the engine's reference block at generation time, with unresolved tokens stripped from `text` and counted on the run row's `invalidCitationCount`. So each finding row already declares the exact set of code-section atom ids it cited. This is a per-finding mapping, not a per-brief bag of atoms.

Two caveats that become Phase 1 dependencies: the link is finding to atom (a forward reference by id string); there is no backlink stored on the atom side, which is consistent with the atom store being immutable. And the schema comment notes citations are treated as immutable post-generation. Both are fine for the ledger design below, which reads the forward link and never needs to mutate the atom.

Conclusion for Item 3: an adjudication on a finding can be traced to the specific atoms whose calibration it bears on. Lineage is present and per-finding. This is what makes arrow two buildable at all.

## Item 4: Outcome observation

Partial, and it is a reviewer-recorded disposition rather than independently observed real-world ground truth. So Phase 2 does not start from absolute zero, but the deepest outcome signal is missing.

What exists: `lib/db/src/schema/submissions.ts` carries `status` (enum `pending | approved | corrections_requested | rejected`), `reviewerComment`, `respondedAt`, `responseRecordedAt`, documented as the canonical jurisdiction-response status. Plus the decision-event verdict (`approve | approve_with_conditions | return_for_revision`) from Item 1. This is the jurisdiction reviewer's disposition of a submission as typed into the system.

What is missing: any signal of what actually happened in the jurisdiction's permit office independent of what a reviewer entered here. No permit-issued date, no permit number from the authority of record, no variance granted/denied, no appeal status, no after-the-fact "the brief's finding turned out right/wrong." Auxiliary tables checked and ruled out: `submission_comments` (architect-reviewer chat), `submission_communications` (drafted letters), `permit_counters` (internal sequencer), `eval_scores` (internal QA rubric, not jurisdiction feedback).

Conclusion for Item 4: the submission disposition is a usable mid-grade outcome proxy and a head start for Phase 2, but true real-world outcome capture (the permit-office result) does not exist and is net-new. This confirms gap #2 in the anchor with a nuance: the second signal is partially present at the submission level, fully absent at the real-world level.

## Item 5: Proposed update path (prose, no code)

The design splits cleanly along what the substrate can support today.

Phase 1, the minimal faithful slice: adjudication to an atom-keyed evidence ledger, cortex-api-side. Do not attempt to write confidence back onto code-section atoms in Phase 1; there is no field, no setter, no recompute path, and the corpus is rebuilt-immutable. Instead, route the existing adjudication signal to the atoms it concerns by fanning each finding's `citations[].atomId` out into an append-only per-atom evidence record. Every fact this needs is already in hand at the capture point: the finding row already carries `citations` and `confidence`; the route already has the reviewer actor and the resulting `status`. Two implementation tiers, both Phase 1:

- 1a, lowest cost, zero new writes and zero schema change: a derived read-model/projection that joins the already-emitted `atom_events` finding-mutation events (`finding.accepted` / `finding.rejected` / `finding.overridden`, emitted by `emitFindingMutationEvent`) to `findings.citations[].atomId`, producing per-atom adjudication tallies (accepts, rejects, overrides) alongside the stated `confidence` those findings carried. This alone closes gap #1: the signal is no longer stranded, it is attributed to each cited atom. The events already exist; the only missing thing is the projection that fans them by cited atom id.
- 1b, the hardening step still inside Phase 1: if a durable, queryable per-atom evidence record is wanted rather than a recomputed projection, add an append-only adjudication-evidence write at the three capture points, one row per cited atom: `{ atomId, findingId, submissionId, adjudication, jurisdictionTenant, contributorId, statedConfidence, occurredAt }`. This denormalizes for query efficiency and survives event-stream compaction.

Recommend shipping 1a first (it proves the routing with no migration), then 1b if the read-model proves too expensive or the evidence needs its own retention.

Phase 2, outcome capture (defer): extend the same ledger to record the submission disposition (`submissions.status` and the decision-event verdict) against the findings, and therefore the atoms, so finding accuracy can be measured against the jurisdiction's actual disposition rather than only the reviewer's per-finding click. This phase has a partial head start (the disposition exists, Item 4) but the true real-world outcome (permit-office result, variance granted) is a net-new capture surface and is the deepest part of Phase 2.

Phase 3, calibration computation (defer): per atom, or more likely per atom-class within a jurisdiction (code-section atoms are too granular to accumulate enough events individually), compute observed frequency, how often findings citing this atom were accepted, and how often they predicted the eventual disposition, and compare it to the stated confidence those findings asserted. Derive a calibration grade. This is where the engine likely gains a real confidence field on code atoms and a recompute path (both absent today, Item 2), or where the grade lives entirely in a cortex-api-side derived store and never mutates the immutable corpus. Phase 3 is also where the calibration-grade pricing tiers in [`03a_positioning_framework.md`](../03a_positioning_framework.md) draw their input.

How stated confidence later gets compared to observed frequency: the finding carried a stated `confidence` at generation (`findings.confidence`); the ledger accumulates the adjudication and (Phase 2) the disposition for findings that cited each atom; Phase 3 buckets findings by stated-confidence band and checks the realized accept/approve rate per band against the asserted band. That is the I3 calibration loop, and the per-finding lineage (Item 3) is what lets it attribute the result to specific atoms.

Phase 1 dependencies, in order: (1) the lineage link must be trustworthy, so verify `invalidCitationCount` is low across recent runs (the token-stripping behavior in Item 3 means a finding can silently lose a citation; a high invalid rate would starve the ledger). (2) decide 1a projection vs 1b durable write; 1a depends only on the existing `atom_events` stream and `findings.citations`, nothing new. (3) the ledger must retain `jurisdictionTenant` end to end (it is already on `BaseAtomInstance.jurisdictionTenant` and on the finding/submission) for the guardrail in Item 6. Nothing in Phase 1 depends on the engine, the atom contract, or the deferred Postgres layer; it is entirely cortex-api-side, which is why it is parallel-safe against the MCP build-out and M-Stabilize per the anchor's build-concentration guardrail.

Explicit defer list: any confidence field on code atoms, any engine recompute path, any corpus mutation, real-world outcome capture, and the calibration computation itself all defer to Phase 2/3. Phase 1 ships routing and attribution only.

## Item 6: Guardrail check

Partnership-first and sovereignty (04a guardrail; I8, I5 in [`03_structural_constitution_and_drift_guard.md`](../03_structural_constitution_and_drift_guard.md)). The richest deposits come from partner-city reviewers (Bastrop). The design keeps the deposit landing on the contributor's and the city's own atoms because the evidence ledger retains `jurisdictionTenant` on every row and is partitioned by it, so a city's adjudications sharpen that city's own atoms and that city's own review. The atom-contract `accessPolicy` five-value union (`public-free`, `public-paid`, `platform-internal`, `tenant-private`, `tenant-shared`) is the existing control for any cross-tenant promotion. As specified, Phase 1 passes the guardrail.

Flag, the naive wiring that would violate it: computing a single global per-atom confidence number from all tenants' adjudications and writing it back onto a shared public-catalog atom would aggregate partner-city judgment into a central asset, violating I8 (cities are partners, not extraction targets) and I5 (value returns to contributors). Avoid it by keeping the tenant partition in the ledger and only ever promoting to a shared or public confidence under an explicit `accessPolicy` consent decision, never as a default of the pipeline.

Keep the rail quiet (04a guardrail; I7). The calibration ledger and any rev-share derived from it stay backend. Confidence is already absent from every MCP tool output schema (verified in hauska-mcp-server: no `confidence` in tool outputs; the only `sourceConfidence` is an L2 internal OCR field), and the design keeps it that way. The reviewer surface stays framed as review workflow, not as "you are feeding a calibration engine." Passes I7.

Flag, the rail-surfacing temptation to avoid in Phase 1: do not add any "your adjudication moved atom X's confidence" or "you earned N credits" surface. That would expose the rev-share and calibration plumbing the buyer is not supposed to weigh up front (I7, and the go-to-market note in 03a that rev share is a latent bonus). Keep it invisible until a deliberate positioning decision says otherwise.

## Acceptance check

All six items covered. Every capture point and storage location cited by file plus symbol, verified against live source (HR-8): the three adjudication routes and the two event emitters in cortex-api `findings.ts` / `engagementEvents.ts`; the finding `confidence` and `citations` columns in `lib/db/src/schema/findings.ts`; the `FindingCodeCitation.atomId` lineage type; the absence of confidence on `BaseAtomInstance` and the four code-atom instance types in hauska-engine `instances.ts`; the pass-through setter in `emit.ts`; the read/write-once storage port; the deferred Postgres schema; the submission disposition fields; and the `codex_override_write` tool and its proxy in hauska-mcp-server. Phase 1 slice named (1a projection, 1b durable write) with dependencies; Phase 2 and Phase 3 defer list explicit. Guardrail check done against the 04a guardrails plus I3/I5/I7/I8, with two avoid-this flags. No code, no schema, no migration, no PR was written.
