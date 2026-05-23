---
decision_id: 2026-05-23_partnership_first_scoping
date: 2026-05-23
owner: Nick
status: active
related_canonical: [CLAUDE, 09_post_saas_substrate_thesis, 14_pricing_framework, 46_smartcity_parcel_intelligence, 51_substrate_v1_sprint, 73_partnerships, 40d_cortex_site_context_sprint, 43_cortex_qa_backlog]
related_skill: [premortem-check]
---

## Decision

Scope the **Partnership-first sourcing** commitment to **city operational
data + Hauska substrate ingest**. It does NOT govern Cortex
product-baseline data sourcing for architect-facing layers.

In plain terms:

- **In scope (partnership-first applies)**: Bastrop UDC + similar
  city code corpus ingest; permit history; plan review precedent;
  operational workflows; SmartCity OS data; the @hauska/atom-contract
  catalog atoms produced by the Hauska substrate. Cities and counties
  remain licensors with structural revenue share. Bastrop continues
  as the template. The substrate sprint motivation (MGO displacement,
  city-as-partner) is unchanged.
- **Out of scope (partnership-first does not apply)**: Cortex product
  consumption of national public-records aggregators (e.g. Regrid,
  ATTOM, CoreLogic for parcels + zoning baseline coverage);
  consumption of federal national APIs (FEMA NFHL, USGS 3DEP, USDA
  SSURGO, USFWS NWI, FCC BDC); public-records data already in the
  public domain. Cortex uses best-available data from any source,
  with provenance per atom.

## Context

The 2026-05-23 cc-agent-C QA-22 mitigation recon surfaced an
architecture limit on the per-county GIS adapter pattern: Grand
County GIS firewalls Cloud Run egress; EPA EJScreen is
decommissioned; FCC broadbandmap is gated by Akamai WAF. Resolving
each per-county / per-federal adapter via direct partnership + IP
whitelist outreach was operationally infeasible at the ~3,143-US-
county scale Cortex needs to be useful as an architect tool.

The 2026-05-23 premortem on "adopt Regrid as Cortex national
parcel/zoning baseline" returned **yellow on Partnership-first
(load-bearing)** — Regrid is a commercial aggregator, the pattern
Hauska is built to refuse — but aggregates PUBLIC parcel records vs
the OPERATIONAL city data Hauska's refusal was framed against.

Operator distinguished the two categories 2026-05-23 in a strategic
call:

> "we are still working with bastrop. and yes we want to get
> counties on board for the municipal software but we cant have
> that keep weighing on the decision and coming up in every
> chat... we want to lead with warm intros with some products
> not this one though... ignore the partnership rule [for the
> Cortex prop-intel architecture exercise]"

This decision settles the scoping principle so it stops blocking
Cortex product decisions on every prop-intel sourcing call.

## Structural commitment check

The scoping itself does not change the four structural commitments;
it clarifies which workstreams Partnership-first governs. The
Hauska thesis (substrate-enforced revenue share to source actors)
is unchanged. The Bastrop pioneer narrative is unchanged. The
substrate-v1 sprint motivation (MGO displacement) is unchanged. The
70-band bizops work, the 73_partnerships pipeline, the
14_pricing_framework Scenario B revenue split — all unchanged.

What changes: Cortex product-baseline data sourcing decisions are
no longer subject to a partnership-first gate. Regrid as Cortex
prop-intel baseline clears the premortem operational yellows
(dual-interface + Hauska-spine, absorbable per existing Cortex
UI-first product framing).

## Reasoning

**The aggregator pattern Hauska refuses is operational-data
absorption with no revenue share to the data's originating
counterparty.** MGO absorbs city permit workflows, plan review
processes, code interpretation — operational data cities should be
able to monetize. Hauska's refusal is structural: cities should
capture commercial value from their operational data, and the
substrate enforces that.

Public parcel records are a different commercial pattern. They are
already public-domain. Counties publish parcel maps because state
law requires it; there is no "city revenue share" to protect
because cities never monetized parcel maps in the first place.
Aggregating public records and offering AI reasoning over them is
a different commercial line than absorbing operational workflows.

The Hauska thesis is unaffected. The Hauska substrate continues to
grow partnership-first. The Cortex product can consume from any
source.

**Operational pressure**: ICC API integration is landing within a
week; that unlocks AI agents hitting MCP servers, which generates
product demand on a timeline that per-county partnership ingest
cannot match. SoftPlan + ArchiCAD connectors (operator's named
distribution channel) pull architects in nationally. Cortex needs
national baseline coverage to be useful in those channels. Per-
county partnership ingest stays the high-fidelity enrichment path
for partner cities; public-records aggregation is the baseline path
for the rest.

## Reversal criteria

Revisit if a national aggregator (Regrid or alternate) turns out to
be commercially incompatible with Empressa's positioning — for
instance, if a competitive analysis shows that paid public-records
aggregation conflates Empressa with the aggregator pattern Hauska
refuses, in a way that damages the substrate value prop. Revisit if
Bastrop or another partner city raises that Cortex's national-
aggregator consumption undermines the partnership commitment they
signed up for. Revisit if Hauska SDK revenue-routing implementation
(currently designed-not-built) lands in a form that makes
substrate-enforced revenue share to source counterparties practical
for parcel-records counterparties too — at which point
public-records sourcing could rejoin the partnership-first envelope
with a different commercial structure.

## Dependencies

Three small canonical doc edits + one skill edit + this decision
record settle the scoping:

- `CLAUDE.md` commitment #2: add scope clarifier referencing this
  decision record.
- `09_post_saas_substrate_thesis.md`: add scope clarifier paragraph
  in the Partnership-first section.
- `.claude/skills/premortem-check/SKILL.md` commitment #2: update
  description to include the scope clarifier so the skill stops
  returning load-bearing yellow on Cortex product-baseline
  sourcing decisions.

No edits to 51_substrate_v1_sprint.md (substrate motivation
unchanged), 73_partnerships.md (partnership pipeline unchanged),
14_pricing_framework.md (revenue share to cities unchanged),
46_smartcity_parcel_intelligence.md (SmartCity OS Parcel
Intelligence remains a city-staff-facing partnership-first product),
18_stakeholder_graph.md (Sylvia + partner relationships unchanged),
or 11_roadmap.md.

The Cortex prop-intel architecture follow-on is a separate
dispatch: evaluate Regrid + ATTOM + CoreLogic; pick a baseline
parcel/zoning source; build the adapter; deprecate the per-county
GIS adapters as baseline (they survive as opportunistic enrichment
for partner cities). Fires after the scoping commit lands.

## Counterparties

Internal. No external counterparty notification required. The
Bastrop partnership commitment is unchanged. Future partner-city
relationships continue under the original partnership-first
framing. The Regrid (or alternate) vendor relationship is a
standard B2B licensing arrangement and falls outside the
partnership-first envelope.
