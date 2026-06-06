# Close — `@hauska/atom-contract@1.3.0` npm publish (cc-agent-AC)

Date: 2026-05-28  
Repo: `hauska-atom-contract`  
SHA: `721da74a79c9f4e6173b5b0b0b674d348e1e868e`  
PR: https://github.com/empressaioemail-tech/hauska-atom-contract/pull/2 (merged)  
Tag: `v1.3.0`

## Result

**PASS — `@hauska/atom-contract@1.3.0` is live on npm.**

## Publish path

Windows Hello (passkey) 2FA does not provide TOTP codes. Used npm **staged publishing** (CLI 11.15+):

1. `npm stage publish` — staged `1.3.0` (id `9d74b4a9-db6a-4f87-82a7-81d70b5648d8`)
2. `.\publish-approve-1.3.0.ps1` — browser auth + Windows PIN → approved and published

Operator confirmation:

```text
Staged package ... approved and published successfully.
Registry version: 1.3.0
```

## Acceptance

| Step | Status |
|------|--------|
| main @ 721da74 | PASS |
| tag v1.3.0 | PASS |
| npm registry `1.3.0` | PASS |
| `./workspace` subpath in tarball | PASS |

## Consumer guidance

```bash
npm install @hauska/atom-contract@^1.3.0
```

```ts
import {
  PROPERTY_WORKSPACE_SCHEMA,
  SAMPLE_PROPERTY_WORKSPACE,
} from "@hauska/atom-contract/workspace";
```

- **hauska-engine** (E #65 CI): can pin `^1.3.0` for workspace atom registration.
- **legacy-design-tools** (PR #132): wire workspace types from `@hauska/atom-contract/workspace`.
- Property Brief / GTM events: no new atom types in this package; events stay in cc-agent-C API.

## Future publishes

```powershell
$env:NODE_OPTIONS = "--use-system-ca"
npm stage publish
npm stage approve <stage-id>   # browser + Windows PIN
```

Or bump version, tag git, then repeat.

## Blocker

None.
