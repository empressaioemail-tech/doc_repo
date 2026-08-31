---
id: 2026-08-31_p85_block_job_audit
title: Issued records requests planned without a BLOCK term
date: 2026-08-31
status: measured
plan_row: P-85
owner: property seat
snapshot: doc_repo d86b6cb; cortex-prod Neon fancy-fire-06136146 neondb branch br-crimson-feather-aphfmy91; instrument _inbox/2026-08-31_p85_block_job_audit.mjs
---

# Falsifier (stated before the count)

The convenient result is zero damage. That is the result that lets everyone relax.

- If DATABASE_URL is unset or the store is unreachable, the result is UNMEASURED. A missing store is not a zero. The last attempt ended there.
- If a fetched row has legal text the retired `BLK(?:OCK)?` pattern missed, stored `block` empty, and the third number is 0, the instrument is wrong.
- If the third number is 0 and every fetched legal that contains `BLOCK n` also has a stored block, that 0 is measured.

Observed: the store was reached. The third number is 14, not 0. A SQL second derivation on the same branch also returned 14. The instrument is not wrong.

# Three numbers

| | count | meaning |
|---|---|---|
| issued in scope | **36** | every row in `records_request_jobs` |
| carried a block term | **0** | `request_payload.searchTerms.block` non-empty. Measured zero. The `block` key exists on the BLOCK jobs and is JSON null. |
| should have carried one and did not | **14** | new parser extracts a block the retired pattern never saw, and stored block is empty |

The third number is the finding. Re-run candidates: **14 jobs** on **3 parcels**. Do not re-run them on this card.

| parcel | extracted block | jobs |
|---|---|---|
| `apn:48021:34161` | 13 | 5 (`needs-human` 2, `complete` 3) |
| `apn:48021:34753` | 27 | 2 (`complete` 1, `failed` 1) |
| `apn:48021:35481` | 49 | 7 (`complete` 3, `failed` 4) |

Legal shape on all fourteen is Bastrop "Building Block, BLOCK N ..." or "BUILDING BLOCK N ...". Retired `BLK(?:OCK)?` expands to `BLK` or `BLKOCK` and never matches `BLOCK`.

# Declared exclusions (not subtracted from 36)

- 7 jobs have no legalDescription (5 of those have no `searchTerms` at all). They cannot be scored for this defect.
- Letter-only blocks the current parser also misses: `BLOCK A` (48021:81886), `BLOCK F` (48209:168686), `Block D` (48309:181849, four jobs), `BLK D` (48453:500996). Not this regex's damage. The current `BL(?:OC)?K` still requires a digit.

# Store

cortex-prod (`fancy-fire-06136146`) database `neondb` branch `br-crimson-feather-aphfmy91`. Reached via Neon `run_sql`. The unused Neon project named `legacy-design-tools-prod` (`shiny-snow-37459644`) is archived and is not this store. `DEPLOYMENT_DATABASE_URL_DIRECT` host is `ep-lucky-truth` on the cortex-prod project.

# What this card did not do

Did not re-run the 14 jobs. Did not change C3. Did not widen the current parser to letter-only blocks.

```
leave_behind:
  - item: re-run 14 issued records_request_jobs (3 parcels) with the fixed BLOCK parser
    owner: property
    plan_row: P-85
  - item: letter-only block (BLOCK A / F / D) is still unparsed; not this defect
    owner: unassigned
    plan_row: P-85
```
