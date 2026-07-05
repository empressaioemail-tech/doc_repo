---
id: draft_siting_spike_memo
title: Siting spike memo — Phase 4 monetization capture (convergence program)
status: draft
last_updated: 2026-07-05
applies_to: portfolio
owner: planner
related: [09_post_saas_substrate_thesis, 77_place_graph_strategy, 75m_map_data_visual_benchmark, _catalog/repo_intents, _decisions/2026-07-04_convergence_program_execution_model, _decisions/2026-07-04_master_map_and_console_unification, _inbox/2026-07-04_convergence-program_STATUS, 08_tiered_access_model, 14_pricing_framework]
---

# Siting spike memo

## Provenance and scope authority

The convergence program names this artifact but does not define it. The Phase 4 queue in the live tracker reads "Phase 4: Stripe test-mode pricing; proof-of-record spec; siting spike memo; certification scaffold" (`_inbox/2026-07-04_convergence-program_STATUS.md`, queue item 7, repeated in `_sessions/2026-07-05_convergence_execution_claude_code.md`). The only other program reference is the Cotality pickup item in the same tracker: production keys are the "#1 external gate for the Max map, the brief's comps, and any Phase 4 siting demo." Phase 4 itself is defined as "monetization capture" in `_decisions/2026-07-04_convergence_program_execution_model.md`. No decision record, research file, or canonical doc carries a fuller written scope for the siting spike; a word-boundary search of the repo confirms those are the only occurrences.

This memo therefore does two jobs: it fixes the spike's scope from the documented demand signal, and it frames the spike itself. The demand signal is recorded in `77_place_graph_strategy.md` (mineral intelligence section, operator conversation 2026-05-27): data-center buyers increasingly seek large tracts, surface plus minerals, for on-site gas generation, "a segment distinct from urban infill apartments but same graph primitive." The same buyer class appears in `77a_txcrg_crm_and_brokerage_ops.md` revision history and in `30_smartcity_os.md`, which records EdgeConneX building a second Bastrop County data-center campus. The Reeves skeleton (O&G, `_verticals/oil_gas/86_executive_summary.md`) is the adjacent parallel track, not this spike; the O&G ontology and 3D subsurface work stay sequenced with Reeves per the execution-model decision and `_decisions/2026-07-04_master_map_and_console_unification.md`. This spike is the real-estate-side large-tract siting screen, and it should compose with the Reeves layer families through the shared LAYER_REGISTRY rather than fork.

Nothing in this memo is a commitment to build. A spike memo earns a go/no-go decision, and the decision record, if go, follows the `decision-log` format separately.

## The question the spike answers

Can the existing spine, composed as it stands today, produce a cited, confidence-carrying siting screen for a large-tract buyer (data-center class) that someone will pay for per query, without opening a new data workstream?

Phrased against the program: is siting intelligence a Phase 4 monetization artifact (a composition and packaging problem over capabilities that already exist) or a disguised Phase 5 vertical (a build gated on data we do not hold, chiefly power)? The spike exists because the honest answer is not obvious. The physical and regulatory half of a siting screen is largely built and verified. The datum that dominates real data-center site selection, grid power availability, is entirely absent from the portfolio. The spike's job is to establish whether a power-blind screen still clears a willingness-to-pay bar as a constraint pre-screen, before any commitment to a power-data ingest.

## The smallest demo that answers it

One county, one candidate tract set, one metered output. Bastrop County is the correct venue: it is the only place where corpus depth (Bastrop UDC public-free plus Bastrop County atoms, per the 2026-06-06 recon in CLAUDE.md), a live data-center construction market (EdgeConneX second campus, `30_smartcity_os.md`), and existing free map layers all coincide. Reeves County is the wrong venue for the spike because it is not in the corpus and onboarding it is exactly the kind of scope creep the spike must not absorb.

The demo: given a handful of candidate tracts in Bastrop County, produce for each a single cited siting screen answering "what would stop you building a large-footprint facility here," composed entirely from verified capabilities, delivered as an MCP-consumable result (commitment 4) and rendered through the master map, with a metered price on the query (Phase 4 tie-in, Stripe test mode only per the autonomy grant). Every finding carries source, confidence, and timestamp per commitment 1, with confidence at the asserted-baseline-with-provenance posture commitment 2 permits, never presented as earned calibration we do not have.

