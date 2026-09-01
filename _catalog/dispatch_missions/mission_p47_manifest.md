You MUST NOT spawn sub-agents. You MUST NOT git add / commit / push. You MUST NOT deploy. You MUST NOT gcloud run. You MUST NOT vercel. You MUST NOT atoms --apply. You MUST NOT POST ledger recompute. You MUST NOT invent a roads coverage row. You MUST NOT write a new scorer. You MUST NOT start P-52. You MUST NOT occupy P:/legacy-design-tools or P:/hauska-engine.

Plan row P-47. Occupancy: doc_repo `_inbox` JSON plus one file-based instrument under `_inbox/` or `scripts/` if you need it. No product worktree.

WDLL: `_inbox/2026-08-22_serve_ident_qa_WDLL.md` item 10. Program card `_inbox/2026-08-21_ops18_all_board_WDLL.md` item 9. A-020 is the full scorer-capability gap. This card is the near-term instrument check only: Manifest live and honest. Do not close A-020 by grepping that GET is 200.

## Mission

Prove the live County Manifest by field name.

GET `https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger` as JSON. Read fields by name. Never a positional formatter.

Required quotes:

- `summary.computedAt`, `summary.servedAt`, `summary.totalCells`, `summary.totalRails`
- Per `railKey` in `manifestCells`: n, `displayState` counts, count of `honestCoveragePct == null` vs set
- Roads: `displayState=not-yet` on all 254 and `honestCoveragePct` null on all 254. Fail if any roads cell has a coverage percent. That would be an invented row.
- Harris `48201` roads stays `not-yet` (A-017).
- At least one rail with a checked-in spec is scored (geometry and/or flood and/or mud have `satisfied-*` cells). Quote those `displayState` counts.
- Unspecified rails (roads, footprint, easement, rrc-wells, rrc-pipelines, rail-corridor per A-020 / RAIL_SCORING_DECLARATION) stay `not-yet`. Fail if one of them shows `satisfied-present` without a checked-in spec.

Write a file-based instrument that self-tests both directions before you trust it (a fixture with an invented roads percent must fail; a fixture with 254 not-yet must pass). Do not grade from a one-liner.

Optional: CC panel `https://cmdcenter-blush.vercel.app/#panel=county-manifest` stamps vs GET `computedAt`. If the browser cannot reach it, say so. Panel STALE/fresh must agree with GET age. Do not POST recompute to freshen.

Do not add a roads measurement spec on this card. That is leave_behind after visual QA.

## Return

CP1: instrument path, what result would prove it wrong, roads-invented fixture. CP2 after the instrument run. CLOSE quotes GET field names, per-rail counts, Harris roads, and whether any unspecified rail left `not-yet`. leave_behind: A-020 scorer capability (six rails still have no checked-in spec). Do not start P-52.
