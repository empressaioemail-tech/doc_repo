# Systems seat state

**Last updated: 2026-08-20.** Namespace `systems`. Worktree `P:/seat-worktrees/systems/doc_repo` on `seat/systems`. This finish pass ran from integration `P:/doc_repo` because that is where the untracked estate lives.

## OPEN

**BRANCH PROTECTION STAGE 1 LIVE 2026-08-20.** Close `_inbox/2026-08-20_branch_protection_close.json`. Decision `_decisions/2026-08-20_branch_protection_stage1.md`. Runbook `90_runbooks/91_branch_protection_runbook.md`. Config A on `doc_repo` (planner direct push ok, force-push blocked, `enforce_admins` false). Force-push of a parent SHA to `doc_repo` `main` refused `GH006` / `Cannot force-push to this branch`. Config B Stage 1 on hauska-map / hauska-engine / legacy-design-tools / empressa-trading / smart-markets (`git push` to `main` refuses `GH006` / pull request required, `enforce_admins` true, no required checks). Verified by violation. Do not narrate CI as required. Do not apply Stage 2 without the reliability report. The two pre-split `_STATE.md` paragraphs both said Stage 2 was OPEN and gated on that report. Property later filed `_inbox/2026-08-20_property_seat_final_report.md` claiming Stage 2 applied on three repos. That claim is flagged, not silently substituted.

**61 CANON 2026-08-20.** Numbered-band `61_enforcement_doctrine.md` is canon. `OPS/61_enforcement_doctrine.md` is a pointer. Decision `_decisions/2026-08-20_61_enforcement_doctrine_canonical_path.md`.

**SEAT TOPOLOGY FINISH 2026-08-20.** Extra worktrees named in `_catalog/seat_register.json` `otherWorktrees`. Dual-home pointers for 61, 62, 90, 91. Cited-untracked `scripts/enforcement/cited-untracked.mjs`. Uncommitted estate query `scripts/hygiene/untracked-estate.mjs` (reads integration porcelain so a seat worktree can see it). Override appends go to `_catalog/override_logs/<seat>.log`. Watches live in `_catalog/watch_registry/<id>.json`. Close `_inbox/2026-08-20_systems_topology_finish_close.json`.

**LANDINGS AUDIT 2026-08-20.** Report `_inbox/2026-08-20_systems_landings_audit.md`. Branch-protection unique facts from the pre-split duplicate paragraphs were reconciled into this file (GH006, force-push wording, runbook path).

**SEAT TOPOLOGY 2026-08-20.** Register `_catalog/seat_register.json`. Combined program state is generated from `_state/<seat>/STATE.md`. Control SEAT-01 `scripts/enforcement/seat-worktree-gate.mjs` refuses writes from an unregistered worktree and from named extra worktrees. Model: `62_seat_topology.md`.

## LIVE INFRA (systems)

doc_repo integration checkout `P:/doc_repo` on `main`. Seat worktrees under `P:/seat-worktrees/<seat>/`.
