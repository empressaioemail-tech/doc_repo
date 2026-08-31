---
id: 2026-08-18_TW-58_security_master_universe_close
title: TW-58 CLOSE — the live-universe-snapshot premise is refuted; the capture it asked for already exists, is not scheduled, and would corrupt identity if switched on today
status: closed
last_updated: 2026-08-18
applies_to: empressa-trading
executor: TW-58 lane agent
authority: CANON_OVERRIDE TW-58 (operator-ruled 2026-08-18; Smart Markets unregistered R&D, no PLAN-ROW by design)
related:
  [
    _inbox/2026-08-18_TW-47_dedupe_close.md,
    _inbox/2026-08-18_TW-47_security_master_dedupe_brief.md,
    _inbox/2026-08-18_TW-44a_cockpit_served_node_read_close.md,
  ]
---

# TW-58 CLOSE

## Verdict

**The premise is REFUTED as stated. No code was written. No PR was opened.**

The research report claimed the cockpit's security master is a LIVE-UNIVERSE SNAPSHOT
carrying no delisted instruments and no historical symbol-validity eras, inferred from
9,984 instruments against 10,387 current SEC tickers.

Three separate parts of that are wrong.

The **reasoning** is wrong in the exact way the dispatch predicted. The 9,984 figure is the
ACTIVE population. The `nodes` table also holds roughly 25,937 rows in `status='merged'`
(25,926 `provisional_dedup` merges executed in bulk 2026-06-29T12:22:55Z plus 11
`venue_normalization_dedup` merges on 2026-08-17), so the table is about 35,900 rows, well
ABOVE the current-ticker count. The comparison that generated the hypothesis compared a
filtered number to an unfiltered one. Same shape as the retracted "24 duplicate AAPL nodes".

The **label** is wrong. It is not a snapshot of the live universe, because it is not the
live universe. A live sweep of the served master (below) shows CTRA, AAL, DINO and EXE, all
currently listed, returning `absent-verified`, and it shows `FB`, dead as a ticker since
June 2022, resolving to a node. It is neither current nor historical. It is an accreted
mint-on-demand set: whatever ingestion happened to ask for.

The **conclusion**, that there is no usable history, survives for a reason the report did
not name and which is worse than the one it did. Every alias era in the master was written
yesterday. The TW-47 backfill wrote 9,981 of the 9,987 `identity.symbol` atoms with
`valid_from = NULL`, `valid_to = NULL`, and `knowledge_time = 2026-08-18T~17:52Z`. The
resolver's bitemporal gate is `knowledge_time <= asof` with no exemption, so a point-in-time
resolve at ANY as-of before 2026-08-18 returns `not_found` for essentially the entire
catalog. The master cannot say what a symbol meant in 2023, and it also cannot say what a
symbol meant last week.

And the **remedy** the dispatch pre-authorised should not be built, for two reasons:

1. **It already exists.** `app/universe/sync.py` maintains `universe_symbols` with
   `is_active` / `listed_at` / `delisted_at`, and on every symbol that disappears from the
   vendor feed it stamps `delisted_at` AND calls `resolver._close_open_alias(...)`. That is
   precisely "diff the daily snapshot and manufacture the era", already wired.
2. **It is not turning, and turning it on today would corrupt identity.** `universe_sync` is
   registered as a job kind but is NOT in the scheduler tick, so it only ever runs on an
   operator trigger. And the documented symbol-reuse invariant it depends on does not hold:
   after a real delisting, a minting resolve of the same symbol returns the SAME delisted
   node instead of a new one (reproduced below). The first re-used ticker after the ratchet
   starts would silently bind a new instrument onto a dead one.

Building a second, parallel daily-snapshot table on top of that would be the operate-not-
rebuild failure. The correct next rows are: fix the reuse defect, write `listed_at`, then
schedule `universe_sync`. Each is a separate decision and none of them was in TW-58's scope.

## What I could and could not read, stated plainly

**I did not run SQL against the production database, and this close does not pretend
otherwise.** The production DB is Cloud SQL Postgres with **no public IP**, reachable only
through the Cloud SQL Auth Proxy sidecar on the `empressa-bot` VM using the VM service
account (`apps/cockpit/docs/DB_DURABILITY_MIGRATION_SPEC.md`). The two credentialed HTTP
paths are both closed to me: `/admin/nodes` requires a Clerk operator JWT, and
`/securities/*` requires `X-Empressa-Service-Key`, whose value was generated on-host so that
it never transited a command (`_inbox/2026-08-17_smart_markets_pickup.md`). The only
remaining path is `ssh` plus `docker exec`, which the TW-58 hard rules forbid outright.

