---
id: 2026-08-25_cad_ingest_apply_gate_handoff
title: Handoff — ingest apply gate is live; Texas fill waits on a packet
date: 2026-08-25
status: filed
plan_row: P-78
from: integration reviewer
to: fresh leftover / Texas-fill agent
---

# Ingest-gate handoff

Filed: 2026-08-25
From: integration on `P:\doc_repo` (`main`)
To: the next leftover or CAMA writer
Re: The gate is built. Do not implement it again. Do not apply without a PASS packet.

Paste everything below the line into a fresh session.

---

You are writing one leftover county onto `cad_property`. You are not writing the gate. You are not starting Dallas, Tarrant, Travis CAMA, atoms `--apply`, L17, rematerialize, P-80, P-79, P-09, or COVER.

## Snapshot (re-verify before you act)

- Integration `P:/doc_repo` on `main` at `46e117e` when this was written. Gate files may still be uncommitted. Declare your own seat, worktree, branch, and commit.
- Cortex `cortex-api-00584-gaf` @100%, LDT `46e1a5a1`. PE #222 `9224a73` on smartsite.cloud.
- P-25 / P-09 / COVER stay `ready:false`. Tarrant KEEP 975885. No DELETE.
- Caldwell 48055 leftover already landed: tax_year 2025 n=24989, year_built 16937, land_acres 24989. L17 `tx-48055` stays 2026 / cad-export. Path B insert. Do not rewrite those rows. Do not flip L17.
- Memory pin stays. Do not raise it.

## Standing decisions

- Cotality extinguished. Deploys planner-owned. Public-record only. CTX/national held. Code-done is not customer-done.
- One atoms `--apply` slot. One heavy PostGIS / full-table scan at a time.
- `ready:true` means already serving, not write-allowed.

## Read this order, then execute

1. `_STATE.md` then `MEMORY.md` then `_scratch/parcel-facts-write-path.md`
2. `_inbox/2026-08-25_factory_operating_instructions.md`
3. `_inbox/2026-08-25_cad_ingest_apply_gate_WDLL.md` (graded)
4. `_inbox/2026-08-25_cad_ingest_apply_gate_close.json`
5. `_inbox/2026-08-25_review_caldwell_rebake.md`
6. `_inbox/2026-08-25_p78_caldwell_48055_tax_year_census.json`

## First command

```
node scripts/cad-ingest-apply-gate.mjs --self-test
node scripts/factory-routing-readiness.mjs --check
```

Both must PASS. Then copy `scripts/fixtures/cad-ingest-apply-gate/packet.template.json` to `_inbox/2026-08-25_p78_announce_<county>_<fips>_packet.json`.

## How you fill the packet

1. One FIPS. Name it. No second county in the same announce.
2. Run this census with no `tax_year =` filter. File the query text and rows in the packet.

```
SELECT tax_year, COUNT(*)::int AS n,
       COUNT(year_built)::int AS yb,
       COUNT(land_acres)::int AS la
FROM cad_property
WHERE county_fips = '<fips>'
GROUP BY tax_year
ORDER BY tax_year
```

3. Leftover year and declared L17 year must both appear (n may be 0).
4. Path is derived. Leftover year n=0 is Path B. Leftover year n>0 is Path A. Do not announce the other one.
5. If leftover year ≠ declared L17 year: `inspectReadSet=false`, `willFlipL17=false`. The leftover is not on the inspect read set.
6. `allowStratmapFallback=false`. `countyCount=1`. `secondCounty=false`. `p25Ready=false`. `pinCheckPass` is true only after the pin `--check` you just ran.
7. `sourceVintage` starts with `tier:stratmap-roll;` or `tier:cad-export;`. A DBF basename fails.

## Apply rule

```
node scripts/cad-ingest-apply-gate.mjs --check --packet <your packet>
```

No PASS, no write. A missing packet is a refuse.

## Do not

Rewrite Caldwell 24,989. Flip any L17. Start Dallas or Tarrant CAMA. Dual-FIPS announce. `--allow-stratmap-fallback`. Atoms `--apply`. Rematerialize. Raise the memory pin. Treat this gate as homework; it already exists.

## leave_behind you inherit

First Texas-fill leftover county through this gate. Then stop for review.
