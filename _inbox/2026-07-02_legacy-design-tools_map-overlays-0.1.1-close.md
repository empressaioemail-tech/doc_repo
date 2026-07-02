---
title: Map overlays 0.1.1 close — @hauska/map-renderer bump draws spatial overlays
date: 2026-07-02
agent: cc-agent (lead, autonomous)
track: Phase 2 map-overlays (Cortex Workspace)
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 223
merge_commit: 6d5fdbe142b98c97c2f41dcbb96cc954c884eeda
deployed_revision: cortex-api-00286-xic
service_url: https://cortex-api-tds7av26va-uc.a.run.app
---

# Map overlays 0.1.1 close — @hauska/map-renderer bump draws spatial overlays

Status COMPLETE. Bumped `@hauska/map-renderer` from `^0.1.0` to `^0.1.1` in `packages/cortex-tiles` so the cortex workspace map now draws Topography / Drainage / Hydrology spatial overlays. 0.1.1 adds the live `setOverlays` renderer and wires `FloatingMap`'s `overlays` prop to it; the overlays seam (`overlays` prop + `toMapOverlays` mapping in `MapTile.tsx`) was already staged in PR #220, so this was the one-change light-up the prior close report called out. Gated by a build sub-agent (PASS) and an adversarial review sub-agent (PASS-WITH-NITS). Merged (PR #223, squash `6d5fdbe`), deployed via the cortex-api canary sequence, production healthy at 100 percent on `cortex-api-00286-xic`.

## The bump

Exactly one package pins `@hauska/map-renderer`: `packages/cortex-tiles/package.json`, `^0.1.0` -> `^0.1.1`. `pnpm install` updated the lockfile: importer spec `^0.1.1`, resolution `@hauska/map-renderer@0.1.1`, installed store dir `@hauska+map-renderer@0.1.1__...`. Zero `map-renderer@0.1.0` references remain in the lockfile (grep count 0). The only lingering "0.1.0" string in the repo is the explanatory comment in `MapTile.tsx` describing what 0.1.0 did.

`@hauska/map-renderer` is an external npm dep (not a workspace package), so it is not in the `workspace` export-condition path — it resolves from node_modules normally. It is already listed in `pnpm-workspace.yaml` `minimumReleaseAgeExclude`, so the `minimumReleaseAge: 1440` (24h) publish-age hold did not block installing the freshly published 0.1.1. No `.npmrc` / esbuild-conditions / `--set-secrets` changes were needed — the deploy env-vars and secrets are baked in the workflow and unchanged.

```
$ npm view @hauska/map-renderer dist-tags     -> { latest: '0.1.1' }
$ npm view @hauska/map-renderer versions       -> [ '0.1.0', '0.1.1' ]

pnpm-lock.yaml importer:
  '@hauska/map-renderer':
    specifier: ^0.1.1
    version: 0.1.1(@types/pg@8.18.0)(pg@8.20.0)(react-dom@19.1.0(react@19.1.0))(react@19.1.0)
grep -c 'map-renderer@0.1.0' pnpm-lock.yaml  -> 0
```

## Overlays wiring confirmation

The staged seam consumes the real 0.1.1 API with no placeholder — no rewiring was required, only the version bump. `MapTile.tsx` imports `FloatingMap`, `OverlaySpec` (aliased `MapOverlaySpec`), and `ParcelSelection` from `@hauska/map-renderer`; `toMapOverlays` maps the tile-shell SpatialProvider overlay stack `{id,kind,label,geojson?,opacity?}` onto the map-renderer `OverlaySpec` `{layerKey: kind||id, geojson, visible:true, paint:{'fill-opacity':opacity}}`; and `FloatingMap` receives `overlays={mapOverlays}`.

Against the published 0.1.1 `index.d.ts`: `LayerKey = string` (so `layerKey` accepts any string), `geojson: unknown`, `visible?: boolean`, and `paint?: Record<string, unknown>` with `fill-opacity` explicitly listed as a permitted paint key. The mapping typechecks clean.

Overlay flow to the map, confirmed by grep of the tile-shell SpatialProvider and the spatial tiles:
- Topography tile pushes `kind:'topography-contours'` (opacity 0.7).
- Drainage tile pushes `kind:'hydrology-flow'` and `kind:'drainage-zones'` (opacity 0.4).
- Hydrology tile pushes `kind:'hydrology-flow'`.

Each `kind` becomes the map `layerKey` via `toMapOverlays`. The renderer keys off geometry + choropleth, not the registry, so `drainage-zones` (not a registry-key literal) still draws — it just would not get a registry-driven legend entry.

## Render evidence (and honest limit)

The decisive proof that overlays now draw is in the published 0.1.1 `dist/index.js`: `FloatingMap` destructures `overlays`, calls `renderer.setOverlays(overlays ?? [])` on mount, and re-applies on a `useEffect(..., [overlays])` on every prop change; `setOverlays` -> `applyOverlays` -> `reconcileOverlays(map, specs, keys)` -> `map.addSource` / `map.addLayer` with the consumer's GeoJSON and paint. `setOverlays` guards on `map.isStyleLoaded()` and stashes specs to re-apply on `load`, so a style-not-loaded race is handled. By contrast, 0.1.0's `dist/index.js` has zero `setOverlays` matches: the `overlays` prop was declared in its `.d.ts` but dead. That is the entire difference the bump captures.

