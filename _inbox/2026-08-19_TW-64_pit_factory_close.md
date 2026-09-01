---
title: TW-64 close — the point-in-time write factory
date: 2026-08-19
status: complete
plan_row: TW-64 (operator-ruled; Smart Markets is unregistered R&D, bounded PRs, no PLAN-ROW by design)
repo: empressa-trading
branch: tw64/pit-factory
pr: 348
merged: NO (open, awaiting planner verification)
last_updated: 2026-08-19
---

# TW-64 close — turning one provider's good behaviour into a factory

Branch `tw64/pit-factory` off `origin/main` at `569adaca`. One commit,
`40c7caa3`. PR https://github.com/empressaioemail-tech/empressa-trading/pull/348,
OPEN and MERGEABLE, not merged. Nothing deployed. Stored data untouched.

## What was built

TW-59 built the vintage registry and typed refusals; TW-62 added
`require_point_in_time_write`. Both are functions a provider chooses to call. A
third writer added tomorrow does not consult them, which is the gap this row
closes.

`app/spine/backstamp.py` is a `before_insert` mapper-event listener on
`AtomRow`, armed at model import beside the existing append-only guards. Every
atom the ORM persists passes through it, regardless of which function built it.
When `knowledge_time` is stamped at an earlier UTC day, the row must resolve to
a vintage declaration and must record which vintage it is in
`claim_value["revision"]`. Neither, and the insert raises and nothing is
persisted, because the listener fires inside the flush.

Against the four requirements:

1. **Cannot back-stamp without declaring.** The path that writes refuses.
   `BackstampNotDeclared` when `(provenance_source, claim_type)` resolves to no
   declaration.
2. **Every back-stamped fact carries its vintage.** `VintageNotRecorded` when
   `claim_value` carries no `revision` token, including when `claim_value` is a
   shape that cannot carry one. The one exemption, `derived_from_stored`, is
   named and argued below.
3. **A new writer is caught by default.** No declaration is the default state,
   and the refusal is loud. Generalises TW-62's `revision=latest` default.
4. **A standing CI guard.** `tests/test_backstamp_static_guard.py`, four
   detectors, each proven by removal.

Four honest bases, and deliberately no fifth meaning "the vendor restates in
place but we want the row anyway":

| basis | meaning | live instances |
|---|---|---|
| `vintage_query` | the source publishes an as-of dimension and the write asked for it | FRED via ALFRED |
| `immutable_record` | a dated, unrevisable artifact — the value then and now are the same object | EDGAR accessions, news headlines, symbol-era boundaries |
| `self_computed` | we produced it from point-in-time inputs at a named instant | backtest, signal/zone/prop marks, discipline replay |
| `derived_from_stored` | computed from atoms already in the store, each of which passed this boundary | the cross-source reconciliation atom |

`vintage_query` is **not** declared in the new registry. TW-59's
`VINTAGE_CAPABLE_SOURCES` already is that declaration, so `declaration_for`
defers to it rather than keeping a second list to drift. This is what keeps
TW-62's contract intact: registering a source with TW-59 is still the one way a
source earns the right to substantiate a back-stamped claim.

## Every writer that back-stamps, and its disposition

Enumerated by AST walk over `app/**/*.py` for every `AtomIn(...)` and
`AtomRow(...)` construction carrying a `knowledge_time`, then **each one read**.
Nineteen sites; six stamp plain capture time, thirteen do not. The brief was
right that there were more than expected: the two FMP backfill writers below
were not in any prior brief and are the same defect class TW-62 found.

