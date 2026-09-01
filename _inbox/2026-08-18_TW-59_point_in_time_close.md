---
title: TW-59 close — point-in-time reads, no-hindsight invariant repaired
status: active
last_updated: 2026-08-18
owner: planner
plan_row: TW-59
repo: empressa-trading
---

# TW-59 close — point-in-time macro reads

Row: TW-59 (Smart Markets, unregistered R&D, bounded PR, operator-ruled 2026-08-18).
Repo: `P:/Empressa Trading`, backend `apps/cockpit/backend`.
Worktree: `P:/empressa-trading-worktrees/tw59-pit` (created from `origin/main` @ `e4122fef`; no checkout ever performed in `P:/Empressa Trading`).

Branch: `tw59/point-in-time`
Commit: `8670b3ce`
PR: **#344** — https://github.com/empressaioemail-tech/empressa-trading/pull/344 — OPEN, NOT MERGED, NOT DEPLOYED.

## 1. The defect, confirmed at source

**FRED.** Confirmed on the worktree cut from `origin/main`:

```
$ grep -rnE "realtime_start|realtime_end" app/
exit=1
```

Zero hits, and zero across the whole repo including docs and JSON. FRED documents `realtime_start` and `realtime_end` as defaulting to today's date. Called without them the API returns the CURRENT REVISED value of a series, not the value knowable on the observation date. GDP, CPI, payrolls and the monetary aggregates are revised substantially and repeatedly, so this is the ordinary behaviour and not a corner case.

The backend has **four independent FRED HTTP call paths**, not one. The planner's brief named only the first.

| path | endpoint | subject | writes to the record |
| --- | --- | --- | --- |
| `app/providers/fred.py` (`latest`, `series`, `observations`) | `stlouisfed.org/fred/series/observations` | live + historical | **YES** via `jobs/phase2_backfill` |
| `app/providers/econ_board.py::fetch_raw` (~80 catalog series) | same | historical | no — display board |
| `app/tx100/data.py::fetch_fred_monthly` | same | historical | no — index study |
| `app/marketdata/macro_sources.py::_fred_obs` (DXY, VIX) | same | live | no — charts and paper fills |

**SEC XBRL Frames.** Established before changing anything: **this repo does not call Frames.** Repo-wide search for `api/xbrl`, `xbrl/frames`, `companyconcept`, `companyfacts` returns nothing. `app/providers/edgar.py` reaches `data.sec.gov` only at `/submissions/CIK{n}.json`, plus `sec.gov/Archives/edgar/data/...` for filing documents. Both are keyed to an accession number and an acceptance instant and are immutable once SEC accepts the filing, so that leg is point-in-time correct by construction — `capture_filing_atom` stamps `valid_from` from `filed_at`, which is the true knowledge instant. Frames' documented "last filed" behaviour is recorded in the new module's non-vintage registry so nobody wires it in later without hitting the refusal.

## 2. Blast radius — this is contamination of the RECORD

Stating it plainly, as instructed: **the graded record is contaminated on the macro leg.**

The mechanism, traced end to end:

1. `app/jobs/phase2_backfill.py` (pre-fix, line ~489) loops `_FRED_MACRO_SERIES` — `DGS10` / `macro.rate.10y`, `CPIAUCSL` / `macro.cpi`, `UNRATE` / `macro.unemployment`, `VIXCLS` / `macro.vix`, `DTWEXBGS` / `macro.dxy`.
2. For each it calls `fred.observations(series_id, key, start, end, 500)` where `end = today` and `start = today - 365*years`. With no real-time window that returns **today's revisions** across the whole two-year window.
3. Each row goes to `capture.capture_fred_observation(...)`, which sets `valid_from = observation_date` and `knowledge_time = _knowledge_time_for(valid_from)`. That helper returns `valid_from` unchanged for any past date.

So the stored atom asserts **we knew, on date D, a value that did not exist until a later revision**. That is the no-hindsight invariant broken inside the record, not at the display layer.

### Two corrections to the planner's starting hypothesis

- **`app/adaptive_panel.py` is a false positive.** Its only grading-vocabulary match is the word `degrades` in a line-16 docstring. `grep -nE "capture|persist|append_outcome|AtomIn"` returns nothing. It is pure display and touches no claim.
- **No graded outcome path reads `macro.*` atoms today.** The claim types `macro.rate.10y`, `macro.cpi`, `macro.unemployment`, `macro.vix`, `macro.dxy` have exactly one consumer outside the writer: `app/spine/atom_context.py`, which selects `claim_type LIKE 'macro.%'` on node `sec_platform_macro` and injects them as citable `{{atom:...}}` chips into AI prose. `app/composition/grade.py` observes `zone.r` outcomes and never touches macro.