Honest limit: runtime pixel-draw was not exercised. The env is headless (no WebGL/canvas), and the workspace is a client-hydrated SPA (prod `/codex-reviewer-qa/` returns a 932-byte index shell that loads the bundled MapTile client-side), so a server probe cannot observe drawn overlays. The verification is therefore code-trace + published-API inspection + green build/typecheck, and that trace is airtight on the mechanism (prop -> setOverlays -> reconcileOverlays -> addSource/addLayer), with the one residual being a live MapLibre runtime issue that code-trace cannot rule out (mitigated by 0.1.1's own style-load guard). Both sub-agents concur.

## Sub-agent verdicts

- Build sub-agent: PASS. `tsc --build` libs EXIT 0; cortex-tiles tsup build green (CJS/ESM/DTS); app typecheck EXIT 0; app vite build EXIT 0; api-server esbuild EXIT 0; tile-registry drift guard 6/6. MapTile.tsx typechecks against the new 0.1.1 `OverlaySpec`/`FloatingMapProps` types. The two full vitest runs' reds are a pre-existing `DATABASE_URL`-not-provisioned infra gap in the local clone (375 + 212 tests passed, 0 assertion failures, zero map-renderer/module/type errors) and are unrelated to the bump; CI provisions the DB and both CI checks passed.
- Adversarial review sub-agent: PASS-WITH-NITS. Confirmed all five claims: 0.1.1 resolved from npm (not 0.1.0), overlays prop wired end-to-end, 0.1.1 renderer genuinely consumes the prop (0.1.0 did not), Topography/Drainage/Hydrology overlays flow with matching `kind`->`layerKey`, and nothing else pins 0.1.0. Two cosmetic nits, non-blocking: the dispatch named "Hazard flood" as an overlay pusher but `HazardProfileTile` pushes nothing — the actual third spatial pusher is the Hydrology tile (Hazard renders a FEMA flood-zone chip from its payload, it does not push a map overlay); and `drainage-zones` is not a renderer registry-key literal (still draws off geometry).

## Verification (verbatim)

Build tail (cortex-tiles tsup, after sibling deps built):
```
CJS  dist/index.js
ESM  dist/index.mjs
DTS  dist/index.d.ts  3.76 KB
EXIT 0
```

CI on PR #223:
```
Typecheck  pass  1m58s
Test       pass  6m41s   (DB-backed integration + schema fixture-drift, all green)
```

## Deploy

Canary sequence on merge SHA `6d5fdbe142b98c97c2f41dcbb96cc954c884eeda`:

- build-and-push (push-triggered, run 28622307901) -> image `cortex-api:6d5fdbe142b98c97c2f41dcbb96cc954c884eeda` + `:latest` pushed to Artifact Registry. SUCCESS.
- deploy-canary (workflow_dispatch, run 28622541747, `image_tag=6d5fdbe142b98c97c2f41dcbb96cc954c884eeda` — the full 40-char sha, not a short sha) -> revision `cortex-api-00286-xic` created at tag `canary`, 0% traffic, Ready. SUCCESS.
- run-migrations -> SKIPPED (no-op). This PR added no migration (dep bump only); live Neon unchanged and at head.
- canary smoke (independent probes) -> green:
```
CANARY /api/healthz        -> {"status":"ok"} HTTP 200
CANARY /codex-reviewer-qa/ -> HTTP 200
```
- shift-traffic (workflow_dispatch, run 28622660387) -> 100% to `cortex-api-00286-xic`; workflow's own prod `/api/healthz` smoke HTTP 200. SUCCESS.

Resulting traffic split (verbatim from the shift-traffic job):
```
{'revisionName': 'cortex-api-00182-mer', 'tag': 'gfix', ...};{'percent': 100, 'revisionName': 'cortex-api-00286-xic', 'tag': 'canary', ...}
```

Independent prod smoke (post-shift):
```
PROD /api/healthz                          -> {"status":"ok"} HTTP 200
PROD /codex-reviewer-qa/ (workspace shell) -> HTTP 200, 932 bytes
PROD /api/plan-review/admin/tile-registry  -> HTTP 200
```

Prior revision (precondition / rollback target): `cortex-api-00284-zuq`.

## PR + merge

- PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/223
- Merge: squash-merged to main, merge commit `6d5fdbe`, branch `phase2/map-overlays-0.1.1` deleted. main advanced c6ba01f -> 6d5fdbe. One commit: the dep bump + lockfile.

## Rollback

Roll traffic back to `cortex-api-00284-zuq` via the `rollback` workflow_dispatch (`action=rollback`, `rollback_revision=cortex-api-00284-zuq`). No DB migration to unwind.

## Notes for the orchestrator

- Overlays now draw. The one-line seam from PR #220 is closed: the bump lit it up with no tile change, exactly as the T2/T3 close predicted.
- Runtime pixel-draw is unverified in-env (headless SPA); it is verified by code-trace to the 0.1.1 `setOverlays`/`reconcileOverlays` path + published-API + green build. First live workspace open in a browser is the only remaining human confirmation, and it is low-risk.
- Cosmetic follow-up (optional, not filed): the dispatch's "Hazard flood" overlay source is the Hydrology tile, not HazardProfileTile; and `drainage-zones` could be added as a renderer registry-key literal if a legend entry is wanted for it.
