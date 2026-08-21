---
id: 2026-08-21_r05_w2_disagreements
title: R-05 W2 — three census disagreements, verified at source
status: draft
date: 2026-08-21
last_updated: 2026-08-21
owner: integration
plan_row: R-05
---

# R-05 W2: three disagreements

Worker W2 for the R-05 master planner. Snapshot: `P:/doc_repo` branch `main` commit `d254467788c795c6f8fa5a9256ad6a074859b615`, seat integration. Read-only evidence also from `P:/tmp/r02-census`, `P:/tmp/r02-census-run`, and `P:/tmp/r04-controls`. No commits. No product repos.

Instruments run this session:

```
git rev-parse HEAD
# d254467788c795c6f8fa5a9256ad6a074859b615

node scripts/doc-staleness.mjs --json --today 2026-08-21
# scanned=2367  noFrontmatter.length=389  vocabViolations=1223
# foreign clones excluded: hauska-mcp-server (49 md), tmpbrief-l3-spine-consume (5 md)

node _scratch/r05_w2_measure.mjs
# census walk (.git + node_modules skipped): 2424 md
# YAML fence parse (LF or CRLF open): noFrontmatter=438
# census-run parse (LF open only): noFrontmatter=896
# duplicate ids, YAML fence parse: 18
```

Historical tracked-only reconstruction via `git cat-file --batch` at `e1fdc92`, `4b174d1`, `8b68e432`. Lane artifacts read, not trusted.

## 1. Duplicate ids

Resolved number (this snapshot, census walk, YAML frontmatter `id:`): **18** distinct ids claimed by two or more `*.md` files.

Counting rule. Recurse every `*.md` under the worktree. Skip directory basenames `.git` and `node_modules` only. Parse an opening YAML fence (starts with `---` plus a later `\n---`). Read the `id:` key inside that fence. An id is a duplicate when two or more paths share it. Pointer vs two-bodies is a second pass: `status: pointer` plus an `OPS/` stub that names the canonical file is a pointer pair; otherwise two bodies, then hash the whole file and the post-fence body.

Tracked-only (git `ls-files`, same parser) is a different question and equals **7**. That is the R-02 detached-worktree number. It is not the dirty integration estate.

### Classification at d254467 (all 18, re-read)

Pointer pair (benign; one live body, one stub):

| id | paths | evidence |
| --- | --- | --- |
| `61_enforcement_doctrine` | `61_enforcement_doctrine.md` (52541 B, `status: active`) + `OPS/61_enforcement_doctrine.md` (617 B, `status: pointer`) | OPS names the root as canonical. Live vs stub. |
| `62_seat_topology` | `62_seat_topology.md` (7566 B, `draft`) + `OPS/62_seat_topology.md` (363 B, `pointer`) | Same shape. |
| `90_enforcement_build_order` | `90_runbooks/…` (13865 B, `draft`) + `OPS/…` (415 B, `pointer`) | Same shape. |
| `91_branch_protection_runbook` | `90_runbooks/…` (10262 B, `active`) + `OPS/…` (579 B, `pointer`) | Same shape. |

Two bodies, identical copies (same bytes, or same bytes after CRLF/BOM normalize):

| id | paths | evidence |
| --- | --- | --- |
| `2026-07-31_smart_site_MARKET_white_paper` | `Master Collateral Folder/…` + `_inbox/…` | sha equal, 8119 B each |
| `2026-07-31_smart_site_TECHNICAL_white_paper` | same pair | sha equal, 17359 B |
| `2026-07-31_smart_site_smart_city_positioning` | same pair | sha equal, 4938 B |
| `2026-07-31_smart_site_white_paper` | same pair | sha equal, 15484 B |
| `34_smartcity_smart_files_and_foundation` | `_smartcity_masters/…` + `_scratch/removed_2026-08-14/shadow_smartcity_masters/…` | sha equal, 14025 B |
| `atx_bulls_11_design_system_claude_brief` | `_prospects/atx_bulls/…` + `uploads/…` | raw bytes differ (CRLF vs LF); LF-normalized sha `92db0fc353d4` equal, 15068 B |

