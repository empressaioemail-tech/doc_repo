You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not occupy P:/doc_repo (integration main). Do not raise any `baselineExit`. Do not fold OPS-18 into OPS-16. Do not retire OPS-18. Do not start R-02 / R-03 / R-04 remainder except as named leftovers. Do not write product repos.

Plan row R-06. Seat: systems. Occupancy: P:/seat-worktrees/systems/doc_repo on branch seat/systems, or isolated P:/doc_repo-worktrees/gov-r06 if that seat tree is dirty. Confirm occupancy in CP1. Doc_repo writes: your _inbox JSON only plus the enforcement files this card names.

WDLL: P:/doc_repo/_inbox/2026-08-21_ops18_all_board_WDLL.md item 12. Prior slice: `_inbox/2026-08-21_r06-slice_close.json`. The three scripts already exist and self-test. That is not this card. Item 12 fails if a control only self-tests.

## Mission

Arm R-06 so a known violation fails a running job, not a laptop.

The three controls:

1. `scripts/enforcement/canon-divergence-check.mjs` (wrapper around `--check-only`). Must not write `_catalog/canon_divergence.md`.
2. `scripts/enforcement/tooling-register-schema.mjs`
3. `scripts/enforcement/factory-termination.mjs`

They are already rows in `.github/enforcement-baseline.json`. `ci-baseline.mjs` is the ratchet. Read the workflow that invokes it. If that workflow does not run on `main` pull requests (or a schedule), wire it so it does. A row in the JSON with no job is dormant.

canon-divergence stays REPORTING until CI can observe a live ALARM. The known limit is ubuntu-latest has no P:/ sibling clones. Do not graduate to BLOCKING on local-only proof. You MAY add a checked-in fixture clone the wrapper points at in CI so the job can see ALARM. Prove it: inject a fixture that must fail the GitHub job (or a `act`-less `ci-baseline` run that is the same argv the workflow uses), then restore. Record both exits.

Prove tooling-register-schema and factory-termination the same way against the argv CI uses, not only `--self-test`.

Never raise a baselineExit to go green. If a control fails live, pin knownDebt with the ids.

Do not treat "scripts exist" as armed.

## Return

CP1: occupancy SHA, which workflow file runs `ci-baseline`, current tier of each of the three, what violation you will inject. CP2 after the fail-then-restore. CLOSE quotes workflow name, job id, commands, exits, and whether `_catalog/canon_divergence.md` changed (it must not). leave_behind: planner merge; R-02 remainder / R-03 / R-04 named only.
