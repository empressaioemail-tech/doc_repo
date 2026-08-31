---
generated: 2026-08-09
lane: F3-cert-fix
repo: hauska-engine
pr: "#292 MERGED"
merge_commit: fb1a632 chain on main
verdict: CLOSED — G1-G4 complete; G2b sequenced per planner decision
---

# F3 cert-fix lane close (final)

## Executive summary

| Goal | Verdict | Evidence |
|------|---------|----------|
| G1 re-promote 48021:34177 | **DONE** | 5-edge txgio + road-label warm path + situs ground-truth |
| Checkpoint 1 | **PASS** | `_f3_checkpoint1_reviewer.json` |
| Situs adversarial review | **PASS** | `_f3_situs_adversarial_review.json`; twelve-sweep 12/12 |
| G2 roles-freshness | **STOP logged** | 188/3935 mismatches — cohort re-promote sequenced as G2b |
| G3 block13 LIVE (txgio) | **7/7** | `.tmp-block13-live-out.txt` @ 2026-08-09T21:20Z |
| G3 offline fixture | **8/8** | `block13-offline-fixture.test.ts` after re-dump (34177 ring 5v) |
| Checkpoint 2 grep gate | **PASS** | Seeded `travis` in setback-table-from-adapter.ts → gate failed; removed → green |
| G4 merge #292 | **MERGED** | CI run 31336840850 SUCCESS; branch cleaned (F5 aa5cd91 dropped) |

## Commits on PR #292 (final branch)

1. `1f2a6e2` — txgio cert frame (Geometry Law)
2. `1e96d54` — B3 word-boundary grep gate
3. `d41f9df` — situs threaded into promote ground-truth gate
4. `fb1a632` — block13 offline fixture refresh (post 5-edge promote)

## G3 LIVE score (verbatim)

```json
{
  "score": { "pass": 7, "fail": 0, "total": 7, "label": "7/7" },
  "blockPass": true,
  "certRestore": "7/7 — CERT-RESTORE ELIGIBLE"
}
```

48021:34177: `pass: true`, all gates green, 5-edge txgio frame (edges 0–4).

## G2 planner decision (inherited by W3 cert re-earn)

**188 stale-role Bastrop parcels → cohort re-promote as G2b mini-wave, NOT now.**

Gates before G2b runs:
1. **#292 merged** ✅ (txgio frame + situs fix are the path)
2. **Adversarial SAMPLE** — reviewer verifies ~15 of 188 against raw geometry + road adjacency; confirm fresh labels are RIGHT not merely different
3. **G2b execution** — atoms slot queue window (coordinate with W1/D planner); write-then-verify per parcel
4. **block13 re-run** after G2b closure

Because Bastrop is the cert county, **G2b closure feeds W3 cert re-earn** — re-earn lane inherits the 188-parcel list from G2 sweep output.

G2 sweep artifact: `mismatchCount: 188`, `cohortCount: 3935` (full list in agent-tools `172a6da0-0920-4196-ab1f-bc8515438f2e.txt`).

## Adversarial artifacts

| Checkpoint | File | Verdict |
|------------|------|---------|
| CP1 edge roles | `_f3_checkpoint1_reviewer.json` | PASS |
| Situs gate | `_f3_situs_adversarial_review.json` | PASS (null situs fail-closed; 12/12 sweep) |
| CP2 grep gate | local vitest `-t "grep gate"` | FAIL on seed / PASS after removal |
