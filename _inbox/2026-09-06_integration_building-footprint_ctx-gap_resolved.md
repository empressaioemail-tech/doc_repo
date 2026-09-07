---
lane: integration
item: "CTX building-footprint gap — root cause resolved. Promotion gap, not acquisition gap. Real Bastrop data exists, unpromoted, preconditions already met."
checkpoint: "DONE (investigation). No writer run, no promotion, no ledger wiring performed — operator wants ledger reconciliation and quarantine discussion before any action."
date: 2026-09-06
---

## Headline

Bastrop, Hays, McLennan, Travis, and Williamson each have real, landed,
staged building-footprint geometry — Bastrop specifically has 65,974 real
Microsoft ML-derived footprint rows, protected by genuine immutability
triggers, present since 2026-08-11/12. Both hard preconditions the atom
writer (`write-building-footprint-county.mjs`) checks before it will run
for a county are satisfied for all six CTX counties and have been since
before the one batch that ever ran (2026-08-16). Only Caldwell (of the six)
ended up with atoms from that batch — 174 counties statewide got atoms,
spanning nearly the full FIPS range (48001-48507, not a contiguous
prefix/suffix), so this was not a truncated run cut off partway. No
artifact anywhere records which counties that batch was actually invoked
against, or why five CTX counties were excluded despite being ready. The
most defensible reading: the writer was never dispatched for these five
counties, not that it ran and failed. This could not be raised to full
certainty — no run log exists — but nothing found points toward the
alternative (a real per-parcel join failure).

**This directly resolves the operator's pushback that "no data in Bastrop
on any level does not make sense."** He was right: real acquisition work
was done. It just never got promoted past the landing table for five of
six CTX counties, while a different, deliberate quarantine-worthy defect
(the orphaned migration recorded in
`_inbox/2026-09-06_integration_unmerged-migrations-run-against-prod_pattern.md`)
happened to also live in this same rail. The two are related but distinct:
the orphaned migration is about whether `main` can reproduce the table
that already exists; this finding is about whether the writer can safely
run against that table today. It can — the orphaned-migration fix and the
writer dispatch do not have to be sequenced together, though reconciling
the migration first is still the right order for anyone who wants `main`
to explain its own database before more work lands on top of it.

## The 3,646,917 vs 3,495,678 atom-count question — resolved as most likely
## estimate noise, not deletion, with the residual uncertainty named

The earlier figure was a `pg_stats`-based estimate, explicitly logged as
such at the time, not an exact count. Live exact count today: 3,495,678,
reproduced three independent ways. No deletion audit trail exists in this
system (no soft-delete column, no changelog table, whole-table lifetime
delete/insert counters that can't be scoped to this entity type or this
date range) — so this cannot be proven to full certainty. Every check that
could be run points toward sampling noise: three different stats-based
estimates taken at different times scatter across a ~200K range around the
true value, consistent with `pg_stats` MCV sampling (~30,000 rows sampled
out of 111M+) rather than a stepped drop; no relevant migration or writer
activity exists in the 08-20-to-now window; every surviving atom carries
the same single `created_at` vintage. Judged most likely estimate noise.
The real, separate finding worth keeping: **this system has no way to
audit atom deletions at all.** That is a guardrail gap in its own right,
independent of whether anything was actually deleted here.

## No hidden alternate footprint atom type

Exact, exhaustive `entity_type` enumeration (23 types, full table) and the
ledger's own `rail_key` enumeration (65 values) both checked — no
footprint/structure/improvement synonym exists anywhere under a different
name. The gap is real and singular, not a naming/migration split hiding
data elsewhere. Side finding, unrelated to footprint: `identity.alias`
(3,537,633 rows) is now live and fed — this was flagged STARVED in the
2026-08-20 store audit and no longer is, worth carrying into whatever
picks that finding back up.

## Two new, distinct findings from getting real landing-table access

Tonight's earlier probe hit `permission denied` on the Factory landing
tables under the read-only role; this pass used the full-access credential
and got in.

**`landing_setback_record` is completely empty — zero rows, for every
city, not just Bastrop or CTX.** `landing_setback_registry` (knowing where
to look) has three real, sourced entries (Bastrop, Elgin, Lockhart), but
the actual front/side/rear-foot data has never landed through this
specific pipeline path for any city, anywhere. This does not mean setback
data doesn't exist — tonight's other findings already confirmed real
setback data flows through at least two other paths (legacy-design-tools'
22-city hand-curated JSON corpus, and hauska-engine's Tier-1
breadth-bake snapshot). It means this particular landing-table-centric
acquisition path has never been fed by anything, which is worth knowing
before anyone assumes "the landing tables are the source of truth for
setbacks" — for this rail, right now, they are not.

**`parcel_record_cell`'s `buildingFootprint` rail is 100% unaccounted for
all six CTX counties, including Caldwell — the one county with 35,269 real
atoms.** The ledger has zero awareness of atoms that already exist. This
isn't a coverage gap that closes when the other five counties get
promoted; it's a missing reconciliation step between the atom estate and
the ledger for this rail specifically, and it exists even where real data
is available today. Two mechanisms considered: the promotion/reconciliation
step for this rail was simply never built (favored — the writer code only
ever targets the atoms store), or a parcel-key grammar mismatch between
Caldwell's atoms and its ledger rows is silently failing to match them (the
2026-08-20 store audit already flagged a live, unresolved dual-key-grammar
problem elsewhere in the system). Not distinguished with certainty — the
two databases are separate Neon endpoints and no direct cross-database join
was run.

## What this means for "reconcile against the master ledger and what's
## actually serving prod"

For buildingFootprint specifically: production serving for this rail
today goes atoms → cortex-api/retrieval-api → the apps, never through the
ledger — consistent with ADR-031's own doctrine that rails migrate to
ledger-served individually and coexist until they do. The ledger showing
100% honest `unaccounted` for this rail is not a violation of anything; it
correctly reflects that this rail hasn't been wired to ledger-serving yet.
The open question worth the operator's ruling is whether it should be —
and if so, whether Caldwell's real atoms get reconciled into the ledger as
part of that work, or whether the ledger stays deliberately behind atoms
for this rail the way ADR-031 anticipates for every rail during migration.

## Not done

No writer run, no atom promotion, no ledger wiring, no quarantine action.
Investigation only, per the operator's instruction to reconcile and discuss
before touching anything.
