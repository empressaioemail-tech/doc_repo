---
date: 2026-08-20
seat: property substrate
artifact: handover, T-25 close and the S-21 re-derivation spec
status: verified partial, work remaining is specified not started
related: [65_t25_admissibility_enumeration, 61_enforcement_doctrine]
---

# Property seat handover, 2026-08-20

> **AMENDED 2026-08-20, AFTER A LIVE DB PROBE. READ THIS BLOCK BEFORE THE BODY.**
> Four statements below were written before the probe and are now wrong. Full results in
> `_inbox/2026-08-20_db_probe_five_answers.md`; canon is `65_t25_admissibility_enumeration.md`.
>
> 1. **The population is 254, not 253, and it is settled.** 254 rows over 254 distinct county
>    FIPS, complete, zero non-county entities. Everywhere the body says the population is
>    unverified or gating, it is neither. S-21 scoping is unblocked.
> 2. **R-7 is FALSIFIED, not the highest-value open item.** The bbox columns are
>    `double precision`; the kill path required `numeric`. Absence clustering was never
>    starved. Do not spend a minute on it.
> 3. **Item 3's database half cannot be built as specified.** There is no `parcel-node`
>    table — it is an entity_type inside `atoms`, so a foreign key has nothing to reference.
>    It becomes a self-referential check, or it waits on a per-family key grammar. The
>    grammar is the real prerequisite and it does not exist. Also: any figure describing 46M
>    unresolved bindings is an artifact of a badly specified query that conflates key-shape
>    mismatch with orphaning, and must not be quoted as an orphan count.
> 4. **Two corrections to the flood and stamp plans.** The reconciliation target is
>    zone-versus-X, **36,723** cases where one store names a hazard zone and the other says
>    outside it — NOT AO-versus-AE, which is 129. And Bastrop holds **5** multi-part parcels
>    of 74,729, so a Bastrop-only stamp gate would almost entirely miss the second geometric
>    failure mode: **add a second, high-multi-part county.** Statewide multi-part is 69,058
>    and the unmeasurable population is 4,354,603 null-geom rows, 26.5%.


Filed rather than left in conversation, because F-0 established that a handover existing only
in a transcript is the defect this programme documents. This is the third artifact in a week
to be lost that way and the practice is now to file first.

## Snapshots

doc_repo `4f326ed` (pushed). hauska-engine `d3f3794`. legacy-design-tools `1113c649`.
hauska-map `204789f`.

Working trees do NOT match these and were not used. All reads via `git show <sha>:<path>`.
hauska-engine is on a detached HEAD at `8d8e880`; legacy-design-tools is on
`feat/s1-instrument-hardening` at `10069854` with 63 dirty files belonging to another seat.

**Branch protection Stage 1 is live.** legacy-design-tools returns `required_pr: true`,
`enforce_admins: true`, `checks: null`, measured directly and matching the fleet notice.
**No check is required anywhere.** Any green cited below is a courtesy, not a gate.

## DONE

**F-0 closed properly.** The full enumeration is consolidated into canon at
[65_t25_admissibility_enumeration.md](../65_t25_admissibility_enumeration.md), committed
`f847d73` and `4f326ed`, pushed, content verified present in the remote-tracked blob rather
than the path. 47 distinct verified checks. The three `_inbox` files remain as the dated lane
record.

A numbering collision was reconciled rather than quietly closed: "rows 1 to 46" is not 46
distinct checks. SS-W16 row 1 is the same check as R-3, and its row 2 is the tier2 tile
predicate already carried in the scoring-path prose.

**W-9 confirmed** at both layers, with `NOT NULL` and the pair-unique INDEX recorded as the
two things that do not shrink it. **W-27 and W-28 added**: `document_ingest_atoms` is a second
atom store, one constraint weaker, its writer deriving the primary key from an unvalidated
binding.

**W-12 resolved and it inverts.** Neither `geometryCentroid` copy is uniformly correct, so
this needs a third implementation rather than a winner. Separately, of three definitions only
flood's is invoked, so a reconciliation scoped from definitions is scoped against the wrong
number.

**S-21 answered NOT FOUND** by proven traversal with a positive control. Rows RETIRED, not
superseded.

**S-22 corrected, S-23 and S-24 added.** See below; this changes what the ordered fix should
be.

## S-22, the ordered fix, and why it is not the fix that was ordered

The order was "it becomes true or it is removed." Neither is right as stated.

The `notes` prose at `registry.ts:197` **is honest**. It disclaims precisely what S-22 accused
it of asserting: it names the missing producer, names the verify script that regexes its
output, states the rule will not reproduce live values where `foldedExtraFeatures > 0`, and
routes resolution to the planner. Removing it destroys S-21's evidence trail.

The false half is the **machine-readable field**. `geometry` declares
`denominator: PARCEL_FEATURE_DENOMINATOR` while its 253 live rows embody a different
denominator. A consumer reading the structured field is misled; only a human reading the prose
is warned.

