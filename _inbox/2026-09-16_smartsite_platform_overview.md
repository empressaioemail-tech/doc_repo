---
id: 2026-09-16_smartsite_platform_overview
title: Smart Site platform overview. What the platform is, what it is built from, and what is live
date: 2026-09-16
status: internal
kind: briefing
owner: integration seat
audience: operator first; then any agent or writer who needs the whole platform in one read before working on a part of it
snapshot: |
  doc_repo main 20204af951e7e5f2deecd565fddc3c607d3e6508, working tree dirty (2026-09-16
  QA and scaleup artifacts untracked). Architecture traced to 90_operations/OPS-22 read
  read-only at its own 2026-09-10 snapshot. Live surface read: mcp.smartsite.cloud/llms.txt,
  2026-09-16. Report-state and plan-row reads 2026-09-15 and 2026-09-16 as cited inline.
related:
  - _smartsite_masters/00_README
  - _smartsite_gtm/10_product_base_for_marketing
  - 90_operations/OPS-22_spine_architecture_map
  - _inbox/2026-09-16_texas_scaleup_program_scope
  - _inbox/2026-09-15_reports_scope_handoff
  - _inbox/2026-09-15_smartsite_mcp_surface_card
  - 90_operations/OPS-16_texas_market_plan_of_record
purpose: One picture of the Smart Site platform for an internal reader, split so the market
  altitude and the platform altitude are never blended. Part 1 is what may be said publicly
  and points at the register that governs it. Part 2 is how it is actually built and what is
  live today. Written after the 2026-09-16 masters correction pass so the register and this
  doc agree.
---

# Smart Site platform overview

Two parts, deliberately separated. The two-altitude rule in `_smartsite_masters/01` forbids blending them in one artifact, so Part 1 is market altitude and Part 2 is platform and internal only. Do not lift a sentence from Part 2 into customer material.

## Part 1. The platform at market altitude

For anything customer-facing, `_smartsite_masters/` governs and this section only points. A longer handable base for an outside marketing agent is `_smartsite_gtm/10_product_base_for_marketing.md`.

**What it is.** Smart Site is a map-first web application over a verified physical-world data layer. The layer holds one canonical record per place, assembled from the fragmented public records that govern it, reconciled where they disagree, dated, and cited. The application turns that into answers a professional can act on and defend.

**The name covers the unit and the product, on purpose.** A smart site is any addressable place with everything that governs it pulled together: a lot, a building, a corner, the park you are standing in. Smart Site is also the application that puts smart sites in your hands. That is why "I'll share your smart site with you" works without explanation.

**The spine.** One place. All the layers. Always current. Cited. Yours.

**The claim is assembly, not pictures.** The value is not a prettier map of where things are. It is joining records that use different names for the same place, reconciling the ones that disagree by a defensible rule, catching the ones that have gone stale, computing a correct answer, and keeping the receipts.

**The composition upward.** A smart city is a whole community's worth of smart sites connected into one operating picture. That is the SmartCity OS line, which has its own positioning set and its own buyer. Professional material proves the layer; it never pitches the city product.

**The four things only we can say.** We sell answers, not data. The system fails honestly. Currency is checked, not assumed. Two doors, one truth. At least one belongs in any substantial piece of collateral.

**Where the commercial detail lives.** The locked ladder, the free-browse-paid-deep motion, the share loop and the coverage posture are in `_smartsite_masters/06` and the pricing source of truth it cites. Do not restate the ladder from this document.

## Part 2. The platform as it is built (internal)

### 2.1 The pipeline

```
SOURCES    county GIS, CAD rolls, state lidar, FEMA NFHL, city zoning layers,
           code libraries, address points, RRC, PUCT, TCEQ
   |
ACQUIRE    hauska-factory. fetch, parse, normalise, stage
   |
IDENTITY   prop_id -> geo_id -> feature_index -> place_key -> parcelNodeId -> entity_id
   |       seven identifier concepts. place_key is RAW, parcelNodeId is NORMALIZED,
   |       and the transform between them is an undeclared seam with an unmeasured
   |       collision population (leading-zero tokens).
   |
ATOMS      hauska_mcp. The claims estate. Typed, access-controlled, the catalog.
   |
RECORD     neondb. parcel_record, 981,405 x 65 rails, five states. The grid.
   |
GATE       publish-gate-sched, hourly, per (county, rail) -> parcel_gate_verdict
   |
SERVE      record-served where the rail is on the code-owned slate AND the verdict is
           pass; the legacy path otherwise; a distinct refused state for slated-but-denied
   |
SURFACES   Smart Site app, MCP connector, X-ray, Flood and Drainage, Feasibility,
           Command Center, Codex, Dashboards
   |
COMMERCE   tiers, entitlement, Stripe, metering
```

