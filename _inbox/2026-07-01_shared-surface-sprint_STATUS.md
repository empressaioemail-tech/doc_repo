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
| A | hauska-map | RUNNING (v2, React package) | - | - | Operator chose full React package model 2026-07-01. Repo is vanilla JS, so this ports working E6 MapLibre logic into a React+TS @hauska/map-renderer package. OffscreenCanvas worker spiked first (agent flagged it as unproven); falls back to supported CSP-safe render inside the package if the worker path fails. Hard gate: map must actually render before merge. CONSEQUENCE: DNS/CNAME now UNNECESSARY (package = no running server). CONSEQUENCE: Track C MapTile will import the package, overriding the cortex tile dispatch's iframe instruction. |
| B | legacy-design-tools | COMPLETE — merged | #210 | n/a (infra) | 5 @hauska packages scaffolded; CI green (Typecheck+Test); reviewer PASS on all 6 criteria; codex-reviewer-qa still starts. ADR-024 filed. |
| C | legacy-design-tools | RUNNING (Wave 2) | - | - | tile migration; map tile imports @hauska/map-renderer if published else Mapbox fallback; produces TileDef capability fields for Track E; rebases before merge (shares TILE_REGISTRY with D) |
| D | legacy-design-tools | RUNNING (Wave 2) | - | - | document-viewer; PDF/DWG/annotation; engagement_annotations DB migration; APS AUTH-001 fallback to LibreOffice; rebases before merge (shares TILE_REGISTRY with C) |
| E | hauska-mcp-server | QUEUED | - | - | waits Track C (needs TileDef capability fields) |
| F | legacy-design-tools | QUEUED | - | - | waits Track D; confidence must be kind:'asserted' |
| G | legacy-design-tools | QUEUED | - | - | waits Track F; final deliverable export |

## Findings for the operator

1. DNS action is LAST and likely OPTIONAL. Track A makes the map an importable package
   (`@hauska/map-renderer`), so the cortex workspace map tile needs no running map server.
   `hauska-map` is not currently deployed as a Cloud Run service. Track A's close report will
   state definitively whether any service URL exists to CNAME `map.hauska.io` at, or whether the
   map is package-only and no DNS action is needed. Do nothing on DNS until then.

2. Track A "push owed" note was stale — the E6 work is already on origin/main.

## The one manual step (do at the very end, only if Track A says a service exists)

```bash
gcloud run services describe hauska-map --project hauska-prod-497015 --region us-central1 --format 'value(status.url)'
# then create CNAME:  map.hauska.io -> <that URL without https://>
```
