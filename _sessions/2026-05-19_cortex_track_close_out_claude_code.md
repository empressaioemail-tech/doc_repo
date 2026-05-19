---
id: 2026-05-19_cortex_track_close_out_claude_code
title: Session — Cortex-track close-out (UI inventory through DA-BIM-Symmetry to UI-2 to Neon schema fix)
date: 2026-05-19
agent: claude_code
session_type: cortex_track_close_out
related: [_sessions/2026-05-18_cortex_ui_inventory_cc-agent-UI, _sessions/2026-05-18_plan_review_engine_inventory_cc-agent-PR, _sessions/2026-05-18_eval_harness_cc-agent-EVAL, _sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC, _sessions/2026-05-19_findings_mock_to_real_cc-agent-UI-2, _dispatches/2026-05-19_cc-agent-UI-2_findings_mock_to_real, 40_design_accelerator, 42_design_accelerator_program_plan, 27_engine_evolution_plan, 47_codex_plan_review, 90_runbooks/cc_agent_node_tls_workaround]
---

# Cortex-track close-out — UI inventory through DA-BIM-Symmetry to UI-2 to Neon schema fix

Session spanning 2026-05-18 through 2026-05-19. Operator: Nick. Planner: this Claude Code session in doc_repo. Six cc-agent dispatches executed (cc-agent-UI, cc-agent-PR, cc-agent-EVAL, cc-agent-BIM x2, cc-agent-UI-2) plus one cross-planner sync round-trip with the substrate-v1 planner. Eight commits to doc_repo origin/main on the Cortex-track side. Two legacy-design-tools PRs merged (DA-BIM-Symmetry + ULID array-order fix). One Neon prod schema write applied via supervised non-force drizzle-kit push. Two real regressions surfaced as follow-on. One Fire closed.

## TL;DR

The Cortex-track moved from "the 3D stack is broken, we don't know why" to a verified BIM viewport story where: the actual stack is Leaflet 2D + Three.js GLB (not Cesium); IFC ingest now produces a `bim-model` atom symmetrically with Push-to-Revit; the user-visible symptom was traced to Neon prod missing the Track B `snapshot_ifc_files` table (despite ground-truth doc claiming otherwise); schema fix is applied; Revit retry is the remaining verification step. In parallel, the plan-review findings mock-bridge — the single largest UI/engine integration debt — was swapped for the real Orval client (170/170 tests pass; awaiting PR open). And several substrate-v1 milestones landed in the same window (Sync 1 closed via npm publish, Bump 1 cross-PR rollout merged, Sync 4 fired via Grand County partial passing 90/100/95).

## Session arc

### Phase 1 — Cortex recon (2026-05-18)

Operator question: "what can we do in parallel to the substrate-v1 agents?" Pointed at the Cortex (design-tools) app surface. Initial framing was "3D visualization stuff is broken."

Five distinct surfaces surfaced when scoping: CesiumJS in-browser scene, 3DEP elevation, web-ifc viewer, mnml.ai render pipeline, viewpoint-render / render-output atom consumption. Two read-only recon dispatches drafted to inventory current state vs intended state:

- **cc-agent-UI** — full UI inventory across `design-tools`, `plan-review`, `qa`, `mockup-sandbox` artifacts (50 surfaces classified). Output at [`_sessions/2026-05-18_cortex_ui_inventory_cc-agent-UI.md`](2026-05-18_cortex_ui_inventory_cc-agent-UI.md).
- **cc-agent-PR** — full plan-review engine pipeline inventory (59 stages). Output at [`_sessions/2026-05-18_plan_review_engine_inventory_cc-agent-PR.md`](2026-05-18_plan_review_engine_inventory_cc-agent-PR.md).

Both shipped read-only with the explicit "do not change code, do not improvise around blockers" discipline.

### Phase 2 — recon findings (2026-05-18)

The UI inventory's cross-cutting findings were load-bearing:

