# CTX-B2 — a gate that compares two different vintages, and a tracer with a blind spot

Repo: `hauska-factory`. Three items, all small, all named precisely by prior lanes.

## Item 1 — the cadRoll expectation has no vintage scope

CTX-HAYS-GATE measured this at source. `CADROLL_EXPECTATION_SQL` in
`src/lib/publish-cadroll-postcondition.mjs` selects prop_ids whose `cad_property` row carries
a real dollar **in any tax year**, while the bake deliberately reads only the county's
declared vintage (`legacy-design-tools` `vintage.ts:58`). **100 percent** of Hays' 38,197
misses are prop_ids with a 2025-only dollar and zero 2026 row.

Its own sampled rate is also misleading: `ORDER BY prop_id ... LIMIT 500` reports 71.0
percent against a true population rate of 22.1 percent, a 3.2x overstatement, because
ascending prop_id lands on exactly the oldest parcels.

Scope the expectation to the declared vintage. Read that vintage from the bake summary, or
from a mirrored constant **guarded by a divergence test** — a constant copied without a
guard is the drift this repo has already paid for twice.

**The trap the operator ruled on tonight (A2), and it binds you.** Vintage-scoping alone
clears the Hays gate by relabelling 37,813 rows as "left the roll". Those rows were **never
on a CAD roll**, so a retirement claim on them is false and would pass every existing check.
**The scoping ships together with a truthful state for rows that were never on a roll, or it
does not ship.** If that truthful state belongs in `legacy-design-tools` rather than here,
report it precisely enough to dispatch rather than inventing one locally.

Hays stays held either way. This lane does not unhold it.

## Item 2 — the module-graph tracer has a bare-specifier blind spot

CTX-PIN2 built `scripts/bake-module-graph.mjs` and the staleness check on top of it, and both
work. But the review found the tracer follows **relative specifiers only**, so
`@workspace/cad-ingest` is not followed into the graph.

That matters directly: a change to `vintage.ts` — the exact file item 1 depends on — would
**not** trip the staleness check today.

Close it. **Required test: a change to `vintage.ts` must fail the staleness check.** Observe
it failing before it passes.

Note CTX-PIN2 also established that of CTX-LEAVES2's three fixes, only the acreage fix is in
the 26-module graph; the `unmeasured`-to-`refused` fix and the prop_id guard are outside it.
If closing the blind spot changes the graph's membership, **say what moved in and what that
implies for pins already taken** — that is a finding, not a footnote.

## Item 3 — the pin, and its ordering dependency

`cloudbuild.publish.yaml` should end up pinned at CTX-B1's merge SHA.

**Check whether CTX-B1 has merged before you touch the pin.** It is live in
`legacy-design-tools` on `fix/ctx-b1-provenance-honest-cadroll` and carries the customer-facing
provenance fix.

- If B1 has merged: pin to its SHA, confirm LDT main is exactly that before and after, write
  the pin comment in the file's established style.
- If B1 has NOT merged: **do not pin to `9873ff11` as an interim.** The operator's chosen
  sequence is B1 first and one bake pass, because the label change is small and a bake pass
  per county is not. Land items 1 and 2, and report the pin as owed with the SHA it is owed
  to.

Never pin to `main`. Confirm the SHA with `gh api` and paste the literal output.

## Verify by violating

Item 1: a parcel with a dollar only in a non-declared vintage must **not** enter the
expectation set. Show the gate's compared/miss counts before and after on real Hays data.

Item 2: the `vintage.ts` test above, failing then passing.

Item 3: if you pin, the staleness check must pass at the new pin and fail at the old one.

## What you must NOT do

**Do not touch `MAX_MISS_RATE` or any threshold.** That gate caught a real data problem.

Do not write a retirement state for rows never on a roll. That is the A2 trap.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat owns every execution.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

CTX-B3 is live in this repo on a separate worktree building the census instrument, and
CTX-TEARDOWN is read-only here. If your work touches the same files, STOP and report the
collision rather than resolving it.

## Close contract

Standard lane close JSON, plus:

- The declared-vintage source you used and the divergence guard on it.
- Hays' compared and miss counts before and after, with the counting rule.
- Whether the truthful-state half belongs here or in LDT, precisely enough to dispatch.
- What closing the tracer blind spot moved into the graph, and what that implies for pins
  already taken.
- The pin: taken and to which SHA, or owed and to which.
- All violation runs.
- `leave_behind`.