So the evidence here is three kinds, and each claim below is tagged with which:

* **(LIVE)** my own anonymous read of the production served master through the Smart
  Markets union layer, which resolves through the cockpit with the service key it holds.
  Read-only. Writes nothing. This is a real read of the real table, one symbol at a time.
* **(CODE)** the shipped source on `origin/main` at `e4122fef`.
* **(TW-47)** first-party numbers from the operator-gated production run recorded in
  `_inbox/2026-08-18_TW-47_dedupe_close.md`. Not my read. Cited as such.

The aggregate `status` / `resolution_status` distribution across `nodes`, and the open-vs-
closed distribution across `identity.symbol` atoms, are the two things I could not obtain
first-hand. The exact queries to settle them are at the end of this file.

## 1. Does the master carry delisted or dead instruments?

**(LIVE)** Anonymous sweep of the production served master, 2026-08-18T23:5xZ, via
`GET https://smart-markets-api-znwrqyxmqa-ue.a.run.app/v0.1/twin/<SYMBOL>`. HTTP 503 is this
service's status code when a layer is unresolved; the JSON body carries the honest
determination and is what is reported. Raw:

```
=== DELISTED/DEAD ===
WFM                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'WFM' at the requested as-of. This read path d
APC                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'APC' at the requested as-of. This read path d
CXO                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'CXO' at the requested as-of. This read path d
NBL                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'NBL' at the requested as-of. This read path d
COG                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'COG' at the requested as-of. This read path d
EP                   503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'EP' at the requested as-of. This read path do
SII                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'SII' at the requested as-of. This read path d
CAM                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'CAM' at the requested as-of. This read path d
BJS                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'BJS' at the requested as-of. This read path d
SWN                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'SWN' at the requested as-of. This read path d
DYN                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'DYN' at the requested as-of. This read path d
TXU                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'TXU' at the requested as-of. This read path d
JCP                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'JCP' at the requested as-of. This read path d
RSH                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'RSH' at the requested as-of. This read path d
PIR                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'PIR' at the requested as-of. This read path d
ZLC                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'ZLC' at the requested as-of. This read path d
CPQ                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'CPQ' at the requested as-of. This read path d
EDS                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'EDS' at the requested as-of. This read path d
PER                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'PER' at the requested as-of. This read path d
NATI                 503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'NATI' at the requested as-of. This read path
TIN                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'TIN' at the requested as-of. This read path d
CCU                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'CCU' at the requested as-of. This read path d
ENE                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'ENE' at the requested as-of. This read path d
ENRNQ                503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'ENRNQ' at the requested as-of. This read path
MIK                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'MIK' at the requested as-of. This read path d
AMR                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'AMR' at the requested as-of. This read path d
BBI                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'BBI' at the requested as-of. This read path d
KSU                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'KSU' at the requested as-of. This read path d
ATVI                 503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'ATVI' at the requested as-of. This read path
TWTR                 503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'TWTR' at the requested as-of. This read path
FB                   503 NONE verdict=lookup-failed basis="FB" resolved to sec_01KW8BN5QRB6A5VH4VKQ2P238M, but neither the security-master node read nor
=== SYMBOL-REUSE CANDIDATES ===
CAL                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'CAL' at the requested as-of. This read path d
PE                   503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'PE' at the requested as-of. This read path do
SAIL                 503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'SAIL' at the requested as-of. This read path
SC                   503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'SC' at the requested as-of. This read path do
HFC                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'HFC' at the requested as-of. This read path d
=== LIVE CONTROLS ===
AAPL                 200 NODE sec_01KW9M9AHG6KH27D3XB1RHQC7E Apple Inc.
MSFT                 200 NODE sec_01KW87FC7ANAK9DS7KEPGTE1JY MICROSOFT CORP
SPY                  200 NODE sec_01KW8C3B5YM6KE5P3PA597MS5V SPDR S&P 500 ETF TRUST
META                 503 NONE verdict=lookup-failed basis="META" resolved to sec_01KW87FC626WPJ1N377A4QTGMW, but neither the security-master node read no
CTRA                 503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'CTRA' at the requested as-of. This read path
VST                  503 NONE verdict=lookup-failed basis="VST" resolved to sec_01KW87FCEPY250B1J7WAFAV2T1, but neither the security-master node read nor
AAL                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'AAL' at the requested as-of. This read path d
DINO                 503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'DINO' at the requested as-of. This read path
EXE                  503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'EXE' at the requested as-of. This read path d
NVDA                 200 NODE sec_01KW87FC84X4S5AVKHK8E09H8W NVIDIA CORP
XOM                  503 NONE verdict=lookup-failed basis="XOM" resolved to sec_01KX8R1XDPRE964P7KMXA1AW0W, but neither the security-master node read nor
=== NONSENSE CONTROL ===
ZZQXNOTAREALTICKER   503 NONE verdict=absent-verified basis=the security master determined: no node resolves 'ZZQXNOTAREALTICKER' at the requested as-of. T
```

