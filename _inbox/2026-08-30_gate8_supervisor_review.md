---
id: 2026-08-30_gate8_supervisor_review
title: Supervisor grade — Gate 8 steps 1–2
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: GATE8
plan_row: F-08
agent: 5fefdf0a-570f-4df1-b468-f44ec990cf20
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-gate8 seat/property-ctx-gate8 HEAD 7f41f52; uncommitted; no Cloud Run job; no map checkout
---

# Supervisor grade — Gate 8 steps 1–2

Seat: integration on `P:/doc_repo`. Reviewed `scripts/gate8/` write path, not the handback. Re-ran `node scripts/gate8/selftest.mjs` in that tree: F3–F6 and F8 each fail. Fetched `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets` at 2026-08-30T22:44Z. Did not commit. Did not land the map patch.

## Verdict

Step 2 wire instrument accepted. Step 1 bundle marker is leave_behind. Production day-one still fails. P4 keys `dayOne` C3/C4/C7, not `production.verdict`.

| Claim | Grade | Evidence |
|---|---|---|
| Assertions read the served body | MET | `wire.mjs` `facetsUrl` is `/api/spine/property-atoms/<node>/facets`. No store client. |
| Verdict vocab has no skip | MET | `pass \| fail \| refused \| pass-after-cold-start`. Illegal verdict throws. C1/C2/C5 without DOM are refused. |
| Both arms | MET | Selftest known-violations fail (re-run this seat). Fixture arm corrects C3/C4/C7. Production 2026-08-30T22:41:17Z `dayOne` C3/C4/C7 fail. |
| Three production fails | MET | Independent fetch this seat: `landUseFact.state=present`, `landUseCode=A1`, `baseFacts.landUse=null`; `envelope.status=ok`, `buildableAreaSqFt=9350`, `summary.buildableAreaPct` absent; `boundaryEdgeFact.setback.provenance=road-class-setback-table`. Matches the run record. |
| Not a per-county Cloud Run job | MET | No gcloud job. CI job `gate8` is Node 24, selftest + fixture only. |
| Node 24 | MET | `.github/workflows/ci.yml` job `gate8` pins 24. Main `test` job stays 20. |
| Bundle marker | NOT THIS CARD | Patch under `scripts/gate8/leave_behind/`. UNSTAMPED must fail. Not applied. Map checkout not opened. |

## Holes

1. **Production rollup can never pass without a browser.** `gradeGold` always runs C1/C2/C5. Production passes `dom: null`, so those refuse. After C3/C4/C7 go green, `production.verdict` becomes `refused`, exit 2. P4 unlocks on `dayOne` C3/C4/C7 (and the instrument existing), not on the production rollup. Step 3 is the DOM half.

2. **`--county` defaults to `48021`.** It is a record label. All named golds still probe. Same shape P1-FACTORY just killed on `factory-conformant`. Do not later turn that default into a filter.

3. **C3 is labelled internal consistency.** `landUseFact` and `baseFacts.landUse` are one served body. It still catches the day-one split that never reaches the DOM. It is not a second derivation.

4. **C7 is a specimen.** Gold 34137 carries `road-class-setback-table` and `descriptor-fixture`. Not a 723-edge population count.

## What I did not do

Commit. Land the hauska-map patch. Hook Gate 7 into publish. Wire a Cloud Run job. Treat production green.

## Next

Commit on operator word. P4 may start once this instrument is in the tree it will run from; it does not wait for C3/C4/C7 to go green. Those are the defects the walk and a later bake exist to kill. Bundle marker still leave_behind. County-scoped job waits on a deployed P1-FACTORY refuse image. Step 3 CDP walk gates Wave R.
