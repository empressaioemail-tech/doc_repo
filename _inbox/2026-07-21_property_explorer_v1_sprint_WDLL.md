---
id: 2026-07-21_property_explorer_v1_sprint_WDLL
title: WDLL — Property Explorer v1 sprint (Central-TX complete path)
status: approved
date: 2026-07-21
applies_to: hauska-map (property-explorer), legacy-design-tools (cortex-api, node-facet bake, reporting), hauska-mcp-server (deferred wave), hauska-atom-contract (deferred wave), hauska-brief-extension (smoke)
related: [75j_property_explorer_destination_ledger, 2026-07-21_architecture_gaps_node_facets_atomization_and_gated_functions, 2026-07-21_overpass_road_data_spec, 2026-07-20_map_first_program_launch, 48_cortex_reporting_function_dashboard_spec, 54_tenant_leg_sprint, 90_runbooks/wdll_practice]
owner: nick
---

# WDLL: Property Explorer v1 sprint

Date: 2026-07-21  
Status: approved  
Operator approval: 2026-07-21

Destination north star (not abandoned by this sprint): `75j_property_explorer_destination_ledger.md`. This WDLL is the Start card for the autonomous multi-wave sprint that advances every ledger dimension that can move without Comal paid acquisition. Items marked DEFERRED stay on this card so the end state cannot silently drop; they are graded at close as met / partial / deferred-held (with the follow-up named).

## Done looks like

On the live deploy URL `https://property-explorer-m38nta44a-empressaioemail-techs-projects.vercel.app/`, any Central-TX parcel click returns a cited, gate-honest buildable answer (envelope drawn where setbacks exist; honest absence elsewhere), with FEMA and other facets verified live — not from bake summaries. A signed-in user can unlock paywalled deep work: spine-backed reports with map + report visualizations (layer-manifest contract), save/research flows, and a GTM/CRM path modeled on the trading app's GTM system (reference only — no trading code). Auth is native OIDC (Google + Microsoft/Outlook first; other common providers additive), user-aware entitlement, no Clerk. Architecture stays A3 (product ships in `hauska-map/apps/property-explorer`; extract-to-own-Surface is an explicit later criterion, not done silently). Facet→atom projection + MCP catalog placement are a quick follow-up wave after UI is functioning; they remain on this card and in the GTM story. Command-center remains the operator control tower; property-explorer is the consumer front door. Comal is bypassed this sprint (honest gap). Feasibility/valuation stays out of scope.

## Architecture rulings (frozen into this card)

| Fork | Ruling |
|---|---|
| A | A3 — stay in `hauska-map/apps/property-explorer`; extract later is a named acceptance item, not this sprint's merge bar |
| B | Command-center = operator control tower (integrity/ops); buyer GTM (signup/billing/CRM) lives on the consumer app |
| C | C3 then C2 — facet→atom projection + route entitlement first; native bake atoms follow; paywall also pulls other spine reporting functions |
| D | No Clerk — native OIDC (Google + Microsoft/Outlook first) |
| E | Report owns narrative + layer manifest; map-renderer draws; no second renderer |
| Scope | Property Explorer only (no trading code). Trading app = GTM reference only |
| Ops | Planner merges + deploys autonomously; secrets missing → hold list for operator at wave end; spend caps = platform; visual QA = operator gate |
| Comal | Bypassed (honest gap) |
| ICC | Creds treated as spine-baked when present; surface on map when ingest serves |

## Report surface rule (Fork E — proposed for approval)

Do **not** dump the entire command-center sandbox into the consumer app. Surface the parcel-relevant **Property Intel + Site Analysis** families that produce a cited answer and (where spatial) a layer manifest. Plan Review (city reviewer) and Design Accelerator (drawings/BIM) stay on command-center / Codex / AEC surfaces unless a later amendment pulls a specific function across.