| # | site | source / claim_type | back-stamps to | disposition |
|---|---|---|---|---|
| 1 | `spine/capture.py::capture_fred_observation` | `fred` / `macro.*` | observation date | **DECLARED** `vintage_query` (implied by TW-59). Already recorded its revision; unchanged. |
| 2 | `spine/capture.py::capture_earnings_scheduled` | `fmp` / `earnings.scheduled` | earnings date | **REFUSED, undeclared.** TW-62 refuses at the helper; the boundary refuses again. Forward and same-day writes unaffected. |
| 3 | `spine/capture.py::capture_earnings_actual` | `fmp` / `earnings.actual` | earnings date | **REFUSED, undeclared.** As above. |
| 4 | `spine/capture.py::capture_earnings_surprise` | `fmp` / `earnings.surprise` | earnings date | **REFUSED, undeclared.** As above. |
| 5 | `spine/capture.py::capture_news_item` | `finnhub` / `rss`, `news.item` | publication instant | **DECLARED** `immutable_record`; now records the token. |
| 6 | `spine/capture.py::capture_filing_atom` | `sec_edgar` / `filing.*` | acceptance instant | **DECLARED** `immutable_record`; now records the token. |
| 7 | `spine/capture.py::capture_calendar_event` | `fmp` / `macro.event` | event date | **FIXED — no longer back-stamps.** See below. |
| 8 | `jobs/base_library_backfill.py::_write_statement_atoms` | `fmp` / `fundamental.*` | fiscal period end | **FIXED — no longer back-stamps.** See below. NEW DEFECT. |
| 9 | `jobs/base_library_backfill.py::_write_profile_atom` | `fmp` / `profile.company` | IPO date | **FIXED — no longer back-stamps.** See below. NEW DEFECT. |
| 10 | `jobs/base_library_backfill.py::_append_backfill_atom` | passthrough | caller-supplied | Enumerated as a passthrough. Both callers now pass capture time; FMP stays undeclared, so a future caller re-introducing a past stamp is refused. |
| 11 | `routers/backtest.py::_write_summary_atom` | `backtest` / `backtest.summary` | `window_end` | **DECLARED** `self_computed`; records the token. Invariant B already required `as_of` and forbade lookahead. |
| 12 | `spine/outcomes.py::write_entry_claim` | `backtest`, `bot_runner`, `empressa_signal`, `empressa_zone`, `empressa_prop`, `empressa_features`, `empressa_composition` / various | entry bar timestamp | **DECLARED** `self_computed` per source; token stamped centrally, after the `extra` merge so a caller cannot override it. |
| 13 | `counterfactual/engine.py::compute_discipline_delta` | `counterfactual` / `counterfactual.discipline` | replay window end | **DECLARED** `self_computed`; records the token. |
| 14 | `securities/resolver.py::_write_alias_atom` | `vendor` / `manual`, `identity.symbol` | corp-action ex_date; inherited era start | **DECLARED** `immutable_record`. Token added **only** on the back-stamped path so the ordinary alias atom keeps its exact stored shape. |
| 15 | `spine/conflict.py::_write_reconciliation_atom` | `spine` / template claim_type | newest member's knowledge_time | **DECLARED** `derived_from_stored`, exempt from carrying its own token. |
| 16 | `spine/store.py::append_atom` | passthrough | caller-supplied | The funnel itself; the site the listener guards. |
| 17 | `crypto/holdings.py::_write_holding_atom` | — | now | Not back-stamped. |
| 18 | `jobs/equity_deep_daily_backfill.py::_append_ledger_atom` | — | now | Not back-stamped. |
| 19 | `jobs/tw61_fred_supersede.py::build_supersession_atom` | — | now (`None`) | Not back-stamped, deliberately — that is TW-61's correction. |

Also confirmed **not** back-stamping in production, contrary to what the test
suite's fixtures suggested: `resolver._write_event_atom` (`corp_action.split`
and siblings) omits `knowledge_time` entirely, so the store stamps now; and
`price_target` has no atom writer at all in `app/` — the conflict tests invent
it as a fixture claim type. Both were checked by reading the source, not by
matching the grep that surfaced them.

### The two new defects

`_write_statement_atoms` stamped `knowledge_time` at the **fiscal period end**
while carrying FMP's current copy of the statement. Two independent reasons
that is wrong: FMP restates fundamentals in place (amended filings,
reclassified segments, vendor re-keying), and even a first-release statement is
not knowable at the period end, since a quarter ending 2023-12-31 is not
published until the filing lands weeks later. FMP publishes no as-of dimension
for fundamentals, so there is nothing honest to ask for.

`_write_profile_atom` stamped at the **IPO date** — asserting we held today's
sector, industry, market cap and description on the day the company listed.

Both now stamp capture time. `valid_from` still carries the period end and the
IPO date, so the true-in-world coordinate is unchanged and no data is lost; the
claim becomes "as of today, FMP says FY2021 was X", which is true. This is the
same shape TW-61 chose for its supersession atoms. `capture_calendar_event` was
de-back-stamped for the same reason: FMP revises the calendar's estimate and
prior figures in place after the print. In practice the calendar hook only
fetches a forward window, which `_knowledge_time_for` already clamped to now, so
this changes only past-dated rows — the hindsight ones.

