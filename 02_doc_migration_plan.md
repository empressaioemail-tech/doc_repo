---
id: 02_doc_migration_plan
title: Pre-docs-repo migration plan
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [00_README, 01_doc_conventions, 10_ground_truth, 11_roadmap]
---

# Pre-docs-repo migration plan

> **Working triage matrix.** Edit in place as migrations close. Mark
> rows `done` when complete. When the queue is empty, this doc moves
> to `status: superseded` (or `historical`) â the matrix itself
> retires once the migration it tracks is finished.
>
> **2026-05-05 updates:** Item #11 (multitenancy) decided as ADR-005.
> Item #18 (strategic conversation record) in progress â three
> extractions landed (`13_risk_register`, `14_pricing_framework`,
> `17_leading_indicators`), original archived, remaining Parts
> tracked in archive header.

## Purpose

49 files exist in pre-docs-repo Claude.ai project knowledge
(`/mnt/project/`). The seed batch already absorbed roughly 13 of them
indirectly (through `10_ground_truth.md`, the docs conventions, the
agent rules v2, etc.). This matrix walks every remaining file and
decides one of four outcomes:

- **migrate** â substantive content; lands in this docs repo at a
  specific target path, with frontmatter + cross-reference cleanup
- **absorb** â content already covered by an existing docs-repo
  file; original retires from project knowledge once absorption is
  confirmed
- **archive** â historical / dated artifact; moves to
  `_sessions/archived/<YYYY-MM>/<filename>` to preserve the audit
  trail without crowding active docs
- **retire** â fully replaced or no longer relevant; removed from
  project knowledge with no docs-repo equivalent

## Sizing legend

- **S** â < 1h (small doc, light edits, mostly verbatim)
- **M** â 1-4h (substantive content, multiple cross-references)
- **L** â 1+ days (large doc, significant restructuring or content updates)

## Numbered-band reservations (for reference during migration)

- `00-09` â meta / conventions / migration plan
- `10-19` â portfolio reference (ground truth, roadmap, advisories)
- `20-29` â agent rules + dev flow
- `30-39` â SmartCity OS (30 product home; 31-39 sub-products)
- `40-49` â Design Accelerator (40 product home, 41 Revit Connector;
  42-49 sub-products)
- `50-59` â Hauska SDK
- `60-69` â Empressa products (ECI, Empressa Land)
- `70-79` â reserved
- `80-89` â ADRs (`80_adrs/` subdirectory)
- `90-99` â runbooks (`90_runbooks/`), postmortems (`91_postmortems/`)

## Triage matrix

### Migrate (12 items â substantive content needing its own home)

