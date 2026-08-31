---
id: 2026-07-27_CC_A_U2_executor_close
title: CC-A Unit 2 executor close — atoms-by-family + inspector + back-nav
status: checkin
date: 2026-07-27
applies_to: hauska-map
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
owner: cc-a-u2-builder
related: [2026-07-27_CC_A_builder_units, 2026-07-27_CC_A_U1_executor_close]
---

# CC-A U2 executor close — Atoms-by-family + inspector + back-nav

**Builder does not grade WDLL MET.** Planner grades node → atom → back and
boundary-edge inspector fields on live CC after map deploy. Evidence only below.

## PRs / SHAs

| Repo | PR | SHA | CI |
|---|---|---|---|
| hauska-map | [#75](https://github.com/empressaioemail-tech/hauska-map/pull/75) | `1b50af9` | Command Center CI **pass** |

Branch: `feat/cc-a-u2-atom-inspector` (worktree off `origin/main` @ U1 `1f5e7ab`).
No engine change — `GET /atoms/:did` already on retrieval (U1 main `9357d6a`).

## What landed (WDLL 3 / 4 / 5)

### NodeGraph (WDLL 3)

- Family counts are **clickable** (CT FamilyCounts port) → opens NodeAtoms list
  filtered by family (`atoms=` hash).
- "View all atoms →" opens unfiltered list (`atoms=all`).
- Atom row click opens Atom Inspector with breadcrumb.

### AtomInspector (WDLL 4)

- Property path when `return=node-graph` or `id` is `did:hauska:…`:
  fetch via `fetchAtomByDid` → `GET /atoms/:did`.
- Detail ports CT shape: claim; ConfidenceBlock `{n,width,basis}` never bare;
  provenance/citation; bitemporal; accessPolicy ∩ license; reasoningChain;
  depthWarm* fields when present.
- Boundary-edge: role, adjacency, setback, interior; property-line-tags **only
  if present**, labeled **"not a survey" (GIS-approx)** (Amendment 2).
- LIVE/AS-OF: honest empty — property substrate has no as-of endpoint yet
  (not invented). Lineage: shows `supersedesEntityId` when present, else honest empty.
- Code-catalog MCP `search_atoms` path **unchanged** when not in property return mode.

### Back-nav (WDLL 5)

- Open: `#panel=atom-inspector&id=…&return=node-graph&node=…&atoms=…`
- `closeDetail` PORT from CT: restores `node-graph` with `node` + `atoms`
  (+ any `return_*`).

### Clients

- `fetchAtomByDid`, `fetchNodeAtoms` in `atomTrace.ts` (assembles list from
  atom-chain + boundary-edges + road chain — no second store).

## Local evidence

```
pnpm --filter command-center test -- NodeGraph.smoke AtomInspector proxyContract
→ Test Files  3 passed (3)
→ Tests  13 passed (13)
```

Smoke covers: U1 walkable edge + family pill → NodeAtoms → selectPanel
atom-inspector with `return=node-graph&node=48021:28286&atoms=zoning-fact`.

## Negative done-line check (builder self-audit, not grade)

- No second map shell fork (U3 already owns map; U2 did not touch LiveMapTile).
- No hand-set LIVE badges.
- No JSON blob as primary atom view (PropertyAtomDetailView is structured).
- Catalog Atoms search not broken (gated behind `!propertyDetailMode`).

## M0 notes

- PORTED CT organism (FamilyCounts / NodeAtoms / closeDetail / ConfidenceBlock).
  Did not invent a new inspect UX.
- LIVE/AS-OF and full lineage chain are honest-empty stubs — retrieval lacks
  `/admin/atoms/as-of` and `/admin/atoms/lineage` equivalents. Flag for planner:
  not a M0-reach miss on inventing UX; substrate gap.

## Planner owed

1. Deploy / merge map #75; live-walk `48021:28286` → family → atom → back.
2. Open a boundary-edge atom; paste screenshot-equivalent of role/adjacency/
   setback/interior + confidence object.
3. Grade WDLL 3/4/5. Do not accept builder self-grade.

## Close paths

- PR: https://github.com/empressaioemail-tech/hauska-map/pull/75
- This close: `_inbox/2026-07-27_CC_A_U2_executor_close.md`
