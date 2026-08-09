---
id: 2026-08-08_L2_WAVE3_RESUME_ADVERSARIAL_REVIEW
title: Adversarial review — L2 Wave 3 resume (attempt 2)
date: 2026-08-08
status: complete
owner: adversarial-reviewer
mode: refute-not-bless
---

# L2 Wave 3 resume — adversarial review

**Verdict: PARTIAL, with the mechanical claims surviving unusually well and the framing claims failing.** Every per-county data claim survives independent SQL and independent raw-log parsing across all 22 landed counties with zero mismatches. Two claims are KILLED as written because the events they describe did not happen: the resume halted a second time and Bosque plus the five metros never ran. Two documents carry defects: the placeholder-family doc misnames Henderson County as Kaufman and asserts a five-record DBF attribute table that no artifact on disk corroborates, and both new docs cite a `related:` file that does not exist.

Reviewer ran SELECT-only probes against the TxGIO deployment Neon via the direct non-pooler host `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech/neondb` (fingerprint checked for the substring `pooler` before every session; absent). No write, ingest, merge, deploy, or test-suite run. The baseline snapshot was captured at 22:47:56 CDT before the resume had written any row, which is what makes the claim-1 and claim-6 checks independent rather than after-the-fact.

## What actually happened

The resume ran the 30-county batch phase in four batches of eight. It landed 22 counties, then halted in batch 3 when Henderson 48213 and Liberty 48291 both failed dry-run with the same fail-closed envelope guard that stopped Wood. Because the orchestrator halts the wave on any failure, the remaining 12 members were never started: 48245, 48423, 48167, 48355, 48061, 48215, Bosque 48035, and all five metros 48039, 48141, 48339, 48157, 48201. Store went from 159 distinct / 9,226,564 rows to 181 distinct / 10,810,225 rows, adding 1,583,661 rows.

## Claim table