Two bodies, diverged (the 51-incident class):

| id | paths | evidence |
| --- | --- | --- |
| `adr_025_og_atom_ontology` | `80_adrs/…` (30826 B, last_updated 2026-07-06, rulings applied) vs `_inbox/2026-07-05_draft_…` (24349 B, 2026-07-05 draft, PROMOTED banner) | Different dates, different body. Inbox says read the promoted file. Still a live second `id`. |
| `2026-08-08_L2_WAVE3_report` | `_inbox/…_report.md` (62353 B) vs `_inbox/…_report_a2.md` (18994 B) | Both `status: halted`. Different lengths. |
| `canon_divergence` | `_catalog/canon_divergence.md` (`status: clear`, 2026-08-21) vs `_inbox/2026-08-08_M2_historical_replay.md` (`status: ALARM`, 2026-08-09) | Same id on a live report and a historical replay. |
| `smartcity_masters_readme` | `_smartcity_masters/00_README.md` (8436 B) vs `_scratch/removed_…/00_README.md` (6790 B) | Shadow vs live. |
| `31_smartcity_dashboards` | masters 18383 B, last_updated 2026-08-10 vs shadow 18180 B, 2026-08-01 | Diverged. |
| `32_smartcity_asset_management` | 20250 vs 19955 | Diverged. |
| `33a_smartcity_plan_review` | 23770 vs 23428 | Diverged. |
| `35_smartcity_positioning_framework` | 9928 vs 9674 | Diverged. |

`51_ingestion_pipeline_reference` is not in the set. Root keeps `id: 51_ingestion_pipeline_reference`. `OPS/51_ingestion_pipeline_reference.md` now carries `id: OPS_51_ingestion_pipeline_reference_pointer` and `status: pointer`. That is the 2026-08-20 reconciliation. The incident class remains: two live diverged bodies with the same `id`. Pointer stubs with a different id do not collide.

### Losing numbers

Planner **20** (dispatch: "twenty distinct id values" at `e1fdc92`). Lost. Tracked YAML parse at `e1fdc92` is 7, the same seven as today. Unfiltered `git grep ^id:` at that commit is 10 (adds a conventions example `id: 10_ground_truth` inside `01_doc_conventions.md`, and a session-body `id:` under a Dispatch heading in an inbox report). 20 is not in git at the commit cited. Mechanism: a dirty-tree walk that day, including untracked white papers, scratch shadows, and the since-reconciled 51 pair. Second mechanism: someone counted files rather than ids (ten pairs would be twenty files). Rejected because the dispatch said "distinct id values," and the ten-id grep still does not reach 20.

R-02 dispatch-brief / detached close **7**. Right for a clean worktree / tracked YAML parse. Wrong as a count of the integration estate. `P:/tmp/r02-census` at generation listed those seven. Re-measured on `P:/tmp/r04-controls` at `4b174d1`: still 7. Mechanism: `git worktree add --detach` does not copy untracked files, so white papers, scratch shadows, and the canon_divergence replay are absent. Second mechanism: they under-counted the clean tree. Rejected; the seven paths were re-read and match.

R-04 **8**. Lost as a frontmatter count. `git grep ^id:` restricted to the first 15 lines of tracked `*.md` at `4b174d1` yields 8. The extra id is `2026-06-06_cc-agent-C_cotality_adapter_scaffold`. The dispatch file has it as a real frontmatter `id:`. The inbox session report `_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold.md` has a different frontmatter (`dispatch:` not `id:`) and then, at line 13 under a Dispatch heading, a pasted `id:` line. YAML fence parse does not see a collision. R-04's "1373 total" is the same grep's unique-id neighbourhood (this session: 1370 to 1375 depending on whether body hits count). Mechanism: `^id:` is not a frontmatter parser. Second mechanism: they included an eighth real fence pair the YAML walk missed. Rejected; the inbox file's opening fence was read.

