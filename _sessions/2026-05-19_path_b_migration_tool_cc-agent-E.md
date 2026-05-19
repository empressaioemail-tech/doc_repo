---
id: 2026-05-19_path_b_migration_tool_cc-agent-E
title: Session — Path B migration tool (legacy code_atoms → Bump 1 atom instances); coverage-report answers Check 1
date: 2026-05-19
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Built the Path B migration tool per the 2026-05-19 greenlight (Nick: "Greenlight Path B for execution. ... Proceed with the migration script execution per your filed plan. Coverage-report subcommand first."). Two commits landed on `empressaioemail-tech/hauska-engine` `main` via auto-push:

- `4256bf2 feat(migrate-legacy-codes): Path B migration tool for legacy code_atoms -> Bump 1 atom instances` — 17 files, 2,339 insertions
- `d55d51d fix(retrieval-api): normalize argv path so isMain matches on Windows` — incidental hygiene fix to the Sync-3 retrieval-api `isMain` detection (Windows-side `process.argv[1]` returns backslash paths)

The tool lives at [`tools/migrate-legacy-codes/`](../../../hauska-engine/tools/migrate-legacy-codes/) and implements every part of the filed migration plan.

### Modules

- **`legacy-client.ts`** — read-only `postgres-js` client. Reads `code_atoms` + `code_atom_sources` directly with raw SQL; no `@workspace/db` dependency (so the tool doesn't drag legacy's pnpm-workspace coupling into hauska-engine). Exposes `listSources()`, `coverageReport()`, `readAtoms({jurisdictionKey, codeBook}?)`, `probeBastropUdc()`, `close()`.
- **`transform.ts`** — one legacy row → one `CodeSectionAtomInstance`. Deterministic entityId from `(jurisdictionKey, editionSlug, normalizeSectionLabel(sectionNumber))`. Content hash recomputed against hauska's input set. Legacy UUID + legacy hash + parent section + legacy metadata jsonb preserved in a `metadataSidecar` for cross-system trace. `transformBatch()` dedupes section-id collisions, keeping the earliest `fetched_at` row and logging the collision for operator review.
- **`source-adapter-map.ts`** — `code_atom_sources.source_name` → hauska `sourceAdapter` identifier under a `legacy/...` prefix family per the provenance-honesty plan-doc trade-off (`bastrop_municode` → `legacy/bastrop-municode`, etc.).
- **`synthesize-editions.ts`** — groups sections by `(jurisdictionTenant, codeEditionId)` → emits `CodeEditionAtomInstance` per group; groups editions by jurisdictionTenant → emits `JurisdictionCorpusAtomInstance` per jurisdiction. Composition edges (`jurisdiction-corpus -[contains]-> code-edition`, `code-edition -[contains]-> code-section`) emitted alongside.
- **`synthesize-xrefs.ts`** — body-text sniffer for `§\s*([\w.()-]+)` and `\bsection\s+([\w.()-]+)` patterns. Section lookup index keyed by raw label + parens-normalized + `stripSectionPrefix()`-normalized so a body sniff like `§ 14.5` resolves against atoms stored as `Section 14.5`, `Sec. 14.5`, `CHAPTER 14`, or `Article 14`. Resolved cross-references emit a `code-section -[<typed-link>]-> code-section` edge with the link type derived from the reference's surrounding context (`see`, `notwithstanding`, `subject-to`, `as-defined-in`, `amends`, `supersedes`, `unknown`).
- **`edition-labels.ts`** — snapshot of legacy `lib/codes/src/jurisdictions.ts` (3 books for Grand County, 1 for Bastrop) so migrated atoms get human-readable edition labels.
- **`migrate.ts`** — end-to-end orchestrator. Read → transform → synthesize editions + corpora + xrefs → `writeAtoms()` + `writeAtomLinks()` + `upsertJurisdictionStatus()`. Storage-port-agnostic; pass `InMemoryStorage` for dry-run + eval; pass the Postgres-backed port (deferred sprint) for production.
- **`seed-curated-queries.ts`** — seed query sets scoped per dispatch: 7 Bastrop queries spanning Chapter 1 / 2 / 6 / 8 / 10 / 12 / 14 of the full Code of Ordinances; 4 Grand County queries scoped to IRC R301.2(1) + IWUIC Chapter 5 / Section 504 / Section 607 (no full-IRC per dispatch). Authorship marked `llm-generated`; status `draft`. Production reviewer-zero curation (Sylvia / Jaime for Bastrop) refines them through the [`packages/corpus/src/curated-queries/`](../../../hauska-engine/packages/corpus/src/curated-queries/) port.

### CLI surface

```
migrate-legacy-codes coverage-report           # answers dispatch Check 1
migrate-legacy-codes probe-bastrop-udc         # focused UDC presence verdict
migrate-legacy-codes dry-run [--jurisdiction]  # transform + synthesize, no eval
migrate-legacy-codes write [--target=...]      # in-memory only until Postgres-backed StoragePort lands
migrate-legacy-codes eval --jurisdiction=...   # migrate + evaluate seed queries
migrate-legacy-codes export-seed-queries       # emits the seed query JSON
```

Reads `LEGACY_DATABASE_URL` (or `DATABASE_URL`) from env, with `--database-url=<url>` flag override. Exit code conventions: `2` for missing args; `3` for not-yet-wired Postgres target; `4` for eval-passed-false (so a CI job that runs `eval` as a guard automatically fails on quality-bar miss).

### Test coverage

49 tests total across the repo; 18 new in this session, all passing:

- `transform.test.ts` (8) — row → instance, deterministic entityId, provenance preservation, collision dedupe (earliest-fetched-at policy), subsection-marker normalization (`5.04(b)(2)` → `5-04`), null-section + empty-body drop accounting.
- `synthesis.test.ts` (6) — one edition per `(jurisdiction, codeBook)`, one corpus per jurisdiction, edition labels pulled from the legacy snapshot, composition links emitted in both directions, cross-reference sniff against fixture bodies, `see-also` link-type emitted.
- `end-to-end.test.ts` (4) — full migration into `InMemoryStorage` via a `StubLegacyClient`, jurisdiction-filtered migration, eval harness end-to-end against Bastrop seed queries, Grand County seed queries verified IWUIC-+R301-scope only (no `full irc` strings).

The end-to-end test is the load-bearing one: it proves the Sync 4 dry-run + eval path works without requiring Neon access. Once Nick (or a follow-on session) wires `LEGACY_DATABASE_URL` and runs `migrate-legacy-codes eval --jurisdiction=bastrop_tx`, the harness fires against real data with no further code changes needed.

### Dispatch Check 1 answering pattern

Per Nick's template:
```
Check 1 (Bastrop UDC coverage): <RESULT from your SQL probe. If UDC sections present:
"UDC sections present in legacy code_atoms; Path B covers full Bastrop corpus."
If UDC absent: "UDC sections absent; Path B migrates non-UDC sections, Path C
re-ingest needed for UDC subset specifically — fold into the same migration
tool with a re-ingest subcommand for that subset.">
```

The `probe-bastrop-udc` subcommand answers verbatim. Its JSON output includes a `dispatchAnswer` field carrying one of those two strings depending on `udcCandidateCount > 0`. The probe regex matches against `section_title ~* 'unified development|zoning|setback|land use|subdivision|use district|land development'` and `section_number ~* '^14\.|^150\.|^UDC'` against `code_atoms WHERE jurisdiction_key = 'bastrop_tx'`. **Check 1 fires at the moment the operator runs `probe-bastrop-udc` against Neon; no code changes needed first.**

### Grand County scope constraint

Per Nick's Check 2 ratification: "Migrate legacy IRC_R301_2_1 + IWUIC via Path B in the same session as Bastrop." The migration code handles all books a row references; the seed curated queries are explicitly scoped to IWUIC + R301 (no full-IRC). The tool ALSO carries Grand County's third book (`LAND_USE` / Land Use Code) if that data is present in legacy — if cc-agent-PR's "215 atoms" observation reflects post-2026-04-28 Land Use Code ingestion, those rows get migrated too. Grand County's curated query set stays scoped to IWUIC + R301 regardless; Land Use Code curated queries can be authored as a follow-on if it lands in coverage.

## What was learned

- Auto-push hook. Committing to local `main` here triggers an immediate `git push origin main`. Pushed the two commits before I could route them onto the `stream-1d/migrate-legacy-codes` work branch I'd planned to PR; opened the branch anyway as a no-op (HEAD identical to main). `gh pr create` correctly rejected with "No commits between main and stream-1d/migrate-legacy-codes". No content lost; the work is live on `origin/main`. Branch posture for future work: explicitly check out the branch BEFORE the first commit, or expect direct-to-main landing for in-repo cc-agent work.
- Section-label variability. The fixture round-trip exposed that the `§ X.YZ` body-text sniff and the section atoms' raw `sectionNumber` field can diverge ("Section 14.5" vs "14.5" vs "§ 14.5" vs "CHAPTER 14"). Added `stripSectionPrefix()` to the lookup index so cross-reference resolution survives the variability without changing how section atoms store their label. This is also the right shape for the eval harness's coverage test (storage search for `section_number` is loose; the migration step's lookup is loose).
- Subsection collisions. Two `code_atoms` rows that share `(jurisdictionKey, codeBook, edition)` and differ only in subsection markers ("5.04" vs "5.04(b)") collide on the same target DID after `normalizeSectionLabel()`. The earliest-`fetched_at` row wins; the collision is logged. This matches the recon's plan; the alternative (one atom per subsection) is post-Sync-4 work per ADR-001 §Open-decision on subsection granularity.

## What's still open

- **Check 1 verdict.** Awaits `migrate-legacy-codes probe-bastrop-udc` run against legacy Neon.
- **Live `coverage-report` + `dry-run` + `eval`.** Gated on `LEGACY_DATABASE_URL`.
- **Sync 4 signal.** Fires when `eval --jurisdiction=bastrop_tx` returns `passed: true` against the seed (or reviewer-zero-refined) curated query set.
- **Postgres-backed `StoragePort` in hauska-engine.** Independent sprint; gates `migrate-legacy-codes write --target=postgres`. The dispatch said production write is not in this session's critical path; the eval signal lands from in-memory anyway.
- **Reviewer-zero curated-query refinement.** Phase 0 requires human review of curated queries for the first 20 jurisdictions; the seed set is `status: draft` and `authorshipSource: llm-generated`. Sylvia / Jaime for Bastrop; a Grand County reviewer-zero (Nick if no community contact yet) for IWUIC + R301.
- **Branch cleanup.** `origin/stream-1d/migrate-legacy-codes` is identical to `main`; can be deleted at convenience. Leaving for now as a no-cost historical reference.

## Suggested canonical doc updates

None this session — the tool is implementation infrastructure; the canonical sprint plan ([`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1D) doesn't require updates until Sync 4 signals from a live run.

The two prior cc-agent-E sessions (foundation + recon) covered the architectural updates; this is execution against that plan.

## Commit batch

Two commits already on `origin/main` via auto-push during this session:

- `4256bf2 feat(migrate-legacy-codes): Path B migration tool for legacy code_atoms -> Bump 1 atom instances`
- `d55d51d fix(retrieval-api): normalize argv path so isMain matches on Windows`

This session summary is the only fresh content; one commit to `doc_repo`.