Reading it:

* 30 of 31 known-dead tickers are `absent-verified` and are indistinguishable from the
  nonsense control. The served master does not carry them.
* `FB` DOES resolve, to `sec_01KW8BN5QRB6A5VH4VKQ2P238M`. `META` resolves to a DIFFERENT
  node, `sec_01KW87FC626WPJ1N377A4QTGMW`. Both are live in the master simultaneously. A
  ticker change processed as a corporate action would have been ONE node with a closed `FB`
  era and an open `META` era (`_ca_ticker_change`, resolver.py:1249-1267). Two separate nodes
  means the 2022 rename was never modelled; the `FB` node is stale mint residue, not a
  historical record.
* Four currently-listed tickers (CTRA, AAL, DINO, EXE) are absent. The master is not the
  current universe either.

**(CODE)** `status='delisted'` is written by exactly ONE site in the whole application:
`SecurityResolver._ca_delisting` at `app/securities/resolver.py:1381`, reachable only through
`apply_corporate_action`. `app/universe/sync.py`, the only other death-detecting code,
never touches `node.status`; it stamps `universe_symbols.delisted_at` and closes the alias.
So a `delisted` node can only exist if a corporate action was fed in.

**Answer to Q1:** the served master carries essentially no dead instruments (one stale
symbol row, `FB`, which is residue rather than history), and it is missing plenty of live
ones. It is neither a live-universe snapshot nor a historical record.

## 2. Are there historical symbol-validity eras?

**(CODE)** The era model is fully capable. `_close_open_alias` (resolver.py:1269-1300)
appends a closed-era alias atom per open era, deliberately INHERITING the original era's
`knowledge_time` so that learning the end of an era does not retro-hide it.
`_ca_ticker_change` closes the old era and opens the new one at `ex_date`. `resolve_security`
honours both halves. Nothing structural is missing.

**(TW-47)** In practice every era is open, startless, and dated yesterday. The 2026-08-18
backfill wrote 9,981 atoms with `valid_from = null` ("listing start unknown, not fabricated"),
`valid_to = null`, `knowledge_time = now`, `source = "tw47_backfill"`; 6 pre-existed; total
`identity.symbol` atoms 9,987.

**Answer to Q2:** no. The capability exists and has never been exercised. An all-open,
all-startless, all-2026-08-18 alias set means the master can state what a symbol means today
and nothing else.

## 3. Is a symbol ever re-used across instruments, and would the structure represent it?

**(CODE)** `_ca_delisting` closes the alias and asserts, in its own comment at
resolver.py:1389-1390:

> Symbol is now reusable (invariant 1): a future resolve of it mints a NEW node because the
> only alias era for it on this node is now closed.

**That claim is false, and this is the most consequential finding in TW-58.** Reproduced with
the repo's own resolver on a throwaway sqlite file (no production contact), driving the REAL
`_ca_delisting` path:

```
era-1 node (Continental Airlines shape): sec_01M0BNBHNCQFMG1ZYN0AKEWC0X
after _ca_delisting: effects=['status:delisted', 'alias_closed'] node.status='delisted' current_symbol='CAL'
read-only resolve after delist -> None / not_found
minting resolve after delist  -> sec_01M0BNBHNCQFMG1ZYN0AKEWC0X / provisional
DOCSTRING CLAIM 'mints a NEW node' holds: False
nodes table now:
    ('sec_01M0BNBHNCQFMG1ZYN0AKEWC0X', 'CAL', 'delisted')
```

Root cause, traced: step 5 of `resolve_security` falls through to `get_or_create_node`. That
attempts an INSERT which collides with the partial-unique index
`uq_nodes_provisional_symbol_venue` (models.py:1109-1115). The index is keyed on
`(current_symbol, primary_venue) WHERE resolution_status='provisional'` and is **not filtered
by `status`**, so a delisted node still occupies the slot. The insert is skipped, and the
recovery path at resolver.py:476 calls `_provisional_node`, whose filter (resolver.py:561-570)
excludes only `status != 'merged'`. A `delisted` node passes it and is returned.

