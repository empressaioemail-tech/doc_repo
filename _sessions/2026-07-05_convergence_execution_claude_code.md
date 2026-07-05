---
id: sessions/2026-07-05_convergence_execution
title: Convergence program execution — session close + handoff to fresh planner
status: active
date: 2026-07-05
related: [_inbox/2026-07-04_convergence-program_STATUS.md, _decisions/2026-07-04_convergence_program_execution_model.md, _catalog/repo_intents.md]
---

# Convergence execution — close + handoff

This session ran the convergence program (audit -> Phase 0 -> into Phases 1/3). It delivered a large, real body of work but did NOT achieve hands-off autonomy: it required ~3 hours of operator babysitting. This doc is the handoff so a FRESH planning agent picks up clean. The live ledger is `_inbox/2026-07-04_convergence-program_STATUS.md` (read it first). This is the retrospective + the "run it better" guidance.

## Shipped (real, verified, on main/npm/prod)
- `@hauska/atom-contract@1.6.1` published (conformance/export git provenance restored).
- `@hauska-sdk/payment@0.1.1` published (Circle rail) — operator did the OTP publish.
- Merged to main: engine fail-open fix (#80), ldt mock-flip (#225), MCP four-gate rework (#35, 62 tools / four gates).
- **Command center LIVE on Vercel: https://cmdcenter-blush.vercel.app** (verified 200; first version, backend-wiring + branding pass owed).
- Full doc-truth reconciliation: CLAUDE.md boot facts, `_catalog/repo_intents.md`, ICC binding spec, hygiene sweep (62/four-gate + Regrid-purged + 1.6.1 across live docs), 6 decision records.
- ICC demo creds stored securely (GCP secrets v2, hauska-prod-497015).

## Staged (built + verified, awaiting merge/deploy/coordination — NOT faked)
- atom-spec open standard — PR #4 (hauska-atom-contract), operator framing-review.
- Component-library @hauska->@empressaio rename — PR #226 (legacy-design-tools), Phase 3 coordination.
- Command-center Vercel config — PR #5 (hauska-map).
- Engine 1.6.1 bump — branch fix/atom-contract-1.6.1 (`34d42e5`), HELD: changes brief-run confidence scalar->WidthedConfidence (wire-compat check owed before merge).
- ICC PoC extension — branch extension/icc-poc-formal-citation (`f772add`), Ed-spec citation format, tests pass.
- SDK metering — built+staged in P:\tmp\hauska-sdk-publish (needs CI publish).

## Operator-gated (the genuinely-need-you list)
- **NPM_TOKEN secret** (the bypass automation token) in SDK + atom-contract repos -> unblocks ALL autonomous publishing via CI tag-push (the local `npm publish` CLI forces interactive web-auth regardless of token; CI does not).
- **ICC OAuth token endpoint** — from ICC's Postman collection (assumed /oauth2/token 404s). One fact finishes the ICC backend.
- MCP four-gate DEPLOY (breaking migration 005 — runbook in tracker). cortex-api/engine redeploys for #80/#225. Tenancy prod flip. Stripe live. Extension key rotate. Cotality key (2026-07-06).

## Queue for the fresh agent (dependency order)
1. MCP four-gate canary deploy (breaking; runbook in tracker; map key cleared).
2. cortex-api + engine redeploys (pick up #80/#225).
3. Phase 1 remainder: gate single-chokepoint, metering wired, eval scores, ICC backend (once OAuth endpoint known).
4. Phase 2 tenancy: BUILD-AND-STAGE only (no prod flip — operator ruling).
5. Phase 3 remainder: console extraction from ldt; command-center backend-wiring + Empressa branding.
6. Phase 4: Stripe test pricing, proof-of-record spec, siting spike memo, certification scaffold.

## WHY it needed babysitting, and HOW to actually be autonomous (read this)
The failure mode: this session ran wave-by-wave — launch ONE Cursor task, hand-verify its result in the planner's own context, report to the operator, launch the next. That structurally (a) keeps the operator in the loop every wave and (b) burns planner context until it's too deep to trust (two npm errors came from depth). It also idled between waves.

The fresh agent should run it differently:
- **Use the Workflow tool** for the build waves — it chains many Cursor/subagent tasks + adversarial verification deterministically WITHOUT a human-in-loop per step, and without burning the planner's context on every result. That is the actual autonomy mechanism; the wave-by-wave Agent-tool pattern is not.
- All credentials are now in place: npm (via CI once NPM_TOKEN secret set), cursor-agent (authed; `--force` for headless, refresh PATH each shell), Vercel (authed as empressaioemail-tech), gcloud, gh. See [[agent-auth-and-fleet-state]].
- Front-load: before starting a long run, confirm the few remaining operator-gated items (above) are resolved or explicitly deferred, so nothing surfaces mid-run.
- Keep the pipeline full (always a task in flight) and verify by outcome (build passes / endpoint returns) not by reading every diff.
- Deploys: operator authorized autonomous-on-green + canary/rollback; tenancy flip and money-live stay gated.

## Execution facts the fresh agent needs
- cursor-agent: `$env:PATH = "$([Environment]::GetEnvironmentVariable('PATH','Machine'));$([Environment]::GetEnvironmentVariable('PATH','User'))"; cursor-agent --print --force --model sonnet-4.5 "<task>"` in the target repo dir; run background via the shell tool's run_in_background. Work in fresh P:\tmp clones, never the operator's persistent clones; push branch right after first commit.
- Vercel monorepo (hauska-map) deploy needs a root vercel.json with `pnpm install` + `pnpm --filter ./apps/command-center build`, output `apps/command-center/dist` (committed in PR #5). Deploy from repo root, not the subdir.
- npm publishing: CI tag-push only (local CLI forces web-auth). See [[hauska-npm-scope-publish-gated]].
- One background task (eval-scores, id bfsy77bq7) was in flight at close in P:\tmp\engine-eval — status unconfirmed; the fresh agent should check/relaunch it.
