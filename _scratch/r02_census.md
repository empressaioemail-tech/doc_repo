# R-02 doc census scratch (Tier 2)

## LESSON

- **2026-08-21:** Consumer priority must be HOOK > COMPILER > HARNESS > ROUTED > CI — otherwise doc-staleness vocab walk swallows everything (2344/2406 as CI before fix).
- **2026-08-21:** `.claude/` is excluded from doc-staleness walk but census includes it — two `.claude/skills/*.md` are the only true consumer NONE in a 2406-file estate.
- **2026-08-21:** Duplicate-id count 16 vs dispatch baseline 20 — `51_ingestion_pipeline_reference` pointer reconciliation removed one pair; shadow `_smartcity_masters` in `_scratch/removed_*` explains five more pairs.

## DEAD-END

- **2026-08-21:** Using grep alone for consumer NONE — rejected; canon-gate reads paths not matching simple filename grep. Enumerated hooks instead.

## GROUND-TRUTH

- **2026-08-21T~03:15Z:** Census at doc_repo `8b68e4324a66709cb6f01a5515cf7101f79b163e` — 2406 md rows, consumer NONE=2, cited-untracked=1178 exit 2, doc-staleness scanned=2345 vocab FAIL=1223.
- **2026-08-21:** `51_ingestion_pipeline_reference.md` consumer=CI only (not ROUTED/HARNESS) despite OPS-18 load-bearing status.

## OPEN

- R-02 quarantine half blocked on R-01 blueprint mesh for contradiction rulings.
- Planner commit of `_catalog/doc_census.*` and close artifacts.
- Wire skills or add to harness read-first if catalog-thesis-check / stakeholder-update should bind fleet behavior.
