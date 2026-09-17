## Mission — P-325 and P-310: a join miss is not a verified absence, and Williamson's join gets decided

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open ONE PR. **You run no
apply.** P-310's output is a decision with counts; P-325's output is a shipped fail-closed fix.

### PRECONDITION — read the P-319 lane's keyspace work first

The P-319/P-320/P-321 lane (PR factory **#173**, open) is building keyspace classification and a
shared blast-radius threshold in this same repo. **Read its branch before you write any keyspace
logic.** Two keyspace rules in one repo is the defect, and a threshold copied into a second place
survives the removal of the first. Name #173's head SHA in your CP1 and say what you reused.

### The two halves, and why P-325 ships first

**P-325 is the general defect and it is separable.** `src/jobs/parcel-record-fill.mjs` writes CAD
`absent-verified` when its join finds nothing. Measured on Williamson: P-266's dry run would write
`absent-verified` on **all 282,569 parcels**.

`absent-verified` is a claim that something LOOKED and found nothing. Writing it because a join
missed is a lie that passes every downstream check, and it is the exact prohibition in
ENFORCEMENT.md: never convert `unaccounted` to `absent-verified` to clear a gate. **This is not a
Williamson bug.** Any county whose served keys and roll keys diverge produces it, and **Burnet is
next through the farm with an unchecked keyspace.**

So P-325 ships ahead of and independently of the join decision: an unresolved key leaves the cell
`unaccounted` and the run records the unresolved population by county and rail. After P-325, D1
stops being dangerous — the Williamson dry run would report 282,569 unaccounted instead of
threatening 282,569 false absences — and P-310 becomes an unhurried decision rather than a held
apply.

**P-310 is the join decision.** P-306 established that the bake reaches Williamson's numeric nodes
through **situs-address recovery**, a path this writer does not have. The county's roll is R-keyed;
its served nodes are numeric. This is the same keyspace split that let the 2026-09-17 publish retire
all 602,050 of Williamson's served rows.

### What to establish for P-310

1. **The writer's Williamson join, from code AND rows**: which key it joins on, which population it
   writes, and what the store holds today. Not one or the other — a code read tells you the intent
   and a row read tells you the outcome, and this row exists because they disagree.
2. **The apply's value-to-absent movement counted per rail.** How many cells currently hold a real
   CAD value that the apply would replace with an absence. That number is the whole risk and it must
   be per rail, not a total.
3. **A recommendation among three**, with its reason:
   - **(a) give the writer the same situs-address recovery the bake has.** If you recommend this,
     measure the recovery's error rate first. The bake tolerates it; the ledger is canonical and may
     not. A recommendation that does not name the error rate is not decidable.
   - **(b) a crosswalk** — a persisted R-account to numeric-prop_id map. Check whether Hays already
     resolves account through a crosswalk; if that precedent exists, say what it cost and whether it
     generalises. Verify it at source rather than taking this mission's word for it.
   - **(c) the apply as measured.** **This lane should expect to reject (c) and must say why if it
     does not.** Writing 282,569 absences where a join missed is the P-325 defect at scale.

**No apply.** The decision goes to the operator with the counts behind it.

### Verify by violation

**P-325**, both directions, on fixtures:
- A Williamson-shaped fixture — numeric served keys against an R-keyed roll — must produce 282,569
  unaccounted and **zero** `absent-verified` under the fix, and must produce 282,569
  `absent-verified` under the current writer. Show both runs.
- A fixture where the join RESOLVES and CAD genuinely holds no value must still write
  `absent-verified`. A fix that makes every absence unaccounted has destroyed the rail's ability to
  report a real absence, and that is a worse defect than the one you are fixing.
- Enumerate the call sites before you claim the defect is closed. A default copied into its callers
  survives its own removal.

**P-310**: pre-register what result would prove your join reading wrong, and state it before you
measure. If your row read and your code read agree too neatly, interrogate the instrument.

### The three-question gate

For P-325's refusal, answer in your close: what executes it, what triggers it, what fails when it is
violated, and what bypasses it. Name the bypasses honestly — a raw SQL write into the cell table is
one, and so is any other writer that touches the same rails.

### Constraints

- **No apply, no deploy, no merge, no store writes** beyond nothing at all: fixtures only for the
  fix; read-only and under a heavy-scan lease for the measurement.
- **Do not touch county 48491 in any store.** It was restored from a point-in-time branch on
  2026-09-17. Reading it is fine.
- Branch from current `origin/main` (it carries #171 and #172) and declare the SHA. The working
  clone at `P:/hauska-factory` sat at "Initial commit", 287 commits behind, on 2026-09-17 — clone
  fresh into a NEW `P:/tmp/` directory.

### Close

Declare: #173's head SHA and what you reused from it, P-325's both-direction fixture results and its
call-site enumeration, the three-question gate answers, P-310's join reading from code and rows, the
per-rail value-to-absent counts, your recommendation among (a) (b) (c) with its reason, and
`leave_behind`.
