# R-05 master planner scratch (Tier 2)

## GROUND-TRUTH

- **2026-08-21T11:54Z:** Seat integration, worktree `P:/doc_repo`, branch `main`, commit `d254467788c795c6f8fa5a9256ad6a074859b615`.
- **2026-08-21T11:53Z:** Preserved R-03 and R-04 artifacts from tmp worktrees at `4b174d1`. R-02 already in estate.
- **2026-08-21T12:30Z:** cited-untracked clean-tree proof at `P:/tmp/r05-cu-proof` (removed after). Unpatched exit 2, 4 hits all `.git/`. Patched exit 0. Inject exit 2 fixture pair. Restore exit 0. `--self-test` ok. Then baselineExit 2→0 BLOCKING.
- **2026-08-21T12:35Z:** R-01 grade D1 FAIL D4 MET D5 FAIL. R-09 LEAVE ALONE. Report filed.

## LESSON

- R-04 tracked diffs on `canon_divergence.md` and `repo_intents_checks.json` are `scripts/canon-divergence.mjs` write-path side effects. Generated md leaked `P:/tmp/r04-controls/`. Do not land. Confirmed on the write path, not the diff shape.
- cited-untracked "2 hits" in knownDebt was already stale at `d254467` (4), because the R-05 dispatch and mission also backtick `.git/`. Measure the pin on the commit you graduate.
- Consumer NONE 702 and NONE 2 are different questions (named loader vs bulk-CI stamp). Same label, different instrument.

## OPEN

- R-09 PR 447: merge only after property occupancy confirmed idle, then canary `--no-traffic`, then live GET.
- Operator: assign UNASSIGNED repos; decide whether to quarantine ADR-010/028 and 77.

## DEAD-END

- Copying R-04's generated `canon_divergence.md` into the estate would bake a throwaway worktree path into tracked canon.
- Occupying `P:/seat-worktrees/property/legacy-design-tools` while R-09 occupancy is UNCERTAIN. Seat-gate does not catch two occupants.
