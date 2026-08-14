---
title: Spine unification handoff — what Smart Site became, and the lessons the next surfaces inherit
date: 2026-08-14
status: active-handoff
audience: the planning agent for SmartCity OS, Smart Files, the ICC demo, and plan review
purpose: Altitude briefing, not a dev spec. These four surfaces will touch Smart Site and each other; this records what the Smart Site journey proved about how a unified system over the spine actually behaves, so the next surfaces are designed WITH those lessons instead of rediscovering them. A full doc scrub follows Smart Site's launch; until then this document is the bridge.
related_canonical: [90_operations/OPS-16_texas_market_plan_of_record, 90_runbooks/AGENT_CONTRACT, _decisions/2026-08-11_texas_flush_launch_gate_amendment, _inbox/2026-08-12_L7_sparse_rail_absence_doctrine.md, _inbox/2026-08-12_L9_vintage_read_spec.md, _inbox/2026-08-12_RPT1_existing_report_surface_inventory.json, _catalog/repo_intents.md, 09_post_saas_substrate_thesis.md]
---

# Spine unification handoff

## What Smart Site actually became

Smart Site started as a property app and became the first full customer surface over the spine: a
parcel-keyed atom substrate covering Texas, measured everywhere, with honesty as the product. The
concrete shape today: sixteen registered property atom families; a 254-county by 14-rail ledger where
every cell terminates in verified data or provenanced absence; roughly 60M atoms written or remediated
in the current program at zero verify failures; paid gates enforced structurally at the atom
accessPolicy level; and a launch gate of thirteen mechanical criteria graded by a script
(`scripts/gate-grade.mjs`), not by narration. The four surfaces you are planning will consume this
substrate, feed artifacts back into it, or both. None of them should re-derive what follows.

## The spine, as learned rather than as theorized

**The parcel-node is the join key of the physical world.** Every property fact family keys to
`parcelNodeId` or explicitly declares why it does not (road-node is roadNodeId-keyed and deliberately
excluded from the parcel chain). The chain parcel-node to facts to derived envelopes to rendered
deliverables IS the edge structure. When SmartCity wants city-scale views, when plan review wants the
constraints binding one lot, when the ICC demo wants a metered citation path, they are all walking the
same chain from different entry points. Two hard-won corollaries:

1. **EntityId shapes are NOT uniform across families, by design.** owner-fact is
   `${parcelNodeId}:${taxYear}`, footprint is `${parcelNodeId}:footprint:${id}`, flood is bare
   `parcelNodeId`. Never reconstruct an identity from parts; use the value storage persists. A wrong
   reconstruction silently matches zero rows and looks like an honest absence.
2. **County-level determinations are a legitimate node class.** Robertson county has 24,016 parcels
   with no usable keys; its special-district coverage is held by ONE `48395:_county_coverage` marker
   atom rather than fabricated per-parcel facts. Scorers treat it as a county determination; parcel
   consumers ignore it. Any surface that aggregates (SmartCity dashboards especially) must know this
   marker convention exists.

## Honesty is the architecture, not a feature

This is the deepest lesson and it generalizes to every surface you are planning:

- **Absence is typed and provenanced.** The seven-status taxonomy (LAYER-FOUND, NO-ZONING-AUTHORITY,
  NO-EUCLIDEAN-REGIME, ORDINANCE-NO-GIS, AUTH-WALLED, HOST-BROKEN, NOT-FOUND-UNKNOWN-WHY) exists
  because one undifferentiated "absent" carried at least seven meanings and a probe failure wore the
  costume of a data gap. Houston was recorded as having no zoning when it had never been probed.
  Plan review and ICC will face the identical class: "code section not found" must never conflate
  never-looked, source-down, paywalled, and genuinely-absent.
- **Only a positive determination writes an absence; an empty result re-enters the queue.** This one
  rule killed an entire defect class.
- **satisfied-absent is a first-class product state.** Seventy-six counties currently serve honest
  absences with evidence on the live ledger. A dashboard that cannot render "verified absent" will
  misrepresent the substrate.
- **Freshness is part of every response.** The ledger endpoint served a days-old view without saying
  so and nearly reported a 211-cell regression that never happened; the fix is materialize-on-write
  plus visible `computedAt`/`servedAt` stamps and a STALE pill that was PROVEN able to fire before it
  was trusted. Smart Files is an artifact store; every artifact it serves must carry provenance and a
  freshness stamp from day one, because a cache without a stamp is a liar waiting for load.
