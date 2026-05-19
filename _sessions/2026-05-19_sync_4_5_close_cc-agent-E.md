---
id: 2026-05-19_sync_4_5_close_cc-agent-E
title: Session — Sync 4.5 close-out (Bastrop UDC + Bastrop County + Elgin pass eval; Smithville deferred)
date: 2026-05-19
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
rolled_up_into: []
related:
  - _decisions/2026-05-19_sync_4_5_and_cortex_sprint
  - _dispatches/2026-05-19_cc-agent-E_sync_4_5_jurisdictions
  - _sessions/2026-05-19_substrate_v1_wind_down_claude_code
  - _sessions/2026-05-19_grand_county_landuse_cc-agent-E
  - 51_substrate_v1_sprint
  - 80_adrs/adr_017_atom_access_control
---

## TL;DR

Sync 4.5 fires at 3 of 4 jurisdictions per the 2026-05-19 dispatch:

| Phase | Jurisdiction | Tier | Adapter | top3 / sectionNum / crossRef | Sections | PR |
|---|---|---|---|---|---|---|
| B | Bastrop UDC (B3 Code) | public-free | RawPdfAdapter (born-digital) | 1.0 / 1.0 / 1.0 | 181 | #5 squash-merged 0ad25f6 |
| C | Bastrop County Subdivision Regs | platform-internal | RawPdfAdapter | 1.0 / 1.0 / 1.0 | 17 | #6 |
| D | Smithville | DEFERRED | eCode360 (stub) | n/a | n/a | n/a — flag below |
| E | Elgin Code of Ordinances | platform-internal | MunicodeHtmlAdapter (JSON mode) | 1.0 / 1.0 / 1.0 | 210 | #6 |

Total: 408 atoms across the three closed-out jurisdictions, plus Grand County's 290 (closed in earlier session) = 698 atoms in the substrate v1 corpus. Four total onboarding events (Grand County + Bastrop UDC + Bastrop County + Elgin), past the 3-jurisdiction hard-kill checkpoint per `51_substrate_v1_sprint.md` §Stream 1D (tightened semantics 2026-05-19 per `_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`).

## What was done

### Phase A + B — Bastrop UDC public-tier (recap from PR #5)

PR #5 squash-merged 2026-05-19 at commit `0ad25f6`. Born-digital `RawPdfAdapter` completed (deferred per `REPO_NOTES.md` "OCR integration lands when first raw-PDF jurisdiction is named"; Bastrop UDC was the first jurisdiction so completed it now — born-digital extraction via `pdfjs-dist` sidesteps OCR entirely). 181 sections; 19 in-corpus xrefs; 68 external citations correctly filtered per ADR-010. Detailed PR body documents the divergence from the dispatch's "HTML walker" shape vs the actual born-digital PDF source.

### Phase C — Bastrop County re-ingest

Dispatch-assumption break: the dispatch placed Bastrop County on Municode Path A. Live recon surfaced that Bastrop County's regulations live as a PDF on bastropcounty.gov, not on Municode (Municode's `/tx/bastrop_county` URL doesn't exist; search returns only City of Bastrop). The substrate-level `RawPdfAdapter` completed in Phase A handles it directly.

Ingested the Subdivision Regulations (Revised April 24, 2017) PDF at `https://www.bastropcounty.gov/upload/page/0145/docs/SDRegsBookmarkedAdopted042417.pdf` — 69 pages, born-digital, Roman-numeral sectioning (`SECTION I` through `SECTION XVII`). Required a small `SECTION_RE` extension to make the inline title optional (Bastrop County body uses `SECTION X` on line 1 with the title on line 2; multi-line continuation merge recovers the title). 17 section atoms, one per Roman-numeral section, each carrying the full text of that section. Eval against 12 curated queries: 1.0 / 1.0 / 1.0.

`accessPolicy: "platform-internal"` tagged on the `jurisdiction-corpus` atom + `jurisdictionStatus` row.

### Phase D — Smithville deferred

Dispatch-assumption break: Smithville's code is on **eCode360** (`https://ecode360.com/SM6484`), not Municode. The current `@hauska-engine/corpus` eCode360 adapter is a stub (contract surface only; no HTTP client / DOM walker / extraction). Building it out is roughly 1 session of work — same shape as the MunicodeHtmlAdapter port. Operator decision 2026-05-19 (in-session): defer Smithville to a follow-on dispatch rather than rush the eCode360 adapter into Sync 4.5 close-out.

Practical impact for public catalog: zero. Smithville is partnership-pending, so even when it ingests it would have surfaced as `platform-internal` and not appeared in the unauthenticated `list_jurisdictions` response. The deferral pushes its internal-tier availability, not its public surface.

### Phase E — Elgin re-ingest

