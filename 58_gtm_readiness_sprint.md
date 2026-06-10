---
id: 58_gtm_readiness_sprint
title: GTM-readiness sprint — engine lift (app-by-app QA) + Texas code-library + moat-in-flight
status: active
last_updated: 2026-06-10
applies_to: portfolio
owner: nick
related: [56_engine_extraction_sprint, 57_national_code_warming_sprint, 59_spine_moat_and_high_value_features, 54_tenant_leg_sprint, 04a_arrow_two_calibration_capture, 03a_positioning_framework, 80_adrs/adr_008_engine_factor_out, 80_adrs/adr_005_multitenancy, 48_codex_program_plan, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, _decisions/2026-06-10_gtm_readiness_plan]
---

# GTM-readiness sprint

> **What this is.** The sequenced, premortem-cleared plan to get Cortex and the browser extension ready for the architect-community launch with an amazing, grounded UX, by lifting the engines to the spine app-by-app (so each app is QA'd in its final topology) while the Texas code library is deepened underneath. The moat features from [`59`](59_spine_moat_and_high_value_features.md) are sequenced in, not bolted on. Premised on the 2026-06-09 close: arrow-two is closed end-to-end (I3 satisfied), tenant isolation is live end-to-end, the build-out is deployed, the gate is wired, the cold-warm harness is merged. Pre-mortem cleared GREEN 2026-06-10 (one operational yellow on cc-agent-C build concentration, mitigated by serial ordering). Plan decisions: [`_decisions/2026-06-10_gtm_readiness_plan.md`](_decisions/2026-06-10_gtm_readiness_plan.md).

## What changed since the scaffold (verified live, 2026-06-10)

The scaffold listed several items as future work that are already done; the plan is narrowed accordingly.

- **Org-wide open-PR surface is one PR:** hauska-engine #68 (retrieval `/healthz` + substrate Neon observability). legacy-design-tools and hauska-mcp-server have zero open PRs; mcp #26 (GTM) and #27 (observability) merged since the last snapshot.
- **The cold-warm harness (#157 / migration 0036) is merged.** The cold-warm RUNS dispatch was held on it; it is now fire-ready with no new work.
- **The two lineage-audit P0s are closed** (`codex_findings_fetch` #30/#159, atom-id namespace normalization #158). Those were the arrow-two-critical provenance gaps. The uniform-provenance moat is therefore no longer "fix the deposit loop" — it is the narrower, trust-facing job of standardizing the envelope shape across emission surfaces.
- **The precedence taxonomy canary is fixed** (#149, ADA-vs-FHA most-stringent-governs). The precedence moat's recon is now about gate exposure + full-matrix completeness, not the taxonomy.

Net: the load-bearing correctness builds are behind us. This is a lift + coverage + polish sprint, not a make-the-substrate-work sprint.

## The launch gate (what "GTM-ready" means)

Cortex and the extension, cut onto the spine and QA'd in their final topology, with architect-facing surfaces emitting the uniform provenance envelope and per-user auth live for the 7k self-serve; a deep Texas code library (cold-warm first pass landed + Texas gap-fill); and the thin user-warm path (coverage report + honest pill + manual internal escalation, never ingesting user-supplied content into the shared corpus).

Explicitly NOT gating launch: SmartCity-on-spine (the third app, follows), full-fleet provenance across all ~57 tools (fast-follow), the background enhancement loop (post-launch), payment/metering (ICC cutover), and the full user-warm build (fast-follow). Texas is the test-run and template; geography expansion is sequenced after the ICC cutover. No FB-group clock — make it right.

## Resolved in the planning session (2026-06-10)

| Open question (from the scaffold) | Resolution |
|---|---|
| SmartCity-on-spine — this sprint or its own? | **Follows.** Cortex + extension gate launch; SmartCity/Bastrop is the third app on the same lift, off the critical path. |
| User-warm coverage-escalation scope | **Thin for launch** (warm-what-we-can + honest report + manual escalation), full automated loop fast-follow. No-ingest guardrail hard in both. |
| Uniform provenance — hard gate or fast-follow? | **Rides the app-by-app cut; architect-facing surfaces gate launch;** full-fleet standardization fast-follow. |
| Background enhancement loop mechanism | **Deferred post-launch.** Cold-warm first pass + demand-driven lazy-cache is enough depth for launch. |
| FB-group geography → gap-analysis scope | **Texas-first, deep.** Texas is the test-run + template; geography expansion after ICC. |

## The two fronts and the convergence

Two agent fronts run in parallel (different repos, no collision); they converge on cc-agent-C, the single-owner serialization point for legacy-design-tools.

```
FRONT A (cc-agent-E / hauska-engine)        FRONT B (cc-agent-C / legacy-design-tools)
  A1 lift adapters (step 3) ─────┐            B1 cold-warm RUNS over 6 manifests (Texas-first)
  A2 lift engine-core (step 4) ──┤              └─> B2 Texas coverage gap analysis (recon)
     (carries Phase-3 cargo)     │            (independent of the lift; data-only, no schema)
                                 │
                                 ▼
                       CONVERGENCE (cc-agent-C, after A2 parity)
                         C1 cut Cortex to gate + QA + Cortex surfaces -> uniform envelope
                         C2 cut extension to gate + QA + extension surfaces -> envelope
                         C3 thin cortex-api to BFF (step 6)
                         C4 (post-gate) cut SmartCity/Bastrop — third app, off critical path

  ADJACENT (cc-agent-C, separable from the lift topology):
    per-user auth on Cortex (task #29 self-serve) | product polish | user-warm-thin
```

## Sequence (execution order, dependencies named)

No timeframe estimates; each item names what it depends on.

**Front A — the lift (cc-agent-E / hauska-engine).** Fire now.
1. **A1 — lift adapters (56 step 3).** Port `lib/adapters` into `packages/adapters`, behavior-parity. Depends on nothing. Dispatch: [`_dispatches/2026-06-07_cc-agent-E_engine_lift_adapters.md`](_dispatches/2026-06-07_cc-agent-E_engine_lift_adapters.md) (FIRE-READY).
2. **A2 — lift engine-core (56 step 4).** Port briefing/finding/hydrology/decomposition/precedence into `packages/engine-core` (already carries the Phase-3 calibration cargo), expose via `engine-api` behind the gate-front seam, bake pysheds into the image, preserve `citations[].atomId` lineage. Depends on A1 parity. Dispatch: [`_dispatches/2026-06-07_cc-agent-E_engine_lift_engine_core.md`](_dispatches/2026-06-07_cc-agent-E_engine_lift_engine_core.md) (QUEUED → fire on A1 land).

**Front B — Texas code library (cc-agent-C / legacy-design-tools).** Fire now; runs while Front A lifts.
3. **B1 — cold-warm RUNS over the six manifests. DONE 2026-06-10** ([`_inbox/2026-06-09_..._codewarm_runs.md`](_inbox/2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs.md)). The first pass broke at a break-point (migration 0036 unapplied to the deployment Neon + harness parser/driver gaps); both resolved (0036+0037 applied via the GHA `run-migrations` job, verified; B1-fix merged as PR #162), and the re-fire persisted **725/725 atoms on `austin_tx`** ($1.11, all boundaries held). **Emerging quality finding (carried into B2 and the roadmap):** ~552 (74.8%) persisted as `unverified-web-source` because the ICC/UpCodes driver fetches landing HTML, not section bodies — so the Texas library is "citation + working deeplink, flagged unverified," not verified grounded reasoning. The likely fix is a **driver-quality improvement** (section-level HTML extraction from UpCodes, web-first) + a re-warm to upgrade unverified→verified; B2 sizes it. This is probably the single biggest "grounded" lever for launch.
4. **B2 — Texas coverage gap analysis (recon). DONE 2026-06-10** ([`_inbox/2026-06-10_..._texas_coverage_gap_analysis.md`](_inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis.md)). It reframed the code-library lane: **0 of 552 web-warmed atoms are verified** (the driver fetched landing HTML, not section bodies); the Texas corpus is **Layer-3 local-ordinance only** (no Layer-1 I-Code base — consistent with the web-first thesis, which puts Layer 1 on the reasoning layer + deeplinks); B1 used **2021 manifests but Austin enforces 2024**; Texas is not one statewide edition (SECO 2015 energy floor; TAS 2012 state accessibility, unwarmed; IECC/A117.1 municipality-scoped). **Operator decision ([`_decisions/2026-06-10_austin_2024_launch_metro.md`](_decisions/2026-06-10_austin_2024_launch_metro.md)): launch hero = Austin @ 2024.** Two launch-gating code-library builds fall out, in order on the cc-agent-C lane: **B-driver** — section-level HTML extraction so atoms verify (metro-agnostic grounding mechanism; [`_dispatches/2026-06-10_cc-agent-C_codewarm_driver_section_extraction.md`](_dispatches/2026-06-10_cc-agent-C_codewarm_driver_section_extraction.md), FIRE-READY) → **B-rewarm** — Austin 2024 adopted-package manifests (incl. UMC/UPC not IMC/IPC, + TAS 2012) + verified re-warm ([`_dispatches/2026-06-10_cc-agent-C_austin_2024_uplift_rewarm.md`](_dispatches/2026-06-10_cc-agent-C_austin_2024_uplift_rewarm.md), QUEUED). The matrix template is reusable for the post-ICC geography expansion.

**cc-agent-C interleave during the Front-A wait.** The cuts (C1–C3) are gated on A2 parity, which is a real wait. cc-agent-C fills it productively and without opening a second concurrent build front on the one clone:
5. **Per-user auth on Cortex (task #29 self-serve auth).** Independent of the lift topology; the launch-gating dependency for 7k self-serve. Login/signup, owner/tenant columns + backfill, per-route ownership predicates, metering, rate-limit, restore the QA-30/31-removed render auth gate. Distinct from the gate-tenancy #29 already shipped. Depends on nothing in the lift; sequence it in the A2 wait. Dispatch: [`_dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth.md`](_dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth.md) (FIRE-READY).

**Convergence — the cuts (cc-agent-C).** Fire after A2 reaches parity in the spine; the two prerequisites (gate-front seam #160, gate citation lineage #30/#159) are met.
6. **C1 — cut Cortex to the gate + QA + provenance envelope.** Repoint cortex-api's engine call sites to the spine `engine-api` via the seam, one engine at a time behind per-engine feature flags; QA Cortex in its final topology; bring Cortex's architect-facing tool outputs onto the uniform provenance envelope as part of the same pass. Depends on A2 + per-user auth landed (so the QA'd surface is the launch surface).
7. **C2 — cut the extension to the gate + QA + envelope.** The extension hits cortex-api directly today; repoint to the gate; QA; envelope its surfaces. Depends on C1.
8. **C3 — thin cortex-api to a BFF (56 step 6).** Remove migrated engine code, lock direct engine routes, leave UI/session/auth + ingest. Depends on C1 + C2. Dispatch (re-scoped app-by-app): [`_dispatches/2026-06-07_cc-agent-C_cortex_consume_spine_and_thin_bff.md`](_dispatches/2026-06-07_cc-agent-C_cortex_consume_spine_and_thin_bff.md).
9. **User-warm-thin + product polish fold into the cut passes.** Coverage report + honest pill + manual escalation (no-ingest guardrail hard); extension UX, Cortex UX, mnml render activation. Dispatch (user-warm-thin): [`_dispatches/2026-06-10_cc-agent-C_user_warm_thin_coverage_report.md`](_dispatches/2026-06-10_cc-agent-C_user_warm_thin_coverage_report.md).

**Post-launch-gate (same lift mechanism, off the critical path).**
10. **C4 — cut SmartCity/Bastrop as the third app** (54 Task 2 tenant key + 31a Phase 3 atom-backed context). The bigger onboard; rides after the architect launch is ready.

## Moat features, sequenced in

Per [`59`](59_spine_moat_and_high_value_features.md), routed against this sprint:

- **Uniform provenance contract (#3).** Rides the app-by-app cut (C1/C2) — architect-facing surfaces gate launch; full-fleet standardization across all ~57 gate tools is fast-follow. Arrow-two-critical lineage already closed; this is the trust/sell-reasoning envelope (lineage + sources + reasoning chain + confidence/grade + timestamp+edition).
- **Precedence / reconciliation tighten (#4).** Recon DONE ([`_inbox/2026-06-10_..._cc-agent-C2_precedence_gate_exposure_recon.md`](_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md)). Key finding: the `reconcileStandardPrecedence` primitive exists but is **never called in production** — live multi-standard findings are LLM-improvised; the reconciliation demo is test-fixture-only. Operator decided the reconciliation line is a HERO GTM path ([`_decisions/2026-06-10_precedence_hero_path_s1_prelaunch.md`](_decisions/2026-06-10_precedence_hero_path_s1_prelaunch.md)), so **S1 (wire the primitive into the production finding path) is promoted from fast-follow to a pre-launch SOFT-GATE, folded into C1** ([`_dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine.md`](_dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine.md)). **S2 (the `resolve_precedence` gate tool) stays fast-follow after A2** so it calls spine `engine-api`, not a legacy bypass ([`_dispatches/2026-06-10_cc-agent-M_resolve_precedence_gate_tool.md`](_dispatches/2026-06-10_cc-agent-M_resolve_precedence_gate_tool.md)). Honesty scope is held: the wired claim is federal accessibility + adopted model code + local amendments on the same dimension; zoning/CC&R cross-layer (S4/S5) is unbuilt and must not be marketed. The residual `general`-domain label stickiness routes to S4.
- **User-warm with quality-gated coverage escalation (#1).** Thin version this sprint (step 9); full automated loop (coverage-assessment service + gap-escalation + curation workflow) fast-follow. The no-ingest guardrail is the load-bearing security boundary.
- **Payment / metering activation (#2).** NOT this sprint. Routes to the ICC cutover as the first paid Layer-2 surface; the gated ICC dispatch is widened to name it. See [`_dispatches/2026-06-08_cc-agent-E_florida_icc_layer1_and_corpus_ingest_GATED.md`](_dispatches/2026-06-08_cc-agent-E_florida_icc_layer1_and_corpus_ingest_GATED.md).
- **Moat builders (#5).** Roadmap, not this sprint: calibration-grade-sellable (deliberate positioning decision + premortem, rail-quiet by default), real-world permit-office outcome capture (SmartCity + public records, post-launch deepener), the participation flywheel (architecture of the user-warm path), as-of-time querying (ADR-011), atom-graph traversal (ADR-010), execution atoms (north star, ADR-013). Routed in [`00d`](00d_portfolio_roadmap_reference.md) Section 7.

## The operational risk: cc-agent-C concentration

Per-repo single-agent ownership makes cc-agent-C the serialization point for B1, B2, per-user auth, C1–C3, user-warm-thin, and polish — one clone, strict serial. This is the pre-mortem's one operational yellow. Mitigation: the lift (Front A, cc-agent-E) is the natural pacer; cc-agent-C runs B1 → B2 → per-user auth during the A1/A2 wait, then the cuts the moment A2 lands, then user-warm-thin + polish fold into the cut passes. Never two concurrent build fronts on the one clone. cc-agent-E (lift) and cc-agent-C2 (precedence recon) run in parallel on their own repos.

## Hard acceptance criteria threaded from the pre-mortem

Two load-bearing conditions are written into the dispatches as acceptance criteria, not prose:
- The app-by-app cut **preserves `citations[].atomId` lineage end-to-end** (arrow-two depends on it; already in the cortex-consume dispatch).
- The user-warm path **never writes user-supplied content into the shared corpus** (one bad upload poisons the jurisdiction; the whole pitch is trustworthy answers).

## Deploy + housekeeping

- **GATING the B1 re-fire (P0, corrected 2026-06-10):** apply migration **0036** (`asserted_confidence` / `source_set_version` / `calibration_stale`) to the cortex/legacy-design-tools **DEPLOYMENT Neon** (`DEPLOYMENT_DATABASE_URL`); verify **0037** (calibration overlay) is applied there too. Both merged in-repo but unapplied to that live Neon, which is why the B1 warm persisted zero atoms. This is distinct from, and was missing from, the earlier "migration 004" reminder.
- Merge + deploy hauska-engine #68 → clears the one live retrieval `/healthz` warn (`db:not_configured`). (The hauska-engine primary clone is dirty on `chore/retrieval-api-healthz` — the #68 branch; clean it after merge.)
- hauska-mcp-server migration 004 (tenant resolution) on the next gate deploy.
- Windows-workstation TLS: agent runs against UpCodes need `NODE_OPTIONS=--use-system-ca` (TLS-intercepting proxy on the host); folded into the harness-fix dispatch + the Windows runbook.
- Key rotations parked (`BROKERAGE_DEV_API_KEY` + others); rotate when convenient, not gating.
- doc_repo concurrent-commit hazard: other planner sessions are active; `git log -3` before committing, stage explicit paths, commit promptly.

## Dispatch index

| Dispatch | Repo | Owner | Step | Status |
|---|---|---|---|---|
| [`engine_lift_adapters`](_dispatches/2026-06-07_cc-agent-E_engine_lift_adapters.md) | hauska-engine | cc-agent-E | A1 | **MERGED — PR #69** (277/302 adapters parity) |
| [`engine_lift_engine_core`](_dispatches/2026-06-07_cc-agent-E_engine_lift_engine_core.md) | hauska-engine | cc-agent-E | A2 (PR1) | **MERGED — PR #70** (engine-core 142/142; reasoning engines + endpoints + lineage; overlay I/O deferred to PR2) |
| [`engine_core_pr2_calibration_overlay_io`](_dispatches/2026-06-10_cc-agent-E_engine_core_pr2_calibration_overlay_io.md) | hauska-engine | cc-agent-E | A2 (PR2) | **MERGED — PR #71** (Topology A: spine reaches cortex Neon via CalibrationRepositoryPort; no-pool fixtures pass). **Engine lift COMPLETE; C1 unblocked engine-side.** |
| [`codewarm_runs`](_dispatches/2026-06-09_cc-agent-C_codewarm_runs.md) | legacy-design-tools | cc-agent-C | B1 | **DONE — 725/725 atoms persisted on austin_tx** ($1.11; but ~552 `unverified-web-source` — driver fetches landing HTML not section bodies) |
| [`codewarm_harness_fix`](_dispatches/2026-06-10_cc-agent-C_codewarm_harness_fix.md) | legacy-design-tools | cc-agent-C | B1-fix | **MERGED — PR #162** (six manifests parse; config-driven Texas drivers) |
| [`texas_coverage_gap_analysis`](_dispatches/2026-06-10_cc-agent-C_texas_coverage_gap_analysis.md) | legacy-design-tools | cc-agent-C | B2 | **DONE** (0 verified-from-web; corpus is L3-only; Austin edition-drift 2021→2024; TAS gap) |
| [`codewarm_driver_section_extraction`](_dispatches/2026-06-10_cc-agent-C_codewarm_driver_section_extraction.md) | legacy-design-tools | cc-agent-C | B-driver | **FIRE-READY — launch-gating** (flip unverified→verified; the grounding mechanism) |
| [`austin_2024_uplift_rewarm`](_dispatches/2026-06-10_cc-agent-C_austin_2024_uplift_rewarm.md) | legacy-design-tools | cc-agent-C | B-rewarm | QUEUED → after the driver fix (hero verified Austin 2024 library; incl. UMC/UPC + TAS) |
| [`codewarm_driver_section_extraction`](_dispatches/2026-06-10_cc-agent-C_codewarm_driver_section_extraction.md) | legacy-design-tools | cc-agent-C | B-driver | **DONE — PR #163** (0→73% verified on sample; **IECC + IFC/IPMC stay 0%** — UpCodes 404 / ICC book-landing; ICC creds resolve these) |
| [`cortex_per_user_auth`](_dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth.md) | legacy-design-tools | cc-agent-C | task #29 | **DONE — branch `cortex/per-user-auth`** (unified identity both surfaces, migration 0038, anonymous-no-pool test). Held: PR-create + **isolation tests pending CI** + apply 0038 + fixture refresh |
| [`cortex_intake_chat_wedge_fixes`](_dispatches/2026-06-10_cc-agent-C_cortex_intake_chat_wedge_fixes.md) | legacy-design-tools | cc-agent-C | wedge polish | **FIRE-READY — HIGH** (pre-Revit chat + multi-attach + image vision; dogfooding found the live wedge is blocked) |
| [`permit_ahj_connector_recon`](_dispatches/2026-06-10_cc-agent-C2_permit_ahj_connector_recon.md) | legacy-design-tools (xrepo) | cc-agent-C2 | post-launch / C4 | **DONE — verdict BUILD family-first, post-C4** (kill gate PASSED; Austin/Houston out-of-envelope; provisional decision can flip to active) |
| [`precedence_wire_finding_engine`](_dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine.md) | legacy-design-tools | cc-agent-C | S1 (pre-launch soft-gate) | FIRE-READY (folds into C1) |
| [`cortex_consume_spine_and_thin_bff`](_dispatches/2026-06-07_cc-agent-C_cortex_consume_spine_and_thin_bff.md) | legacy-design-tools | cc-agent-C | C1–C3 | QUEUED → fire after A2-PR2 (overlay I/O) so the cut doesn't strand the calibration path |
| [`user_warm_thin_coverage_report`](_dispatches/2026-06-10_cc-agent-C_user_warm_thin_coverage_report.md) | legacy-design-tools | cc-agent-C | step 9 | QUEUED → folds into the cuts |
| [`precedence_gate_exposure_recon`](_dispatches/2026-06-10_cc-agent-C2_precedence_gate_exposure_recon.md) | legacy-design-tools | cc-agent-C2 | moat #4 | **DONE — recon filed** |
| [`resolve_precedence_gate_tool`](_dispatches/2026-06-10_cc-agent-M_resolve_precedence_gate_tool.md) | hauska-mcp-server | cc-agent-M | S2 (fast-follow) | QUEUED → after A2 + S1 |
| [`florida_icc_layer1_..._GATED`](_dispatches/2026-06-08_cc-agent-E_florida_icc_layer1_and_corpus_ingest_GATED.md) | hauska-engine | cc-agent-E | moat #2 | GATED on ICC creds (now carries first-paid-surface scope) |

## Cross-references

- [`56_engine_extraction_sprint.md`](56_engine_extraction_sprint.md) — the lift this sequences app-by-app
- [`57_national_code_warming_sprint.md`](57_national_code_warming_sprint.md) — the cold-warm substrate + manifests
- [`59_spine_moat_and_high_value_features.md`](59_spine_moat_and_high_value_features.md) — the moat features sequenced in
- [`54_tenant_leg_sprint.md`](54_tenant_leg_sprint.md) — the gate seam the cuts consume; SmartCity-on-spine (C4)
- [`04a_arrow_two_calibration_capture.md`](04a_arrow_two_calibration_capture.md) — the closed deposit loop the cuts must not break
- [`_decisions/2026-06-10_gtm_readiness_plan.md`](_decisions/2026-06-10_gtm_readiness_plan.md) — the plan decisions

## Revision history

- **2026-06-10 (fleshed out):** Scaffold turned into the sequenced, premortem-cleared plan with the operator. Resolved the five open questions (SmartCity follows, user-warm thin, provenance rides-the-cut, background loop deferred, Texas-first). Two parallel fronts + convergence; cc-agent-C serialization mitigated by serial ordering; moat features sequenced in (provenance rides the cut, precedence recon-first, user-warm thin, payment to ICC); hard acceptance criteria threaded; deploy/housekeeping folded; dispatch index with the two flips + four new scaffolds + two edits. Pre-mortem cleared GREEN (one operational yellow, acknowledged). Per [`_decisions/2026-06-10_gtm_readiness_plan.md`](_decisions/2026-06-10_gtm_readiness_plan.md).
- **2026-06-09 (scaffold):** Created at session close to frame the GTM-readiness sprint (engine lift as app-by-app QA + code-library maximization for the FB-group launch).
