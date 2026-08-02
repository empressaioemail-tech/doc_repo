---
id: OPS-6_command_center_engine_console
title: OPS-6 — Command Center Engine Console (the factory floor; where the operator watches the country warm)
date: 2026-08-02
status: operations doc (gap-closure: R-FND-4 CC-factory-floor; Bastrop is its first subject)
owner: nick
related: [OPS-4_rewarm_protocol, OPS-3_engine_contract_determinism_register, command-center-is-the-spine-console]
layer: L-SURFACE
closes_gaps: [5 CC-engine-console-STUB, 7 performance-ledger-surface]
---

# OPS-6 — Command Center Engine Console

## WHAT THIS IS
The operator's factory floor (R-FND-4): where the operator WATCHES the country warm — per-county engine state, coverage, recipe-version drift, cert state, memory/freeze state, cost. This is the surface that makes the performance public data layer (R-FND-6) operable. Bastrop city is the FIRST subject the operator experiences coming online + verified in CC.

## STATUS (honest gap-closure)
Verified: the CC engine panels are explicit STUBs — `{ id: 'resolver', ... stub: true }`, `{ id: 'engine-console', label: 'Autonomous Engines', ... stub: true }`, rendering "Not yet wired — Phase 2+ backlog." Live-but-thin: Spine Health (Bastrop probes: depth-warm firing, boundary-primitive firing, reasoning-chain degraded, rule-setback dead), Run Monitor, Node & Graph, Atom Inspector. The operator CANNOT see per-county engine state, recipe-version, cert state, rewarm-unsafe flags, or memory freeze state. CLOSE = wire these.

## THE FACTORY-FLOOR PANELS (what the console must show)
1. COUNTY LEDGER (the performance data layer, R-FND-6) — the headline. A table/map of all 254 counties + their cities, each row: done/not-done, coverage % per facet, recipe-version (+ drift flag vs current), source-vintage (+ staleness flag), cert-state (uncerted/mechanical-pass/R6-pass/certified), rewarm-unsafe flag, cost, last-rewarm/last-refresh. Reads county_facet_coverage (OPS-4 extended schema). Sortable, filterable — treated as a product performance surface, not a passive tracker.
   STALENESS VIEW (the retirement rung, OPS-4): the ledger must SURFACE per-jurisdiction staleness — which stamped truths (zoning stamp, setback table, code edition) are "unverified as of `<date>`" because the staleness selector demoted them (a detected code amendment or an expired re-verification TTL). This is where the operator SEES a stamp that has rotted (a city amended its code) before it silently poisons the customer surface — the active generalization of the Bastrop repealed-code lesson. A jurisdiction with stale stamps shows refresh-needed; the operator triggers a REFRESH from here (OPS-4).
2. ENGINE STATE (Resolver + Autonomous Engines, currently STUB) — per engine (warm/inset/currency/owner-match/road-node/property-line/cert): determinism kind (from the OPS-3 register), live run state (firing/degraded/dead per the spine-health probe), throughput, last-run, error/decline counts. The operator troubleshoots from here.
3. FREEZE / MEMORY STATE — per jurisdiction: what's in scratch (WIP sticky-part decisions) vs promoted-frozen; the rewarm-unsafe flag derived from unfrozen decisions (OPS-3 I7). Makes the capture-and-freeze organ (R-FND-7) VISIBLE — the operator sees which counties have un-frozen decisions blocking a safe rewarm.
4. REWARM CONTROL — trigger a rewarm for jurisdictions below the current recipe-version (OPS-4); watch it run; see determinism-verified (persisted==recompute) per parcel.
5. CERT VIEW (the R6 surface) — the operator's live block-QA surface: the swept area rendered with drawn envelopes, per-parcel gate results, the R6 pass/fail the operator records. This is where operator R6 (OPS-5 gate 2) happens. BASTROP CITY is the first subject rendered here.

## BASTROP FIRST (R-FND-4, R-FND-1)
As the Bastrop-city line runs (OPS-2), the operator experiences it HERE: the county ledger shows Bastrop city warming district-block by district-block; the cert view renders each swept block for R6; the freeze state shows any sticky-part decisions captured. The operator's R6 visual QA (the thing the operator returns to do) happens in the CERT VIEW. "Bastrop city certified" is claimed only after the operator's R6 passes in this console.

## WHERE IT LIVES
hauska-map/apps/command-center (the internal operator console, per command-center-is-the-spine-console — CC=internal controls, PE=customer app). Reads the spine via the CC proxy (server-side key, no keys in browser). The county ledger + engine state read the substrate performance ledger (county_facet_coverage extended) + the spine-health probe endpoint.

## HOW THIS CLOSES THE GAPS
- Gap 5 (CC STUB): wire the Resolver + Autonomous Engines panels + the county-ledger panel + the cert/R6 view. The stubs become the factory floor.
- Gap 7 (performance ledger not surfaced): the county-ledger panel IS the surface for the OPS-4 extended performance fields.

## THE PRINCIPLE
You cannot operate a country-scale rewarmable factory blind. "The engine works" (2,345 warm parcels) is not enough — "the operator can see every county's engine + cert + freeze + recipe state" is the requirement. The console is FOUNDATIONAL (not later polish), because R6 (a required cert gate) HAPPENS here, and rewarm-triggering happens here. Bastrop proves it: the operator's first real factory-floor experience is watching Bastrop city come online + certifying it by eye in this console.
