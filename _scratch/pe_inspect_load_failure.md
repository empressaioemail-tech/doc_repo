# PE parcel-inspect intermittent load failure (facets fetch path)

Subagent diagnosis session, 2026-08-24. Snapshot: hauska-map @ 75ac6f4
(fix/p60-setback-perf-viz), live surface smartsite.cloud
(dpl_FL1gCxWWQLJRsvBv7tDr3ai5ke6b, aliased 2026-08-24).

- GROUND-TRUTH (2026-08-24T10:56–11:04Z): live facets BFF
  /api/spine/property-atoms/:id/facets healthy while warm — 28/28 probe
  requests 200 across 48453:280239, 48453:280230, 48021:34073, 48021:34137
  (burst + 2.5-min-spaced), latency 387–815ms, X-PE-Read-Path
  atom-chain / atom-chain-warm, PROPERTY_ATOM_PATH=1 confirmed live.
  48453:280230 resolves with envelope.status ok — no data gap, no
  parcelNodeId resolution failure.
- GROUND-TRUTH (2026-08-24): api/spine.ts had NO maxDuration in
  apps/property-explorer/vercel.json while its facets BFF runs an internal
  5-attempt retry loop (8.5s sleep + five un-timeboxed upstream fetches to
  Cloud Run). Client fetchBakedNodeFacets had no per-attempt timeout and
  treated HTTP 500 (platform FUNCTION_INVOCATION_FAILED) as non-retryable.
- LESSON: a garbage parcel id returns 200 with an honest atom-pending shell
  (atomPathReason "atom-chain empty") on this endpoint — status code alone
  cannot distinguish bad-id from no-atoms-yet; read atomPathReason.
- LESSON: vercel CLI session token (com.vercel.cli auth.json) is rejected by
  the REST API (invalidToken) — historical runtime logs and project
  resourceConfig are unreadable from a seat with CLI-only auth; `vercel logs`
  live-tails ~5min only.
- LESSON (local tooling): Node on this seat needs NODE_OPTIONS=--use-system-ca
  (or it fails UNABLE_TO_VERIFY_LEAF_SIGNATURE on all HTTPS).
- OPEN: cold-start failure was not reproduced live (probe traffic + organic
  traffic kept Cloud Run warm; 2.5-min gaps < scale-to-zero idle). The
  cold-start half of the diagnosis rests on code reading. A deliberate
  off-hours probe (single request after >30min idle) would close it.
- OPEN: uncommitted fix in hauska-map (planner reviews/commits): per-attempt
  timeouts client (30s) + BFF upstream (10s, env PE_UPSTREAM_FETCH_TIMEOUT_MS),
  500 added to client transient set, api/spine.ts maxDuration 60. Tests green
  (97 files / 1412 tests), app tsc clean. Pre-existing api/tsconfig tsc errors
  in api/_lib/verdict-layer-merge.ts (2) — NOT from this change.