The screen's sections, each mapped to a capability that exists:

Flood and hazard. FEMA flood zone and floodway are live map layers; `get_hazard_profile` is a verified prod gate tool.

Topography and drainage. DEM is on the engine, hydrology D8 is computed, and `get_site_topography`, `get_site_drainage`, and `simulate_site_drainage` are verified prod gate tools.

Regulatory overlays. MUD/PID special districts, Edwards Aquifer recharge (TX), Opportunity Zones, and groundwater (USGS NWIS) are live on the map path; `assemble_map_layers` is a verified gate tool.

Subsurface conflict. TX RRC wells and pipelines are a live map layer, which gives the surface-versus-mineral-estate conflict signal the 77 demand note identifies (dominant mineral estate, surface waivers).

Jurisdictional posture. Retrieval over the Bastrop UDC and county atoms (corpus verified live at 21,126 atoms across 34 jurisdictions per the tracker's redeploy log) answers use permissions and development standards with citations.

Encumbrances. The encumbrance atom family (ADR-020/021) exists in the contract; include recorded-restriction findings only where instruments are actually ingested for the subject tracts, and state absence plainly otherwise.

Delivery. Layers register into map-renderer's existing LAYER_REGISTRY with allocation per `_decisions/2026-07-04_master_map_and_console_unification.md`; the metered call runs through the deployed four-gate MCP server (63-tool catalog verified live in the tracker).

That is the whole demo. No new vendor, at most zero new adapters, one new composition. If the demo needs more than that, the spike has already produced its answer.

## Built versus proposed, stated honestly

Built and verified: the six map gate tools listed above (probed 6/6 on the deployed four-gate revision per the tracker), the free federal and state layers named above (`75m_map_data_visual_benchmark.md`, live-smoked 2026-06-19), the corpus and retrieval path, the encumbrance atom types, LAYER_REGISTRY with resolveLayerAllocation (verified against origin/main per the master map decision), and the gate metering machinery on deployed main.

Proposed and not built: the siting screen itself as a composition; the buildable-envelope composite it would lean on is explicitly a synthetic stub even at fixture:false (`75m` Part C item 1 and the 2026-06-19 live-status note), and the comparative-jurisdiction report (`75m` Part D item 9) is a proposal. Metering is deployed as gate machinery but Phase 1 "metering wired" is still an open queue item, and pricing is test-mode only. Nothing in this memo upgrades any of that.

Degraded or gated today: SSURGO soils is wired but upstream-degraded (USDA TLS resets from Cloud Run), so foundation-suitability rides the screen only if that connectivity fix lands; parcel geometry and ownership are Cotality-gated, and the demo key expires 2026-07-06, which is why the tracker names Cotality production keys the number-one external gate for any Phase 4 siting demo.

## Data the screen needs that we do not have

Power. No adapter, layer, or doc anywhere in the portfolio covers transmission lines, substation capacity, or interconnection queues (ERCOT or otherwise). The full map data universe in `75m` Part A contains no power source. For data-center siting this is the dominant criterion, and we are blind to it. This is the spike's central honesty point.

Large-tract ownership and assemblage. Parcel mesh and ownership are Cotality-gated; without production keys the screen cannot say who owns the dirt or whether an 8,000-acre assemblage is plausible.

Mineral and lease index. The county clerk mineral/O&G index is an open decision (PG-1 and PG-3 in `77_place_graph_strategy.md`), not a capability. The RRC wells layer shows drilled reality, not recorded mineral ownership.

Water rights and availability. NWIS groundwater levels exist as a layer; groundwater conservation district rules and TCEQ water rights do not exist anywhere in the stack.

Fiber. Dropped (FCC broadband source WAF-blocked, per `75m`).

ETJ and jurisdiction boundaries. Named BACKLOG with no adapter in `75m`; the screen can cite the code that applies but cannot yet draw the boundary that decides which code applies.

The spike does not ingest any of these. It measures whether their absence kills willingness to pay.

## Go/no-go recommendation frame

The recommendation the spike must produce is binary: GO means siting becomes a named Phase 4 SKU (a metered constraint pre-screen, Layer 2 paid, MCP-first with the map as the visual surface) and earns a decision record and a place in `14_pricing_framework.md`. NO-GO means the memo and demo file as research, the siting demand signal stays attached to the place graph strategy where it already lives, and no siting workstream opens.

GO requires all of the following:

1. The demo composes end-to-end from existing verified capabilities with at most the SSURGO connectivity fix as new engineering, and every section of the output carries source, confidence, and timestamp (commitment 1).
2. Cotality production keys land, so the screen is not parcel-blind (already the tracker's named gate for this demo).
3. A named buyer-side counterpart engages with the artifact and validates paying per screen. Candidate channels already in the doc set: the TX CRG data-center buyer contact stream (`77a`) and the EdgeConneX partnership-framed relationship (`30_smartcity_os.md`). New outreach is bizops, not planner scope.
4. Any jurisdiction the demo touches beyond current coverage onboards inside commitment 3's cost bound, or the demo stays inside covered jurisdictions.
5. The siting layers register into the shared LAYER_REGISTRY without forking, consistent with the master map decision.

NO-GO (or park) if any of the following holds:

1. Buyer feedback says the screen is worthless without power data. That makes siting a new data vertical, which trips the focus queue rule unless something is explicitly queued or killed to fund it, and that is a separate operator decision, not a spike output.
2. Cotality production does not land, leaving the screen unable to name parcels or owners.
3. The composition cannot honestly satisfy commitment 1 (for example, encumbrance sections that would have to bluff coverage we do not have).
4. The demo's cost or scope grows past "one county, existing capabilities, one composition."

## Named reversal criteria (for whichever call is made)

If GO: reverse to park if the first metered siting screens produce zero paid repeat usage from the validating counterpart; if the Cotality terms make per-screen unit economics negative at the settled take rate in `14_pricing_framework.md`; or if maintaining the screen forces a power-data ingest anyway, at which point the vertical question returns to the operator with real evidence.

If NO-GO: reverse to reopen if a power-data source becomes available on substrate-compatible terms (public or licensed, with provenance we can carry); if a named buyer arrives asking for the power-blind pre-screen unprompted, which would falsify the willingness-to-pay objection; or if the Reeves skeleton's O&G layer families land and make the surface-plus-minerals composite materially cheaper to assemble than it is today.

## Structural commitment check (summary)

Commitment 1: the screen sells cited reasoning over composed layers, never raw geometry or a data dump; this is the same posture `75m` fixes for the map. Commitment 2: confidence ships as asserted baseline with provenance and verification state; no earned calibration exists for siting outcomes and none is claimed. Commitment 3: binds any new jurisdiction the demo touches. Commitment 4: the screen is MCP-first by construction; the map render is the second surface. Tenant sovereignty: the demo composes public and platform-internal signal only; no tenant-private data is involved. A formal premortem-check run is owed before any GO decision record is filed, per standing instruction; this memo notes that obligation rather than discharging it.

## Sources

- `_inbox/2026-07-04_convergence-program_STATUS.md` (Phase 4 queue item 7; Cotality pickup naming the "Phase 4 siting demo" gate; four-gate deploy verification, 63 tools, map tools probed; corpus healthz 21,126 atoms)
- `_decisions/2026-07-04_convergence_program_execution_model.md` (Phase 4 = monetization capture; Reeves skeleton as parallel track)
- `_decisions/2026-07-04_master_map_and_console_unification.md` (LAYER_REGISTRY verified in embryo; allocation model; O&G families and 3D sequenced with Reeves)
- `77_place_graph_strategy.md` (data-center buyer demand signal, 2026-05-27 operator conversation; mineral index open decisions PG-1/PG-3)
- `75m_map_data_visual_benchmark.md` (live-verified layer inventory; buildable-envelope and comparative-jurisdiction as proposals; SSURGO degraded; dropped sources)
- `_catalog/repo_intents.md` (branding canon; hauska-map/master map direction; slb_prototype as O&G seed)
- `_verticals/oil_gas/86_executive_summary.md` (Reeves County as the O&G start, distinct from this spike)
- `30_smartcity_os.md` (EdgeConneX second Bastrop County data-center campus, partnership framing)
- `09_post_saas_substrate_thesis.md` (buyer is the agent operator; metered reasoning)
- CLAUDE.md ground-truth recon paragraph (corpus split, encumbrance atom families ADR-020/021)
