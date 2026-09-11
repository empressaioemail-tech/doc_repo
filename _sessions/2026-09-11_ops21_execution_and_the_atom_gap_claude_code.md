---
date: 2026-09-11
agent: planner
repo: docs
session_type: execution
memory_graded: none
rolled_up: false
supersedes: none
snapshot: >
  doc_repo main de927be0. Integration seat, P:/doc_repo, branch main. Read-only across
  hauska-factory (main moved 63a606b -> 711cc06 during the session), legacy-design-tools
  (c43e2436 -> cebd041d), hauska-engine 15021ef. First live production run of
  scripts/plan-progress.mjs against FACTORY_DATABASE_URL_RO.
---

# OPS-21 execution: eleven lanes, and the half of the goal that did not move

Third session record for this arc. First is
`2026-09-10_county_contract_and_scaling_diagnosis_claude_code.md` (diagnosis, county
contract). Second is `2026-09-10_ops21_program_open_and_dispatch_claude_code.md` (program
opened, seven lanes dispatched). A midsession capture written mid-flight is at
`2026-09-11_MIDSESSION_ops21_capture.md` and remains the best cold-start read.

## THE OPERATOR'S QUESTION AT SESSION END, AND THE HONEST ANSWER

Asked: *is the ideal state the ledger serving everything, backed by atoms — and did we move
toward that, or did we bandaid it?*

The model is correct. ADR-031: `source -> conformant atom -> cell citing that atom -> gate ->
serve`. Atoms answer what we know; the record answers what we have accounted for; only the
record is gateable and serving reads only gated cells.

**We moved hard on the ledger half and slightly BACKWARD on the atom half.**

Forward: 351,872 parcels carry real setback values where the entire in-city population was
unaccounted; the gate denominator went 17 to 65 so the ledger is fully graded rather than
three-quarters invisible; 331,066 false absences corrected with 209,483 correct ones provably
untouched; every deferral named with a trigger.

Backward: **none of the new cells are atom-backed.** S1 and S2 wrote cells directly from the
ruled setback corpus. R1's classification table is a declared workaround for a corpus defect.
ADR-031 Decision 3 requires source -> atom -> cell; we did source -> cell.

This is the CTX seam that ADR-031 Decision 4 already documented and blessed as bounded debt,
extended to more rails. It has a name, a rationale and a repair path. It is not a quiet
shortcut. **But ADR-031 rejected record-first precisely because "the catalog and the product
would permanently diverge, and the Hauska thesis requires that the catalog is the product."
Every rail cut over without an atom underneath widens that divergence**, and the repair — the
CTX atom-backfill card — is scoped to ONE rail-family of sixty-five.

ADR-031's own reversal criterion is the tripwire: if record reads are observed diverging from
the atom catalog for a fact both carry, the backfill stops being deferrable. **Nothing measures
that divergence today. That is what L4 was for and L4 is still not compiled.**

## What was done

Eleven lanes dispatched or closed this session across three repos.

```
CLOSED   S1 P-132  351,872 parcels with real setback values, merged PR#135
         S2 P-133  4 of 8 envelope rails, merged PR#136 -- and refused to fabricate the rest
         S3 P-134  34 write-path units carry non-vacuity tests; found a SECOND vacuous path
         S4 P-135  45 pairs verdicted, ZERO slated, and that MET its predicate
         D1 P-137  5 derivable rails, merged PR#134  (see the discrepancy below)
         D5 P-136  gate denominator 17 -> 65, 390/390 verdicts live, PR#132
         D6 P-141  enumeration only, per mid-flight rescope
         L1 P-142  97 pairs audited, 70 legacy paths still reachable
         R1 P-146  331,066 false absences corrected, 209,483 provably untouched, PR#138
         Z1 P-147  closed having written NO CODE, because there was nothing to apply
         CTX-PIN4  pin 591f5efe -> cebd041d, factory main green, plus a new CI control
RUNNING  S5 P-148  five serve wrappers + the first end-to-end proof (CI watching)
         Z2 P-149  propagate not-applicable to eight dependent rails
HELD     H1 P-145  Hays, waiting on the CTX-HAYS backfill to settle
```

Six operator rulings taken, each with reversal criteria: the sixth cell state
`available-on-request`; `not_specified` as three populations disposed three ways; no
"computed by approximation" state; the cadRoll overlay as transitional; S4 closing with zero
slated; Z1's finding routed to a successor rather than fixed in place.

## What was learned (changes to ground truth)

**Z1 inverted the plan.** The 3,376-parcel residual was never blocked on `zoningDistrict`
resolving — it had already resolved. Zero unaccounted `zoningDistrict` cells anywhere, verified
live twice on primary and replica with zero drift. All 3,376 are legitimately `not-applicable`:
genuine polygon misses inside cities whose staged layers ARE declared complete. Per-county
44/26/1,014/1,021/1,271 reconciles exactly to S1's and S4's independent numbers — a THIRD
derivation of the same population from a third direction. **The real blocker is a missing
branch:** both writers advance only on `value`/`refused` and have no branch for a legitimate
`not-applicable`, so 3,376 x 8 cells are permanently stuck. This program's defect class pointed
at itself.

