---
id: dispatches/2026-07-01_hauska-mcp-server_cc-agent-M_track-E-compose-workspace
title: Track E — add compose_workspace tool to Hauska MCP server
status: active
dispatched: 2026-07-01
agent: cc-agent-M
repo: empressaioemail-tech/hauska-mcp-server
track: E
depends_on: Track C close report in _inbox (tile capability fields must be stable)
unblocks: adaptive interface, external builder discoverability
---

# Track E — compose_workspace MCP tool

Add the `compose_workspace` tool to the Hauska MCP server. This tool takes a natural language intent and an optional engagement context, reads the tile capability registry from the cortex-api, selects appropriate tiles, and returns a `WorkspaceComposition` object. This is the protocol-level adaptive interface.

Read `P:\doc_repo\_architecture_homes\shared_surface_principle.md` before starting. Also read the Track C close report in `P:\doc_repo\_inbox\` to understand what capability fields are now on TileDef.

**Important:** cc-agent-M does not have access to `P:\doc_repo`. Paste this dispatch content directly into the M window.

## Context

The Hauska MCP server already has 62 tools across four product gates (public / codex / reporting / map). This dispatch adds one new tool under the `reporting` gate: `compose_workspace`.

The tile registry is already exposed by the cortex-api at `GET /api/plan-review/admin/functions`. After Track C, this endpoint returns the full TileDef including `requires`, `produces`, `modes`, and `mcpTools` fields.

## Success definition

An AI agent calls `compose_workspace({ intent: "show me compliance and hazard for 146 S Fredricksburg", engagementId: "cc2e0a30..." })` via MCP and receives a `WorkspaceComposition` object with a tile list, layout, and reasoning. The object can be passed directly to the `@hauska/tile-shell` `CortexShell` component to render the workspace.

## Tool specification

```typescript
// Tool name: compose_workspace
// Product gate: reporting (requires reporting product key)
// Input schema:
{
  intent: string,                      // natural language — what the user wants to see
  engagementId?: string,               // optional — scopes tile selection to what's possible
  availableTileIds?: string[],         // optional — override the full registry
  maxTiles?: number,                   // optional, default 4 — max tiles to include
}

// Output schema (WorkspaceComposition):
{
  tiles: string[],                     // ordered tile IDs
  layoutId: string,                    // key from LAYOUTS map: "1"|"2h"|"2v"|"3l"|"3r"|"4"|"6"
  engagementId?: string,               // echoed back if provided
  why: string,                         // agent reasoning, shown in the undo banner
}
```

## Phase 1 — implement the tool

Spawn one build sub-agent, one adversarial review sub-agent.

### 1A — fetch tile registry from cortex-api

The tool needs the tile registry at call time. Fetch it from cortex-api:

```typescript
async function getTileRegistry(cortexApiUrl: string, apiKey: string): Promise<TileDef[]> {
  const res = await fetch(`${cortexApiUrl}/api/plan-review/admin/functions`, {
    headers: { 'X-Hauska-Key': apiKey }
  })
  if (!res.ok) throw new Error(`Registry fetch failed: ${res.status}`)
  const data = await res.json()
  return data.functions  // array of TileDef
}
```

The `cortexApiUrl` and a server-side api key should be env vars in the MCP server (`CORTEX_API_URL`, `CORTEX_INTERNAL_KEY`).

### 1B — tool implementation

```typescript
// src/tools/compose_workspace.ts

import type { WorkspaceComposition, TileDef } from '@hauska/tile-shell'

export const composeWorkspaceTool = {
  name: 'compose_workspace',
  description: 'Select and arrange tiles for the Hauska cortex workspace based on a natural language intent. Returns a WorkspaceComposition that can be passed to the tile shell.',
  inputSchema: {
    type: 'object',
    properties: {
      intent: { type: 'string', description: 'What the user wants to see or accomplish' },
      engagementId: { type: 'string', description: 'Optional engagement to pre-load' },
      availableTileIds: { type: 'array', items: { type: 'string' }, description: 'Optional subset of tile IDs to consider' },
      maxTiles: { type: 'number', description: 'Maximum tiles to include, default 4' },
    },
    required: ['intent'],
  },
  async execute({ intent, engagementId, availableTileIds, maxTiles = 4 }: ComposeWorkspaceInput) {
    const registry = await getTileRegistry(process.env.CORTEX_API_URL!, process.env.CORTEX_INTERNAL_KEY!)

    // Filter to only live tiles (not planned or degraded without a good reason)
    let candidates = registry.filter(t => t.status === 'live' || t.status === 'partial')

    // If availableTileIds provided, restrict to that set
    if (availableTileIds?.length) {
      candidates = candidates.filter(t => availableTileIds.includes(t.id))
    }

    // If engagementId provided, filter to tiles whose requires are satisfied
    if (engagementId) {
      // Fetch engagement context to know what's available
      const engagement = await fetchEngagement(engagementId)
      candidates = candidates.filter(t => isSatisfied(t.requires, engagement))
    }

    // Use the LLM to select tiles based on intent
    // The tool itself is called by an LLM, but we use a structured prompt to pick tiles
    const selected = await selectTilesForIntent(intent, candidates, maxTiles)

    // Pick layout based on tile count
    const layoutId = pickLayout(selected.length)

    return {
      tiles: selected.map(t => t.id),
      layoutId,
      engagementId,
      why: selected.map(t => t.label).join(', ') + ` — selected for: ${intent}`,
    } satisfies WorkspaceComposition
  }
}

