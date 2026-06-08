---
id: 2026-06-07_hauska-engine_cc-agent-E_accessibility_corpus_ingest
title: cc-agent-E — accessibility corpus ingest (ADA / FHA / A117.1 wire)
date: 2026-06-07
agent: cc-agent-E
repo: hauska-engine
dispatch: 2026-06-07_cc-agent-E_accessibility_corpus_ingest
status: complete — PR held for operator merge
model: Grok Build 0.1 (default; no escalation)
---

# Accessibility corpus ingest — cc-agent-E report

## Workspace hygiene (verbatim)

**Refused dirty primary clone** `P:\hauska-engine` per dispatch + `agent_workspace_hygiene`. Executed from isolated worktree:

```
P:\tmp\hauska-engine-cc-agent-E-accessibility
branch stream-1d/accessibility-corpus-ingest
```

**Primary clone `git status` (verbatim at dispatch entry):**

```
On branch feat/neon-warmup-pilot-load
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
	modified:   services/retrieval-api/DEPLOY.md
	modified:   tools/migrate-legacy-codes/src/index.ts

Untracked files:
	services/retrieval-api/corpus/central_texas_coverage.json
	services/retrieval-api/docs/
	tools/migrate-legacy-codes/src/__tests__/export-central-texas-coverage.test.ts
	... (neon-warmup-pilot artifacts)
```

**Primary clone `git log -3` (verbatim):**

```
7e142fb Merge pull request #65 from empressaioemail-tech/feat/property-workspace-atom-pipeline
97d581f fix(ci): use published @hauska/atom-contract@1.3.0 instead of local file override
7a7c75c feat(workspace): brokerage V1 atom emission and retrieval pipeline
```

## RawPdfAdapter recon (verbatim)

From `packages/corpus/src/adapters/raw-pdf/index.ts`:

- **Born-digital path:** `textExtractor` hook (pdfjs-dist via `pdfjsTextExtractor`); `fetch()` downloads PDF bytes when extractor is wired.
- **OCR path:** `ocr` hook when no `textExtractor`; whole OCR output treated as synthetic page.
- **Deferred stub:** no extractor + no OCR → empty body (not-loadable).
- **Model-code tenant convention (ICC):** `icc-model-code` per `ICC_MODEL_CODE_TENANT` in `icc-code-connect/index.ts`.
- **Federal accessibility tenant (this dispatch):** `federal-accessibility-standards` — synthetic Layer-1 product-baseline tenant for national standards (not jurisdiction-specific).

New heading convention: `federal-accessibility` in `normalize.ts` for ADA/FHA PDF structure.

## Deliverables

| Item | Status |
|------|--------|
| ADA 2010 Standards ingest (RawPdfAdapter) | Done — 901 sections, `public-free` |
| FHA Design Manual ingest (RawPdfAdapter) | Done — 212 sections, `public-free` |
| Curated eval queries + Layer-1 bar | Done — see scores below |
| A117.1 wired credential-pending | Done — fixture + `ICC_CREDENTIAL_PENDING_EDITIONS` |
| Tests green | Done — corpus 95/95, migrate-legacy-codes 29/29 |
| PR held for operator merge | **https://github.com/empressaioemail-tech/hauska-engine/pull/66** |
| Snapshot refresh | **Follow-on** — `build-corpus-snapshot` not re-run (34+ jurisdiction live ingests; operator can refresh after merge) |

## Eval scores (verbatim)

### ADA 2010 (`path-pdf-eval-ada-2010 --local-pdf`)

```json
"passed": true,
"scores": {
  "top3Score": 1,
  "sectionNumScore": 1,
  "crossRefScore": 1
},
"thresholds": {
  "top3RetrievalMin": 1,
  "sectionNumRetrievabilityMin": 1,
  "crossRefResolutionMin": 1
},
"queriesEvaluated": 6,
"sectionsIngested": 901
```

### FHA Design Manual (`path-pdf-eval-fha-design-manual --local-pdf`)

```json
"passed": true,
"scores": {
  "top3Score": 1,
  "sectionNumScore": 1,
  "crossRefScore": 1
},
"thresholds": {
  "top3RetrievalMin": 1,
  "sectionNumRetrievabilityMin": 1,
  "crossRefResolutionMin": 1
},
"queriesEvaluated": 6,
"sectionsIngested": 212
```

## Atom refs touched

**Tenant:** `federal-accessibility-standards`

| Edition | `code-edition` entityId | Source URL | accessPolicy |
|---------|-------------------------|------------|--------------|
| 2010 ADA Standards for Accessible Design | `federal-accessibility-standards/2010-ada-standards-for-accessible-design` | https://www.ada.gov/assets/pdfs/2010-design-standards.pdf | `public-free` |
| Fair Housing Act Design Manual (April 1998) | `federal-accessibility-standards/fair-housing-act-design-manual-april-1998` | https://www.huduser.gov/portal/publications/PDF/FAIRHOUSING/fairfull.pdf (mirror: wbdg.org) | `public-free` |

**ICC credential-pending (wired, not live-ingested):**

```json
{
  "adapterMode": "unconfigured",
  "credentialPendingEditions": [
    { "titleId": "IRC2021", "editionLabel": "2021 International Residential Code", "codeAbbrev": "IRC", "year": 2021 },
    { "titleId": "A11712021", "editionLabel": "2021 Accessible and Usable Buildings and Facilities", "codeAbbrev": "A117.1", "year": 2021 }
  ],
  "envVarsRequired": ["ICC_CODE_CONNECT_CLIENT_ID", "ICC_CODE_CONNECT_CLIENT_SECRET"]
}
```

## PR + branch SHA

- **PR:** https://github.com/empressaioemail-tech/hauska-engine/pull/66
- **Branch:** `stream-1d/accessibility-corpus-ingest`
- **SHA:** `b417042c9f0cad24602cde9d9e2f4fcec4a36fb7`

## Blockers (verbatim)

1. **Primary clone dirty** — neon-warmup-pilot work on `feat/neon-warmup-pilot-load`; used worktree instead.
2. **Windows TLS revocation** — `ada.gov` / `huduser.gov` fetch fails without `--local-pdf` or `--ssl-no-revoke` on curl; CLI supports `--local-pdf` for operator runs.
3. **ICC OAuth** — A117.1 + IRC remain credential-pending until `ICC_CODE_CONNECT_CLIENT_ID` / `ICC_CODE_CONNECT_CLIENT_SECRET` populate.

## CLI entry points

```bash
pnpm exec tsx tools/migrate-legacy-codes/src/index.ts path-pdf-eval-ada-2010 [--local-pdf path]
pnpm exec tsx tools/migrate-legacy-codes/src/index.ts path-pdf-eval-fha-design-manual [--local-pdf path]
pnpm exec tsx tools/migrate-legacy-codes/src/index.ts icc-model-code-credential-pending
```
