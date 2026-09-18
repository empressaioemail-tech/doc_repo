## Mission - G-160: a deploy is not done until the console and the API serve the same commit

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `plan-review` and `smart-files`. You read
`smartcity-dashboards` at a named ref and never write in it: a sibling lane (D-13/D-14) owns files in
that repo while you run. `doc_repo` is planner-owned: hand your doc edits back as a diff, uncommitted.

### The defect this row exists for, and the falsifier you must reproduce

On 2026-09-17 `plan-review` was served by two independent deploy paths with nothing comparing them:
the API by Cloud Run, the console by Vercel. The API advanced to the reasoner while the console sat
**fifteen days behind**, so a shipped feature was invisible to every user for **2h27m**, and every API
probe said the deploy was fine. The planner's own verification of G-150 checked only the Cloud Run
side and missed it. That is the recorded violation state, and it is your falsifier: **your check must
FAIL against it.** A check observed only passing has not been observed working.

The same split is likely in `smart-files`, which the dashboards embed through a Vercel origin, and
G-155 deployed Smart Files by Cloud Run canary without its close saying the console moved.

### What is true at source, read 2026-09-18

- `plan-review` `origin/main` `99c156b` and `smart-files` `origin/main` `6d71bf3`. Both carry
  `web/vercel.json`, which is the console side. Both have a Cloud Run service in `us-east1` as the API
  side (`plan-review`, `smart-files`; per each repo's README).
- **Neither product reports the commit it serves.** Both expose only `GET /` (and `/healthz`):
  `plan-review` `src/server.mjs:262`, `smart-files` `src/server.mjs:78`. Both READMEs record that GFE
  intercepts the exact path `/healthz` on `*.run.app`, so **a probe must use `GET /` or a path that is
  not exactly `/healthz`.** Do not build the check on a path the edge eats.
- The dashboards constant the row calls `DEFAULT_SMART_FILES_ORIGIN` is actually
  `DEFAULT_SMART_FILES_EMBED_ORIGIN` (`smartcity-dashboards` `src/mounts.mjs:8`, value
  `https://smart-files-app.vercel.app`). Small, but the row's name will not resolve if you grep for it.
- `smart-files` README names the console as `https://smart-files-app.vercel.app`, Vercel project
  `smart-files-app`, and explicitly not `property-explorer` and not `cmdcenter`. Embedding is
  `?embed=1&cityKey=...` (`src/mounts.test.mjs`).

### What to build

One check, one script, that for each product reads the commit each side ACTUALLY SERVES and FAILS when
they disagree. Three rules decide whether it is real:

1. **Read the authoritative record per side, never a proxy.** On Cloud Run the revision's image
   DIGEST, not the tag that was requested. On Vercel the deployment's git commit SHA, not the deploy
   message and not the domain. Where you must add a served-commit surface to a product so the check
   can read it, that surface is part of the deliverable and must report a value it actually resolved,
   never a defaulted or empty string.
2. **Fail closed.** An unreadable side, a timeout, or a missing field is a FAILURE, not a pass. A check
   that cannot run and silently passes is exactly the defect class this row was carded from.
3. **Answer the three-question gate the row states**, in writing, in your close: what executes it (a
   script run at the end of every deploy of either side); what triggers it (any Cloud Run or Vercel
   deploy of `plan-review` or `smart-files`, AND a schedule, because a deploy made without running it
   is its bypass); and what fails (a non-zero exit that blocks calling the deploy done). If any answer
   is "a human remembers", say so rather than shipping it.

### Acceptance, verbatim from the row

> The check FAILS when the console serves an older commit than the API, proven by violation against the
> recorded 2026-09-17 state, and passes when they agree; it runs for both `plan-review` and
> `smart-files`; its first scheduled run records whether Smart Files is split today

The last clause is a real measurement, not a formality. **Record whether Smart Files is split today**,
as an observable fact with a timestamp. If it is split, that is a finding about the product now
serving a customer, not a footnote.

### Boundaries

- Write only in `plan-review` and `smart-files`. Read `smartcity-dashboards` at `96fdafbb`; write
  nothing there. One PR per repo, branched from that repo's current `origin/main` with the SHA
  declared.
- You do not deploy, merge, or publish. The integration seat does that. Your check is proven by
  violation in a harness, and its first real run is recorded, not claimed.
- Declare your snapshot in the check's own output: repository, ref, and the moment it was read. An
  audit run against a stale tree returns confident wrong answers.

### Evidence your close must carry

- The check's path in each repo, and its output for a passing case and a failing case.
- The **planted violation** you used to prove it can fail, named, plus the recorded 2026-09-17 shape if
  you can reconstruct it.
- The three-question answers, and where the scheduled run lives (or a statement that it does not yet,
  which makes it dormant and must be said out loud).
- The Smart Files split measurement, with a timestamp.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.

---

## PARCEL 2 — ARM IT. Parcel 1 built the check and stopped; the planner verified it, and it is not done.

**Read this before touching either branch. Do not restart Parcel 1.**

Parcel 1 was performed, and its session stopped on the verdict that the work was already done. That
verdict is wrong, and the planner re-read both branches at source on 2026-09-18T19:35Z to establish
why. Everything below is measured, not reported.

### What Parcel 1 already built, verified by the planner. Do NOT redo any of it.

- `plan-review` branch `g160-served-commit-parity` @ `b4b44b9`, based on `origin/main` `99c156b`.
  7 files, 959 insertions. `node web/api/served-commit-parity.test.mjs` gives **31/31 pass**.
- `smart-files` branch `g160-served-commit-parity` @ `a238072`, based on `origin/main` `6d71bf3`.
  8 files, 1156 insertions. `node src/served-commit-parity.test.mjs` gives **36/36 pass**.
- Both suites carry the falsifier and it fires in both directions: *"the check FAILS against the
  recorded 2026-09-17 state"* and *"...and PASSES once the console catches up: the same check, both
  directions"*.
- `src/served-commit.mjs` refuses rather than substituting a stand-in, and its comment states why.
  That property is correct and is what makes this parcel possible. Keep it.
- The Smart Files split measurement exists as `scripts/fixtures/g160-measured-2026-09-18.json` and
  answers honestly: NOT split, and UNMEASURED by record.

**CONTINUE these branches.** Do not re-derive the check, do not re-cut the fixtures, do not restart
from `origin/main`.

### Why it is not done: three gaps, each measured

1. **Nothing triggers it.** No workflow in either repo references the parity check; it is a manual
   `npm run parity`. The row's own three-question gate required a trigger on every deploy of either
   side AND a schedule. Today the bypass the row itself names, "a deploy made without running it", is
   the only path that exists.
2. **No product records the commit it serves.** `SERVED_COMMIT` is read and never set by any deploy
   path. The planner ran the check live and it REFUSED (exit 2): *"revision plan-review-00029-gom
   records no commit"*. So the control is not merely untriggered, it is starved: correct logic, input
   never supplied.
3. **Not merged.** Neither commit is on `origin/main`. `smart-files` has no `.github/workflows` at
   all, so its parity test runs in no workflow; `plan-review`'s CI does collect the test, but its own
   workflow comment records that branch protection is absent, so a red result blocks nothing.

### What to build, in this order, because the order is the point

**Step 1. Make the deploy record its commit (`SERVED_COMMIT`).** Both products, both sides. The value
must be the commit the build actually came from, resolved at build time against the built tree, never
a tag, never a branch name, never a default, never an empty string. When it is absent the surface
keeps answering 503, which is correct behaviour and must stay.

**Step 2. Wire the trigger.** Both products. Name what executes it, what triggers it and what fails.
A schedule is required rather than optional, because a deploy that skips the check is the bypass this
row names.

**Step 3. Prove BOTH directions after the change.** With `SERVED_COMMIT` set and the two sides
agreeing, the check must PASS. Against the recorded 2026-09-17 state it must still FAIL. With
`SERVED_COMMIT` absent it must still REFUSE.

**The ordering constraint, and it is the one thing that can go wrong in this parcel: Steps 1 and 2
land in ONE change.** Arming a check that must refuse, before the deploy records a commit, fails every
deploy of both products. A control that blocks all deploys is not a stricter control. It is a control
that teaches the fleet to reach for the bypass flag, and ENFORCEMENT.md names an over-broad control as
a worse defect than a narrow one.

### What you cannot do, and must say rather than imply

You do not deploy, merge or publish; the integration seat does. So the first real green run cannot
happen inside your lane. Prove everything provable in a harness, name precisely which clause still
needs a deploy, and record the live refusal you observe rather than a claim that it would pass.

### Acceptance for Parcel 2

- Both branches carry a deploy path that sets `SERVED_COMMIT` from the real built commit, and the
  close says where a deploy gets that value.
- Both products have a trigger: named, with what executes it, what triggers it and what fails, and
  the schedule's home given as a path or a job name rather than described.
- One harness run per product showing all three outcomes observed and pasted: PASS with agreement,
  FAIL on the recorded state, REFUSE with `SERVED_COMMIT` absent.
- A live run recorded with its timestamp, refusal included, so the deployed state is a fact and not
  an assumption.
- The three-question gate answered in writing, with any "a human remembers" answer said out loud.

### Boundaries, unchanged from Parcel 1

Write only in `plan-review` and `smart-files`; read `smartcity-dashboards` at a named ref and write
nothing there. One PR per repo, branched from that repo's current `origin/main` with the SHA
declared. `doc_repo` is planner-owned: hand doc edits back uncommitted, and the planner commits them.
You launch no sub-agents (FAN-DEPTH 0).
