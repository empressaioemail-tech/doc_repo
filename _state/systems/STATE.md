# Systems seat state

**Last updated: 2026-08-20.** Namespace `systems`. Worktree `P:/seat-worktrees/systems/doc_repo` on `seat/systems`.

## OPEN

**BRANCH PROTECTION STAGE 1 LIVE 2026-08-20.** Close `_inbox/2026-08-20_branch_protection_close.json`. Config A on `doc_repo` (direct push ok, force-push blocked, `enforce_admins` false). Config B Stage 1 on hauska-map / hauska-engine / legacy-design-tools / empressa-trading / smart-markets (PR required, no required checks, `enforce_admins` true). Verified by violation. Stage 2 required checks are OPEN and gated on the property seat reliability report. CI remains advisory. Do not narrate CI as required.

**SEAT TOPOLOGY 2026-08-20.** Register `_catalog/seat_register.json`. Combined program state is generated from `_state/<seat>/STATE.md`. Control SEAT-01 `scripts/enforcement/seat-worktree-gate.mjs` refuses writes from an unregistered worktree. Model: `62_seat_topology.md`.

## LIVE INFRA (systems)

doc_repo integration checkout `P:/doc_repo` on `main`. Seat worktrees under `P:/seat-worktrees/<seat>/`.
