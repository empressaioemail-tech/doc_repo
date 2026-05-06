---
id: 2026-05-05_doc_repo_planner
title: doc_repo bootstrap â Claude.ai planner session
date: 2026-05-05
agent: claude-ai-planner
repo: doc_repo
session_type: bootstrap
rolled_up: true
rolled_up_into: [00_README, 01_doc_conventions, 02_doc_migration_plan, 10_ground_truth, 11_roadmap, 13_risk_register, 14_pricing_framework, 15_replit_neon_ownership_advisory, 17_leading_indicators, 20_agent_operating_rules, 21_ai_first_dev_flow, 22_workstation_inventory, 23_dev_setup_assessment, 25_atom_architecture_reference, 26_atom_upgrade_guide, 30_smartcity_os, 40_design_accelerator, 41_revit_connector, adr_001_atom_architecture, adr_002_replit_neon_migration, adr_003_replit_neon_tactical, adr_004_future_neon_provisioning, replit_deploy, 2026-05-05_track_b_deploy_saga]
---

# doc_repo bootstrap â Claude.ai planner session

Day-long planning session that bootstrapped this docs repo from
scratch. Followed an extensive multi-repo recon and the Track B
saga aftermath.

## Inputs

- Multi-repo recon outputs (3 Cursor Claude Code agents working in
  parallel against `smartcity-os`, `legacy-design-tools`,
  `legacy-revit-sensor`)
- Replit Agent probe outputs from both Repls
- GCloud asset listing for `smartcity-os-prod`
- DNS + HTTP-headers verification of `smartcityos.io`
- Track B saga package (`track_b_deploy_saga_package_2026-05-05.zip`)
  containing 6 documents: postmortem, advisory, runbook, agent
  operating rules v2, dev setup assessment, cross-app handoff
- Pre-docs-repo project knowledge (~49 files in `/mnt/project/`)
- Strategic conversation record from April 2026 (1147 lines)

## Outputs (24 docs landed)

Foundation:
- `00_README.md` â repo purpose, scope, conventions
- `01_doc_conventions.md` â naming, frontmatter, write patterns,
  archive lifecycle
- `02_doc_migration_plan.md` â pre-docs-repo triage matrix (~22
  migrate, 12 absorb, 6 archive, 7 retire)

Portfolio reference:
- `10_ground_truth.md` â multi-repo recon synthesis, 5 fires ranked,
  planner-belief corrections, supersession list
- `11_roadmap.md` â portfolio checklist, P0-P3 tiers, ~37 items
- `13_risk_register.md` â 10 named failure modes (extracted from
  strategic record Part 4)
- `14_pricing_framework.md` â Path A vs Path B, Sylvia $1M live
  application (extracted from strategic record Â§10.2; original slot
  collision corrected to 14 next session)
- `15_replit_neon_ownership_advisory.md` â Replit-managed Neon
  ownership concern, four risks, migration plan
- `17_leading_indicators.md` â flat watchlist for monthly scan
  (extracted from strategic record Part 9)

Agent rules + dev flow:
- `20_agent_operating_rules.md` â v2 from Track B saga package, 10
  HR rules + 4 SR rules + 5 PC commitments
- `21_ai_first_dev_flow.md` â 6-agent fleet + Nick, work cycle,
  routing, fleet sizing rationale
- `22_workstation_inventory.md` â Nick box paths, cente box TBD
- `23_dev_setup_assessment.md` â strategic 3-layer plan
- `25_atom_architecture_reference.md` â full atom architecture spec
  (migrated from `20_empressaio_atom_architecture.md`)
- `26_atom_upgrade_guide.md` â adoption protocol (migrated from
  `21_empressaio_atom_upgrade_guide.md`)

Product homes:
- `30_smartcity_os.md` â SmartCity OS product home (Bastrop +
  Jarrell, 5-product suite, atom-graph thesis, Tyler positioning)
- `40_design_accelerator.md` â Design Accelerator product home
  (architect-side, customer-zero Empressa, 4-artifact monorepo)
- `41_revit_connector.md` â C# Revit add-in product home (single
  panel + 2 buttons today, B1-B5 aspirational)

ADRs:
- `80_adrs/adr_001_atom_architecture.md` â atom contract as
  foundational pattern
- `80_adrs/adr_002_replit_neon_migration.md` â paired migration
  commitment
- `80_adrs/adr_003_replit_neon_tactical.md` â transitional
  workaround
- `80_adrs/adr_004_future_neon_provisioning.md` â forward-looking
  policy

Operational:
- `90_runbooks/replit_deploy.md` â current Replit deploy runbook
- `91_postmortems/2026-05-05_track_b_deploy_saga.md` â frozen
  postmortem (12-hour saga)

Sessions:
- `_sessions/2026-05-05_smartcity-os_recon.md`
- `_sessions/2026-05-05_legacy-design-tools_recon.md`
- `_sessions/2026-05-05_legacy-revit-sensor_recon.md`
- `_sessions/archived/2026-04/2026-04-18_strategic_record.md` â full
  strategic record archived with extraction header

