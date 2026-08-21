# R-04 control census scratch (Tier 2)

## GROUND-TRUTH 2026-08-21T20:10Z
- Worktree P:/tmp/r04-controls @ 4b174d1 detached
- ci-baseline.mjs exit 0; cited-untracked exit 2 (1176 hits); doc-staleness exit 1
- seat-gate.mjs import ERR_MODULE_NOT_FOUND — resolves ../scripts to .cursor/scripts
- SEAT-01 CLI unregistered worktree exit 2 verified

## LESSON 2026-08-21
- canon-gate M3/M4/M5 Agent-only; Write _dispatches/ is the dominant hand-carry bypass for compiled-dispatch checks. dispatch-template-gate still catches long _dispatches/ writes.
- M4 is internal-consistency: dispatch.mjs writes marker into AGENT_CONTRACT.md; canon-gate reads same file.
- seat-register in enforcement-baseline is FALSE-GREEN: library with no main(), subprocess exit 0 vacuous.
- Duplicate id count at 4b174d1 is 8 pairs (frontmatter id: scan), not 20 (R-02 e1fdc92) or 18 (worker recount method difference).

## LESSON 2026-08-21
- enforcement.yml ee4ea4a had continue-on-error false-green; current 4b174d1 uses ratchet without continue-on-error in executable YAML.
- doc_repo branch protection: force-push blocked, required status checks NOT enabled — CI advisory.

## DEAD-END 2026-08-21
- Attempted to reproduce BRANCH-MATCHER over-scope (echo git commit on non-main) — integration checkout on main at census; code self-labels presence-shaped matcher.

## OPEN
- R-04 second half blocked on R-01 blueprint
- seat-gate.mjs import fix is build item not census
- Product repo local checkouts may be stale vs remote (ldt pr-checks, hm source-encoding)
