---
id: 2026-08-25_cad_ingest_apply_gate_WDLL
title: WDLL — cad-ingest apply gate (before Texas fill)
date: 2026-08-25
status: graded
operator_approval: verbal 2026-08-25
plan_row: P-78
related:
  - _inbox/2026-08-25_review_caldwell_rebake.md
  - _inbox/2026-08-25_p78_caldwell_48055_tax_year_census.json
  - _inbox/2026-08-24_factory_routing_pin.json
  - _decisions/2026-08-25_p25_tarrant_keep.md
---

# WDLL: cad-ingest apply gate

Date: 2026-08-25  Status: graded  Operator approval: 2026-08-25

## Done looks like

No leftover or CAMA apply starts until a file-based gate has passed on a named one-county packet. The gate fails the Caldwell-shaped lie (announce Path A, census only the empty StratMap year, declared vintage a different year). A check observed only passing has not been observed working. The gate is not a repo-wide hook. Caldwell 2025 rows are not rewritten. L17 is not flipped. P-25 / P-09 / COVER stay `ready:false`. Texas fill is a later card that must invoke this gate.

## Acceptance items

1. **Instrument exists.** `scripts/cad-ingest-apply-gate.mjs` grades a packet. `--self-test` then `--check --packet <path>`. Missing packet is a refuse, not a pass. | check: `--self-test` exit 0; `--check` with no packet exit 1 | grade: [met 2026-08-25] self-test PASS; no-packet REFUSE exit 1

2. **All-year census.** Packet census query has no `tax_year =` filter. Rows are grouped by tax_year. Leftover year and declared year both appear (n may be 0). A 2025-only before-measure fails. | check: fixture F6 fails; F2 passes | grade: [met 2026-08-25] F6 FAIL; F2 PASS

3. **Path from census.** Leftover year n=0 → Path B. Leftover year n>0 → Path A. Announce path must match. Caldwell-shaped Path A + empty 2025 fails. | check: fixture F1 fails; F2 and F3 pass | grade: [met 2026-08-25] F1 FAIL leftover n=0 Path B vs announce A; F2/F3 PASS

4. **Leftover vs L17.** If leftover tax year ≠ declared tax year, packet must set `inspectReadSet=false` and `willFlipL17=false`. Flip true fails. | check: fixture F5 fails; F2 passes | grade: [met 2026-08-25] F5 FAIL; F2 PASS

5. **One FIPS, pin closed.** `countyCount=1`. `allowStratmapFallback=false`. `secondCounty=false`. `pinCheckPass=true`. `p25Ready=false`. | check: fixture F4 and F8 fail | grade: [met 2026-08-25] F4/F8 FAIL

6. **Structured vintage on the next apply.** `sourceVintageStructured=true` (prefix `tier:stratmap-roll;` or `tier:cad-export;`). Basename-only fails. Do not rewrite Caldwell 2025. | check: fixture F9 fails; F2 passes | grade: [met 2026-08-25] F9 FAIL basename; Caldwell 24989 not rewritten

7. **Self-test both directions.** `--self-test` runs F1-F9 including an explicit not-vacuous fail. `--check` always self-tests first. | check: run both; violate F1 and see exit 1 | grade: [met 2026-08-25] F7 empty packet FAIL; `--check --packet` F1 exit 1

8. **Close.** `_inbox/2026-08-25_cad_ingest_apply_gate_close.json`. leave_behind: first Texas-fill county must pass `--check --packet` before apply. | check: close file | grade: [met 2026-08-25] this close

## Amendments

- 2026-08-25: items 1-7 implemented in the same session as approval. The gate has to exist before a fresh agent starts a county write. A WDLL without the instrument is homework.

## Finish card (graded at close)

1. met: `--self-test` PASS; `--check` without packet REFUSE exit 1
2. met: F6 tax_year filter FAIL; F2 PASS
3. met: F1 Caldwell-shaped Path A + empty 2025 FAIL; F2 Path B and F3 Path A PASS
4. met: F5 L17 flip FAIL
5. met: F4 dual county / fallback FAIL; F8 pin or P-25 ready FAIL
6. met: F9 unstructured vintage FAIL; Caldwell 2025 not rewritten
7. met: F7 not-vacuous FAIL; F1 live `--check --packet` exit 1
8. met: `_inbox/2026-08-25_cad_ingest_apply_gate_close.json`