### The one exemption inside the boundary

`derived_from_stored` does not require the row to carry its own vintage token.
The reconciliation atom must preserve the value **shape** of the sources it
reconciles, and `resolved_value` can be a bare scalar, so there is no honest
place to put a token without corrupting readers. Its vintage is its members',
held transitively — every member passed this boundary on its own way in — and
its members are already recorded in `citation_ref` for audit. This is stated in
the module and asserted in the tests rather than left implicit.

## The enforcement mechanism

Two halves, deliberately.

**Runtime.** `before_insert` on `AtomRow` in `app/spine/backstamp.py`, armed at
`app/models.py` import. Catches any executed write path, including one nobody
audited. `check_backstamp` is pure and separately callable, so the rule can be
exercised without a database.

**Static.** `tests/test_backstamp_static_guard.py`, four detectors over
`app/**/*.py`, each proven by removal:

1. `scan_undeclared_backstamp_sites` — every atom construction whose
   `knowledge_time` is not one of six recognised capture-time expressions must
   be an enumerated site with a written disposition. The default is suspicion,
   so an unrecognised expression counts as a possible back-stamp. The
   recognised-expressions list is itself pinned by a test, so widening it is a
   visible, argued diff.
2. `scan_boundary_disarmed` — the listener must be registered in
   `backstamp.py`, armed at module scope, and reached by `app/models.py`.
3. `scan_unsanctioned_atomrow_construction` — `AtomRow` may only be built in
   `spine/store.py` and `spine/conflict.py`.
4. `scan_seed_exemption_in_app` — the test-only seed exemption may not be named
   anywhere under `app/`. Textual, not AST, so an import, an attribute access, a
   `getattr` string and a re-export all trip it.

The walk reads `utf-8-sig` and **fails** on a file it cannot parse rather than
skipping it. `app/registry/p3f_crypto_ab.py` carries a UTF-8 BOM and broke a
plain `utf-8` read during this work; a silently skipped file is exactly where a
bypass would hide.

The static half exists because the runtime half only fires on a path something
executes. A backfill job added tomorrow and run once by hand would hit the
boundary in production, after the operator started the run. The walk moves that
to the pull request.

## The seed exemption, and why it is not a hole

Making the boundary real broke 49 existing tests. Investigating each showed
seven were a real missing declaration — `("manual", "identity.symbol")`, whose
one production caller is the Section-4 legacy backfill binding a historical
symbol era — and 42 were fixtures that can only do their job by constructing
the state the boundary prevents. TW-61 must be handed a contaminated
back-stamped FRED row before it can be shown correcting one; the bitemporal
store tests must seed an old `knowledge_time` before an as-of read can find it.
Deleting them would trade real coverage for a guard that looks tidier.

So `allow_backstamp_seed()` is a contextvar-scoped context manager mirroring
`immutability.allow_atom_backfill()`, reached only through a **per-test** pytest
marker (`@pytest.mark.backstamp_seed`, applied to exactly those 42), never a
blanket disable. An unmarked test that back-stamps still fails. Detector 4 makes
it unreachable from application code by a control rather than an agreement, and
it relaxes the insert listener only — `check_backstamp` keeps answering the real
question inside the exemption.

## A defect this work introduced and fixed

A boundary refusal raises during the **flush**, which leaves the SQLAlchemy
Session in `pending-rollback`. `persist_capture_atom` swallowed the exception
but did not roll back, so one refused row killed every later write in the same
capture batch with `PendingRollbackError`. It now rolls back on failure. This
was pre-existing for any flush-time failure; the boundary is simply the first
thing that raises there routinely.

## TW-62's removal proof, amended

`test_removing_the_earnings_guard_admits_the_contaminated_row` asserted that
neutralising `require_point_in_time_write` admits the contaminated row. That is
no longer true, which is the point of this row. Rather than weaken it, the proof
now runs in three stages: intact refuses; **TW-62's guard alone removed still
refuses, and the refusal is named as the boundary's**; both removed admits the
row. Strictly stronger, and it documents the defence in depth instead of leaving
a proof that silently became vacuous. No TW-59 or TW-62 public contract changed;
everything added is additive.

