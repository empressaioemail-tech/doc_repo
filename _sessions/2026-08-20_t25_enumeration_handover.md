---
id: session_2026_08_20_t25_enumeration_handover
title: T-25 enumeration — handover to the next reader
status: active
last_updated: 2026-08-20
applies_to: empressa-trading, smart-markets
owner: nick
related: [51_ingestion_pipeline_reference, 61_enforcement_doctrine, session_2026_08_19_markets_enforcement_arc]
purpose: Durable handover for the T-25 sentinel and default admissibility audit. Carries what was enumerated, what was found, what could NOT have been found, and the 44 rows remaining, with enough detail to resume cold. Committed rather than left in conversation because a handover that exists only in a transcript is the defect this programme documents.
---

# T-25 enumeration — handover

## Snapshots

    smart-markets     a346524426f448ceac8b8102447e47974c81b32f
    empressa-trading  b03e6c2b3f070f5f9eac0170278e835584ba4622
    cockpit production 569adaca  (8+ revisions behind main)

Every count below is against those trees. Re-verify before trusting: they move.

## Method, and why it is the standard

Structural instruments, not text search.

The contract was enumerated by walking the COMPILED Zod schemas and reading each
node's definition, so every check was reached through the schema graph rather
than matched in source. The cockpit was enumerated by an AST visitor. The call
site ratio test was built as an instrument that finds rich/convenient function
pairs without being told what to look for, and it found an instance that had
been missed by reading.

## Counts

    smart-markets contract     136 served rows, fully classified
    cockpit provider/write/res 258 rows (corrected from 260), 194 classified
    cockpit scoring band       119 rows, module-level traced
    ---------------------------------------------------------------
    total enumerated           513
    read in full                93   (39 spine + 54 can-fabricate)
    cleared structurally        58   (categorical-score graders)
    REMAINING                   44   (see the handover set below)

## THE TWO NUMBERS THAT MUST TRAVEL TOGETHER

Found: 13 fabricated price bars, confirmed in production, one vendor lane
(`fmp:eod-deep`, 1d), schedule-closed and manually re-openable via
POST /admin/runs.

COULD NOT HAVE BEEN FOUND, two named populations:

  1. Every 1m fabrication older than 48 hours. Databento rewrites the whole 1m
     window on a two-day lookback, so the query could only ever see two days.
  2. Every `fetch_daily` and `fetch_intraday` fabrication. Those write to no
     store; their output is served or computed and discarded, so it is
     unobservable at every horizon.

An unread path is work remaining. An unobservable population is a permanent
limit. Conflating them makes the report read as nearly complete when part of it
is unmeasurable by construction.

## Findings, ranked

### 1. stop_grade.py:326 and :328 — a guard defeated by upstream coercion

    qty = abs(float(qty or 0.0)) or 1.0                    # :328
    pv  = presets.POINT_VALUES.get(symbol, 1.0)            # :326

`r_multiple_from_pnl` refuses when `qty <= 0`. Line 328 makes a missing quantity
into 1.0 BEFORE the call, so the refusal branch cannot fire from this caller.
The guard exists, is correct, is armed, is deployed, and its verdict is
consumed. It is UNREACHABLE.

That is a failure state nothing else in this programme produced. Every other one
is a guard that does not exist, is not armed, is not deployed, is scoped too
narrowly, or whose verdict nothing consumes.

DIAGNOSTIC THAT FALLS OUT, and nobody runs it: for every guard, ask whether its
trigger condition can actually be produced by its callers. A refusal on a
condition no caller can present is dead code wearing a guard's name, and it
passes any audit that asks whether the guard exists. NOT YET RUN against the
rest of the substrate. It should be.

SYMMETRIC CORRUPTION. The fabricated quantity corrupts both sides of
`delta_r = realized_r - counterfactual_r` equally, so the SIGN survives and the
MAGNITUDE does not. `stop_grade.py:159` labels on a sign test, so the label
population is clean in these rows and the score population is corrupt in the
same rows. The verdict looks correct and the calibration magnitude is fiction.
Least visible failure mode in the set: every other one looks wrong to somebody.

