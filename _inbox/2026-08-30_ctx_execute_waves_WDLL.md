---
id: 2026-08-30_ctx_execute_waves_WDLL
title: WDLL — CTX execute waves (P0 to P8)
date: 2026-08-30
last_updated: 2026-08-30
status: approved
applies_to: hauska-factory, hauska-engine, legacy-design-tools, hauska-map
plan_row: F-01, F-06, F-08, F-11, F-18, P-09, P-11, P-17
depends_on: _inbox/2026-08-30_ctx_consolidated_execution_plan.md, _inbox/2026-08-30_ctx_road_to_prod_accurate.md, _decisions/2026-08-30_unincorporated_is_the_disposition.md, _decisions/2026-08-30_ctx_complete_or_absent.md
operator_go: 2026-08-30 (five dispatches ae89dc3; separate trees; do not Wave R)
snapshot: integration P:/doc_repo; Q1–Q5 ruled; Gate 8 step 2 unlocks P4; 0005b ships
owner: integration cuts; property produces diffs; planner executes jobs
canvas: C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx
---

# CTX execute waves

Date: 2026-08-30  Status: approved (P0 now; P1+ on operator word for code)

Spine stays: Factory L2 collect, then L3 atomize, then one Wave R. Schedule is the consolidated card. This file is the WDLL companion. Containment is the jurisdiction source. The alias table is name normalisation, not the long pole.

Do not apply 0005 as drafted. Do not re-run `landing-import`. Do not run F-18 until it refuses a missing county.

## Done looks like

Every served cell on the six is exactly one of value / absent-verified / not-applicable / refused, each with its proof. Unincorporated setbacks, edges, and envelope are `not-applicable` (**357,269** parcels). A further **465,568** in-city parcels with no setback table are `unmeasured`, then `absent-verified` on probe — NOT `not-applicable`. Edge work is ~154,841 in-city parcels where a table exists. Wells and footprint apply on five counties. Flood is a shape conversion. One production publish after P5 can fail. PE words match the wire (P2b; does not block Wave R).

## Measured owe (do not re-derive)

981,410 parcels. In-city ceiling 624,141. Current setback-gate ceiling 158,573. Edges owed ~154,841. Non-edge remainder 826,569, which is **not one state**: 357,269 unincorporated `not-applicable` + 465,568 in-city `unmeasured` + 3,732 warmed `value`. Stamping all 826,569 `not-applicable` fabricates a structural claim on 469,300 in-city parcels.

| Rail | Work | Scope |
|---|---|---|
| Wells | apply | five counties (Caldwell 53,841 already) |
| Footprint | apply | five counties (Caldwell 35,269 already) |
| Flood | shape conversion | already 981,620 `flood-hazard-fact` on all six |
| Setbacks | land four `SETBACK_TABLES` artifacts, then probe the other 68 of 72 cities | city-scoped |
| Edges | depth-warm only where a table lands | ~154,841; Hays / McLennan / Williamson zero until a city table |
| Envelope | recompute where a rule exists; PDD declined | follows setbacks |
| Easements | four layers + four county absences | probe RR / Cedar Park first |
| Zoning stamps | home: F-11 + bake; McLennan already 48,441 stamped | city |
| Roads | home: parked P-17 / F-10 this pass | not Wave R |
| C-count | done | `import_ledger` 2026-08-26/27, nine clean two-counts |
| Zero-FIPS well absence | dead | every FIPS has wells |

Writers read `neondb`. Factory L2 copy has zero readers. Collect-complete for already-landed rails is a per-FIPS count of the table the writer reads, not a second jsonb copy.

## Critical path (sets length)

```
P0 -> P1-FACTORY (refuse + 0005 split) -> P2-JURIS containment -> P4 setback land
    -> P4 edges -> P5 -> P6 -> P7
```

Five dispatches at ae89dc3. P1-FACTORY, Gate 8 steps 1–2, P1-LDT, and P2b-serve start now in **separate trees**. Gate 8 county-scoped job waits on P1-FACTORY refuse. P2-JURIS read is planner RO now; persist waits on the P2 job template. 0005b ships (CAD↔TxGIO identity, not jurisdiction). Gate 8 step 2 on the **served body** unlocks P4. The browser walk unlocks P7.

## Parallel (never blocks Wave R)

P2b PE wiring. Easement four-point probe. Zoning-stamp remainder (home named, work later). Roads (parked). Recount instrument repair (P1 item, can ride beside P2). W1 LDT #554 merge/CI. Factory #37 walk grades (after P1 replaces `hasKeyPath`).

## Waves