| # | Claim | Verdict | Evidence |
|---|---|---|---|
| 1 | Store truth at resume start was 159 distinct / 9,226,564 rows | **SURVIVES** | Own query at 22:47:56 CDT, before any resume write: `159\|9226564`. Independently re-derived by summing a per-county snapshot: `SUM_ROWS=9226564` across 159 rows. The orchestrator log's own baseline line agrees: `Baseline distinct county_fips: 159; rows: 9226564`. |
| 2 | Resume set sized from the STORE at execution time, equals membership-117 minus already-loaded minus parked Wood | **SURVIVES** | Derived independently: 117 FIPS from `membership.json`, 159 from my own baseline snapshot, `comm -23` gives 37, `diff` against the 37 FIPS in `membership_resume2.json` returns IDENTICAL. Partition is 30 batch + 1 `bosque_solo` + 5 `solo_last` = 36 runnable, plus Wood parked. Wood is enforced in code, not merely documented: `orchestrator_a2.mjs` `FORBIDDEN = new Set(["48129", "48499"])`. |
| 3 | Every claimed-landed county has rows, and SQL count equals `rows_written` — every county, not sampled | **SURVIVES** | All 22 checked individually. Zero mismatches. See the per-county table below. |
| 4 | Dry predicted apply EXACTLY on every resumed county, verified against artifact AND raw log text | **SURVIVES** | All 22 verified twice: once from artifact JSON, once by re-parsing `_a2_dry.log` and `_a2_apply1.log` directly. Zero mismatches on features, delete, and insert in both passes. The artifacts are not mis-parsed. |
| 5 | Idempotency verified PER COUNTY (apply2 held the row count), not sampled | **SURVIVES** | All 22 have `idempotent_row_count_held: true`. Independently confirmed from raw `_a2_apply2.log`: for every county, apply2 `rows delete` == apply2 `rows insert` == apply1 `rows insert`. Zero exceptions. |
| 6 | Nothing outside the resume membership was written | **SURVIVES** | `comm` of my pre-run baseline against the live set: exactly 22 new FIPS, all 22 inside the resume-37 set, `UNEXPECTED_FIPS` empty. Prior 159 all still present (empty diff). No non-`48%` FIPS in the store. |
| 7 | Zero rows outside Texas degree bounds for every landed county | **SURVIVES** | Run myself, per county and store-wide. Store-wide under the strict claim bound (`west_lng < -107 OR west_lng > -93 OR south_lat < 25 OR north_lat > 37`): `0`. Under the actual code bound (-107.5): `0`. Per-county violations across all 22: all zero, with every county bbox landing inside its plausible Texas extent. |
| 8 | Wood 48499 has zero rows, absence is honest and named, guard unmodified | **SURVIVES on the mechanics; the ruling's REASONING is CONDITIONED** | `SELECT count(*) WHERE county_fips='48499'` → `0`. Ruling document exists and a reader would find it. Guard verified unmodified: `git status --porcelain lib/cad-ingest` empty, `git diff -- lib/cad-ingest` empty, `TEXAS_WGS84_BOUNDS` still `-107.5 / 25.0 / -93.0 / 37.0`, `assertTexasWgs84Bbox` unchanged. But the ruling's core cost argument no longer holds — see the ruling analysis below. |
| 9 | Five largest counties ran INDIVIDUALLY and LAST, Bosque ran ALONE — verify from orchestrator log ordering | **KILLED as stated** | None of them ran. Orchestrator log ends `==== WAVE 3 DONE ====` with `"landed": 22, "failed": 2, "notStarted": 12`. `not_started_fips` contains 48035, 48039, 48141, 48339, 48157, 48201. All six confirmed zero rows by SQL. What CAN be verified is the *intended* ordering in code (`runPhase("batch") → runPhase("solo_bosque") → runPhase("solo_metro")`, with asserts that `bosque_solo` must be 48035, `solo_last` must be 5, no metro may sit in the concurrent batch, and Harris 48201 must be last) — but intent in code is not execution, and the run never reached those phases. |
| 10 | Bosque's byte anomaly was actually INSPECTED and explained, not just ingested | **SURVIVES, with a correction** | Bosque was never ingested at all, so the claim's premise inverts — but the inspection genuinely exists and is quantitatively sound. `BOSQUE_48035_INSPECTION.md` is a read-only source probe, and every number in it reproduces: 104,239,810/19,975 = 5,218.5 bytes/parcel; ratio to the 488.4 median = 10.68x (doc says 10.69x); 125,161,032/19,975 = 6,265.9 SHP bytes/record (doc says 6,266); 7,751,827/19,975 = 388.08 mean vertices (doc says 388.1); 23,250/19,975 = 1.1640 rings (doc says 1.16). The explanation is load-bearing, not hand-waving: 7,751,827 vertices at 16 bytes per XY double is 124,029,232 bytes, which is **99.1 percent of the 125,161,032-byte SHP**. The vertices literally are the file. Median 9 against mean 388 establishes the minority-of-hyper-detailed-polygons shape. One correction: the doc predicts Bosque's seam factor will exceed "the Wave 3 mean of ~1.30" — the actual mean across the 22 resumed counties is **1.1546**, with 1.3045 being the *maximum* (Wilson 48493), not the mean. The prediction bar is set about 12 percent too high. |

## Per-county verification, all 22 landed

SQL row count against artifact `rows_written`, dry against apply1 on features and insert, idempotency held. Verbatim output:

```
FIPS     SQL_ROWS   ART_ROWS   D_F      A1_F     D_I      A1_I     A2_HELD  MATCH
48005    70445      70445      60693    60693    70445    70445    true     OK
48041    82874      82874      74666    74666    82874    82874    true     OK
48053    59785      59785      50138    50138    59785    59785    true     OK
48135    83202      83202      75891    75891    83202    83202    true     OK
48171    40372      40372      32351    32351    40372    40372    true     OK
48181    100911     100911     89348    89348    100911   100911   true     OK
48183    83706      83706      77816    77816    83706    83706    true     OK
48203    60341      60341      50995    50995    60341    60341    true     OK
48221    57169      57169      51275    51275    57169    57169    true     OK
48231    79774      79774      69728    69728    79774    79774    true     OK
48299    45860      45860      38879    38879    45860    45860    true     OK
48303    144544     144544     135112   135112   144544   144544   true     OK
48329    83887      83887      75645    75645    83887    83887    true     OK
48349    57926      57926      46167    46167    57926    57926    true     OK
48361    56128      56128      50337    50337    56128    56128    true     OK
48373    69616      69616      60178    60178    69616    69616    true     OK
48441    79469      79469      70598    70598    79469    79469    true     OK
48451    68571      68571      58686    58686    68571    68571    true     OK
48471    42463      42463      35582    35582    42463    42463    true     OK
48479    113524     113524     98291    98291    113524   113524   true     OK
48485    65490      65490      58742    58742    65490    65490    true     OK
48493    37604      37604      28827    28827    37604    37604    true     OK
```

