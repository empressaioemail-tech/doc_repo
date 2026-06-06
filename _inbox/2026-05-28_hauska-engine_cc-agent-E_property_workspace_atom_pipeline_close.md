---
id: 2026-05-28_hauska-engine_cc-agent-E_property_workspace_atom_pipeline_close
title: Close — Property workspace atom emission and retrieval pipeline (Brokerage V1)
date: 2026-05-28
agent: cc-agent-E
repo: hauska-engine
branch: feat/property-workspace-atom-pipeline
commit: 7a7c75c
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/65
related: [_dispatches/2026-05-28_cc-agent-E_property_workspace_atom_pipeline, _dispatches/2026-05-28_cc-agent-AC_property_workspace_atom_contract, _dispatches/2026-05-28_cc-agent-C_brokerage_v1_workspace_metering_graph]
---

# Close — Property workspace atom pipeline (engine)

## Status

**PR open** — https://github.com/empressaioemail-tech/hauska-engine/pull/65

| Artifact | Value |
|---|---|
| Branch | `feat/property-workspace-atom-pipeline` |
| SHA | `7a7c75c` |
| PR | https://github.com/empressaioemail-tech/hauska-engine/pull/65 |

## Delivered

### Atom types (engine instances + registry)

- `property-workspace` — address identity, listing URLs, owner, collaborators
- `brief-run` — workspace ref, run inputs, citation refs, confidence, `generatedAt`
- `workspace-attachment` — workspace ref, kind, uri/body, uploader
- `workspace-share-edge` — from/to user, workspace ref, `sharedAt`, consent flags

Registry: `packages/atoms/src/registry.ts` (domain `brokerage`, `tenant-private` access policy).

### `@hauska-engine/workspace` package

| Module | Role |
|---|---|
| `emit.ts` | Contract validation (`@hauska/atom-contract/workspace`) → engine instances + `cites` / `applies-to` / `contains` atom-links |
| `in-memory-storage.ts` | Write/index + `ingestEmittedWorkspaceAtom` |
| `queries.ts` | `listRecentWorkspacesByUser`, `getWorkspacePackage`, `listShareEdges` (+ by workspace/user helpers) |
| `port.ts` | `WorkspaceStoragePort` surface for Postgres back-end (future) |

Citation integrity: `brief-run.citationRefs` emit `cites` links; workspace-scoped atoms emit `applies-to` / `contains` edges. Contract workspace DIDs (`did:hauska:workspace:…`) map to engine `property-workspace` entity type for graph edges.

### Contract pin

- `@hauska-engine/atom-contract-pin` → `^1.3.0`
- Root `pnpm.overrides`: `@hauska/atom-contract` → `file:../hauska-atom-contract` (AC `main` @ `2a7195c`)

## Acceptance criteria

| Criterion | Status |
|---|---|
| Engine can write and retrieve all four atom types | ✅ |
| Recent-workspace query deterministic (most recent first) | ✅ |
| Workspace package query returns complete linked records | ✅ |
| Share-edge query supports admin graph consumers | ✅ |
| Eval/tests green with fixtures | ✅ |

## Verification

```text
cd P:/hauska-engine
pnpm install
pnpm typecheck
pnpm test
```

### Workspace package tests (`packages/workspace`)

```text
 ✓ src/__tests__/workspace-pipeline.test.ts (6 tests) 20ms
 Test Files  1 passed (1)
      Tests  6 passed (6)
```

### Full monorepo (`pnpm test`)

All workspace packages green at commit time (atoms 140, storage 11, workspace 6, corpus 90, retrieval 14, retrieval-api 12, migrate-legacy-codes 27).

## Out of scope (per dispatch)

- Legacy-design-tools routes/controllers
- Billing / paywall logic

## Schema coordination blockers

| Partner | Blocker / note |
|---|---|
| **AC** | `@hauska/atom-contract@1.3.0` is **not on npm** yet (registry latest: 1.1.0). Engine CI will need either npm publish + tag `v1.3.0` or a monorepo/submodule pin. Local dev uses `file:../hauska-atom-contract` override. |
| **C** | Product ingest should validate with `@hauska/atom-contract/workspace` before calling engine emission. Workspace canonical DID uses segment `workspace` (e.g. `did:hauska:workspace:123-main-st`); child atoms reference `workspaceDid`. Brief payloads must include `citationRefs` for linkage. No billing fields in atom bodies. |
| **M** | Import query helpers from `@hauska-engine/workspace`; `InstanceLookup` can delegate to `WorkspaceStoragePort.getWorkspaceAtom` for `contextSummary` (pattern in workspace tests). |

## Consumer guidance

```typescript
import {
  emitPropertyWorkspace,
  ingestEmittedWorkspaceAtom,
  InMemoryWorkspaceStorage,
  getWorkspacePackage,
  listRecentWorkspacesByUser,
} from "@hauska-engine/workspace";
import { SAMPLE_PROPERTY_WORKSPACE } from "@hauska/atom-contract/workspace";

const storage = new InMemoryWorkspaceStorage();
await ingestEmittedWorkspaceAtom(storage, emitPropertyWorkspace(payload));
const pkg = await getWorkspacePackage(storage, workspaceDid);
const recent = await listRecentWorkspacesByUser(storage, userDid);
```

Postgres `WorkspaceStoragePort` implementation is a follow-up; in-memory port matches code-corpus pattern for tests and MCP integration.
