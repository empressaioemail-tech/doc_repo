---
id: 2026-09-13_ops23_checkpoint_5
title: OPS-23 wave 5 — dispatch planner checkpoint (mid-wave handoff, forced by a model switch)
date: 2026-09-13
status: active
---

# OPS-23 wave 5 checkpoint — mid-wave handoff

**Why this checkpoint exists now, off-cycle:** the operator is switching models/sessions
mid-wave. This is being written in place of "after the second close" (which had already been
satisfied — p167-strings and p179-gate had both closed) specifically so a successor can resume
cold. All four running lane sub-agents (p152-siblings, p180-hays-cells, p167-strings,
p155-refresh) were killed mid-task by the same event simultaneously: `HTTP 429 rate_limit,
You've hit your monthly spend limit`. None of them crashed from a bug in their own work; they
were cut off mid-turn. Their state on disk is whatever they had written immediately before that
— read it as "paused," not "failed."

## Snapshot

- doc_repo HEAD (dispatch-planner worktree, `P:/seat-worktrees/dispatch-planner/doc_repo`,
  branch `seat/dispatch-planner`): `c2d5cda0` — "decision(P-179): amended to option 1, the
  engine gate is armed from the key its four callers already send; no new secret this wave
  (A-144)". Fetch and `merge --ff-only origin/main` before doing anything, per every dispatch's
  own first-three-commands rule — the overseer may have moved further since.
- planRows this wave: `P-152, P-167, P-179, P-180, P-155` (P-155 added mid-wave by an overseer
  addendum at commit `c2d5cda0`, F23).
- Wave CP1: `_inbox/2026-09-13_ops23-wave5_cp1.json` (pre-registered falsifiers for all five
  lanes, baseline probe, the ops23-lane-status.mjs P-179/P-180 row-list gap already logged as
  the first error-log entry).
- **Known instrument gap (do not re-discover this):** `scripts/ops23-lane-status.mjs`'s
  hardcoded ROWS table only covers P-151..P-167; it has NO entries at all for P-179 or P-180
  (and now P-155 either). The seat register itself is fine. Not this wave's mission to fix;
  already flagged as a leave_behind for the overseer. Don't rely on that script's output for
  these three rows — check `_catalog/seat_register.json` and each lane's own `_inbox/` files by
  hand instead.

## Lane-by-lane state (this is the important part)

### p179-gate — CLOSED (closed-partial). Fully done. No action needed.
Engine's bearer check is armed on `hauska-engine-api` (now revision `hauska-engine-api-00219-huf`,
100% traffic) sourced from the **existing** `HAUSKA_ENGINE_API_KEY` secret — no new secret was
minted, per the operator's amendment at `c2d5cda0` to
`_decisions/2026-09-13_engine_gate_token_minted_and_mounted.md`. I independently re-verified
this live myself (not just trusting the lane): `gcloud run services describe` confirmed the
secret mount and that IAM invoker is still `allUsers` (step 4 untouched, as required); a direct
`curl` against the real URL (`https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app`) with no bearer
token returned `401 {"error":"unauthorized"}` on a gated route while `/health` stayed `200`.
Files: `_inbox/2026-09-13_p179-gate_cp1.json`, `_cp2.json`, `_close.json`. Both worktrees
(`hauska-engine-p179-gate`, `legacy-design-tools-p179-gate`) are clean with zero commits and
left standing in case step 4 (removing `allUsers`, IAM/ingress) is picked up as its own future
go — that step still needs its own separate operator approval, not covered by anything above.

