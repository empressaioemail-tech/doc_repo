# L2 Waves 0–2 — ADVERSARIAL REVIEW

Date: 2026-08-08 (America/Chicago; review run 2026-08-09 local)
Reviewer seat: Cursor-hosted adversarial reviewer (instrument-independent)
Scope: Texas L2 parcel acquisition Waves 0–2 claims only
Constraints honored: SELECT-only against deployment Neon; no ingest; no atoms Neon; no production writes; no spawned agents; exit-bounded commands.

## Verdict

**NOT REFUTED (with conditions)**

Every attackable store/code/artifact claim survived independent verification. Conditions and papered-over gaps are listed below; they are operational hazards, not successful claim kills.

Supporting raw instrument dump: `_inbox/2026-08-08_L2_WAVES_0_2_ADVERSARIAL_VERIFY_RAW.json`.

---

## 1. gh verify Wave 0 (PR #399 / CI conclusion STRING)

**Attack:** `gh api` on PR and cited Actions run (not planner prose).

**Evidence (verbatim):**

```json
{"merge_commit_sha":"fb6a42b22d7855b08d6d5de228f41eba298e2629","merged":true,"merged_at":"2026-08-09T00:40:14Z","state":"closed","title":"fix(txgio): derive CLI loaded-record from store, not hand map"}
```

```json
{"conclusion":"success","event":"pull_request","head_sha":"71e67b62f78efc4babc8b0887befb2e223f23f2f","html_url":"https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/31286138409","id":31286138409,"name":"PR Checks","status":"completed"}
```

Merge-commit check-runs (additional probe): Typecheck=`success`, Test=`success`, Build & push image=`success`; several deploy jobs `skipped` (not failures). Standing gate is CI conclusion STRING `success` on the cited PR Checks run — present.

**Result:** claim SURVIVED.

---

## 2. Code inspect — `loaded before` store-derived

**Attack:** read `cli.ts` at merge commit / worktree `P:\legacy-design-tools-wave0` @ `fb6a42b2`, not planner notes.

**Evidence (verbatim from `git show` / worktree main):**

```
// Store-derived: yes when rowsExisting > 0, no when 0, unknown when
// dry-run had no DATABASE_URL. Do not use isTxgioCountyLoaded /
// TXGIO_COUNTIES here — that hand map is for jurisdictions.ts only.
log(`loaded before:    ${storeLoadedLabel(rowsExisting)}`);
```

`rowsExisting` is assigned via `countCountyParcels(...)`. `--list` path uses `listLoadedCountyFips` / `storeListLoadState`.

**Hostile check on primary checkout `P:\legacy-design-tools`:** working tree still contains the old line `isTxgioCountyLoaded(county.fips)` for `loaded before` (dirty/behind branch). That does **not** refute the merge claim; it does prove an operator hazard if someone runs Wave 3 from the wrong tree.

**Result:** claim SURVIVED at `fb6a42b2`. Papered-over checkout hazard noted in §4.

---

## 3. SQL — independent store probe

**Env:** `DATABASE_URL` from `gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project legacy-design-tools-prod`. Python + psycopg2, `readonly=True`.

**Verbatim results (adversarial script):**

| Probe | Independent value |
|---|---|
| `count(DISTINCT county_fips)` | **79** |
| Wave1 membership row sum (10 FIPS) | **87832** |
| Wave2 membership row sum (50 FIPS) | **748871** |
| Wave1 missing (rows=0) | **[]** |
| Wave2 missing (rows=0) | **[]** |
| `48035` Bosque rows | **0** |
| `48129` Donley rows | **0** |
| unexpected FIPS beyond `TXGIO_COUNTIES ∪ wave1 ∪ wave2` | **[]** |
| missing expected FIPS from that set | **[]** |
| global outside-Texas rows (`west_lng < -107 OR > -93 OR south_lat < 25 OR north_lat > 37`) | **0** |
| Wave1 seam mean / min / max | **2.266 / 1.5179 / 4.461** |

Kenedy `48261` still **2400** rows (Wave 0 idempotent floor held after Waves 1–2).

Wave1 "29 distinct after Wave 1" cannot be time-traveled in live SQL (store is post-Wave2). Set arithmetic corroborates: `|TXGIO_COUNTIES(19) ∪ wave1(10)| = 29`. Live distinct now 79 = 29 + 50.

**Result:** store claims SURVIVED.

---

