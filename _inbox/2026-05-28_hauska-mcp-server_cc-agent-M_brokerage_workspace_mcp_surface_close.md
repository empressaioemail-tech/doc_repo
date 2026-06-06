# Close — brokerage workspace MCP surface (cc-agent-M)

Date: 2026-05-28  
Repo: `hauska-mcp-server`  
Dispatch: `2026-05-28_cc-agent-M_brokerage_workspace_mcp_surface`

## Outcome

Completed the MCP parity slice for Brokerage V1 workspace retrieval by adding these tools:

- `list_property_workspaces`
- `get_property_workspace`
- `list_workspace_share_edges`

Implemented as read-only MCP surface changes only (no write paths, billing logic, or UI work).

## Access and visibility enforcement

- Tool handlers now require an identified authenticated caller (`key_id`) so owner/collaborator access can be enforced by backend retrieval routes.
- `list_workspace_share_edges` defaults `consent_visible_only=true`, enforcing consent-aware edge visibility unless explicitly overridden.
- Responses return stable ids/timestamps from backend payloads and compact evidence refs through envelope provenance atoms.

## PR URL

- https://github.com/empressaioemail-tech/hauska-mcp-server/pull/23

## SHA

- Commit: `abbe1e64ae45defba4f59d8bded0b8bedb30c900`

## Files changed

- `src/tools.ts`
- `src/legacy-client.ts`
- `src/atom-shape.ts`
- `src/request-context.ts`
- `tests/legacy-client.test.ts`
- `tests/atom-shape.test.ts`

## Sample tool responses

### `list_property_workspaces`

```json
{
  "data": {
    "workspaces": [
      {
        "workspaceId": "ws_1",
        "addressLabel": "251 Cool Water Dr, Bastrop, TX",
        "listingUrls": ["https://example.com/listing/1"],
        "ownerUserId": "u_owner",
        "collaboratorUserIds": ["u_col"],
        "lastActivityAt": "2026-05-28T00:00:00Z",
        "createdAt": "2026-05-27T00:00:00Z",
        "updatedAt": "2026-05-28T00:00:00Z",
        "role": "owner",
        "evidenceRefs": [
          {
            "refId": "ref_atom_1",
            "kind": "atom",
            "atomDid": "did:hauska:brief-run:ws_1/run_1",
            "observedAt": "2026-05-28T00:00:00Z"
          }
        ]
      }
    ]
  },
  "atoms": [
    {
      "did": "did:hauska:brief-run:ws_1/run_1",
      "entityType": "atom",
      "entityId": "ref_atom_1"
    }
  ]
}
```

### `get_property_workspace`

```json
{
  "data": {
    "workspace": {
      "workspaceId": "ws_1",
      "ownerUserId": "u_owner",
      "collaboratorUserIds": ["u_col"],
      "createdAt": "2026-05-27T00:00:00Z",
      "updatedAt": "2026-05-28T00:00:00Z",
      "briefRuns": [],
      "attachments": []
    }
  },
  "atoms": []
}
```

### `list_workspace_share_edges`

```json
{
  "data": {
    "edges": [
      {
        "edgeId": "edge_1",
        "workspaceId": "ws_1",
        "fromUserId": "u_owner",
        "toUserId": "u_col",
        "sharedAt": "2026-05-28T00:00:00Z",
        "consentVisible": true,
        "observedAt": "2026-05-28T00:00:00Z"
      }
    ]
  },
  "atoms": [
    {
      "did": "legacy:evidence:share_evt_1",
      "entityType": "share-edge",
      "entityId": "share_evt_1"
    }
  ]
}
```

## Test output

Ran in `P:/hauska-mcp-server`:

- `npm run lint` ✅
- `npm test` ✅

Key result:

- `tests 224`
- `pass 224`
- `fail 0`
- `duration_ms 1087.9845`
