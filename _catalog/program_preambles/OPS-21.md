# PROGRAM CONTEXT — OPS-21 serve completion

You are working a lane of OPS-21. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win.

## The one goal

Every one of the 65 parcel-record rails reaches a real state with an instrument behind it, in
production, for the six Central Texas counties. **Not "acquire everything."** Values where we
have data, honest dispositions where we do not.

Counties: `48021` Bastrop, `48055` Caldwell, `48209` Hays, `48309` McLennan, `48453` Travis,
`48491` Williamson.

## The six cell states — this is the vocabulary, use no other

| state | means | requires |
|---|---|---|
| `value` | measured | instrument, scope, measuredAt |
| `absent-verified` | something looked and it is not there | a NAMED instrument and an explicit SCOPE |
| `not-applicable` | a ruling says this does not govern here | a decision-record pointer |
| `refused` | a real value exists upstream and the source cannot say which | instrument, scope |
| `unaccounted` | nobody has looked | nothing — it is the default |
| `available-on-request` | not acquired in bulk; fetched per parcel on demand. Nobody has asked for this one | a named, REACHABLE `requestPath` |

**`available-on-request` is NOT an absence claim.** It says nothing about whether the fact
exists. A `requestPath` that is not reachable is not this state — a dead path makes the cell
`unaccounted` or `refused`, never a promise the product cannot keep. Adding a rail to this
state is a ruling, never a lane's discretion. Ruled 2026-09-10.

**`unaccounted` is legitimate at rest and fatal at publish.** Both halves are load-bearing. If
it stops being fatal it becomes cover; if it stops being legitimate the pressure moves to
fabricating values.

**Never convert `unaccounted` to `absent-verified` to clear a gate.** `absent-verified` is a
claim that something looked. Writing it where nothing looked is a lie that passes every check.
A relabelling tripwire counts unaccounted falling without a matching acquisition landing.

**Where a real limit exists and the source cannot say which, the state is `refused`, not
`not-applicable`.** Default to the weaker state. `not-applicable` on an in-city parcel claims
the land is unzoned.

## Identity — get this wrong and every cell is wrong

```
place_key      "{county_fips}:{prop_id}"              RAW. This is what cells are keyed on.
parcelNodeId   "{county_fips}:{normalizeForJoin(prop_id)}"   NORMALIZED (engine side).
entity_id      "{parcelNodeId}:{suffix}"              atoms only.
```

`normalizeForJoin` strips leading zeros on all-digit tokens. **Write cells on the RAW
`place_key`. Do not normalize.** The divergence between the two is a known, unmeasured
conflation risk; do not widen it.

A parcel is not an account. `parcel_record`'s intended population is
`landing_parcel_jurisdiction`, not the `cad_property` account roll. N polygons can share one
`prop_id` and are folded to one atom by design.

## Stores

CORRECTED 2026-09-10. This block previously read "Two databases on one Neon host" and
bucketed every table under a single `neondb`. That was wrong in the way that matters most,
because `neondb` is a shared default database NAME, not one store. Two lanes hit it
independently: OPS-21 S1 (`_inbox/2026-09-10_ops21-s1_close.json`) and OPS-21 S2
(`_inbox/2026-09-11_ops21-s2_cp1.json`), each re-verifying live. It also contradicted the
FACTORY canon line that gives `hauska-factory` its own Neon store.

```
HOST ep-lucky-truth-apodo8hr          (PRODUCTION_NEONDB_URL, and atoms)
  db hauska_mcp    atoms
  db neondb        txgio_parcel, cad_property, landing_parcel_jurisdiction

HOST ep-round-base-au0jofwp           (FACTORY_DATABASE_URL)
  db neondb        parcel_record, parcel_record_cell, parcel_record_companion_row

  db neondb        parcel_gate_verdict   (RESOLVED 2026-09-11 by the OPS-21 S4 lane:
                   it lives on the FACTORY host, same host as parcel_record itself)

NOT ESTABLISHED -- do not assume either host
                   tx_* layers, permit_record
```

The three NOT ESTABLISHED entries were carried in the old single bucket and their host was
never actually resolved by either lane. They are listed unresolved on purpose rather than
being silently assigned to the more likely host. If your lane needs one, resolve it live and
report which host answered, so this block gains a line instead of a guess.

