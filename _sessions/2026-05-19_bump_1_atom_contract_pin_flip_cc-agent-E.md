---
id: 2026-05-19_bump_1_atom_contract_pin_flip_cc-agent-E
title: Session — Bump 1 atom-contract-pin flip (hauska-engine; Sync 1 consumed)
date: 2026-05-19
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Consumed Sync 1 in `empressaioemail-tech/hauska-engine`. cc-agent-AC's M2-C extraction landed [`@hauska/atom-contract@1.0.0`](https://www.npmjs.com/package/@hauska/atom-contract) on npm 2026-05-19 (verified `npm view @hauska/atom-contract version` → `1.0.0`; `dist-tags.latest` → `1.0.0`). The engine-side shim at [`packages/atom-contract-pin`](../../../hauska-engine/packages/atom-contract-pin) flipped from the local-source mirror of `@workspace/empressa-atom` to a single re-export of the published package, per the pre-Sync-1 design captured in the foundation session's [`REPO_NOTES.md`](../../../hauska-engine/REPO_NOTES.md).

Branch `bump-1/atom-contract-pin-flip` carries one commit (`b86f2b9`):

- `packages/atom-contract-pin/package.json`: adds `"@hauska/atom-contract": "^1.0.0"` under `dependencies`; description updated to reflect the post-Sync-1 role.
- `packages/atom-contract-pin/src/index.ts`: collapsed to one line — `export * from "@hauska/atom-contract";`.
- Five mirror files deleted as unreachable: `scope.ts`, `context.ts`, `registration.ts`, `composition.ts`, `registry.ts` (425 lines net removed, including the lockfile diff).
- `pnpm-lock.yaml` updated to lock the new dep tree.

PR opened against `main`: [`empressaioemail-tech/hauska-engine#1`](https://github.com/empressaioemail-tech/hauska-engine/pull/1) — "Bump 1: flip atom-contract-pin to published @hauska/atom-contract@1.0.0".

Verification on the branch:

- `pnpm install` resolved `@hauska/atom-contract@1.0.0` from npm (one new package added; `+1` resolved on the install run; `NODE_OPTIONS=--use-system-ca` still required locally per the foundation session's Windows toolchain note).
- `pnpm typecheck` clean across all 9 workspace projects. **This is the structural verification** — the published `.d.ts` exposes the exact surface the engine consumers were already using; if anything had drifted (a removed export, a parameter rename, a generic-constraint change), typecheck would have caught it. None did.
- `pnpm test` — all 31 tests pass (21 in corpus, 10 in retrieval-api), same as pre-flip.

## What was learned

The pre-Sync-1 "matching-shape" shim approach (rather than a `file:` reference back to `legacy-design-tools/lib/empressa-atom`) paid off cleanly here. Because the shim's public surface was hand-mirrored to the contract types, the flip is a one-line edit plus a dependency add. If the shim had been an ergonomic re-export of `@workspace/empressa-atom`, the swap would have been entangled with the legacy pnpm-workspace coupling. Worth keeping in mind for any future cross-repo pre-publication shims.

The published `@hauska/atom-contract@1.0.0` ships as a compiled `dist/` ESM package (`exports."."` maps `types: "./dist/index.d.ts"`, `import: "./dist/index.js"`) plus a `./testing` subpath — both consistent with cc-agent-AC's "framework port" framing in their session summary. The engine doesn't depend on `./testing` directly, so the v1 shim only re-exports the root.

Net code reduction: 365 lines deleted (the local mirror) for 55 lines added (the one-line shim, the description rewrite, the lockfile delta). The shim package itself is kept — engine consumers continue importing from `@hauska-engine/atom-contract-pin` so the swap stays internal. A follow-on cleanup session can either keep the shim as a fence around the contract import or delete it and rewrite consumer imports; both are non-breaking from here.

## What's still open

PR #1 awaits Nick's merge. After merge the Sync 1 leg is closed for `hauska-engine`; planner-owned Bump 1 cross-repo PR rollout per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump-1 covers the other consumers (legacy-design-tools, smartcity-os, legacy-revit-sensor, hauska-mcp-server). cc-agent-M's Stream 2A in [`hauska-mcp-server`](https://github.com/empressaioemail-tech/hauska-mcp-server) can also flip its contract import on the same signal.

Sprint state otherwise unchanged from the foundation session: Sync 2 and Sync 3 contracts remain stable; the per-stream "first-city test" / "Bastrop B.6 validation pass" / "20-jurisdiction batch ingest" exits all remain pending. Sync 6 (Texas IP attorney memo) still gates Tier 1+2+3 batch ingest; Bastrop + Grand County stay unblocked.

## Suggested canonical doc updates

Light housekeeping; not strictly required this session:

- **[`00_current_state.md`](../00_current_state.md) §5 (Recent session summaries):** prepend a line pointing at this session and at cc-agent-AC's session that landed the npm publication.
- **[`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump-1 coordination checklist:** flip the `hauska-engine` `packages/atoms/` consumer line from `[ ]` to `[x]` (the consumer code is correct; PR #1 just pins the version through the shim). Planner-owned cross-repo rows for legacy-design-tools / smartcity-os / legacy-revit-sensor / hauska-mcp-server stay open.

Neither edit changes any open work; both reflect what's already true after PR #1 merges.

## Commit batch

One commit in `hauska-engine` on branch `bump-1/atom-contract-pin-flip` (PR #1). One commit in `doc_repo` for this session summary.
