---
date: 2026-09-11
agent: planner
repo: docs
session_type: execution
memory_graded: none
rolled_up: false
snapshot: >
  doc_repo main, opened at 7da933b9, committed 4c8d18ef (OPS-23 opened) and closed on top of
  1e174bcc (an accidental test commit, see errors). Integration seat, P:/doc_repo, branch main.
  Read-only against origin/main of hauska-map fb41c05, legacy-design-tools 489f428c,
  hauska-engine 79fa573, hauska-factory 217b7dd. Production probed live: smartsite.cloud,
  cortex-api via the PE proxy, hauska-engine-api-00198-cir logs, Bastrop County FeatureServer.
---

# OPS-23: the ledger as the serving path, and the instrument that measures the surfaces

Successor to `2026-09-11_ops21_goal_met_five_counties_claude_code.md`. The operator opened with
the OPS-21 close, a screenshot of 1109 Pecan St with no setbacks drawn on the map, and the
feasibility PDF for the same parcel, and asked why. The session ran diagnosis by live probe,
took seven operator rulings, opened OPS-23, amended ADR-031, and built the first instrument
that measures the customer surfaces instead of the stores behind them.

## What was done

**Diagnosis, at source, one parcel through every surface.** `48021:34049`: the map refuses a
polygon its own endpoint returns (Ruling B, hauska-map `cca2964`); five producers of setbacks
disagree as `present` (25/5/25/15 on the panel and PDF, 30/10/30/20 on the endpoint, ledger and
MCP); four buildable figures across surfaces and two inside one PDF whose headline sentence is
arithmetically false; the panel reads hauska-map's own atom-chain adapter (bakedAt 2026-08-05)
so OPS-21's record-served setbacks reach `get_smart_site` and never the browser. Then Travis:
`48453:113408` renders three of fourteen facts because placement depended on a geocoder that
misses the address with or without the city while the record carries its own point;
`48453:474034` is unincorporated and the panel hides that behind "not zoned or not stamped";
the feasibility engine finishes Travis refreshes in 85 to 154 s with 201 while both clients
abort at 55 s and blame a cold start. Full table with instruments: OPS-23 §2, F1 to F15.

**Seven operator rulings, each with a record and reversal criteria.** Most-current source
wins for every dimensional rule; Ruling B reversed for the polygon only; cities are the unit;
the customer surface is the completion predicate; overseer / dispatch planner / lane topology
(proposed, active on go); the cached rendering; and the one that reframed the program: **the
ledger is the serving path and atoms are canonical** (`_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`,
ADR-031 amendment 2026-09-11). Node is identity, atom is one claim, edge is an atom whose value
is a node; a cell is accounting with a pointer and a cached rendering, never a copied value;
one reader in `hauska-engine/services/retrieval-api`; one writer; one vocabulary in the
atom-contract package. The planner proposed cells-as-canonical with projected atoms and the
operator rejected it as inverting the thesis; the projection survives only as the backfill
mechanism.

**OPS-23 opened** (`90_operations/OPS-23_surface_completion_program.md`), written so a fresh
planner can pick it up cold: findings with instruments, rulings, the seven steps, seventeen rows
(OPS-16 A-128, A-129), the probe set, the swap protocol, the error log. Commit `4c8d18ef`.

**Two dispatches compiled and hand-carry ready**: P-151 SEAM (placement from the record point
and the click, never geocoding; unincorporated named as a finding; the cortex point route
bounded) and P-153 DRAW (the polygon on the map and in the MCP draw block, the figure refused,
eleven-file blast radius enumerated). Four worktrees registered.

**P-160 built and closed partial.** `scripts/surface-probe.mjs` (predicates for P-151, P-152,
P-153; findings WRONG-PARCEL, FIGURE-IN-PAYLOAD, NO-CONTAINING-POLYGON, ID-SCHEME-MISMATCH;
self-test both directions with a not-vacuous check, 18 of 18), eleven committed fixtures with a
manifest, `scripts/ops23-lane-status.mjs`, and `probe-close-gate` (rules in
`scripts/enforcement/`, hook in `.claude/hooks/`, registered on the Bash matcher, 12 of 12
self-test). Four live runs; the 2026-09-11 baseline is PASS 0, FAIL 0, UNMEASURED 9.

