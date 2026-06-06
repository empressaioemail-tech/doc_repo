# Close — Property workspace atom contract (cc-agent-AC)

Date: 2026-05-28  
Repo: `hauska-atom-contract`  
Dispatch: `2026-05-28_cc-agent-AC_property_workspace_atom_contract`

## Outcome

Implemented contract-only workspace packaging schema/types and fixtures for:

- `property-workspace`
- `brief-run`
- `workspace-attachment`
- `workspace-share-edge`

No engine ingestion logic or API route logic was added.

## PR URL

- https://github.com/empressaioemail-tech/hauska-atom-contract/pull/2 (merged)

## SHA

- Merge commit on `main`: `721da74a79c9f4e6173b5b0b0b674d348e1e868e`

## Released version / tag

- Package version: `1.3.0` (merged to `main`)
- Git tag: `v1.3.0` (pushed to `origin`)
- npm: **not published** — see blocker below

## Schema diff summary

- Added new subpath export: `@hauska/atom-contract/workspace`.
- Added workspace contract slice in `src/workspace/`:
  - `common.ts`: shared metadata (`did`, `createdAt`, `updatedAt`, `accessPolicy`) and user ref schema.
  - `property-workspace.ts`: address identity + listing URLs + owner/collaborators.
  - `brief-run.ts`: workspace ref + run inputs + citation refs + confidence + `generatedAt`.
  - `workspace-attachment.ts`: kind enum (`link|image|pdf|note`) with kind-specific `uri/body` guardrails.
  - `workspace-share-edge.ts`: from-user, to-user, workspace ref, `sharedAt`, consent flags.
  - `fixtures.ts`: validation fixtures for all four entities.
  - `__tests__/workspace.test.ts`: fixture validation and negative guardrail cases.
- Updated changelog with `1.3.0` entry and consumer migration notes.

## Consumer migration notes

- Upgrade to `@hauska/atom-contract@^1.3.0` once npm publish completes.
- Import from `@hauska/atom-contract/workspace` for these schemas/types.
- Ensure all four workspace entities include metadata fields:
  `did`, `createdAt`, `updatedAt`, `accessPolicy`.
- Ensure `workspace-attachment` payloads obey kind rules:
  - `note` requires `body`.
  - `link|image|pdf` require `uri`.

## Validation run

- `npm run lint` ✅
- `npm run typecheck` ✅
- `npm test` ✅ (workspace tests included)
- `npm publish` prepublishOnly pipeline ✅ (build succeeded; registry PUT failed)

## Blocker

- **npm publish blocked**: `npm whoami` returns `401 Unauthorized` in this environment. `npm publish` failed with `404` on `PUT @hauska/atom-contract` (no authenticated publisher session). Registry currently shows latest `@hauska/atom-contract` as `1.1.0`.

**Operator action to finish release:**

```bash
cd P:/hauska-atom-contract
git checkout main && git pull
npm login
npm publish
```

After publish, consumers can pin `@hauska/atom-contract@1.3.0`.