R-02 integration close **16**. Lost as a complete count. `P:/tmp/r02-census-run/scripts/doc-census.mjs` requires `text.startsWith('---\n')` (LF only, no BOM). `61_enforcement_doctrine.md` and `_prospects/atx_bulls/11_design_system_claude_brief.md` open with `---\r\n`. They drop out of the id index. 18 minus 2 equals 16. The close also labelled every remaining non-OPS pair `two_bodies` without hashing: four white papers and `34_smartcity_*` are byte-identical copies; `atx_bulls` is CRLF-identical. Mechanism: LF-only fence detector. Second mechanism: those two pairs were removed between 8b68e432 and now. Rejected; both files still exist on this snapshot with CRLF fences.

Worker **18** (R-04 CP1). This one matches the dirty YAML walk. It was "corrected" to 8 and should not have been.

## 2. R-02 consumer NONE

Resolved: **not the same question.** 1998/702 and 2406/2 are both internally consistent. They measure different consumers on different denominators.

Question A (dispatch, and `P:/tmp/r02-census`). "What named per-document loader reads this file?"

Counting rule: walk `*.md` skipping `.git` and `node_modules`. Assign HOOK / CI / COMPILER / HARNESS / ROUTED only from an enumerated loader map (hooks, enforcement baseline scripts, dispatch, CLAUDE/AGENTS, `.cursor/rules`). Bulk walkers (`doc-staleness.mjs`, `cited-untracked.mjs`) are not per-file CI. Then CITED if another markdown file resolves a path to this one. Else NONE.

Result at `4b174d1` on a clean detached worktree, commit `4b174d1b129fa9eee54464967fe7da2b03828a72`: HOOK 5, CI 11, HARNESS 2, ROUTED 40, CITED 1238, NONE 702, total 1998. COMPILER is in the priority list and never wins: every compiler input is also HOOK or CI. That is recorded in the tmp CP2, not a missing class.

This is the question the R-02 dispatch asked. "NONE is a legitimate and expected answer for most of the estate." 702 of 1998 is that answer.

Question B (integration close, and `P:/tmp/r02-census-run`). "Is this file inside the doc-staleness walk, or otherwise named by a loader?"

Counting rule: same walk, then `if (inDocStalenessWalk(path)) types.add('CI')`. Staleness skip set used for that flag: `.git`, `node_modules`, `.claude`, `.cursor`, `scripts`. Priority HOOK > COMPILER > HARNESS > ROUTED > CI, so ROUTED still beats the bulk-CI stamp (42 ROUTED). Everything else in the walker becomes CI.

Result at `8b68e432` on the dirty integration tree: CI 2344, ROUTED 42, HOOK 9, CITED 5, HARNESS 3, COMPILER 1, NONE 2, total 2406.

NONE=2 is `.claude/skills/catalog-thesis-check/SKILL.md` and `.claude/skills/stakeholder-update/SKILL.md`. They sit under `.claude/`, so the bulk-CI stamp never applies. The census-run citation extractor is weaker (backticks and markdown links only, and only tracked files may cite), so catalog-thesis-check has `citedBy: []` here even though the named-loader census at 4b174d1 gave it four citers. Scratch's sentence "two `.claude/skills/*.md` are the only true consumer NONE in a 2,406-file estate" is true of question B, and false of question A.

1998 vs 2406 is the denominator, not a second consumer theory. Clean detached worktree is essentially the tracked set (1998 at 4b174d1; `git cat-file` says 1998 tracked md). Dirty integration walk at 8b68e432 is 2406 (this session at d254467: 2424). The extras are untracked `_inbox` / `_scratch` / collateral / nested clones the census walk does not skip.

CI-vs-HOOK priority. Named-loader script checks HOOK then CI. Census-run checks HOOK then COMPILER then HARNESS then ROUTED then CI, so a file both hooked and staleness-walked stays HOOK. The collapse to 2344 CI is not a HOOK/CI swap. It is the bulk-walk stamp on files that have no named loader.