Dispatch holds: Elgin is on Municode (ClientID 2076 confirmed via `getClientByName("Elgin", "TX")`). Path C / `MunicodeHtmlAdapter` JSON mode applies as dispatched. Chapter-filter scoped to `subdivisions|zoning|site developments`. At `maxLeafFetches=200` the walker captured **Chapter 36 (Subdivisions, 105 sections) + Chapter 46 (Zoning, 84 sections)** plus 21 article/sub-article heading atoms — 210 total. Chapter 48 (Site Developments) hit the budget; raising to 400+ would pull it in. Eval against 12 curated queries spanning Ch 36 + Ch 46: 1.0 / 1.0 / 1.0.

`accessPolicy: "platform-internal"`.

### Cross-cutting engine changes

1. **`AccessPolicy` plumbing through engine** per `@hauska/atom-contract@1.1.0` Path R (reuse ADR-017 model). `JurisdictionCorpusAtomInstance.accessPolicy?: AccessPolicy` + `JurisdictionStatusSnapshot.accessPolicy?: AccessPolicy` + `listJurisdictionStatus({ accessPolicies })` filter + `atomize(tree, { accessPolicy })` option + path-c-ingest / path-pdf-ingest orchestrator options + Postgres schema column on `jurisdiction_status`. Empty/absent values default to `"public-free"`.

2. **`path-c-ingest` gained the sniff-xref fix.** PR #5's body explicitly flagged this as a follow-on; this session lands it. Path C's `atomize()`-emitted cross-references were dangling-pointer atoms (article/chapter labels with no in-corpus section target). Replaced with `sniffCrossReferences` against atomized section bodies (same pattern as Path B Grand County + Path PDF Bastrop UDC). Filters to in-corpus targets per ADR-010 §Link taxonomy.

3. **Storage scoring tightened** for substrate-grade retrieval across heterogeneous label shapes:
   - **Anchor-boost: substring → token-equality.** Was mis-firing on short Roman-numeral labels (`"I"` matching inside `"drainage"`).
   - **Trailing-punctuation strip.** Municode atomization can store `sectionNumber: "36-7."` (with trailing period); queries naturally drop it. Boost now strips trailing punctuation before token-comparing.
   - **Tokenizer preserves hyphens.** `"36-7"`, `"46-1"`, `"5.04(b)"` now stay single tokens; previously the tokenizer split on hyphens so the anchor-boost match could never fire for Municode-style chapter-number labels.

