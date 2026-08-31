---
id: 2026-08-25_county31_somervell_48425_handoff
title: Handoff — Texas leftover county 31 is Somervell 48425
date: 2026-08-25
status: ready_after_rockwall_keep
plan_row: P-78
from: integration planner
to: leftover apply agent
---

# County 31 handoff

Rockwall 48397 KEEP is filed. This child writes one leftover county. Quote `--vintage`. One FIPS. Then stop. Do not spawn. Do not commit.

---

You are writing one leftover county onto `cad_property`. The county is **Somervell 48425**. Not Rockwall rewrite. Not Parker. Not Wilson. Not Dallas. Not Tarrant.

Pin is live on `P:/doc_repo` `main` `9753b83` (re-verify HEAD). `--check --packet` must include `ldtSha` exactly `46e1a5a1`. A full 40-char SHA fails.

L17 is the inspect vintage pin, not a stop. Leftover still writes. Registry row `tx-48425` has `current_tax_year` null and `current_tier` null. Do not write a declared vintage onto the registry. Do not flip L17.

If leftover year ≠ a year that already exists on the store as the live roll, set `inspectReadSet=false` and `willFlipL17=false`.

## Snapshot (re-verify)

- Integration `P:/doc_repo` `main`. Declare your own seat, worktree, branch, commit.
- Serving writer: `P:/tmp/ldt-p78-bastrop` detached. `git rev-parse HEAD` must start with `46e1a5a1`. `feat/s1-instrument-hardening` is forbidden.
- Cortex `cortex-api-00584-gaf`. PE #222 `9224a73` smartsite.cloud.
- P-25 / P-09 / COVER `ready:false`. Tarrant KEEP 975885. No DELETE.
- Already written. Do not rewrite: Caldwell 48055 @ 2025 n=24989. Bastrop 48021 @ 2025 n=77799. Hays 48209 @ 2025 n=172116. Williamson 48491 @ 2025 n=282570. Travis 48453 @ 2025 n=380918. Atascosa 48013 @ 2025 n=34649. Bandera 48019 @ 2025 n=32755. Bexar 48029 @ 2025 n=703258. Blanco 48031 @ 2025 n=13648. Burnet 48053 @ 2025 n=49243. Collin 48085 @ 2025 n=387334. Comal 48091 @ 2025 n=103207. Denton 48121 @ 2025 n=351798. Ellis 48139 @ 2025 n=98150. Fayette 48149 @ 2025 n=22432. Frio 48163 @ 2025 n=12489. Gillespie 48171 @ 2025 n=31452. Guadalupe 48187 @ 2025 n=93728. Hood 48221 @ 2025 n=50876. Hunt 48231 @ 2025 n=69542. Johnson 48251 @ 2025 n=100603. Karnes 48255 @ 2025 n=12397. Kaufman 48257 @ 2025 n=93292. Kendall 48259 @ 2025 n=28852. Kerr 48265 @ 2025 n=34594. Lee 48287 @ 2025 n=14769. Llano 48299 @ 2025 n=34821. Medina 48325 @ 2025 n=40571. Parker 48367 @ 2025 n=92583. Rockwall 48397 @ 2025 n=52420. Confirm those from `_inbox/2026-08-25_leftover_queue.md` before you write.
- Gold `48021:34137` living area HOLD. `48453:280238` stays lookup-failed.
- Memory pin stays.

## Standing

Cotality extinguished. Deploys planner-owned. Public-record only. CTX/national held. Code-done is not customer-done. One atoms `--apply` slot. `ready:true` means already serving, not write-allowed.

## Read this order, then execute

1. `_STATE.md` then `MEMORY.md` then `_scratch/parcel-facts-write-path.md`
2. `_inbox/2026-08-25_factory_operating_instructions.md` (L17 section)
3. `_inbox/2026-08-25_cad_ingest_apply_gate_WDLL.md`
4. `_inbox/2026-08-25_leftover_queue.md`
5. `_inbox/2026-08-25_review_rockwall_48397_leftover.md` (must be KEEP)
6. This file

