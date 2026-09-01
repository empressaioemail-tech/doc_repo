---
id: 2026-07-27_TRACK_B_live_verify_proceed
title: Track B — live verify proceed (sequenced land + M0 guard + deploy)
status: active
date: 2026-07-27
planner: Track B customer-UI planner
related: [2026-07-27_TRACK_B_builders_closed_rollup, 2026-07-27_TRACK_B_customer_ui_quality_WDLL]
---

# Track B — live verify proceed

Operator greenlit HOLD→live-AFTER with two reinforcements. CTX HELD.

## Reinforcements (locked)

1. **B3 M0:** dual-repo `mapBuildableDisplay` → mechanical single-source guard (shared module OR identical-copy test). Not a flagged risk — a failing guard. Builder fanned: [M0 vocab guard](95bdcead-4a65-41af-88c0-158cd67cc298).
2. **B2 grade:** live PDF only on `48021:34785` real P-5 / ~13641 — never the offline fixture sample.

## Conflict matrix (engine)

| Pair | Shared files |
|---|---|
| 141∩142 | `index.ts`, `pdf/provenance.ts`, `pdf/render.ts` |
| 141∩143 | those + `site-model.ts` |
| 142∩143 | `index.ts`, `pdf/layout.ts`, `provenance.ts`, `render.ts` |

Land order: **#141 → #142 → #143** (vocab → craft → roads). Map: **#71 → #72**. Sequencer fanned: [rebase sequencer](3edd5c44-9fdc-469b-830d-0045bcaa861d).

## Deploy discipline

- Serving now: `hauska-engine-api-00088-sub` @ 100% tag `fix21-siteplan` (VERIFY after shift — traffic-trap).
- Retrieval serving: `hauska-retrieval-api-00033-wom` @ 100% — B1 `attaching-roads` needs retrieval deploy too.
- Never `gcloud run deploy --source=.` from repo root (wrong Dockerfile). Use `cloudbuild.engine-api.yaml` / retrieval yaml → canary `--no-traffic` → health `service=engine-api` → shift → re-describe traffic.

## Live-AFTER checklist (planner)

- [ ] M0 guard on tip + CI green
- [ ] Engine PRs sequenced mergeable; merge 141→142→143
- [ ] Retrieval + engine canary deploy; paste serving revision @ 100%
- [ ] Map #71→#72 merge + Vercel PE deploy
- [ ] B1: gold 34785/33512 STREET drawn + PE road overlay
- [ ] B2: live PDF 34785 P-5/~13641 professional read + GIS tag honesty
- [ ] B3: trio card/inspect/PDF one truth
- [ ] Per-unit grades filed; scratch updated

Negative done-line unchanged.
