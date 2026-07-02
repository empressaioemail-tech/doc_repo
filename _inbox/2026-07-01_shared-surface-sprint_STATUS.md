---
id: inbox/2026-07-01_shared-surface-sprint_STATUS
title: Shared Surface Sprint — live status (autonomous run)
status: active
last_updated: 2026-07-01
---

# Shared Surface Sprint — live status

Autonomous multi-agent execution driven by the doc_repo planning agent. The courier model
(hand-carry prompts into separate Cursor windows, coordinate via _inbox/) is collapsed: the
planner acts as map-agent + cc-agent-C + cc-agent-M, spawning build + adversarial-review
sub-agents per track/phase, merging its own PRs on a green adversarial verdict, and deploying.

Authority granted 2026-07-01: FULL autonomy (build, adversarial review, merge to main, deploy
to prod). ADR-023 to be written + committed after Track B verifies. Only manual operator action
is the DNS step (see below), scheduled LAST and possibly moot.

## Merge / deploy policy

Merge a PR only after the final-phase adversarial reviewer passes AND CI checks are green;
--admin fallback if branch protection blocks; otherwise HALT and leave PR open with diagnosis.
Deploys are canary + smoke before traffic shift. A track that fails its gate after 3 repair
cycles halts that track and its dependents; independent tracks keep moving.

## Wave graph

```
Wave 1 (parallel):   A (hauska-map)        B (legacy-design-tools scaffold)
Wave 2 (parallel):   C (tile migration)    D (document-viewer)      [both wait on B]
Wave 3:              E (mcp compose_workspace) [waits C]   F (AI annotation) [waits D]
Wave 4:              G (print/export deliverable)          [waits F]
```

## Track status

| Track | Repo | Status | PR | Deploy | Notes |
|-------|------|--------|----|--------|-------|
| A | hauska-map | COMPLETE — merged | #2 | package-only | @hauska/map-renderer@0.1.0 React+TS package; render proven in headless Chrome (live WebGL2, all fixture layers, zero CSP/worker exceptions). OffscreenCanvas worker spiked and REJECTED (MapLibre v5 Map has no OffscreenCanvas option) -> main-thread canvas fallback (working E6 path). DNS/CNAME confirmed UNNECESSARY. NOT published to npm (no credential available) -> Track C uses Mapbox fallback; publish + import swap is a credential-gated follow-up (see bottom). |
| B | legacy-design-tools | COMPLETE — merged | #210 | n/a (infra) | 5 @hauska packages scaffolded; CI green (Typecheck+Test); reviewer PASS on all 6 criteria; codex-reviewer-qa still starts. ADR-024 filed. |
| C | legacy-design-tools | COMPLETE — merged | #211,#213 | cortex-api-00267-zol @100% | tile migration; 46/46 TileDef entries have all 4 capability fields; every tile error-boundary-wrapped; map tile on Mapbox fallback (swap seam in MapTile.tsx pending map-renderer publish). Reviewer caught+fixed 2 infra defects (workspace export condition, vite resolver). |
| D | legacy-design-tools | COMPLETE — merged | #212 | cortex-api-00267-zol @100% | document-viewer; migration 0048_engagement_annotations APPLIED to live Neon (table LIVE -> Track F unblocked); APS fell back to named 501 aps_not_configured (no creds/LibreOffice), DWG-3D deferred. |
| C-bridge | legacy-design-tools | RUNNING | - | - | Exposes the 46-entry capability registry over HTTP (new /admin/tile-registry route + shared React-free data module) so Track E's compose_workspace can fetch it. Track E dispatch's /admin/functions endpoint is status-only. Blocks E. |
| E | hauska-mcp-server | QUEUED | - | - | waits C-bridge (needs the live capability-registry endpoint + auth); different service from cortex-api so runs parallel to F |
| F | legacy-design-tools | QUEUED | - | - | unblocked by D, but waits C-bridge DEPLOY to avoid cortex-api canary race; confidence must be kind:'asserted' |
| G | legacy-design-tools | QUEUED | - | - | waits Track F; final deliverable export |

## Findings for the operator

1. DNS action is DEAD. Track A shipped the map as an importable React package
   (`@hauska/map-renderer@0.1.0`), so the cortex workspace map tile needs no running map server
   and no `map.hauska.io` CNAME. The one manual action you were originally told about no longer
   exists.

2. Track A "push owed" note was stale — the E6 work was already on origin/main.

3. NEW residual (replaces DNS): `@hauska/map-renderer` is not on npm and there is no npm
   credential in this environment or in CI (org/repo Actions secrets empty; local npm 401), so I
   cannot publish it autonomously. Track C therefore ships the map tile on the functional Mapbox
   fallback behind the same TileDef interface, with a one-line import seam. This does not block
   the sprint — the map works either way. See the follow-up step below.

## The one residual operator action (optional, non-blocking — do whenever)

Not required for the sprint to be done and working. It swaps the workspace map tile from the
Mapbox fallback to the unified `@hauska/map-renderer` package. Provide an npm credential for the
`@hauska` scope, then publish and swap:

```bash
# from a machine with npm auth for the @hauska scope:
cd hauska-map/packages/map-renderer
npm publish --access public          # publishes @hauska/map-renderer@0.1.0
# then in legacy-design-tools, the map tile's import seam swaps from the Mapbox fallback
# to: import { FloatingMap } from "@hauska/map-renderer"   (props: center, visibleLayers,
# parcel, onParcelSelect, floating={false}; peer deps react/react-dom >=18)
```

Alternatively, set an `NPM_TOKEN` Actions secret on hauska-map and I can add a publish workflow
and automate it on the next session.
