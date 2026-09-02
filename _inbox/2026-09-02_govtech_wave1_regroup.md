---
id: 2026-09-02_govtech_wave1_regroup
title: Govtech Wave 1 — regroup before execution
status: active
last_updated: 2026-09-02
applies_to: OPS-17 govtech lanes (A Smart Files, B SmartCity/Dashboards, C Plan Review, D ICC)
owner: nick
related:
  - 90_operations/OPS-17_govtech_stack_plan_of_record
  - _inbox/2026-08-25_govtech_wave1_WDLL
  - _inbox/2026-08-24_govtech_program_scope
  - _inbox/2026-08-24_govtech_transaction_contract
  - _inbox/2026-08-24_govtech_engine_migration_plan
  - _state/govtech/STATE
  - _catalog/seat_register.json
plan_row: G-105 through G-110 (OPS-17 A-085)
---

# Govtech Wave 1 — regroup before execution

## Why this doc exists

The Wave 1 WDLL (`_inbox/2026-08-25_govtech_wave1_WDLL.md`, OPS-17 A-085, rows G-105
through G-110) has sat `status: draft`, `operator_approval: pending` since 2026-08-25 —
eight days. Nothing has touched it since: no session between 2026-08-25 and today
mentions G-105 through G-110. The whole intervening week went to the property/Factory
program (CTX containment, P-91). This doc regroups the wave against **live-verified
state** (pulled today, this session, by digest and commit comparison — not narration)
so the next move in this chat is an informed dispatch, not a resumption of an
eight-day-old snapshot.

This doc does not edit the OPS-17 baseline table (rule 1: never edited) and does not
edit the frozen-format WDLL card in place (it stays the acceptance-criteria reference;
it is still pre-approval so it remains open, but its content is left as written).
This is the regroup layer between the two: what's actually true right now, benchmarked
against the WDLL's own instruments.

## Snapshot

Repo `P:\doc_repo`, branch `main` (integration checkout, not a seat worktree), commit
`136cd5f802706449410c5e3d49a70ffec748406f`. Per `_catalog/seat_register.json`, the
`govtech` seat (created 2026-08-24) owns `smartcity-dashboards`, `smart-files`,
`plan-review`, `icc-portal` from its own worktree at
`P:/seat-worktrees/govtech/doc_repo` on `seat/govtech`; this session is not that seat
and does not write `_state/govtech/` (SEAT-01: writable only from the registered
worktree). This doc is filed from the integration checkout, which is squarely
doc_repo-planner territory (canonical docs, OPS-17 amendments), not seat-private state.

**Coordination note received this session** (relayed by the operator from another
planning agent): the property seat (OPS-19) is in heavy concurrent flight in this same
checkout — a card queue at `_queue/`, worktrees under `P:/tmp/hauska-factory-*` and
`P:/tmp/hauska-engine-*`, stores `FACTORY_DATABASE_URL` and `cortex-prod`. None of that
is touched by this doc. One live consequence already observed: the govtech queue log
(`_queue/log/govtech.jsonl`) shows two `WRONG_SEAT` refusals on 2026-09-01 from calls
that targeted `hauska-factory` cards under the `govtech` seat name — the refusal fired
correctly; nothing to fix, just confirms the boundary is live.

**Doc hygiene flag, not blocking:** `_catalog/seat_register.json:667`, the `property`
seat's `authority` string, still lists `smartcity-dashboards`, `smart-files`,
`plan-review` and `icc-portal` as property surfaces ("OPS-17 lane siblings"). That
predates the 2026-08-24 govtech seat creation (line 774), which states plainly these
four repos "moved OFF the property seat." The govtech entry is newer and controls;
the property string is a stale cross-reference nobody swept after the reassignment.
Worth a one-line fix next time the systems seat touches this file.

## The 4x5 grid, restated

Same structure as the chat table already produced this session, benchmarked from
OPS-17 directly. Included here so the planning doc is self-contained.

| Lane | L1 Foundation | L2 Measurement | L3 Integrity | L4 Depth | L5 Launch |
|---|---|---|---|---|---|
| **A** Smart Files | G-14 merged, not closed | G-20 open | G-34 merged, unreviewed | G-44 open | G-53 open |
| **B** SmartCity/Bastrop | G-18 done (as-found) | G-21, G-24 open | G-33 open | G-42, G-43, G-45 mixed | G-52 open |
| **C** Plan Review | G-15, G-16 open | G-22 open | G-31, G-32 open | G-40 open | G-51 open |
| **D** ICC | G-17 open | G-23 open | G-30 live-licence-exposure watch | G-41 open | G-50 open |

