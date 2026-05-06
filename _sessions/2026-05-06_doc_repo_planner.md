---
id: 2026-05-06_doc_repo_planner
title: doc_repo handoff prep â Claude.ai planner session
date: 2026-05-06
agent: claude-ai-planner
repo: doc_repo
session_type: handoff_prep
rolled_up: true
rolled_up_into: [11_roadmap, 12_migration_sprint, 22_workstation_inventory, cloud_run_canary_deploy]
---

# doc_repo handoff prep â Claude.ai planner session

Continuation of yesterday's bootstrap. Today's work was about
getting to a clean state for fresh-agent handoff before sprint
execution begins.

## Inputs

- 28-file repo state from end of 2026-05-05 session
- Nick's tooling completion report (gh auth complete, all four
  repos verified accessible)
- Path discrepancy noted on screenshot: SmartCity OS at
  `P:\empressaio_tech_smartcity_os` (not `P:\smartcity-os` as
  documented yesterday)
- Roadmap-shape gaps surfaced in handoff audit (biz ops items not
  in repo, dispatch prompts queue not tracked, sprint structure
  decision not codified)

## Outputs (3 docs landed, 2 docs updated, 1 memory edit)

New:
- `12_migration_sprint.md` â 3-phase sprint plan (legacy-design-tools
  full migration â SmartCity OS Neon swap â Drizzle migrate
  adoption). Status board at top, sub-phases with checkboxes,
  per-phase rollback, discipline cross-references.
- `90_runbooks/cloud_run_canary_deploy.md` â extracted from
  yesterday's W1.C.4a deploy sequence. Reusable pattern: build â
  0%-traffic canary â smoke probe â traffic shift â backup tag â
  observation. Includes rollback paths and worked examples.
- `_sessions/2026-05-05_doc_repo_planner.md` â yesterday's session
  summary (audit trail behind doc_repo bootstrap).
- `_sessions/2026-05-06_doc_repo_planner.md` â this doc.

Updated:
- `22_workstation_inventory.md` â SmartCity OS path corrected
  (`P:\empressaio_tech_smartcity_os`); gh auth completion
  documented (`gh auth setup-git` + credential username pinning);
  Outstanding items struck through where complete; status callout
  at top reflecting 2026-05-06 state.
- `11_roadmap.md` â 2026-05-06 changes block added at top; P1
  migration items replaced by 3-phase sprint references; dispatch
  prompts queue added as P1 line item; gh auth + sprint structure
  decision marked closed; biz ops repo creation added as P2;
  Cloud Run canary runbook added as closed P2 item; references
  section updated with `12_migration_sprint.md` and
  `cloud_run_canary_deploy.md`.

Memory edit:
- Added pointer: doc_repo at `github.com/empressaioemail-tech/doc_repo`
  is canonical software docs source; sibling clones at
  `P:\doc_repo` + working repos.
- Replaced item #6 (active test projects) to correct
  "Muskgrave" â "Musgrave" and add 2026-05-05 recon verification
  status.

## Decisions made in session

- **Migration sprint structure: 3-phase split**, not lumped. Phase
  1 = legacy-design-tools full migration (sub-phased 1A/1B/1C to
  separate Cloud Run intro from Neon swap per Track B saga
  lesson). Phase 2 = SmartCity OS Neon swap isolated. Phase 3 =
  Drizzle migrate adoption process change. Total ~3 dev-days vs
  ~2.5 lumped; the 0.5-day premium buys failure-mode containment.
- **Phase 1 GCP project recommendation: new project for legacy-design-tools**
  (not reuse `smartcity-os-prod`). Blast-radius separation; aligns
  with future-product-pattern (ADR-004); simplifies IAM. Decision
  flagged in `12_migration_sprint.md` cross-cutting prerequisites.
- **Phase 1A introduces Cloud Run with the OLD Replit Neon URL** â
  verifies new deploy infrastructure before introducing new
  database. Avoids stacked-change failure mode. Phase 1C does the
  Neon cutover after 1A is independently verified.
