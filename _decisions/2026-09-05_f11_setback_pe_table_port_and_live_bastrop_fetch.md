---
decision_id: 2026-09-05_f11_setback_pe_table_port_and_live_bastrop_fetch
date: 2026-09-05
owner: operator
status: active
supersedes: 2026-09-05_f11_setback_bastrop_elgin_atom_reuse
related_canonical:
  - 90_operations/OPS-19b_ctx_pipeline_wrapup_sprint
  - _inbox/2026-09-05_ctx-wrapup-factory_f11-setback-writer_scoping
  - _inbox/2026-09-05_smart-site-architecture-diagram_gaps
---

## Decision

F-11 (real setback data reaching Property Explorer customers) ships as: port
Elgin's and San Antonio's existing codified tables into Property Explorer's
own `codified-setback-from-zoning.ts` table map (same pattern already proven
for Austin/Pflugerville, no new infrastructure); separately, build a live
per-parcel ArcGIS fetch for Bastrop inside Property Explorer's own runtime,
mirroring hauska-engine's existing `bastrop-per-parcel-record.ts` logic.
Dispatched to a newly stood-up hauska-map lane (`cente-b9`).

## Context

This decision replaces `2026-09-05_f11_setback_bastrop_elgin_atom_reuse.md`
(same day), which was dispatched to Engine and Factory before any code was
written, then stood down once an adversarial check — run precisely because
the operator flagged a pattern of premature "done" claims earlier the same
session — found the prior decision's premise wrong on two independent counts:

1. The intermediate plan considered between the two decisions ("wire
   Property Explorer to legacy-design-tools' `/local/setbacks/:jurisdiction`
   endpoint") was itself wrong: that endpoint's own source comments describe
   it as a thin debug shim for an internal design-tools tab, calling the
   plain ungated table resolver with none of Bastrop's per-parcel gating.
   Wiring a customer app to it risked serving repealed or unconfirmed
   ordinance rows as real values — verified by direct read of
   `legacy-design-tools/artifacts/api-server/src/routes/localSetbacks.ts`.
2. Property Explorer already has its own separate, correct, currently-live
   mechanism (`apps/property-explorer/api/_lib/codified-setback-from-zoning.ts`,
   called from `atom-chain-to-facets.ts`) serving real data for Austin and
   Pflugerville today, and correctly declining Bastrop rather than fabricate
   a value. Neither the original atom-emission plan nor the endpoint-wiring
   plan accounted for this — both would have built new infrastructure to
   duplicate work that already exists and works.

## Structural commitment check

Confidence is earned, not asserted (commitment 2) and the fail-closed
principle in ENFORCEMENT.md both apply directly: Property Explorer's
existing hard-decline on Bastrop is the CORRECT behavior, not a gap to route
around. Any plan that would have caused Bastrop parcels to silently receive
a wrong or stale chart value instead of an honest decline would have been a
regression dressed as a fix. This decision preserves that fail-closed
behavior and replaces it with real per-parcel data only once the live fetch
actually exists.

## Reasoning

Two independent adversarial passes (one on the architecture diagram, one
specifically on the endpoint-wiring plan) surfaced this before any dispatch
reached real code. The corrected plan is cheaper than either prior version:
Elgin/San Antonio require no new service, no new auth, no cross-repo
integration — copying two JSON files into an existing, already-proven
table map in the same repo. Bastrop remains genuinely hard under every
version of this plan considered tonight (atoms, endpoint-wiring, or this
one) — it has never had a live per-parcel resolution path inside Property
Explorer's own runtime, and building one is real, necessary engineering
regardless of which macro-approach was chosen.

## Reversal criteria

If the new hauska-map lane finds the JSON shape mismatch between Engine's
`SetbackDistrict` type (carries height/coverage/impervious/citation fields)
and PE's narrower `AdapterDistrict` type is not a safe drop, or that a live
ArcGIS call cannot fit PE's serverless request-timeout budget, stop and
re-scope rather than forcing a degraded version through silently.

## Dependencies

Depends on nothing else in this sprint. Two work items dispatched to
`cente-b9` (new hauska-map lane): the Elgin/San Antonio table port (cheap,
independent) and the Bastrop live-fetch build (real design work, may need
coordination with Engine lane `cente-67`, who already investigated the
source logic tonight and is standing by).

## Counterparties

Internal: hauska-map lane (`cente-b9`, implements), Engine lane (`cente-67`,
consults on the live Bastrop logic), operator (ruling, confirmed Bastrop/
Elgin/Austin/Pflugerville/San Antonio as relevant launch-adjacent geography).
