---
id: 2026-08-25_county8_bexar_48029_handoff
title: Handoff — Texas leftover county 8 is Bexar 48029
date: 2026-08-25
status: ready_after_bandera_keep
plan_row: P-78
from: integration planner
to: leftover apply agent
---

# County 8 handoff

Bandera 48019 KEEP is filed. Paste everything below the line into one leftover-apply session. Quote `--vintage`. One FIPS. Then stop.

Bexar is large (~710k StratMap features). Still one county. Expect a long apply. Do not start a second FIPS.

---

You are writing one leftover county onto `cad_property`. The county is **Bexar 48029**. Not Bandera rewrite. Not Atascosa. Not Bastrop. Not Caldwell. Not Hays. Not Williamson. Not Travis. Not Dallas. Not Tarrant. Not Blanco. Not Comal.

Pin is live on `P:/doc_repo` `main` `9753b83` (re-verify HEAD). `--check --packet` must include `ldtSha` exactly `46e1a5a1`. A full 40-char SHA fails.

L17 is the inspect vintage pin, not a stop. Leftover still writes. Registry row `tx-48029` declares **2025 / stratmap-roll**. Re-verify. If leftover year equals that declared year, leftover is on the inspect read set. Set `inspectReadSet=true`. Still `willFlipL17=false`. Do not flip L17.

If leftover year ≠ declared year, `inspectReadSet=false` and `willFlipL17=false`.

## Snapshot (re-verify)

- Integration `P:/doc_repo` `main`. Declare your own seat, worktree, branch, commit.
- Serving writer: `P:/tmp/ldt-p78-bastrop` detached. `git rev-parse HEAD` must start with `46e1a5a1`. `feat/s1-instrument-hardening` is forbidden.
- Cortex `cortex-api-00584-gaf`. PE #222 `9224a73` smartsite.cloud.
- P-25 / P-09 / COVER `ready:false`. Tarrant KEEP 975885. No DELETE.
- Already written. Do not rewrite: Caldwell 48055 @ 2025 n=24989. Bastrop 48021 @ 2025 n=77799. Hays 48209 @ 2025 n=172116. Williamson 48491 @ 2025 n=282570. Travis 48453 @ 2025 n=380918. Atascosa 48013 @ 2025 n=34649. Bandera 48019 @ 2025 n=32755. Confirm those from `_inbox/2026-08-25_leftover_queue.md` before you write.
- Gold `48021:34137` living area HOLD. `48453:280238` stays lookup-failed.
- Memory pin stays.

## Standing

Cotality extinguished. Deploys planner-owned. Public-record only. CTX/national held. Code-done is not customer-done. One atoms `--apply` slot. `ready:true` means already serving, not write-allowed.

## Read this order, then execute

1. `_STATE.md` then `MEMORY.md` then `_scratch/parcel-facts-write-path.md`
2. `_inbox/2026-08-25_factory_operating_instructions.md` (L17 section)
3. `_inbox/2026-08-25_cad_ingest_apply_gate_WDLL.md`
4. `_inbox/2026-08-25_leftover_queue.md`
5. `_inbox/2026-08-25_review_bandera_48019_leftover.md` (must be KEEP)
6. This file

## First commands

```
node scripts/cad-ingest-apply-gate.mjs --self-test
node scripts/factory-routing-readiness.mjs --check
```

Both must PASS. Writer tree: `git rev-parse HEAD` on `P:/tmp/ldt-p78-bastrop`. Must start with `46e1a5a1`.

Copy `scripts/fixtures/cad-ingest-apply-gate/packet.template.json` to `_inbox/2026-08-25_p78_announce_bexar_48029_packet.json`.

## Packet rules

1. FIPS is `48029`. `countyCount=1`. `secondCounty=false`.
2. All-year census, no `tax_year =` filter. Literal `'48029'`. File leftover year and declared L17 year even if n=0.

```
SELECT tax_year, COUNT(*)::int AS n,
       COUNT(year_built)::int AS yb,
       COUNT(land_acres)::int AS la
FROM cad_property
WHERE county_fips = '48029'
GROUP BY tax_year
ORDER BY tax_year
```

3. Path is derived. Leftover year n=0 is Path B. Leftover year n>0 is Path A. If n rises on apply, the announce says Path A update plus N new keys.
4. Declared is from live registry, re-verified. Hint (re-verify): `tx-48029` is 2025 / stratmap-roll. If leftover year is 2025, `inspectReadSet=true` and `willFlipL17=false`. If leftover year ≠ declared, `inspectReadSet=false` and `willFlipL17=false`.
5. `allowStratmapFallback=false`. `p25Ready=false`. `pinCheckPass=true` only after the pin `--check` you just ran.
6. `sourceVintage` starts with `tier:stratmap-roll;`. Confirm drop from the CLI / zip. Name the DBF year from the zip in the announce.
7. `ldtSha` is the string `46e1a5a1`.

```
node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_bexar_48029_packet.json
```

No PASS, no write.

## Apply

Announce `_inbox/2026-08-25_p78_announce_bexar_48029.md` before the upsert log starts. Keep after-counts out of the pre-apply announce. Isolated LDT at `46e1a5a1`. `--county=48029` only. No fallback flag.

Quote `--vintage` in PowerShell:

```
pnpm --filter @workspace/cad-ingest stratmap-landuse -- --county=48029 "--vintage=tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48029_lp"
```

Confirm the drop name from the zip / CLI. File before JSON, apply log, after JSON. Count prop_id `0` and do not call it success.

If leftover year equals declared L17, probe one Bexar inspect parcel on smartsite.cloud and file structuralFact yearBuilt / livingAreaSqft / landAcres. Do not use `48021:34137` or `48453:280238`. If leftover year ≠ L17, skip the inspect probe and say why.

Then stop. File `_inbox/2026-08-25_p78_bexar_48029_leftover_close.json` with leave_behind. Do not commit.

## Do not

48019 rewrite. 48013. 48021. 48055. 48209. 48491. 48453. 48113. 48439. P-80. 280238 overlay. L17 flip. Atoms `--apply`. Rematerialize. Gold 2800 restore. Memory pin raise. A second county in the same session.