| Phase | What | Parallel with | Exit gate | Starts |
|---|---|---|---|---|
| P0 | Canon. OPS-1 boundary lie. Owe table. 72 cities. Rename "facts complete" in prose. | nothing | Fresh agent reading tracked canon does not say county-wide setbacks | now (docs) |
| P1 | Checks that can fail. Walk four-state. Gate a job can read (`import_ledger` has 0 SELECTs; the routing pin's field is `held`, carrying plan rows, not `holds`). F-18 refuse missing county. Vintage or delete. Recount repair. **0005 split per the section above.** `DrawEdge.state` -> real union. Serve-path `status` filter (723 retired edges shipping). | P2b start | Each control fails a known violation and passes a known-good | after P0 |
| P2 | Job template + writer allowlist after refuse exists. Unlocks P2-JURIS persist. **P2-JURIS read** is unblocked now (planner RO URI). Containment. Alias seed reconciles the 48% that carry a string. | P2b-serve, Gate 8 steps 1–2 | Join totals **357,269 / 624,141**. Material divergence means the join is wrong. One non-CAD writer refuses a missing county | read now; persist after job template |
| P2b | `_dispatches/2026-08-30_p2b-serve_dispatch.md` (P-92, LDT tree B). X2 + item 4 together. Five MCP one-liners. Do not use the PE wiring card. | P1-LDT (other LDT tree) | Live brief + deployed bundle marker. #310 is not the gate | now |
| P3 | Three states: 357,269 `not-applicable` / 465,568 `unmeasured` / 3,732 `value`. Four county easement absences. CDPs stay `unincorporated`. | after containment exists | Caldwell rural brief names county-absence | after P2-JURIS |
| P4 | Apply five-county wells and footprint. Flood shape conversion. Land four setback artifacts. Edges ≤154,841. Envelope where a rule exists. Five easement layers after probe. Quarantine 188,103 placeholders and McLennan 65,814 envelopes-over-zero. | serialize heavy scans | Every rail applied or absence with a five-field record. Job refuses without it | after P2 writers + P3 |
| P5 | S1–S13 on 100% SQL-able rows. Area sweep for HTTP. Poison + pass both directions. | nothing on the walk image | Each family fails a poisoned row | after P4 |
| P6 | Pin W1. Determinism (empty body diff). Six staging concurrent. | PE deploy may ride | Six `walkVerdict pass` on rows those runs wrote | after P5 |
| P7 | Wave R. Six production serial. GRADE LOG per county. Refusal fixtures green. | nothing | Six production close lines + golds | after P6 + operator word |
| P8 | Repaired recount. Live briefs. Area sweep. Schedule the scrub. | — | Continuous fail on regression | after P7 |

## The 0005 split (A1 — this replaces "do not apply 0005 as drafted")

A prohibition is not a fix. 0005 is the ONLY migration creating
`landing_setback_registry`, `landing_setback_record`, `landing_easement_gis` and
`landing_cad_txgio_alias`, so P4's "land four `SETBACK_TABLES` artifacts" — on the
critical path — has no sanctioned migration until this lands. Split it in **P1**,
not P2.

**0005a — landing tables, Factory store (`FACTORY_DATABASE_URL`).**
`landing_setback_registry`, `landing_setback_record`, `landing_easement_gis`.

1. **Drop every `'absence'` seed.** All eight, not only the four false ones.
   Absence rows are written by a probe job that looked, never by DDL that assumed.
   Austin, Kyle, Georgetown and Round Rock are registered in `SETBACK_TABLES` with
   cited feet (Georgetown `human-verified` 0.95, audited 2026-07-23) and Austin
   alone already has 150,702 `setback-rule` atoms. Seeding them absence overwrites
   sourced data.
2. **Add `probed_at timestamptz`** plus `CHECK (kind <> 'absence' OR probed_at IS
   NOT NULL)`. An unprobed absence becomes unwritable rather than merely forbidden.
   This is the mechanism; the Do-not line is not.
3. **Add `source_url_verified_at timestamptz`**, nullable. Round Rock and Cedar
   Park URLs are synthesised from T3 elisions; a synthesised URL is not a probed
   one and must not pass a `nonempty(source_url)` check. `elgin-warmed-cohort` and
   `lockhart-ordinance` are sentinels passing that same check today.

**0005b — identity alias, bake store (`STAGING_`/`PRODUCTION_NEONDB_URL`).**
This is CAD `prop_id` ↔ TxGIO natural key (`ownersAgree`, `cad-roll-address-join`).
It is **not** the `breadth_*` jurisdiction table P2-JURIS demoted. Do not drop it.
`landing_cad_txgio_alias` only. It currently ships inside 0005 against
`FACTORY_DATABASE_URL`, while `cad-txgio-alias-persist.mjs:252` inserts through
`resolveTargetStores(...).DATABASE_URL`, which `TARGET_VARS` restricts to the bake
store. `FACTORY_DATABASE_URL` is unreachable from that function, so the first
insert errors with "relation does not exist". The table must be created where the
writer writes.

**Verify by violating.** Before either is reported working: attempt an `'absence'`
insert with `probed_at` null and confirm the CHECK refuses it; run `alias-persist
--apply` against a store without 0005b and confirm it fails loudly rather than
silently. A migration observed only applying cleanly has not been observed working.

## Chew order (compiled dispatches)

1. **Now, five trees:** P1-FACTORY (Factory A), Gate 8 steps 1–2 (Factory B), P2-JURIS read (planner RO), P1-LDT (LDT A), P2b-serve (LDT B).
2. **After P1-FACTORY refuse:** Gate 8 county-scoped job form. P2 job template. P2-JURIS persist.
3. **P4** after Gate 8 step 2 fails on the served body (and can pass a gold).
4. **P7** after Gate 8 browser walk.

## Acceptance items

1. **P0 landed.** OPS-1 no longer says city/county boundaries have zero rows. Owe table in W3 and this card matches the measured rows. City number is 72. | check: a reader of OPS-1 + this card does not claim county-wide setbacks | grade: [met 2026-08-30: OPS-1 A12 correction; W3 apply list restated; execute-waves card filed]

2. **P1 controls fail both ways.** Walk rejects all-null. Held rail refuses a job. Missing county refuses F-18. 0005a refuses an `'absence'` row with null `probed_at`. 0005b exists in the bake store and `alias-persist --apply` succeeds against it. `DrawEdge.state` no longer compiles as a single literal. Serve path drops retired edges. | check: violation run + pass run filed for EACH | grade: [ ]

3. **P2 one non-CAD writer job.** Allowlist. County required. | check: Cloud Run execution on a named FIPS, refuse on omitted county | grade: [ ]

4. **P2-JURIS containment.** Every parcel in the six is an incorporated `place_fips` or `unincorporated`. Totals reconcile to 357,269 / 624,141. Alias disagreements recorded, not consumed. No CDP `place_fips`. | check: Kyle-in and rural-Bastrop-out both observed; Coupland sliver refused; material miss vs 357,269 / 624,141 named as join-wrong | grade: [ ]

5. **P3 served.** Three states. Unincorporated setback/edge/envelope is `not-applicable` (357,269). In-city no table is `unmeasured` (465,568), not `not-applicable`. Four county easement absences named. | check: live Caldwell rural brief | grade: [ ]

6. **P4 rails apply-or-absence.** Five-county wells and footprint. Four setback artifacts landed. Placeholders quarantined. | check: five-field record per rail; P4 job refuses without it | grade: [ ]

7. **P5 scrub both directions.** S1–S13. | check: poison fails, gold passes, every family | grade: [ ]

8. **P6 six staging pass.** Determinism empty. | check: walkVerdict pass + empty body diff | grade: [ ]

9. **P7 Wave R.** Six serial. GRADE LOG. Golds as parent item 9. | check: six production close lines | grade: [ ]

10. **P8 prove.** Recount + four live briefs + scrub scheduled. | check: post-R JSON + bundle marker on PE | grade: [ ]

## Amendments

1. 2026-08-30: Replaces Band C / Band 1 as the operating schedule. Collect WDLL spine kept; its lanes are not the order. Reason: review refused the card as a specification wearing a schedule's clothes; amendments A1–A12; road-to-prod P0–P8.
2. 2026-08-30: Containment replaces the alias table as jurisdiction. Alias demoted to name normalisation. `unincorporated` is the CDP disposition. Four compiled dispatches; P1-FACTORY first. Reason: enumeration (509,911 unknown; postal Kyle overcount; county-scoped keys) plus operator ruling.
3. 2026-08-30: Fifth dispatch P2b-serve. Q1–Q5: separate trees; Gate 8 steps 1–2 parallel and unlock P4; 0005b ships (identity, not jurisdiction); P2-JURIS read now / write after P2 job; browser walk unlocks P7. Reason: planner answers ae89dc3.
4. 2026-08-30: `source_url_verified_at` on `landing_easement_gis` before 0005a apply. Synthesised Round Rock and Cedar Park URLs seed NULL and refuse a verified timestamp. P4 wells/footprint/flood go; P4 setbacks/edges/envelope hold until F-11 retires `road-class-setback-table`. Reason: planning board `_decisions/2026-08-30_ctx_fan2_planning_board.md`.

## Do not

- Apply 0005 as drafted (destroys four real setback tables).
- Re-run `landing-import` before it is county-scoped and delta-counting (unrecoverable).
- Run F-18 while it defaults county to 48021.
- Live-query ArcGIS inside an atom writer.
- Copy `tx_rrc_well` into the bake.
- Re-download wells, footprint, flood, or CAD.
- Treat C-count as owed.
- Treat a zero-FIPS well branch as live.
- Owe county-wide setbacks or edges.
- Seed Austin / Kyle / Georgetown / Round Rock as setback absence.
- Publish before P5.
- Treat #310 or a merged PR as customer-done.
- Write an absence without a probe.
- Start Wave R from this card without P5 + P6 + operator word.
- Laptop `--apply`.
- Restart scllr, F-09, F-10 254, Harris PBF.
- Give a CDP a `place_fips` or extend `texas_roster_v1` to CDPs.
- Consume `breadth_*` as jurisdiction.
- Stamp `not-applicable` on the 465,568 in-city no-table parcels.
- Adopt a new containment total instead of naming the join wrong.
- Use `_inbox/2026-08-30_ctx_pe_wiring_WDLL.md` as a P2b brief.
- Share a checkout between two F-08 or two P-92 lanes.
- Drop 0005b.
- Laptop `psql` for the containment persist.
- Grade Gate 8 against the store instead of the served body.
---
