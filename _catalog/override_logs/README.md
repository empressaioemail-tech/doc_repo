# Override logs (per seat)

New override rows append here as `<seat>.log`. Historical rows stay in `_catalog/dispatch_overrides.log` and `_catalog/canon_overrides.log` and are not rewritten.

What executes: hooks in `.claude/hooks/` and `scripts/enforcement/seat-worktree-gate.mjs`.
What triggers: CLOSE_OVERRIDE, DISPATCH_OVERRIDE, CANON_OVERRIDE, SEAT_GATE_OVERRIDE.
What fails: nothing fails if the append cannot run; the hatch still opens. Missing rows are a finding, not a block.
What bypasses: any harness that does not load these hooks; native git.

Do not append to the two historical files. Do not delete them.
