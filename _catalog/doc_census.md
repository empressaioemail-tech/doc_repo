# Doc consumer census (R-02)

Generated: 2026-08-21T~03:15Z  
Commit: `8b68e4324a66709cb6f01a5515cf7101f79b163e` (`P:/doc_repo`, branch `main`)  
Instrument: `P:/tmp/r02-census-run/scripts/doc-census.mjs` (loaders read from source, not grep-only)

## Totals

| Metric | Census | Notes |
| --- | ---: | --- |
| Markdown files | 2406 | All `*.md` under repo; excludes only `.git`, `node_modules` |
| Tracked | 1041 | `git ls-files` |
| Untracked | 1365 | Mostly `_inbox/`, `_scratch/`, working artifacts |
| No frontmatter (`---` absent) | 880 | Census counts missing opening fence only |
| Duplicate `id` values | 16 | Distinct ids claimed by 2+ paths |

## Consumer distribution

| Consumer | Count | Meaning |
| --- | ---: | --- |
| CI | 2344 | `doc-staleness.mjs` vocab walk and/or `.github/workflows/enforcement.yml` scripts |
| ROUTED | 42 | Named in `AGENTS.md`, `CLAUDE.md`, or `.cursor/rules/*.mdc` read-first lists |
| HOOK | 9 | `.claude/hooks/*.ps1` or `.cursor/hooks/seat-gate.mjs` reads/checks |
| CITED | 5 | Tracked docs link to it; no loader executes on it |
| HARNESS | 3 | `CLAUDE.md`, `AGENTS.md`, `ENFORCEMENT.md` auto-loaded |
| COMPILER | 1 | `_STATE.md` via `scripts/dispatch.mjs` (also HOOK/ROUTED) |
| NONE | 2 | No loader, CI, compiler, harness, or inbound tracked citation |

Priority order when multiple apply: HOOK > COMPILER > HARNESS > ROUTED > CI > CITED > NONE.

## Reconciliation vs 2026-08-20 baseline (not adopted silently)

| Instrument | Dispatch baseline | This run | Method difference |
| --- | ---: | ---: | --- |
| `cited-untracked.mjs` | 1108 hits @ `e1fdc92` | **1178** hits @ `8b68e432` | Same script; tree grew (untracked `_inbox`, blueprint, census). Exit 2. |
| `doc-staleness.mjs` scanned | (365 no-FM cited in dispatch) | **2345** scanned | Dispatch figure mixed "no frontmatter" with vocab violations. This run: **1223 vocab FAIL** (missing/illegal `status`), split 114 canonical + 1109 exempt-tree. |
| Duplicate `id` | 20 distinct | **16** distinct | Census counts `id:` in frontmatter across all 2406 md; historical 20 may include non-md or manual audit. |

Report both numbers; do not quietly adopt either baseline.

## Duplicate ids (16) — pointer vs two bodies

| id | Paths | Disposition |
| --- | --- | --- |
| `62_seat_topology` | `62_seat_topology.md` + `OPS/62_seat_topology.md` | **Pointer pair** (OPS declares pointer) |
| `90_enforcement_build_order` | `90_runbooks/…` + `OPS/…` | **Pointer pair** |
| `91_branch_protection_runbook` | `90_runbooks/…` + `OPS/…` | **Pointer pair** |
| `adr_025_og_atom_ontology` | `80_adrs/…` + `_inbox/…draft…` | **Two bodies** (draft vs ADR band) |
| `2026-07-31_smart_site_*` (×4) | `Master Collateral Folder/` + `_inbox/` | **Two bodies** (collateral vs inbox copies) |
| `canon_divergence` | `_catalog/canon_divergence.md` + `_inbox/…replay…` | **Two bodies** (live report vs historical replay) |
| `2026-08-08_L2_WAVE3_report` | two `_inbox/` variants | **Two bodies** |
| `smartcity_masters_readme` | `_smartcity_masters/00_README.md` + `_scratch/removed_…/00_README.md` | **Two bodies** (shadow copy in scratch) |
| `31_smartcity_dashboards` … `35_smartcity_positioning_framework` | `_smartcity_masters/` + `_scratch/removed_…/shadow_…` | **Two bodies** (removed shadow vs authoritative masters) |

Note: `51_ingestion_pipeline_reference` duplicate was **reconciled 2026-08-20** (`OPS/` is now an explicit pointer with different `id`); it no longer appears in the duplicate set.

## Consumer NONE (2 files)

1. `.claude/skills/catalog-thesis-check/SKILL.md`
2. `.claude/skills/stakeholder-update/SKILL.md`

Both live under `.claude/`, which `doc-staleness.mjs` excludes from its walk. Nothing in hooks, CI, harness, or tracked citations names them.

## Three most dangerous unread-by-loader documents

Only two files have consumer `NONE`. The third slot is the highest-risk **CI-only** doc that governs active program work but is not in any read-first harness list:

| Rank | Path | Consumer | Why dangerous |
| --- | --- | --- | --- |
| 1 | `.claude/skills/catalog-thesis-check/SKILL.md` | NONE | Governs brand/placement/architecture triggers; agents only get it if they remember the skill exists. |
| 2 | `.claude/skills/stakeholder-update/SKILL.md` | NONE | External comms voice law; same orphan skill path. |
| 3 | `51_ingestion_pipeline_reference.md` | CI | OPS-18 blueprint compiles from it; only consumer is vocab scan, not ROUTED/HARNESS/COMPILER. Correct artifact, no reader. |

Honorable mention: `_blueprint/40_rule_register.md` (CI, zero citations) — rule register with no executor and not yet in mesh read order.

## Loaders enumerated

| Loader | Files read |
| --- | --- |
| HOOK | `canon-gate.ps1`, `dirty-tree-close-gate.ps1`, `canon-divergence-run.ps1`, `dispatch-template-gate.ps1`, `branch-guard.ps1`, `seat-gate.mjs` |
| CI | `.github/workflows/enforcement.yml` → baseline scripts including `doc-staleness.mjs`, `cited-untracked.mjs`, `c-00-vehicle-sync.mjs`, … |
| COMPILER | `scripts/dispatch.mjs` → `_STATE.md`, plan files, `AGENT_CONTRACT.md`, `DEV_PROCESS.md` |
| HARNESS | `CLAUDE.md`, `AGENTS.md`, `ENFORCEMENT.md`, five `.cursor/rules/*.mdc` |

Full row data: `_catalog/doc_census.json` (2406 rows).

## Pre-registered self-checks

| Check | Result |
| --- | --- |
| Under-count by skipping untracked md | Rejected — census includes 1365 untracked paths |
| Over-assign CI by ignoring ROUTED | Fixed — ROUTED beats CI per dispatch; 42 ROUTED rows |

## Quarantine

R-02b 2026-08-21: remainder against bounded canon set (`countTotal` 238). Three two_bodies already in `_quarantine/`. Remaining pairs held (byte-identical white papers, gitignored scratch, pointer stubs, operator items). Census not re-run.
