---
id: 2026-08-25_govtech_deploy_runbook
title: G-105 govtech deploy + violation probe runbook
status: active
last_updated: 2026-08-25
plan_row: G-105
owner: govtech
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-24_govtech_program_scope,
    _dispatches/2026-08-25_govtech-deploy_dispatch,
    scripts/govtech/deploy-violation-probes.mjs,
  ]
---

# G-105 deploy + probe runbook

Planner-owned deploys for Wave 1 merged PRs. **Merged ≠ live.** Each gate runs a violation probe before and after the cut. Instrument: `scripts/govtech/deploy-violation-probes.mjs`. Dispatch: `_dispatches/2026-08-25_govtech-deploy_dispatch.md`.

## Prerequisites

1. Read `_state/govtech/STATE.md` and confirm PR merge state (#7, #39, #75, #361 merged; not deployed).
2. Self-test predicates: `node --test scripts/govtech/deploy-violation-probes.test.mjs` (must pass before any live probe).
3. Record snapshot: date, commit/branch per repo, **current** serving revision names (placeholders until shift).

## Deploy order

| Step | Gate | Repos / PRs | Pairing rule |
|---|---|---|---|
| 1 | DEPLOY-7 + DEPLOY-39 | plan-review **#7** + smartcity-dashboards **#39** | **#7 Cloud Run + Vercel together** in one cut |
| 2 | DEPLOY-75 | hauska-mcp-server **#75** | Substrate seat deploy; govtech runs probe |
| 3 | DEPLOY-361 | hauska-engine **#361** | Property seat deploys engine-api; govtech runs probe |

Do not start DEPLOY-75 until DEPLOY-7 and DEPLOY-39 post-deploy probes pass. Do not set a real ICC rate until DEPLOY-75 passes (O-1).

---

## Step 0 — Baseline violation probes (pre-deploy)

For each gate, expect the **known defect** still on the serving surface:

```text
node scripts/govtech/deploy-violation-probes.mjs --gate deploy-7   --expect fail
node scripts/govtech/deploy-violation-probes.mjs --gate deploy-39  --expect fail
node scripts/govtech/deploy-violation-probes.mjs --gate deploy-75  --expect fail
node scripts/govtech/deploy-violation-probes.mjs --gate deploy-361 --expect fail
```

Or all gates:

```text
node scripts/govtech/deploy-violation-probes.mjs --gate all --expect fail
```

Exit 0 means the probe detected the violation (or documented a credential gap for 75/361). File raw stderr snapshot block + stdout in CP1.

**Mock sanity (no network):**

```text
node scripts/govtech/deploy-violation-probes.mjs --gate all --expect pass --mock
node scripts/govtech/deploy-violation-probes.mjs --gate deploy-7 --expect fail --mock --fixture deploy7Bad
```

---

## Step 1 — DEPLOY-7 + DEPLOY-39 (paired cut)

### DEPLOY-7 — plan-review PR #7

**Defect #6:** code lookup returned a neighbouring section (`IBC_SEED` fallback). Fix refuses unknown sections; client citation synthesiser removed.

**Deploy (same session):**

1. **Cloud Run** — from `plan-review` repo at merge tip of #7:

   ```text
   gcloud run deploy plan-review --source . --project plan-review-505715 --region us-east1 --tag g105-7 --no-traffic
   ```

   Smoke the tagged revision, then shift traffic to 100%. Record revision name (e.g. `plan-review-000XX-xxx`).

2. **Vercel** — from `plan-review/web/`, project `plan-review-app` (`prj_zn2fPbov1Egj8hyym8Qu3HTKixQJ`):

   ```text
   vercel deploy --prod
   ```

   Record deployment id (`dpl_…`). **Do not deploy service without app.**

**Probe after shift:**

```text
set PLAN_REVIEW_REVISION=<revision>
set PLAN_REVIEW_VERCEL_DPL=<dpl>
node scripts/govtech/deploy-violation-probes.mjs --gate deploy-7 --expect pass
```

Live check: `GET …/api/code-lookup?edition=icc-demo&section=R9999.9.9` must refuse, not return `R302.1` or other neighbour.

### DEPLOY-39 — smartcity-dashboards PR #39

**Defects #1–#2:** absent `accessPolicy` visible; compose ungated for anonymous caller.

**Deploy:**

```text
gcloud run deploy smartcity-dashboards --source . --project smartcity-dashboards --region us-east1 --tag g105-39 --no-traffic
```

Smoke, shift 100%, record revision.

**Probe after shift:**

```text
set SMARTCITY_DASHBOARDS_REVISION=<revision>
node scripts/govtech/deploy-violation-probes.mjs --gate deploy-39 --expect pass
```

Live check: anonymous `GET /api/lenses/city-manager/compose?cityKey=template-city` must not return `tenant-private` atoms or atoms with missing `accessPolicy`.

**Gate G105-1:** both revisions recorded; both `--expect pass` probes exit 0.

---

## Step 2 — DEPLOY-75 (hauska-mcp-server PR #75)

**Defect S4-2:** meter bypass — accrual with empty provenance array.

**Deploy:** substrate seat owns `gcloud run deploy` on hauska-mcp-server at #75 merge tip. Tag `g105-75`, smoke, shift traffic.

**Probe:**

```text
set HAUSKA_MCP_REVISION=<revision>
node scripts/govtech/deploy-violation-probes.mjs --gate deploy-75 --expect pass
```

If live MCP credentials are unavailable, grade using the instrument’s mock fixtures plus a manual MCP tools/call transcript filed in close JSON (envelope with `provenance: []` and non-empty `atom_ids` must not accrue).

**Gate G105-2:** serving revision recorded; post-deploy probe pass or documented credential probe with matching predicate grade.

---

## Step 3 — DEPLOY-361 (hauska-engine PR #361)

**Defect #5:** writer `resolveAccessPolicy ?? "public-free"`.

**Deploy:** property seat owns engine-api / retrieval-api deploy at #361 merge tip. Tag `g105-361`, smoke, shift.

**Probe:**

```text
set HAUSKA_ENGINE_REVISION=<revision>
node scripts/govtech/deploy-violation-probes.mjs --gate deploy-361 --expect pass
```

Live write probe requires authenticated atom write without `accessPolicy`; response must refuse (`access-policy-required`), not 201 with inferred `public-free`. If no write creds, file property seat probe artifact that grades the same predicate.

**Gate G105-3:** serving revision recorded; post-deploy probe pass.

Note: `load-snapshot-into-pg.mjs` bypass remains property leave_behind (L2); not closed by this deploy alone.

---

## Step 4 — Close

1. Re-run: `node --test scripts/govtech/deploy-violation-probes.test.mjs`
2. File `_inbox/2026-08-25_govtech-deploy_cp2.json` and `_inbox/2026-08-25_govtech-deploy_close.json` citing **G105-1** through **G105-6**.
3. Update `_state/govtech/STATE.md` deploy table (NOT DEPLOYED → LIVE with revision ids).
4. Regenerate `_STATE.md`: `node scripts/state/generate-combined.mjs`

## Unblocks

- **G-106** Smart Files read-path (after dashboards #39 live)
- **G-108** plan review honesty path (after DEPLOY-7 live)
- **G-109** ICC obligation ledger chain (after DEPLOY-75/361 + S4-6 backfill)
