---
id: 2026-09-14_smartsite_brief_gate_waits_for_p163
title: The Smart Site brief gate waits for P-163; it is implemented through accessPolicy on the atom, never hand-built at the surface
date: 2026-09-14
status: active
owner: nick
kind: decision
related:
  - 90_operations/OPS-16_texas_market_plan_of_record
  - 90_operations/OPS-23_surface_completion_program
  - _inbox/2026-09-14_auth-gate_close.json
  - _queue/cards/smartsite-auth-gate/card.json
  - _decisions/2026-09-11_ledger_as_serving_path_seven_steps
---

# Decision: the brief gate waits for P-163

## Decision

The Smart Site brief's currently-public field set **stays as it is** until OPS-23 P-163 lands.
When it does, the gate is implemented **through `accessPolicy` on the atom**, at the policy
layer, and never as a hand-built check at the serving surface.

Ruled by Nick 2026-09-14 on the AUTH-GATE (P-199) close.

## Context

An incognito session at `smartsite.cloud` reads the entire property brief for 1006 HILL ST,
BASTROP (APN 34841) with no authentication: zoning, setbacks, buildable, special district,
pipeline, well, footprint, boundary, city limits, who-serves, school district, utility
service, overlay districts, agValuation, maxImperviousCover.

P-199 was scoped as a diagnosis with conditional fix authority and returned a cause that was
sharper than any of the three hypotheses it was given.

**There is no atom in the serving path at all.** The chain is legacy-design-tools'
ServeCutover loaders to hauska-engine `GET /property-nodes/:id/record` to the Factory's
**pre-atom** `parcel_record` store. `accessPolicy` is real code in that service and is never
consulted on this path, because there is nothing to consult it against. Verified at source,
hauska-engine `45ba9d2`, `services/retrieval-api/src/parcel-record-reader.ts`:

> `/** Candidate field name for a future atom pointer on a cell (P-163 has not landed; no live cell carries one yet). */`

And confirmed live: the probe shows no atom attached to any served rail for the test parcel.

**The one gate that works is a bespoke exception, not a general mechanism someone forgot to
extend.** `grantsOwnerCoGatedFields()` covers exactly owner name and four CAD dollar fields,
per two dated 2026-09-05 rulings, gated on Studio/Team tier or an active Property Unlock,
entirely independent of `accessPolicy` and wired to nothing else. Everything else is open
because **open is the default when no policy is consulted.**

Two causes were eliminated with direct evidence. A p185 PromoteKit regression: a live
incognito A/B on the real facets endpoint with and without `?via=empressa` returned
byte-identical bodies, and a source read of both p185 diffs confirmed the param only ever
reaches a Stripe checkout call. An intentional wide tier: no ruling exists either way — the
two gated fields carry dated rulings, the open fields carry none. **This was never decided,
it was inherited.**

## Reasoning

**The current serving path cannot be gated by `accessPolicy` by construction.** Not because
the policy is wrong, but because there is no atom for a policy to attach to. That makes this
question downstream of the ledger program rather than a surface defect, which nobody had
connected before P-199 ran.

**Hand-building a second gate was rejected.** It would work today and it would buy roughly a
month. It would also add a second bespoke exception to a path OPS-23 is actively rebuilding,
and both exceptions would need retiring when P-163 lands. The repo's own doctrine says
protection living downstream of the policy only covers the consumers that implement it: a
surface gate would leave every other consumer serving the same body, the MCP catalog tools
included, since returning the body whole is their job by design.

**Ruling the tier permanently wide was also rejected,** as premature. Whether zoning and
setbacks — the thing we manufacture and the thing nobody else sells — belong in the free hook
or the paid product is a pricing call, and it has not been made. Deferring is not the same as
deciding, and this decision does not make it.

**The proportion is stated rather than assumed: paid-tier integrity, not a privacy breach.**
Everything currently open is public GIS and land-use data. The two genuinely sensitive fields,
owner identity and the CAD dollar figures, ARE correctly gated and that was live-confirmed.
Texas property records are public, and the brief already serves owner free from `cad_property`
on other paths.

## Consequences

**P-163 acquires a named downstream consumer.** When cells carry atom pointers, the brief gate
becomes implementable at the policy layer. Whoever works P-163 should know this decision is
waiting on it.

The exposure window is the interval until P-163 lands. That window is accepted deliberately on
the proportion above, not overlooked.

`grantsOwnerCoGatedFields()` remains in place and is not extended.

## Reversal criteria

Reverse and gate immediately, by whatever means available including a hand-built check, if any
of the following becomes true:

1. A field appears on the open list that is **not** public GIS or land-use data — the
   proportion this decision rests on stops holding the moment that happens.
2. A commercial or customer reason makes the open field set urgent before P-163 lands.
3. P-163 slips far enough that the accepted exposure window is no longer acceptable to the
   operator.

Revisit separately, as a pricing question rather than a repair, if the answer to "should
zoning and setbacks be the free hook or the paid product" is settled in either direction.

## Status

Active. P-199 closes on this ruling. The queue card
`_queue/cards/smartsite-auth-gate/card.json` is blocked on P-163 rather than open.