**The gate's denominator was 17 of 65.** Canon says `unaccounted` is fatal at publish; it was
enforced for 17 rails and 48 were never asked. That is the mechanism behind agents honestly
reporting done. D5 fixed it, derived from `rail-keys.js` rather than hand-authored.

**`DEFAULT_SCHED_RAIL_KEYS` is ALSO the publish pre-bake floor.** Found by the D5 lane, not the
planner. `publish-readiness-gate.mjs:359` defaults `requiredRails` to it and
`bastrop-publish.mjs:407` calls with no third argument. Widening it literally would have blocked
every publish for every county. One constant, two controls, one of them read.

**Three stores, two named `neondb`.** `FACTORY_DATABASE_URL` (ep-round-base-au0jofwp) and
`PRODUCTION_NEONDB_URL` (ep-lucky-truth-apodo8hr) are different hosts. OPS-13 does not cover the
Factory store. S4 resolved `parcel_gate_verdict` to the FACTORY host; `tx_*` and `permit_record`
remain unresolved and are listed as such.

**`not_specified` carries two meanings and never its nominal one.** Zero of 329 flagged slots sit
on a null. 547,657 is the FLAG population, not the DEFECT population; remediating all of it would
have flipped ~234,000 correct absences into wrong values.

**`parcel_gate_verdict` is a live table under scheduled re-evaluation, not a snapshot.** S4 caught
`48453:parcelAreaSqFt` flipping `refuse` -> `pass` between its own checkpoints. The discrepancy
surfaced because an aggregate cross-check disagreed with per-row numbers — the disagreement was
the instrument, not a manual re-check.

**A wrapper audit found a clean inverse.** The four setback rails have a serve wrapper and fail
the gate; `parcelAreaSqFt` passes and has none; four more rails have neither. Five wrappers are
owed, not one.

**First live production run of the anti-drift instrument.** S1 (291,055) and S2 (2,673,932)
reproduce their own closes to the cell from a different instrument on a different connection. S4
reads 0 DONE. D3/D4/D6 read their exact full populations to the row.

**And it caught one thing: D1 closed claiming its predicate equals 0; it measures 4,032,691** of
a possible 4,907,025. Two mechanisms produce that observation — the apply ran on a narrower scope
than the predicate measures, or the count was asserted rather than run — and
`_inbox/2026-09-11_ops21_first_live_progress_grid.md` deliberately does not choose. Routed, blocks
nothing, should not stand unexamined.

## Planner errors, continued from the prior session's log

Three more, all caught by lanes or peers, same shape as the first seven — a claim verified on
one side of a seam and stated generally.

8. **S2's dispatch named the wrong adapter package.** The live route uses LDT's own workspace
   adapters, an already-diverged fork; neither is importable from hauska-factory; the real single
   source of truth is the published setback corpus, which neither repo has repointed onto. The
   dispatch also named 7 cities where the corpus carries 29 jurisdictions with 15 in scope.
9. **The S3 "repoint" was itself wrong.** The lane's scope was every registered write path, which
   spans engine and factory; `computeTier1Envelope` was the first exemplar, not the scope. The lane
   ignored the correction and was right to. A correction to a running lane does not reach it through
   the compiled file anyway — that is its own lesson.
10. **Attribution swept off a shared working tree.** Commit `0cc19422` credited a peer's
    uncommitted edit to a lane. The shared doc_repo tree makes another seat's uncommitted work
    indistinguishable from the planner's at `git add`.

The dispatch-preflight rule from those errors is still PROSE (3P-4), which is the condition it
exists to fix.

## What's still open

- **Z2 (P-149) is the last thing before a slate pass.** Eight rails become gate-eligible across
  five counties in one move when it lands.
- **S5 (P-148)** running; its predicate is a live probe on a deployed surface, not a merged file.
- **H1 (P-145)** held on the Hays backfill settling.
- **L4 divergence measurement is NOT COMPILED**, and it is the tripwire for the atom-gap above as
  well as for the cadRoll overlay (3P-1).
- **The 3P deferred register now holds 17 items**, each with a trigger. An item with no trigger is
  refused.
- **D1's predicate discrepancy**, routed.
- The atom-backfill scope question: 1 of 65 rail-families.

## Suggested canonical doc updates

1. **Compile L4.** It is the only instrument that would detect the catalog/product divergence
   this session widened, and ADR-031's reversal criterion depends on it.
2. **ADR-031 should record that the CTX seam was EXTENDED** beyond CAD rails to setbacks and
   envelope by OPS-21, with the count, so the exemption's real size is visible rather than
   inferred from lane closes.
3. **3P-4 (dispatch preflight) needs a plan row.** Three of this session's ten planner errors
   would have been caught at compile.
4. **OPS-13 should point at OPS-22 section 3a** for the third store, or be amended directly.
