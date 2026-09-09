# CTX-REFUSAL — the ceiling is confirmed correct and the rail still refuses against it

Repo: `hauska-factory`. This is the read CTX-ELGIN could not reach, and it is the last
thing between Bastrop and Travis and a bake.

## What is already settled, so you do not re-litigate it

CTX-ELGIN closed 2026-09-09 (`_inbox/2026-09-09_ctx-elgin_close.json`). Read it first.
It established, with evidence:

- **The ceiling of 9 (48021) / 457 (48453) is correct.** It is the only measurement taken
  against both the rail's own population and the rail's actual data path,
  `txgio_parcel.zoning_district`.
- **The staged table is not the basis.** `tx_zoning_district_staging` has no live
  production consumer for Elgin at all: `join-zoning-district-to-parcels.mjs` is
  Lockhart-only by its own docstring and `drain.ts` is an explicit stub for a future
  Factory 2 writer. The integration seat proposed deriving the ceiling from that table
  and was wrong; the lane disproved it by reading the consumers.
- **A re-stage did not help.** Bastrop residue moved 48 to 58, AWAY from the probe's 9,
  not toward it. Not staging drift.
- **The instrument is validated.** The falsifier reproduced CTX-STAGE2's Pflugerville
  numbers exactly, 2,959 / 41, from a second independent lane.

Do not re-run the re-stage. Do not re-derive the ceiling from the staged table. Both have
been done and both answers are in that close.

## The question this lane exists to answer

`factory-parcel-r5-zoning` refused `LAYER_GAP_RESIDUE_EXCEEDED` on the Bastrop dry run
(execution `dppvg`) because its measured residue exceeded the declared ceiling of 9.

The ceiling is now confirmed correct. So one of these is true and you must determine
which, with evidence, rather than settling on the first that fits:

**Mechanism A.** The rail's residue measurement counts a different population than the
probe that produced 9. Both could be correct about different questions. The rail counts
UNACCOUNTED CELLS, which excludes parcels already carrying an earned state from a prior
sweep; the probe point-in-polygoned a parcel population. Those are not the same set and
nobody has written down the difference.

**Mechanism B.** The rail's measurement is right and the underlying data moved since the
probe, so the true current residue really is above 9.

**Mechanism C.** The rail's own query has a defect. It has never been read by anyone
outside this repo.

State the mechanism you believe, then state a second that would produce the same
observation and why you rejected it. Stopping at the first plausible explanation is the
documented recurring error in this operation.

## The work

1. Read `factory-parcel-r5-zoning`'s residue query and the `LAYER_GAP_RESIDUE_EXCEEDED`
   guard. Write down its exact population, predicate and exclusions. This is the artifact
   nobody has produced.

2. Put that definition side by side with CTX-ELGIN's probe definition and CTX-STAGE2's
   staged-join definition, both of which are written out in their closes. Three
   definitions, one table. Say plainly which of the three the ceiling in
   `src/config/zoning-layer-completeness.mjs` is being compared against, and whether that
   comparison is apples to apples.

3. Re-run the rail's own dry run for Bastrop 48021 and report its measured residue as a
   number, alongside the ceiling it is compared to. Dry run only. Do NOT pass `--apply`.

4. Resolve the mechanism. If the ceiling and the measurement are comparing different
   populations, the fix is to make them comparable, and you propose that fix rather than
   changing a number.

## The second item, which is a real data gap CTX-ELGIN found

Eleven live Elgin polygons carry `Zone_Code='S-P'`, a genuine Elgin zoning district that
this program's registry never mapped. Nine of those polygons geometrically cover ten of
the fifty-eight residue parcels.

So the residue decomposes: ten parcels are a WRONG CODE MAP, and forty-eight are zero
live coverage. Those are different defects. A parcel sitting inside a real district we
failed to map is not an uncovered parcel and must never be served as one.

Establish whether the same class exists for any other staged city. An unmapped code in
one city's registry is a bug; unmapped codes across several is a missing validation, and
the fix is different.

Report it. The registry itself is in hauska-engine, not this repo, so you do not fix the
mapping here.

## Hard prohibitions

**Do not change the ceiling to make the gate pass.** The guard refusing is correct
behaviour and it has already caught one borrowed number. If your conclusion is that the
ceiling should change, that is a recommendation with a derivation, handed back, not a
commit.

**Do not write `not-applicable` on any parcel to clear a count.** `not-applicable` claims
the land is unzoned. A parcel probed and found uncovered earns `refused`, which is weaker
and honest. Watch for an unaccounted count falling without a matching acquisition
landing; that is relabelling and it is the tripwire named in
`_decisions/2026-09-08_zoning_unaccounted_two_populations.md`.

**Do not pass `--apply` to anything.** Dry runs only.

**Do not deploy, submit a Cloud Build, or run a bake, publish or walk.** The integration
seat owns every execution on this program. A dry run of the r5-zoning rail is the one
execution this lane may perform, and it writes nothing.

Do not write to hauska-engine, legacy-design-tools or hauska-map.

## Trap recorded from the lanes before you

A long-running query at near-zero CPU is STUCK, not working; CTX-STAGE2 lost over an hour
to a residue query with no `city_key` restriction and no bbox pre-filter. Restrict by
`city_key`, pre-filter on the numeric bbox columns both tables carry, set `connect_timeout`
and `statement_timeout`, and announce any heavy scan before you start it per
AGENT-CONTRACT section 4.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Use per-parcel `EXISTS` aggregation, never a flat join. A flat join
already produced an impossible number in this program once.

## Close contract

Standard lane close JSON, plus:

- The rail's residue definition written out: population, predicate, exclusions.
- The three definitions side by side and the apples-to-apples verdict.
- The dry-run measured residue and the ceiling it was compared against, as numbers.
- Your mechanism, the second mechanism you rejected, and why.
- The S-P decomposition and whether the unmapped-code class appears in other cities.
- `leave_behind`.