### p180-hays-cells — PAUSED, HOLDING ON ME, DO NOT LET A SUCCESSOR APPROVE PRODUCTION WRITE YET.
**This is the most consequential open item.** The lane redirected the mission's writer target
correctly (from a permanently-frozen hauska-engine script to hauska-factory's
`factory-parcel-record-fill` / `src/jobs/parcel-record-fill.mjs` — see
`_inbox/2026-09-13_p180-hays-cells_cp1.json`), built and tested a crosswalk fix (84/84 tests
passing, reuses `SEED_BLOCKED_FIPS`), live-verified the fix's SQL against production read-only
and got an exact match to P-177's own known-good values for all five Sturgeon nodes (see
`_inbox/2026-09-13_p180-hays-cells_cp2.json`). I approved step 3 scoped to **Hays (48209) only**;
**Williamson (48491) is explicitly held back** — its `geo_id` is 100% blank in production
(0/304,298), so the crosswalk would resolve nothing there, AND the lane found live evidence the
county's *existing* bare-number join is actually ~99.998% owner-correct there (282,569 nodes) —
applying this fix to Williamson would silently convert a large, currently-correct population to
absence. Do not approve Williamson this wave; it's a real leave_behind for a future row, not a
quick yes.

The lane then reported it had a PR merged (`610204b8f`, per its message) and an image deployed,
ran a **dry run** (read-only against live production data, 115,033/116,420 resolved, zero
errors) showing exactly the expected before/after values, and asked to proceed straight to
`--apply` against **production**. **I explicitly withheld approval and it was killed before
responding**, because: the CANON-PREAMBLE's factory rule is general and explicit — "every
publish lands on staging before the identical job runs on production" (see P-177's own close for
what a real staging-then-production pair looks like: distinct execution ids on each). The lane's
report only showed a dry run, not a real staging-environment execution. **Before authorizing
`--apply` against production**, a successor must get the lane (or verify directly) to confirm
whether `factory-parcel-record-fill` has a real staging target distinct from production, and if
so, get a real staging run + its result first. If it turns out this specific job genuinely has
no staging store (some factory jobs may be read/fill-only, not part of the publish pipeline),
that needs to be confirmed by evidence (job config, cloudbuild yaml), not assumed, before
proceeding straight to production on 116,420 rows with no mentioned rollback. My last message to
the lane (unanswered) asked exactly this. Files: `_inbox/2026-09-13_p180-hays-cells_cp1.json`,
`_cp2.json`. No close yet. No lease currently held for this (data job, not a traffic-shifted
service — the cortex-api lease it will need for step 4, lifting LDT PR #671's hold, comes later
and is separate from this question).

### p152-siblings — PAUSED, likely mid-deploy, needs a state check first.
CP1 was clean (no premise contradiction, straightforward slate/panel work across three repos).
I approved, in order: (1) an **urgent** retrieval-api deploy for a live-production wrong-data
bug the lane found unprompted while resyncing (stale Hays dollar-rail slate entries serving
wrong owner data on real vacant lots, already fixed as a pure removal in PR #439, merged) — that
should have already happened; (2) merging legacy-design-tools PR #678 (the five representative-
key siblings + nine acreage pairs, per Ruling A-140) and deploying cortex-api. It took the
`cortex-api` lease at `2026-09-13T23:20:00Z` (expires `2026-09-14T00:20:00Z` — **check whether
that's already past by the time you read this**; see `_catalog/leases/cortex-api.json`, still
present/unreleased as of this checkpoint). Its last live message before being killed was "All
passing. Pushing and waiting for CI to re-run." — meaning PR #678 was pushed and CI was in
flight, outcome unknown. **First thing a successor should do**: check `gh pr view 678 --repo
<legacy-design-tools>` for merge state and CI conclusion, check whether retrieval-api and
cortex-api actually deployed (revision by field name via `gcloud run services describe`), and
either resume this lane or verify/finish the remaining steps directly. Its own worktrees:
`hauska-engine-p152-siblings`, `legacy-design-tools-p152-siblings`, `hauska-map-p152-siblings`.
File: `_inbox/2026-09-13_p152-siblings_cp1.json`. No CP2/close yet.

