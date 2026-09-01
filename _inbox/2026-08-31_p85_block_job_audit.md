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
| should have carried one and did not (digit, landed fix) | **14** | new parser extracts a block the retired pattern never saw, and stored block is empty |
| letter-only block, no digit | **7** | `exclusion_letterBlockNoDigit`, now populated. Held, not declined. |
| consequence (14 + 7) | **21** | issued without a block term they should have carried. Not the re-run count for today's fix. |

The third number is the finding for the landed digit-BLOCK fix. Re-run population for that fix: **14 jobs** on **3 parcels**. Consequence population (issued without a block term they should have carried): **21 jobs** on **7 parcels**. Do not re-run any of them. The portal-access gate is with the operator.

| parcel | extracted block | jobs |
|---|---|---|
| `apn:48021:34161` | 13 | 5 (`needs-human` 2, `complete` 3) |
| `apn:48021:34753` | 27 | 2 (`complete` 1, `failed` 1) |
| `apn:48021:35481` | 49 | 7 (`complete` 3, `failed` 4) |

Legal shape on all fourteen is Bastrop "Building Block, BLOCK N ..." or "BUILDING BLOCK N ...". Retired `BLK(?:OCK)?` expands to `BLK` or `BLKOCK` and never matches `BLOCK`.

# Declared exclusions (not subtracted from 36)

- 7 jobs have no legalDescription (5 of those have no `searchTerms` at all). They cannot be scored for this defect.
- Letter-only blocks the current parser also misses: **7 jobs, 4 parcels**, named in `exclusion_letterBlockNoDigit`. `BLOCK A` (48021:81886), `BLOCK F` (48209:168686), `Block D` (48309:181849, four jobs), `BLK D` (48453:500996). Not this regex's damage. The current capture group still requires a digit. They are not a declined clerk-term class (see below). They are not in the landed-fix re-run population, because a re-run with today's parser still stores null.

# Store

cortex-prod (`fancy-fire-06136146`) database `neondb` branch `br-crimson-feather-aphfmy91`. Reached via Neon `run_sql`. The unused Neon project named `legacy-design-tools-prod` (`shiny-snow-37459644`) is archived and is not this store. `DEPLOYMENT_DATABASE_URL_DIRECT` host is `ep-lucky-truth` on the cortex-prod project.

# Are letter blocks valid clerk search terms?

Answered from code and docs. No portal was hit.

`block` is `string | null` (`searchTerms.ts`). The planned query is free text `BLK ${block}` (`searchQueryPlan.ts:71`). Bastrop pastes that string into `#cphNoMargin_f_txtLDLot` (a lot text input). Other Aumentum portals paste it into a subdivision / lot-block text input. Neither path is typed numeric. Tests already accept `BLOCK 12A` (digit plus letter). Nothing in the worker or the WDLL says a portal requires a numeric block.

The four legal texts are standard Texas plat form, not OCR junk: Riverside Grove BLOCK A LOT 27, 6 Creeks BLOCK F Lot 30, Melbourne HTS Block D, Walnut Ridge BLK D.

So 7 is **not** a declined class. Letter-only is a real designation the capture group `\d+[A-Z]?` refuses. That is our parser, not a clerk-field contract.

21 is therefore the right **consequence** count. It is the wrong **re-run** count for the landed fix: re-running those 7 today still leaves `storedBlock` null. Widening the parser is its own card, and even then every re-run is blocked until the operator re-takes the portal-access ruling (permission 2026-08-26, Measurement X3 2026-08-30).

# What this card did not do

Did not re-run the 14 or the 7. Did not change C3. Did not widen the current parser to letter-only blocks. Did not hit a county portal.

```
leave_behind:
  - item: re-run 14 digit-BLOCK jobs (3 Bastrop parcels) after the operator re-takes the portal-access ruling
    owner: property
    plan_row: P-85
  - item: letter-only block parser (7 jobs, 4 parcels). Held, not declined. Own card. Do not re-run until that card and the portal ruling both land.
    owner: unassigned
    plan_row: P-85
```
