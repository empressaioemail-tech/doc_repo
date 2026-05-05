---
id: replit_deploy
title: Replit deploy runbook — legacy-design-tools
status: active
last_updated: 2026-05-05
applies_to: design-accelerator
related: [10_ground_truth, 20_agent_operating_rules, 2026-05-05_track_b_deploy_saga, 15_replit_neon_ownership_advisory]
---

# Replit Deploy Runbook — `prompt-agent-accelerator`

> **Operational runbook.** Use this as the contract every time you ship
> a deploy. Edits land in place as the deploy mechanism evolves —
> commit message should explain what's changing and why. Supersession
> on Cloud Run migration: when `legacy-design-tools` moves off Replit,
> this doc moves to `status: superseded` and a Cloud Run runbook takes
> its place.

**Status:** Wave 0, P0-7. Operational. Until we migrate to GCP Cloud Run + GitHub Actions per the deploy-migration sprint.

**Scope:** `legacy-design-tools` monorepo deploy to `prompt-agent-accelerator.replit.app` (Cloud Run autoscale, fronted by Replit).

**Audience:** Nick + any agent assisting with a deploy.

---

## TL;DR — every deploy follows these steps

1. Push to `origin/main` via PR or direct commit.
2. **Sync Replit local main to origin/main BEFORE clicking Redeploy.** This is non-optional — Replit's local main drifts from origin/main and Replit deploys from local.
3. Click Redeploy in the Replit dashboard.
4. Watch the build log for the build steps.
5. After "Deployment successful," wait 60 seconds for Cloud Run traffic shift.
6. Curl-probe a route that proves the new code is serving.
7. If 404 / unexpected, do not click Redeploy again — diagnose using the diagnostic tree below.

---

## Step 2 in detail — sync Replit local main to origin/main

This is the most-missed step. Replit's local `main` branch drifts from `origin/main` because Replit auto-creates "Published your App" checkpoint commits whenever you click Publish/Deploy. These are not pushed to GitHub. Over time, local main accumulates orphan checkpoints that diverge from origin's history.

When you click Redeploy in the Replit dashboard, **Replit deploys from local main**, not from origin/main. So if local main is behind origin/main, the deploy ships old code.

To sync, in the Replit shell:

```bash
cd ~/workspace
git fetch origin --prune
git reset --hard origin/main
git log --oneline -3   # confirm top SHA matches origin/main on GitHub
```

If `git log origin/main..main --stat` shows real code changes (not just "Published your App" auto-commits), STOP — those changes haven't been pushed to GitHub and would be lost. Cherry-pick them onto origin/main first via PR, then sync.

In practice, "Published your App" commits are always safe to discard. They're snapshots, not work.

This step is codified as HR-10 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md).

---

## Step 4 in detail — what a healthy build log looks like

After `[deployment.build]` runs (added 2026-05-05 in commit `b1d7cf4`), the build log MUST contain these lines:

```
> @workspace/api-server@0.0.0 build /home/runner/workspace/artifacts/api-server
> node ./build.mjs

  dist/index.mjs                      17.7mb ⚠️
```

If `dist/index.mjs` is NOT regenerated in the build log, the api-server bundle is stale and the deployed prod will serve a cached `dist/index.mjs` from a prior deploy.

The other artifacts (`design-tools`, `plan-review`, `qa`, `mockup-sandbox`) ALSO build via `vite build`. If any of them fails, the recursive build aborts — and the deploy may still mark "successful" while serving the prior bundle.

If the build log shows artifact build failures, fix the artifact (don't narrow build scope in `.replit`). The 2026-05-05 fix to all four `vite.config.ts` files made `PORT` only required at serve/preview time, not build time, with sensible `BASE_PATH` fallbacks. Apply this pattern to any new artifact added to the workspace.

---

## Step 6 in detail — curl probes that prove the new code is serving

After every meaningful deploy, run at least one route-reachability probe matching the change. For Track B:

```
curl -i https://prompt-agent-accelerator.replit.app/api/snapshots/00000000-0000-0000-0000-000000000000/ifc
```

**Healthy responses (route is registered):**
- `401 Unauthorized` with JSON body `{"error":"unauthorized"}` — secret check fired
- `404 Not Found` with JSON body `{"error":"Snapshot not found"}` — snapshot lookup fired
- `415 Unsupported Media Type` with JSON body — content-type guard fired
- Anything else with `Content-Type: application/json`

**Unhealthy response (route is NOT registered):**
- `404 Not Found` with `Content-Type: text/html` and body `Cannot GET /api/snapshots/...` — Express's default `finalhandler` 404. No route handler matched the path.

**Always probe within 5 minutes of "Deployment successful"** — Cloud Run's traffic shift is fast but not instant. If you probe within ~60s and get the wrong answer, wait and re-probe before assuming a real failure.

The same-turn curl-probe discipline is codified as HR-3 and PC-4 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md).

---

## Diagnostic tree — when curl returns "Cannot GET" after deploy

Walk these in order. Stop when one diagnoses the issue.

### Check 1 — is the deploy actually building from origin/main?

In Replit shell:

```bash
cd ~/workspace
git log --oneline -3
git log --oneline origin/main -3
```

If local main is behind origin/main, that's the bug. Sync (Step 2) and redeploy.

### Check 2 — did the api-server bundle actually rebuild?

In the Replit deploy build log (NOT runtime log), search for:

```
@workspace/api-server@0.0.0 build
node ./build.mjs
dist/index.mjs                      17.7mb
```

If those lines are absent, the build step was skipped. Check `.replit` for `[deployment.build]` block. If missing, that's the bug. (Should be present from `b1d7cf4` onward.)