### p167-strings — PAUSED mid-followup, likely mid-deploy, needs a state check first.
Its **original** mission (atom-contract 1.34.0 publish with the `no-zoning-stamp` token,
hauska-engine PDF-label fix, hauska-map `zoningProvenance` wire) is **already closed**
(closed-partial) — see `_inbox/2026-09-13_p167-strings_close.json` — that part is done, don't
redo it. What's in flight is a **follow-up** I assigned after an overseer addendum found the
mission's LDT half was missing entirely: bump every `legacy-design-tools` importer of
`@empressaio/atom-contract` to `^1.34.0`, re-resolve the lockfile, in the **existing** wave-4
worktree `legacy-design-tools-p167-pdf` (reused deliberately, not a new p167-strings LDT
worktree), merge, then redeploy `smartsite-mcp`. It also had a real stall I caught and corrected
mid-wave — it ended a turn "waiting for the background CI poll to complete" (the exact named
anti-pattern from wave 2); I told it to poll actively and boundedly instead, and it acknowledged
("I'll run an active, bounded, foreground poll now") right before being killed. It took the
`smartsite-mcp` lease at `2026-09-13T23:14:27Z` (expires `2026-09-14T00:14:27Z` — **check if
already past**; see `_catalog/leases/smartsite-mcp.json`, still present/unreleased). PR #679 (the
`^1.34.0` bump) was in flight, merge/CI outcome unknown at kill time. **First thing a successor
should do**: same as p152-siblings — check `gh pr view 679`, check smartsite-mcp's serving
revision by field, then either resume the lane or finish directly (re-run the P-167 observations
+ surface-probe once the deploy is confirmed). File: `_inbox/2026-09-13_p167-strings_cp1.json`,
`_cp2.json`, `_close.json` (all from the original, already-closed mission — no updated close yet
for the LDT followup).

