---
id: 75b_brief_coverage_v0
title: Property Brief — pilot coverage list (v0)
status: active
last_updated: 2026-07-05
applies_to: portfolio
related: [75_hauska_brokerage_workflow_plan, 75c_property_brief_data_backlog, 76_empressa_wedge_90d_operating_plan, 51_substrate_v1_sprint, 2026-05-28_central-tx-property-brief-scope]
owner: planner
---

# Property Brief — pilot coverage list (v0)

> **Purpose.** Public-facing honesty list for pilot users. Publish at `brief.hauska.dev/coverage` or cortex static route when hosted.
>
> **Source of truth (runtime):** `GET /api/brokerage/v1/coverage` on `cortex-api` after Dispatch A deploy. This doc mirrors that manifest for planner and extension UX. Bump `last_updated` when cc-agent-E merges new eval-passing cities or LDT Neon warmup changes status.

## Status values

| Status | Meaning |
|--------|---------|
| `neon` | Code atoms loaded in LDT Postgres; brief research can retrieve city code |
| `engine_only` | Eval-passing in hauska-engine substrate; geocode resolves but brief code retrieval empty until Neon warmup |
| `blocked` | Geocode resolves but corpus intentionally excluded (partnership track) |

## Central TX pilot manifest (synced 2026-05-28)

Substrate snapshot source: `hauska-engine/services/retrieval-api/corpus/snapshot.json` (generated 2026-05-26). Registry export: `hauska-engine/services/retrieval-api/corpus/central_texas_coverage.json` (regenerate via `export-central-texas-coverage`). Neon subset per LDT coverage endpoint implementation.

| `jurisdiction_key` | Status | Atoms (engine) | Notes |
|--------------------|--------|----------------|-------|
| `austin_tx` | neon | 2211 | Neon warmup 2026-05-28 |
| `bastrop_tx` | neon | 193 | UDC + pilot default |
| `bastrop_county_tx` | engine_only | 17 | County layer |
| `boerne_tx` | engine_only | 106 | |
| `brownsville_tx` | engine_only | 870 | |
| `cedar_hill_tx` | neon | 706 | Cortex QA test address metro |
| `converse_tx` | engine_only | 610 | |
| `copperas_cove_tx` | engine_only | 133 | |
| `crowley_tx` | engine_only | 852 | FW metro suburb |
| `dripping_springs_tx` | engine_only | 954 | |
| `el_paso_tx` | engine_only | 659 | |
| `elgin_tx` | engine_only | 266 | Municode |
| `georgetown_tx` | neon | 658 | Neon warmup 2026-05-28 |
| `grand_county_ut` | neon | 285 | UT validation pass (non-TX) |
| `hutto_tx` | neon | 1741 | Sync 4.5 network; Neon warmup 2026-05-28 |
| `keller_tx` | engine_only | 165 | FW metro suburb |
| `killeen_tx` | engine_only | 637 | |
| `lago_vista_tx` | engine_only | 299 | |
| `leander_tx` | neon | 185 | Neon warmup 2026-05-28 |
| `live_oak_tx` | engine_only | 539 | |
| `lockhart_tx` | engine_only | 139 | |
| `manor_tx` | engine_only | 273 | |
| `mission_tx` | engine_only | 708 | |
| `new_braunfels_tx` | neon | 190 | Neon warmup 2026-05-28 |
| `pasadena_tx` | engine_only | 463 | |
| `rollingwood_tx` | engine_only | 421 | |
| `round_rock_tx` | neon | 355 | Neon warmup 2026-05-28; Round Rock QA address |
| `saginaw_tx` | engine_only | 538 | FW metro suburb |
| `san_antonio_tx` | engine_only | 941 | |
| `schertz_tx` | engine_only | 161 | |
| `sugar_land_tx` | engine_only | 542 | |
| `taylor_tx` | engine_only | 510 | |
| `watauga_tx` | engine_only | 235 | FW metro suburb |
| `wimberley_tx` | engine_only | 237 | |

## Blocked (explicit gap)

| Key / geocode | Status | Notes |
|---------------|--------|-------|
| `dallas\|tx` (city proper) | blocked | AmLegal / eCode360 partnership track per [`73_partnerships.md`](73_partnerships.md); Dallas County and suburbs OK |
| Smithville TX | blocked | eCode360; General Code partnership track in [`73_partnerships.md`](73_partnerships.md) |
| Addresses outside listed keys | — | Brief returns `not_in_corpus` or partial; UI must not imply city code coverage |

Expand to 10+ metros per [`76_empressa_wedge_90d_operating_plan.md`](76_empressa_wedge_90d_operating_plan.md) day-45 gate (planner bumps this table on each Sync 5 merge and Neon warmup batch).

## Parcel layers

| Layer | Backend | Extension UI |
|-------|---------|----------------|
| FEMA flood | On `main` (PR #131); prod requires deploy + geocode hit | Step 4c dispatch |
| Parcel/zoning (Cotality, sole spine; Regrid purged 2026-06-17) | On `main`; prod requires Cotality Property + SpatialTile credentials on `cortex-api` | Step 4c dispatch |

Regrid was purged 2026-06-17 and Cotality is the sole parcel/zoning spine, so the former `REGRID_API_KEY` mount item is retired. Prod parcel/zoning now depends on the Cotality production credentials (Property + SpatialTile + display license), which are the current launch gate for the brief's parcel layer.

Dispatches (2026-05-28): scope [`_dispatches/2026-05-28_central-tx-property-brief-scope.md`](_dispatches/2026-05-28_central-tx-property-brief-scope.md); API layers [`_dispatches/2026-05-28_cc-agent-C_brokerage_fema_regrid_brief_layers.md`](_dispatches/2026-05-28_cc-agent-C_brokerage_fema_regrid_brief_layers.md); panel [`_dispatches/2026-05-28_extension_property_brief_parcel_layers_panel.md`](_dispatches/2026-05-28_extension_property_brief_parcel_layers_panel.md).

## Disclaimer (mirror in product)

Not legal advice. Decision-support only. Verify with city staff and licensed professionals. See Terms of Service before use.

## Data completeness backlog

Scored priorities and execution owners: [`75c_property_brief_data_backlog.md`](75c_property_brief_data_backlog.md). Partner asks for tomorrow: [`90_runbooks/partner_outreach_brief_wave.md`](90_runbooks/partner_outreach_brief_wave.md).

**Neon warmup pilot (2026-05-28):** Operator automated run loaded `round_rock_tx`, `austin_tx`, `hutto_tx`, `georgetown_tx`, `new_braunfels_tx`, `leander_tx` — all `load` / `embed` / `coverage` / `brief` gates green per [`_inbox/2026-05-28_operator_neon_warmup_report.md`](_inbox/2026-05-28_operator_neon_warmup_report.md). Status rows above flipped to `neon` 2026-05-30.

## Revision history

- **2026-05-30:** Six Central TX pilot keys (`austin_tx`, `georgetown_tx`, `hutto_tx`, `leander_tx`, `new_braunfels_tx`, `round_rock_tx`) → `neon` after operator warmup report; REGRID prod mount note corrected.
- **2026-05-29:** Atom counts synced from engine `central_texas_coverage.json` export (cc-agent-E); 34 keys unchanged vs 2026-05-26 baseline.
- **2026-05-28:** Synced to `GET /api/brokerage/v1/coverage` manifest; added `neon` / `engine_only` / `blocked` status model; full Central TX substrate key list from engine snapshot.
- **2026-05-26 (origin):** v0 pilot list (5 confirmed eval-passing keys).