**Dispatch preambles scoped by program (P-168, A-131).** The operator read the compiled P-151
dispatch and asked for the preambles to cover the program's scope; nineteen of twenty-six
shared-preamble lines were Dashboards and Factory law, the 2026-09-10 problem 6 that was
recommended and never rowed. Fixed as data plus two controls: the shared file keeps ten
fleet-wide bullets; fifteen Dashboards rulings moved to `program_preambles/OPS-17.md` and the
Factory status to `OPS-19.md`; `generate-combined.mjs` refuses to regenerate `_STATE.md` while a
shared bullet names a plan row (planted `G-99` refused, `_STATE.md` unchanged); the registry
gained `programs` and `dispatch.mjs` attaches the program preamble by row membership and refuses
a row whose program file is missing (proved by renaming `OPS-23.md`). P-151 recompiled to
23.6 KB from 31.0 KB with zero G-rows. Both controls were verified through the process that
calls them, unlike the close gate.

## What was learned (changes to ground truth)

- **The gate did not fire on its first live trigger.** A commit of an OPS-23 close with no probe
  citation went through as `1e174bcc`. Direct invocation of the hook with the harness payload
  against the same staged set blocked in both the cwd and `-C` forms. Mechanism believed: the
  harness snapshots hook registrations at session start. The live-trigger verification is owed
  on the next session's first OPS-23 close. Memory `hooks-registered-mid-session-are-not-armed`.
- **The address form of the envelope endpoint can answer for another parcel.** Asked with the
  gold parcel's composed situs (927 Main St, Bastrop), it returned `ok` and a polygon for
  `48491:R419407`, a Williamson parcel. The panel guards on node id; the finding is for P-152's
  reader, which must resolve by node id only.
- **Cortex's cached Bastrop county-gis layer has holes at both Bastrop probe parcels.** 44 and
  42 features around the two record points, none containing them, nearest 64 m and 24 m; Bastrop
  County's own FeatureServer at the same point returns `prop_id 34049, 1109 PECAN ST, 0.686 ac`.
  The record point is right. The sheet's county-exact ring for these parcels has therefore never
  been available from that path.
- **The point-route hang is intermittent.** 504 at 16:39Z, 200 in 1.9 s at 17:59Z, 18:02Z,
  18:05Z, 18:09Z. Recorded as a rate by the probe, not as a state.
- **Geocoding was already demoted by ruling** (invariant I5, P-27 2026-08-13) and the panel still
  ends on it because it ignores the point the record carries. The cortex route is caught up in
  order, not outcome.
- **The factory's zoning completeness declaration lists 22 cities including Lakeway,
  Pflugerville, Cedar Park and Leander**, which the roster marks NOT-FOUND. The roster is stale
  as an instrument; the 2026-09-10 "23 of 69 cities" figure came from it.
- **The feasibility engine is not timing out.** It is finishing. The clients are not waiting.

## Planner errors this session, all caught by an instrument or by the operator

1. Proposed cells-as-canonical with projected atoms; the operator caught the inversion of the
   thesis before it reached a record.
2. Read the Bastrop ring mismatch as an id-scheme difference from one feature's apn; the
   authoritative county read an hour later showed a cache hole instead. Corrected in the plan,
   the close and the instrument the same hour.
3. Wrote F5 and F11 as "the point route 504s"; it does so intermittently. Corrected as F14.
4. Wrote the close's violation entry before running it, as if the gate would fire. It did not.
   Rewrote the entry to what was observed and left `1e174bcc` in history rather than amend it.
5. Quoted "23 of 69 cities" from the roster in the plan draft before reading the factory
   declaration; corrected in F9.

Shape of all five: a conclusion written from one read before the second derivation was in
hand. The instrument caught two, the operator caught one, the authoritative source caught two.

## What is open

- P-151 hand-carry, then P-153 after it merges; P-160's own predicate flips when P-151 deploys.
- The gate's live verification, next session.
- The four other-county probe parcels; needs a read-only factory role the integration seat
  does not hold, or a lane that does.
- The cortex node leg has never run: no seat has declared `CORTEX_API_KEY_HEADER` to the
  instrument.
- Which account tier the operator's screenshots were under, and whether free viewers should
  see the drawing (the entitlement gate, F2).
- P-161 to P-167 have no missions yet; P-152 is the first of them to write, and its first act
  is a read-only factory role on the retrieval service.

## Suggested canonical doc updates

1. `00_current_state.md`: one pointer paragraph for OPS-23 (applied this session).
2. OPS-16: A-130 recording P-160 closed partial and the gate finding (applied this session).
3. ENFORCEMENT.md, "Verify a check by violating it": add the clause that a hook must be violated
   through the process that calls it, and that a mid-session registration is not that process.
   Not applied; ENFORCEMENT is fleet-wide canon and gets its own review.
4. OPS-22 §5 read fan-out: add the cached county-gis parcel layer as a seventh read path with the
   F15 hole, so the retirement list is complete when P-152 cuts over.