**The fix, specified.** Three parts, one card, because splitting them orphans the others.

1. `geometry`'s declared denominator becomes a retired or unmeasured state until the
   re-derived scorer lands, so no consumer reads a denominator describing rows that no longer
   stand. The prose note stays and gains a line recording the retirement ruling.
2. `registry.test.ts:77-78` becomes meaning-shaped. Presence of a truthy `kind` and an
   11-character `basis` cannot detect this class. The check that would have caught it is
   whether a rail carrying live ledger rows declares the denominator those rows were computed
   against.
3. A divergence test between `rule.denominator` and what `measure.ts` actually executes.
   Today the declaration is a label copied into a provenance string and never computes
   anything, so the declared basis can drift from the executed query in silence. This is the
   CTRL-1 shape and it is the reason part 1 was possible.

Requires a PR on legacy-design-tools; direct push refuses. Use a fresh worktree, not
`P:/legacy-design-tools`, which holds another seat's 63 dirty files.

## NOT STARTED: the S-21 re-derivation

A new geometry coverage scorer, re-run over the counties the retired rows covered. **Not
begun.** Starting it with the budget remaining would have produced a thin pass, which is the
stopping rule the programme already endorsed.

**Verify the population before scoping.** The retired figure is "253 live geometry ledger
rows." Texas has 254 counties. Whether 253 means 253 counties, or 253 rows over a different
county count, is unverified and must be established from the ledger rather than assumed. A
measurement is true of the source it measured.

**Acceptance criteria, which are the point rather than the numbers.**

1. The denominator is defined in checked-in source, carrying both a machine-readable kind and
   a prose counting rule, **and something fails if it is unread**. That is the defect the
   previous scorer capability shipped (S-3, S-24) and it is the one not to repeat. A
   declaration nothing consumes is a starved mechanism.
2. The scorer **emits nothing** when a required input is absent, rather than emitting a value
   computed without it. This is T-27 and the estate has no passing instance of it in the
   scoring path.
3. **Absent, zero and unmeasured are three distinct outcomes in the output.** A county with no
   geometry and a county measured at zero coverage are different states. S-11, S-14, S-16 and
   S-19 all collapse them today.
4. **Proven by violation before it is trusted.** Feed it a county with a known defect and
   confirm it refuses or reports it, and separately confirm it can fail **two different ways**.
   A clean pass is consistent with a check that cannot fail.
5. **Per county, reversible in slices, with Bastrop or another adjudicated county first**, so
   the instrument is validated before the corpus.

**Do not reconcile new against old.** The old rows are retired because an unknown quantity is
being replaced by a known one. The honest record is that the prior figures were unreproducible
rather than wrong. Any artifact stating otherwise is making a claim it cannot support.

## NOT STARTED: two other items owed by this seat

**`packages/retrieval` beyond `three-layer-audit.mjs`.** Untouched, not skimmed, zero rows,
exactly as handed over. The prediction stands untested: sentinel defaults on serving sweep
field tallies, and the `?? 0` collapse of absent, zero and unmeasured.

**The Stage 2 reliability report.** The fleet notice names it as gating Stage 2 required
checks, and `_STATE.md` records it as owed by the property seat. Not started. It needs, per
repository, which checks pass consistently enough to be required and which are deferred with a
reason each, established from run history rather than assumed. `ci-api-server-boot-smoke` is
the named first required check on the criterion of having fired against a real production-main
violation rather than a simulated one.

## Two process observations, both with evidence

**The dirty-tree close gate is scope-broader-than-its-claim, and it fired twice today.** It
blocked a push because `_STATE.md` was dirty, but that edit belonged to another seat recording
branch protection going live. Committing it would have carried a second writer's in-flight
work. The logged override was used both times with that reason. The doctrine names a control
whose scope exceeds its claim as a defect worse than a narrow one, and the predicted behaviour
followed exactly: a correct control teaching the fleet to reach for the bypass.

**`_STATE.md` currently carries a duplicated branch-protection paragraph**, two near-identical
entries recording the same fact. That is the signature of a concurrent double-write on the
estate's most contended file. Flagged, not edited, because it is another seat's in-flight work.

**A markets-seat artifact was found pre-staged in doc_repo's index**,
`_sessions/2026-08-20_t25_enumeration_handover.md`, `applies_to: empressa-trading,
smart-markets`. It was picked up by an explicit `git add` of an unrelated path. Committed by
pathspec instead so their staged entry was left untouched. Routing flagged, not actioned.

## Pre-registration, which fired twice this session

Both bands caught something, and one caught an error in a prediction carried by the dispatch
rather than in the author's own work.

The dispatch predicted confidence defaults in the writer family. **They do not exist.**
`building-footprint` is the only module with a confidence field and it correctly omits rather
than defaults. Filing on the prediction would have entered a defect that is not there.

S-22 was the second: a filed row that did not survive reading the artifact it accused.

Keep the practice. It costs minutes.