`.claude/` exclusion. `scripts/doc-staleness.mjs` walk: skip any `entry.name.startsWith('.')`, plus WALK_SKIP `{.git, node_modules, .claude, .cursor, scripts}`, plus nested repos that carry their own `.git`. Skills are never vocab-scanned. The committed `scripts/doc-census.mjs` lists `SKIP_DIRS = {node_modules, .git, '.claude/skills'}`. `SKIP_DIRS.has(name)` sees basename `skills`, never `.claude/skills`. That skip never fires. It is the empty-branch regex in this instrument.

Losing numbers, if forced to pick one consumer NONE for the dispatch. **2 loses.** The dispatch said NONE is expected for most of the estate and that CI is a workflow or a script that reads the document, not "a recursive walk that happens to open every markdown file." 702 is the dispatch answer on a clean tree. It is not a claim about the dirty 2406-file tree, and it must not be quoted without "named loader, clean worktree, 4b174d1."

Mechanism for 2: bulk-CI assignment plus `.claude/` skip. Second mechanism: the estate really is almost fully loaded by hooks. Rejected; the named-loader map on the same commit assigns CI to 11 files, not 2344.

Mechanism for 702: named loaders only. Second mechanism: citation extraction failed and dumped files into NONE. Rejected for the 702 itself (CP2: NONE-with-citers = 0 on that run). Citation extraction did diverge across the two scripts for the two skill files; that affects which two files sit at NONE under question B, not the 702.

## 3. hasFrontmatter / noFrontmatter

Resolved: **not the same question** if the parser and the walk are not named. On the 4b174d1 clean tree the two honest fence counts are **319** and **321**. **365** and **880** lose.

Counting rules.

`scripts/doc-staleness.mjs` (vocab/staleness instrument):

Walk: every `*.md` under root. Skip names in WALK_SKIP `{.git, node_modules, .claude, .cursor, scripts}`. Skip every `entry.name.startsWith('.')`. Skip nested directories that contain their own `.git` (measured, reported). `_inbox` and friends are not walk-skipped; they are age-exempt only.

Fence: split lines; `lines[0].trim() === '---'`. `trim()` strips UTF-8 BOM. CRLF first lines still trim to `---`.

`noFrontmatter` is files where that test fails. Missing `status:` is a vocab violation on files that have a fence, and is a different array. Vocab FAIL 1223 at d254467 is not noFrontmatter.

`scripts/doc-census.mjs` / named-loader census (committed parser):

Walk: skip `.git` and `node_modules` only (the `.claude/skills` skip does not fire). Nested clones are counted.

Fence: `text.startsWith('---\n') || text.startsWith('---\r\n')`, then `indexOf('\n---', 4)`. BOM (`EF BB BF`) makes `startsWith('---')` false.

`P:/tmp/r02-census-run/scripts/doc-census.mjs` (integration close):

Walk: same as census (`.git` + `node_modules` only).

Fence: `text.startsWith('---\n')` only, closer `\n---\n`. CRLF open and BOM both fail. That is the 880.

### The 4b174d1 pair (321 vs 319) is a parser delta, not a walk mystery

On `P:/tmp/r04-controls` at `4b174d1` this session: staleness walk noFrontmatter 319; census committed parser noFrontmatter 322; `git cat-file` tracked-only census parser 321; tracked-only staleness parser 318.

R-02 reported census 321 and staleness 319. That matches tracked census parser 321, and staleness walk 319 (318 tracked-without-fence plus one untracked-without-fence on that worktree).

The three-file gap between census-no-fence and staleness-has-fence is UTF-8 BOM. Bytes read this session:

- `_inbox/2026-05-28_operator_neon_warmup_report.md` starts `EF BB BF 2D 2D 2D 0D 0A`
- `_inbox/2026-08-05_launch_capacity_audit.md` starts `EF BB BF 2D 2D 2D 0A`
- `_inbox/2026-08-05_launch_capacity_measured_facts.md` starts `EF BB BF 2D 2D 2D 0D 0A`

