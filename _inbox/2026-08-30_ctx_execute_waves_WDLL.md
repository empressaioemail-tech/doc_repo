---
id: 2026-08-30_ctx_execute_waves_WDLL
title: WDLL — CTX execute waves (P0 to P8)
date: 2026-08-30
last_updated: 2026-08-30
status: approved
applies_to: hauska-factory, hauska-engine, legacy-design-tools, hauska-map
plan_row: F-01, F-06, F-08, F-11, F-18, P-09, P-11, P-17
depends_on: _inbox/2026-08-30_ctx_road_to_prod_accurate.md, _inbox/2026-08-30_ctx_w3_collect_amendments.md, _inbox/2026-08-30_ctx_w3_collect_review.md, _decisions/2026-08-30_ctx_complete_or_absent.md
operator_go: 2026-08-30 (tee up; do not pull 0005, landing-import, or F-18 until P2)
snapshot: integration P:/doc_repo; review refused collect-as-written; measured owe from amendments; Wave R paused
owner: integration cuts; property produces diffs; planner executes jobs
canvas: C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx
---

# CTX execute waves

Date: 2026-08-30  Status: approved (P0 now; P1+ on operator word for code)

Spine stays: Factory L2 collect, then L3 atomize, then one Wave R. Schedule is P0 to P8. The draft collect card is a specification; this card is the order of work.

Do not apply 0005 as drafted. Do not re-run `landing-import`. Do not run F-18 until it refuses a missing county.

## Done looks like

Every served cell on the six is exactly one of value / absent-verified / not-applicable / refused, each with its proof. Unincorporated setbacks, edges, and envelope are `not-applicable` (826,569 parcels). Edge work is ~154,841 in-city parcels where a table exists. Wells and footprint apply on five counties. Flood is a shape conversion. One production publish after P5 can fail. PE words match the wire (P2b; does not block Wave R).

## Measured owe (do not re-derive)

981,410 parcels. In-city ceiling 624,141. Current setback-gate ceiling 158,573. Edges owed ~154,841. Absence rows 826,569.

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
P0 truth  ->  P1 controls  ->  P2 alias table  ->  P4 setback land
          ->  P4 edges     ->  P5 scrub        ->  P6 pin  ->  P7 Wave R
```

Start the `breadth_*` → `place_fips` alias table at the top of P2. It is hand-seeded and cannot be derived. Adding people does not compress it.

## Parallel (never blocks Wave R)

P2b PE wiring. Easement four-point probe. Zoning-stamp remainder (home named, work later). Roads (parked). Recount instrument repair (P1 item, can ride beside P2). W1 LDT #554 merge/CI. Factory #37 walk grades (after P1 replaces `hasKeyPath`).

## Waves

| Phase | What | Parallel with | Exit gate | Starts |
|---|---|---|---|---|
| P0 | Canon. OPS-1 boundary lie. Owe table. 72 cities. Rename "facts complete" in prose. | nothing | Fresh agent reading tracked canon does not say county-wide setbacks | now (docs) |
| P1 | Checks that can fail. Walk four-state. Routing-pin holds. F-18 refuse missing county. Vintage or delete. Recount repair. | P2b start | Each control fails a known violation and passes a known-good | after P0 |
| P2 | One job template. Writer allowlist. F-11 writer. Easement writer stops live REST. Store split ruled. **Alias table (long pole).** | P2b | One writer other than CAD runs as a job and refuses a missing county | after P1 start |
| P2b | PE wiring. Grey-box scope. Zone. A1 default. yearBuilt with source. Bundle marker. | P2 | Live brief + deployed bundle marker. #310 is not the gate | after P0 |
| P3 | `unincorporated → not-applicable` on setbacks, edges, envelope. Four county easement absences. | after alias table exists enough to key cities | Caldwell rural brief names county-absence | after P2 alias seed starts |
| P4 | Apply five-county wells and footprint. Flood shape conversion. Land four setback artifacts. Edges ≤154,841. Envelope where a rule exists. Five easement layers after probe. Quarantine 188,103 placeholders and McLennan 65,814 envelopes-over-zero. | serialize heavy scans | Every rail applied or absence with a five-field record. Job refuses without it | after P2 writers + P3 |
| P5 | S1–S13 on 100% SQL-able rows. Area sweep for HTTP. Poison + pass both directions. | nothing on the walk image | Each family fails a poisoned row | after P4 |
| P6 | Pin W1. Determinism (empty body diff). Six staging concurrent. | PE deploy may ride | Six `walkVerdict pass` on rows those runs wrote | after P5 |
| P7 | Wave R. Six production serial. GRADE LOG per county. Refusal fixtures green. | nothing | Six production close lines + golds | after P6 + operator word |
| P8 | Repaired recount. Live briefs. Area sweep. Schedule the scrub. | — | Continuous fail on regression | after P7 |

## Chew order (first three clicks)

1. **P0 this session.** Docs. Removes 826,569 parcels of false owe.
2. **P1 + start alias table + P2b** on the next go. Three lanes. Alias is the long pole; start it before you need it.
3. **P2 job template + writer allowlist** after P1's refuse-on-missing-county exists. Then P3 (cheap, huge), then P4.

After P1 to P3 the rest is one scheduled chain.

## Acceptance items

1. **P0 landed.** OPS-1 no longer says city/county boundaries have zero rows. Owe table in W3 and this card matches the measured rows. City number is 72. | check: a reader of OPS-1 + this card does not claim county-wide setbacks | grade: [met 2026-08-30: OPS-1 A12 correction; W3 apply list restated; execute-waves card filed]

2. **P1 controls fail both ways.** Walk rejects all-null. Held rail refuses a job. Missing county refuses F-18. | check: violation run + pass run filed | grade: [ ]

3. **P2 one non-CAD writer job.** Allowlist. County required. | check: Cloud Run execution on a named FIPS, refuse on omitted county | grade: [ ]

4. **Alias table started.** Seed file exists; at least Bastrop's seven spellings mapped to `place_fips`. | check: row count > 0 and a self-test on two spellings | grade: [ ]

5. **P3 served.** Unincorporated setback/edge/envelope is `not-applicable`. Four county easement absences named. | check: live Caldwell rural brief | grade: [ ]

6. **P4 rails apply-or-absence.** Five-county wells and footprint. Four setback artifacts landed. Placeholders quarantined. | check: five-field record per rail; P4 job refuses without it | grade: [ ]

7. **P5 scrub both directions.** S1–S13. | check: poison fails, gold passes, every family | grade: [ ]

8. **P6 six staging pass.** Determinism empty. | check: walkVerdict pass + empty body diff | grade: [ ]

9. **P7 Wave R.** Six serial. GRADE LOG. Golds as parent item 9. | check: six production close lines | grade: [ ]

10. **P8 prove.** Recount + four live briefs + scrub scheduled. | check: post-R JSON + bundle marker on PE | grade: [ ]

## Amendments

1. 2026-08-30: Replaces Band C / Band 1 as the operating schedule. Collect WDLL spine kept; its lanes are not the order. Reason: review refused the card as a specification wearing a schedule's clothes; amendments A1–A12; road-to-prod P0–P8.

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
---