## 4. Dry vs apply per county (not aggregate)

**Attack:** sampled 5 Wave1 + 10 Wave2 per-county JSON artifacts; also full-scanned all 10 + 50 for dry.features/delete/insert == apply1.*; cross-checked sample logs vs JSON.

Samples Wave1: `48173,48033,48345,48413,48017`
Samples Wave2: `48357,48495,48069,48111,48295,48003,48319,48127,48063,48425`

**Result:**
- Sample dry_predicts_apply: 5/5 and 10/10 true
- Full scan mismatches: Wave1 **0**, Wave2 **0**
- Missing artifacts: **none**
- Incomplete dry/apply fields: **none** (would have been a hard REFUTATION; not found)
- Log↔JSON match on sampled counties: true (Wave1/Wave2)

Wave 0 Kenedy dry log (verbatim excerpt):

```
[txgio-ingest] loaded before:    yes
[txgio-ingest] features would load: 538
[txgio-ingest] rows would delete:  2400
[txgio-ingest] rows would insert:  2400
```

Apply1/apply2 logs and reproof JSON: 538/2400/2400; match.

**Result:** per-county dry=apply claim SURVIVED.

---

## 5. Idempotency

**Attack:** for samples + full scan: apply2.delete == apply2.insert == apply1.insert and after.rows == apply1.insert; SQL count matches apply1.insert.

**Result:** sample idempotent 5/5 and 10/10; full-scan idempotency mismatches 0; SQL matches apply1.insert on all sampled and scanned counties.

**Result:** claim SURVIVED.

---

## 6. Bbox — independent store vs StratMap SHP header

**Attack:** for 3 Wave1 + 3 Wave2 counties, SELECT rounded store bbox (`west_lng/east_lng/south_lat/north_lat`), download StratMap zip with browser UA, parse SHP main-file header doubles at bytes 36–67, round to 4dp, compare four edges.

Targets: `48173,48345,48017` (W1); `48357,48003,48063` (W2).

**Result:** matched = `[true, true, true, true, true, true]`. No edge deltas. Example (Bailey 48017): store and SHP both `(-103.048, 33.7962, -102.518, 34.3187)`.

**Result:** claim SURVIVED on independent recompute.

---

## 7. Silent skips

Every membership FIPS has rows > 0. Missing list empty for Wave1 and Wave2.

**Result:** claim SURVIVED.

---

## 8. Blast radius

- Unexpected store FIPS outside original-19 `TXGIO_COUNTIES` + wave1 + wave2: **none**
- Forbidden `48035` / `48129`: **zero rows**

**Result:** claim SURVIVED.

---

## 9. TXGIO_COUNTIES drift (required finding)

**Attack:** extract hardcoded `TXGIO_COUNTIES` keys from worktree `counties.ts` @ `fb6a42b2`.

**Evidence:** 19 keys only:

`48021,48027,48029,48055,48085,48091,48113,48121,48139,48187,48209,48251,48257,48309,48367,48397,48439,48453,48491`

Store has **79** distinct FIPS → **60** loaded counties absent from the hand map (includes Kenedy + all Wave1 new + all Wave2).

`isTxgioCountyLoaded` / `jurisdictions.ts` composition still omit newly loaded counties. CLI ingest summary/`--list` are store-derived; product jurisdiction composition is not.

**Result:** FINDING CONFIRMED (operational gap). Does not refute the Wave 0 CLI claim; it proves the split the PR documented is still live debt.

---

## 10. TLS recipe `NODE_OPTIONS=--use-system-ca`

**Independent probes (Kenedy StratMap URL, Node v24.11.1):**

| Probe | Result |
|---|---|
| No `NODE_OPTIONS`, Chrome UA | `fetch failed` (TLS) |
| `NODE_OPTIONS=--use-system-ca`, bare UA / short Mozilla | HTTP **403** |
| `NODE_OPTIONS=--use-system-ca` + full Chrome UA (matches `download.ts` `BROWSER_UA`) | HTTP **200**, **334740** bytes |
| Python urllib + Chrome UA | HTTP **200** |

Library already sends `BROWSER_UA` in `lib/cad-ingest/src/download.ts`. Recipe as used by the ingest CLI is therefore `NODE_OPTIONS=--use-system-ca` **plus** browser UA (code-default), not the env flag alone.

**Result:** claim SURVIVED with condition (UA is load-bearing; env flag alone is not).

