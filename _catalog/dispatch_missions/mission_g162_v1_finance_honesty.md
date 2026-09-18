## Mission - G-162: three defects in the production finance code that G-159 found and deliberately did not touch

You launch no sub-agents (FAN-DEPTH 0). You work in `smartcity-os` on your own branch, landing as a
PR. No `doc_repo` edits are required.

### Why this row is runnable now, and why it was not before

Its named blocker is `D-14` in OPS-25, which has LANDED: `walrus-app` builds from `main`. The row's own
reasoning is the constraint you must respect:

> Until `walrus-app` builds from `main`, nothing merged here reaches production, and landing it first
> would make D-14's repoint change behaviour when it must change none

That condition is now satisfied, which is the whole reason this lane compiles today.

### The three defects

G-159 found all three in the production finance code and deliberately did not touch them, because
fixing figures was not that row's job.

1. **The production budget filter drops the wrong set.** It drops Test, SANDBOX, training, Proof and
   UAT budgets but NOT DNU, so "FY2027 Operating Budget (DNU)" and "(DNU2)" count among the 6 of 12
   production budgets. The rule is SHARED with the session route's cache warm-up, so a fix that touches
   only one of the two call paths leaves the two disagreeing.
2. **`server/routes/finance.ts` clamps a difference with `Math.max(0, ...)`.** That turns an impossible
   state into a clean zero, which is the exact defect class `ENFORCEMENT.md` names: a fabricated zero
   enters averages and ratios without announcing that it was invented, while an absence would have
   forced a decision. Publish the SIGNED difference and name the conflict.
3. **The same file defaults a missing tenant id to 1.** A defaulted tenant is a binding that was never
   resolved. It must refuse instead.

### Explicitly NOT in scope

- **Which MyGov fee report window is authoritative.** `mygov_fees` holds 290,077 rows across 1,491
  FY2026 permits, 174,092,822 charged against 261,793,717 collected, a 150 percent collection rate,
  because a fee listed in several report windows is summed once per window. Choosing the window is a
  finance-owner decision, not a code one, and it is OWED BY THE OPERATOR. Do not pick one. Do not
  "fix" the rate by dividing. Report that it remains open.
- **Do NOT "tidy" `getBnpApiKey()`.** It reads `OPENGOV_API_KEY` first, and that is the only reason BNP
  answers at all. A well-meaning rename or reorder silently breaks the source this row exists to make
  honest.

### The proving rule that governs how you verify

These change figures on `smartcityos.io`, so under rule 4 of the proving-pack decision **each change is
a bridge proven on a NON-PRODUCTION DigitalOcean app before `walrus-app` carries it.** Proving a fix on
`walrus-app` directly is not the check this row asked for. Name the non-production app you used in your
close.

### Acceptance, verbatim from the row

> The two DNU budgets leave the production count, measured on a live BNP read; the clamp is gone and a
> negative difference renders as a named conflict, proven by violation; a missing tenant refuses; each
> proven on a non-production DigitalOcean app before `walrus-app`

Note what each clause demands. "Measured on a live BNP read" means the budget count comes off a real
read, not a fixture. "Proven by violation" means you produce a case that WOULD have been silently
zeroed and show it naming the conflict instead. "A missing tenant refuses" is fail-closed, so a refusal
is the passing result, not a 200 with a fallback.

### Boundaries

- `smartcity-os` only. Do not touch `smartcity-dashboards`; the Fleet and Police lens lane (G-153) is
  writing there concurrently.
- Do not change the DNU classification's MEANING to make a count come out; if the rule is wrong, report
  it rather than quietly widening it.
- Do not deploy to `walrus-app`. Prove on a non-production app and leave the promotion to the planner.

### Evidence your close must carry

- Each defect: the file and line, the before and after, and the live read or violation that proves it.
- The non-production app you proved each change on, named, with the read that distinguishes it from
  `walrus-app`.
- The two DNU budgets, named, shown leaving the production count.
- An explicit statement that the MyGov fee-window question is still open and still owed by the
  operator, and that `getBnpApiKey()` was not touched.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close,
  never written to memory directly.
