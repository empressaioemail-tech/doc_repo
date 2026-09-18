---
id: 2026-09-18_ldt_cortex_api_deploy_RECORD
title: cortex-api (legacy-design-tools) deployed after P-323, record
date: 2026-09-18
last_updated: 2026-09-18
status: DONE 2026-09-18 15:54Z. cortex-api-00841-jeh serving 100 percent; canary graded PASS; the workflow's post-shift P-279 step is broken (P-362)
kind: production-write record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-257, P-270, P-322, P-273, P-279, P-323]
authority: register section 3b row "LDT deploy" (Wave 2): after P-323 lands, with P-279's check green
---

# LDT deploy (cortex-api), 2026-09-18

## What ships

`cortex-api` serves `cortex-api-00824-qay` at 100 percent, image digest `61d345e4...`, built from LDT
`7219b707`. LDT main is `25d1782f`; between them five commits, all under `artifacts/api-server` (one
also `lib/cad-ingest`, one `.github`), and **no migration**:

| Commit | Row |
|---|---|
| `10468fb4` | P-279: a tagged revision cannot outlive a credential the serving revision carries (workflow) |
| `388ccc5c` | P-273: two more controls that could not fail |
| `f184afe1` | P-257: a planned-development code is not a Euclidean district |
| `7f676936` | P-270: an undated setback citation declares it |
| `25d1782f` | P-322: the four no-source counties get a declared absence |

P-206's fix (`ba6a5a69`) is already serving on both `cortex-api` (in `7219b707`) and `smartsite-mcp`
(`00134-wad` is built from `ba6a5a69` itself); the handoff's "merged, not deployed" is stale.
`smartsite-mcp`'s source is unchanged since, so it is not redeployed.

`run-migrations` is NOT dispatched: nothing in the range adds one, and LDT's runner applies every
pending file, which would apply `0102` (held pending for P-296).

## Procedure and grading, pre-registered

1. Traffic lease `_catalog/leases/cortex-api.json` (taken 15:33:37Z, expires 17:03:37Z).
2. `deploy-canary` with `image_tag=25d1782f2e59bd5098b8459196ea828ae3580027`: a new revision tagged
   `canary` at 0 percent; the workflow's own P-279 check must pass.
3. Grade the canary against the serving revision with `scripts/cortex-canary-compare.mjs` (self-test
   10/10; calibrated live against itself at 15:37Z: 90 of 90 identical after removing read clocks)
   over the 52 probe subjects on the draw route and the node facts. **PASS requires** every difference
   to be P-270 vintage, a P-257 change on a PUD-coded subject, or P-322 agValuation in its four
   counties. **Falsifier:** any other difference, a status change, or a subject unanswered on one side.
4. Only on PASS: `shift-traffic` (100 percent to `canary`), traffic read back by field, the workflow's
   production healthz and P-279 check, then the customer surface re-read.
5. Rollback handle: `cortex-api-00824-qay`.

## Log

- 15:40:04Z `deploy-canary` dispatched (run 35363814594), conclusion `success` including the P-279
  check. Traffic read back by field: `cortex-api-00841-jeh` tagged `canary` at 0 percent;
  `cortex-api-00824-qay` still 100 percent. Lease revision set to `00841-jeh`.
- 15:43:34Z canary grade, first run: FAIL 1 of 90. `48021:34049` draw payload gained
  `citationEffectiveDate: "2026-04-14"` (absent on production) in two places. Read against the change
  set: LDT `7f676936` (P-270) adds exactly that field for a dated citation and its test expects
  `"2026-04-14"`. The grader's P-270 class matched "vintage" only; `citationEffectiveDate` was named
  from the commit (not a wider pattern), with a test that an unrelated new date field still fails
  (self-test 12/12).
- 15:46:22Z canary grade: **PASS 90 of 90** (`_inbox/2026-09-18_ldt_canary_compare.json`); intended
  differences p270-vintage 74, p322-ag 29, p257-pud 6; nothing else moved.
- 15:49Z `shift-traffic` dispatched (run 35364723464): job conclusion `failure`. Read by field
  immediately after: **`cortex-api-00841-jeh` at 100 percent** (tag `canary`); `00824-qay` holds only
  the `staging` tag. Production `/api/healthz` 200. The failed step is the post-shift P-279 check,
  and it never ran: `Error: Cannot find module .../scripts/check-tagged-revision-env.mjs`. The
  `shift-traffic` job has no `actions/checkout` step (only auth and setup-gcloud), so the script is
  never present there; node exits 1 on a missing module, and the step's wrapper maps exit 1 to
  "RESULT=violation". A check that could not run reported a violation. Carded as **P-362**.
- 15:52Z the check done by hand, by field: every tagged revision (`00824-qay` staging, `00819-wug`
  p249-f816c21, `00811-nux` keyrot) carries exactly the serving revision's 67 env and secret names;
  none missing, none extra. **No P-279 violation.** (The LDT script itself refused honestly on this
  Windows host, `SERVICE_DESCRIBE_FAILED`, because it `execFileSync`s `gcloud`, a `.cmd` shim.)
- 15:54Z customer path: `POST smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope`
  for 1109 Pecan St, Bastrop answers `ok` for `48021:34049` with P-270's new `citationEffectiveDate`
  `2026-04-14`, so the new revision serves the customer surface. Lease file deleted after the read.

## Result

cortex-api `00841-jeh` (LDT `25d1782f`) serves 100 percent, carrying P-257, P-270, P-322, P-273 and
P-279. The canary moved exactly the intended classes on 90 of 90 comparisons. Rollback handle
`cortex-api-00824-qay` (still tagged `staging`). Every LDT half named in the register (P-257, P-270,
P-322) is now on the customer surface; P-206 already was.