Note the asymmetry: `_venue_seam_node` DOES filter `status == 'active'` and documents exactly
why ("a `delisted` node released its symbol, spec 2.4 invariant 1, the reuse case"). The
adopt path got the rule right; the dedup-convergence path did not.

**Answer to Q3:** the design intends to represent re-use and the code does not. Today no
re-use exists to represent, because no delisting has ever been processed. The moment one is,
the next mint of that symbol silently binds a new instrument onto the dead node.

## 4. What would a point-in-time query return?

**(CODE)** The gate at resolver.py:819 is absolute: `if kt is not None and kt > asof:
continue`, with a comment that there are no exemptions because otherwise "the whole
backtest/confidence loop leaks lookahead". Candidates are built EXCLUSIVELY from alias atoms;
there is no nodes-table fallback.

Combined with the TW-47 alias shape, that means an as-of before 2026-08-18T~17:52Z sees
nothing. Reproduced with the repo's own resolver against a throwaway sqlite seeded to the
exact production alias shape (`valid_from=None`, `valid_to=None`, `knowledge_time=write
time`):

```
node minted: sec_01M0BNAK7WA0MAKW369WSGA2WC
alias written: valid_from=None valid_to=None knowledge_time=2026-08-19T00:04:21.348621+00:00

=== resolve_security(mint=False) at a range of as-ofs ===
  asof now                  -> node_id=sec_01M0BNAK7WA0MAKW369WSGA2WC status=provisional reason=
  asof 1 second BEFORE kt   -> node_id=None status=not_found reason=no node resolves 'AAPL' at the requested as-of
  asof 1 day before         -> node_id=None status=not_found reason=no node resolves 'AAPL' at the requested as-of
  asof 2026-08-01           -> node_id=None status=not_found reason=no node resolves 'AAPL' at the requested as-of
  asof 2023-01-01           -> node_id=None status=not_found reason=no node resolves 'AAPL' at the requested as-of

=== now CLOSE the era (what _ca_delisting / universe_sync do) ===
  asof before close         -> node_id=sec_01M0BNAK7WA0MAKW369WSGA2WC status=provisional reason=
  asof after close          -> node_id=None status=not_found reason=no node resolves 'AAPL' at the requested as-of
```

One second before the knowledge time, the catalog is empty. The era-closure half works
correctly.

**(LIVE)** A secondary finding: the point-in-time capability is not reachable from the public
surface at all. The union layer ignores an as-of in every spelling tried:

```
AAPL?asOf=2026-08-01T00:00:00Z         200 node=sec_01KW9M9AHG6KH27D3XB1RHQC7E ids_asOf=2026-08-18T23:59:34.540Z absence=None
AAPL?asof=2026-08-01T00:00:00Z         200 node=sec_01KW9M9AHG6KH27D3XB1RHQC7E ids_asOf=2026-08-18T23:59:36.499Z absence=None
AAPL?as_of=2026-08-01T00:00:00Z        200 node=sec_01KW9M9AHG6KH27D3XB1RHQC7E ids_asOf=2026-08-18T23:59:38.295Z absence=None
AAPL?asOf=2023-01-01T00:00:00Z         200 node=sec_01KW9M9AHG6KH27D3XB1RHQC7E ids_asOf=2026-08-18T23:59:40.010Z absence=None
```

The 2023 as-of returns the same node with an `asOf` echo of the request instant. The cockpit
resolver takes an as-of; Smart Markets never forwards one.

## 5. The capture already exists and is switched off

`app/universe/sync.py` `sync_universe()` maintains `universe_symbols` (`models.py:1404-1423`:
`symbol` PK, `is_active`, `is_tradable`, `listed_at`, `delisted_at`, `synced_at`). Per run it
upserts the incoming FMP stock and ETF listings, and for every previously-active row that is
NOT in the incoming set:

```python
row.is_active = False          # sync.py:306
row.is_tradable = False
row.delisted_at = now          # sync.py:308
row.synced_at = now
delisted += 1
try:
    resolved = await resolver.resolve_security(row.symbol, venue=row.venue, asof=now)
    await resolver._close_open_alias(resolved["node_id"], row.symbol, now)   # sync.py:313
```

That is the ratchet the dispatch wanted to build. It detects disappearance by diffing against
the vendor's current list and it manufactures the era on the node. It is registered as job
kind `universe_sync` (`app/jobs/handlers.py:432`).