### Check 3 — does origin/main actually have the route you're testing?

```bash
git show origin/main:artifacts/api-server/src/routes/snapshots.ts | grep -n "router.post"
git show origin/main:artifacts/api-server/src/lib/ifcIngest.ts | head -5
```

If the file or route is absent on origin/main, the work was never merged. Check GitHub PR list directly — `https://github.com/empressaioemail-tech/legacy-design-tools/pulls?q=is:pr` — agent recon on git state is unreliable; the GitHub web UI is ground truth (HR-1 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md)).

### Check 4 — is the deployed bundle the one we built?

Locally rebuild and compare:

```bash
cd artifacts/api-server
node ./build.mjs
grep -c '/snapshots/:id/ifc' dist/index.mjs
grep -c 'ingestSnapshotIfc' dist/index.mjs
```

If counts > 0 locally but the deployed bundle 404s, Replit is serving a cached bundle despite the build running. Bust cache with an empty commit on main:

```bash
git commit --allow-empty -m "chore: bust Replit deploy cache"
git push origin main
```

Then sync local Replit main and redeploy.

### Check 5 — is `[deployment.run]` set correctly?

`.replit` does NOT currently have `[deployment.run]` (as of `b1d7cf4`). Replit's autoscale is auto-detecting the run command from `artifacts/api-server/package.json`'s `start` script: `node --enable-source-maps ./dist/index.mjs`.

If a future deploy bug surfaces around runtime entrypoint ambiguity, add to `.replit`:

```toml
[deployment.run]
args = ["sh", "-c", "cd artifacts/api-server && node --enable-source-maps ./dist/index.mjs"]
```

Note: Replit may block programmatic edits to `.replit` from agent contexts. Edit manually in the Replit file pane if needed.

### Check 6 — is Replit deploying from a different repo entirely?

In Replit shell:

```bash
git remote -v
```

Confirm the `origin` remote points at `https://github.com/empressaioemail-tech/legacy-design-tools`. If a different remote, Replit's been deploying from somewhere else this whole time. Repoint origin and re-sync.

---

## Schema migration coordination

The deployment Neon database (`ep-little-base-amyyxjca`) lives on a different cadence than the api-server bundle. The `lib/db/scripts/track-b-ifc-ingest.sql` style migrations apply via the local `deploy:track-b` script (or its successor) — NOT automatically with deploy.

**Rule:** apply schema migrations BEFORE deploying code that depends on them. Otherwise the route handler will hit DB errors on first request and the deploy will appear broken even though the bundle is correct.

The migration runner has a preflight mode (`--mode preflight`) that confirms the schema is in the expected state before applying. Run preflight first, review what would change, then apply.

Database ownership constraints make this thornier than it should be — see [`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md) for the strategic context and the Empressa Neon migration plan.

---

## Pre-deploy checklist

Copy-paste this before clicking Redeploy:

```
[ ] PR is merged to origin/main
[ ] If a schema migration: applied to deployment Neon, preflight verified
[ ] In Replit shell: git fetch origin --prune && git reset --hard origin/main
[ ] git log --oneline -3 shows origin/main's top commit at HEAD
[ ] About to click Redeploy
```

Post-deploy:

```
[ ] Build log shows pnpm install --frozen-lockfile + recursive build
[ ] Build log shows node ./build.mjs producing dist/index.mjs ~17.7 MB
[ ] No vite build failures on any artifact (mockup-sandbox / qa / plan-review / design-tools)
[ ] "Deployment successful" appears
[ ] Wait 60 seconds for traffic shift
[ ] Curl-probe a route that proves the new code is serving
[ ] If JSON: → continue
[ ] If "Cannot GET": diagnose via tree above, do NOT click Redeploy again blindly
```

---

## When to escalate to Cloud Run migration

If three deploys in a row fail for distinct reasons, that's the signal to stop fighting Replit and accelerate the Cloud Run migration sprint. The 2026-05-05 saga had exactly this pattern (stale bundle → local main detached → build scope too wide). Three distinct failures in 24 hours = the tool's abstractions are working against you, not for you.

This escalation criterion is codified as HR-7 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Full saga context lives in [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](../91_postmortems/2026-05-05_track_b_deploy_saga.md). Migration sprint scope tracks in [`10_ground_truth.md`](../10_ground_truth.md) Outstanding (design-accelerator).

---

## Future improvements pre-Cloud-Run-migration

If we stay on Replit longer than expected, these would harden the deploy:

1. Add `[deployment.run]` explicitly so runtime entrypoint isn't inferred (Check 5 above).
2. Add a `pre-deploy` script that runs `git fetch origin && git reset --hard origin/main` so the sync step can't be forgotten.
3. Add a smoke-test step after deploy that curls a known endpoint and fails the deploy if the response is wrong (Replit may not support deploy-time gates; if not, do this in CI before merge).

None of these are worth doing if Cloud Run migration is < 2 weeks out.

---

## Supersession plan

When `legacy-design-tools` moves to Cloud Run + GitHub Actions:

1. New runbook lands as `90_runbooks/cloud_run_deploy_design_accelerator.md`
2. This doc's `status` flips to `superseded`
3. Frontmatter `superseded_by` field points at the new runbook
4. The diagnostic tree above is preserved as historical reference; the
   pre/post-deploy checklists adapt to the new pipeline (build via
   GitHub Actions, deploy via `gcloud run deploy` from CI, no Replit
   shell required)
5. The Repl stays accessible for IDE work but is removed from the
   production deploy path

Until then, this runbook is the contract.
