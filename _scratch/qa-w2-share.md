# qa-w2-share scratch

Worktree: `P:/tmp/hauska-map-qa-w2` branch `fix/qa-w2-share` from origin/main `ce7e979`.

## GROUND-TRUTH 2026-08-27T19:00Z

Minted human URL is `/s/{grantId}` (rewritten to `pe-share-grant`). SPA landing was only `/share#token`. Browser GET `/s/{uuid}` served the grant instrument HTML, not the map. That is why share no longer landed on the property.

## LESSON

W2.1 is a URL-shape split, not a Find regression. Keep HMAC on `/share#token`. Browser `Sec-Fetch-Dest: document` on `/s/{id}` 302s to `/share?g={uuid}`. Explicit `format=` stays the instrument (models). A check that only watches `/share#token` will pass while the copied URL stays dead.

## OPEN

Engine must render `live_view_url` / `liveViewUrl` at the top of Flood and X-ray PDF bytes. PE now forwards the field and the in-app viewer shows the link. Bytes themselves are unmeasured in this repo.

## leave_behind

- item: engine PDF live-view field (`live_view_url` on `refresh_parcel_dossier_export`, `liveViewUrl` on flood refresh)
  owner: planner / engine
  plan_row: W2.4
