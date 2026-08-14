---
title: P-25 full CAMA loads — Tarrant + Dallas landed; vintage flips HELD on measured key-space divergence
date: 2026-08-14
plan_row: P-25
author: doc_repo planner (loads planner-owned, announce-serialized per L9 close + A-012 ruling 5)
status: loads COMPLETE; flips HELD
---

# P-25 full loads: landed, reconciled, flips held

Both announce-approved full CAMA loads ran tonight from a fresh ldt worktree pinned at #424
(`b9480277`), writing cortex-prod `neondb` (no contention: flood plans ride deployment Neon, the L16
drain rides the atoms store). Readers stayed pinned to declared vintage 2025 throughout (L17
discipline); production never saw a mixed state.

## Results (ingest summaries verbatim in P:/tmp/l9_full_loads/*.log)

| County | Rows upserted | Wall | Skips | 2026 sqft % | 2026 year-built % |
|---|---|---|---|---|---|
| Tarrant 48439 | 883,954 | 272.2s | 267 malformed (named) | 65.1 | 65.2 |
| Dallas 48113 | 806,563 | 251.9s | 0 | 72.3 | 73.9 |

Counting rule: sqft/yb percentages are over ALL 2026 rows (every property class). The L9 pilot's 97.9%
was over the residential-only slice; the drop from 97.9 to ~65-72 is denominator, not regression.

## Why the vintage flips are HELD (the reconcile did its job)

prop_id overlap, 2025 StratMap vs 2026 cad-export, per county:

- Tarrant: 605,340 / 689,838 = 87.7%. The 84,498 2025-only keys are PLAT-STYLE identifiers
  ("10-1-1A", "1000-13-15") absent from TAD's GIS_Link space — not zero-padding (checked by sample).
- Dallas: 399,965 / 693,556 = 57.7%. DCAD keys by ACCOUNT_NUM; StratMap prop_id is a different
  namespace.

Flipping `current_tax_year` now would convert 12% (Tarrant) / 42% (Dallas) of parcels' reads into
manufactured `vintage-gap` absences while real 2025 owner rows exist. The spec's load-vs-flip
separation exists for exactly this; both flips wait on the CROSS-VINTAGE KEY MAPPING (same defect
family as CROSSWALK_HOLD and address-to-parcel: key normalization, not acquisition).

## Follow-ups (P-25 queue)

1. Cross-vintage key mapping Tarrant + Dallas (measured overlaps above; then flip, then queue the
   counties' owner/landuse/cad-roll re-applies for the atoms slot).
2. Loader gotchas, named: DCAD's ViewPDFs.aspx handler truncates large direct downloads (curl with
   retries + integrity check first); DCAD zips carry a 693-byte archive comment that yauzl rejects
   where Python zipfile tolerates it — extract-first and pass the DIRECTORY, or patch the reader.
3. L17 remainsOpen carried: contract vintage-gap absence kind; registry tranche rows for 48027/48309.
4. Bexar / Travis / Collin / Denton vendor recon per the L9 queue (all still 0.0% structural).
