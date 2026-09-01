---
title: TW-62 close — FMP earnings hindsight leg repaired
date: 2026-08-19
status: complete
plan_row: TW-62
program: Smart Markets (unregistered R&D, bounded PR)
repo: empressa-trading
branch: tw62/earnings-hindsight
pr: 346
last_updated: 2026-08-19
---

# TW-62 — FMP earnings hindsight leg

CANON-PREAMBLE v0f465c77 / AGENT-CONTRACT v7b714e95. Operator-ruled row TW-62,
2026-08-19. Planner owns the fan and verifies.

## Where it landed

Branch `tw62/earnings-hindsight`, commit `6e40299e`, cut from `origin/main` at
`3aad1cbb`. PR https://github.com/empressaioemail-tech/empressa-trading/pull/346,
OPEN and MERGEABLE. **Not merged. Not deployed.** Worktree at
`P:/empressa-trading-worktrees/tw62-earnings`; `P:/Empressa Trading` was never
checked out.

## The defect

`_backfill_earnings_for_symbol` in `app/jobs/base_library_backfill.py` and the
earnings branch of `app/jobs/phase2_backfill.py` walked a years-deep past window,
fetched from FMP at run time, and back-stamped `earnings.scheduled`,
`earnings.actual` and `earnings.surprise` to each historical date through
`_knowledge_time_for`. FMP restates in place. It re-consensuses estimates and
re-keys reported figures after the print, and its calendar carries no as-of
dimension. So a row pulled today for a quarter two years ago is today's edit of
that quarter, and the stored atom asserted we held it then.

`earnings.surprise` is why this is worse than the FRED leg beside it. It is not
context. It is a claim-versus-outcome record assembled from two independently
restatable numbers, the estimate and the actual. Back-stamped, it grades a
forecast against an answer that was edited afterwards, and the beat/miss can
differ from what was actually knowable that day. It is a grading primitive by
shape whether or not anything grades on it yet.

## Blast radius, established before any code changed

The earnings path writes exactly three claim types. All are `family=event`, all
back-stamp `knowledge_time` via `_knowledge_time_for`, and all three therefore
carried the defect: `earnings.scheduled`, `earnings.actual`, `earnings.surprise`.

**No grader reads them. `earnings.surprise` does not feed any grader today.**
Grading in this system runs through `app/spine/outcomes.py`, which keys every
`AtomOutcomeRow` to an entry claim: `trade.entry`, `backtest.entry`,
`composition.zone_regime`, `zone.*`, `signal.*`, `regime.*`. No outcome is ever
recorded against an earnings claim type. This is the same posture TW-59 found for
macro, and it is the reason this is a contamination-of-record finding rather than
a live grading incident. It is also fragile: the atom store is the training
substrate, and a surprise atom is shaped exactly like a grader input.

The only atom-store consumer of `earnings.*` is `app/spine/atom_context.py`, which
lists them as chip-worthy cited-prose context for the AI surfaces (co-pilot, brief,
position review) and gives them top ordering priority alongside filings.
`app/routers/market.py` reads FMP live for its display endpoints and does not read
the store.

Every `earn` hit in `app/zones/grade.py`, `app/adaptive_panel.py` and
`app/signal/regime_record.py` was opened and read, not matched. All are substring
false positives: "earned" in the zone earned-population docs, "learn"/"learned" in
the regime record, `price_earnings` (a P/E metric) and crypto staking earnings in
`adaptive_panel.py`. Same trap the planner flagged from the `adaptive_panel.py`
"degrades" false positive.

`app/providers/expected_move.py::_earnings_beat_history` computes the identical
hindsight surprise and a beat-rate over three years of history, but it fetches
live at request time and persists nothing. That is a live display board, which
TW-59's own module docstring names as the legitimate use of `Revision.latest`. It
is reported here and deliberately untouched.

**Affected rows ARE identifiable after the fact — unlike the FRED ones.** Two
discriminators exist in the record. `provenance_method` separates the backfill
writers (`backfill`, the shared `BACKFILL_PROVENANCE` constant used by both jobs)
from the live hook (`calendar`). And `captured_at` minus `valid_from` separates a
row back-stamped years after the fact from one captured at or near the print. The
FRED rows had neither discriminator.