| # | Report / function | Consumer paywall? | Map viz (manifest)? | Notes |
|---|---|---|---|---|
| R1 | Property brief (flagship synthesis) | YES — primary | YES (constraints + envelope + hazard layers) | "Research this" deep answer |
| R2 | Buildable / constraints read (setbacks + envelope + zoning + flood) | YES — wedge | YES (envelope + setbacks + flood) | Already partially on browse; deep = report + export |
| R3 | Hazard profile (FEMA + perils) | YES | YES (flood extent) | Spine hazard report |
| R4 | Encumbrances | YES | optional pin/overlay | Property Intel live |
| R5 | Site topography | YES | YES (contours/hillshade) | Site Analysis |
| R6 | Site drainage | YES | YES (flow / flood-depth) | Site Analysis |
| R7 | Hydrology / watershed | YES when spine Live/Building serves honestly | YES (flow lines) | Degrade honest if worker degraded |
| R8 | Local setbacks (tabular + drawn) | YES | YES | Already browse-partial |
| R9 | Place dossier | YES (secondary) | thin | If spine serves without AI on browse path conflict |
| R10 | Subsurface suitability | YES when honest | YES if spatial | Building on spine |
| R11 | Plan review / compliance run | NO (this sprint) | — | Command-center / Codex |
| R12 | Letter / intake queue | NO | — | Reviewer surface |
| R13 | Design Accelerator / IFC / renders | NO | — | AEC-cortex |
| R14 | Feasibility / valuation / AVM-as-worth | NO | — | Ledger row 4 deferred (honest out-of-scope) |

**Operator stamp 2026-07-21:** R1–R10 is the correct consumer paywall set for this sprint.

**Circle-back (deferred reports — spine not built yet):** Operator wants additional Property Intel / Site Analysis functions on this surface later (examples already named in the function matrix as Planned/Building: stormwater/detention sizing, grading/cut-fill, solar/aspect, viewshed, climate risk trajectory, insurance cost estimate, comparative jurisdiction, permit approval precedent). They are NOT in R1–R10 because the spine does not serve them yet. When a spine report_run (or equivalent) goes Live for any of these, amend this WDLL (or a follow-up card) to add an Rn row and wire it through the same paywall + layer-manifest path. Do not invent consumer stubs ahead of spine. Track: see Explicitly out of scope table + 75j row 6.

R11–R14 stay out unless amended.

## Acceptance items

Stacked in execution order. Dependencies named. No timeframes. Every dispatch/PR cites item numbers. Adversarial review verifies cited items + live endpoint. Deploy target: `https://property-explorer-m38nta44a-empressaioemail-techs-projects.vercel.app/`.

### Wave 0 — Live honesty (gates everything)

1. Live URL boots map-first cold open (Empressa brand, Google + browse) | check: HTTP 200 + title/brand on deploy URL; screenshot or DOM proof | grade: [ ]
2. Anonymous browse: click a known Central-TX parcel → facet card with baked source, no owner field, honest absence where unverified | check: proxy facet endpoint returns `source:"baked-snapshot"` + real facets; UI matches | grade: [ ]
3. FEMA fill status recorded honestly per county (verified / in-progress / not verified) — no fabricated flood | check: live card + `county_facet_coverage` (or equivalent ledger) for ≥1 complete and ≥1 pending/absent county | grade: [ ]
4. Operator visual QA sign-off on Wave 0 | check: operator states go / defect list | grade: [ ]

### Wave 1 — Moat (ledger rows 1, 2, 7, 8)

5. Remaining owed setback tables landed for cities that already show zoning but null envelope (the 8-table debt, minus any jurisdiction blocked on source) | check: for each city in the owed list, a sample parcel draws envelope OR honest "setbacks not verified" with citation path; gate-verified, not bake-summary | grade: [ ]
6. San Marcos zoning CRS diagnosed and either fixed (matches >0) or documented honest gap with root cause | check: live zoning facet on a San Marcos parcel OR recorded gap in coverage ledger | grade: [ ]
7. `OVERPASS_URL` env-configurable (no hardcoded public instance) | check: merged PR + env documented in deploy runbook | grade: [ ]
8. Self-hosted Overpass (Option A) stood up for TX extract OR explicitly blocked with hold reason for operator (infra) — code path ready either way | check: bake/service can point at non-public Overpass; smoke query returns highway ways | grade: [x] met (re-grade 2026-07-23) — tip `cortex-api-00428-fax` env has OVERPASS_URL; LDT #350/`ab34b330` durable workflow mount (see STATUS)
9. Where Overpass is live: Tier-2 road-based envelope re-bake for at least one county shows `roadSignalUsed:true` and higher front-edge confidence; elsewhere remains honest inferred | check: live node facet + coverage ledger | grade: [x] met (re-grade 2026-07-23) — `node:48055:11386` edgeSignal:road / roadSignalUsed:true after tip remount (see STATUS)
10. No coverage % advanced without owner-match (or successor) gate pass | check: adversarial review of any new coverage claim against ledger | grade: [ ]
11. Comal remains honest gap (bypassed) — no fabricated land-use/zoning/setbacks | check: Comal facets null/not-verified; no false coverage row | grade: [ ]

