---
id: 2026-09-17c_HANDOFF_integration_seat
title: Handoff to a fresh integration-seat planner, 2026-09-17 evening
date: 2026-09-17
last_updated: 2026-09-17
status: CONSUMED 2026-09-17 (superseded by _inbox/2026-09-17d_HANDOFF_integration_seat.md)
kind: handoff
owner: nick
from: integration seat, session after 06a91261 (operator-called close, 2026-09-17 about 20:30Z)
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (the live state and the queue; read it second)
  - _sessions/2026-09-17b_phase0_applies_and_serving_claude_code.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-207 to A-211; rows P-306 to P-318)
  - _inbox/2026-09-17b_HANDOFF_integration_seat.md (consumed; its traps still apply)
snapshot: doc_repo main at the close commit; engine 3809275f (retrieval 00100-hut, engine-api 00251-qed); LDT 7219b707 (cortex 00824-qay); map 0489bc85 (Property Explorer mfesp954e); factory d2e6cb03 (publish 9760ff71, gate 28066cef, control 00010-hax)
---

# Handoff: the integration seat, 2026-09-17 evening

You are the integration seat in `P:/doc_repo` on `main`. You plan, review, merge, deploy and grade;
lanes build; the operator fires the dispatches you compile. You are the only planning session. Work
in active program management mode: drive, decide, report. Commit only after showing the operator the
batch, and **commit and push a dispatch before it is handed to a lane** — a lane reads `origin/main`,
not your working tree.

## Read first

1. `CLAUDE.md`, `ENFORCEMENT.md` and your memory index.
2. `_inbox/2026-09-16_texas_scaleup_ROADMAP.md`. It carries the live services with rollback targets,
   what is in flight, the ordered queue and what each side owes. Update it whenever a row changes
   state, with a change-log line, and take timestamps from `date -u`.
3. OPS-16 amendments **A-207 to A-211** and rows **P-306 to P-318**.

## 0. Two things happened after this handoff was first written. Read these first.

**Williamson's production publish emptied the county, and the county has been restored.** Run
`7b2540c8` retired all 602,050 served tier-1 rows for 48491, including 319,480 that were live,
because the parcel index is R-keyed and the served nodes are numeric-keyed. The rows were copied
back from a Neon point-in-time branch and verified on the customer surface at 20:59Z. Full record:
`_inbox/2026-09-17_williamson_mass_retirement_INCIDENT.md`. **A-190 is NOT complete for Williamson,
and no production publish of 48491 may run until P-319 ships.** Two leave-behinds are yours: the
PITR branch `br-late-rain-apffmnp2` (delete after 48491 republishes successfully; it is the only
copy of the pre-incident payloads) and the `dblink` extension created on production (drop it unless
a lane needs it, and say which).

**Cotality is off the critical path** (A-212, `_decisions/2026-09-17_ship_without_cotality.md`).
About two weeks out; struck from the Phase 0 exit; P-267 and P-283 deferred to Phase 1; P-322 ships
the affected rails as declared, labelled absences. Do not let a row sit idle naming the vendor.

Two dispatches are compiled and committed, ready to fire:
`_dispatches/2026-09-17_p319-retirement-safety_dispatch.md` (P-319, P-320, P-321 — the highest
priority lane in the program) and `_dispatches/2026-09-17_p322-cotality-declared-absences_dispatch.md`.

**One trap this surfaced:** the canon preamble carried "COTALITY IS EXTINGUISHED", a third and wrong
vendor state, because `_state/shared/STANDING_DECISIONS.md` held it and every regeneration of
`_STATE.md` propagated it into every compiled dispatch. The source is fixed and the preamble hash is
now `v0d6978dd`. **The six dispatches fired earlier on 2026-09-17 carry the wrong line**; if one of
those lanes touches vendor-sourced data, correct it in the lane rather than assuming it read canon.

## 1. Finish what is mid-flight

1. ~~Grade Williamson's production publish~~ — **done, and it failed destructively. See section 0.**
   What remains: fire the P-319 lane, ship it, and only then republish 48491 and complete A-190.
