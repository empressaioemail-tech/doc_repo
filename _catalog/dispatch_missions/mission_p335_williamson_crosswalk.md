## Mission — P-335: Williamson's record fill reaches its parcels through the county's own published crosswalk

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` only and open one PR. You do
not merge, deploy, apply or write to any store; the integration seat does those. Any doc_repo change
is handed back as a diff in your close.

### The ruling you are implementing

OPS-16 A-215 ruling 7 (`_decisions/2026-09-18_phase0_closeout_rulings.md`): **Williamson adopts
P-310's option (b), the WCAD published-identifier crosswalk.** Read P-310's close before anything
else: `_inbox/2026-09-17_p325-p310-parcel-record-join_cp2.json` and the close beside it, and PR #175's
comment carrying the counts. Do not re-derive what it measured; build on it and re-measure only what
your change moves.

### What is true today (P-310, live-verified 2026-09-17, re-derivable from `scripts/p310-*.mjs`)

- 48491 `cad_property`: 602,049 rows = 319,480 **numeric** at tax_year 2026 (values populated) +
  282,569 **R-prefixed** at tax_year 2025 (land, improvement, assessed, living area, year built, use
  code, situs city and zip, exemption codes all NULL). Landing: 282,569, all R. `txgio_parcel`:
  304,162 R + 136.
- **Live bind: 0 of 282,569.** `txgio_parcel.geo_id` and `cad_property.property_number` are NULL
  throughout, so `loadLandingAndCad` builds `cadByProp` from a bind that produces nothing, and
  `loadWilliamsonCrosswalk` can only fill keys that bind already produced. The recovery written for
  this county is unreachable by construction.
- **The bridge:** WCAD publishes `quickrefid` (the R account) beside `propertyid` (the numeric
  account) in one row of its Land dataset (`2ckt-cqwj`, staged as `tx_wcad_ag_valuation`) and again
  in its Owner dataset (`bbia-wsxs`, staged as `tx_wcad_owner`). Binds 282,136 of 282,569 (99.85%),
  1:1 with zero multiplicity either way; the two extracts agree 287,321 of 287,321; owner-name null
  control 90.43% against 5.81% for adjacent ids. 433 do not bind; the situs path covers some of
  them.
- `landing_cad_txgio_alias`, the designed crosswalk table, exists and holds ZERO rows.
- P-325 (merged, #175) makes a join miss write `unaccounted`. With no crosswalk every CAD rail comes
  out `unaccounted` for this county, which is honest and useless.

### What to build

1. **A loader for the pair**, the shape of the existing `ACCOUNT_CROSSWALK_ROWS_SQL` with WCAD's key
   pair, reachable directly from the node population (not gated behind the dead geo_id bind), under
   the file's existing ambiguity guard and corroborator. Decide where it persists (the empty
   `landing_cad_txgio_alias` is the designed home; if you use it, say so and say why; if not, say
   why not) and state the refresh rule so a stale pair cannot silently outlive a roll change.
2. **Wire it into `parcel-record-fill.mjs`** so a Williamson node resolves to its 2026 numeric roll
   row through the pair. A node the pair cannot bind falls back to the situs path where that path is
   live, and otherwise stays `unaccounted` (P-325). Never a bare-digit match.
3. **Make the dead path say so.** The file's comments currently read as though the Williamson
   recovery covers part of the county. Correct them to what is true.
4. **Watch the key population.** `SEED_BLOCKED_FIPS`' source (`src/lib/cad-txgio-alias-counts.mjs`)
   decides that a county is two-namespace. If a later ingest populated `geo_id` or
   `property_number`, the writer would start binding with no announcement. Make that change visible
   (a refusal or a recorded census), not silent.
5. **The residue.** The store already holds join-miss absences for this county (25,743 per money
   rail, 26,043 per situs-city-type rail, 95,384 on `exemptionCodes`, P-310 CP2). The upsert refuses
   to downgrade a non-`unaccounted` cell. Establish from the code whether a crosswalk VALUE may
   replace a stored join-miss `absent-verified` cell, and say what an apply would do to them. Do not
   invent a second upsert path; if clearing them needs an operator-sanctioned sweep, name it.
6. **Answer P-351's question.** The bake's retirement arm (LDT `nodeFacetBakeTier1Conformant.ts`,
   `buildConformantTier1Payload`) retires a node whose bare prop_id misses `cad_property` at the
   declared tax_year. State, from the code and the counts, whether this same pair is what that arm
   needs to stop retiring Williamson's live parcels, and in which direction the lookup must go.

### Verify by violation

Pre-register your falsifiers and what would prove each wrong.

- A Williamson-shaped fixture: the pre-change writer binds 0 and writes no value; the post-change
  writer binds through the pair and writes the roll's values. Show both by revert-and-run.
- The ambiguity guard fires on a fixture with a duplicated `quickrefid` or `propertyid`; a clean pair
  passes. A guard observed only passing has not been observed working.
- A dry run against the live store (read-only, under P-281's heavy-scan lease keyed on the store
  host) reproduces P-310's bind count within the 433 and reports the per-rail value-to-absent
  movement, which must be zero.
- A non-Williamson county (Hays, whose own identifier binds 115,035 of 116,420) is byte-identical
  before and after your change.

### The three-question gate

Answer in your close: what executes the loader and the bind, what triggers them, what fails when the
pair is ambiguous or stale, and what bypasses them.

### Constraints

- No store writes, no applies, no deploys, no merges. County 48491 is read-only for you.
- `src/lib/parcel-record-engine` is vendored; do not hand-edit it (`ENGINE_PIN.json`).
- hauska-factory main carries #173 (P-319) and #175 (P-325) as of 2026-09-18. Branch from current
  `origin/main` and declare the SHA.
- Heavy reads take the P-281 lease keyed on the store host and release it in a `finally`; renew
  before expiry, never after (P-310's dead-end).

### Close

Declare: start commit, PR number, where the pair persists and its refresh rule, the fixtures in both
directions, the dry-run bind count and movement per rail, the residue answer, the P-351 answer, the
three-question gate, and `leave_behind`.