- **Vintages are declared, never mixed, and fallbacks are named.** The CAD work proved the pattern:
  a county reads ONE declared vintage; cross-vintage fallback exists only as a named, counted,
  per-county list with a visible marker on every fallback read (Tarrant 35,156 keys, Dallas 34,588).
  Plan review will hit this with code editions (the Bastrop B3-repealed-to-BDC incident is the same
  disease); ICC citations must carry edition identity for the same reason.

## Instruments over narration

Measured in this repo across months: hook-shaped controls that fail closed work one-for-one;
protocol-step controls work zero-for-three. Every surface you plan should budget for its instruments
as build items, not afterthoughts:

- Gates are scripts, not checklists (the gate harness graded the launch program 9-of-13 mechanically
  the day it was built, and its first run exposed a defect in the gate's own written instrument).
- A gating indicator is tested for its ability to fire before it is trusted (a flood verdict
  predicate silently failed every success for a night because its own safety string matched the
  writer's help text; the STALE pill was backdate-tested on purpose).
- Tests that assert against the constant the code renders from, and negative tests that cannot fail
  for the right reason, are defects. Two were found gating this program.
- Every ratio travels with its counting rule. "26 of 47" drifted for three sessions because its
  method was unstated.

## The factory model (acquisition, staging, drain)

Factory 1 lays statewide uniform layers; Factory 1.5 finds, fetches, normalizes and STAGES with
provenance (slot-free, infinitely parallel); Factory 2 builds jurisdiction depth. The weld between
acquisition and writing was broken deliberately: one bulk writer per database holds a
database-enforced lease (a rogue process died permanently the day the lease landed after writing 28M
contaminated atoms the day before), plans and payloads persist so the writer only drains, and heavy
scans serialize through an announced mutex. Smart Files ingestion and the plan-review corpus intake
are Factory 1.5 workloads and should reuse the staging pattern (`tx_zoning_district_staging`,
`tx_utility_territory_staging` are the worked examples) rather than invent parallel machinery.

## Cross-surface seams that already exist

- **Surface topology per canon:** Hauska is substrate only; Command Center is the internal operator
  console and Property Explorer/Smart Site the customer app, never collapsed; MCP-first for net-new
  surfaces. The MCP server exposes the parcel atom chain (15 parcel-keyed types) behind gates.
- **report_run is plan-review-only run state, not a result store.** The artifact-store gap Smart
  Files fills is real and inventoried (`RPT1_existing_report_surface_inventory.json`); the report
  engine scope (audience profiles, comparison mode, one model feeding DXF/IFC/PDF) is captured in the
  2026-08-12 session record. The share-link-becomes-data-room thesis stands.
- **Cross-repo declared state drifts unless pinned.** Declared CAD vintages live in ldt and engine
  with a frozen-fixture parity test between them; two parity PRs were needed within one day of the
  first flips. Any constant two surfaces both read needs a parity test or a single source, decided at
  design time.
- **Utility who-serves territories are staged** (PUCT water and sewer CCN, HIFLD electric, TWDB PWS,
  TCEQ districts) with the professional-tier product question explicitly parked for the post-gate
  consideration pass alongside your planning arc.

## Operating machinery your program should adopt on day one

The consistency problem (agents behaving differently across chats) was solved structurally, not by
better prompting: one operative law file (`90_runbooks/AGENT_CONTRACT.md`, hash-versioned), a dispatch
compiler (`scripts/dispatch.mjs`) that refuses to compile work not named in the plan of record, and a
hook that blocks hand-assembled dispatches. The plan of record itself (`OPS-16`) is a frozen baseline
with an append-only amendment log, so scope drift is a readable diff. When your program stands up its
own plan, copy this shape from the start; Smart Site adopted it four days in and spent those four days
paying for its absence.

## What NOT to plan around yet

DC-6 depth pricing is landing now (the zoning-discovery factory is mid-sweep staging ~107 cities);
the market layer stays parked; P-27 address-to-parcel is ruled first-post-gate-build and is a
prerequisite your surfaces will want (it is captured, do not re-litigate it); the Vercel-to-GCP
migration executes post-gate and SmartCity already lives on GCP, which makes it the natural
convergence point rather than a special case.
