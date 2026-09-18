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
