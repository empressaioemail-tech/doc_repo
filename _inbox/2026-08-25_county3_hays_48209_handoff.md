---
id: 2026-08-25_county3_hays_48209_handoff
title: Handoff — Texas fill county 3 is Hays 48209
date: 2026-08-25
status: filed
plan_row: P-78
from: integration reviewer
to: leftover apply agent
---

# County 3 handoff

Paste everything below the line into the other agent's session.

---

You are writing one leftover county onto `cad_property`. The county is **Hays 48209**. Not Bastrop. Not Caldwell. Not Travis. Not Dallas. Not Tarrant.

Pin is live on `P:/doc_repo` `main` `d52ddc0`. `--check --packet` must include `ldtSha` exactly `46e1a5a1`. A full 40-char SHA fails.

## Snapshot (re-verify)

- Integration `P:/doc_repo` `main` `d52ddc0`. Declare your own seat, worktree, branch, commit.
- Serving writer: detached or origin/main at `46e1a5a1` only. `git rev-parse HEAD` must start with `46e1a5a1`. Log that SHA in the announce. `feat/s1-instrument-hardening` is forbidden.
- Cortex `cortex-api-00584-gaf`. PE #222 `9224a73` smartsite.cloud.
- P-25 / P-09 / COVER `ready:false`. Tarrant KEEP 975885. No DELETE.
- Already written: Caldwell 48055 @ 2025 n=24989 (Path B, L17 2026). Bastrop 48021 @ 2025 n=77799 (Path A plus 726 inserts, L17 2025). Do not rewrite either.
- Gold `48021:34137` living area HOLD (null, was 2800). Do not restore it this card.
- Memory pin stays.

## Standing

Cotality extinguished. Deploys planner-owned. Public-record only. CTX/national held. Code-done is not customer-done. One atoms `--apply` slot. `ready:true` means already serving, not write-allowed.

## Read this order, then execute

1. `_STATE.md` then `MEMORY.md` then `_scratch/parcel-facts-write-path.md`
2. `_inbox/2026-08-25_factory_operating_instructions.md`
3. `_inbox/2026-08-25_cad_ingest_apply_gate_WDLL.md`
4. `_inbox/2026-08-25_review_bastrop_48021_leftover.md` (why gold is banned)
5. This file

## First commands

```
node scripts/cad-ingest-apply-gate.mjs --self-test
node scripts/factory-routing-readiness.mjs --check
```

Both must PASS. Writer tree: `git rev-parse HEAD` on the LDT checkout you will run. Must start with `46e1a5a1`. If not, stop and check out that SHA.

Copy `scripts/fixtures/cad-ingest-apply-gate/packet.template.json` to `_inbox/2026-08-25_p78_announce_hays_48209_packet.json`.

## Packet rules

1. FIPS is `48209`. `countyCount=1`. `secondCounty=false`.
2. All-year census, no `tax_year =` filter. File leftover year and declared L17 year even if n=0.

```
SELECT tax_year, COUNT(*)::int AS n,
       COUNT(year_built)::int AS yb,
       COUNT(land_acres)::int AS la
FROM cad_property
WHERE county_fips = '48209'
GROUP BY tax_year
ORDER BY tax_year
```

3. Path is derived. Leftover year n=0 is Path B. Leftover year n>0 is Path A. If n rises on apply, the announce says Path A update plus N new keys, not pure in-place.
4. If leftover year ≠ declared L17 year: `inspectReadSet=false`, `willFlipL17=false`.
5. `allowStratmapFallback=false`. `p25Ready=false`. `pinCheckPass=true` only after the pin `--check` you just ran.
6. `sourceVintage` starts with `tier:stratmap-roll;`.
7. `ldtSha` is the string `46e1a5a1`. Not the 40-char form.

```
node scripts/cad-ingest-apply-gate.mjs --check --packet _inbox/2026-08-25_p78_announce_hays_48209_packet.json
```

No PASS, no write.

## Apply

Announce `_inbox/2026-08-25_p78_announce_hays_48209.md` before the upsert log starts. Isolated LDT at `46e1a5a1`. `--county=48209` only. No fallback flag. TxGIO fetch is fine (`NODE_OPTIONS=--use-system-ca` if TLS needs it). File before JSON, apply log, after JSON (same all-year query). Count prop_id `0` and do not call it success.

If leftover year equals declared L17, probe one Hays inspect parcel on smartsite.cloud and file the structuralFact yearBuilt / livingAreaSqft. Do not use `48021:34137`.

Then stop. File `_inbox/2026-08-25_p78_hays_48209_leftover_close.json` with leave_behind. Review is the next card.

## Do not

48021. 48055 rewrite. 48453 / Travis CAMA. 48113. 48439. L17 flip. Atoms `--apply`. Rematerialize. Gold 2800 restore. Memory pin raise. Full-SHA `ldtSha`. A second county in the same session.

## Why Hays

County 2 was unnamed and they picked gold Bastrop. The first apply ran on the hardening branch and wiped gold living area. County 3 is named so that cannot happen again. Hays is CAPCOG, not the gold FIPS, not Travis, not bulk_primary.
