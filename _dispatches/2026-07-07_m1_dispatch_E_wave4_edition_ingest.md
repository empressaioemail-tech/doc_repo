# CURSOR_TASK — M1-E: ingest Wave-4 dated-edition bundles → code-amendment/edition atoms + hazard report

You are in a FRESH clone of hauska-engine (empressaioemail-tech/hauska-engine) on main.

## Conventions (non-negotiable)
- Branch: `feat/m1-wave4-edition-ingest`. Create it first; push to origin IMMEDIATELY after your
  first commit (`git push -u origin feat/m1-wave4-edition-ingest`) and push after every subsequent
  commit. Never commit this CURSOR_TASK.md file; if it slips into a commit, remove it in a
  follow-up commit (`chore: remove CURSOR_TASK.md`) before idling.
- PR title: `feat(m1): ingest Wave-4 dated-edition bundles as code-amendment/edition atoms`.
  Open the PR. Do NOT merge; push and idle. CI (.github/workflows/ci.yml: `pnpm typecheck` +
  `pnpm test` on ubuntu) is the authoritative gate.
- EXIT-BOUNDED verification only: every command you run must terminate on its own. No dev
  servers, no `vitest` watch mode (use `vitest run` / the package `test` scripts), no
  long-running processes. If a check cannot terminate, skip it and say so in the report.

## Why (context you cannot discover)
M1 (the calibrated-spine go/rework gate) was re-grained to the CASE grain by the 2026-06-22
decision record. The measurement needs the amendment hazard lambda, and today the corpus has
ZERO code-amendment atoms — the F8 hazard signal is stuck at its cold-start prior 0.02
(packages/engine-core/src/calibration/hazard.ts:12). The acquisition agent's Wave-4 harvest
(2026-06-22) landed dated edition bundles for Bastrop, Austin, and San Antonio in GCS in this
repo's own `hauska-edition-bundle/1` contract. Your job: ingest them into code-edition +
temporal code-amendment atoms in the committed serving snapshot, so the downstream
legacy-design-tools M1 run can compute an OBSERVED edition-bump hazard instead of the prior.

## Fuel (verified to exist 2026-07-07)
- gs://hauska-calibration-raw/edition-bundle/austin_tx/hauska-edition-bundle-1-wave4.json
- gs://hauska-calibration-raw/edition-bundle/san_antonio_tx/hauska-edition-bundle-1-wave4.json
- gs://hauska-calibration-raw/edition-bundle/bastrop_tx/hauska-edition-bundle-1-wave4.json
- Per-jurisdiction tables: .../edition-bundle/{jurisdiction}/edition-effective-date-table.json
- Summary: gs://hauska-calibration-raw/edition-bundle/_wave4_dated_edition_summary.json
- DO NOT ingest `edition-bundle/*/municode_snapshots/*` or the wave-3 `hauska-edition-bundle-1.json`
  files as dated editions — Wave 3 year-labels share identical SHAs (placeholder shells) and are
  explicitly superseded for K2 by the Wave-4 close report.
Fetch with `gcloud storage cat <path> > <local>` into an untracked working dir (e.g. `./.fuel/`,
gitignored or simply never staged). Record each file's SHA256 in your close report.

## Code anchors (found for you; verify before editing)
- Bundle contract: packages/corpus/src/edition-history/bundle.ts — EDITION_BUNDLE_SCHEMA (line 56),
  datetime-with-offset requirements at lines 28-31 (adoptionOrdinance.effectiveDate) and 44-45
  (edition.effectiveFrom/effectiveTo).
- Ingest unit: packages/corpus/src/edition-history/ingest.ts — ingestEditionBundle (line 90);
  temporal amendment builder (line 27); jurisdiction-corpus update block (lines 159-175).
- Existing test: packages/corpus/src/edition-history/__tests__/ingest.test.ts (fixture uses
  offset datetimes — that is why the mismatch was never caught).
- CLI: tools/migrate-legacy-codes/src/ingest-edition-bundle.ts, registered at
  tools/migrate-legacy-codes/src/index.ts:5020 (`ingest-edition-bundle --bundle --snapshot-in
  --snapshot-out`).
- Serving snapshot (committed): services/retrieval-api/corpus/snapshot.json (70.8 MB; currently
  22,624 code-section / 7,161 code-cross-reference / 37 code-edition / 0 code-amendment atoms;
  tenants austin_tx, san_antonio_tx, bastrop_tx present and matching the bundle keys).
- Atom types: packages/atoms/src/instances.ts — CodeAmendmentAtomInstance discriminated on
  amendmentScope (temporal at line 202), CODE_AMENDMENT_SCHEMA (line 273),
  CodeEditionAtomInstance (line 320).
- Hazard: packages/engine-core/src/calibration/hazard.ts — computeAmendmentHazardRate (line 38).

