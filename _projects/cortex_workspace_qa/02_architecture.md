---
id: cortex_workspace_qa/02_architecture
title: Architecture — cortex tile workspace
status: active
last_updated: 2026-07-01
applies_to: design-accelerator
---

# Architecture — cortex tile workspace

## Key files

| Path (relative to `P:\legacy-design-tools`) | Role |
|------|------|
| `artifacts/codex-reviewer-qa/src/tile-shell/CortexShell.tsx` | Shell root: wraps providers, SpaceBar, GridCanvas |
| `artifacts/codex-reviewer-qa/src/tile-shell/tiles.tsx` | TILE_REGISTRY: all TileDef entries |
| `artifacts/codex-reviewer-qa/src/tile-shell/layouts.ts` | LAYOUTS map and gridArea helpers |
| `artifacts/codex-reviewer-qa/src/tile-shell/components/GridCanvas.tsx` | CSS grid renderer + ResizeHandle |
| `artifacts/codex-reviewer-qa/src/tile-shell/components/TileWrapper.tsx` | Tile chrome (header, close, fullscreen) |
| `artifacts/codex-reviewer-qa/src/tiles/` | Individual tile components by category |
| `artifacts/codex-reviewer-qa/src/index.css` | CSS variables including --surface-1, --border-subtle |
| `artifacts/api-server/src/routes/planReviewBff.ts` | All BFF routes at /api/plan-review/* |
| `artifacts/api-server/src/lib/engagementOwnership.ts` | loadReviewerBffEngagement() + loadEngagementForSession() |
| `artifacts/codex-reviewer-qa/src/lib/devSession.ts` | Sets audience="internal" cookie for local dev |

## Shell component tree

```
CortexShell
  EngagementProvider     // engagementId + all report results
    SpatialProvider      // overlay stack + pushOverlay(overlay)
      CodeProvider       // jurisdictionKey + atom chain
        CortexShellInner
          SpaceBar       // preset pills + "Save this space"
          GridCanvas     // CSS grid + tile rendering
            TileWrapper  // chrome per tile (header, close, fullscreen)
              <TileComponent>  // IntakeQueueTile, ComplianceRunTile, etc.
```

## TileDef type

```typescript
type TileDef = {
  id: string
  label: string
  category: TileCategory      // 'Compliance' | 'Site Analysis' | 'Property Intel' | ...
  engine?: 'engagement' | 'spatial' | 'code'
  el: () => React.ReactElement
  status: TileStatus          // 'live' | 'degraded' | 'partial' | 'planned'
  degradedReason?: string
}
```

Priority tiles (full UI): `intake-queue`, `compliance-run`, `letter`, `map`, `topography`, `drainage`, `hydrology`, `subsurface`. All others use `makeStubTile("id")` which renders a placeholder with the tile label.

## Preset spaces

```typescript
{ id: "plan-review",       label: "Plan Review",       tileIds: ["intake-queue","compliance-run","letter","map"], layoutId: "4" }
{ id: "site-analysis",     label: "Site Analysis",     tileIds: ["topography","drainage","hydrology","map"], layoutId: "4" }
{ id: "property-intel",    label: "Property Intel",    tileIds: ["property-brief","hazard-profile","encumbrance-report","map"], layoutId: "3r" }
{ id: "design-accelerator",label: "Design Accelerator",tileIds: ["sheet-extraction","response-tasks","map"], layoutId: "3l" }
```

## LAYOUTS map

```typescript
{ "1": '"a"', "2h": '"a b"', "2v": '"a" / "b"',
  "3l": '"a b" / "a c"', "3r": '"a b" / "c b"',
  "4": '"a b" / "c d"', "6": '"a b c" / "d e f"' }
```

The "/" is the row separator in the grid-template shorthand format. GridCanvas strips it before applying as `gridTemplateAreas` CSS property (which uses only newline separators, not "/").

## BFF routes

All routes live at `artifacts/api-server/src/routes/planReviewBff.ts` and mount at `/api/plan-review/*`.

| Method | Path | Auth model | Notes |
|--------|------|------------|-------|
| GET | /queue | unscoped | All engagements; no owner filter |
| GET | /engagements/:id | reviewer bypass | loadReviewerBffEngagement() — no owner filter (PR #207) |
| POST | /engagements/:id/reports/:type/run | reviewer bypass | Triggers compliance run |
| GET | /engagements/:id/reports/:type | reviewer bypass | Fetches report results |
| GET | /admin/functions | internal | Returns tile function registry with status |
| PATCH | /engagements/:id/findings/:findingId | reviewer bypass | Accept/edit/reject finding |
| POST | /engagements/:id/letter | reviewer bypass | Generate letter draft |
| GET | /engagements/:id/letter | reviewer bypass | Fetch letter |

## Auth model — reviewer posture

The cortex workspace is an internal reviewer tool, same posture as the hauska-map command center. It must see all engagements regardless of who owns them in the DB.

The customer-facing API applies `engagementOwnerWhere(req.session)` which scopes reads to the session owner. Anonymous sessions own nothing, so they get empty results.

The reviewer bypass: `loadReviewerBffEngagement(id)` runs a direct DB query with no owner filter. Applied to all plan-review BFF engagement routes.

devSession bootstrap: `codex-reviewer-qa/src/lib/devSession.ts` sets a `pr_session` cookie with `{ audience: "internal", userId: "dev-reviewer" }` on page load. api-server reads this cookie and applies the reviewer posture in development mode.

## Map tile (iframe embed)

```
Map tile → iframe → VITE_HAUSKA_MAP_URL ?? "https://map.hauska.io/command-center"
```

Receives spatial overlays via postMessage `{ type: "ADD_OVERLAY", overlay }` when SpatialProvider overlays change. Centered on the current engagement's parcel when an engagement is selected.

When VITE_HAUSKA_MAP_URL is not set, the iframe loads the broken-image placeholder. Set in `.env.local` for local dev:

```
VITE_HAUSKA_MAP_URL=http://localhost:<hauska-map-port>/command-center
```

Or let it fall back to the production URL.