function isSatisfied(requires: TileDef['requires'], engagement: EngagementContext): boolean {
  if (requires.engagementId && !engagement.id) return false
  if (requires.uploadedDocuments && !engagement.hasDocuments) return false
  if (requires.completedFindings && !engagement.hasFindings) return false
  if (requires.apn && !engagement.apn) return false
  return true
}

function pickLayout(count: number): string {
  if (count === 1) return '1'
  if (count === 2) return '2h'
  if (count === 3) return '3l'
  if (count === 4) return '4'
  return '6'
}

async function selectTilesForIntent(intent: string, candidates: TileDef[], max: number): Promise<TileDef[]> {
  // Rank candidates by relevance to intent using keyword matching as a fast path.
  // The LLM calling this tool handles the high-level reasoning — this layer just
  // filters and ranks what is mechanically possible.
  const keywords = intent.toLowerCase().split(/\s+/)
  const scored = candidates.map(t => ({
    tile: t,
    score: keywords.filter(k =>
      t.label.toLowerCase().includes(k) ||
      t.category.toLowerCase().includes(k) ||
      (t.mcpTools ?? []).some(tool => tool.includes(k))
    ).length
  }))
  scored.sort((a, b) => b.score - a.score)

  // Always include map tile if spatial context is relevant
  const hasSpatial = keywords.some(k => ['map','location','parcel','zone','flood','site'].includes(k))
  const mapTile = candidates.find(t => t.id === 'map')
  const top = scored.slice(0, hasSpatial && mapTile ? max - 1 : max).map(s => s.tile)
  if (hasSpatial && mapTile && !top.find(t => t.id === 'map')) top.push(mapTile)

  return top.slice(0, max)
}
```

### 1C — register the tool

In the MCP server's tool registry, add `composeWorkspaceTool` under the `reporting` product gate. Follow the existing pattern for tool registration in the server.

### 1D — add env vars

Add to the MCP server's deployment config:
- `CORTEX_API_URL` — the cortex-api production URL (`https://cortex-api-tds7av26va-uc.a.run.app`)
- `CORTEX_INTERNAL_KEY` — a server-to-server key for the internal route (check if `/api/plan-review/admin/functions` requires auth; if it does, wire the key; if not, no key needed)

### Adversarial review — Phase 1

Confirm:
- Tool registers under the `reporting` gate (not public — requires a product key)
- Input schema is valid MCP tool schema
- Output is a valid `WorkspaceComposition` shape
- `isSatisfied` correctly filters tiles when engagement context is missing fields
- `pickLayout` returns a valid LAYOUTS key for counts 1-6
- The tile registry fetch does not block server startup (it is called at tool invocation time, not at startup)
- The tool degrades gracefully if cortex-api is unreachable (returns a named error, not a crash)

---

## Phase 2 — verify end to end

Test the tool via MCP inspector (E1 in the hauska-map command center):

```
Tool: compose_workspace
Input: { "intent": "show me compliance and hazard for a plan review", "engagementId": "cc2e0a30-412a-46b8-b680-38ebfbed5d4a" }
Expected output: {
  "tiles": ["compliance-run", "hazard-profile", "document-viewer", "map"],
  "layoutId": "4",
  "engagementId": "cc2e0a30-...",
  "why": "..."
}
```

Also test without engagementId (should return a valid composition without engagement-requiring tiles).

---

## Close report

File at `P:\doc_repo\_inbox\2026-07-01_hauska-mcp-server_cc-agent-M_track-E-close.md`:

```markdown
---
title: Track E close — compose_workspace MCP tool
date: 2026-07-01
agent: cc-agent-M
track: E
---

## Tool registered under gate
<reporting>

## End-to-end test result
<paste MCP inspector output>

## Tile registry fetch working?
<yes/no — cortex-api /admin/functions reachable>

## Env vars needed
CORTEX_API_URL: <value set>
CORTEX_INTERNAL_KEY: <needed yes/no>

## Known limitations
<e.g. keyword scoring is a fast path — full LLM ranking is a follow-on>

## Rollback
<prior MCP server commit>
```
