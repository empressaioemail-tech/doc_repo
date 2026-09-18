---
id: 2026-09-18b_wave2_compile_and_seat_wave2_claude_code
title: "Session: the rest of Wave 2 compiled, the seat's first Wave 2 items run, migration 018 applied"
date: 2026-09-18
last_updated: 2026-09-18
kind: session
session_type: integration
status: closed (operator-called session close; handoff at _inbox/2026-09-18c_HANDOFF_integration_seat.md)
agent: claude_code
repo: doc_repo
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-18b_HANDOFF_integration_seat.md (consumed)
  - _inbox/2026-09-18c_HANDOFF_integration_seat.md (written)
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md (updated throughout)
  - _decisions/2026-09-18_phase0_closeout_rulings.md (A-222 and A-224 added)
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-222 to A-224; P-363, P-364)
snapshot: doc_repo main c5eb6666 at open, 76b46c7b before this close; product mains unchanged all session (factory 0f4558a4, engine c41a1482, LDT 25d1782f, map 163fde32); read 2026-09-18 18:40Z
---

# Session: the rest of Wave 2, and the seat's first Wave 2 items

## What the session did

**Compiled the rest of Wave 2 from source.** Thirteen dispatches, each mission written against the
product code at the mains above and against the run of record:

- **Factory:** P-333, P-334/P-329/P-330, P-352, P-361 (updating engine #474 in place), P-363.
- **LDT and the bake:** P-351 (both bake writers, plus the factory pin), P-359, P-362.
- **Map and cross-repo:** P-331.
- **Engine:** P-358.
- **Setback residual (two halves):** the P-300/P-338 writer half and P-338's surface half.
- **Recompiled:** P-286/P-317 and P-324.

The operator fired nine of them; they are in flight.

**Two operator rulings.**

- **A-222:** P-324 takes in the conversion events, the Conversions API and share-URL scrubbing staged
  on top of the pixel commit, and both halves ship together.
- **A-224:** ruling 5 amended, so a default setback line applies only where the city's ordinance
  sets one.

**The seat's Wave 2 production work.**

- **San Marcos coverage re-check: HOLDS.** 88.38 percent under 1.4.0.
- **P-258's re-run: checked before it ran, and found to be a no-op** in all six counties.
- **P-255 census re-grade:** every prediction held.
- **Migration 018:** applied to the atoms store and verified by violation.
- **P-324's variables:** `META_PIXEL_ID` and `PE_SITE_ORIGIN` added to Property Explorer's Production
  environment. The operator set `META_CAPI_ACCESS_TOKEN` at a masked prompt, and it was verified as
  listed at 18:37:24Z.

**Brought in:** P-270 address half's close and artifacts, from its seat worktree, byte for byte.

## Findings that changed the plan

- **A Hays re-run is not San Marcos's switch.** The handoff said it was. The setback writer never
  reopens an earned value, so 387,237 cells still cite corpus 1.1.0. The numbers are right except 6
  N-CM parcels frozen on the legacy NC row. That became P-363.
- **P-326's "servable" label meant only "no district on file".** 48,825 of the 48,829 parcels are
  in cities whose zoning layer was never acquired. Manor and Lago Vista, checked at source, are zoned.
  That became A-224 and P-364.
- **Hays' bare-id overlap with the roll is a collision count**, not key compatibility. This shaped
  P-333 and P-351.
- **Two row premises were stale:** P-358's line numbers, and the P-319 precondition in P-286/P-317.

## Errors of my own, and what caught them

1. I suppressed stderr on the first dry run. The failure then showed nothing until I read the
   execution by field.
2. PowerShell's comma operator merged the job's `--args` into one. The container refused with usage.
   Caught by reading the execution's recorded args.
3. Two self-test fixtures were vacuous, because the router matches every code to a one-district
   table. Caught while reading the router before the live run.
4. A hand-summed share of 8.08 percent was really 8.42. Caught by recomputing from the output file.
5. Two status entries were stamped 18:45Z at 18:29Z. Caught by `date -u`.
6. A `\t` in a Python string became a tab inside a recorded command. Caught by reading it back.
7. The register said the Meta token was set before it was. Caught by checking before committing.
8. Twice, an answer written between tool calls didn't reach the operator. That is now in the
   handoff's instructions.

All of these were caught by an instrument or a read-back, not by re-reading a conclusion.

## New instruments

Each was self-tested and checked by mutation:

- `scripts/san-marcos-coverage-recheck.mjs`
- `scripts/setback-corpus-version-diff.mjs`
- `scripts/setback-stale-match.mjs`
- `scripts/sql/setback-cell-source-census.sql`
- `scripts/sql/setback-value-cells-by-code.sql`

OPS-24's range now runs 358-364, extended in the registry and the probe-close gate together; the gate's
self-test was seen failing on a copy with the old literal.

## Commits

`d6ab5e46` (Wave 2 compiled), `28d30947` (A-222; San Marcos), `61b5b2ed` (A-223; P-258; P-363),
`5690995f` (A-224; census; P-300/P-338), `76b46c7b` (migration 018), and this close.

## Refinement notes

The `source-required` discipline held, and every number above traces to a file in `_inbox`. Two
things to carry forward:

- Check a plan row's premise at source before running it. The handoff's "a Hays run is San Marcos's
  switch" and ruling 5's "48,829 servable" were both inherited labels, and both were wrong.
- The operator can only see a turn's final message, so questions and commands belong there.