Source is `90_operations/OPS-22_spine_architecture_map.md`. That page warns that code moves and it does not; re-read it rather than quoting a count from here.

### 2.2 Repos and what each owns

| Repo | Owns |
|---|---|
| `hauska-map` | The Smart Site web application, the share plane, the workbench and report UI |
| `legacy-design-tools` | `cortex-api` (product API and entitlement), `api-server`, and `smartsite-mcp` (the agent connector) |
| `hauska-engine` | Reasoning and computation: report composition, envelopes, feasibility, flood and drainage, site plan authoring |
| `hauska-factory` | Jurisdiction onboarding and assembly, the rail grid, the publish gate, the control plane |
| `hauska-mcp-server` | The Hauska developer catalog. A separate product door, never the Smart Site connector |
| `hauska-retrieval-api` | The legacy atom-chain read path |

Deploys: the web application on Vercel, the services on Cloud Run under `hauska-prod-497015`, and the data on two Neon Postgres hosts.

**The store trap worth carrying.** The database name `neondb` exists on both hosts. A connection string that looks right against the wrong host returns a false absence rather than an error, so any lane that opens a store declares which HOST and which database it opened.

### 2.3 The surfaces

There are no pages to navigate in the application. The map is full-bleed and is the product; every tool opens over it and closes back to it. Layer toggles cover parcel boundaries, zoning and land use, FEMA flood zone and regulatory floodway, one-foot contours, hydrography, sidewalks and footpaths, and Opportunity Zone tracts, with one-tap presets for Default, Flood, Entitlement and Terrain. The inspect card is free by rule, needs no login, and is the hook. Deeper tools open one at a time into a single dock beside the map, governed by a design law that the map and the property stay the star, with no split screen and no second permanent panel. The user-facing walkthrough is `_smartsite_masters/05`.

The agent door is the Smart Site connector at `mcp.smartsite.cloud`, exposing the same facts, citations and confidence to an AI assistant, with OAuth against the user's own Smart Site account and the connector's own panel renderable inside the assistant. It is a door, not a tier: available at every rung including Free, mirroring the app's entitlement gates rather than carrying gates of its own (`_decisions/2026-08-31_smartsite_connector_is_a_door_not_a_tier.md`).

### 2.4 The certification model, which is the load-bearing idea

Correctness is verified, not asserted. Computed outputs pass mechanical gates before promotion to serving, and a plausible answer that has not passed its gate is not served.

The buildable envelope is the worked example: boundary cleanup, per-edge role labeling from road association, setback resolution per edge role, inset along each edge's inward normal in a metric frame, then a verification gate asserting the ring is non-empty, non-self-intersecting, contained in the lot, positive-area, and that each edge's inset matches its resolved setback measured index-matched to that edge's own normal. Only a passing envelope is promoted.

Above that sits a certification harness that grades the served product, what a customer actually renders, against authoritative ground truth, per place and per field, sweeping every parcel that renders rather than a curated list. A single failing parcel fails the area. Mechanical sweep plus a human eye on the rendered map is the unit of trust, and each human catch becomes a new assertion.

The general control the platform's own defect history demands is a non-vacuity test on every write path: prove that for at least one real input it produces a value, not merely that it runs. The origin case is still the cleanest illustration of why: an envelope computation had two return branches and both were `declined`, so it executed, returned a well-formed object, passed every test, and was structurally incapable of producing a value.

### 2.5 The honesty mechanics

The wire distinguishes `present`, `absent`, `absent-verified`, `unknown`, `refused` and `unread`, with `out_of_coverage` kept distinct from a no-hit. Two pairs must never collapse: a server-declared parcel miss versus a client-side click that never arrived, and a source's claim of absence versus an absence carrying provenance or a known vintage. Four other states read alike to a lay reader and stay distinguishable.

