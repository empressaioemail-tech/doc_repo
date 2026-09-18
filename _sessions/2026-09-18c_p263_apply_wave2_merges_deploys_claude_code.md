---
id: 2026-09-18c_p263_apply_wave2_merges_deploys_claude_code
title: "Session: P-263 applied in five counties, Williamson held for P-365; ten Wave 2 PRs merged; Property Explorer and cortex-api deployed"
date: 2026-09-18
last_updated: 2026-09-18
kind: session
session_type: integration
status: checkpoint (commit batch presented to the operator; the session may continue)
agent: claude_code
repo: doc_repo
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-18c_HANDOFF_integration_seat.md (consumed)
  - _inbox/2026-09-18_p263_apply_RECORD.md (written)
  - _inbox/2026-09-18_wave2_merges_RECORD.md (written)
  - _inbox/2026-09-18_wave2_deploys_RECORD.md (written)
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md and _inbox/2026-09-16_texas_scaleup_ROADMAP.md (updated)
  - 90_operations/OPS-16_texas_market_plan_of_record.md (P-365, A-225)
snapshot: doc_repo main d8c78117 at open, 9da9a59c at this checkpoint (the SmartCity planner's commits; this session has not committed); product mains at checkpoint map b08f4b89, factory 6f422f6c, LDT 2e7ca7c4, engine cff8d882; read 2026-09-18 21:55Z
---

# Session: P-263's apply, the Wave 2 PR queue, two deploys

## What the session did

**P-263 applied in five of six counties.** No job could run the apply at open. Built an engine
image at `c41a1482` with a build-and-push-only config (the repo's atoms-writer config also redeploys
`factory-atoms-cad`), created `hauska-engine-p263-apply` with one secret (`SUBSTRATE_DATABASE_URL`),
and verified it by violation. The store host was held by lanes for about 90 minutes; a take loop won
the heavy-scan window. Six fresh dry runs reproduced the lane's 13:12Z buckets and digests exactly.
Travis, Caldwell, Bastrop, Hays and McLennan were applied one at a time, 220,260 atoms, each at its
exact measured share (the handoff's rounded shares would have refused every county) and McLennan on
its printed token. Each county was read back from the store (journal equals the dry run, every stored
hash equals the after-hash, one lease holder) and its reversal named before the next. The 30,434
withheld atoms are untouched. Record `_inbox/2026-09-18_p263_apply_RECORD.md`.

**Williamson held by the operator.** The apply takes its 15-minute write lease once and never renews
it; Williamson's writes take about 32 minutes. Asked, the operator chose the proper control first.
**P-365** carded and compiled (A-225); OPS-24's span extended to 365 in the registry and the probe
gate together, checked both ways.

**Ten PRs merged**, each diff read, each re-greened against the base it merged into: map #421 to
#424, factory #183 to #185, LDT #720 to #722, engine #476. Findings recorded per row, none blocking.
Record `_inbox/2026-09-18_wave2_merges_RECORD.md`.

**Two deploys.** Property Explorer `fohg2os70`: Vercel held it STAGED through its own incident, then
promoted it; graded live, P-353, P-341 and P-339's map half PASS, P-270's ZIP served and its city not
(the situs rails serve `legacy-transitional`). cortex-api `00843-yir`: canary 93 of 93 identical,
shifted; P-362 customer-closed on the shift's own post-shift step. Record
`_inbox/2026-09-18_wave2_deploys_RECORD.md`.

**Also:** P-270's probe patch repaired (BOM, CRLF and mojibake) and applied, verified by violation;
closes and artifacts for seven lanes copied to `_inbox`, verified identical.

## Decisions

A-225 (operator): Williamson's P-263 apply waits for P-365.

## Self-corrections in session

- Guessed a full commit SHA for `--match-head-commit`; the merge guard refused it. Used the real one.
- Counted canary differences from a guessed field name, which read zero vacuously; rebuilt the count
  as a file that refuses when the field is absent.
- A memory-index command with a `python3 ||` fallback hung on the Windows Store stub; redone with Edit.

## Open at checkpoint

Lane closes owed: P-333, P-352, P-361 (with engine #474), P-363, P-351, P-359, P-365. Not fired:
P-324, the P-300/P-338 halves, P-331, P-286/P-317. Needs a dispatch: P-339's MCP half and P-340;
P-270's city half (a card). Owed by the seat: Williamson after P-365; the factory publish rebuild
(carries P-325, P-327, P-335, P-334) after P-351 moves the pin; engine-api deploy for P-358 after
P-336; the signed-in probe run (operator sign-in, ruling 9) for P-205, P-270's MCP label and the
customer leg.