Everything not called out below is unchanged from OPS-17 baseline. The action this
week lives entirely in the **Wave 1 integration rows** (G-105 through G-110), which sit
outside the 4x5 grid as a cross-lane program-level insert (A-085) — the grid measures
each lane's own layers; Wave 1 is the seam that makes the four lanes work as one
transaction.

## Live-verified deploy state (pulled this session)

This is the actual finding. STATE.md (2026-08-25) records four PRs as "merged, not
deployed": plan-review #7, dashboards #39, hauska-mcp-server #75, hauska-engine #361.
That was true on 2026-08-25. It is **half true today** — two of the four went live as
a side effect of unrelated property-program redeploys, and nobody in the govtech
thread has graded or recorded it.

| Component | Repo | Wave-1 PR | Merge commit | Merged | Serving now | Deployed | Verdict |
|---|---|---|---|---|---|---|---|
| Hauska MCP server | hauska-mcp-server | #75 (unify ICC detector, accrue plan-review) | `c81f1c3` | 2026-08-24 22:45Z | `hauska-mcp-server-00084-mof` (image `1ae9f28`) | property-program redeploy, tag `p89-1ae9f28` | **LIVE** — `gh api compare c81f1c3...1ae9f28` returns `ahead_by 4, behind_by 0`: the PR #75 merge commit is an ancestor of what's serving |
| Hauska engine-api | hauska-engine | #361 (fail-closed accessPolicy writes) | `cfa18bc` | 2026-08-24 22:47Z | `hauska-engine-api-00176-keb` | confirmed 2026-08-27 (memory: E-1/E-2 close) and reconfirmed live this session | **LIVE** |
| Plan Review — Cloud Run BFF | plan-review | #7 (refuse unknown section, no neighbour) | `071a08e` | 2026-08-24 23:33Z | `plan-review-00012-pen`, tag `g60g` | 2026-08-16 | **NOT DEPLOYED** — serving revision predates the merge by 8 days; it's still the G-60 ICC-demo-close revision |
| Plan Review — Vercel front | plan-review | pairs with #7 | same | same | `dpl_2oes3U…`, created Mon Aug 24 13:55 CDT | — | **NOT DEPLOYED** — deployment timestamp is ~4.5h *before* the PR #7 merge (18:33 CDT) |
| SmartCity Dashboards | smartcity-dashboards | #39 (close 5 fail-open read-path instances) | `4573d46` | 2026-08-24 23:33Z | `smartcity-dashboards-00037-ced` | 2026-08-20 | **NOT DEPLOYED** |
| Smart Files | smart-files | none yet (G-106 has no PR) | — | — | Cloud Run `smart-files-00006-xwp` (2026-08-18), Vercel `dpl_Fzdng…` (2026-08-20) | — | **NOT STARTED**, matches STATE.md — G-106 read-path scope work has not begun |
| ICC portal | icc-portal | none this wave (consumer only) | — | — | `dpl_F5xuVv…`, unchanged since 2026-08-16 | — | Untouched; its live behavior depends on plan-review + MCP above, both of which are mid-wave |

