---
id: 2026-05-22_cc-agent-AC_cloud_run_deploy_shift_traffic
title: Dispatch — cc-agent-AC add shift-traffic and rollback jobs to cloud-run-deploy.yml
date: 2026-05-22
agent: cc-agent-AC
repo: legacy-design-tools
kind: dispatch
related: [90_runbooks/cloud_run_canary_deploy, 43_cortex_qa_backlog, 00_current_state, 20_agent_operating_rules]
---

# cc-agent-AC dispatch — cloud-run-deploy.yml shift-traffic + rollback

> **Folded in 2026-05-22.** This work is Phase 2 of the cc-agent-C QA build, [`2026-05-22_cc-agent-C_cortex_qa_build.md`](2026-05-22_cc-agent-C_cortex_qa_build.md), which adds a migration job alongside the shift-traffic and rollback jobs. Do not run this as a separate cc-agent-AC dispatch. cc-agent-AC is dormant; its atom-contract work is complete.

You are cc-agent-AC. This dispatch makes the cortex-api Cloud Run deploy fully runnable as an operator-supervised agent dispatch, by adding manual traffic-shift and rollback jobs to the deploy workflow. Today the traffic shift is a raw `gcloud` command that needs local GCP credentials no agent has; this closes that one gap.

## Why this exists

The cortex-api deploy is `.github/workflows/cloud-run-deploy.yml`. Today: `build-and-push` runs on every push to `main` (image only, no deploy); `deploy-canary` is `workflow_dispatch`-only and deploys a 0%-traffic `canary`-tagged revision. The traffic shift that promotes the canary to production is a manual `gcloud run services update-traffic` run by a human, per [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md). An agent cannot run that step: it needs the agent's local environment authenticated to GCP, which agents do not have and should not have. The deploy workflow itself authenticates to GCP via workload-identity-federation. Moving the traffic shift into the workflow lets an agent run the whole deploy through `gh workflow run`, with no local `gcloud`.

## Scope

Edit `.github/workflows/cloud-run-deploy.yml`. Add two `workflow_dispatch`-only jobs and a way to select between actions.

1. **An `action` input** on `workflow_dispatch`: a choice of `deploy-canary` / `shift-traffic` / `rollback`, default `deploy-canary`. Each `workflow_dispatch` job gates on `inputs.action`, so one dispatch runs exactly one job. The existing `deploy-canary` job keeps its current behavior and is now gated on `action == 'deploy-canary'`.
2. **A `shift-traffic` job.** Reuses the same GCP auth steps as `deploy-canary` (`google-github-actions/auth@v2` with the existing `GCP_*` secrets, then `setup-gcloud`). Runs `gcloud run services update-traffic cortex-api --to-tags canary=100 --region us-central1`. After the shift, echo `gcloud run services describe cortex-api ... status.traffic` so the resulting split is visible in the run log, and curl `/api/healthz` on the production URL as a post-shift check (canary runbook step 7).
3. **A `rollback` job.** Takes a `rollback_revision` input (a Cloud Run revision name) and runs `gcloud run services update-traffic cortex-api --to-revisions <rollback_revision>=100`. Echo the resulting traffic split. This is the canary runbook's "failure after traffic shift" path, made runnable without local `gcloud`.

## Hard constraints

- **Never auto-shift on push.** `build-and-push` stays push-triggered and image-only. `shift-traffic` and `rollback` are `workflow_dispatch`-only, never reachable from a `push` event. The existing workflow comment ("NEVER add an automatic traffic-shifting step here") refers to coupling a shift to push; a separate manual `workflow_dispatch` job does not violate it. Preserve that comment and extend it to describe the new manual jobs.
- The canary discipline stays. deploy-canary, then a smoke step, then shift-traffic remain three separate deliberate actions. This dispatch does not fold smoke into the workflow; pre-shift canary smoke (healthz, a real IFC upload) stays an external verification step.
- Do not change `deploy-canary`'s deploy flags, env vars, or secrets. This is a behavior-preserving refactor plus the two new jobs.

## Verification

A workflow change cannot be fully exercised without dispatching it, and `shift-traffic` touches production traffic. So: validate the YAML parses (`actionlint` if available, otherwise a careful structural read), confirm the gating logic is correct (one `action` value runs exactly one job), and read the result against `90_runbooks/cloud_run_canary_deploy.md` step by step. The first real `shift-traffic` and `rollback` dispatches are themselves the live test and stay operator-supervised. Update `docs/deploy.md` to document the new `action` input and the shift-traffic / rollback flow.

## Run posture

Operator-supervised. One PR for review. Do not trigger any deploy or traffic action yourself; this dispatch ships the workflow change only.

## Workspace ownership

cc-agent-AC's `legacy-design-tools` clone `P:\ldt-ac-qa17`. Branch under `ci/*`. The change is one workflow file plus `docs/deploy.md`, zero overlap with cc-agent-C's codex-reviewer-qa work. Re-orient onto `main` and pull first.

## Reporting

At every session break-point, write your session summary to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-AC_<topic>.md` per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Do not commit to the doc repo. Keep the durable record in your own repo.
