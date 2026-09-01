# Mission — land the two rescued engine branches; one is green, one is red

## State, read live 2026-09-01 at roughly 14:05Z

```
#373  feat/a3-f1-chunked   MERGEABLE  checks=SUCCESS   "rescue chunked F1 setback runner off P:/tmp"
#372  feat/a4-p3-absence   MERGEABLE  typecheck + test = FAILURE
      https://github.com/empressaioemail-tech/hauska-engine/actions/runs/33514378339/job/99877583491
```

Both were rescued from `P:/tmp` where they existed only as dirty files. They are safe now;
this card lands them.

## `#373` first, and it is nearly free

Green against a base that already absorbed `#370` and `#371`. Confirm the conclusion
**string** against the current base, then merge.

One thing to carry rather than lose: the rescue recommended **the A3 runner stays on
engine and is not ported to factory**, because F1 is already scored. Merging `#373` makes
that placement real. If you disagree with it, say so in the close rather than acting on it
here.

## `#372` is red and the fix is the work

`typecheck + test` fails. Read the run before changing anything — it is one job covering
two different failure modes and they want different fixes.

**Establish which it is before touching code.** A type error in the rescued
`rail-absence.ts` is a real defect in the P3 build. A test failure may instead be the same
Postgres `53200 out of shared memory in dropTestSchema` infrastructure flake that blocked
LDT `#576` earlier today, which needed a retry and not a fix. **They look identical in a
red check and are not the same thing.**

If it is the flake: one retry, and if it fails a second time it is not a flake. If it is a
real failure: fix it, and say what the defect was.

## What `#372` actually carries, so you do not weaken it to get green

The P3 absence build. Its whole point is that `not-applicable`, `absent-verified` and
`unmeasured` are three different states that must not collapse, with the type carrying the
constraint so no consumer can lose it.

**Do not relax a type or delete an assertion to turn the check green.** If the type is
what fails, the type is probably right and the caller is wrong. A build whose entire
purpose is a non-collapsible distinction must not be made to pass by collapsing it.

## The number this build must not hardcode

The roadmap's `357,269` unincorporated is **wrong**. CTX-TOTALS measured **370,289** across
the six counties, with in-city 611,116 and total 981,405 reconciling exactly. The totals
agree within 5 while the split differs by about 13,020, so roughly 13,020 parcels were
classified in-city that are unincorporated.

P3 stamps `not-applicable` on the unincorporated population, so the roadmap figure would
leave about 13,020 genuinely unincorporated parcels unstamped. **If `#372` carries 357,269
anywhere as a constant or a fixture, that is a defect to fix on this card.** The per-county
table is in `_inbox/2026-09-01_ctx-totals_table.json`.

This card does not apply P3. It lands the build.

## Do not

- Do not apply, stamp, or write absence rows anywhere.
- Do not weaken a type or delete an assertion to get green.
- Do not retry a failing test more than once.
- Do not port the A3 runner to factory.
- Do not merge `#372` red, and do not merge `#373` on a stale base.
- Do not judge CI by a `gh` exit code; read the conclusion string.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report both merge SHAs or say why one did not merge, whether `#372`
was a real defect or the shared-memory flake and how you established which, and whether
357,269 appeared anywhere in the build. Name what contradicted this card, or say plainly
that nothing did. `leave_behind` named. Subagents do not commit.
