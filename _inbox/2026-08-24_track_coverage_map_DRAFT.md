---
id: 2026-08-24_track_coverage_map_DRAFT
title: Track coverage map A-E — shipped, in flight, uncovered, next cards (DRAFT)
date: 2026-08-24
status: draft-for-operator-review
owner: planner (read-only research subagent)
snapshot: doc_repo main; hauska-map main @ 75ac6f4; property STATE last_updated 2026-08-23T18:35Z plus P-60/P-60b closes dated 2026-08-24
sources:
  - session transcript 1df5be3c-7104-4a8f-8aa7-06cde46da9a1 (2026-08-23/24)
  - _state/property/STATE.md
  - _inbox/2026-08-24_p60_perf_commercial_close.json
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - _decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md
  - _inbox/2026-08-23_phase2_data_ingest_program.md
  - _inbox/2026-08-22_parcel_public_facts_gap_matrix.md
  - _inbox/2026-08-12_RPT1_existing_report_surface_inventory.md
related:
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT.md
---

# Track coverage map — A through E (DRAFT, not committed)

Program shape per the 2026-08-23/24 session: A commercial truth, B feasibility v1, C Phase 2 ingest, D setback and map, E CRM. This map records what that thread shipped, what has an owner in flight, what was discussed and is covered NOWHERE, and the proposed next card per gap. Companion feasibility spec: `_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md`.

Constraint honored throughout: where the transcript and canon docs disagree, the doc wins and the discrepancy is noted inline. Two such discrepancies exist (Track E Pipedrive, Track C MLS).

## Track A — Commercial truth (pricing, lander, unlock, share, Stripe)

