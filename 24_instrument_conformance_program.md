---
id: 24_instrument_conformance_program
title: The instrument conformance program — bringing the existing library up, arming the rules, and what is still owed
status: active
last_updated: 2026-08-22
applies_to: portfolio
owner: nick
related:
  - 19_the_instrument_contract
  - 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance
  - _decisions/2026-08-22_atom_layering_target_state
  - _rd_disclosure_twin/09_twin_read_contract
  - 61_enforcement_doctrine
  - 62_seat_topology
---

# The instrument conformance program

## What this is

`19_the_instrument_contract.md` defines the model. This is the work that makes it true. Four tracks: bring the existing library up, arm the twenty rules that can be made unrepresentable, build the six probes that cannot, and close the decisions only the operator can close.

Nothing here is a dispatch. Lane work compiles through `scripts/dispatch.mjs` with a plan row, and the rows below are candidates for that, not substitutes for it.

## Track 1 — Bring the existing library up

The library today is roughly 104.1 million atoms across 21 entity types in `hauska_mcp`, a second store behind Smart Files, and twelve representations of an instrument on the markets side of which six are keyed by a bare symbol string. The governing principle of this track is that **nothing here rewrites a hundred million rows.** The alias model exists precisely so that a migration does not have to.

**T1.1 Mint nodes and leave the atoms alone.** Create nodes with opaque ids for the subjects that exist today: parcels, jurisdictions, code sections and editions, actors, documents, securities, issuers. Every current natural key becomes an alias atom carrying its authority, valid time and knowledge time. Existing atoms keep their `entity_id` and a resolver maps alias to node. Zero row rewrites, and the prefix trap dies immediately because resolution becomes exact match against an alias rather than a `LIKE` against a key.

**T1.2 Stop the bleeding at write before migrating anything.** The branded id type and a refusing store boundary apply to new writes only. Both tracks currently declare this rule in a docstring and enforce it nowhere, and migrating into a pipe that still leaks means doing the migration twice.

**T1.3 Classify by type, never by row.** Provenance class, subject kind (extensional or intensional), and `chainAnchoring` are properties of the entity type for the families that exist. That is 21 decisions on the property side and a similar count in markets, not 104 million edits. Once a type declares its class, the serve layer can render class-correctly even where historical rows are thin.

**T1.4 Demote the enumerated families rather than deleting them.** Flood, rail, pipeline and special district sit at 90 to 151 percent of the parcel count because a regional claim was copied onto every parcel it touches. Write one selector atom per panel, per corridor, per district; point the existing materialised rows at it through `derivesFrom`; mark them Derivation. Roughly fifty million rows stop being false Records in one authoring pass, and they keep serving throughout. **They are not deleted.** Materialisation is required where the predicate algebra does not reach, and the flood work already measured read-time evaluation at 218 to 362 times slower.

**T1.5 Verdicts before data.** Replace the empty fact chain with `absent-verified`, `lookup-failed` or `not-applicable`, each carrying authority, scope searched, `asOf` and basis. This corrects a false statement about the world without ingesting a row, and it is already agreed as P0 with the property integration planner. Metro structural gaps are `lookup-failed`; unincorporated land with no zoning authority is `not-applicable`.

**T1.6 Lineage for splits and merges.** Parcel splits already broke history. Lineage edges are how it is recovered, and only where the split records exist.

**T1.7 Declare the unrecoverable.** Rows whose provenance was never captured cannot have it invented. They are re-derived from source or carry a declared pre-contract marker. Declared degradation is permitted; inventing a fetch record for a row that never had one would be the worst outcome of this entire program.

## Track 2 — The twenty type items

Each of these deletes a rule from the ruleset by making the violation not compile. They land inside whichever package touches them next and need no coordination beyond ownership.