Staleness: first-line trim is `---` (BOM is Unicode whitespace). Census `startsWith('---\n')`: false. Those files have fences. Census reports them as noFrontmatter. R-02's +2 vs this session's +3 is one BOM file tracked vs untracked at generation time, not a third theory.

`.claude/skills` (7 files) all have fences. They explain walk-size, not noFrontmatter. Scratch's claim that the 321/319 gap is the two skill files is wrong.

### Losing numbers

Planner **365** (dispatch plus `.github/enforcement-baseline.json` knownDebt: "365 files with no frontmatter reported but not gated"). Lost. Tracked noFrontmatter at the cited commit `e1fdc92` is 317 (census parser) / 314 (staleness parser), not 365. Live staleness at d254467 is 389, not 365. Mechanism: a dirty-tree staleness walk from an earlier day, frozen into the baseline string and never re-run. Second mechanism: they quoted the vocab FAIL count from a narrower walk. Rejected for the baseline wording ("no frontmatter") and because current vocab FAIL is 1223, not 365. 365 is a staleness-labelled number with no surviving command output at `e1fdc92`.

**880** (R-02 integration close `totals.noFrontmatter`). Lost as a fence count. Census-run parser on this session's 2424-file walk: 896. Split measured: 438 true no-fence (committed parser) + 458 CRLF-or-BOM opens. 880 at 8b68e432 is the same parser on a slightly smaller dirty tree. Mechanism: LF-only `startsWith('---\n')`. Second mechanism: the dirty tree gained ~500 files without fences. Rejected; 458 files on this snapshot start with `---\r\n` and the run parser calls them missing.

Live numbers at the declared snapshot, if the question is "files whose first line is not a YAML fence, staleness walk, BOM-tolerant": **389 / 2367** (`doc-staleness.mjs --json --today 2026-08-21`, commit d254467). If the question is "census walk, BOM-intolerant but CRLF-tolerant": **438 / 2424**. Those two remain different questions. The 4b174d1 pair 319/321 is the same disagreement on a cleaner tree.

## What the census actually measured

There is not one census. R-02 produced two instruments and then copied the second into `_catalog/doc_census.json` on integration.

The first instrument (`P:/tmp/r02-census/scripts/doc-census.mjs`, close at `P:/tmp/r02-census/_inbox/2026-08-21_r02-doc-census_close.json`) walked markdown on a clean detached worktree at `4b174d1` (1998 files, essentially the tracked set). For each file it asked which named loader reads it. Bulk CI walkers were excluded on purpose. 702 files had no named loader, no harness route, and no inbound markdown citation. That is the dispatch's consumer field.

The second instrument (`P:/tmp/r02-census-run/scripts/doc-census.mjs`, integration close and `_catalog/doc_census.json`) walked markdown on a dirty integration tree at `8b68e432` (2406 files). It then stamped CI onto every path the staleness walker would open. Consumer NONE shrank to two skill files under `.claude/`, which that walker never opens. The same script's fence detector required a literal LF `---\n`, so CRLF and BOM files were counted as having no frontmatter (880) and two CRLF files with real `id:` values vanished from the duplicate index (16 instead of 18). Tracked vs untracked inside that JSON (2000/406) disagrees with the human summary (1041/1365); git at that commit has 2000 tracked markdown files. Trust the JSON totals.rows length, not the prose table.

Neither instrument is a doc-staleness run. Staleness scanned 2345 files at the close's own reconciling command and 2367 on this snapshot. Its `noFrontmatter` array is the BOM-tolerant fence test on that narrower walk. Its 1223 vocab FAIL is illegal or missing `status:` on files that have a fence. Mixing those three numbers is how 365, 321, 319, and 880 were treated as answers to one question.

Operator use: if you want "who reads this document," use the named-loader distribution (HOOK 5, CI 11, NONE 702 on a clean tree). If you want "does CI vocab-scan this file," almost the whole estate is yes except `.claude/`, `.cursor/`, `scripts/`, and nested clones. If you want "duplicate ids that can still produce a 51-incident," start with the eight diverged two-body ids above, not the pointer stubs and not the byte-identical copies.