Independent re-parse of the raw logs, bypassing the artifacts entirely (dry `features would load` / `rows would delete` / `rows would insert` against apply1 `features load` / `rows delete` / `rows insert`, plus apply2 delete and insert):

```
FIPS  LOG_DRY_F LOG_DRY_D LOG_DRY_I | LOG_A1_F LOG_A1_D LOG_A1_I | LOG_A2_D LOG_A2_I  VERDICT
48005  60693 0 70445 | 60693 0 70445 | 70445 70445  OK
48041  74666 0 82874 | 74666 0 82874 | 82874 82874  OK
48053  50138 0 59785 | 50138 0 59785 | 59785 59785  OK
48135  75891 0 83202 | 75891 0 83202 | 83202 83202  OK
48171  32351 0 40372 | 32351 0 40372 | 40372 40372  OK
48181  89348 0 100911 | 89348 0 100911 | 100911 100911  OK
48183  77816 0 83706 | 77816 0 83706 | 83706 83706  OK
48203  50995 0 60341 | 50995 0 60341 | 60341 60341  OK
48221  51275 0 57169 | 51275 0 57169 | 57169 57169  OK
48231  69728 0 79774 | 69728 0 79774 | 79774 79774  OK
48299  38879 0 45860 | 38879 0 45860 | 45860 45860  OK
48303  135112 0 144544 | 135112 0 144544 | 144544 144544  OK
48329  75645 0 83887 | 75645 0 83887 | 83887 83887  OK
48349  46167 0 57926 | 46167 0 57926 | 57926 57926  OK
48361  50337 0 56128 | 50337 0 56128 | 56128 56128  OK
48373  60178 0 69616 | 60178 0 69616 | 69616 69616  OK
48441  70598 0 79469 | 70598 0 79469 | 79469 79469  OK
48451  58686 0 68571 | 58686 0 68571 | 68571 68571  OK
48471  35582 0 42463 | 35582 0 42463 | 42463 42463  OK
48479  98291 0 113524 | 98291 0 113524 | 113524 113524  OK
48485  58742 0 65490 | 58742 0 65490 | 65490 65490  OK
48493  28827 0 37604 | 28827 0 37604 | 37604 37604  OK
```

Per-county envelope check and bbox, run by the reviewer (columns: fips, violations, total rows, min west, max east, min south, max north):

```
48005|0|70445|-95.0053|-94.1280|31.0261|31.5272
48041|0|82874|-96.6010|-96.0802|30.3315|30.9736
48053|0|59785|-98.4594|-97.8275|30.4262|31.0349
48135|0|83202|-102.7979|-102.2867|31.6508|32.0875
48171|0|40372|-99.3040|-98.5874|30.1344|30.4998
48181|0|100911|-96.9488|-96.3776|33.3966|33.9596
48183|0|83706|-94.9895|-94.5793|32.3617|32.6658
48203|0|60341|-94.7086|-94.0428|32.3265|32.7923
48221|0|57169|-98.0789|-97.6064|32.2344|32.5655
48231|0|79774|-96.2982|-95.8584|32.8367|33.4098
48299|0|45860|-98.9669|-98.3481|30.4858|30.9297
48303|0|144544|-102.0858|-101.5568|33.3889|33.8305
48329|0|83887|-102.2876|-101.7714|31.6513|32.1294
48349|0|57926|-96.8963|-96.0510|31.7966|32.3289
48361|0|56128|-94.1179|-93.6895|29.9666|30.2442
48373|0|69616|-95.2069|-94.5389|30.4790|31.1693
48441|0|79469|-100.1519|-99.6230|32.0806|32.6244
48451|0|68571|-101.2690|-100.1112|31.0863|31.7055
48471|0|42463|-95.8628|-95.3281|30.5043|31.0581
48479|0|113524|-100.2116|-98.7974|27.2600|28.2120
48485|0|65490|-98.9532|-98.4220|33.8340|34.2019
48493|0|37604|-98.4070|-97.7285|28.8825|29.4423
```

