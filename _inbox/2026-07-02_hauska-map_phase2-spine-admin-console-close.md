---
title: Phase 2 spine admin console — close report (hauska-map command-center)
status: closed
last_updated: 2026-07-02
owner: cc-agent (hauska-map lead, Phase 2 spine console admin capture)
repo: empressaioemail-tech/hauska-map
pr: "#4 (squash-merged to main as 678517d)"
audience: planner (doc_repo)
---

# Phase 2 spine admin console — close

Lifted the trading app's admin "Control Tower" skeleton into the hauska-map spine command center and wired the highest-value operator panels against our live APIs. The spine console's admin surface now lives in the `command-center` React app (localhost:5174), distinct from the root JS E1-E7 console (:5173) and from the product cortex workspace.

## Where it landed (architecture note)

The dispatch framed "the spine console served at :5174" as one app. On the ground the hauska-map repo carries two surfaces: the ROOT app (`src/`, vanilla JS, vite :5173) holding the existing E1-E7 operator panels (MCP inspector, atom browser, layer legend, run monitor, parcel trace), and `apps/command-center/` (React + TS + Vite, `vite --port 5174`) which was a thin FloatingMap demo. The React :5174 app is the correct home for the React/TS admin skeleton, so the admin console was built there and the root JS E1-E7 console was left untouched. This keeps E1-E7 fully unregressed (root `src/` and `packages/` have zero changes) and matches the dispatch's :5174 target.

## Skeleton ported (backend-agnostic, near-verbatim from the trading admin)

3-column `ControlCenterLayout` (NavRail | active inspector | StateLegend), a `PanelRegistry` (`PanelDef[]` with id/label/group/Component + live/stub flags), `useActivePanel` hash routing (`#panel=<id>` with `&k=v` params, PanelProvider, parseHash/buildPanelHash), the `primitives.tsx` kit (Panel/Pill/sevColors/sectionHeader/mono/Loading/ErrorState/Empty/fmtTime/fmtNum), and a per-panel `ErrorBoundary` re-keyed on panel id. Because the command-center app had no CSS token file, a dark operator theme (`admin/tokens.css`) defines every `--color-*` / `--font-*` token the ported code references (verified complete by review: 21 tokens referenced, 21 defined). The `StateLegend` reference column teaches the same confidence-basis / access-policy vocabulary the product enforces (commitments #1/#2; "a confidence is never shown without its n + width", "asserted = a prior").

## Panels wired LIVE vs stubbed

Wired live against our APIs (no mock; honest empty/error when unreachable):

- Atom Inspector — MCP `search_atoms` via a TS-ported `HauskaMcpClient` (public catalog, anonymous works; a key widens scope). Renders the `{value, n, width, basis, scope}` confidence block and never a bare number; `toConfidenceFigure` maps our read-contract `readContract.axes.calibratedConfidence {estimate, n, intervalWidth, provenance}` into the figure. Selecting a row opens a detail view (claim value, provenance, citation, access policy), hash-routed `#panel=atom-inspector&id=<atomDid>`.
- Run Monitor — probes, in order, `${cortexApiUrl}/api/brokerage/v1/operator/warming/status`, `${cortexApiUrl}/api/internal/qa/run-state`, `${mcpAdminBase}/admin/operator/run-state`, with auth headers; normalizes (parcelsWarmed/tracked/pct, coverage holes, adapter failures, contested ground, triage, compute cost vs budget, recent runs); polls every 5s with a plain `setInterval` (no react-query — not a dependency here); honest-empty listing the endpoints attempted.
- Surface & Gate — MCP admin introspection `${mcpAdminBase}/admin/introspection/tools`; renders total tool count, the by_product and by_gate breakdowns, and the tool inventory (name + product + gate). This is the "which tools on which product surface at the gate" operator view.
- Calibration — live honest-empty: states the warming harness (W1-W3) is not running and the calibration overlay is cache-only, with a provenance-count scaffold (asserted/seed/backtest/live all 0). Correct expression of commitment #2 (no unearned number presented as earned).

Auth uses `X-Hauska-Key` (plus `Authorization: Bearer`) — not Bearer-only — so the MCP gate keys correctly rather than silently falling through to product "public". The MCP client also sends `X-Hauska-Dev-Product`. Config is read from the same `hauska-spine-console-config` localStorage key the root console uses, so a key set in either surface carries over. The header carries a password-input to set/replace the key.

Registered as honest stubs for a later pass (nav placeholder naming the endpoint each will hit, not built): node-graph (retrieval-api atom-trace graph traversal), lineage-audit (atom lineage / supersession chain), resolver (place/resolve + node resolution status), engine-console (engine action-atom log + autonomy tiers), license-access (accessPolicy ∩ license, most-restrictive-wins). Default panel is `atom-inspector` so the console opens on a live panel.

## Build / run verification

- `tsc --noEmit` (strict): exit 0.
- command-center `vite build`: exit 0 (39 modules).
- root app `vite build` (regression check): exit 0 (51 modules; the pre-existing >500 kB chunk-size note is an informational warning, unrelated).
- Adversarial review: PASS on all items (scope discipline — only `apps/command-center/` changed; skeleton present + 3-column + hash routing; tokens complete; the 3 live panels wired to real our-APIs with correct auth and a never-bare confidence block; stubs registered; both builds clean).

The spine console is primarily the local :5174 operator surface. hauska-map has NO PR-gating CI and NO app deploy workflow (only a tag-triggered `publish-map-renderer.yml` for the package), so this is a local/dev console. No deploy was invented; verification is the clean `vite build` + `tsc` gate for both apps.

## PR + merge

PR #4 (empressaioemail-tech/hauska-map), branch `phase2/spine-admin-console`, squash-merged to `main` as `678517d`, branch deleted. No CI checks were configured on the repo; mergeable state was CLEAN and the reviewer passed. The operator's persistent clone `P:\hauska-map` was restored to a clean `main` (fast-forwarded to the merge commit, working tree clean, feature branch removed) so their Cursor workspace and running :5174 dev server are not left on a feature branch or with uncommitted files.

## Recovery note (this session)

The initial build was done in a fresh tmp clone at `p:\tmp\phase2\spine-hauska-map`; that directory was recycled by a concurrent worktree operation mid-session (replaced by unrelated projects), and because the branch had not yet been pushed, the first build was lost. The work was reconstructed from the documented manifest into the persistent clone `P:\hauska-map`, rebuilt clean, committed, and PUSHED immediately before continuing, then re-reviewed and merged. Process lessons: (1) if a tmp clone is recycled mid-build, re-clone into a NEW tmp dir rather than working in the operator's persistent clone; (2) push the feature branch to origin right after the first commit, not at the end, so a recycle cannot lose it. A brief accidental `git add -A` in `P:\doc_repo` (wrong cwd after a failed `Set-Location`) was fully reverted with `git reset HEAD .`; doc_repo was not otherwise touched.

## What remains for the other panels

The five stub panels are the next Phase 2+ increment, each with a reachable target: node-graph and lineage-audit hang off the retrieval-api (`/atoms/trace/:did` traversal and lineage/supersession chain); resolver off place/resolve + node resolution status; engine-console off the engine action-atom log with autonomy tiers; license-access off atom `accessPolicy ∩ license`. The AtomInspector's detail view can also gain the as-of / live time-travel control and the lineage chain once the retrieval-api lineage route is wired (the trading original had both; they were deferred here to bound scope to skeleton + the reachable-today panels). None of these are blockers; they are queued behind the wedge.