## Decisions made in session

- **Filenames use bare numeric prefixes** with no agent name in
  product/state docs (`30_smartcity_os.md` not
  `30_smartcity_os_state.md`). State lives in `10_ground_truth.md`
  separately; product homes are durable.
- **Sub-product docs band 31-39** for SmartCity OS, 42-49 for Design
  Accelerator. ADRs in `80_adrs/`. Runbooks in `90_runbooks/`.
  Postmortems in `91_postmortems/`. Sessions in `_sessions/` with
  `archived/` for historical.
- **Multi-tenancy decision lands as ADR-005**, not sub-product slot.
  Multitenancy is architecture, not a product.
- **Strategic conversation record decomposed via Option D**:
  extract Parts 4 / 9 / 10.2 into focused docs, archive original
  with extraction header table. Other Parts pending per-Part
  migration decisions.
- **Saga package cleanup decided as retire-both** (cross-app
  handoff + package README). Both fulfilled their purpose during
  the saga; individual docs migrated separately preserve content.
- **Update-cadence callout** at top of `10_ground_truth.md` â
  doc explicitly designed for in-place edits as state changes.
  Pattern repeated in `11_roadmap.md`, `12_migration_sprint.md`
  (next session), `13_risk_register.md`, `15_replit_neon_advisory`.

## Planner-belief corrections established

Multi-repo recon contradicted several memory items. Corrections
codified in [`10_ground_truth.md`](../10_ground_truth.md)
"Planner-belief corrections" section:

- SmartCity OS is on Cloud Run (since 2026-05-03), NOT Replit
- Phase 0 Stage 8 closure has no codified evidence
- Domain-event atoms (19) and code-atoms (479 on helium) are
  separate concepts
- "Six ribbon panels" / "B1-B5 taxonomy" do NOT exist in any repo
  (aspirational)
- A01-A06 sprint vocabulary wrong; repo uses DA-PI-* / V1-* /
  Sprint A-D / AIR-* / PLR-* / A04.7
- `engagements` and `code_atoms` tables live on legacy-design-tools'
  Neon, not SmartCity OS's
- Compass system prompt at line 1005, not 905
- Bundle name `index-BsfNEJYB.js`, not `index-BI7HSHku.js`
- Engagement spelling: Musgrave, not "Muskgrave"
- Atom count: 479 on dev (not the stale 264 UI-audit snapshot)

## Active fires identified

Five fires ranked in `10_ground_truth.md`:

1. Auth bypass live on SmartCity OS production
   (`server/routes.ts:83`)
2. Plaintext secrets in SmartCity OS `.replit` committed to git
3. legacy-design-tools `post-merge.sh` `--force` without Neon guard
4. SmartCity OS Repl drift (10 unpushed commits)
5. SmartCity OS cross-region DB hop

## Significant artifacts produced in chat (not committed as docs)

- W1.C.4a auth bypass dispatch prompt (held for Nick to dispatch)
- Sylvia $1M proposal email reply variants (operational, kept in
  chat / sent mail)
- Cloud Shell deploy sequence for canary tag pattern (codified
  next session as `90_runbooks/cloud_run_canary_deploy.md`)
- Comprehensive todo list with sections A-J (most absorbed into
  `11_roadmap.md` next session, some retained as chat reference)

## Lessons / patterns established

- **Planner stays at planning altitude** until Nick explicitly
  greenlights execution. Nick pulled planner back hard once mid-
  session ("we are supposed to be planning"), reinforcing the rule.
- **Doc deliverables come as files**, not fenced blocks in chat.
  Use computer-use file creation + present_files for review/commit.
- **One doc at a time** â drafted, presented, Nick reviews/commits,
  "proceed", next doc. No batch dumps.
- **Frontmatter required on every doc** â id, title, status,
  last_updated, applies_to. Optional supersedes / related / owner.
- **Append-only session summaries**, never edit canonical docs from
  agents directly. Planner does rollups end-of-day or when material
  changes warrant.
- **Verify before retyping** â for large doc migrations (atom
  architecture spec, advisory, runbook), copy source verbatim then
  apply surgical edits. Safer than retyping 800-line docs.

## Outstanding from this session (handed forward)

- 11 dispatch prompts un-drafted (Fire 4, W1.A.6-9, W1.C.1-3,
  A04.7 followups, lockfile drift, prefix collisions, GoTo OAuth)
- 6 peek-required items in `02_doc_migration_plan.md`
- ~22 substantive pre-docs-repo migrations queued
- gh auth login on Nick box (closed next session)
- Migration sprint structure decision (closed next session as
  3-phase split)
- Pricing framework slot collision at `15_` (caught and renumbered
  next session)

## References

- [`10_ground_truth.md`](../10_ground_truth.md) â primary
  synthesis output
- [`11_roadmap.md`](../11_roadmap.md) â primary planning output
- [`02_doc_migration_plan.md`](../02_doc_migration_plan.md) â
  forward-looking migration queue
- The 24 docs listed in Outputs above