1. **Cesium never wired.** Not removed — never shipped. `design-tools` ships Leaflet 2D + Three.js GLB. Doc 40 lists Cesium as "load-bearing external service." This was the largest doc-vs-code divergence found.
2. **APS has zero imports.** Doc 40 says "paid tier active." Code grep returns nothing.
3. **L1 retired in Task #479.** Architect-side `/response` write paths actively removed; Doc 42 DA-6 still calls for response-task UI.
4. **L2 / L3 / L4 / L5** all unimplemented at UI layer (no surfaces).
5. **Plan-review findings list mock-bridged.** `plan-review/src/lib/findingsApi.ts` bridges through `lib/findingsMock.ts` despite 8 real server endpoints in `routes/findings.ts`. **Largest UI/engine integration debt in repo.**
6. **Reclassify endpoint UI missing.** Server-side at `routes/submissions.ts:421-632`; zero frontend callers.
7. **No global ErrorBoundary, dead 404, gateway-assumed auth.** Three small SPA hygiene fixes.

The engine inventory's verdicts were equally clarifying:

- **BIM analysis verdict: nominally analyzable, structurally incapable of geometric reasoning.** LLM sees entity metadata only — no dimensions, setback intersection, or height check against parsed BIM.
- **Sheet analysis verdict: partial.** Claude Sonnet 4.5 vision OCR works; structured annotation extraction (revision clouds, dimension callouts, schedules) missing.
- **Mode-aspirational architecture.** Doc 40's "same engine, two surfaces" (incremental <5s / full-pass 30-120s) is doc-only — one code path serves both.
- **Pure-LLM compliance everywhere.** No rules pass, no structural fallback. Single Anthropic call per analytical surface.
- **Atom registry still at 19** from 2026-05-05. Bump 1 atoms unbuilt at recon time, gated on cc-agent-AC.
- **`bim-model` atom asymmetry** — produced on Push-to-Revit but NOT on IFC ingest. Surfaced as candidate Bump 1 fix.
- **Side-intel for cc-agent-E**: 7 packages portable as-is, 5 need careful porting, 7 should be designed fresh in `hauska-engine` (mode handling, rules layer, geometric reasoning, graph retrieval, eval harness, cost/telemetry, tool-use retrieval).

### Phase 3 — UI-3 doc reconciliation (2026-05-18)

Operator sequenced UI-3 (doc reconciliation) as the next move while data was fresh. Operator clarifications resolved open questions:

