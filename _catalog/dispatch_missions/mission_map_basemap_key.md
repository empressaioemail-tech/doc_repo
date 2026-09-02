# Mission — MAP-BASEMAP-KEY: fix the basemap watermark with the keyed CARTO service

CARTO retired keyless raster basemaps; the live map shows API-KEY-REQUIRED watermark
tiles. The key exists: Secret Manager CARTO_API_KEY (hauska-prod-497015, 35 chars,
TRIM a possible trailing newline at consumption). It is a publishable client-side key;
the operator domain-restricts it in the CARTO dashboard (flag in your close if the
restriction is not yet visible in behavior).

1. The fix is NOT just appending ?key= to the old URLs. The keyed raster service uses
   new style paths (rastertiles/<style>). Read CARTO's per-style migration table
   (carto.com/basemaps/apikey) and map our two hardcoded legacy styles —
   packages/map-renderer/src/map/gis-map-paint.js (dark_all) and
   basemap-labels.js (light_only_labels) — to their keyed equivalents.
2. Env-inject the key (Vercel env for the PE build, sourced from the Secret Manager
   value; a VITE_-prefixed variable reaching the URL builders), never hardcoded.
   Update the URL construction; KEEP the OSM/CARTO attribution visible — that
   attribution is the free tier's price and it already exists in the code.
3. Deploy: hauska-map does NOT auto-deploy on merge — use the Vercel CLI path for
   apps/property-explorer, and verify the deployment that goes live is YOURS by a
   bundle marker (another session also deploys PE; check for concurrent deploys and
   do not clobber a newer one — the stale-watch discipline).
4. Verify customer-done: (a) curl one keyed tile URL directly — HTTP 200, image
   bytes, no watermark; (b) load smartsite.cloud and confirm clean basemap + labels
   (note browser/CDN tile caching — force-refresh before declaring failure);
   (c) attribution still rendered. Paste evidence.
5. Scope: packages/map-renderer tile URLs + the env wiring + the PE deploy ONLY.
   Never the P-10x lanes' files (SettingsModal, pe-billing, spine, share tools).

Close: _inbox/2026-09-02_map-basemap-key_close.json.