| # | Source file | Target | Size | Status | Notes |
|---|---|---|---|---|---|
| 1 | `22_empressa_land_build_spec.md` | `61_empressa_land_build_spec.md` | M | pending | Empressa Land paused per memory ("largely superseded by ECI direction"); decision: migrate-but-flag-as-paused-product. Could alternatively go to archive if Land is fully retired. |
| 2 | `23_empressa_company_intelligence_spec.md` | `60_empressa_company_intelligence.md` | M | pending | ECI v1 shipped; this is its product home. Frontmatter + cross-refs. |
| 3 | `30_hauska_sdk_vision.md` | `50_hauska_sdk_vision.md` | M | pending | Hauska SDK has v0.1.0 packages published, 391/391 tests passing. Vision doc is product-home material. |
| 4 | `31_hauska_sdk_architecture.md` | `51_hauska_sdk_architecture.md` | L | pending | Architecture spec; large doc. |
| 5 | `32_hauska_sdk_state_of_reality.md` | `52_hauska_sdk_state.md` | M | pending | SDK state; product-specific state belongs adjacent to architecture, not absorbed into `10_ground_truth.md`. |
| 6 | `33_hauska_sdk_roadmap.md` | `53_hauska_sdk_roadmap.md` | M | pending | SDK roadmap. Could partially feed `11_roadmap.md` portfolio-level entries; product-specific detail stays here. |
| 7 | `41_smartcity_operations_dashboard.md` | `31_smartcity_operations_dashboard.md` | M | pending | SmartCity sub-product. |
| 8 | `42_smartcity_citizenconnect.md` + `42a_smartcity_citizenconnect_product_description.md` | `34_smartcity_citizenconnect.md` | M | pending | Two source files merge into one target. |
| 9 | `43_smartcity_ai_plan_review.md` | `33_smartcity_ai_plan_review.md` | L | pending | Active development (M4-B PLR-1..28); largest sub-product spec. |
| 10 | `44_smartcity_digital_twinning.md` | `35_smartcity_digital_twinning.md` | M | pending | Early product per memory; lighter-weight than other sub-products. |
| 11 | `45_smartcity_multitenancy_spec.md` | `80_adrs/adr_005_smartcity_multitenancy.md` | M | pending | Architecture-level decision (every atom is tenant-scoped per ADR-001). Decided 2026-05-05: lands as ADR-005 rather than sub-product spec â multitenancy is architecture, not a product. |
| 12 | `46_smartcity_parcel_intelligence.md` | `32_smartcity_parcel_intelligence.md` | L | pending | Settled prerequisite to AI Plan Review per ADR; substantive doc. |
| 13 | `50_design_accelerator_roadmap_v2.md` | partial absorb into `11_roadmap.md` + remainder to `49_design_accelerator_roadmap.md` | M | pending | DA-specific roadmap; portfolio items go to `11`, DA-specific wave plans + sprint detail stay separate. |
| 14 | `51_design_accelerator_parcel_intelligence.md` | `42_design_accelerator_parcel_intelligence.md` | L | pending | DA sub-product spec; significant content. |
| 15 | `51a_design_accelerator_atom_catalog.md` | `45_design_accelerator_atom_catalog.md` | M | pending | DA atom catalog (referenced in `25_atom_architecture_reference.md` Section 8). |
| 16 | `_52___Design_Accelerator_Model_Viewer` | `43_design_accelerator_model_viewer.md` | M | pending | Odd filename in source (underscores, no extension); content needs verification before migration. |
| 17 | `53_design_accelerator_cad_connectors.md` | `44_design_accelerator_cad_connectors.md` | M | pending | DA CAD connector spec. |
| 18 | `04_strategic_conversation_record.md` | Option D extraction (multiple targets â see notes) | L | in progress | **2026-05-05:** Per Option D â Part 4 â [`13_risk_register.md`](13_risk_register.md) â; Part 9 â [`17_leading_indicators.md`](17_leading_indicators.md) â; Section 10.2 â [`14_pricing_framework.md`](14_pricing_framework.md) â; original archived to [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md). Part 8 (open questions) â [`11_roadmap.md`](11_roadmap.md) (pending). Part 3 / Part 5 / Part 6 partial / Part 10.3 / 10.5 / 10.6 stay in archive until extraction or retirement decided per-Part. |
| 19 | `92_architecture_diagrams.md` | `04_architecture_diagrams.md` | S | pending | Diagrams reference; foundational/meta band. |
| 20 | `wave0_p0-6_hsts_gated_runbook.md` | `90_runbooks/hsts_gated.md` | M | pending | Operational runbook; HSTS-gated deploy. |
| 21 | `codes-data-sourcing-strategy.md` | partial absorb into `32_smartcity_parcel_intelligence.md` and `42_design_accelerator_parcel_intelligence.md`, remainder retire | M | pending â peek required | Codes/legal data sourcing strategy. Spans both products' parcel intelligence work. Peek before deciding. |
| 22 | `2026-04-22_dast_workflow_permissions_fix.md` | `91_postmortems/2026-04-22_dast_workflow_permissions.md` | S | pending â peek required | If substantive postmortem, migrate. If light/dated, archive instead. |

**Migrate count: ~22 source files** (some merge into single targets). Realistic ~16-18 distinct target docs.

