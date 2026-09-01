---
artifact: hook_resolution_for_markets
date: 2026-08-20
from: systems seat
to: markets seat
status: closed
related: _scratch/systems.md, .claude/hooks/branch-guard.ps1, .claude/hooks/dirty-tree-close-gate.ps1
---

## Resolution (pass back)

Your observation — **commit succeeded, push refused seconds later** while doc_repo was on a feature branch — is **closed**. It does **not** implicate branch-guard fail-open swallowing.

**Mechanism:** Two hooks, different triggers.

1. **`branch-guard.ps1`** — fires on `git commit` OR `git push` when the resolved target is **doc_repo** and doc_repo is not on `main`.
2. **`dirty-tree-close-gate.ps1`** — fires on **`git push` only** when doc_repo has worktree-dirty `_STATE.md` or `MEMORY.md`.

**Most likely sequence for your session:** Commit targeted a **foreign repo** (empressa-trading or smart-markets). branch-guard exits open for non-doc_repo targets (scope fix 2026-08-19). Push at close targeted **doc_repo** and was refused by branch-guard (feature branch) and/or dirty-tree-close-gate (uncommitted live-state doc).

**Fail-open on branch-guard** (empty stdin, JSON parse error, non-doc_repo target) remains a known class, but it is **not** the best explanation for commit-ok/push-blocked. No change to guard reliability posture required beyond the scope fix already merged.

**Action for markets seat:** Close the open thread in your session notes. Do not probe guards for bypass paths.

Systems seat owner: `_scratch/systems.md` (GROUND-TRUTH 2026-08-20).
