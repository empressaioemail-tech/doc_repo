---
id: 2026-09-16g_texas_scaleup_rev4_and_phase0_wave_claude_code
title: "Session: the scale-up scope torn down and rebuilt as rev 4, the first Phase 0 wave built and partly deployed, and the serving path found to have no trigger"
date: 2026-09-16
kind: session
agent: claude_code
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-16_texas_scaleup_program_scope.md
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md
  - _inbox/2026-09-16_HANDOFF_integration_seat.md
  - _inbox/2026-09-16_scaleup_final_teardown_review.md
  - _decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md
---

# Session: scale-up rev 4 and the first Phase 0 wave

Ran 2026-09-16 from the `integration` seat, `P:/doc_repo` on `main`. It continued a long session
that had planned the Texas scale-up (Phase 0: the six counties; Phase 1: Burnet through the farm;
Phase 2: Bell and Milam; then Texas). This part ran from the final teardown to a handoff.

## What was decided

- **The final teardown** (dispatch-planner seat) scored six of ten theses as not surviving. The
  integration seat re-checked the load-bearing claims at source before accepting them and
  rejected one. The scope became **rev 4** (A-183), with every Phase 0 item on a numbered row
  (P-252 to P-296).
- **Operator answers (A-184, A-190):**
  - the production credential rotation is planned for later;
  - bake-only counties keep serving with a "not yet verified" note;
  - ag valuation for four counties comes from Cotality;
  - the serving-path fix is **both** a stopgap republish trigger (P-294) and the ledger as the
    serving path (P-295);
  - republish the six counties after the gate fix;
  - the reports session is retired and its work merged here.
- **Planner calls, reversible:**
  - P-264 (the verification re-derive) runs in Phase 0 without the road-name dictionary, and
    its residual measures A-177's condition;
  - `agValuation` is accepted as `vendor-pending` until the contract arrives;
  - the decline-wording surface has one owner (P-257).

## What was built and shipped

| Row | Result |
|---|---|
| P-280 | The close gates run inside git (`pre-commit`, `pre-merge-commit`, shared `core.hooksPath`); proven by violation in a real repo, a linked worktree and a merge; fired live on lane closes |
| P-255 | `scripts/setback-parcel-census.mjs`: reproduced 125,212 / 94,260 / 131,357 exactly; 131,357 is P-249's predicate population; 61,725 district misses are planned developments |
| P-253 | `scripts/six-county-completeness.mjs` repaired: all five setback rails, acceptances coupled to their reasons (roadmap register, vendor register, P-264 residual), P-201 verdict strings, rail-list drift check; baseline INCOMPLETE |
| P-252 dry run | `scripts/p252-rollout-dry-run.mjs`: 25 verdicts flip in the six; only `maxImperviousCoverPct` would block publishing, which P-292 removes |
| Deploy | hauska-engine `d88cf65` live (engine-api `00247-san`, retrieval-api `00092-lag`): P-248 footprints and the P-261 verified-only figure checked on exported PDFs; P-210 coverage endpoint live |
| P-278 | Rotation plan: nine secrets, forty Cloud Run consumers, a new-role cutover |
| Finding | 37 engine tag URLs skipped the gate token (`fa9addb4`); the reports session removed them and rotated the key |
| Roadmap | `_inbox/2026-09-16_texas_scaleup_ROADMAP.md`, a living page |

Lanes that returned this session (all `closed-partial`, PRs open unless noted):
- P-252 (factory #157);
- P-249 (LDT #701, map #409);
- P-284 (factory #158);
- P-248 and P-261 (engine #459 and #460, merged and deployed);
- P-292 (factory #159);
- P-293 (LDT #702);
- P-230 (the reports session's dispatch).

## What was found

- **P-201 landed and did not close the zero-earned hole;** P-252 does.
- **P-249's instruction named a field nothing reads** (`depthWarmPromoted`; the atom field is
  `depthWarmPromotion`).
- **LDT's dollar rails serve the legacy value on `unaccounted`** (P-269).
- **The bake customers read has no trigger** (P-230). Five of the six counties serve 2026-09-10
  data.
- **The retrieval service and LDT drop P-201's new verdict strings** (P-293 and a one-line engine
  fix).
- **Marble Falls reads `indeterminate` on the coverage check** (a ZIP split), a Burnet
  finding.
- **Nineteen counties serve from the July bake;** Bell is a migration county (P-291).
- **The P-292 first draft would have fabricated not-applicable cells** outside Travis; corrected
  before dispatch.

## Process notes

- **Two planning sessions shared one checkout** and collided three times: a swept commit,
  P-251 taken between two reads, and the P-284 mission overwritten. Resolved by staging only this
  seat's hunks, and finally by the operator retiring the other session.
- **The integration seat's own mistakes were caught by its own checks:**
  - a census that read 0 (wrong field);
  - an "RR" railroad flag (Austin Rural Residence);
  - a Williamson overstatement in the deploy record;
  - the P-252 mission's false premise about the impervious-cover writer, caught by the lane.
- **The commit gate refused a close** whose cited probe artifact was not in doc_repo; the
  artifact was brought over.

## Owed going into the next session

The handoff (`_inbox/2026-09-16_HANDOFF_integration_seat.md`) carries the ordered queue:

1. The gate rollout.
2. P-249's staging proof and deploy.
3. Republish the six.
4. P-284 staging.
5. P-205 with the Marble Falls fix.
6. P-254, P-277 and P-286.
7. The next dispatches.

Four lanes were fired at handoff: P-258, P-256, P-262 and P-281.