### p155-refresh — PAUSED mid-fix, no close yet.
New lane, added by the same overseer addendum as above (F23: `export_instrument` feasibility
returns byte-identical stale PDFs). CP1 (`_inbox/2026-09-13_p155-refresh_cp1.json`) is thorough
and the root cause is confirmed, not speculative: the bug is entirely client-side, in
`legacy-design-tools/artifacts/smartsite-mcp/src/feasibility-export.ts`'s
`executeFeasibilityExport` — it only calls `POST refresh` when a job is `never-requested` or
`failed`; a `ready` job (no TTL, ever) is served forever regardless of age. The engine's own
refresh route is confirmed NOT buggy (verified by code read + live production log lines pasted
in CP1). Chosen fix (with one rejected alternative recorded, per DEV_PROCESS): make the MCP
client also refresh a `ready` job when it's staler than a 15-minute bound (well above the
worst observed real composition time, ~10.5 min), plus surface `generatedAt` on the wire (an
`X-Feasibility-Generated-At` header on the engine's download route, read by the MCP). Its last
live message was "Now the engine-side addition — the X-Feasibility-Generated-At header on the
download route" — meaning the client-side MCP fix was likely already written and it had moved to
the engine-side header addition when killed. **First thing a successor should do**: open
`legacy-design-tools-p155-refresh` and `hauska-engine-p155-refresh` worktrees and read `git
status`/`git diff` to see exactly how far the code got, then continue from there — do not
restart the investigation, CP1 already has everything needed. No lease taken yet (no deploy
attempted yet as of last contact).

## Rulings taken since the last checkpoint (wave-4's CP2/close)

- A-144 / commit `c2d5cda0`: p179-gate proceeds on **option 1** (mount from the existing
  `HAUSKA_ENGINE_API_KEY` secret, no new secret), amending the original `33b7f27d` approval,
  after this lane's CP1 found the original approval was granted against an incomplete caller
  picture (missed `hauska-mcp-server` and hauska-map's property-explorer BFF entirely). I
  escalated this correction to the operator rather than picking between options myself, since it
  was a live production auth-architecture call with real blast radius.
- Overseer addendum at `c2d5cda0` (unnumbered in this doc, recorded in
  `_inbox/2026-09-13_ops23-wave5_cp1.json`'s `p167LdtFollowup`/added lane fields): p167-strings'
  LDT half was an overseer compile-time omission (now being fixed, see above); new lane
  p155-refresh added for F23; P-155 added to this wave's `planRows`.

## Errors log (this wave, in addition to the CP1 instrument gap already on file)

- p180-hays-cells: the dispatch's own "where you work" / "what is true today" named the wrong
  writer (hauska-engine's frozen `cad-parcel-roll` script) — caught and corrected at CP1, before
  any code, by the lane itself. Recorded as a contradicted finding in that lane's own files, not
  a silent deviation.
- p180-hays-cells: its own CP1 `williamsonCaveat` ("a documented no-op... inert") was itself
  superseded by CP2's live measurement — inert-to-the-crosswalk does not mean inert-to-the-CHANGE
  when the change would also delete a large, currently-good population. Caught by the same lane,
  one checkpoint later, before touching Williamson.
- p179-gate: the ORIGINAL operator approval (`33b7f27d`) undercounted live callers (2 named,
  4 real) — caught at CP1, escalated, amended before any mint/mount was attempted.
- p167-strings: stalled passively on "waiting for background CI" — the named wave-2 anti-pattern,
  recurring. Caught and corrected by me live; worth naming again in the wave close so it's
  tracked as a recurring class, not a one-off.

## Baseline probe (start of wave, still the last one I ran wave-wide)

`_inbox/2026-09-13_203841_surface_probe.json` — `node scripts/surface-probe.mjs --rows
P-152,P-167,P-175 --observations _inbox/2026-09-13_p152-slate_mcp_observations.json
--allow-unmeasured`: PASS 3, FAIL 7, UNMEASURED 5. No wave-wide re-run since — each lane has been
citing its own fresher artifact for its own row (p167-strings: `_inbox/2026-09-13_215403_surface_probe.json`,
PASS 0 FAIL 5, closed-partial for real named reasons). **A successor should re-run the full
wave-wide probe once the paused lanes' deploys are confirmed one way or another**, since
p152-siblings' and p180-hays-cells' work, if it landed, should move P-152/P-175 off their current
FAILs.

## Next three (in priority order)

1. **Do not approve p180-hays-cells's production `--apply`** until the staging-environment
   question is answered (see above) — this is the single highest-consequence open decision, a
   116,420-row live overwrite. Resume that lane (`af4f33f32745c30c9` was its background agent id
   under the previous session; a fresh session should just re-open its worktree and pick up the
   question directly) or verify the staging-target question yourself first.
2. **Reconcile p152-siblings and p167-strings' in-flight deploys.** Both took leases
   (`cortex-api`, expires ~00:20Z; `smartsite-mcp`, expires ~00:14Z) and were killed mid-PR/CI.
   Check PR #678 and PR #679's real state via `gh pr view`, check the actual serving revisions by
   field name via `gcloud`, and either the leases are stale (deploy finished, lane just didn't
   get to delete the file — delete it yourself once confirmed) or the deploys never completed
   (in which case resume or finish them, and only then release).
3. **Check on p155-refresh's code state directly** (`git status`/`git diff` in its two
   worktrees) and continue the engine-side header addition it was mid-way through when killed;
   CP1 has the full design, nothing needs re-deriving.

Once those three are resolved: re-run the wave-wide surface probe, get closes from whichever
lanes haven't closed yet (p152-siblings, p180-hays-cells, p155-refresh, plus p167-strings'
follow-up needs its own close/addendum), and write the wave-level CLOSE at
`_inbox/2026-09-13_ops23-wave5_close.json` naming all five rows in `planRows` per the skeleton in
the original dispatch (`_dispatches/2026-09-13_ops23-wave5_dispatch.md`).