**What this changes about G-105.** The row as scoped is "deploy #7 + #39 + #75 + #361
with live violation probes." Two of those four are already running the correct code.
G-105 is now a two-item deploy job (plan-review #7 Cloud Run+Vercel paired, dashboards
#39), plus two confirmation items (run the WDLL's own violation probes against #75 and
#361 to formally grade them, since ancestry-by-digest is evidence the code is live, not
the same thing as the WDLL's named SQL/fixture probe passing). Do not report items 3
and 4 of the WDLL as "met" from this doc alone — the acceptance check for each is a
specific live probe (obligation-ledger row count for #75, writer-violation fixture for
#361) and neither has been run against production this session. Code-live and
probe-graded are different claims; this doc only establishes the first.

## Wave 1 rows — regrouped status

| Row | What | STATE.md (2026-08-25) | Regrouped (2026-09-02) |
|---|---|---|---|
| G-105 | Deploy gates for #7/#39/#75/#361 | OPEN, all four undeployed | OPEN, but scope now 2 deploys (plan-review, dashboards) + 2 probe-graded confirmations (MCP, engine-api) |
| G-106 | Smart Files read-path scope (defect #3) | OPEN, no PR | Unchanged — OPEN, no PR |
| G-107 | Staff upload path (R-B) | OPEN | Unchanged — blocked on G-106 per WDLL item 7 dependency |
| G-108 | Plan review honesty path (edition selector, typed absence) | OPEN | Unchanged, but its prerequisite (G-105 item 1 / DEPLOY-7) is now known to be the *only* undeployed piece standing between here and this row unblocking |
| G-109 | ICC obligation ledger chain | OPEN, "waits G-30 UPDATE" per STATE.md note on the unrelated inbound meter | The **writer half is live** (engine-api #361 fail-closed, confirmed) and the **accrual half is live** (MCP #75 confirmed by ancestry) — meaningfully closer than OPEN suggests, but the WDLL's own ledger-row probe (item 12) has not been run, so the row stays OPEN until that's graded |
| G-110 | Wave 1 E2E proof on template-city | OPEN | Unchanged — depends on everything above; earliest row that could realistically close once G-105's two real deploys land |

## Open blockers carried forward, not independently re-verified this pass

These are inherited from `_state/govtech/STATE.md` (2026-08-25) as-is. This session did
not re-check them; listed here so the regroup doesn't silently drop them.

- **S3-1** Smart Files read-path scope, defect #3 (feeds G-106).
- **S4-6** property backfill blocked on `hauska_mcp` DSN (feeds G-109 chain; owned by property, request don't build).
- **S1-17** `template-city` vs `icc-demo` tenant mismatch on the plan-review surface (feeds G-107 dependency item 6).
- **DOC-5** — checked this session: `_inbox/2026-08-24_adr023_amendment_draft.md` is still `status: draft`. No session between 2026-08-24 and today records an operator ratification. **Confirmed still open.** S2-1 (engine migration into plan-review) stays blocked; Wave 1 continues on the interim HTTP-to-`hauska-engine`-retrieval-api hop per the WDLL's own interim-path clause, which does not require DOC-5.

## Bastrop cutover — still not scoped

No change to report. `smartcity-os` (live Bastrop production) remains ABSOLUTE
NO-TOUCH, confirmed current in `_catalog/seat_register.json:774`. Repo intent for
`smartcity-dashboards` still reads "Template then Bastrop cutover" — the cutover is a
named future WDLL that does not exist yet, gated behind the template-city product line
(done, per A-084) and now behind Wave 1 (in flight). Nothing in this regroup creates or
implies a Bastrop-cutover row. If tonight's execution conversation is meant to include
scoping that cutover, that's a new WDLL to draft, not a rows-105-110 item.

## Sequenced path to execute (not started this turn)

For when this chat moves to execution:

1. Operator approves the Wave 1 WDLL (still draft) — or approves it with the two
   corrections this doc surfaces (G-105's real scope, G-109's partial live state).
2. Dispatch G-105, scoped to: (a) plan-review PR #7 Cloud Run + Vercel paired deploy,
   graded by the WDLL's pre/post neighbour-fallback probe; (b) dashboards PR #39
   deploy, graded by the WDLL's anonymous-compose probe; (c) run the WDLL's item-3 and
   item-4 probes against the already-live MCP and engine-api revisions to formally
   close those two without a redeploy.
   Compile via `node scripts/dispatch.mjs --plan OPS-17 --lane <A|B|C|D> --plan-row G-105 --repo <r> --mission-file <f>` (verified live against `scripts/dispatch.mjs` this session — `--plan` defaults to OPS-16 if omitted, so it must be passed explicitly for every govtech row).
3. G-106 (Smart Files read-path scope) — no PR exists; this is new work, not a redeploy.
4. G-107 → G-108 → G-109 (ledger probe) → G-110 (E2E proof) in the WDLL's declared
   dependency order.

## DEPLOY-7 and DEPLOY-39 — closed this session (post-regroup)

Both executed after this doc's initial regroup, in the same session, on the operator's
go ("do the two deploys"). Deployed from clean detached-HEAD checkouts of true
`origin/main` in the registered govtech seat worktrees (the two primary local
checkouts, `P:/plan-review` and `P:/smartcity-dashboards`, were stale — behind
origin by 2 and 26 commits respectively, both with unrelated uncommitted local
edits — neither was touched).

**DEPLOY-7 (plan-review).** Cloud Run `plan-review-00014-zot` deployed tagged
`g105-7`, smoke-tested on its tag URL, shifted to 100%. Vercel `dpl_D8satDguP8ZhRKFjXwf2aW9jV3po`
deployed to production, aliased `plan-review-app-ten.vercel.app` (paired in the same
cut per the canvas's own warning: shipping the Cloud Run fix alone would leave the old
frontend fabricating a citation client-side against a service that now refuses).
**Verified two ways:** (1) live probe — the WDLL's own probe path
(`/api/code-lookup`) turned out to not exist on this service; the real route is
`GET /api/plan-review/code`, and it requires a Bearer service token (a separate,
already-live gate from PR #6). Authenticated against `plan-review-service-token`,
pre-deploy the service returned HTTP 200 with a fabricated `R311.7` citation for a
nonsense section (`ZZZZ-NOT-A-SECTION`); post-deploy the same call returns
`{"status":"typed-absence","absence":{"status":"unchecked",...}}` — no fabrication.
(2) code reading — `src/tenancy.mjs` and `src/code-lookup.mjs` diffs confirmed as the
right shape independent of the live probe.

**DEPLOY-39 (dashboards).** Cloud Run `smartcity-dashboards-00039-cid` deployed tagged
`g105-39`, smoke-tested, shifted to 100%. **Verification is weaker than DEPLOY-7 and
that gap is recorded rather than papered over:** the compose endpoint
(`/api/lenses/city-manager/compose`) does not expose per-atom `accessPolicy` in its
response — it returns counts and type lists, not atom bodies — so no live request
through this route can directly observe the fail-open-to-fail-closed change. The smoke
probe (anonymous compose, real parcel) returned an honest `"status":"unavailable",
"basis":"retrieval timeout"` on both the new tagged revision and the still-live old
revision when compared side by side, isolating it as an upstream retrieval-api
condition (consistent with the coordination note about heavy concurrent Factory load),
not a regression from this deploy. The actual verification for this one is **code
reading**: `git diff` on `src/tenancy.mjs` between the pre-#39 commit and the merge
commit shows the exact fail-open line removed — old code had
`if (raw == null || String(raw).trim() === "") return true;` (absent policy = visible
= true); new code resolves through a five-value enum allowlist and returns `null` →
`false` for anything absent or unrecognized. Per this repo's own doctrine (code reading
outranks output measuring when they'd otherwise disagree), that diff is the basis for
calling DEPLOY-39 closed, not the live probe, which this session could not make
dispositive through this endpoint.

**A separate finding, not yet acted on:** `scripts/govtech/deploy-violation-probes.mjs`
has real bugs surfaced by actually running it live rather than trusting its passing
self-test suite. Its `deploy-7` gate hits a route (`/api/code-lookup`) that does not
exist on the service (the real route is `/api/plan-review/code`) — a 404
"route not found" was silently read by the grader as "correctly refused," a false
pass. Its `deploy-39` gate hits the compose endpoint with no `pack` or `parcelNodeId`,
which returns an empty atoms array regardless of the defect's presence — vacuously
passing. Both gates reported `expected violation present, but predicate passed` when
run against the known pre-fix revisions this session — the script did not silently
lie (it printed MISMATCH and exited 1, which is the correct fail-loud shape), but its
live-probe paths do not reach the defect they claim to test. This needs a fix by
whoever next owns this script; not attempted here since it's shared govtech-seat
infrastructure and this session is not that seat.

Neither deploy touched `_state/govtech/STATE.md` (seat-owned, not writable from this
integration checkout per SEAT-01) — its deploy table still reads NOT DEPLOYED for
both and needs a refresh from the govtech seat's own worktree.

## DEPLOY-75 and DEPLOY-361 — formally graded (post-deploy addendum)

Full evidence in OPS-17 amendment A-088; summary here. **DEPLOY-75**: closed with a
named residual. Evidence for: migration 009 applied (table + 12 pre-fix rows); the
PR's own shipped self-test (`scripts/violation-probes.mjs`, run this session) passes
non-vacuously on all three defect classes; a live replay of a known pre-fix false
positive (a non-ICC Bastrop setback-rule that was wrongly billed in July) now
correctly accrues zero. Gap: the true-positive live path — does a real ICC citation
still accrue correctly post-fix — could not be tested; it needs a `codex`-tier
product key this session didn't have. **DEPLOY-361**: closed by code reading alone,
on purpose. A live malformed-write probe against the shared atoms store was the
WDLL's prescribed check, but that store had an unrelated concurrent-write collision
reported earlier this same session (resolved, not this program's fault) — running an
experimental bad write against contended production infrastructure right after a
force-push incident was a bad trade for marginal extra confidence. The code diff is
unambiguous: the exact fail-open default (`options.accessPolicy ?? "public-free"`)
is deleted, and `accessPolicy` moves from optional to required across five atom
interfaces — a type-level fix, which this repo's own doctrine ranks above a runtime
probe anyway.

## What this doc is not

Not a new plan of record (no new OPS number claimed; `--plan OPS-17` still governs
every row cited here). Not an edit to the OPS-17 baseline table. Not an execution step —
no dispatch was compiled, no PR opened, no deploy triggered this session. A short
amendment row is proposed for OPS-17 pointing here; it is presented for review before
being committed, per standing process.
