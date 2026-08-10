---
id: 2026-08-10_address_to_parcel_resolution_scope
title: Address-to-parcel resolution — scope (promoted to current track 2026-08-10)
date: 2026-08-10
status: scoped — awaiting slot; NOT yet dispatched
owner: planner
memory_graded: pending
related:
  [
    _decisions/2026-08-10_market_layer_thesis_parked,
    90_operations/OPS-13_store_topology,
    _sessions/2026-08-10_five_rails_and_write_throughput_claude_code,
  ]
---

# Address-to-parcel resolution

Operator promoted this to current-track work 2026-08-10. It is a prerequisite for the parked market-layer thesis, but it is NOT parked with it — **it is already blocking things we ship today.**

## Why it is current-track, not future work

Every one of these is the same defect in a different costume, and all of them have already cost us:

- **The situs front-role arc** (2026-07-29): TxGIO situs is a FULL address; the comma tail survived normalization, so the first county restamp silently fell back to the heuristic on ALL parcels. Required a 3,156-parcel restamp and a 3,605-parcel re-promote to correct.
- **CAD `prop_id` normalization**: zero-padded CAD tokens vs TxGIO prop_ids address the same account. `normalizeForJoin` exists precisely because of this.
- **CROSSWALK_HOLD counties** (8 of them, incl. Travis 48453) and **LANDUSE_JOIN_HOLD** (Hays 48209, Williamson 48491): counties where the prop_id join is known-unsafe and whole rails emit `join-hold` absences instead of facts.
- **PE search today** resolves an address to a COORDINATE (Photon geocoder, `api/pe-geocode.ts`) and then finds the parcel by point-in-polygon on the map. That works for a human clicking a map. It does not work for a list, an API caller, or an agent.

So the capability gap is not hypothetical: **we cannot currently answer "give me the parcel for this address" as a service.** We can only answer it interactively, one click at a time.

## What we already hold (verified live 2026-08-10)

The data is there. Only the resolver is missing.

| Store | Rows | With situs address | Counties |
|---|---:|---:|---:|
| `txgio_parcel` (deployment) | 15,479,206 | **15,370,111 (99.3%)** | **196** |
| `cad_property` (deployment) | 4,599,477 | 4,550,294 (98.9%) | 15 |

`txgio_parcel` carries `situs_address`, `situs_city`, `situs_state`, `situs_zip` as first-class columns at **99.3% coverage statewide**. This is not an acquisition problem. It is a normalization-and-index problem over data we already own.

## The shape of the work

1. **A normalization contract.** One canonical form for a Texas situs address, applied identically at write time and at query time. The 2026-07-29 failure was exactly a normalization asymmetry — the stored form and the query form disagreed on a comma. Must handle: full-address vs street-only forms, unit/suite suffixes, directionals (N/North), abbreviations (ST/STREET), and the zip+4 tail.
2. **A resolver with an HONEST verdict, not a best guess.** Address matching is inherently fuzzy and a wrong parcel is worse than no parcel — it would attach a buildable envelope to the wrong piece of land. Verdicts should be explicit: `exact`, `ambiguous` (N candidates, return them), `not-found`, `out-of-coverage` (county not loaded). Never silently pick the nearest.
3. **An index that serves it.** Today's lesson applies directly: a normalized-address index must be built for the QUERY SHAPE that will hit it. Single-address lookup and 500-address batch lookup behave completely differently on a 15M-row table — see the sweep verify finding (a 500-value `= ANY` seq-scanned 10.7M rows while single-value equality used the index in 3 ms).
4. **A reverse direction too.** Parcel to canonical address, for exports and briefs.

## What it unlocks immediately (before any market source exists)

- **MCP/API address lookup** — agents can ask by address, which is how humans and LLMs actually refer to property.
- **Batch/paste-a-list** — the market-layer test path needs no MLS license if a user can paste addresses.
- **CAD join repair** — a second, independent join key for the CROSSWALK_HOLD and LANDUSE_JOIN_HOLD counties, which currently emit honest absences for whole rails. Address may resolve what prop_id cannot.
- **Brief and export quality** — canonical addresses instead of raw situs strings.

## Design cautions, learned the hard way

- **A wrong match is worse than no match.** This attaches legal and physical facts to a piece of land. Fail closed and return candidates.
- **Do not build a geocoder.** We are not resolving address-to-coordinate; Photon already does that. We are resolving address-to-`county:prop_id` against parcels we own. Different problem, and the coordinate path stays as it is.
- **Normalize once, at both ends.** The 2026-07-29 defect was a stored form and a query form disagreeing. Whatever function normalizes at write must be the identical function at read, and a test must pin that.
- **Measure the batch shape.** 500 addresses at once is the shape the market layer needs, and it is exactly the shape that seq-scanned in the sweep. Benchmark it against a realistic row count, never an empty table.

## Status

**Scoped, not dispatched.** Slot-safe (read-only against `txgio_parcel` for the analysis phase), so it does not contend with the atoms bulk-writer slot the sweep holds. Dispatch when a lane is free.