**The dedup-key trap DOES apply.** The key is
`capture:earnings|earnings_actual|earnings_surprise:SYMBOL:DATE`, and
`persist_capture_atom` returns `None` when `_already_captured` finds it. A
corrected re-run over a contaminated row therefore writes nothing and reports
success. This is proven by test (`test_a_corrected_rerun_is_a_silent_no_op`) and
is the reason quarantine is an operator ruling rather than a re-run.

## Adjacent defect found on the same path, and fixed

`GET /market/{symbol}/earnings` fetches the whole vendor calendar — three years
back, four months forward, every issuer reporting in that window — and then fires
`capture_earnings_for_symbol(sym, rows)` on the **unfiltered** rows, on every
request. `capture_earnings_for_symbol` wrote every one of those rows onto the
requested symbol's node regardless of whose row it was, and the dedup key
(symbol + date) then let whichever issuer happened to appear first for a given
date own that date's atom for that symbol. That contaminated the value, not only
its timestamp. The same function also carried
`eps_est=row.get("epsEstimated") or row.get("eps")`, which substitutes a reported
ACTUAL into the ESTIMATE field when no estimate is present.

Both are fixed here: rows are filtered to the symbol, the substitution fallback is
removed, and the per-row refusal is caught so forward rows still land. Flagging it
plainly because it widens the row: the honest alternative was to install the
refusal and leave a known value-corruption bug on the exact function being edited,
silently narrowed. The planner may split it into its own row; the test that proves
it is self-contained
(`test_live_calendar_hook_skips_back_stamped_rows_and_foreign_symbols`).

## The fix

It extends TW-59's mechanism rather than building beside it.

`app/providers/point_in_time.py` gains **one additive function** and nothing else.
`require_point_in_time_write` is the write-side companion to
`require_vintage_support`. The caller decides whether a write is back-stamped,
because only the capture layer knows how it derives `knowledge_time`; this function
decides whether the source may make such a claim at all. Two ways to fail, both
`HindsightWriteRefused`: the caller named a hindsight revision (the FRED-shaped
case TW-59 already guards), or the source is absent from `VINTAGE_CAPABLE_SOURCES`
— where `fmp` already sat, registered as not vintage-capable by TW-59. `revision`
defaults to `Revision.latest`, so a call site that has not thought about revisions
refuses rather than silently writing hindsight. **No existing signature, constant
or exception was modified; TW-59's callers are untouched.**

