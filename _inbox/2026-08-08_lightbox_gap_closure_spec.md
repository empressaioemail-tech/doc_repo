---
id: 2026-08-08_lightbox_gap_closure_spec
title: LightBox gap-closure spec — owner display (paywalled), attribute filter, RRC layer, MUD districts
date: 2026-08-08
status: SPEC — PARKED, NOT DISPATCHED (awaiting in-flight status from the second planning agent)
owner: nick
applies_to: [hauska-map (property-explorer), legacy-design-tools (cortex-api, cad-ingest, tile bake), hauska-engine]
related: [75j_property_explorer_destination_ledger, 76j_smartsite_launch_readiness_program, 40j_hauska_map_tile_build_pipeline, 90_operations/OPS-1_texas_source_registry, 90_operations/QUEUE_parked_work_index, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_025_og_atom_ontology, _inbox/2026-08-01_public_data_layer_expansion_candidates, _inbox/2026-08-05_T3_ingest_spec_footprints_easements, 08_tiered_access_model]
purpose: Convert the LightBox Vision competitive read into four buildable workstreams with sources, atom shapes, gates, and sequencing. Discovery-to-spec only. No dispatch until the operator reconciles against in-flight status.
---

# LightBox gap-closure spec

## Standing on

Competitive discovery session 2026-08-08 against LightBox Vision (LandVision). Three operator rulings from that session:

1. Owner names: display them, but **paywalled**. Driven by the real-estate-investor persona use case. Reverses the implicit owner-excluded product stance, but not the PII engineering guardrails (see W1).
2. Attribute filter: **build it**. This is the single largest functional gap versus LightBox and the difference between a property tool and a site-selection tool.
3. RRC: **build it**. Rationale is dataset completeness for large-land due diligence. Without it a user doing a big land deal has to leave Smart Site and go to the RRC site, which is a retention hole, not merely a missing layer.

MUD districts carry from the same session as a fourth workstream, operator-raised alongside RRC.

## Framing rule for this whole spec

LightBox sells breadth of coverage plus workflow ergonomics. It does not sell a reasoning answer. Nothing in its function list answers what you can build and why. Every item below is scoped to close a **workflow** gap without diluting the wedge, which stays constraints-and-buildability, cited and calibrated, per the destination ledger rows 2, 7 and 8. Where a LightBox feature is broker furniture rather than an answer-changing capability, it is named as out of scope rather than silently carried.

Two doc hazards that this spec explicitly corrects, because they will otherwise produce a false "we already have it" read:

- `75m_map_data_visual_benchmark.md` (last_updated 2026-06-19) marks MUD/PID and Texas RRC as LIVE. That describes the **old Chrome-extension / cortex gis-layer path**, which was Cotality-dependent, and Cotality was extinguished 2026-07-13. Neither is on the current Smart Site layer panel per `90_operations/REBRAND_UI_map_chrome_cluster.md`. Treat both as greenfield on the current product.
- `75c_property_brief_data_backlog.md` PB-304 (Texas RRC wells/pipelines) is a 2026-05-29 backlog row that predates the map-first rebuild and was never completed. It is superseded by W3 below.

---

## W1 — Owner display, paywalled

### The ruling and what it does and does not reverse

The operator's call is that owner name becomes a **paid-tier facet**. What this reverses is the product decision to omit owner from the served card. What it does **not** reverse, and must not be read as reversing:

- The **PMTiles PII guardrail**. `40j_hauska_map_tile_build_pipeline.md:54` stamps public fields only, explicitly no `owner_name` on the tile. Vector tiles are a public immutable GCS object with a year-long cache header, served from a public bucket. Anything baked into a tile is unauthenticated-public forever. Owner must never enter the tile bake. This guardrail stands unchanged.
- The **owner-match integrity gate**. `owner_match_gate_required: true` across every roster row in `_catalog/texas_roster_v1.json`, and `OPS-1:45` makes it `required_before_cad_promote` ALWAYS. Owner data is currently load-bearing as a **join-integrity check** for promoting CAD attributes onto TxGIO geometry. Surfacing owner as a product facet is additive to that role and must not weaken it.
- **Tenant sovereignty.** Owner name here is county-CAD public record, uniform-acquisition, per the no-special-data-access standing rule. It is not tenant data and never pools with tenant adjudications.