POINT_VALUES is 28 hand-transcribed symbols (the code says "hand-transcribed —
operator-verify" in three places). MICRO FUTURES ARE ABSENT: `/ES` is present,
`/MES` `/MNQ` `/M2K` `/MYM` are not, and the cockpit's own health endpoint
live-quotes `/MES`. The 1.0 default is simultaneously CORRECT for equities,
which is why nothing looks wrong. Wrong by a fixed known factor for futures,
which means it may be detectable after the fact by reconstructing R multiples
for symbols absent from the table. HELD QUESTION: have any absent symbols been
traded? If none, latent. If any, a countable population, which is rare here.

### 2. outcomes.py:87 + :181 — collapses compose

    if entry_risk_per_unit is None or <= 0 or qty <= 0: return 0.0   # :87
    label = meta.label or label_from_r(score)                        # :181

Neither layer is visible from the other. A function returning zero for an
unmeasurable input is a local defect. A deposit path deriving a verdict from a
score's sign is sound IF the score means what it says. The collapse lives
between them.

The stored `partial` population has AT LEAST FOUR ORIGINS:
  - a grader that declined, and had a label derived for it
  - a grader that judged genuinely flat
  - a computation whose risk denominator was missing (fabricated 0.0)
  - a zone honestly neither held nor broke (zones/grade.py:551)

Exposure count and contamination count are DIFFERENT NUMBERS. Three modules can
fabricate a score; more than three contaminate the stored population, because
the collapse happens at the deposit, not at the grader.

STRUCTURALLY YES, SEMANTICALLY NO: a grader can omit `meta.label`, and omission
is exactly what triggers the derivation. There is no value meaning "I looked and
I decline". A field being optional is not the same as abstention being
expressible, and the two read identically from the schema.

The twin already solved this shape: `absent-verified` vs `lookup-failed`. The
scoring ledger never adopted the vocabulary.

### 3. The contract's constraint inversion

Zero cross-field or relational constraints in the entire contract. And the ten
UNBOUNDED numbers are the bar fields (o/h/l/c), strike, price, driver value and
sharesDelta — while eight other numeric fields carry a minimum.

The fields where a fabricated zero does the most damage are the only numbers in
the schema with no constraint at all. Not weaker. NONE. The contract constrains
a share count more tightly than a price. That is an inversion of coverage, not a
gap in it, and it is why fabricated zeros arrive at the twin unopposed.

### 4. 73 shape rows, ZERO value constraints

Both numbers or neither. 73 rows are enforceable by branded construction, moving
them outside every failure state named this week. Zero value constraints exist
today.

A `NonEmptyString` and a branded identifier make an empty string and a malformed
identifier unconstructable. Neither has any opinion about whether 4.11 should
have been 411.0.

TWO DIFFERENT INSTRUMENTS, and they were conflated in an earlier count:
  - DISCRIMINATED UNION makes a wrong SHAPE unrepresentable (TW-67).
  - VALIDATING CONSTRUCTOR makes a wrong VALUE unrepresentable (the bar type).
Test: can an invalid instance of this type be constructed? If yes, the type
documents the shape and enforces nothing about the meaning.

### 5. Dedup-key sentinels destroy the evidence of their own size

`capture_hooks.py:37,46` -> `calendar_dedup_key(raw_date, event_name)` with `''`
defaults. An empty string in a dedup key does not produce one bad atom: it
MERGES every record carrying the sentinel into a single row. The count of what
merged is unrecoverable because the distinguishing values WERE the key.

RULE FOR THE REMAINING ROWS: check every key component for a sentinel BEFORE
checking anything else. Every other class leaves a countable population; this one
destroys it.

### 6. The layer escape resolves to zero foreclosed rows

All 111 none-exists contract rows are foreclosed by the no-third-party CI gate
rather than absent from the world. Tracing each to its upstream: 45 are reachable
by cockpit-side verification, 22 through Smart Files/EDGAR, 19 have no publisher
in principle (self-authored), 22 are exported primitives, 3 were struck.

ROWS GENUINELY REQUIRING THE PUBLISHER AT THE UNION LAYER: ZERO.

So the gate never needs relaxing. Verify one layer down where the call is legal
and pass the VERDICT outward, not the claim. D-087 is the standing precedent and
`/securities/lookup` behind the service key is the template. Build against that
shape rather than inventing one.

## Derivation states, as refined during the pass

    available now            two independent sources | source vs our derivation
    available once <named dependency> lands
    internal consistency only  (one party can satisfy both sides)
    none exists, subdividing three ways:
        FORECLOSED     a publisher exists, a control forbids reaching it
        ABSENT         no witness at an obtainable price — the purchasing list
        SELF-AUTHORED  no external witness by construction, correctly
    DISCARDED AT THE MOMENT OF WRITING  (fifth kind)

The fifth kind: the distinguishing fact existed and the write destroyed it. No
purchase and no control change reaches it. Only a schema change going forward,
and every row already written stays ambiguous permanently.

Its diagnostic signature is the useful half: the question about it cannot be
answered by any query over the stored data. Where a defect makes its own
measurement impossible, that impossibility is a stronger statement than any
number. Record the unanswerable question rather than substituting an answerable
proxy.

## Instrument reliability — report both numbers

The AST instrument produced TWO DISTINCT FALSE POSITIVE CLASSES, both cleared
only by reading, neither reachable by any rule:

  1. IDENTITY-MAP LOOKUP. `db.get(AtomRow, pk)` matches `.get(key, default)` on
     arity and attribute name. 2 rows. Corrected 260 -> 258. Correction size
     0.4%, which is the useful measure of how far to trust the rest.
  2. DEFINITIONAL ZEROS. 14 rows in `signal/engine.py` are indicator internals.
     Wilder's RSI genuinely has no down-move to average when every bar rose;
     that zero is the mathematically correct value, not a stand-in.

GENERAL LESSON: a conditional returning zero is sometimes a substitution for an
unknown and sometimes a definition, and only domain knowledge distinguishes
them. An instrument can locate candidates; it cannot classify them. That is an
argument FOR the instrument and AGAINST trusting its output as a count.

KNOWN FALSE NEGATIVE, unsized: `getattr(x, "attr", default)` is a genuine
defaulting accessor the visitor never inspects, because it is a Call on a Name
rather than on an Attribute. One instance surfaced only because it also carried
an `or ''`. The under-reporting has NOT been sized.

Other shapes the instrument cannot distinguish, named rather than swept:
`environ.get(k, d)` (config default, not a claim default — 5 rows),
`queue.get(block, timeout)`, `cache.get(k, d)`.

## THE HANDOVER SET — 44 rows

    app/providers/futures_reference.py   15
    app/securities/resolver.py           13
    remainder (capture/misc)             16

Row detail: `t25pass.json`, `t25cockpit_final.json`, `t25cockpit_split.json`,
`t25scoring.json` in the cockpit worktree; `t25final.json` in smart-markets.
Regenerate with `t25scan.py`, `t25ratio.py`, `t25classify_cockpit.py` (cockpit)
and `t25walk.mjs`, `t25locate.mjs`, `t25classify.mjs` (smart-markets).

ALSO REMAINING, not started:
  - the 54 can-fabricate rows classified to derivation state (read, not classified)
  - the dead-guard diagnostic across the rest of the substrate
  - whether `seasonality` output reaches a registered claim
  - whether the IV surface path (`routers/market.py:597` under
    `@router.post("/vol/surface")`) guards its price inputs

## Rules established during this pass, for the next reader

WHEN A QUESTION FALLS INSIDE AN ENUMERATION YOU HOLD, QUERY THE ENUMERATION.
I held all 25 fabricating lines across five functions and answered an adjacent
question by following the one already in my head. The enumeration was built
because intuition is unreliable about exactly that class of question, and it was
right while I was wrong, in the same output.

COLLAPSES COMPOSE, and the states lost multiply rather than add. For any
substitution, trace what CONSUMES its output and ask what that consumer does
with the substituted value specifically. A fail-open feeding a derivation is the
shape.

COUNT THE ORIGINS CONVERGING ON A VALUE, not the producers capable of inventing
it. The second number is smaller and it is not the one that determines what the
stored population means.

A NARROW DISCRETE DOMAIN HAS NO MAGNITUDE TO INVENT. Three graders form `score`
from a boolean, so no upstream substitution can alter it. Immune by TYPE, not by
check. Boundary on the claim: a categorical score cannot be FABRICATED; it can
still be WRONG. Immunity to invention, not to error.

FOR ANY PROVIDER, ASK WHETHER IT IS THE AUTHORITY OR A RELAY. A relay always has
a second source in principle. An authority never does, and that is a permanent
state rather than a gap. Treasury and OpenFIGI are authorities (9 rows). FRED is
an AGGREGATOR — its series originate at BLS and BEA — so a genuine independent
witness exists upstream of it.

## Cost headline

Of 182 available-now cockpit rows:

    130  re-call sufficient        (one publisher queried twice; settles
                                    transient vs real, evidences no value)
      9  sole authority            (re-call is all that is POSSIBLE, not all
                                    that is needed)
     29  internal consistency      (bar validity predicate — a CONSTRUCTOR, not
                                    a second source)
     14  second provider required  (a genuine vendor question)

Down from 43 to 14 rows that are a real vendor ask, and 29 of the reduction came
from recognising that a check thought to need a second source needs a
constructor instead.


# ADDENDUM — closing rulings, 2026-08-20

## TW-74 landed

Merged as `205e7865`. The false green is closed: the gate now reports
`protected-no-required-checks` as its own state and says plainly that a red
check still merges. The abandoned branch carrying the `git add -A` sweep is
deleted.

It took FOUR attempts to land a one-predicate fix. That is the signal, and it is
recorded rather than smoothed over.

## VERIFY BY VIOLATING HAS AN ENVIRONMENT DIMENSION

Two of the four attempts failed because "it passes locally" was treated as
evidence about CI. The local tree is a full clone; CI's is depth-1. Two tests
had their verdict decided by that difference and neither assertion was about the
thing it named.

What settled it was BUILDING THE FAILING ENVIRONMENT: `git clone --depth 1`,
confirm `git log -1 --format=%cs` returns the wrong date there, copy the fix in,
run the suite in that state.

    Proving a suite can fail SOMEWHERE is not proving it fails WHERE IT RUNS.

Signature, narrow and greppable: a test calling a function that shells out to
git, the filesystem, or the network, and asserting on the result. Three of the
four evidence tests on this row had it.

Sits beside the other version from the same row: after correcting a defect,
reintroduce it and confirm a test fails — which tests the SUITE rather than the
fix. A suite that cannot fail on the reintroduced defect is not a suite for that
defect, whatever its coverage says.

## STARVATION BY ENVIRONMENT — a mechanism the category did not have

The gate's evidence-staleness check now returns `unverifiable` for every control
on every CI run, because CI is always shallow. Code correct, caller correct,
verdict truthful, control doing nothing.

Harder to see than a parameter no caller supplies, because there is NOTHING
WRONG TO FIND IN THE CODE. The precondition is simply never satisfied where it
actually runs.

    Ask whether the RUNTIME can supply the input, not only whether a caller does.

## EVERY INSTRUMENT GETS ONE PASS UNDER ITS OWN CRITERIA

Four defects in two days in the deploy gate, each a shape this programme
catalogued, appearing in the control built to catalogue them:

  - single-derivation attestation that would have read a lying oracle
  - an on-deploy trigger starved by the condition it detects
  - a false green conflating protection-present with checks-required
  - a staleness check unverifiable where it runs

And it is the THIRD instrument to do this. Two text-search passes gave wrong
structural answers. The AST rule produced two false-positive classes. Now the
gate.

The generalisation is not that the instrument is bad. It is that AN INSTRUMENT
BUILT QUICKLY TO MEASURE A DEFECT CLASS EXHIBITS THAT CLASS, RELIABLY — and the
only thing that caught any of the four was the author auditing their own tool
under the same rules applied to the subject. NOTHING EXTERNAL FOUND ANY OF THEM.

So: every instrument this programme produced gets one pass under its own
criteria before its output is trusted as a count. The gate has had four. The AST
instrument has had ONE, on the identity-map shape, and the other shapes of that
family (`environ.get`, `cache.get`, `queue.get`, and the `getattr` false
NEGATIVE) are UNAUDITED.

## WHAT SEVEN MERGES BOUGHT, STATED HONESTLY

    f691a71  TW-67  record kind split off the transform enum
    a346524  TW-69  second starved detector deleted, typed instead
    236c1be2 TW-68  deploy gate, two-party attestation, scheduled
    45bef4bb TW-70  the sixth state, self-reporting
    fe3a9106 TW-72  macro snapshot capture halted
    b03e6c2b TW-73  capture the reading, not the rendering, and cite it
    205e7865 TW-74  protection present is not checks required

Seven merged rows reads like progress on the product. It is not. THE TWIN STILL
SERVES ONE POPULATED LAYER OF FIVE and three still report `lookup-failed`.

What these bought is a substrate that REPORTS ITS OWN STATE HONESTLY rather than
one that works better. That is the correct thing to have bought at this stage
and it should be scoped and funded as that, not as product progress.

Drivers is the first item on the list that adds a layer rather than a guarantee.

## HANDED TO SYSTEMS, NOT PURSUED

A contradiction between two seats about `branch-guard.ps1`. This seat observed
an explicit fail-open (`catch { exit 0 }`, header: "Fails open on any parse
error") and a commit succeeding while a push refused seconds later. The systems
seat investigated the same discrepancy and closed it as a two-hook split.

Both can be true. But the systems finding on the unattributed force-delete of
135 refs rejected a fail-open as one of two candidate mechanisms. If the
fail-open is real, that conclusion is not necessarily wrong but the reasoning
that produced it is incomplete and was filed as complete.

Both readings with evidence are with the operator. NOT PURSUED FURTHER by this
seat: probing a guard to learn when it lets you through is bypass-hunting, and
it is systems' control.