4. **`RawPdfAdapter` heading walker.** `SECTION_RE` accepts title-optional cases (Bastrop County's multi-line section headings). `ARTICLE_RE` matches similarly. Conformance suite stays green; 16 tests for the adapter + 6 new visibility-filter tests for storage.

5. **Visibility-filter test** at [`packages/storage/src/__tests__/visibility-filter.test.ts`](https://github.com/empressaioemail-tech/hauska-engine/blob/main/packages/storage/src/__tests__/visibility-filter.test.ts) demonstrates the MCP-boundary semantic: unauthenticated callers (`accessPolicies: ["public-free"]`) see Bastrop UDC + Grand County only; platform-internal callers (no filter) see all four jurisdictions. Anchors the engine side of cc-agent-M's Lane B `list_jurisdictions` MCP-tool implementation.

### Cost-per-jurisdiction (commitment #3 hard-kill checkpoint)

The 2026-05-19 ingest runs used:

- **LLM tokens**: 0. Curated queries authored from TOC inspection + live `--show-sections` runs; no LLM-generated drafts pinned to compute spend this session.
- **OCR spend**: 0. All three jurisdictions are born-digital / native HTML/JSON.
- **Embedding compute**: 0. Vector embeddings still deferred per `REPO_NOTES.md` §What's stubbed.
- **Infrastructure**: in-memory storage on the dev box. Negligible.
- **Human-review hours**: ~3.5 hours cc-agent-E session time across Phases A-E (Phase A+B in PR #5, Phases C/E in PR #6). All four jurisdictions onboarded for well under the $200 compute + 1 hr human review target per jurisdiction.

Hard-kill checkpoint at 3 jurisdictions per `51` §Stream 1D (tightened 2026-05-19): **CLEAR** at 4 onboarding events (Grand County + Bastrop UDC + Bastrop County + Elgin). Proof of cost model established; substrate v1 catalog expansion is unblocked on the cost-commitment front.

## What was learned (changes to ground truth)

### Two dispatch-assumption breaks

Per the 2026-05-19 dispatch §Phase C / D / E, all three internal-tier jurisdictions were assumed to be on Municode (Path A). Live recon surfaced:

1. **Bastrop County is NOT on Municode.** Subdivision Regulations live as PDF on bastropcounty.gov. The existing `RawPdfAdapter` (completed in PR #5 for Bastrop UDC) handles it. No new adapter required.

2. **Smithville is NOT on Municode.** Code lives on eCode360 (`ecode360.com/SM6484`). Current eCode360 adapter is a stub. Operator decision: defer Smithville to follow-on dispatch rather than rush adapter build-out into Sync 4.5 close.

Only Elgin matched the dispatch's Municode assumption.

**Pattern worth capturing for future dispatches**: where the dispatch names an adapter family without live verification, the agent should probe the actual source URL during the recon phase. The `getClientByName` API call + a web search would have surfaced these mismatches in minutes; the dispatch was written without that step.

### Storage scoring layer matured this session

Three substrate-level tightenings landed (in `InMemoryStorage.search`):

- Anchor-boost token-equality + trailing-punctuation strip
- Tokenizer preserves hyphens

These are not Bastrop / Elgin specific — every future jurisdiction with Municode-style chapter-number labels (Round Rock, Pflugerville, Austin, San Antonio, etc.) benefits. Carries forward to Sync 5.

### Coverage of partnership counterparty

The Bastrop B3 deprecation finding surfaced in PR #5 means **Sylvia Carrillo-Treviño** (Bastrop City Manager + named partnership counterparty in CLAUDE.md) is actively retiring the B3 Code in favor of a successor "Bastrop Development Code". The successor is in draft as of Dec 2025; no effective date. This belongs in any future Sylvia partnership conversation: substrate side has ingested the in-effect B3 Code today, and is ready to re-ingest the successor when it adopts (the adapter handles either PDF or Municode shape).

## What's still open

### Phase D / Smithville follow-on

Build out the eCode360 adapter. Scope estimate: ~1 session, same shape as `MunicodeHtmlAdapter` port. Steps: HTTP client against `ecode360.com` (probably JSON API or HTML), DOM walker → `NormalizedBlock` stream, conformance test against a captured Smithville fixture, CLI subcommand at `tools/migrate-legacy-codes` (`path-ecode360-ingest-smithville`). Once green, fold a curated query set + flip `accessPolicy: "platform-internal"`. Sync 4.5 retro-fires at 4 of 4 once Smithville lands.

### Elgin Chapter 48 (Site Developments)

Not in the Sync 4.5 close set because the leaf-fetch budget exhausted at Chapters 36 + 46. Raising `maxLeafFetches` to 400+ in a follow-on run captures Chapter 48. Currently 210 sections is the operator's substantive test surface for Elgin; Chapter 48 is a refinement.

### Bastrop B3 successor watch

The Bastrop Development Code (successor to the B3 Code) is in draft as of Dec 2025. When it adopts, refresh ingest. Adapter handles either source shape natively.

### Cost capture instrumentation

This PR did not exercise `ingest-cli cost-record` / `review-start` / `review-end` (the per-jurisdiction compute + human-review-hour tracking surface declared in `tools/ingest-cli`). The actual costs were ~$0 compute + ~3.5hr human across 4 jurisdictions, well under target — but the surface itself remains unexercised. A future ingest run should hit those endpoints to validate the data flow end-to-end and confirm the hard-kill checkpoint logic.

### Outstanding from PR #5 body

- **Path C orchestrator sniff-xref fix** — landed in this PR. Mirrors the Path B / Path PDF pattern.
- **Bastrop UDC reviewer-zero curation** by Sylvia / operator — still pending; not a Sync gate.

## Suggested canonical doc updates

[`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Sync points table — Sync 4.5 row should flip to **DONE** (3 of 4 jurisdictions) with the explicit Smithville-deferred note:

> 4.5 row update: status → **DONE (partial)** with note `"3 of 4 jurisdictions passed eval — Bastrop UDC public-free, Bastrop County + Elgin platform-internal. Smithville deferred to follow-on dispatch (eCode360 adapter required; current adapter is stub). See _sessions/2026-05-19_sync_4_5_close_cc-agent-E.md."`

[`00_current_state.md`](../00_current_state.md) §5 recent-sessions — prepend Sync 4.5 close-out entry.

[`CLAUDE.md`](../CLAUDE.md) "What is settled" — substrate v1 paragraph could note Sync 4.5 fired at 3 of 4 (Bastrop network), with Smithville deferred behind the eCode360 adapter.

[`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) §Sprint amendments — Amendment 3 noting the Bastrop County source re-routing (Municode → PDF) and Smithville source re-routing (Municode → eCode360 → deferred). The structural commitment-2 framing (partnership-first) is unchanged; only the adapter family per jurisdiction shifted.

A new follow-on dispatch at `_dispatches/<date>_cc-agent-E_smithville_ecode360_adapter.md` (or `cc-agent-{next}` if planner reallocates) for the deferred Smithville work.

## Commit batch

PR #6 against `empressaioemail-tech/hauska-engine` main: AccessPolicy plumbing + Phase C/E orchestrators + storage scoring fixes + visibility-filter test + Bastrop County and Elgin curated query sets. Workspace state at HEAD: 80 tests passing (37 corpus + 27 migrate-legacy-codes + 10 retrieval-api + 6 storage); `pnpm -r typecheck` clean across all 10 packages.

doc_repo: this session summary plus the planner's downstream canonical-doc updates per §Suggested above.
