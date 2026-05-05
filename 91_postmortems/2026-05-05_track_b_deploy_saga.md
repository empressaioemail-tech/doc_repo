---
id: 2026-05-05_track_b_deploy_saga
title: Track B Deploy Saga — Postmortem
status: active
last_updated: 2026-05-05
applies_to: design-accelerator
related: [10_ground_truth, 20_agent_operating_rules, replit_deploy, 15_replit_neon_ownership_advisory]
---

# Track B Deploy Saga — Postmortem

> **Frozen postmortem.** The events below describe what happened on
> 2026-05-05. Document edits beyond minor maintenance (typo fixes,
> updating sibling-doc references when files move) are out of scope —
> the historical record is the value here. Forward-action follow-ups
> live in the docs named under [Where the action items landed](#where-the-action-items-landed) at the end of this doc.

**Date:** 2026-05-05
**Duration:** ~12 hours, ~50 turns of Claude.ai planning, 6 agents engaged
**Outcome:** Track B's IFC ingest endpoint shipped to prod (eventually). Track A's Mode 1 + transaction patches shipped. Track C ready to ship next.

**Status:** Lessons captured. Action items below.

---

## What we were trying to do

Ship Track B (server-side IFC ingest endpoint at `POST /api/snapshots/:id/ifc`) so the Track A add-in's Phase D upload could land on prod, populate `snapshot_ifc_files`, parse via web-ifc, persist `materializable_elements` rows, and unblock Track C's viewer.

Source code was real and on origin/main: PRs #15 + #16 merged at SHAs `25e0b0e` + `cc034c9`. Schema migration ran successfully against deployment Neon `ep-little-base-amyyxjca`.

But the route returned `Cannot GET` on prod for ~12 hours after the merge. Six rounds of diagnosis, three rounds of failed redeploys, multiple agents giving contradictory recon. We finally found three distinct bugs stacked on top of each other.

---

## Three bugs, in the order we hit them

### Bug 1 — `.replit` had no explicit `[deployment.build]` step

**Symptom:** Build log showed "Deployment successful" but the api-server bundle (`dist/index.mjs`) was not regenerated. Replit's autoscale was running `pnpm install --frozen-lockfile` only, then shipping the pre-existing `dist/index.mjs` from a prior deploy.

**Root cause:** Root `package.json`'s `build` script was typecheck-gated (`pnpm run typecheck && pnpm -r --if-present run build`). When typecheck failed silently, the recursive build never ran. Replit's deploy still reported success because the container build succeeded — it just shipped an outdated artifact.

**Fix:** Added explicit `[deployment.build]` to `.replit` in commit `b1d7cf4`:
```toml
[deployment.build]
args = ["sh", "-c", "pnpm install --frozen-lockfile && pnpm -r --if-present run build"]
env = { "CI" = "true" }
```

Bypasses the typecheck gate. Build runs on every deploy.

### Bug 2 — Local Replit main detached from origin/main

**Symptom:** After Bug 1's fix, redeploy STILL served stale bundle. Confused us for 3 turns.

**Root cause:** Replit's local main had 17 commits that origin/main didn't have, all named "Published your App." These are Replit auto-checkpoints created on click-to-Publish. They're not pushed to GitHub. Replit deploys from local main, not origin/main. So even though `b1d7cf4` was on GitHub's main, the Repl's local main was on `595575b` (a "Published your App" snapshot from before Track B existed). Every redeploy was rebuilding the wrong source tree.

**Fix:** In Replit shell:
```bash
cd ~/workspace
git fetch origin --prune
git reset --hard origin/main
```

Hard-reset local main to match origin/main exactly. The "Published your App" auto-commits are safe to discard — they're snapshots, not work.

### Bug 3 — Recursive build failed on `mockup-sandbox` PORT requirement

**Symptom:** After Bug 1 + Bug 2 fixes, the build log finally tried to build the api-server but aborted on `artifacts/mockup-sandbox` with `Error: PORT environment variable is required but was not provided.`

**Root cause:** Four artifacts (`mockup-sandbox`, `qa`, `plan-review`, `design-tools`) had `vite.config.ts` files that required `PORT` at config-load time. PORT is set during `vite serve` / `vite preview` (dev/preview) but NOT during `vite build` (deploy). Worked locally because PORT was always set in dev. Broke on deploy.

**Fix (by Replit Agent):** Modified all four `vite.config.ts` files so PORT only throws when `command === "serve"`, and `BASE_PATH` falls back to each artifact's preview path. This is structurally cleaner than narrowing build scope — every artifact in the workspace now builds correctly even without env vars set.

---

## Why this took 12 hours

Each bug masked the next. Fixing Bug 1 surfaced Bug 2. Fixing Bug 2 surfaced Bug 3. We couldn't diagnose them in parallel because each rendered the next invisible.

Compounding factor: agent recon contradicted itself across rounds.

- Workspace 1 recon agent ran `git log origin/main` and reported "no Track B on origin/main" (wrong — agent was on a stale fetch).
- Replit Agent ran `git log` against local main (correct from its frame, but local main didn't have Track B yet).
- Both reports contradicted Nick's GitHub commits screenshot (which showed Track B clearly merged).

I (the planner) treated these conflicting reports as "agent A is wrong, agent B is right" instead of "both agents are looking at different repo states; the architecture of our tooling has produced two ground truths." The correct response was to drop to manual verification against GitHub's web UI immediately, not negotiate between agent narrations.

---

## Lessons learned

### 1. Replit's deploy abstraction conflates dev workspace with deploy target

The Repl's working directory IS the source of truth for the deploy. Local main and origin/main can drift silently. There is no warning, no UI affordance, no error.

**Implication:** Until we migrate to GCP Cloud Run + GitHub Actions, every deploy must include an explicit `git reset --hard origin/main` in the Replit shell before clicking Redeploy. This is now codified in [`90_runbooks/replit_deploy.md`](../90_runbooks/replit_deploy.md).

### 2. Build success ≠ bundle freshness ≠ route reachability

Three independent layers, each can fail silently:
- Container build success (the green checkmark)
- Application bundle regeneration (`dist/index.mjs` actually rebuilt from current source)
- Route reachability on the deployed endpoint (curl returns expected response shape)

Future deploys must verify all three. Curl-probing a known endpoint is the only verification that proves the third layer.

**Implication:** Every server-side deploy of a new endpoint gets followed by a curl probe in the same turn. No exceptions. The smoke test is part of the deploy, not a separate human step.

### 3. Agent recon on git state is unreliable; GitHub web UI is ground truth

Multiple agents gave confidently-wrong reports about what was on origin/main. Each agent's report was internally consistent but reflected a stale or local view, not GitHub's actual state.

**Implication:** When agents disagree on a hard fact (a SHA, a file's existence, a branch state), drop to first-principles checks against the actual servers — GitHub's web UI for the repo, Replit's shell for the Repl, Neon's web editor for the DB — before doing anything else. Treat agent git output as supporting evidence, not primary evidence.

### 4. Confident agent recon reports need verification primitives in the response

The Track B recon report cited specific file paths and line numbers (`routes/snapshots.ts:987-1010`) — the kind of precision that reads as authoritative. The follow-up recon contradicted it with equal precision.

**Implication:** Recon prompts should require the agent to include verification artifacts in the same response: verbatim `git log` output, `git ls-tree` output, `git show <sha>:<path>` output. So the report is checkable without a follow-up agent call. Future recon templates updated to include this pattern.

### 5. Velocity-without-verification compounds

The original Track B recon said "5 commits, 17 files, 11 tests, all green." I (the planner) accepted this and greenlit the next sprint (Track C) against the wire shape Track B claimed to expose. Track C built against a contract that didn't actually exist on prod. When the route 404'd, Track C had to wait for ~12 hours of Track B remediation while its own work sat on a worktree.

**Implication:** Don't sequence dependent sprints purely on agent reports of completion. Production smoke is the gate. "It builds, it tests, it lints" doesn't mean "it ships." Until a curl probe returns the expected response from prod, the work isn't done.

### 6. The runbook for Replit deploy needs to exist BEFORE the next deploy

We didn't have a runbook. Each deploy was being figured out fresh. The new [`90_runbooks/replit_deploy.md`](../90_runbooks/replit_deploy.md) codifies the steps + diagnostic tree so future deploys (until Cloud Run migration) follow a checklist instead of being improvised.

---

## Actions captured

### Done in-saga

- `b1d7cf4` — `.replit` `[deployment.build]` step added
- All four `vite.config.ts` files patched for PORT/BASE_PATH defaults (Replit Agent)
- Replit local main hard-reset to origin/main
- Track B end-to-end smoke verified (after final redeploy succeeds)

### To do — short term (this week)

- Capture this runbook + postmortem in project knowledge — (this doc)
- Apply the same `vite.config.ts` PORT/BASE_PATH pattern to any new artifact created in the workspace
- Add a `Pre-deploy checklist` reminder to the team's deploy ritual

### To do — medium term (next sprint)

**Cloud Run + GitHub Actions migration sprint.** Move legacy-design-tools' api-server deploy off Replit:

1. Containerize api-server build via `Dockerfile`
2. GitHub Actions workflow: on push to main, build container, push to Artifact Registry, `gcloud run deploy`
3. Frontend deploy: evaluate Cloud Run static vs GCS+CDN vs Vercel — pick one
4. Run new deploy path in parallel with Replit for ~3 days to verify reliability
5. Cut Replit deploy out of the loop; keep the Repl as IDE/agent sandbox only
6. Apply the same pattern to SmartCity OS (already half on Cloud Run)

Estimated effort: 1.5–2 days for legacy-design-tools, half-day to apply lessons to SmartCity OS.

### To do — process changes immediately

1. **Recon prompts now require verification artifacts in the same response.** Update template to mandate verbatim `git log` / `git ls-tree` / `git show` output for any recon claim about repo state.
2. **Server-side deploy verification is part of the deploy turn, not a separate human step.** Agent prompts that include a deploy step also include a curl probe of the new endpoint.
3. **GitHub web UI is the ground truth tiebreaker.** When agents disagree on repo state, drop to GitHub directly.

---

## What worked

Worth preserving:

- **The 6-agent setup did NOT cause this saga.** The bugs were tooling/process bugs, not agent coordination bugs. Multiple agents working in parallel gave faster diagnosis once we asked the right questions.
- **The recon-report style with file:line citations** is right; it just needs verification artifacts attached.
- **The deploy-runbook approach** (the existing `wave0_p0-6_hsts_gated_runbook.md` template) was the model for the new Replit deploy runbook. Pattern is good; just needs to be applied earlier.
- **Track A's diagnostic logging at `%APPDATA%\Hauska\DesignTools\ifc-export-errors.log`** earned its keep multiple times. Logging that surfaces actual error reasons instead of generic "failed" messages is high-value defensive engineering.

---

## What I (the planner) am changing

Three behavior changes for myself going forward:

1. **Drop to manual verification when agents contradict.** The screenshot of GitHub commits ended hours of confusion. Should have asked for it 4 turns earlier.
2. **Curl-probe new endpoints in the same turn as the deploy succeeds.** Not "Nick will smoke-test later." Now.
3. **Don't sequence dependent sprints on agent completion reports.** Track C should not have been built until Track B was end-to-end verified on prod. Will hold this line for future cross-track dependencies.

---

## Where the action items landed

Migration note added 2026-05-05 when this postmortem was moved into the docs repo. The action items above were folded forward into:

- **Recon-prompt verification artifacts requirement** — [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) HR-8
- **Same-turn curl probe after deploy** — [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) HR-3 and PC-4
- **GitHub web UI as ground truth tiebreaker** — [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) HR-1
- **No-sequence-dependent-sprints-on-agent-reports** — [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) HR-9
- **Three-failures-in-4h escalation** — [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) HR-7 and PC-2
- **Replit deploy runbook** — [`90_runbooks/replit_deploy.md`](../90_runbooks/replit_deploy.md)
- **Replit-managed Neon ownership concern** — [`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md)
- **Cloud Run + GitHub Actions migration sprint** — tracked in [`10_ground_truth.md`](../10_ground_truth.md) Outstanding (design-accelerator); roadmap doc when one lands

The "What I (the planner) am changing" section is now codified as PC-1 through PC-5 in the agent operating rules. The postmortem itself stays as the historical record of why those rules exist.
