---
id: 2026-05-19_bastrop_grand_county_migration_execution_cc-agent-E
title: Session — Path C Bastrop UDC live execution; Sync 4 not fired (Bastrop B3 adopted-by-reference)
date: 2026-05-19
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## Sync 4 verdict (TL;DR)

**Sync 4 does NOT fire this session.** The live Path C walk against `api.municode.com` surfaced an explicit structural finding: Bastrop's Chapter 14 (the local equivalent of a UDC) contains only adoption-by-reference sections, not zoning rule text. The source itself reads, verbatim:

> "The Bastrop Building Block (B3) Code is adopted by reference as though copied herein fully, except such portions as are deleted, modified or amended in this chapter. **The Code can be found on the city's website.**"

The actual zoning rules (use districts, setbacks, lot dimensions, subdivision standards) live on `bastrop.gov`, not on Municode. Path C end-to-end works against the live source; what came back is honest, complete coverage of what Municode contains. Sync 4 / B.6 on substantive UDC queries requires either a B3 publisher adapter (pointing at bastrop.gov) or scoping Sync 4 to Grand County via Path B (gated on `LEGACY_DATABASE_URL` Neon access — out of reach this session). Neither blocking; both are clear next-step paths.

## What was done

Per the 2026-05-19 dispatch greenlighting Path B + Path C execution.

Branched first this time (`stream-1d/bastrop-grand-county-execution`) per the lesson from the prior session's auto-push-to-main side-effect. PR #2 opened: [`empressaioemail-tech/hauska-engine#2`](https://github.com/empressaioemail-tech/hauska-engine/pull/2) — "Stream 1D: Path C Municode walker + extractor/retrieval fixes (Sync 4 not fired — Bastrop B3 adopted-by-reference)". Awaiting planner review per dispatch §Session protocol.

Three execution buckets per dispatch:

1. **Probe tightening (per cc-agent-M's catch).** [`legacy-client.probeBastropUdc`](../../../hauska-engine/tools/migrate-legacy-codes/src/legacy-client.ts) regex now requires a zoning-keyword title match OR a UDC-section-number pattern with a non-charter/amendment title. The two `Sec. 14.01 / 14.02` charter false-positives are no longer reported as UDC candidates. Five-test [`probe-tightening.test.ts`](../../../hauska-engine/tools/migrate-legacy-codes/src/__tests__/probe-tightening.test.ts) re-implements the SQL regex in JS so the tightening is covered without Neon access.

2. **Path B migrations — NOT live this session.** The migration tool is ready; the live `coverage-report` / `dry-run` / `eval` runs are gated on `LEGACY_DATABASE_URL` which is not in this dev box's environment (legacy lives on Replit-managed Neon; credentials in the Replit vault, not local). The tool's surface is unchanged from the prior session; the new tightened probe is the only Path B-side change.

3. **Path C live re-ingestion via Stream 1A.** The substantive work this session. Built and ran end-to-end against the real `api.municode.com`.

### Path C tool

- [`packages/corpus/src/adapters/municode/json-client.ts`](../../../hauska-engine/packages/corpus/src/adapters/municode/json-client.ts) — `MunicodeJsonClient` ported from the legacy `bastrop_municode` adapter. Endpoint chain: `clientContent → jobsLatest → codesToc/children → CodesContent`. Politeness via the package's `RespectfulFetch` (1.5s per-host spacing default; matches the legacy budget).
- [`packages/corpus/src/adapters/municode/index.ts`](../../../hauska-engine/packages/corpus/src/adapters/municode/index.ts) — `MunicodeHtmlAdapter` gains JSON-mode constructor options: `clientId`, `librarySlug`, `stateAbbr`, `chapterFilter` (RegExp), `maxLeafFetches`, `maxTocDepth`, `jsonClient` (optional override for tests). When `jsonMode` is set, `fetch()` walks the TOC, prunes top-level to chapter-filter matches, recurses into HasChildren nodes up to budget, fetches `CodesContent` for each leaf, and assembles a synthetic HTML body that the shared `normalize()` walker chews.
- [`tools/migrate-legacy-codes/src/path-c-ingest.ts`](../../../hauska-engine/tools/migrate-legacy-codes/src/path-c-ingest.ts) — orchestrator. Reads → extracts → atomizes → writes via `StoragePort`. Dedupes by `entityId` (mirrors Path B `transformBatch` policy because the Municode JSON envelope path can emit the same Doc through multiple intermediate-article TOC paths).
- [`tools/migrate-legacy-codes/src/udc-curated-queries.ts`](../../../hauska-engine/tools/migrate-legacy-codes/src/udc-curated-queries.ts) — UDC seed query set retargeted post-live-walk to the adoption-section content Municode actually contains. Two unanchored queries about real zoning rules retained as boundary markers — they correctly miss until the B3 publisher adapter lands.
- CLI subcommands: `path-c-probe-toc`, `path-c-probe-section`, `path-c-ingest-bastrop-udc`, `path-c-eval`, `export-udc-queries`.

### Extractor + retrieval fixes (the live run surfaced these)

The first live Path C run returned `top3Score: 0` despite ingesting 21 sections. Three root causes, fixed in this PR:

1. **`splitHeadingLabel` didn't handle abbreviations.** `"Sec. 14.01.001 - Adopted."` parsed as `sectionNumber="Sec."` + `title="14.01.001 - Adopted."`. Now matches `Sec.`, `Ch.`, `Art.`, `Div.` plus the full forms. Section atom now correctly carries `sectionNumber="14.01.001"` + `title="Adopted."`.

2. **`MunicodeHtmlAdapter.normalize()` emitted blocks per-selector, not in document order.** All `<h*>` came first, then all `<p>`, then all `<dl>` — so every paragraph attached to the LAST section in the heading order rather than the section it sat under in the source. Rewritten to use a single combined-selector `each()` (cheerio iterates in document order across a multi-selector). The inline-fixture conformance tests pass either way (small fixtures don't expose the bug); the live walk did.

3. **`InMemoryStorage.search()` was literal-substring match.** `"B3 Code"` in a query didn't match `"(B3) Code"` in a body. Rewritten to tokenize on non-alphanumeric (preserving `.`), filter tokens ≥ 2 chars, score by `matched / tokens.length`. The retrieval API + eval harness now score realistically against natural-language queries.

After all three fixes: `top3Score: 0.5` — three of six queries (the three anchored adoption-section queries) pass. The chapter-level query misses because the Chapter 14 atom has minimal body (article rollup, no rule prose). The two unanchored zoning queries miss correctly — sentinel DIDs that should resolve only when a real B3 publisher adapter ingests the rule text.

### Live results — Path C against Bastrop Municode

Real data from this session:

- `productId: 13586` (Bastrop Code of Ordinances on Municode)
- Latest job: `Supplement 19`
- Top-level chapters: 17 (Chapters 1-16 of the Code of Ordinances plus the Home Rule Charter, supplement history, comparative table, state law reference)
- **Chapter 14 - BASTROP BUILDING BLOCK (B3) CODE** — Bastrop's locally-branded UDC; this is the relevant subtree (not "Unified Development Code" as the recon and earlier dispatch assumed)
- Walked subtree: 4 sub-articles (14.01, 14.02, 14.03 each with one adoption section)
- Ingested atoms: 7 sections (after dedupe), 1 edition, 1 jurisdiction-corpus, 171 cross-references (100% resolved), 23 atom-link edges
- Eval scores against the seed UDC query set: top3 = 0.5; section-num = 1.0; cross-ref = 0.02
- `passed: false` per the 90/100/95 threshold; **honest** — the cross-ref score is low because most cross-refs in the adoption-section bodies point to ordinance numbers (`Ord. No. 2019-51` etc.) rather than to other section atoms in the corpus

### Workspace coordination acknowledgement

Per dispatch: cc-agent-M's `d55d51d` (isMain Windows fix on hauska-engine's retrieval-api) landed in this repo via cc-agent-M's 2A wiring session, out-of-band per the per-repo single-agent ownership rule. Confirmed correct change; acknowledged here so the runbook reflects the pattern. **Going forward: cross-repo hygiene needs flag through the repo owner.** Captured in PR #2 body so the runbook trail is complete.

## What was learned

Three substantive findings worth carrying forward.

**Bastrop's UDC is adopted-by-reference on Municode.** This is the load-bearing finding. The 2019 ordinance (Ord. No. 2019-51) repealed Bastrop's prior Chapter 14 (which DID contain zoning rules per the editor's note) and replaced it with a three-section pointer at the externally-published B3 Code + Authentic Bastrop Pattern Book + B3 Technical Manual. Municode hosts the adoption sections; the actual rules live on Bastrop's city website. This invalidates the assumption that Path C via Municode could deliver a quality-bar-passing Bastrop UDC corpus on its own. The right next step is a B3 publisher adapter — likely a thin HTML scrape against `bastrop.gov`'s B3 Code pages (or its PDF index if they publish as PDF). Modest scope; clear contract.

**Live source contact exposed three categorical bugs that fixtures didn't.** The `Sec.` abbreviation, the per-selector vs. document-order DOM walk, and the literal-substring search were all latent in the foundation session's inline-fixture tests because the fixtures happened to not exercise them (no `Sec.` prefixes; small enough that document order matched selector order; query phrasing happened to substring-match). Every one of these came out within minutes of pointing at real Municode HTML. The fixture-first development discipline is good, but **the per-jurisdiction first-city test is structurally the place these bugs surface.** Worth a CLAUDE.md note for the next agent picking up Stream 1A.

**Auto-push hook continues to apply.** This session branched first (`git checkout -b stream-1d/bastrop-grand-county-execution`) before the first commit, so the work landed cleanly on the branch with a PR. The prior session's main-direct landing was avoided. Pattern locked: branch-then-commit, always.

## What's still open

For Sync 4 to fire:

- **Bastrop UDC path.** Build a B3 publisher adapter against `bastrop.gov`'s B3 Code pages. Estimated ~1 session of work given the existing adapter framework + structural extraction handles the heavy lifting; the new adapter is just an HTML walker. Then re-run `path-c-eval` against the combined corpus (adoption sections from Municode + rule text from bastrop.gov).
- **Grand County path.** Run `migrate-legacy-codes coverage-report` + `migrate-legacy-codes eval --jurisdiction=grand_county_ut` against legacy Neon. The IWUIC + R301 corpus is real rule text (not adopted-by-reference). With the curated queries scoped to that content per the dispatch, this is the lower-risk Sync 4 candidate. Gated only on `LEGACY_DATABASE_URL` access.

Tangential:

- PR #2 awaits planner review per the dispatch.
- `udc-bastrop-4` (the chapter-level adoption query) misses because the Chapter 14 atom has minimal body content. Two options: (a) drop the chapter-level query from the seed set, or (b) populate the chapter atom's bodyText with a synthesized rollup of its children's titles + adoption text. Either is reviewer-zero curation territory.
- The corpus eval's cross-ref score of 0.02 is driven by cross-references pointing at ordinance numbers (`Ord. No. 2019-51` and similar) rather than at other section atoms. The link-taxonomy could grow an `ordinance-citation` link-type whose `to` is an external ordinance rather than an in-corpus section. Out of scope this session; flag for the ADR-010 link-taxonomy revisit.
- Postgres-backed `StoragePort` remains independent and unaffected by this session.

## Suggested canonical doc updates

None required. The sprint plan ([`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1D B.6) already names Bastrop UDC + Grand County IRC as the validation-pass targets; today's finding refines the path to each but doesn't change scope or sequencing. A canonical update lands when Sync 4 actually fires.

## Commit batch

`hauska-engine` branch `stream-1d/bastrop-grand-county-execution` carries one commit: `ae88cf6 feat(stream-1d): Path C live Municode walker + extractor fixes (Sync 4 not fired — Bastrop B3 is adopted-by-reference)` — 11 files changed, ~1100 insertions. PR #2 open. `doc_repo` carries this session summary.
