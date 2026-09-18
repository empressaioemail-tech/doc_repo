---
id: 2026-09-18_p348_two_open_cells_read
title: P-348, the two one-parcel ledger cells, named and read
date: 2026-09-18
last_updated: 2026-09-18 (12:45Z)
status: read complete; fix carded as P-352 (pending the operator's go on the commit batch)
kind: seat record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-348, P-352]
snapshot: factory store (hauska-prod-497015 FACTORY_DATABASE_URL_RO, database neondb) read 2026-09-18 12:23:03Z to 12:38:26Z; atoms store (ATOMS_DATABASE_URL, database hauska_mcp) read 12:33:54Z; hauska-factory origin/main 85d63e8 (#175); gate verdicts from hourly run 36d2277d (evaluated 12:02Z to 12:27Z); doc_repo main e887a8fb
related:
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md (P-348 in section 3b)
  - _inbox/2026-09-17_p266-p268-factory-open-rails_close.json (names both situsState refusals and left them OPEN)
  - _inbox/2026-09-01_parcel-gap-ledger_close.json and _inbox/2026-09-01_parcel-r1-crosswalk_store_probe.json (PRIVATE ROAD first recorded)
---

# P-348: the two one-parcel ledger cells

The ledger of record (2026-09-17 22:03Z) carried two open cells on one parcel each. Both are now
named and their causes read from the store and the writer code. Neither can be fixed from doc_repo:
both need a hauska-factory writer change. That change is carded as **P-352**. The read also found a
third cell of the same class that the ledger scores as passing.

## 1. McLennan `situsState`, refuse 1: `48309:417476`

**The cell.** `{"kind": "unaccounted"}`, `updated_at` 2026-09-01 19:18:51Z (instantiation). No writer
has ever set it.

**The parcel's own record.** `situsAddress` = `COUNTY LINE SOUTH , AXTELL, TN 76624` (source
`cad_property`, vintage 2026-09-17T19:16:38Z). `situsCity` = `AXTELL`, `situsZip` = `76624`,
unincorporated, Axtell ISD, 6.1846 acres.