2. **Migration 0103**, then the Austin stamp. **The retry loop was STOPPED at 20:49Z** because it
   took the production lease every three minutes, applied nothing, and blocked the Williamson
   recovery's first attempt. Restart it by hand now that the store is quiet:
   `bash P:/tmp/integration-handoff/p259b-0103-retry.sh`. Each attempt takes the production lease, hits
   a 15 s lock timeout behind a long reader, and rolls back whole. Nothing is applied. Do not
   lengthen that lock timeout: a queued ALTER blocks every new reader behind it. Backfill
   population, measured: 1,184,897 rows. After 0103, run the Austin stamp as a session CLI under a
   production lease (P-296's lane established that path at source), then re-run the P-255 census.
3. **The gate and the completeness check.** The verdict table predates today's applies (the 19:00Z
   run finished at 19:31Z; the 20:00Z run was still going at close). Run the gate scheduler once by
   hand, then `FACTORY_DATABASE_URL_RO=... node scripts/six-county-completeness.mjs` and read it
   against the pre-apply baseline.
4. **P-294**: create its schedule without enabling it, run one dry cycle, grade it.

## 2. Six lanes are running (the operator reports their closes)

Card truth (P-270, P-272, P-291; map + LDT), Williamson identity (P-271), setbacks and envelopes
(P-260, P-263; engine, and P-263's apply is a dry run whose counts go to the operator), controls
(P-273, P-274; three repos), tagged revisions (P-279), Burnet (P-286, P-287). Their dispatches are
in `_dispatches/2026-09-17_*`. Closes land in the lane's own doc_repo worktree, the dispatch-planner
worktree, `P:/doc_repo` or `C:/Users/cente/doc_repo`; search named paths, and copy what you use into
`P:/doc_repo/_inbox`.

## 3. Traps measured today, on top of the earlier handoff's list

- **A dispatch must be committed and pushed before it is fired.** P-318's lane could not find its
  own dispatch.
- **The engine-api export gate takes specific values**, not any plausible ones:
  `x-hauska-product: cortex`, `x-hauska-tenant-id: public-catalog`,
  `x-hauska-gate-credential-id: property-explorer-feasibility-bff`,
  `x-hauska-access-tier: public-paid`, plus a Bearer of `HAUSKA_ENGINE_API_KEY`. Anything else is a
  401 that looks like a gate refusal and is your own error. The values are in P-254's
  `scripts/surface-probe.mjs`.
- **engine-api now serves a PINNED revision, not LATEST.** The next deploy there must shift traffic
  explicitly.
- **A traffic shift needs its lease file written in a separate call before the shift command**; the
  hook inspects the command string.
- **node resolves `/p/tmp` against the current drive.** Use `P:/tmp/...` inside node, `/p/tmp` in
  bash.
- **Heredocs in this shell eat backslashes**; write regex-heavy scripts with the Write tool.
- **A publish holds the production store's lease and its table locks for its whole run**, so every
  writer, migration and census queues behind it. Plan the order rather than fighting it.
- **`git pull --rebase` refuses on a dirty tree**; use `--autostash` (other seats leave files there).

## 4. Owed by the operator

An OAuth token (`SURFACE_PROBE_MCP_TOKEN`) for P-254's MCP leg, which turns 28 UNMEASURED buckets
into decided ones. The go on P-263's apply. P-278's credential rotation before Burnet. Cotality
(P-267, P-283). The P-243/P-244a account check. The first automated production run of P-294. And a
decision on the uncommitted `_STATE.md` / `STANDING_DECISIONS.md` edit, which still predates the
09-16 Cotality ruling.

## 5. Known open defects worth your attention

P-254 measured 11 OPEN, 5 CLOSED and 7 UNMEASURED of the 23 XD/X defects; the list with populations
is in `_inbox/2026-09-17_p254-customer-leg-probe_close.json`. P-317 blocks any county's first-ever
publish and is a Burnet precondition. The Hays join-miss delta (2,770 cells applied against 1,069
measured) must be read before P-308's factory re-vendor retires the job-level step.

## Starter prompt for the fresh session

"You are the integration seat in P:/doc_repo. Read _inbox/2026-09-17c_HANDOFF_integration_seat.md
and do what it says: grade Williamson's production publish, land 0103 and the Austin stamp, re-run
the gate and the completeness check, then handle the six lane closes as I report them."