| # | Item | Home |
|---|---|---|
| 2.1 | Branded `NodeId`, constructible only by `mint()` or a validating `parse()` | atom contract |
| 2.2 | Provenance class as a discriminated union with per-class required fields | atom contract |
| 2.3 | `derivesFrom` required on Derivation, absent on Record | atom contract |
| 2.4 | Absence verdicts: `absent-verified` requires a source that responded, `lookup-failed` requires the failure reference | atom contract |
| 2.5 | `contested` layer variant with `precedenceBasis` and no single-value accessor | atom contract |
| 2.6 | `basis` and manifest category bounded to closed vocabularies | atom contract |
| 2.7 | Required-at-mint fields with no defaults: `custodyOnLapse`, `chainAnchoring`, grant-or-delivery, offer manifest | atom contract |
| 2.8 | Supersession as an edge; no `supersededBy` column exists to write | atom contract |
| 2.9 | `canonical(id, knowledgeAt)`; the one-argument form does not exist | atom contract |
| 2.10 | Alias as an atom (`identity.alias`); lineage as edges with `mergedInto`, `dividedInto`, `unmerged` | atom contract |
| 2.11 | Selector predicate as a closed discriminated union (spatial containment, set membership, equality, range, composition) | atom contract |
| 2.12 | Access as two fields, discoverability and entitlement | atom contract |
| 2.13 | Entitlement result as `resolved \| unresolvable \| anonymous`, where only a missing header yields anonymous | MCP gate |
| 2.14 | Access resolver signature takes only record and entitlement; the module cannot import the request | MCP gate |
| 2.15 | Entitlement resolver has no `asOf` parameter | MCP gate |
| 2.16 | Grant atom shape, with the entitlement graph resolved under a declared system entitlement | MCP gate |
| 2.17 | Membership read signature requires `knowledgeAt` | Smart Files |
| 2.18 | No cascade on membership; schema test asserts it | Smart Files |
| 2.19 | Content function has no audience parameter; rendering is separate and downstream | every surface |
| 2.20 | Import the accessPolicy vocabulary rather than copying it; generated constraint plus a CI equality test that fails on drift | Smart Files, engine |

Ownership follows `_catalog/seat_register.json`. Atom contract and MCP gate are the substrate seat. Smart Files and the surfaces are the property seat. Markets items land with the markets seat as its own instantiation.

## Track 3 — The six probes

These cannot be typed and are the entire behavioural suite. They live in a conformance package and are run by each surface against its own store, with the result published and stamped with the fixture-set hash and the commit.

| # | Probe | Asserts |
|---|---|---|
| 3.1 | Write refusal | a malformed id is refused at the store boundary, not stored |
| 3.2 | Selector re-evaluation | two runs plus a mutation against a versioned store state produce the stated set |
| 3.3 | Derivation id stability | a rebuild reproduces the same id, so a delivered chain does not dangle |
| 3.4 | Ceiling property test | for every caller, the result is a subset of the platform result |
| 3.5 | Unauthenticated verify | verification answers without a credential against the deployed service |
| 3.6 | Export round trip | a holder can leave: export, verify offline, and resolve nothing |

Two adjacent items ride with this track. Class signed at origin, so a middle-hop re-class is detectable rather than merely forbidden. And `verifiedLevel` asserted only where a corroborating atom or an outcome exists.

**The suite must fail before it is trusted.** Each probe is run against a known violation and observed failing before any passing run is reported, per the doctrine. A probe observed only passing has not been observed working.

## Track 4 — Owed by the operator

| Item | Why only you |
|---|---|
| Ratify aliases and lineage as atoms and edges | a model change made on a reviewer's argument, not an edit |
| Owners and destinations for the four stranded `77` items, including PG-1 through PG-4 | four open decisions currently living in a superseded document |
| Minting monetisation: free, freemium, or metered per node | the model says give away the mint and charge for the join; the shape of the mint is unsettled |
| The delivery multiple | delivery is priced as a perpetual multiple; no multiple has been defended |
| Whether the conformance registry is built now or later | the buying-agent filter has nothing to query without it |

## Track 5 — Measurements owed before claims

Two things this program rests on are inferred rather than measured, and both should be closed by a seat rather than by a planner.

The property side has never been scored on the four properties. The markets seat scored markets. The claim that property is the mirror is an inference from two verification sweeps.

The provenance class of the materialised region-scale rows is an open hypothesis. If those rows currently carry their own provenance as though each were an independently sourced measurement about that parcel, the class is wrong across a very large fraction of the store and no check that counts rows can see it. Sample the body of one such table and report what the provenance says.

## Sequencing

T1.5 and T2.13 through T2.15 are the cheapest real work on the board and neither waits on anything.

T1.2 gates T1.1: stop the leak before migrating into it. T1.1 gates T1.4 and T1.6, since demotion and lineage both need node identity. T1.3 is independent and can run at any time.

Track 2 items land opportunistically and do not need a program. Track 3 does, because a suite that runs in no workflow is dormant, and the workflow is the deliverable rather than the tests.

Track 4 blocks nothing technical and blocks the external narrative, since `19` may not be quoted in the present tense on anything the armed table marks as not armed.

## Done

This program is done when the enforcement triage table in `19` shows a mechanism in place for every row that is not labelled convention, when the behavioural suite runs in a workflow and has been observed failing, when the property side has a scored four-property row of its own, and when no row of the armed table rests on a planner's inference.