---

## Claims REFUTED vs SURVIVED

### REFUTED
*(none of the named Wave 0–2 claims)*

### SURVIVED (attacked and held)
- PR #399 merged_at / merge sha `fb6a42b2` / CI conclusion STRING `success`
- CLI `loaded before` store-derived at merge (`storeLoadedLabel(rowsExisting)`)
- TLS recipe works under real ingest conditions (system CA + browser UA)
- Kenedy re-proof metrics 538/2400/2400; store still 2400; loaded_before yes
- Wave1 10/10; row sum 87832; seam mean 2.266 (range 1.5179–4.461); not uniform 4.46
- Wave1 dry=apply and idempotent per county (full membership)
- Wave1 no silent skips
- Wave2 50/50; row sum 748871; dry=apply and idempotent per county (full membership)
- Final distinct county_fips = 79
- Zero rows outside Texas bounds (global)
- Bosque 48035 and Donley 48129 absent; no unexpected FIPS blast radius

### CONDITIONS / NOT INDEPENDENTLY RE-TIMED
- Wall clocks ~323s / ~654s and "8 concurrent": accepted from artifacts (`wall_clock_ms` 322536 / 653869; `batch_size: 8`). Not re-executed. No contradictory evidence in logs/artifacts.
- Historical "29 distinct after Wave 1": corroborated by set arithmetic + planner post-verify artifact; live SQL now shows 79 (post-Wave2), as expected.

---

## Anything the planner papered over

1. **Checkout hazard:** `P:\legacy-design-tools` primary tree still has pre-#399 `loaded before` wiring. Waves ran from `P:\legacy-design-tools-wave0` @ merge. Wave 3 from the wrong tree silently reintroduces hand-map lies.
2. **TXGIO_COUNTIES / jurisdictions drift:** 19 hardcoded vs 79 store-loaded. CLI honesty does not equal product-surface honesty.
3. **Wave1 "87832 rows landed" framing:** includes Kenedy control re-apply (2400 already present). Net-new rural mass is 87832 − 2400 = 85432. Not false; easy to over-read as net-new.
4. **Wave0 dryrun.log capture quality:** PowerShell `NativeCommandError` noise from pg SSL warning stderr; em dash mojibake (`DRY RUN ΓÇö`). Metrics still present and consistent; artifact hygiene is imperfect.
5. **Cost:** honestly declared unobtainable — not papered as zero.
6. **TLS slogan incompleteness:** env-only `NODE_OPTIONS` without browser UA fails (403 / TLS). Ingest code supplies UA; recipe docs that omit UA are fragile.

---

## Wave 3 readiness (adversarial seat)

**Green for another degree-vintage parallel wave under the same recipe**, provided:

1. Operator go remains the gate (membership already marks `wave3_hold`).
2. Execute only from a tree at/after `fb6a42b2` (prefer clean worktree; do not trust dirty primary).
3. Keep `NODE_OPTIONS=--use-system-ca`; do not strip library browser UA; do not default `NODE_TLS_REJECT_UNAUTHORIZED=0`.
4. Continue per-county dry→apply→apply2 artifacts; halt on any dry≠apply.
5. Treat `TXGIO_COUNTIES` drift as open product debt — do not let `--list`/CLI honesty be mistaken for jurisdictions composition truth.
6. Do not expand into Donley `48129` (404) or Bosque `48035` (`never_unattended`) without separate decisions.
7. Do **not** treat L2 landings as atom/warm clearance: prior consumption-contract adversarial still holds FATAL GAPS; fabric land ≠ factory consume.

Adversarial posture for Wave 3: same instrument independence. A clean Wave 2 does not buy trust without re-SQL.

---

## Instrument inventory (what this review actually ran)

1. `gh api` PR #399 + Actions run 31286138409 + merge-commit check-runs
2. Code read of `cli.ts` / `counties.ts` / `download.ts` at wave0 worktree `fb6a42b2`
3. SELECT-only Neon probes (distinct, per-FIPS counts, seam, bbox, outside-Texas, forbidden FIPS, blast radius)
4. Full dry/apply/idempotency scan of all Wave1+Wave2 per-county JSON + log cross-check samples
5. Independent StratMap zip download + SHP header parse for 6 counties
6. TLS matrix (system-ca / UA combinations)

A review that only read planner totals and nodded would be a FAILED review. This one tried to break each claim; the claims held.
