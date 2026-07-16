---
id: 2026-07-15_verification_wave_and_punchlist_closure
title: Session — verification wave (stale-clone trap), punch-list closure, land-records program, mesh/IFC coordination
date: 2026-07-15
kind: session-summary
agent: claude_code
related: [00_current_state, 80_adrs/adr_026_sensor_stream_atoms, 80_adrs/adr_027_first_party_land_records_acquisition, _decisions/2026-07-15_verification_wave_and_land_records_posture, _land_records/README, _inbox/2026-07-15_parcel_mesh_ifc_build_complete_handoff]
---

# Session summary — 2026-07-15 verification wave + punch-list closure

Operator-interactive planning-and-execution session. Started from the 2026-07-15 next-planning-agent handoff, pivoted to a full verification wave when the audit revealed the doc set was describing stale reality, then closed the verified punch-list and stood up the land-records acquisition program.

## The arc

**1. Ground-truth reframe.** The operator declared the build phase substantially done and pivoted the program to launch, productization, and a set of business commitments (ICC, Vertosoft, Mox, public MCP, OG). Program direction set: calibration stays on the critical path (gates the public claim, not the launch); SmartCity walled off as an independent project; OG is data-blocked not code-blocked; TexasFile out, first-party acquisition in.

**2. The load-bearing finding: the doc set and all local clones were stale.** A first audit pass against the persistent `P:\` clones produced FALSE gaps (command-center picker "absent," MCP "three-gate," workspaces "half-built"). Root cause: all six clones were 17-67 commits behind true origin/main (the stale-clone rewind trap). After syncing (dirty work stashed, not discarded; hauska-engine left untouched because its main is in a worktree), a re-audit flipped the false gaps to GREEN. The verified completeness matrix: platform ~90 percent complete, every gap a clean shape (client not calling an existing backend route, a data ingest not landed, or dead code to delete). Two handoff claims corrected as not-live: Hays land-use coloring (data-run not run) and the Cotality-swap-on-engine (dead Regrid stubs remained).

**3. Punch-list closure (5 PRs merged, all reviewed + CI-verified, none on the builder's word).**
- hauska-engine #96: removed dead Regrid national-land-use adapters. The audit lumped Regrid and Cotality as "dead stubs"; the build agent correctly split them: Regrid genuinely dead (removed), Cotality intentionally dormant/config-gated (PRESERVED per the 07-13 swap decision). A review flag (a Cotality file in the diff) resolved to a 1-line stale-message correction, not a behavior change.
- legacy-design-tools #260: workspace deep-links wire-up (client reads `?share`/`?space` against the already-built `/spaces/shared/:token` route). The saved-spaces "gap" turned out already-wired (PR #221) - a re-audit miss.
- legacy-design-tools #261: address-point ingest (new `txgio_address` store, migration 0056, StratMap open REST, 11.7M features statewide). Held past a RED CI check that proved to be a flaky unrelated `submission-classifier` timeout (green on main, not in the diff, timeout-not-assertion); merged only after a re-run went green. The #227 discipline held.
- legacy-design-tools #262: per-CAD bulk ingest orchestration (WCAD open-fetch + Hays manual-download registry). Most of Rail B already existed (Orion parser covers WCAD/Hays); the PR added fetch orchestration + fixed a live-data exemption-parse bug the fixtures masked. No migration (store already had the EARS columns). 3,372 real WCAD rows proven landing.
- (ADR-026 sensor-stream ADR authored + committed 25dfb99; see below.)

**4. Land-records acquisition program stood up.** TexasFile foreclosed (ToS bans automated retrieval + derived redistribution + title-plant building; a licensed atom's provenance terminates at a vendor, violating commitment #1). ADR-027 filed: first-party acquisition from originating custodians under public-records law (LGC 118.011(e) as amended by SB 1547 routes non-paper copies to PIA cost rules, a ~4-orders-of-magnitude cost swing). Verified live: Comptroller EARS is special-request-only (no self-serve pull, so the 253-CAD relationship does NOT collapse to one feed); StratMap parcels are session-gated file downloads (address points ARE open REST). Acquisition posture: free layer autonomous (per-CAD bulk primary for parcels, WCAD open-fetch proven), Comptroller aggregate-EARS tested via one special request, county outreach corridor-first with the operator as named legal party and NO auto-escalation of OAG complaints against clerks inside the SmartCity/Vertosoft network (R4). Six research docs filed to `_land_records/` + `90_runbooks/` (operator-placed to preserve citation fidelity; a subagent correctly refused to transcribe from summaries).

**5. Confidential-material cleanup.** Six OG title PDFs that landed in the repo tree were moved out (confidential grading exemplars, never committed). Three title PDFs already tracked+pushed from a prior session (incl. Herbert's Lea County DOTO) were untracked; a repo-wide `*.pdf` gitignore block added. Operator ruled the history-purge force-push not worth the shared-clone blast radius for a private repo; untrack stands, history retains the files by deliberate decision.

**6. Mesh/IFC build (separate planning agent) coordinated.** A four-layer parcel mesh/IFC build (coverage-honesty, terrain mesh GLB, IFC-authoring Python worker, map-gate tool + command-center tile) was built and adversarially reviewed by that agent across four repos. This planner answered two rounds of deconfliction against live-verified state (confirmed no collision on the DEM/topography files, the 5 mcp registration files, or hauska-map tileRegistry; blessed the local-override tile pattern for the phantom cortex-tiles-package question). The build is now committed to four feature branches (no push): hauska-engine + legacy-design-tools `feat/dem-coverage-honesty`, hauska-mcp-server `feat/parcel-terrain-model-tool`, hauska-map `feat/parcel-terrain-tile`. Build-complete handoff filed at `_inbox/2026-07-15_parcel_mesh_ifc_build_complete_handoff.md`. NOTE: legacy-design-tools branch still shows 2 dirty tracked files (that agent's, not this planner's) - not fully committed; flagged for that agent.

## Operating-model lessons this session

- The doc set and local clone HEADs both lagged live reality; all state claims must trace to live gh/npm/gcloud or freshly-synced source. A clone's `HEAD == origin/main` check can pass while both are stale (the origin ref itself was old).
- Verification never delegated caught real nuance every time: Regrid-vs-Cotality distinction, a flaky-red vs real-red, three repo mis-routings by this planner (CAD ingest lives in legacy-design-tools not hauska-engine; corrected by agents), and a subagent that refused to fabricate rather than transcribe from summaries.
- The sandbox has NO external network egress (DNS + TLS blocked) and reaches only the gcloud control plane. Live-network verification and any data-run against prod must be delegated to agents with network, or run by the operator. This planner cannot fire the WCAD/address-point/Hays prod ingests itself.

## Open / operator-owned at close

- Three prod data-runs staged, code merged, NOT run (blocked on this planner's lack of network + prod-Neon creds): WCAD bulk (open-fetch), full statewide address-point crawl (11.7M), Hays land-use (also needs the WAF-blocked Hays export ZIP from the operator). Held per operator at close.
- Mesh/IFC: relay the build-complete handoff to the master planning agent when ready to move toward merge (merge sequenced behind the auth-gate flip); the cortex-tiles package location is the one unresolved follow-on keeping the tile dormant.
- Per-CAD fan-out (El Paso, Tarrant, etc.) is a registry-entry each behind the proven WCAD/Hays pattern.
- ADR-026 has 19 body em-dashes (convention miss); trivial cleanup owed in a hygiene pass.

## Commits this session

- 25dfb99 (pushed): verification wave, ADR-026 + ADR-027, current_state reconciled, decision-log.
- f422ac6 (pushed): confidential title PDF untrack + repo-wide PDF gitignore block.
- 485c687 (pushed): land-records research set filed, mesh/IFC coordination drafts, current_state corrections (Regrid/Cotality, saved-spaces).
- Product PRs merged: hauska-engine #96; legacy-design-tools #260, #261, #262.
