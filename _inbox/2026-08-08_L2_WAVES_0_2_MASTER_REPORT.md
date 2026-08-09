---
id: 2026-08-08_L2_WAVES_0_2_MASTER_REPORT
title: L2 Waves 0–2 master report — Texas parcel acquisition checkpoint
date: 2026-08-08
status: complete
owner: wave-plan-master-planner
related: [_inbox/2026-08-08_L2_wave_plan, _inbox/2026-08-08_L2_WAVES_0_2_ADVERSARIAL_REVIEW]
---

# L2 Waves 0–2 master report

Waves 0 through 2 completed cleanly. Sixty named degree-vintage counties now hold geometry in `txgio_parcel` (19 original metro plus Kenedy plus nine Wave 1 new plus fifty Wave 2), for **79** distinct `county_fips` in the live store. Dry predicted apply exactly on every membership county; idempotent re-apply held; Bosque and Donley were never written. Wave 3 was not started. Adversarial review verdict: **NOT REFUTED (with conditions)**.

## Wave 0 outcome

Loaded-record fix: PR [#399](https://github.com/empressaioemail-tech/legacy-design-tools/pull/399) merged at `fb6a42b22d7855b08d6d5de228f41eba298e2629`. CI conclusion STRING on run 31286138409: `success`. CLI summary `loaded before` now uses `storeLoadedLabel(rowsExisting)` from `countCountyParcels` (yes when rows exist, no when zero, unknown without DATABASE_URL). `--list` queries DISTINCT `county_fips` from the store when DATABASE_URL is set. `TXGIO_COUNTIES` remains the hand map for `jurisdictions.ts` composition only.

TLS: unattended Windows recipe is `NODE_OPTIONS=--use-system-ca` with the library browser UA already in `download.ts`. Baseline Node fetch fails with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`; system-ca without browser UA gets HTTP 403; system-ca plus Chrome UA returns 200. `NODE_TLS_REJECT_UNAUTHORIZED=0` was not wired as a library default.

Kenedy 48261 re-proof (verbatim from Wave 0 artifact):

```
[txgio-ingest] ---- ingest summary (DRY RUN — nothing written) ----
[txgio-ingest] county:           48261 (Kenedy)
[txgio-ingest] loaded before:    yes
[txgio-ingest] features would load: 538
[txgio-ingest] rows would delete:  2400
[txgio-ingest] rows would insert:  2400
```

Apply and second apply: features 538, delete 2400, insert 2400; store count held at 2400; `store_loaded=true`. Master-planner independent SQL after all waves: still 2400 rows for 48261.

## Wave 1

Attempted 10, landed 10, failed 0. Membership: Kenedy (control), Glasscock, Borden, Oldham, Roberts, Motley, McMullen, Schleicher, Hartley, Bailey. Total rows among Wave 1 FIPS: **87,832** (includes Kenedy control 2,400 already present; net-new mass **85,432**). Wall clock: **323 s** (artifact `wall_clock_ms` 322536). Store after Wave 1: 29 distinct counties (set arithmetic; live store later advanced by Wave 2).

Every county: dry predicted apply exactly; idempotent re-apply held; zero rows outside Texas degree bounds; StratMap SHP header bbox matched store to four decimal places (source matrix has no Census extent fields).

## Wave 2

Attempted 50, landed 50, failed 0, not started 0. Total rows among Wave 2 FIPS: **748,871**. Wall clock: **654 s** (artifact `wall_clock_ms` 653869), batches of 8 concurrent county-disjoint workers. Final distinct `county_fips`: **79**. Relation size after Wave 2: **7,612,686,336** bytes. Zero rows outside Texas bounds. Bosque 48035 and Donley 48129: zero rows. No unexpected FIPS beyond original-19 ∪ Wave1 ∪ Wave2.

## Rural seam factor and storage projection

Wave 1 seam factors (rows per distinct feature): Kenedy 4.461, Glasscock 2.655, Borden 2.289, Oldham 2.360, Roberts 2.406, Motley 1.534, McMullen 1.988, Schleicher 1.695, Hartley 1.752, Bailey 1.518. Mean **2.266**, range **1.518–4.461**. Kenedy’s 4.46 does **not** hold uniformly across rural geometries; five counties sit below 2.0. Wave 2 seam mean was about **1.52** (range roughly 1.19–2.24). Metro blend remains ~1.07.

Implication: the statewide storage projection derived from metro seam (~35–37 GB) is light for the ranch tail, but a blanket 4× rural multiplier overstates. Planning should use a **mix** (metro ~1.07, mid-rural ~1.5–2.3, sparse ranch outliers toward 4.5), not a single rural factor.

## Per-county cost under the bulk path

FINDING: not obtainable. No Neon or GCP per-county billing meter was queried without inventing a billing API. Wall-clock and row metrics are available; dollar cost is not.

## Defects / findings (stated, not worked around)

1. **TXGIO_COUNTIES drift:** hand map still 19 entries while store has 79 distinct loaded FIPS. CLI is honest; `jurisdictions.ts` product composition still omits newly loaded counties.
2. **Primary checkout hazard:** `P:\legacy-design-tools` was not the execution tree and can still carry pre-#399 `loaded before` wiring. Waves ran from `P:\legacy-design-tools-wave0` @ `fb6a42b2`. Wave 3 from the wrong tree reintroduces hand-map lies.
3. **TLS slogan incompleteness:** `NODE_OPTIONS=--use-system-ca` alone is insufficient without browser UA (403). Ingest code supplies UA; docs must say both.
4. **Table bloat on idempotent replace:** still open from the Kenedy proof (dead tuples / relation growth under delete+insert). Wave 1 and 2 each ran a second apply for idempotency proof, amplifying bloat risk. Vacuum policy still owed before large re-run waves.
5. **Source matrix bbox gap:** no Census extent fields in the sweep matrix; verification used StratMap SHP headers (same discipline as Kenedy proof).
6. **Cost metering gap:** bulk-path dollar cost per county remains unmeasured.
7. **Donley 48129** remains HTTP 404 / not a wave member (source decision still owed). **Bosque 48035** remains never-unattended (anomalous byte density).

## Adversarial reviewer verdict (verbatim)

> **NOT REFUTED (with conditions)**
>
> Every attackable store/code/artifact claim survived independent verification. Conditions and papered-over gaps are listed below; they are operational hazards, not successful claim kills.

Named Wave 0–2 claims refuted: **none**. Survived attacks included PR/CI string, store-derived loaded-before, per-county dry=apply and idempotency on full membership, row sums 87832 / 748871, distinct 79, zero out-of-Texas, Bosque/Donley absent, independent SHP bbox rematch on six counties. Conditions: wall clocks and concurrency accepted from artifacts (not re-timed); TLS requires browser UA with system-ca; TXGIO_COUNTIES drift confirmed as open debt.

Full review: `_inbox/2026-08-08_L2_WAVES_0_2_ADVERSARIAL_REVIEW.md`.

## Wave 3 readiness verdict

**READY for operator go on remaining degree-vintage counties**, under the same recipe and halt-on-mismatch discipline. Not auto-started.

What I would change first before Wave 3:

1. **Execute only from a clean tree at/after `fb6a42b2`** (prefer the wave0 worktree or a fresh worktree from `origin/main`). Do not trust the dirty primary checkout.
2. **Close or explicitly park TXGIO_COUNTIES drift** so product surfaces do not silently treat 60 loaded counties as geometry-absent; either sync the hand map from store after waves or document that L2 land ≠ jurisdiction geometry claim until a separate sync job runs.
3. **Revise storage projection** with Wave 1/2 measured seams (mix, not metro-only and not Kenedy-only).
4. **VACUUM / bloat policy** before another full idempotent re-proof sweep on tens of counties.
5. Keep Harris / Fort Bend / Montgomery / El Paso / Brazoria **last and individual**; keep Bosque and Donley out of the concurrent batch.
6. Do not treat L2 landings as atom/warm clearance.

Wave 4 (202505 / `--reproject=3857`) still requires its own King 48269 proof and remains HELD.

## Verbatim git status (repos touched)

### `P:\legacy-design-tools-wave0` (execution worktree; code merge landed on origin/main)

```
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.tmp_wave0_tls/

nothing added to commit but untracked files present (use "git add" to track)
```

HEAD includes `fb6a42b2 Merge pull request #399`.

### `P:\legacy-design-tools` (primary; not the Wave execution tree)

```
## fix/county-rail-refresh...origin/fix/county-rail-refresh
 ? .claude/worktrees/recon-add-jurisdiction
 m .claude/worktrees/track-b-ifc-ingest
 M artifacts/api-server/data/opportunity-zones/oz-test.geojson
?? .tmp_nfhl_48.zip
?? .tmp_nfhl_head.zip
?? .tmp_nfhl_tail.zip
?? _tmp_wave0_verify.js
?? artifacts/api-server/data/county_manifest_seed.generated.sql
```

### `P:\doc_repo` (artifacts only; untracked wave reports)

Wave artifacts are untracked under `_inbox/2026-08-08_L2_*` including this master report, Wave 0–2 results/reports, per-county JSON/logs, adversarial review, and `_inbox/2026-08-08_L2_wave_membership.json`. No commit was requested.

## Agent accounting

| Agent | Role | Result |
|---|---|---|
| Wave 0 sub-planner | fix + Kenedy re-proof | PASS; PR #399 |
| Wave 1 sub-planner | 10 serial counties | 10/10 landed |
| Wave 2 sub-planner | 50 @ 8 concurrent | 50/50 landed |
| Adversarial reviewer | refute Waves 0–2 | NOT REFUTED (with conditions) |

Master planner independently SQL-verified Wave 0, Wave 1, and Wave 2 store totals before accepting each stage. Wave 3 not begun.