## First commands

```
node scripts/cad-ingest-apply-gate.mjs --self-test
node scripts/factory-routing-readiness.mjs --check
```

Both must PASS. Writer tree: `git rev-parse HEAD` on `P:/tmp/ldt-p78-bastrop`. Must start with `46e1a5a1`.

Load `CORTEX_DATABASE_URL` from `gcloud secrets versions access latest --secret=CORTEX_DATABASE_URL --project=hauska-prod-497015` into a temp file, set `CORTEX_DATABASE_URL` and `DATABASE_URL`, delete the temp file. Do not print the URL.

Copy `scripts/fixtures/cad-ingest-apply-gate/packet.template.json` to `_inbox/2026-08-25_p78_announce_somervell_48425_packet.json`.

## Packet rules

1. FIPS is `48425`. `countyCount=1`. `secondCounty=false`.
2. All-year census, no `tax_year =` filter. Literal `'48425'`. File leftover year and declared L17 year even if n=0.

```
SELECT tax_year, COUNT(*)::int AS n,
       COUNT(year_built)::int AS yb,
       COUNT(land_acres)::int AS la
FROM cad_property
WHERE county_fips = '48425'
GROUP BY tax_year
ORDER BY tax_year
```

3. Path is derived. Leftover year n=0 is Path B. Leftover year n>0 is Path A. If n rises on apply, the announce says Path A update plus N new keys.
4. Leftover tax year is usually 2025. Registry L17 is null. If the store already has a year, file that year as `declared.taxYear` and keep `willFlipL17=false`. If the store has no rows, file leftover 2025 n=0 and declared 2026 n=0 as absent years (not fabricated store rows), `inspectReadSet=false`, `willFlipL17=false`. Do not invent a registry flip.
5. `allowStratmapFallback=false`. `p25Ready=false`. `pinCheckPass=true` only after the pin `--check` you just ran.
6. `sourceVintage` starts with `tier:stratmap-roll;`. Confirm drop from the CLI / zip. Name the DBF year from the zip in the announce.
7. `ldtSha` is the string `46e1a5a1`.

```
node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_somervell_48425_packet.json
```

No PASS, no write.

## Apply

Announce `_inbox/2026-08-25_p78_announce_somervell_48425.md` before the upsert log starts. Keep after-counts out of the pre-apply announce. Isolated LDT at `46e1a5a1`. `--county=48425` only. No fallback flag.

Quote `--vintage` in PowerShell. Set `NODE_OPTIONS=--use-system-ca`.

```
pnpm --filter @workspace/cad-ingest stratmap-landuse -- --county=48425 "--vintage=tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48425_lp"
```

Confirm the drop name from the zip / CLI. File before JSON, apply log, after JSON. Count prop_id `0` and do not call it success.

If leftover year equals a declared store year that inspect would read, probe one Somervell inspect parcel. If leftover year is off that year, or L17 is undeclared, skip the inspect probe and say why. Do not use `48021:34137`, `48453:280238`, `48029:262160`, `48085:10000`, `48091:10003`, `48121:10`, `48187:106109`, or `48257:10005`.

Then stop. File `_inbox/2026-08-25_p78_somervell_48425_leftover_close.json` with leave_behind. Do not commit.

## Do not

48397 rewrite. 48367. 48325. 48299. 48287. 48265. 48259. 48257. 48255. 48251. 48231. 48221. 48187. 48171. 48163. 48149. 48139. 48121. 48091. 48085. 48053. 48031. 48029. 48019. 48013. 48021. 48055. 48209. 48491. 48453. 48113. 48439. 48493. P-80. 280238 overlay. L17 / registry flip. Atoms `--apply`. Rematerialize. Gold 2800 restore. Memory pin raise. A second county in the same session.