So the correct statement of the ruling: owner moves from "excluded everywhere" to "excluded from the public tile and the anonymous surface, served on the authenticated paid card."

### Serve path

Owner must be served **only** through the authenticated BFF facet path, never the tile. Concretely:

- Source of record: `cad_property.owner_name` (already ingested; Rail B per `OPS-1:23`), joined to geometry on the registry-declared `join_key`, gated by owner-match.
- Serve seam: the PE BFF facet endpoint (`/api/spine/property-atoms/{id}/facets` class), which already runs behind the entitlement check shipped with the paywall in Workstream A on 2026-08-05.
- Tile: unchanged. No `owner_name` field added. The bake CLI's public-fields-only stamp is a test-enforced invariant, not a convention.

### Atom shape and access policy

Owner is an **atom-level accessPolicy** decision, not a UI conditional. Per ADR-017 the five-value union is the paywall mechanism, and the destination ledger row 13 names accessPolicy-as-paywall as the target architecture. Owner facet gets `accessPolicy: public-paid`. Everything already-served on the free card stays `public-free`.

This matters beyond the web app: it means the owner facet is correctly gated the moment the facets are atomized onto the contract (ledger row 10, currently 20 percent), with no second paywall implementation for the MCP surface. Building it any other way creates exactly the parallel-implementation problem row 16 exists to prevent.

### Fields in scope

Minimum viable investor-useful set, all county-CAD public record:

- `ownerName`
- `ownerMailingAddress` (the absentee-owner signal: mailing address differs from situs)
- `ownerOccupancyFlag` (derived: mailing equals situs, yes/no/unknown)
- `deedDate` / `lastSaleDate` where the CAD roll carries it
- provenance chips as with every other facet: source (county CAD), vintage (tax year), confidence, citation

Explicitly **not** in scope: skip-trace, phone, email, contact enrichment, mailing-list export. Those are a different product with a different legal posture, and they are the part of LightBox that is least defensible for us.

### Honesty requirements

- Owner data inherits the same honest-absence discipline as every other facet. Counties where the CAD join is on HOLD (the eight crosswalk-HOLD counties at `OPS-1:93`, Travis chief among them at prop_id bad-rate 0.51) must render honest-absence for owner, **not** a best-guess join. A wrong owner name is a materially worse failure than a missing one.
- Vintage must be displayed. CAD rolls are annual; an owner name from a stale roll is wrong after any sale.
- The owner-match rate per county already exists as a column in the `county_facet_coverage` shape mandated by `OPS-4:51`. Owner display should read that coverage number, not assert.

### Open question for the operator

Whether owner appears on the **free** card as a locked/blurred row with an unlock affordance, or is absent entirely until entitlement resolves. The blurred-row pattern converts better and is the standard paywall play; the absent pattern is cleaner against the honest-absence discipline because a blurred row asserts existence. Recommendation: **locked row with an explicit "paid" label**, not a blur, because it is honest about what exists without leaking the value, and it distinguishes "we have this, it is paid" from "we do not have this here" — a distinction the honest-absence commitment makes load-bearing.

---

## W2 — Attribute filter and results list

### Why this is the priority item

Smart Site today has lookup, not query. `_inbox/2026-07-23_pe_lookup_reachability_finding.md` documents the Find bar as accepting `county_fips:prop_id`, street address, and deep-link, plus map-click inspect and GPS. There is no path to "every parcel in Bastrop County zoned SF-1 over one acre outside the floodway." That query is LightBox's entire reason for existing.

The data is already baked. 5.15M features across 19 counties are in the current PMTiles hash per `40j:79`, with land use joined from `cad_property` and zoning stamped across the wired cities. The gap is a **query surface over data we already hold**, which makes this unusually high leverage: no new acquisition, no new jurisdiction cost, no cost-per-jurisdiction exposure.

### Two-layer architecture, and why it is two layers

Filtering must not be attempted client-side against the tile. Tiles are viewport-clipped and zoom-generalized; a client-side filter silently returns only what happens to be rendered, which is the exact class of quietly-wrong result the fabrication-prevention work exists to kill. A user who filters and gets 40 results when the true answer is 900 has been lied to by the product.