- **Biz ops content lives in a separate repo**, not in `doc_repo`.
  Reasoning: different audience (Valerie, accountant, eventual
  investors), different security posture (more confidential),
  different update cadence (monthly close vs sprint-paced).
  Cross-references between repos handle straddling content
  (pricing framework's logic in doc_repo; pricing framework's
  numbers in biz ops). Six minimum-useful capture logs proposed:
  pricing log, deal events log, sprint actuals log, pipeline
  movement log, time allocation log, expenses log.
- **SSH remotes migration deferred indefinitely**. The
  `gh auth setup-git` + `credential.https://github.com.username`
  approach Nick set up is sufficient. SSH would have been a
  cleaner long-term solution but works equally well in practice.
- **Pricing framework renumber 15 â 14** caught and shipped via
  agent dispatch (planner gave the renumber prompt, Nick's agent
  executed `git mv` + sed replace + push). Slot collision had
  existed since yesterday's session; resolved cleanly.
- **Dispatch prompts kept in chat / drafted just-in-time** rather
  than codified as a folder of repo files. Reasoning: each
  dispatch is somewhat unique; templates emerge after running a
  few. Codify the template later if patterns surface.

## Lessons / patterns established

- **Slot-availability check before file assignment.** Yesterday's
  `15_pricing_framework.md` collision happened because the planner
  didn't grep for the slot before assigning. Worth codifying as a
  one-line rule in `01_doc_conventions.md` if it recurs.
- **Use bash sed for bulk find-and-replace** across multiple
  files instead of N str_replace calls. Saved time on the
  renumber + workstation-inventory updates.
- **The phase-status board pattern** at the top of
  `12_migration_sprint.md` is reusable for any multi-phase
  long-running effort. Glance-able status without prose hunt.
- **Memory edits are pointers, not duplications.** New memory
  entry points at canonical doc_repo location rather than
  duplicating content.

## Outstanding from this session (handed forward)

- Phase 1A kickoff dispatch prompt â not yet drafted; the sprint
  plan is the master doc, dispatch prompts get drafted JIT
- 11 other dispatch prompts still un-drafted (Fire 4, W1.A.6-9,
  W1.C.1-3, A04.7 followups, lockfile drift, prefix collisions,
  GoTo OAuth)
- 6 peek-required items in `02_doc_migration_plan.md` still
  un-peeked
- ~22 substantive pre-docs-repo migrations still queued
- Biz ops repo creation queued (Nick to start, planner to assist
  with skeleton + log templates when ready)

## What a fresh planner picks up tomorrow

If a new Claude.ai planning conversation starts with synced
project knowledge from this docs repo, it should be able to:

- Read [`10_ground_truth.md`](../10_ground_truth.md) for current
  state and active fires
- Read [`11_roadmap.md`](../11_roadmap.md) for the prioritized
  queue
- Read [`12_migration_sprint.md`](../12_migration_sprint.md) for
  the in-flight migration sprint
- Read this session summary + yesterday's session summary for
  audit trail of what was decided and why
- Read [`02_doc_migration_plan.md`](../02_doc_migration_plan.md)
  for the pre-docs-repo migration queue

The fresh planner doesn't need to bootstrap from chat history;
the docs are sufficient. Memory entry #9 points the planner at
doc_repo as canonical source of truth.

## References

- [`12_migration_sprint.md`](../12_migration_sprint.md) â primary
  output, the working sprint plan
- [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md)
  â operational pattern codified
- [`22_workstation_inventory.md`](../22_workstation_inventory.md)
  â updated with current tooling state
- [`11_roadmap.md`](../11_roadmap.md) â updated with 2026-05-06
  closures and new entries
- Yesterday's session: [`2026-05-05_doc_repo_planner.md`](2026-05-05_doc_repo_planner.md)