### Wave 2 — Auth + entitlement (ledger row 13; enables paywall)

12. Native OIDC sign-in on property-explorer: Google + Microsoft (Outlook) working on deploy URL; no Clerk dependency | check: live sign-in both providers → session established; code search shows no Clerk | grade: [ ]
13. Session is user-aware (not install-keyed); anonymous browse still works without account | check: anonymous facet read unchanged; authed identity visible to BFF | grade: [ ]
14. Entitlement gate: anonymous = browse; authed free/paid tiers distinguished for deep routes (even if paid product is test-mode) | check: deep route 401/402 without entitlement; 200 with; browse unaffected | grade: [ ]
15. Tenant-isolated storage seam for saved properties (no cross-user leakage) | check: user A cannot read user B saved set (automated or live probe) | grade: [ ]
16. Missing secrets (OAuth client IDs/secrets, etc.) collected on a hold list for operator — does not fake auth | check: hold list filed if blocked; no stub that claims live OAuth | grade: [ ]

### Wave 3 — Paywalled reports + visualizations (ledger rows 6, 9; Fork E)

17. "Research this" (or equivalent) unlocks R1 Property brief from spine for an authed entitled user | check: live run on deploy URL; cited brief; anonymous denied | grade: [ ]
18. R2 constraints/buildable deep report available paywalled with drawn envelope + setbacks + flood on map | check: manifest layers visible on map after report run | grade: [ ]
19. R3–R6 (hazard, encumbrances, topography, drainage) callable from the consumer paywall via spine report_run (or equivalent), each with layer manifest where spatial | check: one live probe per report type OR honest degrade badge if spine degraded | grade: [ ]
20. R7/R10 hydrology/subsurface: wired with honest degrade if spine not ready — never fake geometry | check: degrade path proven | grade: [ ]
21. Report ↔ map uses layer-manifest contract (report does not draw; map-renderer consumes manifest) | check: code + live overlay; adversarial contract cross-check | grade: [ ]
22. Shareable/exportable deliverable path for at least R1 or R2 (PDF or link) behind paywall | check: entitled user obtains artifact; anonymous cannot | grade: [ ]
23. Operator visual QA on paywalled report + map viz | check: operator go / defect list | grade: [ ]

### Wave 4 — GTM + CRM (ledger rows 14, 15) — trading app = reference only

24. GTM system captured for Property Explorer (funnel, free-browse → paid-deep, persona entry) refined from trading GTM docs — filed in doc_repo, not a trading clone | check: canonical GTM doc exists + linked from 75j / this program | grade: [ ]
25. CRM hooked: signup and/or save-property and/or research events create/update a lead/deal in the CRM used by this product line (Pipedrive or successor already in portfolio) | check: live event → CRM record observable | grade: [ ]
26. Billing/checkout seam for paid deep (test-mode acceptable) aligned with free-browse + paid-deep model | check: checkout or entitlement flip probe; anonymous browse untouched | grade: [ ]
27. Marketing/landing claims match honest coverage (no over-claim vs ledger) | check: adversarial copy check vs live coverage | grade: [ ]

### Wave 5 — Surfaces polish (ledger rows 5, 11, 12; partial 3)

28. Three persona registers flexed on this surface (homeowner / investor / architect) off the same facts for the inspect + report paths | check: same parcel, three registers, no contradictory facts | grade: [ ]
29. PWA installability + on-site basics (manifest, full-bleed map usable on phone, GPS) | check: Lighthouse/install prompt or manifest proof + mobile viewport probe | grade: [ ]
30. Extension #34 (or current) smoke: listing capture can hand a property to the web app account path OR honest blocked claim filed | check: smoke script or operator probe | grade: [ ]
31. ICC-on-map: when spine serves I-Code atoms, a paywalled or deep path cites ICC for a sample parcel build question; if creds/ingest absent, hold list — no fake citations | check: live citation OR hold item | grade: [ ]

