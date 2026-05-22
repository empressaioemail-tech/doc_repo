---
date: 2026-05-21
agent: cc-agent-AC
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [43_cortex_qa_backlog, 00_current_state, 11_roadmap]
---

> Filed by the doc_repo planner from the cc-agent-AC `_inbox/` courier
> drop per HR-11. PR #64 verified MERGED via `gh pr view 64`
> (`state: MERGED`, mergedAt 2026-05-22T02:04:21Z UTC, i.e. 2026-05-21
> evening Central), commit `638146b`, CI run `26264006292` success.
> Note: the QA-17 code is merged, but the QA-17 item is **not fully
> closed** — the success criterion (five jurisdictions with real atom
> counts) is met only in live `mcp` mode, which needs the operator
> follow-up in the section below. Tracked in `00_current_state.md`.

# QA-17 — Cortex substrate integration (framework-proving pass)

**Outcome: PR #64 open for review.** cortex-api now reads the live Hauska
substrate so the Code Library can list every ingested jurisdiction, not
just the two with a cortex-prod-local corpus. Operator-supervised; not
deployed.

PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/64
Branch: `qa-17/cortex-substrate-integration` · commit `638146b`

## Workspace blocker — resolved

Re-orientation found that the dedicated cc-agent-AC clone the dispatch
assumed did not exist: the only `legacy-design-tools` working tree on
disk (`P:\legacy-design-tools`) was cc-agent-C's, checked out on its
`qa-22/site-context-reliability` branch. Surfaced as
`2026-05-21_legacy-design-tools_cc-agent-AC_qa17-blocked-no-dedicated-clone.md`
(also in this `_inbox/`). The operator authorized a fresh clone;
cc-agent-AC now works from **`P:\ldt-ac-qa17`** — a separate clone, zero
file overlap with cc-agent-C. The planner should record this as
cc-agent-AC's workspace.

## What landed

A net-new cortex-api → Hauska-substrate read path, end to end:

- **`artifacts/api-server/src/lib/hauskaSubstrateClient.ts`** — substrate
  client. `mcp` and `mock` modes mirroring the existing
  `converterClient` / `mnml` pattern; `mock` is the default. Boot
  validator gates the `mcp`-mode env, wired into `index.ts`.
- **`GET /api/substrate/jurisdictions`** (`routes/substrate.ts`) — exposes
  the catalog. Read-only/ungated, distinct path subtree from
  `/api/codes/*` (the cortex-prod-local corpus, untouched).
- **`SubstrateCatalogPanel`** on the Code Library page — lists every
  substrate jurisdiction with atom counts and ADR-017 `accessPolicy`
  badges, above the unchanged cortex-prod-local corpus cards.

All changes are additive (149 insertions to existing files, 0 deletions;
6 new files). `chat.ts`, the IFC parse, and the upload feature — cc-agent-C's
QA-22 surfaces — were not touched. File overlap with cc-agent-C: zero.

## Design decision — MCP server, not the retrieval API (dispatch asked this be documented)

The dispatch offered two integration routes: the deployed Hauska MCP
server, or the hauska-engine retrieval API directly. **Chose the MCP
server.** Reasons:

1. Dispatch recommendation + the doc-28 MCP-first principle: Cortex
   consumes the same MCP surface external agents use rather than reaching
   past it.
2. **Decisive:** the ADR-017 `accessPolicy` visibility partition lives at
   the MCP `list_jurisdictions` boundary. An authenticated Cortex product
   key surfaces the `platform-internal` jurisdictions (Bastrop County,
   Elgin, Hutto); an unauthenticated caller sees only `public-free` ones
   (Grand County, Bastrop). The retrieval API has no per-key gate — going
   direct would mean reimplementing the partition.

The client uses the official `@modelcontextprotocol/sdk` `Client` +
`StreamableHTTPClientTransport` — a direct mirror of `hauska-mcp-server`'s
own `examples/catalog-agent`. New dependency:
`@modelcontextprotocol/sdk@^1.29.0` on `@workspace/api-server`.

## Verification — CI green on PR #64

GitHub Actions run `26264006292`, both jobs pass:

- **Typecheck:** pass (1m15s) — `pnpm run typecheck` across all libs and
  artifacts, including the new source and test files. Also confirmed
  green locally.
- **Test:** pass (4m19s) — the full `pnpm test` suite against the CI
  postgres service. Covers the three new test files
  (`hauskaSubstrateClient.test.ts`, `substrate.test.ts`,
  `SubstrateCatalogPanel.test.tsx`), the `CodeLibrary.test.tsx` panel
  stub, and every pre-existing suite.

Tests were verified on CI rather than locally: the repo's
`pnpm-workspace.yaml` strips every non-Linux native binary
(`rollup>@rollup/rollup-win32-x64-msvc: '-'` etc.), so the
vitest/esbuild/rollup toolchain cannot run on a Windows dev box — a
standing repo constraint, not a QA-17 artifact (prior cc-agent work
verified via CI run IDs for the same reason).

`mock` mode (the default) proves the wiring + UI end to end and keeps CI
hermetic. No DB or key needed for `mock`.

## Operator follow-up — required to close QA-17

QA-17's success criterion ("Code Library lists all five substrate
jurisdictions with **real atom counts**") is met only in `mcp` mode
against the live substrate. To finish:

1. **Mint a Cortex product key** via the MCP server's admin
   key-issuance endpoint (the dispatch flagged this as a prerequisite).
2. Set `HAUSKA_SUBSTRATE_MODE=mcp`, `HAUSKA_MCP_URL`
   (e.g. `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/mcp`),
   `HAUSKA_MCP_KEY` on cortex-api.
3. Confirm the Code Library's substrate panel lists all five
   jurisdictions with real atom counts, and that the three
   `platform-internal` ones appear (proving the authenticated-key path).
4. cortex-api deploy stays operator-supervised — cc-agent-AC did not
   self-deploy.

Until then, `mock` mode ships a labelled fixture (the panel shows a
"fixture" tag; `mcp` mode shows "live").

## Notes for the planner

- `00_current_state.md` §6 lists the **api-server import migration to
  `@hauska/atom-contract`** as queued behind QA-17 for cc-agent-AC. QA-17
  did not touch that migration; cortex-api still uses
  `@workspace/empressa-atom`. The substrate client added here imports no
  atom-contract package — it only mirrors the wire types — so the
  migration remains independent and fireable next.
- Out of scope this pass, per dispatch: the in-app-agent catalog tool in
  `chat.ts` (waits on cc-agent-C's QA-23 landing) and QA-20 background
  collection (routed to cc-agent-E Lane E).
- QA-26 (`core.autocrlf=true`, no root `.gitattributes`) produced the
  expected LF→CRLF warnings on commit; nothing done about it here as it
  is a separate logged ops-cleanup item.
