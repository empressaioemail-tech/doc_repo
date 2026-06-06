---
id: 2026-05-28_legacy-design-tools_cc-agent-C_gtm_engine_observation_place_api_close
title: Close report — GTM Track C (place API + MCP observation)
date: 2026-05-28
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/gtm-engine-place-api
---

# Close report — cc-agent-C GTM Track C

## PR

- **URL:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/135
- **HEAD:** `30b96fb` (`feat(brokerage): GTM Track C — place API, MCP observation, error taxonomy`)
- **Base stack:** `2f41308` on `cortex/property-brief-lay-surface` (Dispatch A snapshots / coverage)

## Workspace hygiene (planner)

Main clone `P:\legacy-design-tools` was **refused** for edits:

- **Branch at HEAD:** `cortex/property-brief-lay-surface` (not dispatch branch)
- **Uncommitted alien work** (encumbrances, `EncumbrancesPanel`, `pdfText.ts`, partial GTM edits)

Work executed in dedicated worktree: `P:\ldt-gtm-engine-place-api` → branch `cortex/gtm-engine-place-api`.

## Deliverables

### C1 — Place HTTP API

| Route | Notes |
|-------|--------|
| `POST /api/brokerage/v1/place/resolve` | `address` or `lat`/`lng` → `placeKey`, `jurisdiction_key`, `ll_uuid?`, `workspaceDid`, geocode confidence |
| `GET /api/brokerage/v1/place/:placeKey/layers` | Snapshot-first via `fetchBrokerageSiteContext`; provenance + DID refs |
| `GET /api/brokerage/v1/place/:placeKey/dossier` | Max 3 code `inlineRefs` + parcel/zoning + FEMA summaries; `asOf` + per-field citations |

Implementation: `artifacts/api-server/src/routes/brokeragePlace.ts`, `lib/placeResolve.ts`, `lib/placeDossier.ts`.

### C2 — GTM MCP observation

- **Migration:** `lib/db/drizzle/0031_gtm_mcp_observation.sql` (dispatch asked `0029`; `0029` is `brokerage_workspace_wallet` — used **0031**)
- **`POST /api/brokerage/v1/gtm/mcp-event`** — `mcp_tool_call`, `mcp_connect`, `mcp_error`, `mcp_docs_clicked`; payload `tool_name`, `error_class`, `jurisdiction_key`, `api_key_hash` (sha256 prefix)
- **Digest:** `sourceSurfaceCounts`, `mcpTopTools`, `mcpCallerSplit` (internal vs external by key hash)

### C3 — Unified error taxonomy

- `artifacts/api-server/src/lib/gtmErrorClass.ts`
- Wired on brief `400` validation and place `geocode_miss` / `validation_error`

### C4 — Coverage host

- **Public API:** `GET /api/brokerage/v1/coverage` (no auth) + `brokerageCoveragePublicCors` for `*.hauska.dev`
- **75b `status` field** mapped from tier (`blocked_partnership` → `blocked`)
- **Static page:** `GET /api/brief-coverage` → `artifacts/api-server/public/brief-coverage.html`
- **Prod DNS:** map `brief.hauska.dev/coverage` → cortex-api `/api/brief-coverage` (or reverse-proxy `/api/brokerage/v1/coverage` for JSON embed)

### C5 — Extension upsell

`hauska-brief-extension` not present on workstation. Manual merge snippet:

```html
<footer>
  <a
    href="https://hauska.dev/mcp?utm_source=brief-extension"
    target="_blank"
    rel="noopener"
    id="hauska-mcp-upsell"
  >Build on this data → Hauska MCP</a>
</footer>
```

```javascript
document.getElementById('hauska-mcp-upsell')?.addEventListener('click', () => {
  // existing gtm client after consent
  recordEvent({
    eventType: 'mcp_docs_clicked',
    sourceSurface: 'extension',
    payload: { utm_source: 'brief-extension' },
  });
});
```

## Sample API shapes (keys redacted)

**Resolve (Bastrop pilot):**

```json
{
  "placeKey": "coord:30.11000:-97.32000",
  "jurisdiction_key": "bastrop_tx",
  "ll_uuid": "…",
  "workspaceDid": "did:hauska:property-workspace:…",
  "geocode": {
    "lat": 30.11,
    "lng": -97.32,
    "city": "Bastrop",
    "state": "TX",
    "confidence": "high"
  }
}
```

**Dossier excerpt:**

```json
{
  "placeKey": "coord:30.11000:-97.32000",
  "jurisdiction_key": "bastrop_tx",
  "asOf": "2026-05-28T…",
  "layers": [
    {
      "layerKind": "regrid-parcel",
      "provenance": "snapshot",
      "citation": { "source": "place_layer_snapshot", "asOf": "2026-05-01T00:00:00.000Z" }
    }
  ],
  "inlineRefs": [ "… max 3 code + optional parcel …" ]
}
```

**Digest snippet (after `mcp-event`):**

```json
{
  "mcpTopTools": [{ "tool_name": "resolve_place", "count": 1 }],
  "mcpCallerSplit": { "external": 0, "internal": 1 },
  "sourceSurfaceCounts": [{ "sourceSurface": "mcp", "count": 1 }]
}
```

## Tests

| Command | Status |
|---------|--------|
| `pnpm --filter @workspace/api-server run test -- brokerageGtm` | **Not run locally** — `DATABASE_URL` unset in agent shell |
| `pnpm --filter @workspace/api-server run test -- place` | **Not run locally** — same |

Suites added/updated: `place.test.ts`, `place.snapshots.integration.test.ts`, `brokerageGtm.test.ts`, `brokerageBrief.test.ts` (errorClass).

**CI:** await PR #135 checks.

## Migration / fixture

Operator / CI with DB:

```bash
cd lib/db
pnpm db:push:test    # applies 0031 + prior
pnpm db:dump:test-fixture
```

**Local agent:** migration file written; fixture refresh **not executed** (no `DATABASE_URL` in environment).

## Blockers (verbatim)

1. **Main clone hygiene:** alien uncommitted work on `P:\legacy-design-tools` — see git status at dispatch start (encumbrances + GTM partial edits on wrong branch).
2. **Local test DB:** `DATABASE_URL must be set. Did you forget to provision a database?` when running vitest in agent shell.
3. **Extension repo:** not on workstation — C5 snippet only (above).

## Extension PR

None (repo absent).

## Next (operator)

- Merge PR #135 after CI green (rebase onto `main` if place-graph PR # landed separately)
- Apply `0031` on prod cortex-api + fixture refresh on final schema branch
- Wire `hauska-mcp-server` to `POST /api/brokerage/v1/gtm/mcp-event` (cc-agent-M)
- DNS: `brief.hauska.dev/coverage` → `/api/brief-coverage`
