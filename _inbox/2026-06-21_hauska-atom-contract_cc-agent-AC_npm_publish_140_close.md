---
id: 2026-06-21_hauska-atom-contract_cc-agent-AC_npm_publish_140_close
title: cc-agent-AC — @hauska/atom-contract@1.4.0 npm publish
date: 2026-06-21
repo: hauska-atom-contract
agent: cc-agent-AC (operator-assisted)
tasks: [F4 read-contract type publish, K6 provenance types]
---

# Close — `@hauska/atom-contract@1.4.0` npm publish

## Result

**PASS — `@hauska/atom-contract@1.4.0` is live on npm.**

Registry verification:

```text
npm view @hauska/atom-contract version
1.4.0
```

## Publish path (canonical for hauska-sdk account)

**Staged publishing + Windows Hello / passkey** — not granular tokens.

| Step | Command | Outcome |
|---|---|---|
| 1 | `.\publish-1.4.0.ps1` | Removes stale `~/.npmrc` token, `npm login --auth-type=web`, `npm stage publish` |
| 2 | `.\publish-approve-1.4.0.ps1 -StageId 74b600c6-587f-41d1-a9ea-0ee796999ba2` | Browser auth + Windows PIN → approved and published |

Stage id: `74b600c6-587f-41d1-a9ea-0ee796999ba2`  
Shasum: `d9460666dee603b536611d9b50ab29000fa4bb2d`  
Staged by: `hauska-sdk`

## What shipped

- `@hauska/atom-contract/read-contract` subpath
- `WidthedConfidence`, `ThreeAxisConfidence`, `ReadContract`, `CalibrationProvenance`, `ModelAttributionStamp`
- Main barrel unchanged; v1.3.0 consumers unaffected until opt-in

## What failed (documented for next time)

Granular access tokens + `NODE_AUTH_TOKEN` + direct `npm publish` → persistent `401` on `whoami`. Root cause: account uses `auth-type=web` (passkey 2FA) and expired `_authToken` in `~/.npmrc`. Same failure mode as 1.3.0 pre-staging.

**Operator docs updated:** `docs/npm-publish-automation.md`

## Consumer pin

```bash
npm install @hauska/atom-contract@^1.4.0
```

```ts
import { createReadContract } from "@hauska/atom-contract/read-contract";
```

## Unblocked

Wave 2 F4 propagation across cortex-api, MCP, Cortex, extension, and map can pin the canonical read-contract type from npm.

## Blocker

None.
