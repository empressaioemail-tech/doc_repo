## Mission — P-213: the blast-radius refusal, generic, before Burnet

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Why this is urgent right now

P-212 (the SEV-1 mass false retirement of 57,704 Bastrop parcel-nodes) is
fixed and verified live. The code path that PRODUCED it is not.
`reconcileCountyParcelNodes` and `write-parcel-node-county.mjs` in
`hauska-engine`, read at current `origin/main` HEAD 2026-09-16, still compute
`orphans` as an unconditional set-difference and write ALL of them to
`retired` with no share/threshold check, no operator-authorization gate, and
no refusal path — confirmed by reading the write path itself, not by
measuring output. OPS-24 is about to run new counties (Burnet, then Bell and
Milam) through the same re-acquisition/reconcile pipeline. Nothing stops the
identical incident from recurring, and there is no guarantee another lane
stumbles onto it by accident next time the way this one did.

### Where you work

Fresh clone of `empressaioemail-tech/hauska-engine` from `origin/main`, on a
new branch `feat/p213-blast-radius-refusal`. Declare the commit you started
from before you write anything.

**Repo-sequencing note:** `P-238` (dossier footer/deep link) was also
dispatched to this repo today. One repo, one writer — check
`node scripts/lane-claim.mjs status` in the doc_repo worktree you are rooted
in before starting; if P-238 is live, coordinate or wait rather than racing
it, and tell the planner if you had to.

### The rule, verbatim from OPS-16 P-213 (do not narrow it)

**GENERIC BY DESIGN: this is not a retirement control and must not be scoped
to one writer.** It protects every batch state-change path this repo has.
The predicate, and every clause must be able to fail:

1. A batch writer computes the share of the target population it would
   transition to a destructive state BEFORE committing.
2. Above a DECLARED threshold it exits non-zero, writes nothing, and reports
   the share and the population it measured.
3. Proceeding above the threshold requires explicit authorization carried
   into the invocation — never a config default, never a warning nobody
   reads.
4. Proven by violation in BOTH directions: a run above the threshold refuses,
   and a run below it still writes normally.

The threshold is a declared number per writer, recorded with its basis, not a
judgement call made at call time.

### The template already exists in this portfolio — reuse its shape

`hauska-factory/src/lib/publish-coverage-floor.mjs` (shipped 2026-09-15 as
P-236, current `hauska-factory` HEAD `bfb7303`) is a real, working instance
of exactly this control — pre-write, fail-closed, declared threshold, named
override, recorded either way — built for a different population (zoned-node
coverage collapse in the LDT tier1 bake/publish path). Read it. Do not
reinvent the shape; port the pattern. It guards the wrong population today;
yours guards the right one.

### What to build

A generic, reusable blast-radius guard in `hauska-engine` (a shared module,
not copy-pasted per call site), then wire it into
`reconcileCountyParcelNodes` / `write-parcel-node-county.mjs` FIRST, since
that is the writer with the proven live incident and the imminent exposure
(Burnet). Build it so a second batch writer can adopt the same guard without
re-deriving the logic — that is what "generic by design" requires, even
though this dispatch's proof case is the one writer.

Name the bypasses in your close: a raw connection, a direct `UPDATE` outside
the guarded writer, and any other path that reaches the same table without
passing through it. The answer is rarely none — find it and say what it is,
even if you don't fix it.

### Explicitly NOT in scope (do not scope-creep into these)

- Fixing the P-212 comparator itself — that was P-212's own work and is done.
- Making the serve path honour retirement (P-206) — separately blocked,
  separately owned.
- The ten-minute `factory-conformant reap` schedule, which carries a
  destructive verb on a short clock and is UNAUDITED. It is flagged in the
  canon as worth a look, carded to nobody, and NOT assumed to be defective.
  Do not touch it; do not assume it needs the same guard without measuring it
  first — that is a separate row if it turns out to need one.

### Verification (exit-bounded — every command must terminate on its own; no watch, tail, or serve)

Prove clause 4 for real: construct a fixture population where the reconcile
would retire above the declared threshold and confirm the writer exits
non-zero, writes nothing (read the table back and confirm zero rows changed),
and reports the share and population size. Construct a second fixture below
the threshold and confirm it writes normally. Both are real tests, not
descriptions of intended behavior. Run this repo's test suite and typecheck;
confirm both exit 0, paste real output.

### Do not

- Do not narrow this to a "retirement-only" check. Re-read the GENERIC BY
  DESIGN clause above if you find yourself doing that.
- Do not pick the threshold without recording its basis (why this number,
  not a rounder one) in the code or its adjacent doc.
- Do not touch the reap schedule, the P-212 comparator, or P-206.
- Do not deploy or merge. Open the PR green and hand it back.

### Close

Name the threshold you chose and its basis. Show both fixture results
(above-threshold refusal, below-threshold pass) with real output. List every
bypass you found. State whether you coordinated with or waited on P-238 per
the repo-sequencing note. State your snapshot (repo, branch, commit).