## Known mismatches you must handle honestly (verified against the live bundle JSON)
1. DATE-ONLY DATES. The Wave-4 bundles carry `"effectiveFrom": "2013-09-16"` etc. (date-only),
   which `z.string().datetime({ offset: true })` REJECTS. Fix in bundle.ts: accept ISO date-only
   strings alongside offset datetimes and normalize date-only to `T00:00:00Z` (UTC midnight) at
   parse time. This is a mechanical normalization of the legal effective DATE, not an invented
   timestamp — state it in code comments and in the close report. Do NOT loosen to arbitrary
   strings and do NOT guess timezones beyond this rule.
2. NO affectedSectionIds. No adoption ordinance in the fuel names affected sections, so every
   amendment atom lands with `affectedSectionIds: []` and no `amends` links. Consequence:
   per-SECTION lambda is NOT computable from this fuel. The computable grain is the
   jurisdiction x codeFamily edition-bump hazard (e.g. Austin IBC: 4 adoptions over the
   2013-2025 window). NEVER fabricate section mappings. Your hazard report must label
   section-scoped lambda as `cold-start-prior` and jurisdiction-family lambda as
   `amendment-history`.
3. currentEditionId CLOBBER. ingest.ts:159-175 overwrites jurisdiction-corpus.currentEditionId
   with the last ingested edition. The serving corpus pointers are the current-supplement
   editions (e.g. `austin_tx/austin-land-development-code-current-supplement`); the Wave-4 IBC
   adoption chain is temporal metadata and must NOT steal the pointer. Change the merge rule:
   when an existing corpus atom already has a currentEditionId, preserve it; only set it when
   none exists. Add a regression test.
4. Bastrop caveats (from the acquisition close, honor verbatim): the harvest's public record
   starts at 2018 IBC (Ord 2019-61, effective 2019-11-26) — pre-2019 Bastrop cases have NO
   edition row; and the 2026-04-14 row is the Bastrop Development Code (BDC), a zoning/land-use
   code, not an IBC edition bump. Ingest what the bundle says; add no rows it does not contain.

## Work items
1. bundle.ts schema fix per mismatch 1, with unit tests: a date-only fixture parses and
   normalizes; a garbage date still rejects; an offset-datetime fixture is unchanged.
2. ingest.ts currentEditionId preservation per mismatch 3, with a regression test (existing
   corpus atom with currentEditionId keeps it after a wave-4-style ingest).
3. Ingest run: for each of the three cities, run the existing CLI chained over the committed
   snapshot:
     pnpm --filter migrate-legacy-codes exec tsx src/index.ts ingest-edition-bundle \
       --bundle ./.fuel/<city>-wave4.json \
       --snapshot-in <prev snapshot> --snapshot-out <next snapshot>
   (first city reads services/retrieval-api/corpus/snapshot.json; last writes back to that path).
   Expected result: +10 code-edition atoms (2 Bastrop, 4 Austin, 4 SA), +10 temporal
   code-amendment atoms (one per adoption ordinance), jurisdiction-corpus adoptedEditionIds
   extended, currentEditionId UNCHANGED for all three cities. Commit the regenerated snapshot.
4. Hazard report tool: add tools/f8-hazard-report.mjs (pattern: tools/f2-consequence-coverage.mjs)
   that loads a snapshot, groups code-amendment atoms by jurisdictionTenant x modelCodeBase-or-
   codeFamily, calls computeAmendmentHazardRate per group, and prints JSON:
   { group, amendmentCount, observationYears, rate, source, editionIds }, plus an explicit
   `sectionScopedLambda: { rate: 0.02, source: "cold-start-prior", reason: "no
   ordinance-to-section mapping in Wave-4 fuel" }` block. This JSON is the input contract the
   legacy-design-tools M1 dispatch consumes; keep field names stable.
5. Close report (in the PR description, not a repo .md): counts written per city, the
   hazard report output, the input-provenance table — each input labeled
   observed (adoption dates from ordinance PDFs) / normalized (date -> UTC midnight) /
   unavailable (section mapping; pre-2019 Bastrop chain; Municode per-date exports).

## Tests + verification (all exit-bounded)
- pnpm typecheck                                  (repo-wide, same as CI)
- pnpm --filter @hauska-engine/corpus test        (vitest run — includes your new bundle/ingest tests)
- pnpm --filter @hauska-engine/atoms test
- pnpm --filter @hauska-engine/engine-core test
- node tools/f8-hazard-report.mjs services/retrieval-api/corpus/snapshot.json  (prints and exits)
- Snapshot sanity (prints and exits):
  node -e "const s=require('./services/retrieval-api/corpus/snapshot.json');const c={};for(const a of s.atoms)c[a.entityType]=(c[a.entityType]||0)+1;console.log(c)"
  Expect code-amendment: 10, code-edition: 47.
Do NOT run the retrieval-api or engine-api servers. Do NOT run watchers. CI is authoritative.
