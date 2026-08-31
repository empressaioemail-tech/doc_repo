---
id: 2026-08-25_county5_travis_48453_handoff
title: Handoff — Texas fill county 5 is Travis 48453 leftover only
date: 2026-08-25
status: ready_after_williamson_keep
plan_row: P-78
from: integration planner
to: leftover apply agent
---

# County 5 handoff

Williamson 48491 KEEP is filed. Paste everything below the line into the leftover apply session. Quote `--vintage`. Do not start from the KEEP review chat.

---

You are writing one leftover county onto `cad_property`. The county is **Travis 48453**. Leftover only. Not Travis CAMA. Not P-80. Not 280238 overlay. Not Bastrop. Not Caldwell. Not Hays. Not Williamson rewrite. Not Dallas. Not Tarrant.

Pin is live on `P:/doc_repo` `main` `9753b83` (re-verify HEAD). `--check --packet` must include `ldtSha` exactly `46e1a5a1`. A full 40-char SHA fails.

L17 is the inspect vintage pin, not a stop. Leftover still writes. If leftover year is not the declared year, set `inspectReadSet=false` and `willFlipL17=false`. Do not flip L17 mid-apply.

## Snapshot (re-verify)

- Integration `P:/doc_repo` `main`. Declare your own seat, worktree, branch, commit.
- Serving writer: `P:/tmp/ldt-p78-bastrop` detached. `git rev-parse HEAD` must start with `46e1a5a1`. `feat/s1-instrument-hardening` is forbidden.
- Cortex `cortex-api-00584-gaf`. PE #222 `9224a73` smartsite.cloud.
- P-25 / P-09 / COVER `ready:false`. Tarrant KEEP 975885. No DELETE.
- Already written. Do not rewrite: Caldwell 48055, Bastrop 48021, Hays 48209, and Williamson 48491 after KEEP. Confirm the 2025 n values from `_inbox/2026-08-25_leftover_queue.md` before you write.
- Gold `48021:34137` living area HOLD. `48453:280238` stays lookup-failed. Do not overlay it.
- Memory pin stays.

## Standing

Cotality extinguished. Deploys planner-owned. Public-record only. CTX/national held. Code-done is not customer-done. One atoms `--apply` slot. `ready:true` means already serving, not write-allowed.

## Read this order, then execute

1. `_STATE.md` then `MEMORY.md` then `_scratch/parcel-facts-write-path.md`
2. `_inbox/2026-08-25_factory_operating_instructions.md` (L17 section)
3. `_inbox/2026-08-25_cad_ingest_apply_gate_WDLL.md`
4. `_inbox/2026-08-25_leftover_queue.md`
5. `_inbox/2026-08-25_review_williamson_48491_leftover.md` (must be KEEP)
6. This file

## First commands

```
node scripts/cad-ingest-apply-gate.mjs --self-test
node scripts/factory-routing-readiness.mjs --check
```

Both must PASS. Writer tree: `git rev-parse HEAD` on `P:/tmp/ldt-p78-bastrop`. Must start with `46e1a5a1`.

Copy `scripts/fixtures/cad-ingest-apply-gate/packet.template.json` to `_inbox/2026-08-25_p78_announce_travis_48453_packet.json`.

## Packet rules

1. FIPS is `48453`. `countyCount=1`. `secondCounty=false`.
2. All-year census, no `tax_year =` filter. Literal `'48453'`. File leftover year and declared L17 year even if n=0.

```
SELECT tax_year, COUNT(*)::int AS n,
       COUNT(year_built)::int AS yb,
       COUNT(land_acres)::int AS la
FROM cad_property
WHERE county_fips = '48453'
GROUP BY tax_year
ORDER BY tax_year
```

3. Path is derived. Leftover year n=0 is Path B. Leftover year n>0 is Path A. If n rises on apply, the announce says Path A update plus N new keys.
4. If leftover year ≠ declared L17 year: `inspectReadSet=false`, `willFlipL17=false`.
5. `allowStratmapFallback=false`. `p25Ready=false`. `pinCheckPass=true` only after the pin `--check` you just ran.
6. `sourceVintage` starts with `tier:stratmap-roll;`. Confirm drop from the CLI / zip.
7. `ldtSha` is the string `46e1a5a1`.

Hint (re-verify): registry `tx-48453` declares 2026 / cad-export. Derive path from the census.

```
node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_travis_48453_packet.json
```

No PASS, no write.

## Apply

Announce `_inbox/2026-08-25_p78_announce_travis_48453.md` before the upsert log starts. Keep after-counts out of the pre-apply announce. Isolated LDT at `46e1a5a1`. `--county=48453` only. No fallback flag.

Quote `--vintage` in PowerShell. Unquoted `;` splits the argument. Williamson first pass stamped `tier:stratmap-roll` only. Use:

```
pnpm --filter @workspace/cad-ingest stratmap-landuse -- --county=48453 "--vintage=tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48453_lp"
```

Confirm the drop name from the zip / CLI. File before JSON, apply log, after JSON. Count prop_id `0` and do not call it success.

If leftover year equals declared L17, probe one Travis inspect parcel that is not `48453:280238`. If leftover year ≠ L17, skip the inspect probe.

Then stop. File `_inbox/2026-08-25_p78_travis_48453_leftover_close.json` with leave_behind. Do not commit.

## Do not

48021. 48055. 48209. 48491 rewrite. 48113. 48439. P-80. 280238 overlay. Travis CAMA. L17 flip. Atoms `--apply`. Rematerialize. Gold 2800 restore. Memory pin raise. A second county in the same session.
