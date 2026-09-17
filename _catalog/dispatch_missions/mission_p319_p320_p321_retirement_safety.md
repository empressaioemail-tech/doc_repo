## Mission — P-319, P-320, P-321: the retirement path stops emptying counties

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open ONE pull request
covering all three rows. You do not merge, deploy, or run any job against the production store.
You write nothing to any store. The integration seat merges, deploys and runs.

**This is the highest-priority lane in the program.** Williamson is dark on the customer surface
right now because of the defect in P-319, and the refusal in P-320 is the control that would have
stopped it and also would have stopped the same class two days earlier in Bastrop.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p319-retirement-keyspace-and-blast-radius`. Declare the start commit (factory main was
`d2e6cb03` at compile; read it yourself and declare what you got). Register the clone under your
seat and remove the entry at close.

### The incident, measured (2026-09-17, OPS-16 A-212)

Williamson's production publish, job `factory-bastrop-publish-sxv8r`, run `7b2540c8`, started
19:24:19Z and COMPLETED. It retired all 602,050 served `node-facets:tier1` rows for county 48491:

- 282,569 R-prefixed rows, which were already retired before today by the CAD roll. Legitimate.
- **319,480 numeric rows, which were LIVE and carried the 2026-09-10 bake (run `848afd72`).**

At 19:26:04Z `get_smart_site 48491:107190` returned `record_retired` with the basis "no row in the
published parcel index". Production payloads became 1,579-byte retirement stubs with no
`baseFacts`, no `zoning` and no `envelope`; the same rows on a point-in-time branch taken at
19:22:29Z are 2,226 bytes with `recordRetirement: null`. Facts were destroyed, not just flagged.

**Mechanism.** Williamson's published parcel index is keyed by R-prefixed CAD account numbers.
Its served nodes are keyed by numeric prop_ids. The retirement step computes a set difference of
served keys against the published index without testing that the two are the same keyspace, so
every numeric node was absent by construction and every one was retired.

**Second mechanism considered and rejected:** that the roll had genuinely dropped those parcels.
Rejected because the branch shows the same rows live with full payloads minutes earlier, and
because P-306 established that every R-prefixed key IS present in the county's index, so the index
is a complete R-keyed roll rather than a shrunken one.

**Why nothing caught it.** P-306 fixed the coverage FLOOR to compare within a keyspace, and the
floor duly passed at retention 1.1666. The retirement DECISION beside it was left keyspace-blind.
A control that measures one thing does not protect the thing next to it.

**The precedent.** ENFORCEMENT.md records the 2026-09-15 Bastrop 48021 reconcile that retired
57,704 of 62,394 parcel-node atoms, 92.5 percent of the county, by the same presence-shaped
comparison. The doctrine paragraph "a mass state change refuses before it lands" has stood since
then. The refusal was never built, and two days later the class took a second county through a
different writer. That is what P-320 exists to end.

### What to build

**P-319 — retirement is computed within a keyspace.**

1. Read the publish job's retirement step and state, in your CP1, exactly where the set difference
   is computed and what it compares. Name the file and the function.
2. Classify each served key and each index key into its keyspace by a rule you declare (the two
   in evidence are numeric prop_id and R-prefixed account; write the rule so a third keyspace is
   expressible, not so it is special-cased).
3. A served node is retired only against an index that contains its OWN keyspace. A served
   keyspace with no corresponding index keyspace is `unaccounted`: it retires NOTHING, and the run
   records the keyspace, the count, and that it could not be measured. Do not convert it to a
   verified absence, and do not let it silently pass as "nothing to retire".
4. Verify by violation on a Williamson-shaped fixture: numeric served rows against an R-keyed
   index. The current code must retire everything on that fixture, and the fixed code must retire
   zero and report one unaccounted keyspace. Show both directions in the close.
5. Also verify a genuine retirement still fires: a fixture where served and index are the same
   keyspace and a key really is gone must still retire that key.

**P-320 — a destructive writer refuses on blast radius.**

6. One shared, declared threshold: a share of the county's affected served population above which
   a writer that sets a destructive status writes NOTHING, records what it would have done
   (counts, the keyspaces involved, and a sample of the keys), and exits non-zero. Put the
   threshold and the authorisation flag in ONE place that every destructive writer reads; do not
   copy a default into callers, because a default copied into its callers survives its own
   removal.
7. Crossing the threshold requires an explicit authorisation flag on the invocation. A warning, a
   log line or an environment variable that is always set is not authorisation.
8. Apply it to the publish retirement step first. Then enumerate every other writer in the repo
   that can set a destructive status — the parcel-node reconcile of the 2026-09-15 instance is one
   — and say in your close which ones you wired, which you did not, and why. An enumeration you
   did not finish is a finding, not a failure; an enumeration you skipped is a defect.
9. Verify by violation: a fixture that crosses the threshold must refuse, exit non-zero, and leave
   the store byte-identical (prove the store is unchanged, do not assert it). The authorised path
   must be shown to still complete. Note explicitly that your own verification runs generate
   records indistinguishable from real ones, and say how you excluded them.
10. Answer the three-question gate in your close: what executes this refusal, what triggers it,
    what fails when it is violated, and what bypasses it. Name the bypass paths honestly — a raw
    SQL session is one.

**P-321 — retired-share per county is watched.**

11. Compute retired-share per county per adapter on a schedule, recorded with the snapshot it ran
    against (commit and data timestamp, per ENFORCEMENT.md "state your snapshot").
12. A move beyond a declared band FAILS the run. It does not file a report. The Bastrop instance
    survived twelve days because nothing read the reports, and this operation has a long record of
    detectors found dormant, starved or vacuous. Prefer the refusal.
13. Verify by violation against the pre-recovery Williamson state (48491 at 100 percent retired):
    it must fail the band. A band that the pre-recovery state passes is the wrong band.
14. P-309's close (`_inbox/`, the served-retirement review: 348,308 served retirements, Williamson
    2,264 with no same-situs successor, 164 also absent at source) is your input for what a normal
    band looks like. Read it rather than inventing a number.

### Constraints

- No writes to any store, and no job runs against production. Fixtures only.
- Do not take, renew or release a live lease belonging to anyone else.
- The integration seat is restoring Williamson from a point-in-time branch while you work. Do not
  touch county 48491 in any store.
- Any doc_repo change is handed back as a diff in your close. You do not commit to doc_repo.

### Close

Your close declares: the start commit and the branch, the PR number, the three verification-by-
violation results with both directions shown, the enumeration of destructive writers with what you
wired and what you did not, the three-question gate answers for the refusal, and `leave_behind`.