So:

**Layer A — server-side query endpoint.** A new authenticated endpoint over the parcel store (Postgres, `txgio_parcel` joined to `cad_property` and the zoning stamp), returning a bounded result set plus a **true total count**. The true count is non-negotiable: if the result set is capped, the response says "showing 500 of 2,317," never a bare 500.

**Layer B — map render of the result set.** The returned parcel ids drive a highlight/filter expression against the existing tile source. The tile stays the renderer; the server stays the truth.

### Filter predicates, v1

Scoped to facets that are already gate-verified, because filtering on a thin facet manufactures false precision at scale:

| Predicate | Source | Coverage caveat |
|---|---|---|
| County | `txgio_parcel.fips` | complete for baked counties |
| Zoning district | zoning stamp | wired cities only; must expose "unzoned/unstamped" as a distinct value, not as absence |
| Land use (CAD roll code) | `cad_property` | per-county coverage varies 0 to 98 percent per the 2026-07-20 verified baseline |
| Acreage range | computed (shoelace-wgs84) | complete |
| FEMA flood zone | flood rail | complete where the rail serves |
| In/out floodway | flood rail | same |
| Owner-occupied vs absentee | W1 derived flag | **paid predicate**; gated with the owner facet |
| MUD district in/out | W4 | after W4 lands |
| RRC well within N ft | W3 | after W3 lands |

### The coverage-honesty gate — the hard part

This is where a filter feature can quietly destroy the trustworthiness moat. Filtering on a facet with 46.8 percent county coverage (Travis land use, per the 2026-07-20 baseline) returns a result set that **looks** authoritative and is silently missing half the county. Zero-coverage counties (Comal, Hays, Williamson land use at 0 percent in that same baseline) would return empty and read as "no matching parcels" rather than "we do not have this data here."

Non-negotiable requirement: **every filtered result set carries a per-predicate coverage disclosure.** Concretely, the response and the UI both state, per predicate and per county in scope, the honest coverage percentage and the count of parcels excluded from evaluation because the facet is absent. A filter on a zero-coverage county must return an explicit not-evaluable verdict, never an empty list.

This is the same discipline as honest-absence on the single-parcel card, extended to set operations. It is also the thing LightBox does not do, and it is worth saying out loud in the UI, because "we tell you what we don't know" is the differentiator that survives a feature-parity race.

### Results list and export

Downstream of the query and near-worthless without it, but the pair is the site-selection workflow:

- Tabular results list alongside the map, rows selectable, row-click flies to and inspects the parcel.
- CSV export of the result set, **paid**, carrying the provenance columns (source, vintage, confidence) per facet and the coverage disclosure as a header block. An export that drops provenance is an export that launders our calibrated data into someone's unattributed spreadsheet, which is a direct hit on structural commitment 1.
- Export row cap and its disclosure follow the same no-silent-truncation rule.

### Saved views

Cheap, high stickiness, and it is the LightBox feature with the best effort-to-retention ratio. A saved view captures the filter predicates, active layers, and viewport. Rides the existing account/save infrastructure from Workstream A. Recommend folding into W2 rather than tracking separately.

---

## W3 — Texas Railroad Commission layer

### Scope discipline: the layer, not the vertical

RRC exists twice in this repo and the two must not share a lane:

- **The constraint layer** (this workstream): wells, plugged/abandoned wells, and pipeline centerlines rendered on the map and evaluated against the parcel as a buildability and diligence constraint. Public-free, statewide, cheap.
- **The O&G vertical** (`80_adrs/adr_025_og_atom_ontology.md`, `_verticals/oil_gas/`): `rrc-lease` atoms, W-1/W-2/PDQ/H-10 adapters, the landman data model, production allocation. `00_current_state.md:124` is blunt that PDQ and H-10 are honest stubs that throw and that the working paginated client sits on unmerged PR #90 with a dedup bug.

W3 is the layer only. Engine PR #90 stays parked where `QUEUE_parked_work_index.md:66` put it. Collapsing these is how an O&G vertical revival eats a Smart Site sprint.

### Why the operator's rationale is the right one

