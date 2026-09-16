---
id: 2026-09-16_texas_scaleup_sequence_and_four_rulings
title: Texas scale-up sequence (six counties complete, then Burnet, then Bell and Milam together), plus four rulings
date: 2026-09-16
status: active
kind: decision
owner: nick
decided_by: operator
plan_row: OPS-24 (P-186 to P-198, P-201, P-204, P-210); OPS-16 P-176, P-233
supersedes: the OPS-24 order in section 3 of its rev 2, the county pick in A-146 ("Bell and Milam first"), and the blanket Cotality extinguish carried in canon since 2026-07-13
related: [_inbox/2026-09-16_texas_scaleup_program_scope, 90_operations/OPS-24_county_to_serving_program, _inbox/2026-09-14_HANDOFF_farm_model_and_burnet_prototype, _research/2026-09-12_cotality_reengagement_division_cogs_and_probe]
---

# Texas scale-up: the sequence and four rulings

## The decisions

Operator, 2026-09-16, in the integration session.

**1. The sequence.**

1. **Complete the six onboarded counties first** (Bastrop, Caldwell, Hays, McLennan, Travis,
   Williamson). The Hays catch-up, the setback table reconciliation and the road-node work are
   done and verified before Burnet runs.
2. **Burnet with its cities is the first county through the farm.** The farm is built and refined
   during that run.
3. **Bell and Milam go through the farm together**, in parallel, and both merge into the ledger.
4. **Then the rest of Texas.**

The operator's words on purpose: "these next three counties are all about improvement because
we're trying to now refine our system so we can actually scale." The runs are judged on whether
the system gets better, not only on whether each county lands.

**2. "Covered" means what actually serves the customer.** This settles P-210. The serving path is
canonical. The search index and the ledger are inputs to that answer, not rival definitions of
it: "they don't care about anything else."

**3. Agricultural valuation is Texas-wide.** `agValuation` is not a Williamson-and-Travis rail.
The factory's not-applicable sweep of the other four counties records "does not apply" where the
truth is "not acquired", and that is a defect.

**4. Cotality is part of the farm setup.** "Cotality was dead, then they got their stuff
together, so it was supposed to be part of the farm setup." The three REST keys remain dead and
are never rotated. The re-engaged vendor is a planned acquisition stage in the farm.

**5. The Hays symptom is a road-node and data-coverage problem, not a map problem.** The map
renders where it can. The work is in the data behind specific areas, and road-node work is on
the list.

## Why this order is right

**Complete before scale, because the six are the control.** OPS-24 already treats the six as the
control group for any new county. A control group carrying undetected defects certifies them in
every county that follows. Measured 2026-09-16, the six are not a clean control:

- 219,472 parcels across the six carry setback cells written `absent-verified` ("checked, none
  required") where our table simply has no row:
  - 125,212 where the district is missing from its city's table.
  - 94,260 in 54 cities with no table at all.
- Verified envelope polygons exist only in the three cities the engine's registry holds (Bastrop,
  Elgin, Lockhart).
- `roads`, `parcelGeometry` and `edgeSignal` are in no county's ledger.

A farm built on that pipeline would copy all three into Burnet.

**Burnet alone, then two in parallel, because merge capacity is the real limit.** The farm
handoff named it: parallel farms are bounded by how fast fixes can be absorbed upstream, not by
how many agents can run. One county first measures that bound. Two in parallel then tests the
merge gate on the case it exists for.

**Coverage as the serving path, because every other definition answered a question no customer
asks.** P-205's lane showed the search index is broader than the ledger, and the ledger narrower
than what serves. A county a customer can get an answer for is covered; one they cannot is not.

## What this does not decide

It does not pick the farm's storage topology (county-scoped writes into the shared stores, or
isolated farm stores). The program scope carries a recommendation and the question.

It does not set a completeness bar for cities with no published ordinance. The scope proposes a
declared-unacquirable decision per city rather than letting one city block Phase 0.

It does not authorise any Cotality value reaching a customer. That still waits on the commercial
agreement's retention, redisplay and billing-unit terms.

It sets no dates.

## Reversal criteria

**Revisit the six-first order** if Phase 0 stalls on a class of work that Burnet itself would
resolve faster, with evidence. For example: a road-node fix that can only be validated on a
county with authoritative county roadway data. The farm machinery (manifest, pre-bake runner,
completeness check, stage meter) is not held by this order and may be built alongside Phase 0.

**Revisit parallel Bell and Milam** if Burnet's run shows the upstream fix rate exceeds what the
integration seat can absorb. That is the documented failure mode of the farm model.

**Revisit ruling 2** only if a customer-facing surface is found that the serving path does not
describe.

## Addendum, same day: four more directions (A-177)

1. **The road-node pass waits.** "Customers don't care about road nodes right now; that is more
   for internal future plans. An actual road node pass can come after everything else,
   including the farm and the additional three counties, so long as it's not blocking anything
   else." The full pass (TIGER cross-check, a street-name dictionary, classification rules, the
   `roads` and `edgeSignal` ledger rails) moves after Phase 2. Any road issue that blocks
   envelope or footprint rendering stays in Phase 0.
2. **The shortest path to an "ok" envelope comes first** (P-249). A stale or unverified
   "no-buildable-area" atom stops suppressing the live polygon. That is already what the
   2026-09-11 "envelope drawn, figure refused" ruling requires.
3. **Footprints render on the site plan and the other studies** (P-248). The 2026-09-15 request
   was never routed.
4. **The lease self-grant rule is adopted.** It had been recorded on a branch as the operator's
   ruling. "I didn't actually make that call, but I don't mind it." Corrected and landed (A-176).

Correction to ruling 5 above: the Hays symptom is stale envelope atoms overriding the ledger,
not the road data itself. Road data explains only the atoms that failed verification.