**Two separate Neon HOSTS. A SQL join across them cannot be written at all**, and that
includes the join a reader of the old block would most naturally reach for, between
`parcel_record_cell` and `landing_parcel_jurisdiction`, which are on different hosts. The
same-name `neondb` on each host is the trap: a connection string that looks right, a
database name that looks right, and a query against the wrong host returns a FALSE ABSENCE,
not an error. Declare which HOST and which database you opened, not just the database.

## Grading is not serving

`publish-gate-sched` writes verdicts to `parcel_gate_verdict`. `parcelRecordAllowlist.ts`
(LDT) requires BOTH code-owned slate membership AND a `pass` verdict before a rail serves from
the record, and the slate is **never** auto-derived from a passing verdict. Do not conflate
the two controls.

**CORRECTION 2026-09-10, found by the D5 lane, not by the planner.** An earlier version of
this preamble said "widening what is graded changes nothing a customer sees." That is true of
the LDT serve-side allowlist and **FALSE for hauska-factory's own publish gate**:
`publish-readiness-gate.mjs:359` defaults `requiredRails` to `DEFAULT_SCHED_RAIL_KEYS`, and
`bastrop-publish.mjs:407` calls `requirePreBakeReadiness` with no third argument, so it takes
that default. Widening that constant literally would block every publish for every county.

**The general lesson, which is this program's whole subject:** one constant, two controls,
and the planner read one of them. Before you change any shared constant, enumerate its
consumers — `git grep` the symbol across the repo — and check that your mission's stated
blast radius matches what you find. If it does not, stop and report rather than proceeding on
the mission's word. A grading denominator and a policy floor can be the same identifier.

## Jurisdiction

`landing_parcel_jurisdiction.disposition` is three values: `unincorporated`, `in-city`,
`unresolved`. **ETJ is not one of them** — `etjStatus` is a separate rail.

`UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS` already writes `not-applicable` on 18 rails at row
creation for unincorporated parcels. **Do not touch those cells.** Most zoning-envelope work
is in-city only, which is a much smaller population than the county count suggests.

The six counties hold 69 cities; 23 carry a zoning layer endpoint. Two binding methods are in
play (`covers-v1`, `intersection-v1`) and must never be averaged across versions.

## The defect class this program exists to close

**Vacuous write paths.** Dormant means no trigger. Starved means a trigger and correct logic
with an input never supplied. **Vacuous means it runs perfectly, every test passes, and it
cannot succeed on any branch.** Nothing in this fleet detects the third.

The instance: `computeTier1Envelope` (LDT `nodeFacetBakeTier1.ts:92`) has two return branches
and both are `status:"declined"`. Six weeks of "setbacks keep coming up short" is that one
function. Before reporting a rail blocked on data, read its write path and check whether a
value is reachable at all.

## Hard prohibitions

- **Bastrop MyGov is off limits.** `smartcity-os` `tenant_id=2` carries 658 active permits and
  full inspection, violation and work-order data. It is a city customer's internal feed.
  Tenant sovereignty and NO PRIVILEGED DATA both forbid it populating a public parcel rail.
  The join will look like free coverage. It is not.
- **Do not hand-author a rail list.** The closed set is
  `src/lib/parcel-record-engine/rail-keys.js`, 65 rails, derived not hand-authored. A
  hand-maintained denominator is the defect class this program exists to close.
- **Do not lift `SETBACK_APPLY_HELD`** or route through the setback atom writer. Out of scope
  by operator decision; cells are written from the ruled table.
- **Stay in your own repository.** Read across repos freely; write only where your lane says.

## Completion is a predicate, not a close file

Your lane's row in OPS-21 carries a completion predicate that is a query, not a paragraph.
`node scripts/plan-progress.mjs --sql` in doc_repo prints them. **A lane is done when its
predicate says so.** Reporting done against any other instrument is the failure this program
was opened to fix — the publish gate graded 17 of 65 rails, so an agent could honestly pass a
question nobody asked.

State your snapshot: repository, branch, commit. Verify by violation before reporting any
check as working.
