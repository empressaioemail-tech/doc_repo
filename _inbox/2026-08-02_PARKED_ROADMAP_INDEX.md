---
id: 2026-08-02_PARKED_ROADMAP_INDEX
title: PARKED ROADMAP INDEX — the single come-back-to list (concepts, decisions owed, held/parked items)
date: 2026-08-02
status: living index (update as items land; this is the one place to find "what did we say we'd return to")
owner: nick
related: [OPS-0_MASTER_game_plan, PHASE_C_HANDOFF_bastrop_warm, 2026-08-01_public_data_layer_expansion_candidates, 2026-08-01_scale_before_new_layers_sequencing, 2026-08-01_spine_health_audit_ledger, 2026-08-02_bastrop_city_and_fan_MASTER_WDLL]
purpose: One durable index of every PARKED / OWED / HELD concept + roadmap item captured across the 2026-08-01/02 arc, so they are never reconstructed from memory. Code changes live in git; THIS is the concept/decision/roadmap backlog. Grouped by theme; each item = one line + status + the doc that holds the detail.
---

# PARKED ROADMAP INDEX

The come-back-to list. Not code (git holds that) — the CONCEPTS, DECISIONS OWED, and HELD/PARKED items. Status: PARKED (idea, scope later) · OWED (decided/needed, not built) · HELD (deliberately paused) · DONE (was owed, now landed — kept for the trail). Detail lives in the linked doc.

## 1. THE BIG ROADMAP THREADS (the strategic come-backs)

- **The fan-out engine scope/target/cost-gate** — OWED (the flagship planning conversation). Frame is settled ([`_decisions/2026-08-01_scale_before_new_layers_sequencing`](_decisions/2026-08-01_scale_before_new_layers_sequencing.md)): scale certified layers (parcel/zoning/buildable) statewide first; the scope/target/cost-gate is the owed operator sit-down before dispatch. Gated on Bastrop city proving the line (Phase C).

- **The generic self-guarding `onboard(fips)` command (prose→code)** — OWED (the "turn on the factory with no recipe relay" pickup we discussed last). Today the recipe is frozen as PROSE an agent must interpret; the target is a command that reads the frozen registry row → runs the deterministic warm+cert → FAILS CLOSED on any recipe violation. Its SPEC is a Phase C deliverable (§11 of [`PHASE_C_HANDOFF_bastrop_warm`](90_operations/PHASE_C_HANDOFF_bastrop_warm.md)). Build = "Phase D" after Bastrop proves out.

- **Doc reconciliation (cross-repo)** — HELD (release-gated, unblocked by the "smart site" naming). Reconcile the whole doc set against the now-settled foundation. Sequence LAST — after the foundation exists (per [`2026-08-02_DAY_ONE_foundation_brief`](_inbox/2026-08-02_DAY_ONE_foundation_brief.md)).

## 2. PUBLIC DATA-LAYER EXPANSION (parked idea capture)
Full detail: [`_inbox/2026-08-01_public_data_layer_expansion_candidates`](_inbox/2026-08-01_public_data_layer_expansion_candidates.md) — PARKED, scope when we return.
- Power lines / utility: transmission = public (HIFLD); distribution routing = mostly NOT (CEII-restricted); service territories = public (PUCT). FLAG: confirm Oncor vs "Encore".
- The ranked "what's worth adding" map (Tier 1/2/3) filtered by "changes the ANSWER, not the picture."
- RECOMMENDATION (the two highest-leverage first adds): utility-availability-at-the-parcel + soils/SSURGO (Central-TX septic/expansive-clay value).
- SEQUENCING (decided, [`_decisions/2026-08-01_scale_before_new_layers_sequencing`](_decisions/2026-08-01_scale_before_new_layers_sequencing.md)): statewide-UNIFORM layers (soils, wetlands, OZ, transmission, school districts — single-source, no per-city cert; the OZ layer is the template) ride as a CHEAP PARALLEL TRACK during the scale. ASSEMBLY-DERIVED layers (utility-availability-from-local-records, easements, historic overlays — same cert cost as zoning) WAIT until after the scale proves wide.

