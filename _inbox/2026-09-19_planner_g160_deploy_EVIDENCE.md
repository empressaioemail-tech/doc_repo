# G-160 deploy evidence: both products now serve the same commit

snapshot: `doc_repo` main at `1f7ceddd` (pre-commit); deployed tips `plan-review` `4d3da57999c2208a48f32c22fa82a2c55cd7df4e` (origin/main, PR #19) and `smart-files` `5073f7ff6468dcf10ef23ee7defdcb2e0ca2d202` (origin/main, PR #18).
read at: 2026-09-19T12:23Z to 2026-09-19T12:30Z
by: planner seat, `P:/doc_repo`

This file is the raw record of the deploy that closed G-160, and of the defect found by executing it.

## The before state: both products were serving a revision that recorded no commit

Read by field from `status.traffic`, with the serving revision's label and env read separately.

```
plan-review   serving plan-review-00029-gom  label commit-sha = null  env SERVED_COMMIT = null
smart-files   serving smart-files-00015-lod  label commit-sha = null  env SERVED_COMMIT = null
```

This is the starvation G-160 was carded for. Running the row's own instrument against it is what produced the REFUSED exit 2 the row records.

## The defect: `scripts/deploy.mjs` cannot spawn its own tools on Windows

`issue()` calls `execFileSync(argv[0], argv.slice(1), { cwd: REPO, stdio: "inherit" })` where `argv[0]` is `gcloud` or `vercel`. Measured directly:

```
execFileSync("gcloud", ["--version"])                    -> FAIL code=ENOENT
execFileSync("gcloud.cmd", ["--version"])                -> FAIL code=EINVAL
execFileSync("gcloud", ["--version"], {shell:true})      -> OK  Google Cloud SDK 567.0.0
execFileSync("vercel", ["--version"], {shell:true})      -> OK  54.20.1
```

The report reads `FAILED (exit ?)` because `err.status` is `null` on a spawn error, so the failure concealed its own cause. `served-commit-parity.mjs` is unaffected because it invokes through a bounded shell string. That asymmetry is how the row could pass self-tests and CI while the deploy half had never executed on this machine. Carded as G-169.

## The deploy as executed

Run from clean detached worktrees at each repo's merged tip, asserted clean before the run:

```
P:/plan-review-worktrees/planner-g160-deploy   HEAD 4d3da57  dirty 0
P:/smart-files-worktrees/planner-g160-deploy   HEAD 5073f7f  dirty 0
```

The script's own three steps, in the script's own order and argv, with `--no-traffic` first so the revision carrying the record exists and nothing is shifted:

```
gcloud run deploy plan-review  --project plan-review-505715 --region us-east1 --source . \
  --update-env-vars SERVED_COMMIT=4d3da579... --update-labels commit-sha=4d3da579... --no-traffic --quiet
  -> revision [plan-review-00018-tfv] deployed and serving 0 percent of traffic

gcloud run deploy smart-files   --project smart-files-505619 --region us-east1 --source . \
  --update-env-vars SERVED_COMMIT=5073f7ff... --update-labels commit-sha=5073f7ff... --no-traffic --quiet
  -> revision [smart-files-00013-7pm] deployed and serving 0 percent of traffic
```

Both revisions read `Ready = True` and `ContainerReady = True` before any traffic moved.

The P-170 traffic lease was then taken for each service naming the revision (`_catalog/leases/plan-review.json` -> `plan-review-00018-tfv`, `_catalog/leases/smart-files.json` -> `smart-files-00013-7pm`), the shift issued, and the lease released after the serving revision had been read by field and the probe had run. `_catalog/leases/` now holds only `README.md`.

Note on honesty: the lease gate intercepts the agent's own shell calls, not the child processes of a scripted run. The lease was taken anyway. A control that cannot see you is not a control you are excused from.

Console side, from the same tree in each case:

```
vercel deploy <worktree>/web --prod --yes --project plan-review-app --env SERVED_COMMIT=4d3da579...
vercel deploy <worktree>/web --prod --yes --project smart-files-app  --env SERVED_COMMIT=5073f7ff...
```

`--update-env-vars` was used throughout, never `--set-env-vars`, because the script's header records that the replace form would delete the plain vars and take the Smart Files mount down.

## The after state: the gate exits 0 for both

```
served-commit parity -- plan-review
  API      serving rev plan-review-00018-tfv
           commit 4d3da57999c2208a48f32c22fa82a2c55cd7df4e  [SERVED_COMMIT]
  console  plan-review-app
           commit 4d3da57999c2208a48f32c22fa82a2c55cd7df4e  [SERVED_COMMIT]
  VERDICT  AGREE -- both sides serve 4d3da57999c2208a48f32c22fa82a2c55cd7df4e
exit 0

served-commit parity -- smart-files
  API      serving rev smart-files-00013-7pm
           commit 5073f7ff6468dcf10ef23ee7defdcb2e0ca2d202  [SERVED_COMMIT]
  console  smart-files-app
           commit 5073f7ff6468dcf10ef23ee7defdcb2e0ca2d202  [SERVED_COMMIT]
  VERDICT  AGREE -- both sides serve 5073f7ff6468dcf10ef23ee7defdcb2e0ca2d202
exit 0
```

The live API surface, read independently of the gate:

```
GET https://plan-review-ozx33wafia-ue.a.run.app/version   200
{"ok":true,"service":"plan-review","commit":"4d3da57999c2208a48f32c22fa82a2c55cd7df4e",
 "revision":"plan-review-00018-tfv","resolvedFrom":"SERVED_COMMIT"}
```

The gate's ability to fail, re-proven on this run rather than assumed:

```
node scripts/served-commit-parity.mjs --self-test
  pass  unreadable API -> REFUSED/2
  pass  unreadable console -> REFUSED/2
  pass  a null commit never agrees with another null commit
  pass  the recorded 2026-09-17 shape has the console FIFTEEN DAYS behind at the API advance
  pass  the check FAILS against the recorded 2026-09-17 state
  pass  ...and passes once the console catches up
all self-tests pass (both directions, fail-closed, non-vacuous)
```

## Two traps recorded

**Cloud Run revision numbers here are not monotonic.** `plan-review-00018-tfv` was created 2026-09-19 while `plan-review-00029-gom` already existed, and `smart-files-00013-7pm` is newer than `smart-files-00015-lod`. Anyone reading "the highest number is newest" picks the wrong revision. Read by creation timestamp, or by the traffic field.

**The deploy is not yet exercised end to end by its own file.** Until G-169 is fixed, the next deploy again passes by hand or not at all. Both product repos carry the defect.

## leave-behind

- item: `scripts/deploy.mjs` cannot spawn `gcloud`/`vercel` on Windows, so the deploy path is un-exercisable by its own file
  owner: the owning seat of each product repo (`plan-review`, `smart-files`)
  plan_row: G-169
- item: two detached deploy worktrees left on disk, `P:/plan-review-worktrees/planner-g160-deploy` and `P:/smart-files-worktrees/planner-g160-deploy`
  owner: planner seat
  plan_row: G-160
