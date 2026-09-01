# Mission A1 — finish containment; produce TOTALS for the first time

## Why this card exists

Two counties of six are clean. Bastrop is licensed by run `85f984c2` on digest
`sha256:dd7c2a94`, and Hays completed in 14m16s over fifteen chunks with
`statement_timeout` unraised. **TOTALS has never existed.** This card produces it.

The instrument works. The 180s interactive ceiling was the instrument and not the
work, and chunking removed it. County size no longer determines completion; chunk
count does. So this is execution discipline, not a cost investigation.

## State per county, do not re-derive

| County | State |
|---|---|
| Bastrop 48021 | **licensed**, `85f984c2`, 50,264 / 11,992 / 62,256 |
| Hays 48209 | succeeded, `bdcf534f`, 116,420 rows |
| Caldwell 48055 | matched 14,361 / 10,627 / 24,988, run **hand-cancelled**; licensing ambiguous |
| McLennan 48309 | **bare count 114,254** on old digest `56a8ee75`, no restated triple, no sentinel disposition |
| Travis 48453 | `COUNTY_HELD`, 380,918 parcels |
| Williamson 48491 | `COUNTY_HELD`, 282,570 parcels |

## Order, and the discipline that makes each run trustworthy

**1. Resolve Caldwell.** Its numbers matched but the run was hand-cancelled because
the pre-#49 success path hung, and a planner termination was written over it. Decide
and state which: re-run it cleanly on a current digest so it holds a real succeeded
run, or record explicitly that its rows are licensed by an operator decision rather
than by a succeeded run. **Do not leave it ambiguous.** A hand-cancelled run is not a
write license.

**2. McLennan, properly.** The 114,254 is a count, not a verified triple, and no
sentinel was measured. Re-run on a current digest with the full discipline below.

**3. Williamson, then Travis.** Largest last.

**For every county, before you execute:**

- **Measure that county's sentinel.** Do not extrapolate. Bastrop's 168 rows resolved
  to one **unincorporated** key; Caldwell's 227 resolved to one **in-city** key
  (Mustang Ridge 50200), which is why its restated triple moved `in_city` and not
  `unincorporated`. Assuming a shape produces a refuse for the wrong reason and burns
  an execute.
- **State the restated triple** in your output before running. If a county carries no
  sentinel, say so as a measurement, not as an assumption.
- **State both falsifiers.** F1 is the triple, and anything else refuses
  `PARTITION_MISMATCH` and stops. F2 is a succeeded termination with an **unaided
  exit**.

**Verify the image by digest before each run.** Not the tag, not the generation, not
"main is at X". Factory builds ship storage tarballs with **no `COMMIT_SHA`**, so
image-to-commit attribution there is inference; `sha256:56a8ee75` was wrongly called
the #49 image off a build starting 16 seconds after the merge. Report the digest you
ran on.

## TOTALS

Only when all six counties have emitted from this job does TOTALS become measured.
Sum over the six, state the arithmetic, and name the run id that licenses each
county's rows. **Do not adopt 357,269 or any figure not produced by this job**; that
baseline was discarded as unrecoverable.

Cite the **store**, not a lane close. Two lanes ran Bastrop four minutes apart and the
bind moved from `1dda40f7` to `85f984c2`. A close is a claim about a moment; a bind is
a fact with a timestamp. Prove each county's bind with `GROUP BY run_id`.

## Do not

- Do not raise `statement_timeout` or change page size from 8,000.
- Do not soften `PARTITION_MISMATCH` or absorb a sentinel to make a number match.
- Do not hand-cancel a hang and write a success over it. Report the hang.
- Do not run two heavy store operations at once. **Confirm whether `neondb` and
  `hauska_mcp` share compute before assuming they do not contend** — that has not been
  measured, and lane A3 may be running.
- Do not fit a curve to per-chunk `wallMs`. Hays ranged 36.4 to 92.9 and licenses no
  size.
- Do not start the setback bake; it is gated by `PLACEHOLDER_COLLISION`, not by
  containment.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot including image digest in the first output. State both falsifiers per county
before executing. Report the licensing run id per county. `leave_behind` named.
Subagents do not commit.