`app/spine/capture.py` gains `is_backstamped_observation`, which reads straight off
`_knowledge_time_for`. A future observation date is clamped to now and a same-day
date is stamped at capture time, so neither asserts anything about the past; a
strictly earlier date does. The three earnings helpers invoke the guard on that
predicate only. The result is that the forward anticipatory atom this path exists
to write still writes, a same-day print still writes, and the whole historical
window refuses. Each helper now takes `source` and `revision`, records the revision
on the row (TW-59's self-describing precedent), and has no fallback branch.

Callers catch the refusal **per row** and **count** it, so a run reports the
history it declined to invent instead of silently writing less.
`_backfill_earnings_for_symbol` returns `hindsight_refused` plus up to three
reasons; `run_event_backfill` accumulates both into its earnings stats.
`phase2_backfill` carries `hindsight_refused` and `hindsight_refusal_reasons`
through its stats, and now also carries its running counters into the vendor-cap
resume cursor — which previously dropped an entire slice's counts on resume, a
pre-existing bug on the same block.

## The diff

```
 apps/cockpit/backend/app/jobs/base_library_backfill.py  |  90 ++++-
 apps/cockpit/backend/app/jobs/phase2_backfill.py        | 111 ++++--
 apps/cockpit/backend/app/providers/point_in_time.py     |  45 +++
 apps/cockpit/backend/app/spine/capture.py               | 107 ++++-
 apps/cockpit/backend/app/spine/capture_hooks.py         |  50 ++-
 apps/cockpit/backend/tests/test_base_library_backfill.py|  32 +-
 apps/cockpit/backend/tests/test_earnings_point_in_time.py| 443 +++++++++++++++
 apps/cockpit/backend/tests/test_spine_atom_serve.py     |   5 +-
 apps/cockpit/backend/tests/test_temporal_capture.py     |  35 +-
 9 files changed, 829 insertions(+), 89 deletions(-)
```

Three pre-existing tests changed. `test_spine_atom_serve.py` moved one fixture
earnings date forward. `test_base_library_backfill.py` gained a forward row and now
asserts the refusal accounting. And `test_temporal_capture.py` held
`test_earnings_scheduled_historical_knowledge_time_is_real_world_date`, which
asserted that a past-dated FMP earnings write succeeds with `knowledge_time`
back-stamped — it **certified the defect**. It now asserts the refusal, and the
bitemporal §6-B rule it was protecting is re-proven in the new file against a
vintage-capable source, where it is actually true.

## Test output, raw

Pre-change baseline on this branch, CI command `python -m pytest -q` from
`apps/cockpit/backend`:

```
4779 passed, 2 skipped, 21 deselected, 38958 warnings in 450.18s (0:07:30)
```

Post-change, same command:

```
4792 passed, 2 skipped, 21 deselected, 38935 warnings in 578.70s (0:09:38)
```

Delta is +13, exactly the thirteen tests in the new file. Zero failures either
side; CI baseline of zero failures is held.

Guard proven by removal at file level — the block deleted from
`capture_earnings_surprise`, the tests run, then restored and re-verified:

```
--- SHA BEFORE ---
7c0134adda8127707c1d9a3f1f187cec22386cc3ff659030aaf49a1fc6889926 *app/spine/capture.py
GUARD REMOVED
--- TEST WITH GUARD REMOVED ---
E       Failed: DID NOT RAISE HindsightWriteRefused
E       Failed: DID NOT RAISE HindsightWriteRefused
=========================== short test summary info ===========================
FAILED tests/test_earnings_point_in_time.py::test_backstamped_earnings_surprise_refuses_and_stores_nothing
FAILED tests/test_earnings_point_in_time.py::test_removing_the_earnings_guard_admits_the_contaminated_row
2 failed, 11 deselected in 0.91s
--- SHA AFTER RESTORE ---
7c0134adda8127707c1d9a3f1f187cec22386cc3ff659030aaf49a1fc6889926 *app/spine/capture.py
--- TESTS RESTORED ---
13 passed, 8 warnings in 2.69s
```

The same removal is held permanently in-suite by
`test_removing_the_earnings_guard_admits_the_contaminated_row`, which neutralises
the refusal, shows the contaminated row is admitted back-stamped, restores, and
shows it refuses again.

CI on the PR head `6e40299e`, conclusion string checked rather than an exit code:

```
CI sha=6e40299e status=completed conclusion=success

Frontend build (cockpit web)      pass  57s
Frontend tests (cockpit vitest)   pass  32s
Gitleaks security scan            pass  9s
Python tests (cockpit backend)    pass  7m22s
Windows .exe (release tags only)  skipping
```

The store-is-empty assertion is on every refusal test — `_earnings_atoms(db) == []`
after the raise, not merely that the raise fired.

## What I could not do

**Stored data was not touched, by instruction.** Existing back-stamped earnings
rows remain. They are identifiable (see blast radius), but a corrected re-run
cannot heal them because of the dedup key, so quarantine is an operator ruling
with a backup gate. TW-61's FRED equivalent is the precedent and its shape should
carry over. The one thing this row adds to that ruling: earnings quarantine can be
scoped by `provenance_method` and the `captured_at` / `valid_from` gap, so it need
not be all-or-nothing the way the FRED case was.

**Not deployed, and no deploy attempted.** Live paper-trading soak with an A/B
experiment; a restart kills running jobs and both arms.

**Not merged.** PR 346 is open for the planner.

## Scoped as its own row, not built here

An originally-reported earnings figure IS obtainable from a vintage-capable
authority. SEC filings are immutable and keyed by accession number and acceptance
instant, and TW-59 established that `/Archives` reads through `providers/edgar.py`
are point-in-time correct by construction. What it would take: an ingestion that
parses EPS and revenue out of the 8-K earnings release and the 10-Q as filed, keys
the atom to the accession rather than to a calendar date, passes
`source="sec_filing"` and `revision=Revision.first_release` into the capture
helpers — which already accept both — and registers that source in
`VINTAGE_CAPABLE_SOURCES`. The capture layer is ready for it; only the ingestion
and the registration are missing.

`sec_filing` was **deliberately not registered** in this row. Registering a
capability nothing implements would let a caller pass `source="sec_filing"` with an
FMP value and walk straight through the guard. That is the fifth "control that
isn't wired" shape and it is not being added here.

Note also that the SEC XBRL Frames API is NOT the route: TW-59 recorded that Frames
returns the fact "that is last filed" by documented design, i.e. the restated
figure, with no vintage dimension. Point-in-time SEC data comes from the filing
itself.
