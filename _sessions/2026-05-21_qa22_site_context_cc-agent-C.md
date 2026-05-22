---
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [43_cortex_qa_backlog, 00_current_state, 11_roadmap]
---

> Filed by the doc_repo planner from the cc-agent-C `_inbox/` courier
> drop per HR-11. State advance since the report was written: PR #63 is
> merged — verified via `gh pr view 63` (`state: MERGED`, mergedAt
> 2026-05-22T02:01:45Z UTC, i.e. 2026-05-21 evening Central), commit
> `994a04b`, CI run `26263454084` success.

# QA-22 Part 1 — site-context layer reliability

## Outcome

QA-22 Part 1 (site-context adapter-runner reliability) is implemented
and open as **PR #63** (`qa-22/site-context-reliability` → `main`,
commit `994a04b`). CI is green; PR is `MERGEABLE` / `mergeStateStatus:
CLEAN` — **awaiting operator review/merge**. Operator-supervised: no
cortex-api self-deploy.

## Diagnosis (current adapter-runner behavior, code-verified)

The WSA.4 summary was diagnosed against, but the *current* runner was
re-read end to end rather than trusted:

- `runAdapters` **already isolates failures per-adapter** — each
  adapter gets its own `AbortController` + `setTimeout`, and
  `Promise.all` runs over a `runOne` that never rejects. One slow or
  failed layer does not cancel its siblings. The "isolate each layer"
  candidate direction was therefore already satisfied.
- "cancelled by the caller" is `fetchWithRetry`'s message
  (`lib/adapters/src/retry.ts`), thrown when the runner's per-adapter
  **15s** `AbortController` fires mid-retry-loop. WSA.4 was correct
  that this is the 15s adapter-runner timeout.
- The 15s budget is a fixed default. The `Adapter.timeoutMs` widening
  mechanism (the runner takes `max(adapter.timeoutMs, context.timeoutMs)`)
  exists but only Grand County **roads** used it. EPA EJScreen, FCC
  broadband, and Grand County **parcels**/**zoning** were all stuck at
  15s — and those public upstreams routinely answer slower, so each
  independently hit the wall and surfaced as a failed row.
- `SiteContextViewer` already degrades gracefully (per-source load
  state, per-source retry, empty state, WebGL fallback). "The site 3D
  view renders nothing" is downstream of the layer run producing no
  data, not an independent viewer bug.

## Fix (PR #63 — 11 files, +164 / −7)

- **Per-adapter timeout floors.** New shared
  `SLOW_UPSTREAM_TIMEOUT_MS` (30s, `lib/adapters/src/timeouts.ts`)
  wired as the `timeoutMs` floor on `epa:ejscreen`, `fcc:broadband`,
  `grand-county-ut:parcels`, `grand-county-ut:zoning`. Fast adapters
  (FEMA NFHL, USGS EPQS) keep the 15s default; Grand County roads
  keeps its larger 60s Overpass budget.
- **Env-configurable floor.** The generate-layers route reads
  `ADAPTER_TIMEOUT_MS` (default 15s) so ops can widen the global floor
  without a code deploy. The runner takes the max, so per-adapter
  floors still win.
- **Clearer error.** Replaced the retry helper's confusing "cancelled
  by the caller" timeout message with "did not respond in time".

Per-adapter isolation is unchanged — a genuinely-down upstream still
degrades to one failed row, never a failed layer set or 3D render.

## Decision-relevant finding — adapter cache deliberately left federal-only

"Cache successful layer results" was a dispatch candidate direction.
The adapter result cache (`createAdapterResponseCache` +
`FEDERAL_TIER_CACHE_PREDICATE`) covers `federal` tier only. `cache.ts`
documents this as a deliberate decision: "state and local adapters …
may have parcel-level data shifts that we don't want to mask with a
stale cache hit." Grand County (local tier) is therefore never cached.
I did **not** extend the cache to local tier — the diagnosis pointed
at the timeout, not the cache, and overriding a documented design
decision was not warranted for this fix. Flagging so it is not
re-derived: if repeat-view reliability for Grand County later wants
caching, it is a deliberate scope decision, not an oversight.

## Verification

- `pnpm run typecheck` — green locally (all 6 artifacts + libs).
- Build + vitest **could not run on the Windows workstation**: the
  win32 native binaries (`lightningcss`, `esbuild`) are absent and the
  workstation's SSL-intercepting proxy blocks fetching them from npm
  (same documented limitation as the 2026-05-21 QA-18 session).
- **CI (Linux) is authoritative** — run `26263454084`: Typecheck pass,
  Test pass. `@workspace/adapters` **207/207** passed (12 files,
  up from 201 — the 6 new QA-22 tests); `design-tools` 326/326; zero
  failures workspace-wide.

Tests added: `runner.test.ts` proves a per-adapter `timeoutMs` widens
only that adapter's budget while a sibling without the floor still
times out; `federalAdapters.test.ts` / `moabAndLemhiAdapters.test.ts`
pin the slow-upstream floors and confirm FEMA/USGS stay unset.

## State / handoff

- PR #63 `MERGEABLE` / `CLEAN` — awaiting operator merge.
- Out of scope and untouched: QA-22 Part 2 (Bastrop SmartCity OS
  dashboard install — a separate M-PropIntel cross-product decision).
- cc-agent-C's remaining queued dispatch: the codex-reviewer-qa
  scaffold.