### Wave 6 — Atoms + MCP follow-up (ledger rows 10, 16) — DEFERRED but on-card

Intentionally after UI paywall is functioning. Part of GTM (agent/MCP market). Quick follow-up, not dropped. Further MCP ambitions (operator) are out of this card's detail but the placement below is the door.

32. Facet→atom projection: zoning, setbacks, envelope, flood, land-use project to `@empressaio/atom-contract` shapes with `accessPolicy` | check: contract-valid atoms for a sample node; conformance test | grade: [ ]
33. accessPolicy enforced as durable paywall for projected facets (public-free browse vs public-paid deep) — route entitlement may remain as defense-in-depth | check: paid facet denied without entitlement at gate/catalog | grade: [ ]
34. MCP placement: parcel/node facet atoms discoverable + readable via hauska-mcp-server (map or public/codex gate as appropriate) with metering hook | check: live tool list + successful tool call against a known parcel | grade: [ ]
35. Thesis parity ledger entry filed for atomize + accessPolicy + MCP serve | check: `_catalog/thesis_parity_ledger.md` updated | grade: [ ]
36. Architecture reconcile note: parallel facet store vs projection documented; extract-to-own-Surface (A3 later) criterion written (when: paywall+MCP stable) | check: doc filed; 75j row 16 current % updated | grade: [ ]

### Cross-cutting (every wave)

37. Every PR cites WDLL item numbers; adversarial review grades those items before merge | check: PR body + review artifact | grade: [ ]
38. Every deploy verified against live URL/endpoint (not workflow green alone); cortex canary before traffic shift per deploy runbook | check: probe log in wave close | grade: [ ]
39. Fresh tip / no stale-clone: workers verify origin/main SHA before edit | check: dispatch preamble | grade: [ ]
40. 75j destination ledger Current + % updated for any row that moved; deferred rows explicitly noted so end state is not lost | check: 75j bump + session note | grade: [ ]
41. No Anthropic models on the critical path (Cursor Task/subagents; Grok/composer family) | check: dispatch model pins | grade: [ ]

## Amendments

- 2026-07-22: items 42–50 (uniform county coverage equalization, Bastrop P-code mapping, roads rebake all corpus counties, R1 spine wire, gold QA list, dev paid bypass) — see `_inbox/2026-07-22_pe_coverage_equalization_and_spine_WDLL_amendment.md`. Operator: max coverage before gold QA; hold Stripe/Pipedrive; atoms later.

## Explicitly out of scope this sprint (destination preserved)

| Item | Ledger | Disposition |
|---|---|---|
| Comal land-use / setbacks / zoning | 1, 8 | Operator-owned; honest gap; item 11 |
| Feasibility / valuation | 4 | Remains deferred; R14 |
| Plan Review + Design Accelerator on consumer app | — | Stay on cmdcenter/Codex/AEC; R11–R13 |
| Full native bake→atom rewrite (vs projection) | 16 | After Wave 6 projection proves shape |
| Property-explorer extract to own repo | 16 | A3 later; item 36 criterion |
| Operator's broader MCP ambitions beyond catalog placement | 10, 15 | Door = items 32–34; ambitions = next program |
| Trading app code / shared runtime | — | GTM reference only |

## Agent operating model (for the autonomous run)

```
Main planner (this agent)
  ├── Sub-planner Moat (Wave 1) → workers + adversarial reviewer
  ├── Sub-planner Auth/Paywall (Waves 2–3) → workers + adversarial reviewer
  ├── Sub-planner GTM/CRM (Wave 4) → workers + adversarial reviewer
  ├── Sub-planner Surfaces (Wave 5) → workers + adversarial reviewer
  ├── Sub-planner Atoms/MCP (Wave 6, after UI) → workers + adversarial reviewer
  └── Planner-owned: merge, canary, live probe, traffic shift, 75j updates
```

Operator gates mid-sprint: visual QA (items 4, 23); WDLL amendments; secrets hold-list resolution. Merge/deploy otherwise autonomous.

## Amendments

- 2026-07-21: R1–R10 ratified as consumer paywall set; additional Planned/Building matrix reports deferred until spine Live — circle-back note filed in Report surface rule (operator approval same day).

## Finish card (graded at close)

(grade each item 1–41: met | partial | deferred-held | dropped — one line of evidence)