So the honest characterisation is narrower than "graded against a revised value" and worse than display-only: **contaminated atoms are in the immutable record and are served as cited evidence in AI output; they do not currently feed an outcome computation.** If any future grader reaches for macro state — which is the obvious next use of a `sec_platform_macro` node — it grades against hindsight the moment it does.

### Can affected rows be identified?

**No — this is unknowable from the record, and that is itself a finding.**

- Pre-fix atoms carry no revision marker. `claim_value` was `{series_id, date, value}` only.
- Every stored value is plausible; a revised UNRATE print looks exactly like an original one.
- `provenance_method` is `backfill` for both the contaminated path and legitimate backfills of non-revisable data, so it does not separate them.
- Worse for remediation: `_dedup_key` is `capture:fred:{series_id}:{date}` and `persist_capture_atom` returns `None` when the key exists. **A corrected re-run would silently write nothing.** The contaminated rows cannot be superseded by re-running the job.

The bounding facts that are knowable: only the five series above, only through `jobs/phase2_backfill`, only on node `sec_platform_macro`, window `today - 365*years` to `today` at each run. `VIXCLS` and `DTWEXBGS` are not materially revised; `CPIAUCSL` and `UNRATE` are the real exposure, `DGS10` is a non-revised daily.

### Same-class defect found, deliberately NOT fixed here

`_backfill_earnings_for_symbol` (`app/jobs/base_library_backfill.py`) and the earnings branch of `phase2_backfill` fetch `fmp.fetch_company_earnings` **today** and write `earnings.scheduled`, `earnings.actual` and `earnings.surprise` atoms back-stamped to historical earnings dates. FMP restates and re-consensuses in place: a past-quarter `eps_est` is the current consensus record, not the estimate as it stood before the print. `earnings.surprise` is literally an estimate-versus-actual claim — the platform's own claim-versus-outcome shape — built from two hindsight numbers. This is the XBRL-Frames class of defect, on a wider surface than the macro leg, and it needs its own row. `fmp` is registered as non-vintage-capable in the new module so the refusal is already available to it.

## 3. The fix

Point-in-time is the default; hindsight is an exception that must be named at the call site.

**New: `app/providers/point_in_time.py`.** The single place that defines what "as known on date D" means per source and the single place that refuses when a source cannot answer.

- `Revision` enum — `first_release` (value as originally published, the no-hindsight read), `as_of` (the series as it stood on one named date), `latest` (current revised value; hindsight).
- `fred_realtime_params(revision, as_of=)` — the parameter builder, deliberately isolated so a test can prove by removal that these parameters are load-bearing. `first_release` sends `realtime_start=1776-07-04`, `realtime_end=9999-12-31`, `output_type=4` (FRED: "Observations, Initial Release Only"; `output_type` is ignored unless `realtime_start` is set, hence both bounds). `as_of` sends `realtime_start == realtime_end == as_of`. `latest` sends nothing, which is precisely what makes FRED default to today.
- `VINTAGE_CAPABLE_SOURCES = {"fred"}` with documented exclusions: `sec_xbrl_frames` (returns the last-filed fact by design, no vintage dimension), `fmp` (restates in place), `databento`/`coinbase` (tape prints, not revisable statistics, so no vintage dimension is claimed for them).
- Typed refusals: `PointInTimeUnavailable` (source cannot answer as-of) and `HindsightWriteRefused` (a hindsight value was offered for a back-stamped record).

**`app/providers/fred.py`.** Split by what each function's subject IS:

- `observations()` — the one historical-window read — now defaults to `Revision.first_release`. Every returned row carries `revision` plus FRED's echoed `realtime_start`/`realtime_end`, so the vintage is evidenced rather than asserted.
- `latest()` and `series()` read the PRESENT. "Now" has no hindsight available, so their defaults are unchanged and still correct. Both gain `as_of=` for a vintage read, cached under a separate key so a historical read can never poison the live board's cache.

**`app/spine/capture.py::capture_fred_observation`.** `revision` is now a required keyword, and a hindsight revision **raises** `HindsightWriteRefused` rather than back-stamping. There is no fallback branch by design: the alternatives are the true vintage or no row. The accepted revision is written into `claim_value` so the record is self-describing from here on.

**`app/jobs/phase2_backfill.py`.** Names `Revision.first_release` at the call site even though it is the default, because this is the one place where getting it wrong contaminates the record. On an empty point-in-time read it records `macro_pit_unavailable` and writes nothing — no substitution. A refusal is caught, logged and recorded as `macro_hindsight_refused`.