Zero-row confirmation for the 12 not-started, the 2 failed, parked Wood, and Donley:

```
48245=0 48423=0 48167=0 48355=0 48061=0 48215=0
48035=0 48039=0 48141=0 48339=0 48157=0 48201=0
48213=0 48291=0 48499=0 48129=0
```

Scope check, reviewer-run:

```
new counties since baseline: 22
48005,48041,48053,48135,48171,48181,48183,48203,48221,48231,48299,48303,48329,48349,48361,48373,48441,48451,48471,48479,48485,48493
UNEXPECTED (new not in resume-37): (empty)
PRIOR 159 MISSING FROM LIVE: (empty)
final: 181|10810225
```

Guard verification, verbatim:

```
$ git status --porcelain lib/cad-ingest
$ git diff -- lib/cad-ingest
(both empty)
$ git rev-parse HEAD
de4fc8b906730f3a036b2c9494b22c1acfb03916

export const TEXAS_WGS84_BOUNDS: GeoBbox = {
  westLng: -107.5,
  southLat: 25.0,
  eastLng: -93.0,
  northLat: 37.0,
};
```

## Attacking the Wood park ruling, now that it is three counties

**Straight verdict: parking was defensible for Wood alone and is no longer defensible as a standing posture. It has become an unsolved blocker wearing a ruling's clothes — but the correct fix is still not a wave-time patch, and the session was right not to take one.**

The ruling's own load-bearing sentence is: "Wood is 44,575 parcels of a roughly 9.3 million row store; the cost of waiting is small and the cost of a bad precedent is not." That cost calculation was honest when the sample was one county. It is now stale. Henderson 48213 and Liberty 48291 add 272,662 estimated parcels to the withheld pile (108,484 + 164,178), and with Wood the withheld total is roughly 317,238 real parcels. More importantly the defect is not the rate limiter's tail, it is the rate limiter itself: three of the 24 counties actually attempted in this resume failed on it, a 12.5 percent hit rate, and every one of those failures halted the entire wave including 12 counties that never got a turn. Bosque and all five metros are unacquired **because of this defect class**, not because of anything wrong with them.

So the honest framing is: the guard is right, the park is honest, and the blocker is unresolved and expensive. What must not happen is a fourth wave that re-runs the same set and re-discovers the same three halts and calls the result a park. The placeholder-family doc's own recommendation (identity-gated per-feature declination, counted and named in the artifact, with a hard ceiling that keeps whole-county projection errors throwing, plus tests in both directions) is the right shape and should be treated as the next blocking engineering item rather than an optional follow-up. I agree with the refusal to patch during the wave: the guard is the only thing between a Pacific Ocean coordinate and the store, the session held no merge authority, and 10.8 million rows with zero out-of-envelope rows is the evidence that strictness paid.

One thing the ruling gets right and deserves credit for surviving scrutiny: the parking is genuinely findable. Wood appears in the membership `parked` array with a pointer to the ruling filename, in `FORBIDDEN` in orchestrator code, in the results artifact, and in a standalone ruling doc. That is a named absence, not a silent drop.

## Attacking the placeholder-family doc

The central claim — that this is a characterized defect family rather than three coincidences — **substantially survives**, and it survives on evidence stronger than the doc itself leans on. Independent corroboration I ran that the doc does not cite: the SHP header bboxes recorded in the per-county artifacts are polluted exactly as predicted. Henderson 48213's header reads `ymin: 13.9244` against a real southern extent near 32.0, and Liberty 48291's reads `ymax: 40.8861` against a real northern extent near 30.5. Those headers come from a separate probe path (`stratmap_zip_shp_header_browser_ua`) than the ingest dry-run, so two independent instruments agree that junk coordinates at latitude ~13.92 and ~40.88 are present in those specific archives. Combined with Wood's `ymin: 13.9197`, the two-cluster pattern (~13.92 and ~40.88) is real and is not an artifact of one parser.

