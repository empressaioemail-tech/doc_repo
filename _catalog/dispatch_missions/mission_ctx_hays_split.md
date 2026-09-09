# CTX-HAYS-SPLIT — one population, two lineages, and a ruling waiting on the difference

Repo: `legacy-design-tools`. Reuse the registered, clean worktree
`P:/seat-worktrees/property/legacy-design-tools-ctx-hays` on branch
`fix/ctx-hays-2026-cad-reacquire`.

This is a read-only measurement. It is expected to produce no code diff. If you find
yourself writing an implementation, you have misread the mission.

## Why this exists

CTX-HAYS closed 2026-09-09 and resolved the Hays question decisively: mechanism B, the
county's own appraisal district has never published a 2026 roll larger than about
134,600 accounts, confirmed by three independent source counts five months apart across
two export schemas with a spread of fifteen rows. Read
`_inbox/2026-09-09_ctx-hays_close.json` and
`_inbox/2026-09-09_ctx-hays_acquisition_mechanism_resolved_finding.md` first. That work
is sound and you are not re-doing it.

It ends by handing the operator a ruling: does Hays launch on its true smaller 2026
population, with the roughly 37,510 absent accounts handled by CTX-RETIRE's
`recordRetirement` declared-absence mechanism.

**That handback contains an internal inconsistency and the ruling should not be made on
it as written.**

The same finding establishes that `cad_property` tax_year 2025 for 48209 has TWO source
lineages:

    hays-export2.zip                       55,695 rows   genuine CAD export
    stratmap25-landparcels_48209_lp.zip   116,421 rows   non-CAD parcel geometry,
                                                         applied 2026-08-25 as a
                                                         coverage fallback because the
                                                         real CAD export was short

The close then describes the whole absent population as "real 2025-vintage accounts
absent from the current 2026 roll." The word "lineage" appears zero times in the close.
That population was never split.

## Why the split is load-bearing rather than pedantic

`recordRetirement` asserts a specific thing: **an account that was on a roll has left
it.** That is true and honest for a genuine CAD dropout.

It is a category error for a StratMap geometry row that was never on any CAD roll. Writing
a retirement for one of those claims a retirement that never happened. It would be a
fabricated claim that passes every existing check, which is precisely the failure class
`ENFORCEMENT.md` exists to prevent, and it would be written at scale onto a launch county.

The two populations need different honest states. A CAD dropout is retired. A parcel we
hold geometry for and never held an appraisal account for is a different absence
entirely, and naming it is part of this lane's output.

## The work

1. Split the absent population by `source_file`. For 48209, the set of `prop_id` present
   at tax_year 2025 and absent at tax_year 2026, grouped by the `source_file` that
   produced the 2025 row. Report the counts with the full counting rule.

2. Report the overlap explicitly. A `prop_id` may appear under both lineages if StratMap
   overwrote `source_file` on rows that were already genuine CAD accounts. The finding
   notes 116,421 rows were touched of which 40,870 were net new, which means roughly
   75,551 existing rows had their `source_file` rewritten. **If `source_file` was
   overwritten in place, then `source_file` alone cannot distinguish the two populations
   and you must say so rather than reporting a split it cannot support.** Establish
   whether a genuine CAD account can still be identified after that overwrite, and by
   what field if so. This is the crux of the lane and it may be the finding.

3. For each resulting population, state the honest absence state it should carry and why,
   in one sentence each. You are recommending, not implementing.

4. Verify by violating: run the same split against a county with a single clean lineage
   (Bastrop 48021 holds only tax_year 2025 from one source) and confirm your instrument
   returns what a single-lineage county should return. An instrument that has only been
   run where you expect a split has not been shown to distinguish anything.

## Pre-register your falsifier

Before you run the split, state what result would show the two lineages are NOT
separable, and what you will conclude if that is the result. "The split is impossible
after the overwrite" is a legitimate and useful outcome, and reporting it is a success,
not a failure.

## What you must NOT do

Do not write `recordRetirement`, or any absence state, onto any parcel. This lane
measures and recommends.

Do not re-acquire, do not backfill, do not touch `MAX_MISS_RATE` or any gate threshold.

Do not bake, publish, walk, deploy, submit a Cloud Build, or run a Cloud Run job.

Do not write to hauska-factory, hauska-engine or hauska-map.

Do not manufacture a code diff to satisfy a general "you write code" expectation. The
previous lane in this worktree correctly shipped nothing and said so; do the same if
that is the honest outcome.

## Close contract

Standard lane close JSON, plus:

- The split counts by lineage with the full counting rule, or a plain statement that the
  lineages are not separable and the evidence for that.
- Whether `source_file` was overwritten in place, established from the data.
- The recommended honest state per population, one sentence each.
- The single-lineage control result.
- Your pre-registered falsifier and whether it fired.
- `leave_behind`.

The operator rules on Hays from this artifact. Write it so that a person who has not read
any of the preceding closes can act on it.