The stated reason is dataset completeness for large-land due diligence: without it the user leaves Smart Site for the RRC site. That is the correct framing and it is stronger than a generic layer-add argument, because it names a **retention hole on a high-value persona** rather than a nice-to-have overlay. It also passes the answer-changing test from the 2026-08-01 candidates doc: a wellhead setback and a pipeline easement genuinely change what you can build and where.

### Data in scope, v1

| Feature | RRC source | Shape | Notes |
|---|---|---|---|
| Well surface locations | RRC public GIS / well bore data | point | status: producing, shut-in, plugged and abandoned, permitted |
| Plugged and abandoned wells | same | point | the diligence item; P&A wells carry re-entry and foundation risk |
| Pipeline centerlines | RRC pipeline data | line | commodity and operator where published |
| Well status and operator | RRC records | attribute | operator name plus P-5 number where available |

Deliberately **not** in v1: production volumes, lease boundaries, allocation, mineral ownership. Those are the vertical, they are data-blocked, and they are the part users genuinely cannot get elsewhere easily — which makes them a later paid product, not a v1 layer.

### The T3 non-conflation rule applies and must be restated in any dispatch

`_inbox/2026-08-05_T3_ingest_spec_footprints_easements.md:65` rules that RRC pipelines, PUCT CCN, and MUD boundaries are `utility-adjacent-skip` — probe and record the URL but **do not mint `utility-easement` atoms**. That rule stands. The T3 rollout even carries an invariant (`easementUtilityAdjacentSeparation`) and a defect class (`EASEMENT-UTILITY-CONFLATION`) for exactly this failure.

RRC features therefore mint as their **own atom family**, distinct from `utility-easement`. A pipeline centerline is a pipeline centerline; the easement around it is a recorded property interest that lives in deed records and which we do not have. Rendering a centerline and calling it an easement would be a fabrication of a legal encumbrance, which is the most severe class of error this product can make.

### Parcel-level evaluation

The layer alone is a see-it feature. The answer-changing version evaluates against the parcel:

- Wells **on** the parcel (point-in-polygon), with status and RRC identifier.
- Wells **within N feet** of the parcel boundary, N configurable, defaulting to a cited regulatory distance rather than an invented one.
- Pipeline centerlines crossing or adjacent to the parcel.
- Honest-absence where RRC coverage is thin, and an explicit statement that a centerline is **not** an easement determination and that recorded easements require a title search.

That last disclaimer is not legal boilerplate; it is the honest-absence commitment applied to a domain where the absent thing (the recorded easement) is exactly what the user most wants.

### Access policy

RRC records are public. Per `80_adrs/adr_017_atom_access_control.md`, RRC-sourced streams are `public-free` Layer 1, and ADR-025 already sets that policy for RRC-sourced O&G streams. Keep the layer free. The paid line sits at the report and export tier, consistent with the existing model.

---

## W4 — MUD districts

### Why MUD is stronger than a generic layer add

A MUD is a **tax and a buildability signal in one**. For a Central Texas buyer or investor, "this parcel sits in MUD number X, which adds roughly this much to your tax rate" is a first-order question that competitors answer poorly or not at all. It is statewide public record from a single source, which gives it an unusually good cost-per-jurisdiction profile: one ingest, broad closure. `61a_central_tx_coverage_program.md:86` already says exactly this — a single TX Comptroller special-district registry ingest closes it broadly.

It also feeds the constraint-density composite and pairs naturally with the utility-availability layer that the 2026-08-01 candidates doc ranked Tier 1.

### Source

TX Comptroller special-district registry, plus per-district boundary geometry where published. Prior adapter work against this source was confirmed working on the extension path (Austin metro, 27 districts) before Cotality removal; that adapter code is a **reference for the source shape only** and must be re-verified against live sources, not trusted as still-working.

Per the four-point probe rule at `OPS-1:99`: service root layer list, id field and exact casing, one polygon sample query, feature count and owner/org, with adversarial re-probe mandatory before `verified`. That rule applies here as to any other source.

### Boundary caveat, and it is a real one

Special-district boundaries are not uniformly published as clean statewide geometry the way StratMap parcels are. Some districts publish boundaries, some exist only as a registry row with a legal description. The honest posture: **serve the districts whose boundaries we can verify, and honest-absence the rest**, with the registry row surfaced as a named-but-unmapped district where that is all that exists. Do not synthesize a boundary from a legal description.