## Tests

`tests/test_backstamp_boundary.py` (24) and
`tests/test_backstamp_static_guard.py` (23), 47 new tests. Every refusal test
asserts the **store is empty afterwards**, not merely that an exception fired.

Seven proofs by removal, each restoring byte-identically and re-asserting the
restoration:

1. disarm the `before_insert` listener → the contaminated row lands; re-arm → refuses again
2. delete EDGAR's declaration → a previously-good write refuses
3. declare `vintage_query` for a source not in `VINTAGE_CAPABLE_SOURCES` → refused rather than admitted on the declaration's word
4. clear `DECLARED_BACKSTAMP_SITES` → detector 1 fires on the real writers (an inert detector and a clean tree look identical)
5. clear `SANCTIONED_ATOMROW_MODULES` → detector 3 fires
6. copy the tree, delete the arming line from the copy → detector 2 reports the disarm
7. un-exempt `backstamp.py` itself → detector 4 fires

Plus, outside the suite, a deliberate bypass introduced into the real tree and
removed again — raw output below.

## Raw output

### Pre-change baseline, CI command, `origin/main` at 569adaca

```
$ cd apps/cockpit/backend && python -m pytest -q
4813 passed, 2 skipped, 21 deselected, 38923 warnings in 643.01s (0:10:43)
```

### Post-change, same CI command, branch tw64/pit-factory

```
$ cd apps/cockpit/backend && python -m pytest -q
4860 passed, 2 skipped, 21 deselected, 38960 warnings in 463.59s (0:07:43)
```

Zero failures both sides; +47 tests, matching the 47 added. That is the merge
standard met.

### The CI guard fails on a deliberate bypass — new undeclared writer

`app/jobs/_tw64_bypass_probe.py` added, back-stamping `knowledge_time` to
2021-03-10 from an undeclared source:

```
########## A. CI GUARD WITH THE BYPASS PRESENT ##########
E       AssertionError: an atom is constructed with a knowledge_time this walk cannot see as capture time, at a site nobody enumerated:
E           file='jobs/_tw64_bypass_probe.py', function='build', line=12, knowledge_time='datetime(2021, 3, 10, tzinfo=timezone.utc)', kind='undeclared-backstamp-site'
E
E         Read the site. If it stamps NOW, use one of ['None', '_now()', '_utcnow()', 'datetime.now(timezone.utc)', 'datetime.now(tz=timezone.utc)', 'now']. If it BACK-STAMPS, add it to DECLARED_BACKSTAMP_SITES with its disposition AND make sure app/spine/backstamp.py either declares the source or refuses it.

tests\test_backstamp_static_guard.py:360: AssertionError
=========================== short test summary info ===========================
FAILED tests/test_backstamp_static_guard.py::test_no_undeclared_backstamp_sites
1 failed, 22 passed in 4.95s
```

### The CI guard fails on a second deliberate bypass — boundary disarmed

`register_backstamp_listener()` deleted from `app/spine/backstamp.py`:

```
########## B. SECOND BYPASS: DISARM THE LISTENER ##########
arming call removed from app/spine/backstamp.py
=========================== short test summary info ===========================
FAILED tests/test_backstamp_static_guard.py::test_no_undeclared_backstamp_sites
FAILED tests/test_backstamp_static_guard.py::test_boundary_is_armed - Assertio...
FAILED tests/test_backstamp_static_guard.py::test_removal_proof_detector_two_fires_when_the_boundary_is_taken_out
3 failed, 20 passed in 4.91s
```

The third failure is the removal proof refusing to be vacuous: it asserts the
arming call exists before trying to delete it from its scratch copy.

### Both bypasses removed, byte-identical restoration

```
########## C. BOTH BYPASSES REMOVED ##########
restored app/spine/backstamp.py, sha256: 9612d28a48a77f02
...............................................                          [100%]
47 passed in 9.38s

########## D. TREE IS BYTE-IDENTICAL (no probe, no leftover backup) ##########
(git status shows only the intended TW-64 files; no probe, no .tw64bak)
```

## The related finding: CONFIRMED

`app/spine/immutability.py` enforces append-only with a `do_orm_execute`
**Session** event and a `before_update` **mapper** event. An alembic migration
runs on a raw `Connection` outside any Session, so neither fires.

