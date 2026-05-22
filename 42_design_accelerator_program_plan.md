---
id: 42_design_accelerator_program_plan
title: Design Accelerator program plan — current state through GA
status: active
last_updated: 2026-05-22 (Lane C.4 correction: C.4 endpoints + UI shipped 2026-05-20 via legacy-design-tools PRs #46 + #51, not "the remaining build" as the prior frontmatter and Phase 2 gates said; surfaced 2026-05-22 when cc-agent-C verified against the live repo. #46/#51 predate the _inbox/ courier protocol and never reached this doc; the DA-4/5/6 stream rows, the Phase 2 gates, and the Lane C status block were reconciled 2026-05-22 against the verified legacy-design-tools PR history. Prior: DA-BIM-Symmetry row clarified: the 2026-05-19 Track B IFC schema apply landed on the Replit-side Neon, not the post-cutover cortex-prod, which received Track B + drizzle 0009-0014 only in the QA-04 session 2026-05-21; IFC upload now gated on QA-16 per 43_cortex_qa_backlog.md. Earlier: Cortex QA WS-C added as Phase 2 stream DA-IN-APP-AGENT, in-app chat tool-use, dispatched per 43_cortex_qa_backlog.md. Earlier: Lane A.2 + Lane B Group 3 closed; all 7 Cortex atom types locked in engine atom-registry at @hauska-engine/atoms@0.6.0 — response-task, sheet-content-extraction, attached-document, deliverable-letter, detail-callout-spec, product-spec-reference, deliverable-letter-render; all 24 L-surface MCP tools shipped on hauska-mcp-server main; Sprint Amendment 6 reframed L6 as its own atom — render output IS an atom, not bytes-only; DA-BIM-Symmetry shipped via PRs #28/#29; design-decisions subsection added below MCP co-design block. Lane C.4 endpoints + UI is the remaining build, gated on Lane C.3 close; Group 4 cross-client verification follows. Earlier: combined Cortex/Codex sprint launched per _decisions/2026-05-19_sync_4_5_and_cortex_sprint.md; rendering / image-to-BIM / image-to-CAD descoped to 41_advanced_capture_features.md)
applies_to: design-accelerator
related: [10_ground_truth, 11_roadmap, 27_engine_evolution_plan, 40_design_accelerator, 40a_customer_zero_observations_arena_roja_2026_05_06, 41_advanced_capture_features, 41_revit_connector, 48_codex_program_plan, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out]
owner: nick
---

# Design Accelerator program plan

> **Purpose.** Phased roadmap from current state through QA-readiness,
> Moab customer-zero pilot, external pilot, and GA. Replaces ad-hoc
> planning by capturing phases, parallel streams, gates, and
> verification criteria in one durable doc. Companion to
> [`48_codex_program_plan.md`](48_codex_program_plan.md) (Codex side,
> same shape). Shared engine work lives in
> [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md); this
> doc references it.

> **Naming note.** Design Accelerator is rebranding to **Cortex**.
> The product is referred to as "Design Accelerator" in this doc to
> match the canonical product home [`40_design_accelerator.md`](40_design_accelerator.md);
> new code and UI use "Cortex" going forward. Brand migration is
> scoped as Stream G in `27_engine_evolution_plan.md`. Doc renames
> in doc_repo happen as a separate coordination step after the
> canonical product home migrates.

## Current state

Design Accelerator is pre-launch, single-customer (Empressa). Pilot workload: two adjacent residential lots in Spanish Valley near Moab, Utah (Grand County). Strategic positioning, customer-zero context, surface architecture, and engine relationship are in [`40_design_accelerator.md`](40_design_accelerator.md); current implementation state (repo HEAD, deployment URL, schema state, fires) is in [`10_ground_truth.md`](10_ground_truth.md). This program plan reads both as inputs and does not duplicate them.

**Anchors as of 2026-05-11:**

- Repository: `legacy-design-tools` (local: `P:\legacy-design-tools`; remote: `empressaioemail-tech/legacy-design-tools`) — pnpm monorepo. Five artifacts under `artifacts/`: `api-server`, `design-tools`, `plan-review`, `qa`, `mockup-sandbox`. Repo name does not change with Cortex rebrand.
- Production target: Replit autoscale at `prompt-agent-accelerator.replit.app`. Migration to Cloud Run + GHA CI in flight on the parallel migration-sprint track — Phase 1B Stage 1 verified 2026-05-10 (schema parity to Empressa Neon); Phase 1B Stage 2 / 1C / Phase 3 pending. Migration is *not* a gate on DA program plan work, but DA work must coexist with migration activity.
- Engine: shared with Codex per ADR-008. Lives in `artifacts/api-server/src/` until ADR-008 factor-out closes (gated on migration Phase 2C — the SmartCity OS swap, not the DA swap).
- Atom registry: 19 domain atoms + 479 code atoms (helium dev DB count; production verification still open).
- Wave plan vocabulary in repo: `DA-PI-*`, `V1-*`, `Sprint A-D`, `AIR-*`, `PLR-*`. Repo vocabulary is canonical for sprint-level work; this program plan's stream IDs (`DA-1`, `DA-2`, ...) are program-level work packages that sprints decompose into.

**Active test projects** (from `40_design_accelerator.md` §Active test projects):

| Project | Type | Jurisdiction | Status |
|---|---|---|---|
| Alexander 404 Miami | Commercial condo | Miami Beach FL | Verification needed (memory; not in seed.ts) |
| Musgrave Residence | Residential | Moab / Grand County | Confirmed in seed.ts |
| Seguin Residence | Residential | Moab / Grand County | Confirmed in seed.ts |
| Balsley | Residential | TBD | Verification needed |
| Dart Frog | Commercial | TBD | Verification needed |
| Arena Roja R1 | Residential | Moab / Grand County | Source of customer-zero observations doc; not yet a seeded test project |

Verification gap matters for QA-readiness — see Phase 1.

**Open active fires affecting DA** (from `10_ground_truth.md`):

- Fire 3 — `legacy-design-tools` `post-merge.sh` Neon guard verification — open; small; Nick handles when next in GitHub web UI.
- `x-snapshot-secret` rotation — open; small; rotated as part of secret hygiene.

## QA readiness milestone

> **Definition.** Nick can run a real Moab project (Musgrave Residence as the canonical example) end-to-end through Design Accelerator and structurally evaluate every output. "Structurally evaluate" means findings, briefings, and deliverables are classified atoms Nick can compare against ground truth — not free-form chat output.

Concretely, at QA-readiness Nick can:

1. **Generate a parcel briefing** for Musgrave from real Grand County parcel data; cross-check against actual Grand County records.
2. **Pull neighboring context** (3DEP elevation, adjacent parcels, hazards) and verify the engine pulled the right neighbors.
3. **Run incremental compliance** against Grand County IRC + IECC + IRC R301.2.1 corpus as he models in Revit; see findings appear in `plan-review` artifact view; verify each finding cites a real code section and the citation is accurate.
4. **Receive client comments** into the `design-tools` UI; create response tasks (`response-task` atom — L1 fix); track task state; verify task state survives session reload.
5. **Compare revised sheets against comments** with sheet content extraction live (`sheet-content-extraction` atom — L2 fix); verify the engine reads actual sheet text, annotations, and attached supporting docs.
6. **Generate a comment-response letter** as a DOCX/PDF (L3 + L6 fixes); verify section completeness and that the deliverable matches what an AHJ would accept. Per Sprint Amendment 6 the render output itself is a first-class `deliverable-letter-render` atom (queryable, version-pinned against its source `deliverable-letter`), not ephemeral bytes — multi-render off one letter is 1-to-many and each render is independently addressable.
7. **Generate a client render** via mnml.ai integration at deliverable-acceptable quality (not photorealistic perfection — sufficient for client review).
8. **Find bugs.** QA-readiness is the state where bugs surface structurally rather than as vague "AI weirdness" — Nick can point at a specific atom and say "this is wrong because X."

**MCP co-design (added 2026-05-19).** Per [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md), L1-L6 in the current sprint cycle ship with MCP tool surface co-designed per surface — UI consumer and MCP tool counterpart share the same atom and aligned consumer signatures. The dual-interface principle in [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md) treats Cortex as a tracked-retrofit product; this sprint folds retrofit into L1-L6 stream rather than treating it as a separate later phase. Lane B dispatch covering Cortex tool surface: [`_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md). L-surface tools per surface: `cortex/response_task_*` (L1), `cortex/sheet_content_extraction_*` (L2), `cortex/deliverable_letter_*` (L3), `cortex/detail_callout_spec_*` (L4), `cortex/product_spec_reference_*` (L5), `cortex/deliverable_letter_render` (L6). Plus existing-product Cortex tools: `cortex/ifc_ingest`, `cortex/bim_model_query`, `cortex/snapshot_register`, `cortex/briefing_emit`.

**Status as of 2026-05-19.** Lane B Groups 1+2+3+5 all merged on `hauska-mcp-server` main: 4 Codex existing-product tools (PR #2), 4 Cortex existing-product tools (PR #3), the `list_jurisdictions` visibility filter (PR #4), and all 24 L-surface tools across L1-L6 (PRs #6/#7/#8/#9/#10/#11). 32 tools live total. Lane A.2 atom shapes locked in `@hauska-engine/atoms@0.6.0` (PRs #9-#14). Per Sprint Amendment 6, atom shape lives in `hauska-engine/packages/atoms/` but runtime persistence lives in `legacy-design-tools` Postgres — cc-agent-M defined the legacy endpoints in `legacy-client.ts` against [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md); cc-agent-C **shipped** the matching endpoints + UI in Lane C.4 (legacy-design-tools PRs #44/#45/#46/#48/#50/#51, merged 2026-05-20). L-surface atoms get real `did:hauska:` DIDs via a new `lSurfaceProvenance` helper. Lane B Group 4 cross-client verification (auth wiring per-product tier checks; MCP Inspector + Claude Desktop + Cursor round-trips for all 32 tools; end-to-end multi-tool flow on Musgrave) was gated on Lane C.4 close; C.4 closed 2026-05-20, and the MCP-side conformance test plus cross-client matrix shipped on hauska-mcp-server (#12, #21), so Group 4 appears largely complete pending a confirmation pass.

**Design decisions locked at L-surface atom-shape close (2026-05-19, cc-agent-E Phase G).** Five cross-cutting decisions carry forward to any future atom-shape work in this product line:

- **State-as-field with declared event types.** Workflow atoms (L1 response-task, L3 deliverable-letter, L4 detail-callout-spec) carry current state as a field; the atom is the single source of truth, and the storage event log carries the audit chain via declared `eventTypes` on the registration. The one inline-history exception is L5's `statusHistory` chain — the dispatch specifically called for a queryable ESR-status chain on the atom because a verifier holding one atom version benefits from not walking the version chain.
- **Discriminated unions key on the discriminant.** L4's `spec` payload is a Zod `discriminatedUnion` on `detailType` (`door-schedule` / `wall-section` / `wall-type` / `room-finish`). The enum IS the discriminant — no redundant flat field — so atom and spec can't drift.
- **Advisory helpers, not runtime enforcement.** `deliverableLetterCompleteness` (L3) and `isLegalPushTransition` (L4) are exported helpers consumers consult; the engine atom-registry enforces nothing at runtime. Keeps the registry a pure declarative surface.
- **Leaf composition throughout.** All six L-atoms use `composition: []`. Cross-atom references (`findingId`, `sourceLetterRef`, per-section provenance) are data fields consumers resolve themselves — the contract's flat `dataKey` composition model doesn't fit nested or single-ref provenance cleanly, and keeping them leaf is consistent.
- **`accessPolicy: "tenant-private"`** for every L-atom — engagement workflow data, never public-catalog atoms (per ADR-017).

**Rendering / advanced capture (note 2026-05-19).** mnml.ai integration depth, image-to-BIM, image-to-CAD all descoped to [`41_advanced_capture_features.md`](41_advanced_capture_features.md) with explicit activation gate (post-sprint, post-first-QA-cycle). Existing mnml.ai code at `routes/renders.ts` stays env-gated and available for ad-hoc use; the descope is sprint-scope, not feature removal.

**What QA-readiness does NOT require:**

- B1–B5 full taxonomy — only B1 minimum needed for QA; full taxonomy is v1.0 GA criterion.
- mnml.ai photorealistic deep integration — per `41_advanced_capture_features.md` activation gate.
- External pilot firm anything — Phases 4–5.

## Phases

### Phase 1 — Foundation (NOW)

Work already underway plus near-term setup. Parallel-eligible streams.

| Stream | Scope | Source | Effort |
|---|---|---|---|
| **27-A.** Module boundary refactor in `api-server` | Per [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) Stream A | Engine plan | M |
| **27-B.** Atom registry implementation (DA-side atoms first) | Per `27_*` Stream B; **L1-L6 Cortex atom set complete 2026-05-19** at `@hauska-engine/atoms@0.6.0` (7 atom types: `response-task` L1, `sheet-content-extraction` + `attached-document` L2, `deliverable-letter` L3, `detail-callout-spec` L4, `product-spec-reference` L5, `deliverable-letter-render` L6). Remaining Stream B scope: Bump 1 code-corpus atoms (6) + adjudication-context atoms (3) + Codex-side atoms (3, minus deferred `audit-trail-anchor` and the consolidated `per-reviewer-learning` ↔ `per-reviewer-pattern`). | Engine plan | L |
| **27-C.** Engine output quality — DA scenarios | Per `27_*` Stream C; scenarios drawn from active test projects | Engine plan | M (ongoing) |
| **27-D.** Corpus depth — Grand County IRC full | Per `27_*` Stream D; full IRC ingestion (current state: only R301.2.1 / 14 atoms) | Engine plan | M |
| **27-G.** Brand migration (Design Accelerator → Cortex side) | Per `27_*` Stream G; "Design Accelerator" → "Cortex" rename (smaller half — single AGENTS.md occurrence today; new code/UI use Cortex going forward). Coordinated with Plan Review → Codex (Codex side) in same stream. | Engine plan | (S; included in M-effort Stream G) |
| **DA-1.** Test project data verification | `SELECT` against deployment Neon to verify Alexander 404, Balsley, Dart Frog presence; seed Arena Roja R1 if QA wants it as a test project | This plan | S |
| **DA-2.** Continue W0–W3 wave plan | Existing legacy-design-tools wave plan (foundation / Grand County parcel briefing + 3DEP / neighboring context + mnml.ai / client comments + two-way flow). Per repo vocabulary; not re-specified here. | Existing roadmap | L (multi-sprint) |
| **DA-3.** Production code atom count verification | Resolve open question in `10_ground_truth.md` — verify production Neon corpus count vs helium dev's 479 | This plan | XS |
| **DA-Test-Iso.** Test isolation cleanup | Resolve 4 timestamped `test_<unix_timestamp>_<8hex>` schemas accumulating on production-shared Neon (each mirrors public schema minus 1 table — likely integration test framework using schema-per-test against production-shared connection). Recommend separate test DB or in-memory fixtures. Footgun shape similar to MyGov raw-records on Replit dev DB; smartcity-side analog (MyGov raw-records audit on Empressa Neon) is stabilization sprint WS-4. | This plan + recon | M |
| **DA-BIM-Symmetry.** IFC ingest produces `bim-model` atom | **Shipped 2026-05-19** via legacy-design-tools PRs #28 (merge `5fc1894`) + #29 (event-types order fix + reviewer_requests ULID schema fix). `ensureBimModelAndEmitIfcIngestEvent` UPSERT preserves Push-to-Revit state; new `bim-model.ingested-from-ifc` event type appended (append-only order restored post-PR-#28 regression). Neon prod schema applied 2026-05-19 (Track B IFC schema — `snapshot_ifc_files` + `materializable_elements` Track B columns + 2 CHECK constraints + 4 FKs + 2 partial indexes). Clarification 2026-05-21: that schema apply landed on the Replit-side Neon. The post-cutover production database `cortex-prod` did not receive the Track B IFC schema, nor drizzle migrations 0009-0014, until the QA-04 session 2026-05-21 applied them directly (see [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md) WSA.3). Revit IFC retry: QA-04 Part 2 cleared the schema gap, the web-ifc module resolution (PR #57), and the container OOM (PR #58), but IFC upload stays blocked behind QA-16, the main-thread parse isolation. **Open follow-on**: materializable-element delete-and-reinsert on IFC re-ingest stays open per ADR-001 (`27_*` carries the spec). | 2026-05-18 plan-review engine recon §6 + Nick clarification | S (closed) |

**Phase 1 gates.** Streams 27-A through 27-D and 27-G follow gates in `27_engine_evolution_plan.md` (27-G gated on PR #17 landing). DA-1, DA-2, DA-3, DA-Test-Iso have no external gates.

**Phase 1 exit criteria:**

- New DA-side atoms in registry; contract version bumped (single minor bump per `27_*`).
- Module boundary refactor verified per `27_*` Stream A verification.
- Test project data trustable (all 5 projects in seed.ts, or projects dropped from test set if not material).
- Production code atom count documented.
- Test isolation footgun resolved (no more accumulating `test_*` schemas on production-shared Neon).
- W0–W3 wave plan progress at the level the existing repo roadmap targets (does not need 100% — wave plan continues into Phase 2).

### Phase 2 — QA enablement

Closes customer-zero gaps (L1, L2, L3, L6) and lands B1 taxonomy minimum. Turns "running DA" into "doing detailed QA on DA."

| Stream | Scope | Source |
|---|---|---|
| **DA-4.** Sheet content extraction pipeline (L2) | **Atom shapes locked 2026-05-19** at `sheet-content-extraction` + `attached-document` (Lane A.2 Phase B, atoms 0.2.0). **MCP tool surface shipped** at `cortex/sheet_content_extraction_*` + `cortex/attached_document_*` (Lane B Group 3 PR #7). Endpoints + UI **shipped 2026-05-20** in Lane C.4 (PR #51): endpoints persist in legacy-design-tools Postgres per Sprint Amendment 6; UI consumes both endpoints and atom shapes; plan-review compare workflow surfaces extracted content + annotations + supporting-doc panel. | Customer-zero L2 |
| **DA-5.** File export pipeline (L3 + L6) | **Atom shapes locked 2026-05-19** at `deliverable-letter` (L3, atoms 0.3.0) + `deliverable-letter-render` (L6, atoms 0.6.0). **L6 reframe per Sprint Amendment 6**: render output IS its own atom (DID-validated `sourceLetterRef` to L3 atom; `sourceLetterVersion` pins rendered-against-version per ADR-011; opaque `blobRef` to stored bytes; multi-render 1-to-many off one letter). **MCP tool surface shipped** at `cortex/deliverable_letter_*` (L3, PR #8) and `cortex/deliverable_letter_render` (L6, PR #11). DOCX/PDF render pipeline **shipped 2026-05-20** in legacy-design-tools (Lane C.4: L3 endpoints + UI PR #48, L6 render PR #51); it was runtime-layer work, out of engine atom-registry scope. Per-section provenance (each section names exactly the L1 / L2 / finding / adjudication atoms that fed it) lands at atom-shape; `deliverableLetterCompleteness()` advisory helper gates the "send" action server-side. | Customer-zero L3 + L6 |
| **DA-6.** Task state UI (L1) | **Atom shape locked 2026-05-19** at `response-task` (Lane A.2 Phase A, atoms 0.1.0). State enum `open` / `in-progress` / `done` / `cancelled` carried as a field with declared audit event types (per the design-decisions subsection above). **MCP tool surface shipped** at `cortex/response_task_*` (Lane B Group 3 PR #6). **Endpoints + UI shipped 2026-05-20** (Lane C.4, PR #46); the surface-location decision (design-tools vs plan-review side) was settled in that PR. Persistent state surviving session reload is a hard requirement per the QA-readiness 8-point definition. | Customer-zero L1 |
| **DA-7.** B1 taxonomy minimum | Settle "where does B1 classification live" (server-side in `api-server` is the natural home per `40_*`). Implement B1 — basic bidirectional code-tagging — sufficient for QA finding classification. B2–B5 stay aspirational. | `40_design_accelerator.md` |
| **DA-8.** QA scenarios documentation | Write the QA scenario set: which projects, which workflows, expected atom outputs at each step, what "wrong" looks like for each. This is the durable QA spec; future regression tests run against it. | This plan |
| **DA-9.** Compliance pass quality on Grand County IRC | Per `27_*` Stream C, focused on QA scenarios. Goal: Musgrave compliance check produces findings Nick can structurally critique. | Engine plan |
| **DA-MCP-Cortex.** Cortex MCP tool surface co-design (L1-L6 + existing-product tools) | **All tool surface work shipped 2026-05-19**: 4 Cortex existing-product tools (Group 2, PR #3 `b2e224e`), 4 Codex existing-product tools (Group 1, PR #2 `fe58d8b`), `list_jurisdictions` visibility filter (Group 5, PR #4 `c866b00`), 24 L-surface tools across L1-L6 (Group 3, PRs #6/#7/#8/#9/#10/#11). 32 tools live on `hauska-mcp-server` main. Per Sprint Amendment 6: cc-agent-M's `legacy-client.ts` defined the L-surface endpoint contract (mocked-fetch tested), canonical contract doc at [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md); cc-agent-C **shipped** the matching legacy endpoints in Lane C.4 (PRs #44/#45/#46/#48/#50/#51, merged 2026-05-20). **Group 4 cross-client verification** (auth wiring per-product tier checks; MCP Inspector + Claude Desktop + Cursor round-trips for all 32 tools; end-to-end multi-tool flow on a fixture engagement) was gated on Lane C.4 close; C.4 is now closed, and hauska-mcp-server #12 (MCP-side conformance test) and #21 (cross-client matrix) shipped, so Group 4 appears largely complete pending a confirmation pass. | Sprint decision; this plan |
| **DA-IN-APP-AGENT.** In-app Cortex chat tool-use | The in-app chat panel (`chat.ts`) gets Anthropic tool-use wired to cortex-api's own L-surface and read endpoints: platform read-awareness plus direct write-back to L1/L4/L5 atoms. Net-new and distinct from DA-MCP-Cortex, which is the external MCP tool surface; this is the in-app human-UI agent side. Scoped and dispatched 2026-05-20 as WS-C of the Cortex QA backlog per [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md). A QA-experience enhancement, not a Phase-2-exit gate. | Cortex QA backlog WS-C |

**Phase 2 gates:**

- **DA-4 / DA-5 / DA-6 — endpoints + UI shipped in Lane C.4** (legacy-design-tools PR #46 L1 + PR #51 L2-L6 consolidated, both merged 2026-05-20). Atom shapes were locked at atoms 0.2.0 / 0.3.0 + 0.6.0 / 0.1.0. **Correction 2026-05-22:** the prior text marked these "gated on Lane C.4"; #46/#51 predate the `_inbox/` courier protocol and never reached this doc. The DA-4 / DA-5 / DA-6 stream rows above still carry the stale "Lane C.4 scope, gated" language and need a row-level reconciliation pass.
- DA-7 depends on B1 design decision (location: api-server confirmed; schema: TBD this phase).
- DA-8 can start as soon as Phase 1 streams produce evaluable engine output.
- DA-MCP-Cortex shipped; the Group 4 cross-client verification was gated on Lane C.4 close. Lane C.4 is now closed (PRs #46/#51), so Group 4 is unblocked.

**Phase 2 exit criteria — this IS the QA-readiness milestone:**

- Nick can run Musgrave through DA end-to-end per the 8-point definition above.
- All QA scenarios in DA-8 are executable.
- Bugs found are pointable-at-atoms, not vibes.

### Phase 3 — Stretch QA features

Raises bar above QA-readiness. Not strictly required for QA but converts QA from "can do" to "deliverable-comparable to a human-only workflow."

| Stream | Scope | Source |
|---|---|---|
| **DA-10.** Revit content push (L4) | `detail-callout-spec` atom production + Revit add-in consumer via APS Design Automation API. Pre-drawn detail library backing (open decision in `27_*`). | Customer-zero L4 |
| **DA-11.** Live ICC-ES verification (L5) | `product-spec-reference` atom with live ESR status. ICC-ES integration mechanism (open decision in `27_*`). | Customer-zero L5 |
| **DA-12.** Render output quality | mnml.ai integration depth: pose control, material fidelity, lighting consistency. Goal: client-presentation-grade. | DA wave plan W2 |
| **DA-13.** Performance work | Per `27_*` Stream F — gated on pilot baseline; deferred until Phase 4 produces data. | Engine plan |

**Phase 3 gates:**

- DA-10 gated on detail library backing decision.
- DA-11 gated on ICC-ES integration mechanism decision.
- DA-13 gated on Phase 4 pilot data.

**Phase 3 exit criteria:**

- Detail callout pushes to Revit successfully on a Musgrave detail.
- ICC-ES verification updates ESR status on a `product-spec-reference` atom in real time.
- Render quality acceptable for client-facing delivery.

### Phase 4 — Empressa Moab customer-zero pilot (post-QA)

QA verified. Empressa runs the full Moab workload through DA at production fidelity. Friction surfaces during pilot become Phase 4.5 hotfixes; structural issues become Phase 5 prerequisites.

| Stream | Scope |
|---|---|
| **DA-14.** Empressa daily-use rollout | Musgrave, Seguin, Arena Roja R1, and any new Moab Empressa projects run through DA. Daily-use velocity tracked. |
| **DA-15.** Friction log → backlog | Every friction point during pilot logged; classified as hotfix (Phase 4.5), Phase 5 prereq, or future-roadmap. |
| **DA-16.** Pilot performance baseline | Performance data captured for `27_*` Stream F. |
| **DA-17.** Customer-zero rotation decision | Decide whether Empressa-doing-self-review on these projects is also Codex 1a customer-zero (compounding both pilots) or whether they're mutually exclusive. Settled here because it affects which atoms get exercised. |

**Phase 4 exit criteria:**

- Empressa team using DA on every active project (no fallback to ad-hoc workflows).
- Friction log is actionable (every entry triaged).
- Performance baseline documented.

### Phase 5 — External pilot

Sales motion is a separate planning surface; this phase is the product-side prep.

| Stream | Scope |
|---|---|
| **DA-18.** External pilot firm criteria | Document selection criteria: firm size, jurisdiction set, Revit version, existing tool stack. |
| **DA-19.** External pilot onboarding playbook | What the firm needs to do; what we do for them; success criteria; commercial structure. |
| **DA-20.** Multi-tenancy implications | Single-customer (Empressa) → multi-customer means tenant isolation per ADR-005 (queued) + cross-stakeholder per ADR-007. Spec firm-side tenancy for DA (separate from Codex firm tenancy but shares model). |

**Phase 5 gates:**

- ADR-005 multitenancy migrated and extended.
- Pricing decision made.

### Phase 6 — GA

Public launch. Full feature set including B1–B5 if v1.0 still requires it (revisit at Phase 6 entry).

| Stream | Scope |
|---|---|
| **DA-21.** v1.0 launch criteria | Documented feature set, performance bar, support commitments. |
| **DA-22.** Pricing publication | Public pricing live. |
| **DA-23.** B1–B5 full taxonomy | Only if v1.0 still requires it at Phase 6 entry. |

## Gates and dependencies

- **Phase 1 → Phase 2.** Atom registry expansion complete (27-B); module boundary refactor done (27-A); test project data verified (DA-1); test isolation footgun resolved (DA-Test-Iso).
- **Phase 2 → Phase 3.** QA scenarios in DA-8 passing on active test projects.
- **Phase 3 → Phase 4.** Stretch fixes verified (DA-10/11/12); Empressa team confident to run all Moab work through DA.
- **Phase 4 → Phase 5.** Empressa pilot stable; Phase 4 friction log down to acceptable backlog.
- **Phase 5 → Phase 6.** 2–3 external pilots converted to paying customers; ADR-005 + DA tenancy spec landed.

**Cross-track dependencies:**

- Migration sprint (parallel-track planner) Phase 1B Stage 2 / 1C close out the legacy-design-tools Neon swap. Doesn't gate DA program plan work, but DA work must coexist (no schema changes that conflict with cutover).
- ADR-008 engine factor-out (gated on migration Phase 2C — the SmartCity OS swap). When it closes, DA streams in `27_*` continue in the `hauska-engine` repo. Relocation, not workstream change.
- SmartCity OS Stabilization Sprint WS-4 (MyGov raw-records audit on Empressa Neon) is the smartcity-side analog of DA-Test-Iso. Coordinate findings if test-isolation pattern proves to be portfolio-wide.

## Verification per phase

| Phase | Verification |
|---|---|
| 1 | New DA-side atoms in registry per `27_*`; module boundary refactor verified per `27_*`; all active test projects in seed.ts or removed from test set; production corpus count documented; test isolation pattern remediated; W0–W3 wave plan at existing roadmap targets |
| 2 | Musgrave run end-to-end per QA-readiness 8-point definition; DA-8 scenario set executable; bugs are pointable-at-atoms |
| 3 | Detail callout pushes to Revit; ICC-ES verification updates ESR status real-time; render quality client-presentable |
| 4 | Empressa daily use on all active projects; friction log triaged; performance baseline captured |
| 5 | External pilot firms onboarded; multi-tenancy spec live |
| 6 | v1.0 GA launched; pricing public |

## Open decisions

- **B1 schema** — location confirmed (api-server) but schema not designed. Resolution required to start Phase 2 DA-7.
- **L+ input UX scope** — file attach + screenshot paste. Per `40a_*`, may be a Claude.ai platform concern vs DA product concern. Clarify before Phase 2 starts (Nick decides whether to scope into DA-4 or defer entirely).
- **ICC-ES integration mechanism** — also open in `27_*`. Required before Phase 3 DA-11.
- **Detail library backing** — also open in `27_*`. Required before Phase 3 DA-10.
- **Customer-zero rotation** — Empressa as DA customer-zero AND Codex 1a customer-zero simultaneously, or sequential? Decided in Phase 4 DA-17 but worth surfacing now.
- **Test isolation replacement** — separate test DB vs in-memory fixtures vs schema-per-test on a dedicated test connection. Sprint-level call when DA-Test-Iso executes.
- **External pilot firm criteria** — Phase 5 prerequisite; can be drafted earlier.
- **v1.0 launch criteria specifics** — Phase 6 prerequisite; can be drafted earlier.
- **Pricing strategy** — Phase 5/6 prerequisite; coordinate with `14_pricing_framework.md`.
- **Doc rename timing** — `42_design_accelerator_program_plan.md` → `42_cortex_program_plan.md` after `40_*` migrates. Out of scope for `27_*` Stream G; tracked here for awareness.

## References

- [`40_design_accelerator.md`](40_design_accelerator.md) — DA product home (current state context)
- [`40a_customer_zero_observations_arena_roja_2026_05_06.md`](40a_customer_zero_observations_arena_roja_2026_05_06.md) — customer-zero observations driving Phase 2/3 fixes
- [`41_revit_connector.md`](41_revit_connector.md) — companion Revit add-in (consumer of `detail-callout-spec`)
- [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) — shared engine work stream + atom registry expansion (includes Stream G brand migration)
- [`48_codex_program_plan.md`](48_codex_program_plan.md) — sister program plan, Codex side
- [`10_ground_truth.md`](10_ground_truth.md) — current implementation state, fires
- [`11_roadmap.md`](11_roadmap.md) — portfolio working checklist
- [`14_pricing_framework.md`](14_pricing_framework.md) — pricing framework (Phase 5/6 input)
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) — atom contract
- [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md) — access scopes for multi-tenancy
- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md) — engine factor-out timing
- Migration sprint coordination: parallel-track planner manages legacy-design-tools migration (Phase 1B Stage 2, 1C, Phase 3) — see their session summaries in `_sessions/`.

## Revision history

- **2026-05-11 (origin):** drafted during comprehensive planning session. Establishes phased roadmap from current state through GA, with QA-readiness as the Phase 2 exit milestone. Phase 1/2 streams concrete; Phases 3–6 lighter detail with refinement as earlier phases land. Cortex rebrand acknowledged; DA-Test-Iso stream added in same-session audit pass. Companion to `27_engine_evolution_plan.md` (shared engine work) and `48_codex_program_plan.md` (Codex side).
