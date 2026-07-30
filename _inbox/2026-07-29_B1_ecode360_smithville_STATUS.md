# B1 eCode360 Smithville — STATUS (doc_repo mirror)

Track B1 header-first scraper proof. Full STATUS: `P:/tmp/tx_scraper_proofs/smithville/STATUS.md`.

## Verdict

**PASS** (artifacts ready; planner owns acceptance re-grade). Not STOPPED.

## Robots

UA `*` disallows `/admin,/archives,/attachment,/dashboard,/documents,/output,/permissions,/print,/search,/user`. Landing `/SM6484` and `/toc/SM6484` and numeric content paths are allowed.

## Headers

Selected civil profile: `Mozilla/5.0 (compatible; PublicLawTextFetcher/1.0)` → 200. Chrome+Sec-Fetch spoof → 403 CF challenge (do not use). Legacy Hauska UA → 200 on this host (historical WAF 403 not reproduced).

## Extraction

155 pages @ 0.5 rps; 836/836 TOC sections; 12,793 NormalizedBlocks; fidelity pass after cheerio-decode span compare.

## Code

`hauska-engine` branch `feat/ecode360-scraper-header-first` — `packages/corpus/src/adapters/ecode360-scraper/`. Do not merge without planner review. No corpus ingest/bake/warm.

## Artifacts

- `P:/tmp/tx_scraper_proofs/smithville/raw/`
- `P:/tmp/tx_scraper_proofs/smithville/normalized.json`
- `P:/tmp/tx_scraper_proofs/smithville/fidelity_harness.json`
- `P:/tmp/tx_scraper_proofs/smithville/STATUS.md`