Note also the county-source hazard already on record: `90_operations/onboarding_defect_class_backlog.md:72` logs `CAD-LAYER-INDEX-UNVERIFIED`, where Caldwell's registry row pointed at layer 0 which is Municipal Utility Districts, while Parcels is layer 1. MUD layers sit adjacent to parcel layers in several county services (Guadalupe layer 4 per the 2026-08-05 easement recon), so layer-index verification is mandatory, not optional.

### Atom shape

Own atom family, `special-district` class, distinct from both `utility-easement` (per the T3 rule) and zoning. Fields: district name, district number, district type (MUD, PID, WCID, MMD, ESD), tax rate where published with its vintage, boundary geometry where verified, source citation, confidence.

Tax rate is the highest-value field and the most volatile. It must carry vintage prominently, and where a rate is unavailable, the district is served without it rather than with a stale or inferred number.

### Access policy

Recommend `public-free` for district identity (name, number, type, in/out) and `public-paid` for the assembled tax-impact read. Identity is thin public record; the assembled, dated, cited tax-impact answer is the reasoning product, and structural commitment 1 says we sell the reasoning.

---

## Sequencing

Dependency-ordered, no timeframes.

**First: W2 Layer A (server query endpoint plus true count plus coverage disclosure).** It is the largest competitive gap, it needs no new data acquisition, and it is the substrate the paid predicates in W1, W3 and W4 all plug into. Building the query surface before the new layers means each new layer arrives filterable rather than needing a retrofit.

**Second: W1 owner facet.** Small, high-value, entitlement infrastructure already shipped 2026-08-05, and it immediately gives W2 its first paid predicate (owner-occupied vs absentee), which is the investor persona's actual query.

**Third: W2 Layer B plus results list plus export plus saved views.** Completes the site-selection workflow.

**Fourth: W4 MUD.** Single-source statewide ingest, best cost-per-jurisdiction profile of the two new layers, and it plugs into the W2 filter as a predicate.

**Fifth: W3 RRC.** Larger surface (three feature classes plus parcel-level proximity evaluation), and the parcel-level evaluation benefits from the query infrastructure existing first.

### Sequencing conflict to reconcile before dispatch

`_decisions/2026-08-01_scale_before_new_layers_sequencing.md` ruled that new layers wait until scale proves the mold holds wide, and explicitly named utility-availability from municipal utility districts as deferred under that rule. W4 and W3 are new layers. Either the operator carves an explicit exception on the competitive-gap rationale, or W3 and W4 queue behind the current scale program while W1 and W2 proceed (W1 and W2 are not new layers; they are surfaces over data already held, so they do not trip that ruling).

Recommendation: **proceed with W1 and W2 now, hold W3 and W4 against the scale ruling** unless the in-flight status the operator is gathering shows the scale program at a natural seam. The competitive rationale for RRC is real but it is a completeness argument, and completeness arguments are exactly what the scale-before-layers ruling was written to resist.

---

## Explicitly out of scope

Carried from the competitive read as deliberate non-goals, so they do not creep back in as "LightBox has it":

- Demographics, traffic counts, builder-site search, Google Earth handoff, Surface/Command Editor. CRE-broker furniture, off the wedge.
- Skip-trace, contact enrichment, mailing-list export. Different product, different legal posture, and the least defensible part of the comparison set.
- Valuation. Remains the deliberate honest out-of-scope per destination ledger row 4.

## Items this spec does not resolve

- The free-card treatment of the owner row (locked label versus absent). Recommendation stated in W1; operator call.
- Whether the scale-before-new-layers ruling gets a competitive-gap exception. Recommendation stated above; operator call.
- Result-set and export row caps (the numbers, not the no-silent-truncation principle, which is fixed).
- Whether persistent parcel markup and field notes, the fifth gap from the competitive read, folds into the OPS-10 flag-a-parcel v1 build already queued at `QUEUE_parked_work_index.md:35` or gets its own scope. Recommendation: fold into OPS-10 rather than opening a parallel track.

## Status

PARKED. Not dispatched. Awaiting the operator's reconciliation against in-flight status from the second planning agent, and the two operator calls named above.
