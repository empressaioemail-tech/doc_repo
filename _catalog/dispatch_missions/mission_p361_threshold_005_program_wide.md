## Mission — P-361: one destructive-write threshold, 0.05, that both repos can see

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and `hauska-engine`, each from
current `origin/main` with the SHA declared (factory `0f4558a4`, engine `c41a1482` at compile). You do
not merge, deploy or write any store; the integration seat merges and deploys. Any doc_repo change is
handed back as a diff in your close.

### The ruling (A-220, `_decisions/2026-09-18_phase0_closeout_rulings.md`)

The program's single declared destructive-write threshold is **0.05**, not 0.5. P-328's PR
(hauska-engine #474, head `6b4c3557`, branch `lane/p328-engine-reconcile-blast-radius`, green, HELD)
made the engine read the factory's 0.5, which would have loosened the engine's live 0.05
(`MAX_ORPHAN_SHARE`, `MAX_REACTIVATION_SHARE`) tenfold on the writer that retired 92.5 percent of
Bastrop on 2026-09-15. #474 merges only after this row moves the factory's number.

### What exists (read at compile)

- **Factory:** `src/lib/destructive-write-guard.mjs` declares `MAX_DESTRUCTIVE_SHARE = 0.5`. Its basis:
  Williamson's legitimate 282,569-of-602,050 retirement (0.4694, 2026-09-10) sits below it and the
  two incidents (0.925, 1.000) above it. `DESTRUCTIVE_WRITERS` is the register (wired:
  `publish-retirement` via `requireRetirementGate`; not wired, with reasons: `purge-bastrop-orphans` and
  others). `test/destructive-write-guard.test.mjs` scans `src/` so a new destructive statement cannot be
  missed by omission.
- **The basis has changed.** Since P-327 (#177) `destructive` counts NEW retirements only; rows already
  retired are re-retirements, reported and never added to the share. P-327's census
  (`_inbox/2026-09-18_p327-retirement-gate-roll_census.json`, staging) reads zero new retirements in
  all six counties, and Williamson's R keyspace now reads as re-retirements. So the 0.4694 that set 0.5
  no longer enters the share at all. A future legitimate retirement that large goes through the
  existing population-bound authorisation (`DESTRUCTIVE_WRITE_AUTHORISATION`), on purpose.
- **Engine (#474, not on main):** `packages/engine-core/scripts/destructive-write-declaration.mjs`
  carries the factory's facts pinned by SHA; `check-destructive-write-share-divergence.mjs` compares
  them offline and, with a local clone, re-derives them. hauska-engine is public and hauska-factory is
  private, so only the factory's CI can read the other side (P-328's own leave-behind).

### What to build

1. **Factory declaration.** `MAX_DESTRUCTIVE_SHARE = 0.05`, with the header's basis rewritten from the
   evidence above (the new-retirements-only rule and P-327's census; the incidents; what the
   authorisation is for). Say plainly what 0.05 now refuses that 0.5 let through, and what a
   legitimately large retirement must do.
2. **Every factory destructive writer, at the new number.** For each `wired` entry, a test refusing a
   6 percent share and passing a 4 percent one through the real call path, not a unit of
   `assertBlastRadius` alone. For each unwired entry, re-read its reason at 0.05 and say whether it
   still holds.
3. **#474 re-pinned.** Update #474 in place (a new commit on its branch, rebased onto current engine
   main): the declaration carries 0.05 and the new factory facts, and its offline check still passes.
   Do not open a second PR for the same change.
4. **The factory reads the engine's copy.** A factory CI job checks out hauska-engine main (public)
   and fails when `destructive-write-declaration.mjs` disagrees with the factory's declaration on the
   share, the authorisation variable or the refusal codes, with a `--selftest` run first (the
   `check-ldt-*-drift` pattern already in `.github/workflows/ci.yml`). A missing engine file is a
   failure with its own message, never a pass.
5. **The merge order, designed.** The two PRs reference each other. Design an order in which each
   merges green against the base it merges into, with no window where either CI is red by design or
   skipped, and state it. If the engine pin names a factory commit, say how it survives a squash merge
   (a content hash may be the better pin); choose and say why.

### Verify by violation

Pre-register your falsifiers. The factory check fails when the engine copy reads 0.5, when the file is
absent, and when a refusal code is renamed on one side; each shown. The engine's own suite still
refuses Bastrop's measured 57,704 of 62,394 and still lets Kenedy's 1 of 528 through. A 6 percent
share refuses and a 4 percent share passes in every wired factory writer and in the engine's
`write-parcel-node-county` and reactivation guard. State the gate-scheduler and publish verdicts you
predict at 0.05 for the six counties from P-327's census (all zero new retirements), so the seat can
check them after deploy.

### The three-question gate

Answer in your close: what executes the threshold in each repo, what triggers the cross-repo check,
what fails when the two declarations disagree, and what bypasses it (a raw write, a writer not in
either register, the engine repo changing without a factory push to re-run the factory's CI).

### Constraints

- No store writes, no deploys, no merges.
- Factory merge order (the seat serializes): P-333, then P-334/P-329/P-330, then P-352 and yours, then
  P-300 and P-338's writer half, then P-336's.
- The factory's publish image carries a stale bake pin until P-351; this change needs no bake.

### Close

Declare: the start commits, both PRs (factory new, engine #474 updated), the 6/4 percent results per
writer, the cross-repo check with both directions shown, the merge order and pin choice, the predicted
verdicts, the three-question gate answers, and `leave_behind`.
