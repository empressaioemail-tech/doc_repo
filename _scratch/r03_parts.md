# R-03 parts inventory scratch

## GROUND-TRUTH @ 2026-08-21T02:15:00Z

- doc_repo worktree `P:/tmp/r03-parts` @ `4b174d1b129fa9eee54464967fe7da2b03828a72`
- Get-Process PIDs 22096,21364,85672,43348 → all dead (empty)
- Node/python factory runners → 0 processes
- HTTP probes: smartsite.cloud 200, cmdcenter 200, retrieval-api /health 200, mcp.hauska.dev NXDOMAIN

## LESSON

- `_STATE.md` PID claims are moment snapshots; always re-probe before LIVE. L26 heartbeat was ZOMBIE not LIVE.
- LDT HEAD `10069854` lost `countyLedgerMaterializeCli.ts` and `countyFloodScoreCli.ts` present at deployed image `19da3b1b` — CLI ZOMBIE while cortex snapshot path still LIVE.
- tier2 flood retirement is the canonical ZOMBIE pair: retired serve path + unrep pointed successor atoms.

## DEAD-END

- Attempted `git worktree add --detach P:/tmp/r03-parts P:/doc_repo` — fatal invalid reference. Correct form: `git worktree add --detach P:/tmp/r03-parts` from repo root.

## OPEN

- Extend inventory to full 67 factory/job floor from worker (per-ingest CLI, all depth-warm stubs) if R-03 amended.
- seat_register UNASSIGNED for hauska-mcp-server, plan-review, icc-portal, smartcity-os — needs systems topology row or explicit UNASSIGNED is permanent.
- empressa-trading and smart-markets UNKNOWN — markets seat live probe owed.
- county geographic extent instrument still ABSENT (OPS-12); multi-shapefile sweep DORMANT one-shot.