**Shipped this thread (P-60 commercial polish, CLOSED code-done).** hauska-map [#198](https://github.com/empressaioemail-tech/hauska-map/pull/198) merged `75ac6f4`, deployed `dpl_FL1gCxWWQLJRsvBv7tDr3ai5ke6b` on smartsite.cloud. Per the close (`_inbox/2026-08-24_p60_perf_commercial_close.json`) and WDLL (`_inbox/2026-08-24_smartsite_commercial_polish_WDLL.md`): pricing UI rewritten to the locked ladder (Solo $49 / Studio $129 / Team $299, unlock $15 for 30 days, retiring the "$15 forever / Go Pro $99" strings that were live); share mint free on sign-in (ShareTool and pe-share no longer gate on property unlock, matching the locked "share is a free function" ruling); landing SignUpCard copy updated; unlock checkout hardened to reject instant-unlock and non-Stripe checkout URLs. The unlock-bypass investigation found the production path does not use `armed:true` dev-unlock; the operator's own account carries `devRole`, which explains "it let me straight in." Verification with a fresh non-dev account is owed.

**Discussed, NOT covered anywhere (no card, no owner):**

1. **Stripe dashboard price rebuild.** Live Stripe prices are still 2900/6500/9900 against the locked 4900/12900/29900 (recorded in `_decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md`: "Amounts on live Stripe prices are still 2900/6500/9900 against the locked 4900/12900/29900; that rebuild stays 76j, not a silent catalog edit during polish"). UI now says the right numbers; checkout can still charge the wrong ones. Named open in the P-60 close; no card exists.
2. **Solo vs Studio checkout split.** Both subscribe buttons hit one subscription endpoint today (session close finding); tier-distinct Stripe price wiring in cortex is unbuilt.
3. **P-28 "Hauska Pro" naming hard gate.** OPS-16 row P-28: Stripe product still reads "Hauska Pro," a branding-canon violation that "must not reach an external tester" (`_inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md`). Rides the same Stripe rebuild.
4. **Team self-serve seat management.** A launch requirement per the locked GTM doc ("Team creates itself... Launch requirement"), not started.
5. **Dunning and plan-change self-service.** Locked-doc launch item 3, "absent today and is silent churn at scale." No card.
6. **Operator visual QA** on the deployed pricing/share/landing surfaces, owed from the P-60 close.

**Proposed next card.** One Stripe-rebuild card under 76j: create the four recurring products plus the 30-day unlock at 4900/12900/29900/1500 with Smart Site naming (clears P-28), wire distinct Solo/Studio price ids through the cortex checkout endpoint, verify webhook entitlement mints the right tier per price id, then delete the old prices. Team seats and dunning are a second card; they are launch-gating per canon but independent of the price rebuild.

## Track B — Feasibility v1 (report assembler)

**Shipped this thread: nothing, deliberately.** Operator parked it 2026-08-23 ("jsut park the report for a minute, we'll come backto it"), recorded in the P-60 close as "Parked: feasibility report assembler." What exists is groundwork: RPT1 (`_inbox/2026-08-12_RPT1_existing_report_surface_inventory.md`) proved the styling system and the dossier assembler precedent are reusable wholesale, and this session produced the target artifact analysis (Val's Whitetail Ridge package, 57 sheets).

**Not covered anywhere:** the report spec itself, a plan row, and a WDLL. OPS-16 has no assembler row (P-26 is the utility probe, closed). Under the WDLL practice rule, sprint-scale work cannot start without an operator-approved WDLL, and under AGENTS.md "work that cannot name a plan row is not scoped."

**Proposed next card:** the v1 assembler card specified in `_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md` (the companion deliverable), entering OPS-16 as an amendment row, with the WDLL acceptance items written there.

## Track C — Phase 2 ingest (ETJ, utilities, footprint, HOA docs)

**Already covered by canon (in flight or staged).** Phase 2 is ACTIVE per `_inbox/2026-08-23_phase2_data_ingest_program.md`; the field-level truth is the 38-row gap matrix (`_inbox/2026-08-22_parcel_public_facts_gap_matrix.md`) and the 66-row deficit canvas.

| Item | Coverage today | Where recorded |
| --- | --- | --- |
| Utilities who-serves | Staged, not a rail: PUCT water CCN 3,925 + sewer CCN 1,455 + HIFLD electric 139 + TWDB PWS 4,590 + TCEQ 87 polygons in `tx_utility_territory_staging` (L22 close). Probe verdict: v1 shape is territory who-serves with a SERVICE-LETTER-REQUIRED residual; mains are city-scoped depth, not a rail (OPS-16 A-014, L10 close). Product surface explicitly post-gate per A-012 ruling 4 | L22 close, A-012/A-014, P-26 CLOSED |
| Building footprint | Staged: 291,475 rows / 86 cities (L20); ML-fallback rail default per T3 (0/11 CAD counties have vector footprints); gold parcel still atom-miss; site-plan surface has zero footprint consumers (RPT1) | L20 close, T3/ADR-029, P-60 close open item |
| CAMA metros (living area, year built, deed date, plat, situs) | P0 backfill list items 1-7 in the Phase 2 program; Dallas/Tarrant bulk is stack position 2 | Phase 2 program doc |
| ETJ / city limits | Gap matrix row 35: source named (TxGIO City_Boundaries, 1,225 cities), store 0, atom none, inspect declines. **No adapter, no plan row, no card** | gap matrix only |

**Discussed, NOT covered anywhere:**

1. **ETJ adapter card.** Row 35 names the source but nothing owns the build. Val's report ranks city/ETJ its single High-priority open item; it is also the cheapest high-value ingest on the board (one statewide polygon layer, point-in-polygon against parcel centroid, three-state output: inside city limits / inside ETJ / neither).
2. **HOA / recorded-restrictions ingest.** Absent from all 38 gap-matrix rows and the deficit canvas. This is the largest thing Val's package has that the platform cannot produce (CC&R synthesis: 10.01-acre minimum, ACC approval, private roads, utility easements). No source recon, no scope, no card. Likely lands as a Smart Files recorded-doc mount plus extraction, not an atoms rail; needs a scoping card before any build.
3. **Private-vs-public road classification.** Val's Declaration resolved "no road node attaches" as a private POA road, not missing data. Roads ingest (2/254 counties, OSM) has no private-road facet and no honest distinction between "no road data" and "private road." Small card, rides the roads program.
4. **MLS fields — discrepancy, docs win.** The session transcript suggested "Tax record + MLS where licensed" for improvement/living-area data. Canon excludes it: gap matrix row 38 marks Sales/MLS "out of scope (not public record)" and the standing decision in `_STATE.md` is uniform public-record only. Living area and year built come from CAMA bulk (P0 item 1), not MLS. The feasibility plan carries the same ruling.

**Proposed next cards (sequenced by report value, argued in the companion doc):** ETJ adapter (new amendment row), who-serves rail promotion decision (operator ruling: A-012 named it a post-gate consideration; the feasibility utilities section is the concrete consumer that forces the call), footprint drain-stamp-score to gold serve, HOA ingest scoping card. CAMA metros already stack-ranked in Phase 2.

## Track D — Setback / map (sheet-sealed envelope, consumed outline)

**Shipped this thread.** Three closes:

1. **P-60 perf/viz** (hauska-map #198): one live derive per inspect (was two serial ~400ms POSTs), consumed-lot dashed outline drawn from sheet geometry, envelope status wire fix (`empty` vs `no-buildable-area` mismatch that starved `setbackConsumedOverlay`).
2. **P-60 wedge hotfix** (#197, prior session): `parcel_node_id` on POST caused cortex 400 and no geometry.
3. **P-60b inset gate fix** (LDT [#468](https://github.com/empressaioemail-tech/legacy-design-tools/pull/468) merged `5299bb9d`, serving `cortex-api-00562-siv` @100%): the root cause of "setbacks consume the lot" on parcels with visible houses. The 8cm self-touch and midpoint-probe heuristics rejected valid envelopes; replaced by a conservation check derived from the clip outputs, verified by violation. `emptyKind` now splits `consumed` vs `geometry-validation-failed` on the wire. Frontage-curve grouping (one logical street edge along a segmented curve) and 25m corner adjacency (killed the fabricated Dashwood Creek corner). Live: Simsbrook `48453:280239` ok 3,074 sqft / 45.4%; `48021:34073` ok 3,511 sqft / 38.9%; `48021:34137` unchanged. Setback tables were verified correct throughout; the defect was geometry validation. WDLL grading: `_inbox/2026-08-24_p60b_inset_gate_fix_WDLL.md`.

**Open QA with no owner (loose threads from the transcript):**

| # | Thread | Raised | State |
| --- | --- | --- | --- |
| D1 | Hatch stripes running perpendicular to the front setback on the curved frontage (visual polish on the wedge fill) | operator, 2026-08-24 05:50 (last message of the session) | no card, no owner |
| D2 | Intermittent load failure: sometimes "Reading parcel..." hangs, sometimes an error card | operator, same message | no card, no owner; distinct from the fixed serial-derive slowness |
| D3 | Operator map-paint visual QA on both recovered wedges | P-60b close | owed to operator |
| D4 | Baked-facets envelopes carry `buildableAreaSqFt` with ringVerts=0, tripping the strict smoke suite on 34073/34785/34017. Pre-existing; needs a ruling: bake rings, or teach the instrument | P-60b leave-behind | no card |
| D5 | Cohort probe instrument prints a stale deploy SHA | P-60b leave-behind | no card |
| D6 | Card zoning glance: "SF-5" screenshot vs SF-S serve. Browser QA read SF-S live; likely a misread, else a stale atom. Verify once and close | P-60b close open item | verify-only |
| D7 | Wave 2 deferred: cortex accepts `parcel_node_id` on POST (resolve-by-id, skip geocode); geocoder misses full "17005 Simsbrook Drive" suffix | 2026-08-24 handoff | deferred, recorded in handoff only |

**Proposed next card.** One P-60c polish card bundling D1 (hatch orientation follows the setback edge, or drop the hatch for a flat fill), D2 (instrument the load path: distinguish resolver timeout vs cortex 5xx vs facets miss, then fix the dominant class), and D6 verify. D4 needs its own small ruling-then-fix card since it decides whether the baked chain carries geometry. D7 stays parked unless D2's diagnosis lands on geocode.

## Track E — CRM (decision framing, not a build plan)

**The ruling that stands.** `_decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md`: Pipedrive IS the Smart Site subscriber CRM; Smart Site checkout feeds it a `smartsite` tag plus a tier tag (`solo`/`studio`/`team`/`free`), written by the Stripe webhook (never the client); self-serve pricing is a popup, not a page; Vercel Hobby stays. This decision explicitly overruled the planner's Stripe-plus-affiliate-no-CRM recommendation. The 2026-08-23 session transcript re-recommended the kill ("Recommendation: Stripe Customer Portal + product analytics as the core... If nobody opens Pipedrive weekly, kill it"). **Docs win: Pipedrive stays**, and the kill question is already encoded as the decision's own reversal criteria (reverse if the webhook cannot write tags without a client-side CRM key, or if a Pipedrive person becomes a Dashboards city feed). The honest framing for the operator: the keep/kill debate is settled unless a reversal criterion fires or the operator reopens it; what is NOT settled is that none of the ruled wiring exists. Property STATE (2026-08-17 drain note) records "Pipedrive + pricing popup not built." The decision without the webhook wiring is a control that cannot fire. Meanwhile the transcript's substantive point survives intact on the analytics side, because canon already requires it independently of any CRM: the locked GTM handoff makes funnel events with consent flags (76a schema), share-loop attribution (`share_created`/`share_viewed`), and activation instrumentation launch-blocking items 5-7, and none are wired. Proposed next card: one E-track card that builds the Stripe-webhook-to-Pipedrive tag write (with the tag sourced from minted entitlement, per the decision's earned-not-asserted requirement) and the 76a funnel event emission in the same wave, plus a usage checkpoint at the first month of live tags: if the tagged-subscriber view has no reader by then, that is evidence for invoking the reversal criteria, brought to the operator rather than acted on.

## Cross-track loose ends (nowhere else to file)

1. **Alan Watch mobile design handoff** (`_inbox/2026-08-23_alan_watch_app_design_handoff.md`): separate design workstream, surfaced during QA triage, no track.
2. **Substrate publish queue**: atom-contract [#22](https://github.com/empressaioemail-tech/hauska-atom-contract/pull/22) + MCP [#74](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/74) CLOSED_PENDING_PUBLISH (property STATE Phase 1 table). Not a track A-E item; listed so it does not vanish.
3. **Doc_repo hygiene**: this thread's WDLLs and closes were committed (`476cca2` and successors); the P-60b doc edits were left uncommitted for planner review per protocol. Whoever owns the next session close should sweep `_inbox/2026-08-24_*` status.