## 3. PE / PRODUCT PICKUPS (owed features, not built)
- **Chat ATTACH — OCR/vision for scanned docs** — LATER PICKUP ([`_inbox/2026-08-01_pe_chat_sessions_feature_spec`](_inbox/2026-08-01_pe_chat_sessions_feature_spec.md) line 46). v1 attach reads born-digital PDFs/text; images + scanned/image-only PDFs have NO OCR/vision (attached "not read", model told not to invent). True vision/OCR + deep document-atomization = a coordinated cortex-api/engine backend change. Owed when deeper attach-reasoning is wanted.
- **RE-apps inline atom-chip UX catch-up** — QUEUED behind the wedge (finish chip→brief→full-detail cited-citation UX; from earlier memory `re-apps-inline-atom-chip-ux-catchup`).
- **Radar entitlement user-aware (not install-keyed) + standalone deep-dive portal** — QUEUED (from earlier memory `radar-entitlement-install-id-not-user-aware`, `standalone-deep-dive-portal-direction`).

## 4. SPINE-HEALTH LEDGER — remaining open findings (the ones NOT yet fixed)
Full ledger: [`_inbox/2026-08-01_spine_health_audit_ledger`](_inbox/2026-08-01_spine_health_audit_ledger.md). The co-urgent block (functional /search alert + MCP health honesty) is DONE. Remaining:
- **MCP /health returns 200 even when body=degraded** — QUEUED (finding #6 code-fix). A separate readiness signal (/health/ready) was added (#55); making /health itself 503 on a CRITICAL dep is the remaining follow-up (careful: parked-upstash `skipped` must NOT trip it). Not urgent.
- **cortex-api bare /api/health + zero alerting on smartcity-os / LDT projects** — PARTIAL. smartcity-os-prod now has functional uptime checks + alerts (this session). Cortex functional health depth + fuller LDT-project alerting = the next S-M block.
- **Fail-closed caller contract (finding #7)** — DONE as hardening (#372 surfaces substrate failures); the broader "surface every fail-open fallback" sweep is a queued hardening pass, not a live gap.
- **SmartCity empty-success masks / scraper health (findings #9/#10/#11)** — DONE (#32/#33 shipped: honest calendar failure, dep-failure markers, scraper /health).

## 5. FACTORY-BUILD OWED (from the ops docs — mostly for Phase C/D)
- **Registry as a FROZEN artifact the engine LOADS everywhere** — PARTIAL. The loader + Bastrop row landed (A4); ripping out the remaining hardcoded per-county adapters (e.g. bastrop-per-parcel-record.ts layer-23 constant) is the OPS-2/OPS-3 migration, part of the onboard(fips) generalization.
- **Staleness selection (the retirement rung)** — DESIGNED-IN (OPS-4/OPS-6 this session), BUILD OWED in Phase C+. The active detector that demotes a rotted stamp to "unverified as of date". The A7 ledger carries staleness_flag/last_refresh_at; the selector that SETS them is the build.
- **R16 general edition-currency serving gate** — OWED (national-fan prerequisite; NOT a Bastrop-city blocker — the Bastrop string-filter covers the city). Needed before non-Bastrop counties.
- **BDC atom sourceUrl + full-body ingest** — OWED (the vague/no-link chip gap; a recipe-level ingest requirement per the recipe ACCEPTED refinements).

## 6. DONE THIS SESSION (was captured as owed/held; now landed — for the trail, do not re-open)
- Mobile PE pass — DONE (#139). · Functional /search alert — DONE (wired). · recipe-version field — DONE (A3). · performance-ledger fields — DONE (A7). · MCP readiness signal — DONE (#55). · MCP health honesty — DONE (#54). · fired/helped/harmed + staleness rungs — DESIGNED-IN (this session). · OZ statewide — DONE (#142). · citations chain — DONE + operator-confirmed.

## HOW TO USE THIS
When you come back: read this index → the top item in the theme you want → open its linked doc for detail. When an item lands, move it to §6 with its PR/commit. This is the one place "what did we say we'd return to" lives; keep it current so it never has to be reconstructed from a chat transcript again.