Three defects in the doc, one of them material:

**The DBF attribute table is asserted, not evidenced (material).** The five-row table of `Prop_ID` / `OWNER_NAME` / `GEO_ID` / `MKT_VALUE` for records 43504, 1316, 12770, 2020, and 2027 has **no probe artifact anywhere in `_inbox`**. I grepped for it. The Wood ruling at least reproduced its DBF dump inline for one record. For Henderson and Liberty, nothing on disk backs the attribute claim. Worse, the dry logs cannot corroborate it even in principle: the guard throws on the *first* offending feature, so `48213_a2_dry.log` names only feature 1316 and `48291_a2_dry.log` names only feature 2020 — one "falls outside" line each. The doc's claim that Henderson has a *second* defect at index 12770 and Liberty a second at 2027, and the claim that all five records are null placeholders, both rest entirely on an unrecorded scan. The "null placeholder" characterization is exactly the load-bearing premise of the recommended identity-gated declination path. It should not go into the engineering spec on an unreproducible measurement. **Recommendation: re-run the scan and write the raw output to an artifact before anyone builds against it.**

**County misnamed (should be corrected, low risk of harm but it will confuse a reader).** The doc, and the planner's own summary, call 48213 "Kaufman". FIPS 48213 is **Henderson County**. The orchestrator's own artifact and the membership file both say `"name": "Henderson"`. Kaufman County is FIPS 48257, which is not in this wave. Anyone tracing the finding by county name will look at the wrong county.

**Defect-rate denominator flatters slightly.** The doc says "three counties out of 36 attempted — roughly 8 percent." Only 24 counties were actually attempted; 12 never started. Three of 24 is 12.5 percent. The doc's own number strengthens its argument, so this reads as carelessness rather than spin, but the correct figure is the more alarming one.

## Papered-over gaps

1. **No DBF probe artifact for the placeholder family.** The most consequential empirical claim of the wave — that defective records are attribute-identifiable null placeholders — is unreproducible from anything on disk. Two of the five records (48213 idx 12770, 48291 idx 2027) are not even visible in the dry logs, since the guard throws on the first hit.
2. **48213 is Henderson, not Kaufman.** Propagated into both the planner's summary and the family doc.
3. **Dangling `related:` reference.** Both `PLACEHOLDER_DEFECT_FAMILY.md` and `BOSQUE_48035_INSPECTION.md` list `_inbox/2026-08-08_L2_WAVE3_RESUME_REPORT` in frontmatter. That file does not exist (`ls` returns no such file). The actual report is `2026-08-08_L2_WAVE3_report_a2.md`.
4. **Bosque's seam prediction is calibrated against a wrong mean.** The inspection predicts a seam factor above "the Wave 3 mean of ~1.30". Measured mean across the 22 resumed counties is 1.1546; 1.3045 is the max. If someone later uses 1.30 as the pass bar for Bosque, a genuinely anomalous result could clear it.
5. **`expected_distinct_if_all_land: 276` in `results_a2.json`.** Wave 3's own arithmetic is 159 + 36 = 195. The 276 figure is presumably a whole-Texas horizon number and is unexplained in place; a reader comparing 181 against 276 will conclude the wave is far further behind than it is.
6. **Per-county artifacts overwrite in place.** Landed counties write to `2026-08-08_L2_WAVE3_<fips>.json` with no `_a2` suffix, unlike the logs. Attempt-1 artifacts for re-run counties are gone from that path. This did **not** destroy forensics this time — see below — but the log-suffixing discipline was not applied to the JSON.
7. **A per-feature skip path already exists and is uncounted in the artifacts.** Nine of the 22 landed counties skipped features silently as "no polygon geometry": 48135 (56), 48183 (60), 48171 (12), 48231 (9), 48441 (4), 48181 (2), 48203 (2), 48471 (2), 48329 (1) — 148 features total. These are logged in the raw text but the artifact JSON records only the count, never which records. This matters for the Wood ruling's framing that "a per-feature exclusion path does not exist in the CLI today": a skip path *does* exist for null geometry, it is just not envelope-aware. The distinction is real and the ruling's point stands, but the store is already accepting bounded per-feature declination in one dimension while refusing it in another.
8. **Cost per jurisdiction still not measured.** The family doc states this plainly under W3-COST, which is honest, but it means the structural commitment 3 gate (under 200 dollars per jurisdiction) remains unevidenced for this wave.