### Absorb (8 items â already covered by docs-repo files; originals retire)

| # | Source file | Absorbed into | Status | Notes |
|---|---|---|---|---|
| A1 | `01_current_state_ground_truth.md` | `10_ground_truth.md` | ready to retire | Already on supersession list in `10`. |
| A2 | `01_four_commitments.md` | `80_adrs/adr_001_atom_architecture.md` "Subsidiary commitments" subsection | pending â peek required | Probably absorbed; peek to confirm content match. |
| A3 | `02_architecture_reference.md` | docs-repo structure (no single file replaces it) | ready to retire | Architecture content distributed across `30`/`40`/`41`/`25` and ADRs. Already on supersession list. |
| A4 | `02_doc_triage_matrix.md` | this doc (`02_doc_migration_plan.md`) | ready to retire | Earlier attempt at the same triage. Possibly outdated; peek to recover any useful context not already here. |
| A5 | `03_state_of_reality.md` | `10_ground_truth.md` | ready to retire | Already on supersession list. |
| A6 | `11_roadmap.md` | `11_roadmap.md` (new) | ready to retire | Original was Phase-0-framed; the new roadmap supersedes. |
| A7 | `12_deployment_rules.md` | `90_runbooks/replit_deploy.md` + `20_agent_operating_rules.md` | ready to retire | Deployment rules absorbed across runbook + agent rules. |
| A8 | `13_agent_operating_rules.md` | `20_agent_operating_rules.md` (v2) | ready to retire | Already declared `supersedes` in v2's frontmatter. |
| A9 | `14_workstation_inventory.md` | `22_workstation_inventory.md` | ready to retire | Superseded. |
| A10 | `40_smartcity_os_suite_overview.md` | `30_smartcity_os.md` | ready to retire | Suite overview content fully covered by the product home. |
| A11 | `91_legacy_knowledge_architecture.md` | this docs repo (entire structure) | pending â peek required | Likely a meta doc about knowledge architecture that the docs repo *itself* embodies; absorb-and-retire if so. Peek. |
| A12 | `00_README.md` and root `README.md` | new `00_README.md` | ready to retire | The new README covers the docs repo purpose; pre-docs-repo READMEs were portfolio-level intros that the new structure replaces. |

**Absorb count: 12 items.** All retire from project knowledge once absorption is confirmed.

### Archive (6 items â historical / dated artifacts)

| # | Source file | Target | Status | Notes |
|---|---|---|---|---|
| Ar1 | `2026-04-18_constitutional_doc_reconciliation.md` | `_sessions/archived/2026-04/2026-04-18_constitutional_doc_reconciliation.md` | pending | Dated session record. |
| Ar2 | `STATE-OF-REALITY-UPDATE-2026-04-29.md` | `_sessions/archived/2026-04/2026-04-29_state_of_reality_update.md` | pending | Historical update absorbed into `10_ground_truth.md`. |
| Ar3 | `DECISION-LOG-ADDITIONS-2026-04-29.md` | `_sessions/archived/2026-04/2026-04-29_decision_log.md` | pending | Historical decision additions. |
| Ar4 | `SPRINT-CHANGELOG-2026-04-30.md` | `_sessions/archived/2026-04/2026-04-30_sprint_changelog.md` | pending | Sprint changelog. |
| Ar5 | `sidenotes.md` | `_sessions/archived/2026-04/sidenotes.md` (or ad-hoc by date if internal dates exist) | pending | Informal sidenotes. |
| Ar6 | `sidenotes_append.md` | same destination as Ar5 (concatenate) | pending | Continuation of sidenotes. |

**Archive count: 6 items.** Move to `_sessions/archived/2026-04/` and rename to date-prefixed filenames per `01_doc_conventions.md`.

### Retire (5 items â fully replaced or non-software)

