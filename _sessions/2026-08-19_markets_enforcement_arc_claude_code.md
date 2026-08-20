---
id: session_2026_08_19_markets_enforcement_arc
title: Markets substrate — enforcement arc, TW-67 through TW-73
status: active
last_updated: 2026-08-19
applies_to: empressa-trading, smart-markets
owner: nick
related: [61_enforcement_doctrine, 51_ingestion_pipeline_reference, rd_dt_08_build_scope]
purpose: Session record for the markets seat's enforcement arc. Seven rows landed across two repositories. Carries the two items the next session must inherit rather than rediscover, and the reasoning for stopping where it stopped.
---

# Markets substrate — enforcement arc

## Snapshot

Every claim below was verified against these trees, after fetch.

    smart-markets     origin/main  a346524
    empressa-trading  origin/main  b03e6c2b
    production                     569adaca

## What landed

    smart-markets     f691a71   TW-67  record kind split off the transform enum
    smart-markets     a346524   TW-69  second starved detector deleted, typed instead
    empressa-trading  236c1be2  TW-68  deploy gate, two-party attestation, scheduled
    empressa-trading  45bef4bb  TW-70  the sixth state, self-reporting
    empressa-trading  fe3a9106  TW-72  macro snapshot capture halted
    empressa-trading  b03e6c2b  TW-73  capture the reading, not the rendering, and cite it

## The number worth carrying

The deploy gate reads three failing of five, two of them advisory. That is the
first time anyone in this estate could answer how many of their controls
actually enforce anything. The number being bad is the point.

No repository in the estate has branch protection. Verified at source, not
relayed: both markets repositories return "Branch not protected" with zero
rulesets. Every continuous integration check anywhere runs, reports accurately,
and blocks nothing. Three merges landed this session on greens that were real,
accurate, and not load bearing. What was described as a gate was this seat's own
discipline wearing a gate's name.

The only control that provably blocked anything all session was the doc_repo
branch guard hook, which is over scoped and blocked a cockpit row for hours.
The estate's enforcement coverage is approximately one hook.

## THE CALL SITE RATIO TEST

The generalisable instrument this session produced. Run it beyond the three
providers it came from.

For any function with a RICH variant and a CONVENIENT one, count call sites of
each. The ratio finds a defect class without knowing what to look for.

    fmp.py    _fetch_status : _fetch          1 : 23
    capture   input_atom_ids supplied : not   0 : 1

Both are the same shape at different granularities: a capability that is
present, correct, and unreachable via the path everyone actually uses. Neither
is parallel implementation, because nothing is duplicated and every audit finds
the correct code present and called. A lineage branch no caller supplies and a
failure reason a wrapper discards are one defect.

The cause is ERGONOMIC, not a knowledge gap, which is why exhortation will not
hold it. The rich version returns something the caller must destructure and
handle. The convenient one returns a value. The lossy path wins every time, for
everyone, including whoever writes the next call site against a wrapper that is
still there with a deprecation comment on it.

Operator ruling: DELETE the convenient variant, do not deprecate it. Deleting
makes the wrong path unrepresentable and lets the compiler and the suite drive
the migration. Type over check, applied to an interface rather than to data.

## WHY THIS SESSION STOPPED WHERE IT DID

Recorded so the next session inherits the reasoning rather than the task.

The provider adoption is a 24 call site change across three files, and it was
identified with roughly a fifth of a session's working context remaining.
Beginning it here is how a good change gets left half applied: the compiler
pressure that makes the migration safe only helps someone who can see it
through, and a partially migrated provider is worse than an unmigrated one
because the two contracts then coexist with no marker saying which is which.

The same judgment was applied earlier and stated at the time rather than
discovered afterwards. It is a repeatable rule, not a one-off: a refactor whose
safety depends on completing under compiler pressure does not start near the end
of a working context.

## Carried items

1. THE PROVIDER ADOPTION, next session, fresh. The four state contract already
   exists in `fmp.py::_fetch_status` — `http_error`, `network_error`,
   `bad_json`, `ok` — fail closed, reason named at each branch. Nothing has to
   be designed or agreed. Its one reference caller (`/etf/holdings`) handles the
   status correctly AND distinguishes `ok` from `empty`, which is the exact
   separation `fred.latest` destroys. Order: read the reference, delete
   `_fetch`, adopt the contract in `fred` and `finnhub`, then the call sites
   under compiler pressure.

2. THE DRIVERS RECORD CLASSIFICATION needs its reopening condition made
   UNREPRESENTABLE at the type level, not noted in a comment. The
   `lastObservation` union is the discriminant: the absence branch permits
   Record, the observation branch requires Derivation. The moment a real
   observation arrives the compiler refuses to build until the classification
   changes. Part of the shape change, postdates the sweep. If it does not
   express cleanly, it becomes a scheduled check with a named trigger. It must
   not become a comment.

3. THE EM DASH is a display defect, not a substrate defect, since TW-73. It
   originates in `fred.latest`, not in `_fred_cell`: `None` means the call
   failed, the endpoint returned non-200, and the series is genuinely empty, all
   at once. Folded into the provider adoption above rather than fixed at the
   only place the damage is visible.

4. UNSTARTED: the thirty six contract schema rows, then drivers binding
   classification, shape change, adapter with acceptance `partial`.

## Findings that became doctrine

The sixth state: a control runs, its verdict is correct, and nothing consumes
it. Distinct from dormant, starved, undeployed and scope narrow.

The fourth state before it: merged, correct, armed, undeployed. Answers all
three gate questions and enforces nothing.

Scope BROADER than claim is a defect too, and worse than a narrow one, because
blocked legitimate work trains the fleet to reach for the bypass.

A rendering stored where a value belonged destroys the claim permanently. The
1,521 FRED observations were wrong AND repairable because the substrate held
enough to repair them; a stored rendering holds nothing to recompute from.

Independently derived means from different SOURCES, not different fields. Two
fields in one payload from one upstream are one derivation wearing two hats.

Evidentiary value and protective value are separate, and the six states describe
protective value only. Evidence does not decay to false, it goes stale, so it is
dated and compared against the control's own last touch.

Starvation has a granularity. Audit at the ARGUMENT level, not only the call
level, for any parameter gating a branch.

A sequence of honest present tense atoms is not a time series. Each row says "as
of now"; read back later a June row reports June's then-current revisions and
any judgment beside it inherits that. No row is false and the sequence is
contaminated.

## Cross substrate corroboration, stated as such

The systems seat found parallel implementation as a cultural habit from branches
and duplicate stores. This seat found it independently at the function level: a
detector written where a type split was available, and a capture path invented
two definitions from one that already stored values with revision state and
cited its own precedent.

That is corroboration rather than echo. The systems finding predates this one,
concerns a different artifact class, and reached this seat through no channel the
analyst opened. It is the only claim this week that belongs in that column.

## Errors made and corrected

Read a repository forty commits behind origin and nearly reported a finding from
it. Caught by the snapshot rule, which exists because of the same error earlier.

Wrote a claim of blocking behaviour into a control manifest that does not block:
a T-26 instance at the control layer rather than the test layer.

Reported "8 call sites, zero pass asset_class" when there are three and all three
pass a defaulted value. Worse than reported, not better: a default copied into
its callers survives its own removal.

Reported the provider ratio as 3:24 when it is 1:23; two of the three matches
were the definition and the wrapper.

Wrote a test asserting a string was absent from source, which failed on the
comment explaining why the string was removed. The test checked the explanation
rather than the behaviour.

Wrote a unit test that fanned out live network reads to three vendors. A slow
flaky test gets skipped, and a skipped test is a dormant one.