**It is not scheduled.** `app/jobs/scheduler.py::_tick` enqueues sixteen jobs: `iv_snapshot`,
`signal_grade`, `zone_atom_grade`, `regime_flip_grade`, `composition_zone_regime_grade`,
`tf_propagation_grade`, `zone_auto_emit`, anchor jobs, `intervention_stop_grade`,
`fundamental_universe_backfill`, `edgar_universe_backfill`, `ohlcv_topup`,
`identity_universe_backfill`, `equity_universe_seed`, `equity_deep_daily`, `heatmap_refresh`.
`universe_sync` is not among them. It runs only when an operator fires `POST /admin/runs`.
(`equity_universe_daily_seed` is not a substitute. It seeds OHLCV bars into `ohlcv_bars`;
it never writes `universe_symbols`.)

Two defects would have to clear before it is switched on:

* **The reuse bind (section 3).** `resolve_security(..., mint=True)` inside the delist loop
  will hand back the delisted node for any re-used symbol.
* **`listed_at` is never written.** Grep across the whole app finds `listed_at` only in the
  model declaration; the add branch of `sync_universe` sets `synced_at` and leaves
  `listed_at` NULL. So the ratchet as built captures disappearances and loses appearances,
  half the diff.

## What I did, and what I deliberately did not build

Did: created worktree `tw58/universe-audit` at `origin/main` `e4122fef`; read the resolver,
the node and universe models, the scheduler and the job registry; swept the production served
master anonymously (roughly 120 read-only HTTP requests, no writes, no auth, no VM contact); ran
two verification scripts against throwaway sqlite files in the session scratchpad using the
repo's own `SessionLocal` and `SecurityResolver`.

Did not: write the daily-snapshot capture. It is redundant with `universe_symbols`, and
adding a parallel table beside a working-but-unscheduled one is the operate-not-rebuild
failure. Did not open a PR; there is no code to review. Did not touch production state, the
VM, docker, gcloud, ssh, any migration, the soak, or the A/B arms. The worktree carries zero
commits.

## The four queries that close the gaps I could not

Run inside the `empressa-cockpit-api` container in an operator window (the same mechanism
TW-31 and TW-47 used). All four are pure SELECTs.

```sql
-- 1. the real node distribution (the number the report should have compared)
SELECT node_type, status, resolution_status, COUNT(*)
FROM nodes GROUP BY 1,2,3 ORDER BY 4 DESC;

-- 2. are ANY alias eras closed, and when was the knowledge recorded?
SELECT COUNT(*) AS total,
       COUNT(*) FILTER (WHERE value_json LIKE '%"valid_to": null%') AS open_eras,
       MIN(knowledge_time) AS earliest_kt, MAX(knowledge_time) AS latest_kt
FROM atoms WHERE claim_type = 'identity.symbol';
-- expected from TW-47: total 9987, open 9987, kt clustered at 2026-08-18T17:5x

-- 3. has the ratchet ever turned?
SELECT COUNT(*) AS rows,
       COUNT(*) FILTER (WHERE is_active) AS active,
       COUNT(*) FILTER (WHERE delisted_at IS NOT NULL) AS ever_delisted,
       COUNT(*) FILTER (WHERE listed_at IS NOT NULL) AS ever_listed,
       MAX(synced_at) AS last_sync
FROM universe_symbols;
-- a zero/zero/NULL result confirms universe_sync has never run in production

-- 4. how many symbols does more than one ACTIVE node claim? (post-TW-47 residue check)
SELECT current_symbol, COUNT(*) FROM nodes
WHERE node_type='security' AND status='active'
GROUP BY 1 HAVING COUNT(*) > 1 ORDER BY 2 DESC LIMIT 40;
```

Query 3 is the one that decides whether anything is actually bleeding. If `universe_symbols`
is empty or has never recorded a `delisted_at`, then no history has been captured since the
table was created, and every day since is already gone, which makes the ratchet argument
correct in substance even though the premise that produced it was not.

## Recommended next rows (each its own decision, none of them TW-58)

1. Fix the reuse bind: exclude `status IN ('merged','delisted')` from `_provisional_node`,
   and add the same exclusion to the partial-unique index predicate. Ship with a test that
   drives `_ca_delisting` then re-resolves and asserts a NEW node id. This is a correctness
   fix to identity and it gates everything below it.
2. Write `listed_at = now` in the add branch of `sync_universe` so the diff captures both
   directions.
3. Only then schedule `universe_sync` in `_tick`, gated behind a settings flag like every
   other vendor-spend job, and run it once by hand first so the first-run delta is reviewed
   before it becomes automatic. The first run will mark every symbol the seed never saw as
   delisted, which is a large one-off write and needs the dry-run-then-apply shape.
4. Separately: decide whether Smart Markets should forward an as-of to the cockpit. Today the
   only bitemporal surface in the stack is unreachable from outside.
