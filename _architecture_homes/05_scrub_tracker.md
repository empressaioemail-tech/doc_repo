---
id: architecture_homes_scrub_tracker
title: Doc-repo scrub tracker
status: active
last_updated: 2026-06-21
applies_to: portfolio
owner: nick
related: [architecture_homes_overview, architecture_homes_topology, 80_adrs/adr_008_engine_factor_out]
---

# Doc-repo scrub tracker

The phase-2 doc scrub worklist: bring every canonical doc to the architecture-homes standard (Cortex reframed to the reporting function package, AEC-cortex and Radar as Surfaces, the MCP gate-class rework, the atom conformance target, the homes). Source of truth for the product/route decomposition is cc-agent-R's close (`_inbox/2026-06-21_aec-cortex_cc-agent-R_arch-scaffold-and-boundary.md`), which maps every legacy-design-tools artifact, route, and lib to its future home.

Legend: DONE (scrubbed) · PENDING (canonical scrub owed) · PHASE1-DEP (waits on the engine corpus re-mint or the MCP gate-rework close) · HISTORICAL (point-in-time artifact, leave as-is per conventions).

## Keystones (done this scrub)

| Doc | Action | Status |
|---|---|---|
| 80_adrs/adr_008_engine_factor_out.md | Cortex-reframe + AEC-cortex amendment note + revision | DONE |
| _decisions/2026-06-21_adr008_cortex_reframe_override.md | override decision record | DONE |
| CLAUDE.md | identity line: Cortex to reporting, AEC-cortex, Radar, Brief as surfaces | DONE (identity line); PENDING the "What is settled" Codex/Cortex framing sweep |
| _architecture_homes/* | the standard itself | DONE |

## Canonical docs owed (phase-2 scrub)

| Doc | Scrub action | Status |
|---|---|---|
| 40_design_accelerator.md | reframe Cortex-as-product to AEC-cortex; cortex-api = reporting | PENDING |
| 42_design_accelerator_program_plan.md | reframe to AEC-cortex program; consume via gate | PENDING |
| 44_mcp_cortex_architecture_map.md | gate classes public/codex/reporting/map; Cortex framing | PENDING (unblocked by M close) |
| 50_hauska_mcp_server.md | gate-class rework + new tools (atom-trace, atom-export, read-contract on get_atom) | DONE (2026-06-21: four-gate + 62 tools + 1.5.0 conformance + Circle correction) |
| 52_mcp_offer_and_buildout.md | gate classes; agent-operator onboarding + metering section | PENDING |
| 56_engine_extraction_sprint.md | reporting=cortex-api; AEC-cortex split; fold R's decomposition map | PENDING (light) |
| 07_product_line_summary.md | product line: Cortex to reporting, AEC-cortex, Radar | PENDING |
| 09_post_saas_substrate_thesis.md, 10_ground_truth.md, 11_roadmap.md | Cortex framing sweep | PENDING |
| 00_current_state.md | homes pointer + phase-1 ground truth (below) | PENDING |
| 00c_portfolio_master_map.md, 00d_portfolio_roadmap_reference.md | orientation: homes, repo classifications, surfaces | PENDING |
| 00_README.md, 00b_doc_repo_guide.md | new folders (_architecture_homes), surfaces classification | PENDING |
| 01a_atom_conventions.md, 25_atom_architecture_reference.md | conformance target 1.5.0, downloadable-atom, five-value accessPolicy, families | PENDING |
| 47_codex_plan_review.md, 48_codex_program_plan.md | Codex = plan review + code intel; gate-class clarification | PENDING (light) |
| _calibrated_spine_roadmap/* | homes correction (atoms on spine, cortex-api = reporting); overlay-as-cache already noted | PENDING |
| sessions / dispatches / research / dated _inbox | none | HISTORICAL (leave) |

## Phase-1 ground truth to fold into 00_current_state

- atom-contract 1.5.0 live on npm: conformance validator + downloadable-atom export subpaths; ATOM_CONFORMANCE_TARGET_VERSION = 1.5.0.
- AEC-cortex scaffolded at P:\AEC-cortex (root commit 9ef4edb), architect Surface, MCP-first ship intent; operator creates GitHub remote.
- Radar scaffolded at P:\radar with the cortex-api extraction scope; operator creates remote.
- cortex-api confirmed as the reporting function package; full legacy-design-tools decomposition map in R's close.
- Atom conformance backfill landed (cortex-api): migration 0044 (reasoning_atoms accessPolicy), asserted-fallback read-contract, family conformance matrix; tenant-leg (sprint 54) blocks owner-isolation items.
- Console audit instrument: downloadable-atom inspector, E8 Agent View, report-to-manifest contract (hydrology first case), header-docked window state.
- Calibration-engines audit: raw-events collector conformant; read-contract emission deferred to Wave 4 S1; 5 backfill gaps flagged for C.

## Phase-1 closes: complete

All seven filed: AC, E, C, C2, R, map, and M (Track C, mirrored to `_inbox/2026-06-21_hauska-mcp-server_cc-agent-M_arch-track-c-gate-rework.md`). Engine re-minted the corpus born-correct (21,126 atoms 0% to 100% conformant; live re-ingest pending network). M shipped the four-gate rework, the three new tools, 1.5.0 conformance, and migration 003, with the phase-3 onboarding/metering design (its Stripe reference corrected to Circle). Phase-1 audit/cleanup is done; the MCP-doc scrub is unblocked.

## Scrub progress (2026-06-21)

Two depths: a standard-pointer banner (dated, stops the stale framing from misleading, points to the homes and the ADR-008 amendment) and a full rewrite (deep line edits). The banner pass is the anti-confusion floor; full rewrites follow as each doc is next substantively touched.

- Fully scrubbed: 50_hauska_mcp_server (four-gate as-built), plus the keystones (ADR-008 amendment, CLAUDE.md identity line, the standard, the Regrid scrub of 55/00c).
- Banner-scrubbed (standard pointer + key fixes; deep rewrite owed): 44, 52, 07, 40, 42, 00_current_state, 00c, 00d, 00_README, 10_ground_truth, 01a, 25, and _calibrated_spine_roadmap/00.
- Still owed (lower-leverage; banner then rewrite): 00b_doc_repo_guide, 09_post_saas_substrate_thesis, 47_codex_plan_review and 48_codex_program_plan (Codex framing is mostly correct; gate-class clarification only), 11_roadmap (already superseded by 00d), 56 (light), and the deep rewrites of the banner-scrubbed set.