**`econ_board.py`, `tx100/data.py`, `macro_sources.py`.** Display-only historical readers. Behaviour deliberately **unchanged** — requests are byte-identical — but each now passes `Revision.latest` explicitly through the shared builder, so hindsight is never what omission gives you, and each carries a comment saying the default must flip if that path ever starts recording claims.

### Call-site dispositions, complete

| call site | before | after | disposition |
| --- | --- | --- | --- |
| `jobs/phase2_backfill` FRED branch | current revision, back-stamped | first release | **CHANGES — this is the fix** |
| `spine/capture.capture_fred_observation` | accepted any value | requires `revision`; refuses hindsight | **CHANGES — new typed refusal** |
| `adaptive_panel` (14x `fred.latest`, 1x `fred.series`) | live read | live read | unchanged |
| `intelligence_cards._fred_cell` -> `capture_macro_regime` | live read | live read | unchanged (a live snapshot is PIT-correct by construction) |
| `routers/intelligence` (WALCL, RRPONTSYD, WTREGEN + series) | live read | live read | unchanged |
| `routers/market` econ sweep | live read | live read | unchanged |
| `providers/econ_board.fetch_raw` (~80 series) | current revision | current revision, **named** | request byte-identical |
| `tx100/data.fetch_fred_monthly` (CPIAUCSL, DCOILWTICO, TB3MS) | current revision | current revision, **named** | request byte-identical |
| `marketdata/macro_sources._fred_obs` (DXY, VIX) | live read | live read, **named** | request byte-identical |
| `providers/edgar.py` (SEC) | PIT-correct by accession | untouched | no change needed |

No display loses its current revision. The only consumer whose data changes is the backfill that writes the record.

## 4. Tests — proven, not asserted

New file `tests/test_point_in_time.py`, 13 tests, all offline with mocked HTTP:

- `test_historical_window_defaults_to_first_release_not_todays_revision` — a historical read with nothing asked for sends the real-time window and returns the original print (`0.62`), not the number it was later revised to (`0.91`).
- `test_as_of_reads_the_named_vintage` — `realtime_start == realtime_end == as_of`.
- `test_hindsight_must_be_named_at_the_call_site` — `Revision.latest` sends no real-time parameters and returns the revised value, reachable only by naming it.
- `test_source_without_a_vintage_dimension_refuses` — `sec_xbrl_frames` and `fmp` raise `PointInTimeUnavailable`; `fred` does not.
- `test_capture_refuses_a_hindsight_value_and_writes_nothing` — the refusal is raised **and** the store is verified empty afterwards, so refusal is not merely a log line.
- `test_capture_accepts_a_first_release_value_and_records_the_revision` — verifies `knowledge_time` is back-stamped to `2020-03-02` and the row records `revision: first_release`.
- `test_guard_is_load_bearing_proven_by_removing_the_realtime_parameters` — **the removal proof.** Runs intact and asserts the guard passes; then monkeypatches `fred_realtime_params` to return `{}` (exactly the pre-TW-59 behaviour), re-runs, and asserts the same guard function now raises `AssertionError` under `pytest.raises`. A guard that still passes with the thing it guards removed is not a guard.
- `test_removing_the_capture_guard_would_admit_the_contaminated_row` — same treatment for the capture-boundary half: empty `HINDSIGHT_REVISIONS` and the refusal disappears, proving the refusal is caused by the guard.

Two pre-existing tests were updated because the `capture_fred_observation` signature gained a required keyword: `tests/test_phase2_backfill.py::test_backfill_atoms_never_derived` and `tests/test_spine_atom_serve.py::test_atom_context_includes_backfill_event_atoms_excludes_fundamentals`. Both now pass `revision=Revision.first_release.value`.

### Raw output, CI command, full backend suite

```
$ cd /p/empressa-trading-worktrees/tw59-pit/apps/cockpit/backend && python -m pytest -q
EXIT=0
--- RAW TAIL ---
tests/test_staged_trades.py::test_approve_mode_requires_typed_confirm_and_live_account
  P:\empressa-trading-worktrees\tw59-pit\apps\cockpit\backend\app\routers\bots.py:1262: DeprecationWarning: 'HTTP_422_UNPROCESSABLE_ENTITY' is deprecated. Use 'HTTP_422_UNPROCESSABLE_CONTENT' instead.
    await _check_approve_allowed(db, user.id, bot_id, body.confirm)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
4742 passed, 2 skipped, 21 deselected, 38961 warnings in 464.68s (0:07:44)
--- FAILED LINES ---
(none above = zero failures)
```

Zero failures — the merge standard. (An intermediate run before the two signature updates showed `1 failed, 4741 passed`; that failure was `test_spine_atom_serve.py::test_atom_context_includes_backfill_event_atoms_excludes_fundamentals` calling the changed signature, and it is fixed in the commit.)

