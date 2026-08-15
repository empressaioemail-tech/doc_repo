---
title: Session close — the drain program, the control plane, and the rearchitecture verdict
date: 2026-08-15
type: session
agent: doc_repo planner (claude code)
status: session close
span: 2026-08-12 orientation through 2026-08-15 morning
---

# Session capture: 2026-08-12 to 2026-08-15

## The one-line

The launch program went from unpriced to fully measured (ledger 406 to 616+ satisfied, DC scoreboard
9-of-13 with zero instrument noise, DC-6 priced at 86 staged cities / 291,475 rows), the control plane
became compiled-and-hooked (contract, dispatch compiler, plan registry, lease, watchdog), roughly 50M
atoms landed or were remediated at zero verifyFailures, and then the operator ruled the drain's
per-county-process architecture DEAD after three multi-hour stalls in 36 hours. The drain is PAUSED
with all state banked; L25 (fresh-eyes rearchitecture, compiled dispatch ready) decides the new
machinery via a measured pilot before anything restarts.

## What landed (accepted closes, all verified at source)

L1 (SD true-geometry rebuild; plan 408x, drain 1,397/s; CLOSED_PARTIAL with 81 named residue),
L16 legs 0-2 + mud scorer (residue cleared 253/253; rail 254/254 = 13.1M atoms; Harris parcel-node
7.02M; mud 134P+75A+45), L2 (Factory 1.5 front half, verification set), L20 (factory repaired after a
FAIL_STOP pilot caught projection/OID/identification defects; 497-city fan; DC-6 PRICE: 86 footprint
cities staged / 291,475 rows / 22-28 counties touched; repairs merged eng #343), L3/L7 (taxonomy,
honest absence REAL: satisfiedAbsentCells 0 to 76), L8 (DC-10 FAIL to PASS, block13 7/7, workflow
created), L13 (limiter restored, DC-11a provable), L14 (utility deep research: 24/30 flips, Austin
315k mains public), L17/L21 (vintage discipline + crosswalk + named fallbacks; Tarrant AND Dallas
flipped with cross-repo parity eng #341/#342, ldt #426/#428/#429), L18 (ledger materialize-on-write,
computedAt/servedAt, STALE pill proven by backdate; CC manifest is the customer-done probe), L19
(DC-11b/c; DC-11d domain), L22 (utility who-serves staged, 87 additive TCEQ after geometry-verified
dedup; PR #427), L23 (gate harness: scripts/gate-grade.mjs; DC-1 card defect found+corrected A-016),
L24 (flood plan NDJSONs; planner finished metros: 82/83 banked, Harris owed), L11/L12 (18-cell delta
attributed as instrument mismatch; OZ branch merged #423, 0.74 fixture dead), P-25 full loads
(Tarrant 884k + Dallas 807k rows), smartsite.cloud live on Vercel with TLS.

## The control plane built this session

OPS-16 plan of record (frozen baseline + amendments A-000..A-016) and its govtech sibling OPS-17;
AGENT_CONTRACT.md + DEV_PROCESS.md compiled into every dispatch by scripts/dispatch.mjs; plan
registry (_catalog/plan_registry.json) shared by compiler and canon-gate hook (M4/M5) after the G0
audit found CTRL-1/2; the DB-enforced writer lease (rogue class structurally dead — proven when a
lost agent's THIRD resurrection wrote 28M contaminated atoms the day before the lease landed, and
nothing since); the stall watchdog (scripts/stall-watchdog.mjs + _catalog/watch_registry.json,
progress-staleness with wake-the-planner semantics); the interrupt template; gate grading as a button.

## The architecture verdict (why the drain is paused)

Three multi-hour stalls in 36h, all 0-CPU dead-waits in plan/read phases: L16 Brazoria 7.5h silent
(heartbeat died with the agent); L16B Brazoria 8h CHATTY (touch-loop kept liveness green while its
own killAtMs was exceeded 3.3x and the kill never fired — an enforcement path in the never-fires
class); Harris flood plan starved twice under concurrent parcel reads. The writing itself is proven
(1,400-2,043 atoms/s); the supervision keeps failing. Operator ruled: rearchitect. L25 dispatch
(_dispatches/2026-08-15_l25_dispatch.md) carries hypotheses H1-H4 — the big one is set-based
server-side drains (plans are already materialized NDJSON payloads; COPY + INSERT...SELECT makes a
county seconds, not a supervised process) — with a pilot-before-migration bar.

## Owed / open at close (the next planner's pickup list)

1. SEAT L25; grant its pilot a lease window (the old lease lapsed when the orphan heartbeat was
   killed at close). Do not restart the per-county runners unless L25 refutes H1.
2. Harris 48201 flood plan — owed, needs a quiet window (starved twice; five other metros banked).
3. Brazoria 48039 pipelines diagnosis (skipped-with-reason; suspect eng #335 TEMP+GiST class).
4. CTRL-3 ruling still open with the operator (amendment mentions granting dispatchable rows).
5. Gate residue: DC-2 (Ector re-key), DC-3 (the remaining drains + scorers), DC-6/8 (zoning drain of
   86 staged cities + rural honest-absence rulings + envelope); DC-13 at grading. Harness:
   node scripts/gate-grade.mjs.
6. Dallas-side P-25 recon for Bexar/Travis/Collin/Denton (pattern proven, recon owed).
7. Doc scrub post-launch; spine handoff delivered to the govtech planner
   (_inbox/2026-08-14_spine_unification_handoff.md).

## Lessons with teeth (each cost real hours)

Budgets bound WALL TIME, never silence — a chatty touch-loop must not extend a county's life. Kill
switches are gating indicators: prove they fire with a synthetic hung child. Liveness is WORK
(CPU/rows), never file-touches. Monitoring must outlive the agent (detached processes; the watchdog
wakes the planner, never expires silently). One custodian does not mean one connection. Instrument
corrections (DC-1, DC-11a) are amendments, not embarrassments. A stale $TMPDIR file nearly reported a
211-cell regression; a self-matching process query stalled a night of flood plans; the same class bit
the planner's own tooling twice — exclude your own reflection.