| # | Source file | Reason | Status |
|---|---|---|---|
| R1 | `20_empressaio_atom_architecture.md` | Migrated to `25_atom_architecture_reference.md` + ADR-001 | ready to retire (migration complete) |
| R2 | `21_empressaio_atom_upgrade_guide.md` | Migrated to `26_atom_upgrade_guide.md` | ready to retire (migration complete) |
| R3 | `legacy_group_atx_brand_guide_w_logo.html` | Brand asset, not software docs; lives in brand asset storage | retire from docs repo |
| R4 | `90_legacy_group_overview.md` | Company-level overview; not software | retire from docs repo (or move to brand/company asset storage) |
| R5 | `SmartCity_Logo_Black_2_copy_3.png`, `SmartCity_LinkedIn_Banner_Centered_copy_2.png`, `SmartCityOS_Brand_Kit.pdf` | Brand assets; not software docs | retire from docs repo |

**Retire count: 7 items** (counting the 3 brand assets as one row).

## Summary

| Category | Count | Action |
|---|---|---|
| Migrate | 22 (â ~17 targets) | Substantive doc work, sized S/M/L |
| Absorb | 12 | Confirm absorption, retire originals |
| Archive | 6 | Move to `_sessions/archived/2026-04/` |
| Retire | 7 | Remove from project knowledge, no docs-repo equivalent |
| **Total** | **47** | (49 source files, with 2 merged pairs in migrate) |

## Peek-required items (decision deferred until file inspection)

These need a brief read of the source file before triage decision is finalized:

- `01_four_commitments.md` (A2) â confirm content matches ADR-001's subsidiary commitments
- `02_doc_triage_matrix.md` (A4) â check for any context worth preserving here
- `04_strategic_conversation_record.md` (#18) â decide migrate-as-strategic-decisions-log vs. chunk-into-ADRs vs. archive
- `91_legacy_knowledge_architecture.md` (A11) â confirm meta doc that the docs repo embodies
- `_52___Design_Accelerator_Model_Viewer` (#16) â verify content (filename is unusual)
- `codes-data-sourcing-strategy.md` (#21) â decide split between SmartCity OS parcel intelligence and Design Accelerator parcel intelligence
- `2026-04-22_dast_workflow_permissions_fix.md` (#22) â decide postmortem migration vs. archive

Six peek-required items. Each is < 5 minutes to inspect.

## Suggested execution order

1. **Resolve all peek-required items first** (~30 minutes total).
2. **Process the absorb + archive + retire categories in batch** (low-effort cleanup; ~1 hour total).
3. **Migrate Hauska SDK suite** (4 docs as a coherent set; M-L sizing) â these have zero docs-repo presence today and unblock the SDK work.
4. **Migrate SmartCity OS sub-products** (5 docs at the 31-35 slots) â fills out the product home structure.
5. **Migrate Design Accelerator sub-products** (4-5 docs at the 42-45 slots).
6. **Migrate Empressa products** (ECI, Empressa-Land-if-confirmed-active).
7. **Migrate operational runbook** (`hsts_gated`).
8. **Handle strategic decisions record** (`04_strategic_conversation_record.md`) once peek is done.
9. **Migrate diagrams + codes-data-sourcing** as they fit.

Realistic cadence: ~6-12 turns at one batch per turn. Faster if turns batch related items (e.g., the 4 Hauska SDK docs in one turn since they're parallel structure).

## Cross-references

- [`00_README.md`](00_README.md) â repo purpose, scope, numbering bands
- [`01_doc_conventions.md`](01_doc_conventions.md) â naming, frontmatter, archive/rollup conventions
- [`10_ground_truth.md`](10_ground_truth.md) â current portfolio state, supersession list (predates this matrix)
- [`11_roadmap.md`](11_roadmap.md) â portfolio roadmap; absorbs portfolio-level items from migrated roadmap docs
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) â example of decision-shaped migration target

## Revision history

- **2026-05-05 (origin):** initial triage matrix landed during docs-repo bootstrap session. Reflects pre-docs-repo state at `/mnt/project/` as of that date.