## What I verified that the planner claimed, and what I could not

Verified independently and confirmed: baseline 159/9,226,564 captured before any write; the resume set derivation; all 22 landed counties row-for-row against SQL; dry-equals-apply1 from raw logs as well as artifacts; per-county idempotency from raw apply2 logs; zero unexpected FIPS and prior-159 intact; zero rows outside Texas bounds store-wide and per county; zero rows for all 16 of the not-started, failed, parked, and forbidden FIPS; the guard unmodified by both `git status` and `git diff`; the Bosque inspection arithmetic in full; the archive-preservation claim (241 files, directory mtime 22:43:52, one minute before the 22:44 run start — first-attempt logs were preserved, not overwritten, and the earlier review's complaint about destroyed attempt-1 forensics does not recur here).

Could not verify: the DBF attributes of any of the five defective records, because no artifact records them and the dry logs expose only the first offending feature per county. The second defect in each of Henderson and Liberty is unconfirmed by anything I can read. I also could not verify cost per county, because no billing meter was queried by anyone and I did not invent one.

## Verbatim verdict paragraph (paste-ready)

The Wave 3 resume adversarial review is PARTIAL: the mechanical claims survive unusually well and the framing claims do not. Independent SELECT-only probing on the direct non-pooler Neon endpoint confirms baseline 159 distinct / 9,226,564 rows captured before any resume write, a resume set I re-derived myself as exactly membership-117 minus store-159 (37 = 36 runnable plus parked Wood, byte-identical to the planner's file), and a final store of 181 distinct / 10,810,225 rows with 1,583,661 added; all 22 landed counties pass individually with zero mismatches on SQL-versus-artifact row counts, on dry-equals-apply1 re-parsed from the raw logs rather than trusted from the artifacts, and on per-county idempotency read from raw apply2 logs, with zero rows outside Texas degree bounds store-wide and per county, no unexpected FIPS, the prior 159 fully intact, and the envelope guard verified unmodified by empty `git status --porcelain lib/cad-ingest` and empty `git diff -- lib/cad-ingest` at HEAD de4fc8b. Claim 9 is KILLED as stated because the wave halted a second time in batch 3 on Henderson 48213 and Liberty 48291 and the five metros plus Bosque never ran at all — all six verified at zero rows, correctly not-started rather than silently skipped — and claim 10 is corrected rather than killed, since Bosque was never ingested but its inspection is genuinely sound (7,751,827 vertices at 16 bytes is 99.1 percent of the 125 MB SHP, and every cited ratio reproduces), though it miscalibrates its own pass bar by citing a Wave 3 mean seam of 1.30 when the measured mean across the 22 landed counties is 1.1546. The Wood park is CONDITIONED: the absence is genuinely named and findable and the guard was never weakened, but the ruling's cost argument that "the cost of waiting is small" is now stale at three counties, roughly 317,238 withheld parcels, and a 12.5 percent halt rate on counties actually attempted, so parking has become an unsolved blocker rather than a ruling and the identity-gated per-feature declination path must be treated as the next blocking engineering item. Finally, the placeholder-family doc's central thesis survives on evidence stronger than it cites — the SHP header bboxes independently recorded in the artifacts are polluted at ymin 13.9244 for 48213 and ymax 40.8861 for 48291, corroborating the junk-coordinate clusters through a second instrument — but its five-record DBF attribute table, the very premise the recommended declination path would be built on, has no probe artifact anywhere on disk and cannot be corroborated by the dry logs (which name only the first offending feature per county, leaving 48213 index 12770 and 48291 index 2027 entirely unevidenced), and the doc misnames FIPS 48213 as Kaufman when it is Henderson (Kaufman is 48257, not in this wave), so that scan must be re-run and written to an artifact before any engineering is built against it.