- **L1**: confirmed in scope by Nick (despite Task #479 retirement of architect-side `/response`).
- **APS**: "I have full access to APS" — reframe from "paid tier active, load-bearing" to "access available, not currently integrated." Integration is the gap, not access.
- **Mode distinction**: gate as currently aspirational, design-fresh in `hauska-engine`. Don't strike — keep the architectural intent.
- **Materializable-element delete-and-reinsert**: stays open as ADR-001 follow-on.
- **IFC ingest UI bug**: real — surfacing as `bim-model` atom asymmetry. Lands in Bump 1 window as `DA-BIM-Symmetry` stream in 42.

Surgical edits applied across 40, 42, 27, 47. New `90_runbooks/cc_agent_node_tls_workaround.md` runbook for the `NODE_OPTIONS=--use-system-ca` workaround surfaced independently by cc-agent-E, cc-agent-M, and cc-agent-AC during substrate v1 work. Commit `61048d0` + `6f0a1c1`.

### Phase 4 — Engine-C eval harness dispatch (2026-05-18)

After the recons cleared, Engine-C eval harness was the highest-leverage next dispatch — Phase 2 QA-readiness gating per Doc 42, parallel-safe against all three substrate-v1 agents.

cc-agent-EVAL dispatch shipped: built `@workspace/eval` package (pure rubric scorers + 21 unit tests; runners for finding/briefing/retrieval; instrumented Anthropic wrapper that does NOT modify `lib/integrations-anthropic-ai/`; CLI; aggregator). Three schema tables (`evalRuns` / `evalScores` / `evalBaselines`) wired into `lib/db/src/schema/index.ts`. Warn-only CI workflow scaffolded.

**Output landed on legacy-design-tools branch `feat/eval-harness` (commit `5f5b84c`). PR #26 opened against main.** Three blockers correctly held: B1 Arena Roja R1 SCA comments missing from doc_repo, B2 workstation env unprovisioned, B3 pre-existing Windows vitest rollup-win32 exclusion. Doc_repo commit `e5f3cb4` captured the session summary.

**Significant later finding**: PR #26 never merged (still open as of session close). All eval-related schema work (the three tables) and the rubric exports are stuck on the feature branch. This is the root of the eval schema regression discovered in Phase 8.

### Phase 5 — Cross-planner sync (2026-05-18)

The substrate-v1 planner (running cc-agent-AC, cc-agent-E, cc-agent-M) had been operating in a separate planner thread. Cortex/engine recon stream needed to align: where is the substrate-v1 fleet, what's blocking, what should come next.

Round-trip sync produced six closed items:

1. **Option-β scope correction** for atom-type registration. cc-agent-AC initially scoped to port the 19 existing atoms into `@hauska/atom-contract`. cc-agent-AC's pre-code recon found the framework package is framework-only by design; 19 existing atoms have `@workspace/db` + route-helper runtime deps that anchor them in legacy-design-tools api-server. Corrected split: **19 existing stay in legacy-design-tools/artifacts/api-server/src/atoms/**; **6 new MCP-exposed in hauska-engine/packages/atoms/** (code-section, code-definition, code-amendment, code-cross-reference, code-edition, jurisdiction-corpus); **3 new adjudication-context in smartcity-os Codex 1b producer surface**.
2. **Eval harness siblings**: cc-agent-E's catalog-quality eval (retrieval/coverage/cross-ref per 49 §B.4) and cc-agent-EVAL's plan-review-correctness eval are different domains. Pre-port, siblings in different repos. Rubric merges later when EVAL's durable assets port to `hauska-engine`.
3. **"Bump 1" namespace disambiguation**: "Bump 1 window" (post-Sync-1 unlock for Cortex-track work, what DA-BIM-Symmetry rides) is distinct from "Bump 1 cross-PR rollout" (substrate-v1 planner's 5-repo coordinated pin update). Wording tightened in 42 + 27.
4. **Load split**: substrate-v1 planner takes 51/27/26/ADR-018 doc-surgery (the "contract version bump" rename to "atom registry version bump"); Cortex side takes TLS runbook entry.
5. **5-repo Bump 1 rollout** agreed as next post-Sync-1 action; substrate-v1 planner coordinates.
6. **Sync 1 signal** committed by substrate-v1 planner the moment npm publish lands.

Doc_repo commit `6f0a1c1` captured the close-out (option-β correction in 00, 42 + 27 wording tighten, new TLS runbook, last_updated). cc-agent-AC session summary committed by substrate-v1 planner as `7499578` on doc_repo.

### Phase 6 — Sync 1 publish, then DA-BIM-Symmetry (2026-05-19)

`npm publish` of `@hauska/atom-contract@1.0.0` cleared Nick's npm-login auth issue. Sync 1 fired. Substrate-v1 planner squash-merged hauska-engine #1 + legacy-design-tools #27 (the pin updates). Doc-sweep across 51 + 27 + 26 + ADR-018 applied option-β framing. Sync 6 removed (TX IP attorney deprioritized).

DA-BIM-Symmetry dispatch drafted for cc-agent-BIM. Scope: IFC ingest in `legacy-design-tools/artifacts/api-server/src/lib/ifcIngest.ts:227-399` produces a `bim-model` atom alongside the existing materializable-element rows and glTF bundle. Symmetric with Push-to-Revit. One-repo behavior fix; not part of 5-repo cross-PR rollout.

cc-agent-BIM shipped **PR #28** (merge commit `5fc1894`): `ensureBimModelAndEmitIfcIngestEvent` helper UPSERTs `bim_models` row preserving Push-to-Revit state, appends new `bim-model.ingested-from-ifc` event. 6 tests green locally. 2 chore commits for eval-scaffold drift (schema fixture template + integration test list extension — necessary unblock).

CI was red on PR #28 — 3 pre-existing failures in `bim-models.test.ts`. cc-agent-BIM's first sign-off claimed these were "pre-existing main breakage." **This claim was wrong.** PR #28 merged. cc-agent-BIM then re-dug and shipped **PR #29** (branch `fix/bim-model-event-types-order`):

- **Commit 1 (the real fix)**: PR #28 had inserted the new event type at index 1 of `BIM_MODEL_EVENT_TYPES` array. `routes/bimModels.ts:103-110` reads from that array by index. PR #28 had broken 3 prior-green tests through that index reordering. Commit 1 restored append-only ordering with a load-bearing docstring noting the index-pinning.
- **Commit 2 (cleanup)**: changed `reviewer_requests.triggered_action_event_id` from `uuid()` to `text()` — the original ULID/UUID hypothesis from the dispatch was real but a separate bug (every implicit-resolve UPDATE was silently failing type validation).

Both PRs merged 2026-05-19. Doc_repo commit `58bdf20` captured the state including the Cloud Run Phase 1A scaffold finding (legacy-design-tools build-and-push workflow + canary deploy workflow exist; production target still Replit autoscale).

**Diagnostic lesson captured**: the planner accepted the agent's "pre-existing" claim without verification. PR #29's diagnosis correction proved PR #28 caused them. Future practice: do not ratify agent self-reports of "pre-existing" failures without tracing to a pre-PR commit. Lesson amplified later in Phase 7 (re Neon ground-truth claim).

### Phase 7 — Viewport verification + Neon prod schema fix (2026-05-19)

Operator deployed main to Replit autoscale at `prompt-agent-accelerator.replit.app` to verify the BIM viewport renders post-IFC-upload. Revit IFC POST against snapshot `1e01ae34-8062-4dd9-bbeb-f5219db035e4` returned **HTTP 500**. Sheets uploaded 20/20 fine; IFC failed.

Cloud Run logs returned empty (gcloud query against the snapshot ID had zero hits) — confirming the IFC POST hit Replit, not Cloud Run. Pivoted to Replit logs.

Replit logs traced the 500 to: `select id, blob_object_path, gltf_object_path from "snapshot_ifc_files" where "snapshot_ifc_files"."snapshot_id" = $1 limit $2` at `routes/snapshots.ts:1010` (called from `ingestSnapshotIfc` at `lib/ifcIngest.ts:260`). Postgres rejected with "relation does not exist."

`to_regclass('public.snapshot_ifc_files')` against `DEPLOYMENT_DATABASE_URL` returned null. **Track B IFC schema was missing on Neon prod**, despite [`10_ground_truth.md`](../10_ground_truth.md) carrying a note claiming "Track B's `track-b-ifc-ingest.sql` was applied to deployment Neon during the 2026-05-04 saga via Replit Agent." That ground-truth note was unverified; today's check proved the SQL never ran on Neon.

**Guardrails applied before write op**:

1. Read Task #526 diff (the recently-merged post-merge.sh Neon guard for Fire 3). Guard takes the "refuse push-force against any Neon URL" shape — matches `*neon.tech` or `*neondb*` and exits 0. Commit message explicitly directs "supervised drizzle-kit push (not --force) from current main, separately." Authorized path: non-force push, bypassing the post-merge hook.
2. Dry-run `drizzle-kit push --strict --verbose` (no --force) against `DEPLOYMENT_DATABASE_URL`. Diff captured:
   - **Track B IFC work**: CREATE snapshot_ifc_files + 6 new materializable_elements columns + 2 CHECK constraints + 4 FKs + 2 partial indexes (matches `lib/db/scripts/track-b-ifc-ingest.sql` 1:1)
   - **Cosmetic**: 3 ALTER DEFAULT statements (users.disciplines, submission_classifications.disciplines, submission_classifications.applicable_code_books) — bring live defaults in line with TS schema
   - **FK rename normalization**: 3 DROP-then-ADD same-target FKs (PG 63-char identifier truncation cleanup; semantically identical)
   - **Zero drops, zero data-loss statements.**
3. Pre-state checks confirmed materializable_elements has 0 rows and 0 CHECK constraints — surgical SQL applies cleanly.

Diff was clean. Authorization given. Applied via `DATABASE_URL="$DEPLOYMENT_DATABASE_URL" pnpm --filter @workspace/db run push` (non-force, per Task #526's commit-message guidance).

Post-push verification all green:
- `to_regclass('public.snapshot_ifc_files')` returns non-null
- 13 columns matching `lib/db/src/schema/snapshotIfcFiles.ts`
- 6 new materializable_elements columns present (engagement_id, source_kind, ifc_global_id, ifc_type, property_set, source_snapshot_id)
- 2 new CHECK constraints + 4 FKs + 2 partial indexes all live
- briefing_id now nullable (NOT NULL dropped as intended)

Revit IFC retry pending as the final verification step.

**Fire 3 closed** via Task #526. **Diagnostic lesson amplified**: don't trust deployed-state claims that predate session-close protocol or were captured by an agent without read-back proof. Verify before assuming.

### Phase 8 — Two schema regressions surfaced (2026-05-19)

Pre-push checks before the Neon write op surfaced two unrelated regressions:

**Regression 1 — eval tables.** cc-agent-EVAL's session summary said `evalRuns` / `evalScores` / `evalBaselines` were wired into `lib/db/src/schema/index.ts`. Current schema grep returned zero references. Neon prod returned null for all three `to_regclass` queries. **Root cause confirmed by Phase 9 screenshot inspection**: PR #26 (the eval harness scaffold) is still OPEN, never merged. The work exists on `feat/eval-harness` branch only. Not a real regression — it's unmerged work that the EVAL session summary described as shipped-to-main. Doc state needs correction; the work itself is fine on the branch.

**Regression 2 — ULID column type.** PR #29 commit 2 claimed to change `reviewer_requests.triggered_action_event_id` from `uuid()` to `text()`. PR #29 merged (not in current open list). But `lib/db/src/schema/reviewerRequests.ts:214` still declares `triggeredActionEventId: uuid("triggered_action_event_id")` and Neon column is still `uuid`. Mystery: either commit 2's diff got dropped during squash, was a partial diff, or there's another reason. Schema and Neon agree (both still `uuid`) so the FE silent-failure mode persists. Investigation needed: `git log --all --oneline -- lib/db/src/schema/reviewerRequests.ts` would show what actually shipped.

Both logged as follow-on. Neither is urgent (eval tables not in active use; ULID UPDATE failure is observable but quiet) but both should land before EVAL-2-through-5 sequencing kicks off and before plan-review override-write paths get stress.

### Phase 9 — UI-2 ship + open PR inventory (2026-05-19)

UI-2 dispatch drafted for cc-agent-UI-2: swap `plan-review/src/lib/findingsApi.ts` mock-bridge for the real Orval client; remove `findingsMock.ts` (732 lines); preserve consumer signatures; use existing test infrastructure (MSW or equivalent) for test mocking.

cc-agent-UI-2 shipped on branch `swap/findings-mock-to-real`:

- `findingsApi.ts` full rewrite — every hook delegates to Orval client
- `findingsMock.ts` deleted (732 lines, zero remaining production consumers)
- `useSubmissionLiveEvents.ts` cleanup — dropped redundant double-invalidation
- New `findingsFetchStub.ts` fetch-spy fixture — in-memory store routes findings URLs through the real client without bypassing it (better than the dispatch's MSW suggestion)
- 8 files modified; 0 UI component changes needed (consumer signatures preserved across FindingsTab, FindingDrillIn, FindingsRunsPanel, OverrideFindingModal, SubmissionDetailModal)
- E2E updated to seed via real `POST /api/submissions/:id/findings` in `beforeAll`

Verification: 170/170 plan-review tests pass across 18 files; workspace typecheck clean across all 6 projects.

Two follow-ons logged out of scope:
- Server's 409 `finding_already_overridden` envelope doesn't carry `resolvedBy` / `resolvedAt` — FE recovers from local cache, loses attribution in cross-tab race (backend fix needed)
- `useFindingsGenerationPolling` could be replaced by reacting to existing SSE `finding.added` stream (UI optimization)

Authorization given for agent to commit + push + open PR. Doc_repo commit `a31c7af` captured the UI-2 ship + Neon schema fix + Fire 3 closure + two regressions in a single bundled commit.

Operator screenshot of legacy-design-tools open PRs surfaced PR #26's open status, confirming the eval schema regression root cause.

## Key decisions

| Decision | Resolution | Rationale |
|---|---|---|
| Repo separation | `legacy-design-tools` is its own repo separate from `hauska-engine` / `hauska-mcp-server` / `hauska-atom-contract` | Operator clarification; matches CLAUDE.md and 00_current_state.md fleet assignments |
| L1 (interactive checkboxes) in scope | Confirmed by Nick; build fresh design despite Task #479 retirement | Capability is needed; the retirement was framing-only |
| APS framing | "Empressa has full APS access available; not currently integrated" | Nick clarified full access; not aspirational |
| Mode distinction in doc 40 | Gate as currently aspirational | Preserves architectural intent; aligned with cc-agent-E side-intel calling mode handling design-fresh |
| Materializable-element delete-and-reinsert | Stays open as ADR-001 follow-on | Append + supersede chain per ADR-011 is the resolution path; not gating Bump 1 |
| bim-model atom symmetry fix | Rides Bump 1 window as DA-BIM-Symmetry stream, NOT in cross-PR rollout | One-repo behavior fix; no contract change |
| Option-β atom-type split | 19 existing in legacy-design-tools api-server; 6 new MCP-exposed in hauska-engine; 3 new adjudication-context in smartcity-os Codex 1b | cc-agent-AC pre-code recon surfaced workspace/db + route-helper anchoring; ratified in cross-planner sync |
| Eval harness siblings | cc-agent-E catalog-quality + cc-agent-EVAL plan-review-correctness in different repos | Different domains; rubric merges when EVAL ports to hauska-engine |
| 5-repo Bump 1 rollout collapse | Two merged (hauska-engine #1 + legacy-design-tools #27) + three deferred to natural next-session moments | Per substrate-v1 planner; consumers fold into next-session work rather than coordinated atomic rollout |
| Neon prod schema fix path | Supervised non-force drizzle-kit push, not push-force, not surgical SQL | Task #526's guard refuses push-force; non-force is the authorized escape hatch; dry-run was clean |
| Sync 6 (TX IP attorney) | Removed per deprioritization | Per substrate-v1 planner |
| Replit vs Cloud Run for verification | Replit (per operator) | Replit is current production target; Cloud Run Phase 1A scaffold landed but no traffic |

## Artifacts produced

### doc_repo commits (chronological, this session contribution to origin/main)

- `49088d2` — cc-agent-UI session — Cortex UI inventory (50 surfaces)
- `d89bb07` — cc-agent-PR session — plan review engine inventory (59 stages)
- `61048d0` — UI-3 doc reconciliation across 40 / 42 / 27 / 47
- `e5f3cb4` — cc-agent-EVAL session — eval harness scaffold (durable assets only; 3 blockers gated)
- `6f0a1c1` — cross-planner sync close-out (option-β correction, Bump 1 wording disambiguation, TLS runbook)
- `7499578` — cc-agent-AC session (committed by substrate-v1 planner)
- `58bdf20` — 00 bump — DA-BIM-Symmetry shipped + Cloud Run Phase 1A scaffold + UI-2 dispatch queued
- `a31c7af` — 00 bump — Neon prod schema applied + UI-2 shipped + Fire 3 closed + 2 regressions

Plus this session summary (`2026-05-19_cortex_track_close_out_claude_code.md`) committed at session close.

### legacy-design-tools changes

- **PR #28** merged (`5fc1894`) — DA-BIM-Symmetry behavior fix
- **PR #29** merged — Array-order regression fix + ULID column type cleanup (commit 2 fate unclear — investigation owed)
- **PR #27** merged (substrate-v1 planner) — Bump 1 atom-contract pin in `lib/empressa-atom/package.json` + README hand-off pointer
- **PR #26** OPEN — cc-agent-EVAL scaffold (eval schema regression source)
- **UI-2 PR** pending — cc-agent-UI-2 `swap/findings-mock-to-real` branch; agent authorized to commit + push + open PR

### Other legacy-design-tools open PRs (from operator screenshot)

- **PR #19** — `chore: gitignore local agent scratch + triage + replit bundle` — unrelated
- **PR #17** — `Track C — IFC viewer + PL-01 layout/copy fix` — Three.js GLB viewer extension; may be relevant to viewport verification
- **PR #12** — `feat(briefing): auto-fire on engagement.created` — older briefing-engine work

### Neon prod schema state

Track B IFC schema applied via supervised `DATABASE_URL=$DEPLOYMENT_DATABASE_URL pnpm --filter @workspace/db run push` (non-force). Specifically:

- `snapshot_ifc_files` table created (13 columns, 3 indexes, FK to snapshots with ON DELETE CASCADE)
- 6 new columns on `materializable_elements` (engagement_id, source_kind, ifc_global_id, ifc_type, property_set, source_snapshot_id)
- 2 new CHECK constraints (source_kind enum, provenance invariants)
- 4 FKs (briefing_id, briefing_source_id, engagement_id, source_snapshot_id)
- 2 partial indexes (engagement_id IS NOT NULL, source_snapshot_id IS NOT NULL)
- 3 cosmetic default alignments (users + submission_classifications)
- 3 FK rename normalizations (DROP-then-ADD same semantics)

Two known unapplied items NOT in current main schema/index.ts:
- eval_runs / eval_scores / eval_baselines (PR #26 unmerged)
- reviewer_requests.triggered_action_event_id type change to text (PR #29 commit 2 mystery)

### New runbooks

- [`90_runbooks/cc_agent_node_tls_workaround.md`](../90_runbooks/cc_agent_node_tls_workaround.md) — `NODE_OPTIONS=--use-system-ca` workaround for `UNABLE_TO_VERIFY_LEAF_SIGNATURE` on Nick's Windows box

### Dispatches landed (in `_dispatches/`)

- [`2026-05-18_cc-agent-EVAL_eval_harness.md`](../_dispatches/2026-05-18_cc-agent-EVAL_eval_harness.md)
- [`2026-05-19_cc-agent-UI-2_findings_mock_to_real.md`](../_dispatches/2026-05-19_cc-agent-UI-2_findings_mock_to_real.md)

cc-agent-UI / cc-agent-PR / cc-agent-BIM (x2) dispatches were given as chat text and not saved to `_dispatches/`. The session summaries cover their content.

## Active fires status (as of session close)

| Fire | State | Notes |
|---|---|---|
| Fire 1 | Closed 2026-05-10 | — |
| Fire 2 | Open | smartcity-os Track B remainder (Verkada, ESRI/ArcGIS, VFD codes) + portfolio Fire 2 git-history scrub |
| **Fire 3** | **Closed 2026-05-19** | **Task #526 merged**; supervised drizzle-kit push (non-force) is the authorized Neon schema escape hatch |
| Fire 4 | Closed pending workspace rename | — |
| Fire 5 | Closes at M-Stabilize Phase 2C cutover | — |

## Outstanding operator items

1. **Trigger Revit IFC retry** against snapshot `1e01ae34-8062-4dd9-bbeb-f5219db035e4`. Expected: 200 + new row in `snapshot_ifc_files` + new atom event `bim-model.ingested-from-ifc` + BIM viewport renders the GLB in design-tools. Closes DA-BIM-Symmetry stream.
2. **Decide PR #26 fate** — merge as-is, split into smaller PRs, or abandon. The eval schema regression resolves either by merging PR #26 (preferred — would land the eval tables in main + complete what cc-agent-EVAL shipped) or by intentional deferral.
3. **Triage open legacy-design-tools PRs** (#19, #17, #12). #17 (Track C IFC viewer + PL-01 layout/copy fix) may be relevant to BIM viewport verification.
4. **Optional**: investigate PR #29 commit 2's actual diff via `git log --all --oneline -- lib/db/src/schema/reviewerRequests.ts`. Mystery: PR claimed ULID change, schema still has uuid.

## Queued dispatches (when bandwidth opens)

| Priority | Dispatch | Effort | Notes |
|---|---|---|---|
| Medium | Schema/index.ts reconciliation | M | Merge PR #26 (eval tables) + investigate PR #29 commit 2 (ULID column type) |
| Medium | TS6305 eval-workflow build-order fix | XS | 3-line workflow YAML tweak; build composite dist before typecheck |
| Medium | 40 doc Cloud Run Phase 1A scaffold update | XS | Pure doc edit; reflect that GHA CI scaffold is live (Phase 1A) |
| Low | UI-1 shell hygiene | XS | ErrorBoundary + wire `not-found.tsx` + auth affordance |
| Low | UI-4 reclassify + EngagementDetail.tsx split | M | Closes reclassify-endpoint-no-UI-caller gap + 5,172-line file refactor |
| High when ready | EVAL-2 DB bring-up | XS | Gated on workstation env (B2 from cc-agent-EVAL session) |
| High when ready | EVAL-3 Arena Roja ground-truth | S | Gated on Nick providing 11 SCA comments (B1 from cc-agent-EVAL session) |
| Gated | EVAL-4 baseline capture + CI activation | S | Gated on EVAL-2 + EVAL-3 + Anthropic spend authorization |
| Bigger | L1 fresh design (response-task atom + UI) | M | Surface location decision needed (design-tools vs plan-review) |
| Bigger | L2 sheet-content-extraction + attached-document atoms | M | Now-unblocked atom additions per Bump 1 window |
| Bigger | L3 / L4 / L5 customer-zero fixes | L | Atoms unblocked; UI integration work |
| Bigger | BIM viewport UI follow-on | TBD | Only triggers if Revit retry shows viewport doesn't render post-Neon-fix |
| Bigger | materializable-element re-ingest semantics fix | M | ADR-001 chain fix per ADR-011 |

## Diagnostic lessons captured

1. **Do not ratify agent self-reports of "pre-existing" failures without tracing to a pre-PR commit.** Surfaced in PR #28 sign-off. cc-agent-BIM claimed 3 failing tests were "pre-existing main breakage"; planner accepted. PR #29's deeper dive proved PR #28 caused them through array-index reordering. Cost: false sign-off, double-PR cycle.

2. **Do not trust deployed-state claims that predate session-close protocol or were captured by an agent without read-back proof.** [`10_ground_truth.md`](../10_ground_truth.md)'s note that "Track B's `track-b-ifc-ingest.sql` was applied to deployment Neon during the 2026-05-04 saga via Replit Agent" was unverified ground truth. Today's `to_regclass` check proved the SQL never ran on Neon. Cost: hours of viewport-debugging downstream from a false premise. Verifying that claim earlier would have caught the missing table immediately.

3. **Agent session summary claims about "shipped to main" need merge-state verification.** cc-agent-EVAL session summary described `evalRuns / evalScores / evalBaselines` as "wired into `schema/index.ts`." True on `feat/eval-harness` branch — false on main, because PR #26 never merged. The session summary was honest about its own state; the planner's read of "shipped" overstated it. Future: distinguish "shipped to feature branch" from "merged to main" explicitly in session summaries.

## Cross-references

- Active sprints + program plans: [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md), [`42_design_accelerator_program_plan.md`](../42_design_accelerator_program_plan.md), [`47_codex_plan_review.md`](../47_codex_plan_review.md), [`48_codex_program_plan.md`](../48_codex_program_plan.md)
- Product home: [`40_design_accelerator.md`](../40_design_accelerator.md)
- Atom contract substrate: [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md)
- Engine factor-out: [`80_adrs/adr_008_engine_factor_out.md`](../80_adrs/adr_008_engine_factor_out.md)
- Customer-zero observations: [`40a_customer_zero_observations_arena_roja_2026_05_06.md`](../40a_customer_zero_observations_arena_roja_2026_05_06.md)
- TLS workaround runbook: [`90_runbooks/cc_agent_node_tls_workaround.md`](../90_runbooks/cc_agent_node_tls_workaround.md)
- Canary deploy runbook: [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md)
- Snapshot: [`00_current_state.md`](../00_current_state.md)