**Mechanism.** The P-266 ladder (`parcel-record-fill.mjs`, `resolveSitusStateEvidence`) reads the
address state token first and treats a non-Texas token as decisive. `TN` returns `OUT_OF_STATE` and
nothing is written. The ZIP rung (76624 is in the Texas range) and the geometry rung never run. The
dispatch pinned that behaviour as falsifier 2 ("a test fails if situsState is written for a parcel
whose situs is empty or out of state"). The writer is doing what it was built to do; the county roll
carries a Tennessee state code on a Texas situs.

**Second mechanism, rejected.** The fill never reached this parcel. Rejected: the P-266 close names
this exact place_key as one of the two out-of-state refusals in the six counties, with the `TN`
token, and every other McLennan situsState cell (114,253) carries a `derived-parcel-*` source from
that fill. The `updated_at` of 2026-09-01 is what a no-write outcome leaves.

## 2. The silent twin: Hays `situsState`, `48209:88885`, scored as passing

**The cell.** `{"kind": "value", "value": "TX", "source": "derived-county-fips", "vintage":
"2026-09-13T23:43:55.984Z"}`. That source is the retired OPS-21 D1 constant
(`RETIRED_SITUS_STATE_SOURCES`), which "never looked at the parcel at all."

**The parcel's own record.** `situsAddress` = `OFF CENTER POINT, GUAD CO`, `situsCity` = `GUAD CO`
(Guadalupe County), `situsZip` absent-verified.

**Mechanism.** The ladder reads `CO` as Colorado, returns `OUT_OF_STATE`, and cannot reassert. The
upsert refuses to downgrade a non-unaccounted cell, so the retired constant stays. The value happens
to be true, since the parcel is in Texas, but nothing earned it. Hays' situsState rail therefore
passes on one cell the writer's own contract calls unearned, and the ledger instrument's
`FALSE_EARNED` list does not check situsState, so nothing reported it.

**Census, all six counties, situsState by source** (12:38:26Z): exactly one `derived-county-fips`
cell remains (this one). Every other value names the evidence that resolved it: address 280,710
(summed across the five written counties), ZIP 397,482, geometry 20,641. Those three, the retired
cell and McLennan's unaccounted cell total 698,835, which is the six-county population of 981,405
less Williamson's 282,570. McLennan carries 1
unaccounted and Williamson 282,570 unaccounted (Williamson's fill waits on P-335).

## 3. Williamson `buildingFootprint`, refuse 1: `48491:PRIVATE ROAD`

**The cell.** `{"kind": "unaccounted"}`, `updated_at` 2026-09-01 18:28:48Z.

**The record.** `parcel_record` row `prop_id = 'PRIVATE ROAD'`, instantiated 2026-09-02. `apn` value
`PRIVATE ROAD`, `acreageAcres` 0.0000, every CAD scalar absent-verified against its own prop_id.

**Mechanism.** The TxGIO parcel index carries road polygons whose `prop_id` is the literal label
`PRIVATE ROAD` (the 2026-09-01 crosswalk probe sampled two such rows, `geo_id` null, situs null).
Instantiation took every distinct `prop_id` as a parcel, so they collapsed into one record. It is not
a parcel, and it is the only record the footprint writer did not reach. It inflates every Williamson
denominator by one: 282,570 records against the 282,569 real nodes P-310 and P-335 count.

**Not served.** No `parcel-node` atom exists for `48491:PRIVATE ROAD` on `hauska_mcp`. The same
indexed lookup finds the known-good `48491:R000009` (active), so the absence is a real absence and
not the wrong-database or wrong-key trap.

**Class census.** Across all 981,405 records in the six counties, this is the only key outside its
county's grammar: Bastrop, Caldwell, Hays, McLennan and Travis are all numeric, and Williamson is
282,569 `R` plus digits and this one. Nothing else hides in the class today. Nothing stops the next
county from carrying one: Burnet is next through the farm.

**Second mechanism, rejected.** The footprint writer missed one real parcel. Rejected: the key is not
a parcel identifier, it has no served node, it has zero acres and no situs, and all 282,569 real
Williamson records carry a written footprint cell (the rail's unaccounted count is 1).

## 4. Fix, not rule

A ruling would leave a phantom record in the ledger permanently and keep one unearned value scored
as earned. Both are fixable, and properly, in one small factory row. Carded as **P-352**, Wave 2,
hauska-factory:

1. **A conflict outcome in the situsState ladder.** When the address token names another state but
   the parcel's own geometry sits inside a Texas county (rung 3's independent evidence), write
   `refused` with a basis that cites both readings (the token and its source field, the ZIP, and the
   geometry and county). Never write `TX` over the parcel's own contradicting record: falsifier 2
   stands. Never leave `unaccounted` where a determination was made. The one retired D1 constant
   (`48209:88885`) is the only `value` this outcome may replace. Verified by violation: the current
   writer leaves `48309:417476` unaccounted and `48209:88885` on the retired constant; the fixed
   writer writes a conflict `refused` on both, and a genuinely out-of-state token with no Texas
   geometry still writes nothing.
2. **The phantom record retired, and instantiation guarded.** `48491:PRIVATE ROAD` and its 65 cells
   are removed under a durable record naming the key. Instantiation then refuses, and records, a
   prop_id that does not resolve to one parcel geometry and to the county's CAD roll (directly or
   through its declared crosswalk). Verified by violation on a fixture carrying a `PRIVATE ROAD` row.

**The instrument half, done by the seat now under P-337's edit.** `scripts/six-county-completeness.mjs`
gains a `FALSE_EARNED` predicate for a situsState value whose source is the retired D1 constant. On
the next ledger run Hays reads `false-earned: situsState-retired-d1-constant=1` until P-352 lands.
That makes the ledger honestly one item worse, which is the correct direction.

**Order.** P-352's cell writes go after #175 is deployed and P-335 has merged, since both touch the
record fill. It sits in the Wave 2 factory merge order after P-333.