Confirmed empirically, not by reading. Seeded one atom through
`store.append_atom`, then attempted two mutations of the same row:

```
seeded atom: e4b155373d384cd6b46b2b387da5b662
A) ORM Session UPDATE: BLOCKED -> AtomMutationError
B) RAW Connection UPDATE: SUCCEEDED  <-- NOT guarded
   stored claim_value_json now: {"v": 666}
C) RAW Connection INSERT of an UNDECLARED back-stamped atom landed: True
```

Line B is the finding: a raw `Connection` UPDATE silently rewrote
`claim_value_json` from `{"v": 1}` to `{"v": 666}` on a row the ORM path
refuses to touch. **So append-only is an APPLICATION-layer guarantee, not a
database-layer one.** A migration issuing `UPDATE atoms SET claim_value_json`
would succeed, and would also silently alter the anchored Merkle leaf's input
without the leaf changing, so the tamper-evidence claim degrades to "no
application code did this".

Line C is the same limitation in the boundary this row built, and it is stated
in that module's own docstring rather than left for someone to discover: a raw
`Connection` INSERT of an undeclared back-stamped atom lands. The static guard
covers the source tree, which is why both halves exist, but neither covers the
database.

Not fixed here, per the brief. It is a separate row and probably a database
constraint or trigger — a `BEFORE UPDATE` / `BEFORE DELETE` trigger on `atoms`
and `edges` with a session-variable escape for the one legitimate backfill would
close it at the layer that actually holds. The probe script is not committed.

## What I could not do

- **Nothing was deployed.** No docker, gcloud, ssh, scp or deploy script was
  run, per the hard rules. Live soak with an A/B experiment.
- **The PR is not merged.** Open at 348, MERGEABLE, awaiting planner
  verification. CI is green on the exact commit — conclusion string `"success"`,
  not an exit code, on `40c7caa3`:

```
$ gh run view 32271555935 --json status,conclusion,headSha,jobs
{"conclusion":"success",
 "jobs":[{"conclusion":"success","name":"Frontend tests (cockpit vitest)"},
         {"conclusion":"success","name":"Python tests (cockpit backend)"},
         {"conclusion":"success","name":"Frontend build (cockpit web)"},
         {"conclusion":"success","name":"Gitleaks security scan"},
         {"conclusion":"skipped","name":"Windows .exe (release tags only)"}],
 "sha":"40c7caa3647351158067d82bfa88ba5066534577","status":"completed"}
```
- **Stored data untouched**, per the brief. The 1,521 back-stamped FRED atoms
  and any back-stamped FMP fundamentals or profiles already in production are
  still there. Note that the FMP fundamental and profile rows have the same
  identification problem the FRED rows have: nothing on them records which
  revision they were. They are also protected by the same dedup key TW-62
  documented, so a corrected re-run is a silent no-op, not a repair.
- **`store.append_atom` is unchanged**, per the brief's instruction to propose
  and stop. See the proposal below.

## Proposals for the planner

**1. A queryable `revision` column on `atoms`.** The brief's own reasoning for
requirement 2 is that "had `revision` been mandatory from the start, the cleanup
would have been a WHERE clause". Today the vintage lives in
`claim_value["revision"]`, which is the TW-59/TW-62 precedent and has the real
advantage of riding inside the anchored Merkle leaf — but it is a JSON blob, so
the cleanup is a scan, not a filter. A nullable `revision` column, populated in
`append_atom`'s row construction and indexed, makes it a filter. That requires a
migration **and** a change to `store.append_atom`'s append path, so it is
proposed here rather than taken.

**2. Close the database-layer gap.** Per the finding above. Its scope is both
guards, not just this one.

**3. `Revision.as_of` loses its date.** A row recorded as `as_of` stores the
bare token, not which vintage date was asked for, so two different vintages of
the same observation are indistinguishable on the row. Nothing writes `as_of`
today, so it is latent rather than live. Worth fixing before something does.

**4. FMP fundamentals have no honest historical path.** The fix here makes the
records honest but flattens their `knowledge_time` to capture time, so as-of
reads of fundamentals are now only as deep as when the backfill ran. If
point-in-time fundamentals matter to grading, that needs a source with an
as-of dimension, not a change to this boundary.
