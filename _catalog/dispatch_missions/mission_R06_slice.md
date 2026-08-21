You MUST NOT spawn sub-agents. Do not commit. Do not git add/commit/push.

Plan row R-06. Seat integration. Worktree P:/doc_repo.

## Mission

Build the three R-06 controls named in `90_operations/OPS-18a_path_to_smartsite_market.md` acceptance item 3. Prove each by violating it. Never raise a baselineExit.

## Controls

1. `scripts/canon-divergence.mjs --check-only`
   - Current script always writes `_catalog/canon_divergence.md` and exits 0. Add `--check-only` that compares and exits non-zero on alarm, writes NOTHING to tracked catalog files. `--out` to `_inbox/` is allowed. Default (no flag) may still write, but CI must invoke `--check-only`.
   - Stop leaking absolute worktree paths into the report (the r04-controls `P:/tmp/...` leak). Use a repo-relative path.
   - Wire CI: change the canon-divergence row in `.github/enforcement-baseline.json` to pass args if ci-baseline supports it; if it does not pass extra args, wrap as `scripts/enforcement/canon-divergence-check.mjs` that calls the script with `--check-only --no-fetch --no-stamp` and point the baseline at the wrapper.
   - Prove: run check-only, confirm `_catalog/canon_divergence.md` mtime/hash unchanged. Inject a fake alarm or a fixture that must fail. Restore. Record both exits.
   - Do not graduate to BLOCKING unless you actually violated it. REPORTING is honest if violation is incomplete.

2. `scripts/enforcement/tooling-register-schema.mjs` (BP-ENF-01)
   - Fail if any control row in `_catalog/tooling_register.json` (the array of controls, not prose) is missing executor/trigger/failure/bypass. Read the actual JSON shape first. Name the fields that exist. Do not invent a schema the file does not use; map BP-ENF-01's four questions onto the real keys (consumer/trigger/failure/bypass or equivalent).
   - `--self-test` with a fixture missing one field that fails, and a complete fixture that passes.
   - Add to enforcement-baseline.json. baselineExit 0 only if live register currently passes. If it fails today, pin the current exit and knownDebt. NEVER raise a baseline to go green.

3. Factory termination detector `scripts/enforcement/factory-termination.mjs` (BP-FACTORY-01)
   - Fail on `_catalog/parts_inventory.json` rows where `kind === "factory"` AND (`terminationCondition` missing, empty, or `NONE`).
   - Do NOT fail stores with NONE (R-05: do not treat hauska_mcp.atoms as a factory off-ramp miss).
   - `--self-test`. Live: if zero factory-NONE, baselineExit 0. If some exist, pin knownDebt with the ids. Never raise baselineExit.

## CI

ci-baseline.mjs currently spawns `node script` with no extra args. Wrappers are the way to pass flags. Add new rows to `.github/enforcement-baseline.json`. Do not modify C-00, plan-registry, memory-promotion, hooks-loadable named workflow steps unless required.

## Return

Paths written. Violation evidence for each control (command, exit before, exit after restore). Confirm canon_divergence.md was not mutated by check-only. Confirm no baselineExit was raised.