GitHub CI, judged on the conclusion STRING, all checks settled:

```
$ gh pr view 344 --json statusCheckRollup --jq '.statusCheckRollup[] | "\(.name)\t[\(.status)]\t\(.conclusion)"'
Python tests (cockpit backend)	[COMPLETED]	SUCCESS
Frontend build (cockpit web)	[COMPLETED]	SUCCESS
Frontend tests (cockpit vitest)	[COMPLETED]	SUCCESS
Gitleaks security scan	[COMPLETED]	SUCCESS
Windows .exe (release tags only)	[COMPLETED]	SKIPPED
```

`gh pr view 344 --json mergeable` reports `MERGEABLE`. Left OPEN per the row's hard rule.

## 5. Diffs

Full text saved alongside this artifact for review:

- source: `C:/Users/cente/AppData/Local/Temp/claude/p--doc-repo/f7897907-3e42-483c-8948-88f2623dc607/scratchpad/tw59_src.diff` (631 lines)
- tests: `C:/Users/cente/AppData/Local/Temp/claude/p--doc-repo/f7897907-3e42-483c-8948-88f2623dc607/scratchpad/tw59_tests.diff` (378 lines)

Canonical view: `gh pr diff 344`.

```
$ git diff origin/main...HEAD --stat
 apps/cockpit/backend/app/jobs/phase2_backfill.py   |  45 ++-
 .../backend/app/marketdata/macro_sources.py        |  21 +-
 apps/cockpit/backend/app/providers/econ_board.py   |  17 +-
 apps/cockpit/backend/app/providers/fred.py         |  90 +++++-
 .../cockpit/backend/app/providers/point_in_time.py | 184 ++++++++++++
 apps/cockpit/backend/app/spine/capture.py          |  28 +-
 apps/cockpit/backend/app/tx100/data.py             |  16 +-
 apps/cockpit/backend/tests/test_phase2_backfill.py |   4 +
 apps/cockpit/backend/tests/test_point_in_time.py   | 328 +++++++++++++++++++++
 .../cockpit/backend/tests/test_spine_atom_serve.py |   4 +
 10 files changed, 708 insertions(+), 29 deletions(-)
```

Source diff, 631 lines: `apps/cockpit/backend/app/{providers/point_in_time.py (new, 184), providers/fred.py, providers/econ_board.py, marketdata/macro_sources.py, tx100/data.py, spine/capture.py, jobs/phase2_backfill.py}`.

Test diff, 378 lines: `apps/cockpit/backend/tests/{test_point_in_time.py (new, 328), test_phase2_backfill.py (+4), test_spine_atom_serve.py (+4)}`.

## 6. What I did not do, and what needs an operator ruling

**Not merged, not deployed.** PR #344 is open. No docker, gcloud, ssh, scp or deploy script was run. The live paper-trading soak with its A/B experiment is untouched.

**No stored data was backfilled, rewritten, quarantined or deleted.** Per the row's hard rules.

**Operator ruling needed — remediation of the existing contaminated macro rows.** The proposal, not performed:

1. Take a backup of `atoms` scoped to `entity_id = 'sec_platform_macro'` and `claim_type LIKE 'macro.%'` before touching anything.
2. Rule on treatment. Correction by re-run is **blocked** — `_dedup_key` is `capture:fred:{series}:{date}` and `persist_capture_atom` skips existing keys, so a corrected re-run writes nothing. The workable options are: (a) leave in place and accept the contamination on the record with a documented caveat; (b) mark the pre-fix rows quarantined by a migration that adds a `revision: "unknown_pre_tw59"` marker to their `claim_value`, so `atom_context` can exclude them from served chips; (c) hard-delete the affected rows, which breaks append-only.
3. Whichever is chosen, `atom_context.py` should exclude unmarked pre-fix macro atoms from AI-cited chips until the ruling lands, since serving them as evidence is the live-facing part of the harm.

**Second row needed — the FMP earnings/fundamentals leg.** Section 2 above. Same class of defect, wider surface, `earnings.surprise` is an explicit claim-versus-outcome record built from two hindsight numbers. Not in scope for TW-59 and not attempted.

**Not verified — whether any historic `phase2_backfill` FRED run actually executed against production.** I read code only. Whether the contaminated rows exist in the live store, and how many, is a store query the operator can run; nothing in this row touched a live database.

**Left alone deliberately.** `capture_fred_observation` still sets `vintage=Vintage.fresh` on a first-release historical value. That enum means feed freshness, not revision vintage, and changing it collides with `Vintage`'s existing meaning across the spine. Flagged, not changed.