Nothing user-facing prints a machine token. The token-to-display table is `_smartsite_masters/09`, and the executable copy is `artifacts/smartsite-mcp/src/vocabulary.ts`. The doc is authoritative for citation, the code for behaviour, and a divergence between them is a defect in whichever changed without the other.

Three policies ride the payload rather than the prose, because anything prompt-based degrades: derived figures are denied so nothing may compute an area or coverage ratio from the ring, an unknown overlay carries an explicit null finding separate from its label, and `agentGuidance` rides every non-present facet.

### 2.6 Scale

Places are embarrassingly parallel, so national scale is an orchestration problem rather than an algorithmic one. A jurisdiction is assembled in isolation, verified, and only then atomically swapped into the serving store, which makes regeneration after an engine improvement a live-data-safe operation: a bad regeneration never touches live data, and a jurisdiction that does not pass does not go live. Terrain is the exception that proves the rule, being one continuous statewide source rather than a per-jurisdiction grind.

The portfolio commitment is under 200 dollars of compute plus one hour of human review per new jurisdiction, with a hard kill at three counties if unachievable. The current scale work is `_inbox/2026-09-16_texas_scaleup_program_scope.md`.

### 2.7 Live, partial, and absent, measured 2026-09-16

| Surface | State |
|---|---|
| Web app: map, layers, presets, inspect card, search, workbench dock, save, compare, share | Live |
| Claude connector and Claude Sync | Live, confirmed working by the operator 2026-08-31 |
| Feasibility study PDF, site plan export, terrain export | Live |
| Six Central Texas counties through the parcel-record program; nineteen counties serving from the July bake | Live |
| Certification gates and the honest-decline vocabulary | Live |
| Standalone Flood and Drainage generate | Broken. Synchronous route against a client abort near 55s; engine logs show success at 56 to 75s after the client has gone. The same computation succeeds inside the Feasibility composer. Diagnosed 2026-09-15 (P-227), fix not built |
| X-ray / dossier export on the connector | Partial. Refused with `pipeline_output_absent` 2026-09-15 (P-221); reported succeeding for a Solo account 2026-09-16 |
| Verified buildable-area atoms | Thin. Bastrop 3,935 and Caldwell 337 only, so the area figure stays withheld almost everywhere |
| Setback tables | Incomplete. 172 of 313 district codes uncodified over 18,405 of 61,574 parcels, a floor because two cities were unmeasured |
| Publish gate coverage | 17 of 65 rails graded; the other 48 are never asked |
| Connector capabilities | `ask_the_map` reports not ready, the radius selector on parcel lookup shipped non-functional and declared, plural constraint search is refused for Bastrop, and the records tools are not ready |
| Billing | Not live. Last verified 2026-08-31 with keys and price ids in Stripe test mode; no record found of live activation since. Operator-performed checklist is P-97 |
| Records Request (courthouse documents) | Not live on production, and deliberately off the purchase surface per the P-242 ruling |
| Connector directory listing | Unbuilt. Until it exists the connector is a reason to buy and a reason to stay, not a way to be found |
| 3D, valuation, the Prospect tier | Deliberately absent |

## 3. The corrections this pass made, and the two questions it did not answer

On 2026-09-16 the masters were corrected on the report menu and on the sales-motion line, both with dated notes in place. `_smartsite_masters/00`, `01`, `05`, `07` and `08` and `_smartsite_gtm/00` carry the corrections.

**Question 1, and it is a real one.** P-119 lists Flood and Drainage as a Solo deliverable, and the operator stated on 2026-09-15 that flood and drainage runs with feasibility and will not run as a standalone study. If Flood and Drainage only renders inside Feasibility, and Feasibility is Studio, then Solo's second advertised report has no standalone path. Three readings are live: Flood and Drainage gets its own fixed async route, or it becomes a Feasibility-composed artifact and the Solo bullet is amended, or Solo's flood report is a different, lighter artifact from the study inside Feasibility. Nothing here picks one. It needs the operator, and it gates what Solo collateral may claim.

**Question 2, narrower.** The X-ray derivation target of three to four sheets (operator, 2026-09-15) must be checked against P-119's tier split before it ships, because a subset renderer over the Feasibility model could leak Studio content into a Solo deliverable. `_inbox/2026-09-15_reports_scope_handoff.md` item 4 raises the same point. The allow-list for the X-ray render path has to be its own, not inherited.
