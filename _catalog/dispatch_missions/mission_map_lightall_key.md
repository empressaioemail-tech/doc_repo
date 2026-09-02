# Mission — MAP-LIGHTALL-KEY: the third keyless style, same fix

MAP-BASEMAP-KEY's leave_behind: packages/map-renderer/src/map/hauska-map-style.js
hardcodes the light_all CARTO style at its bare keyless path — the same defect class
just fixed in gis-map-paint.js and basemap-labels.js. Apply the SAME proven fix: the
existing VITE_CARTO_API_KEY env wiring, ?key= appended (bare paths stay — the
migration-rename premise was refuted by the prior card; do not rename), attribution
untouched, a falsifier-shaped test matching the ones PR #336 added. Verify by
byte/content comparison, NEVER http status (the watermark tile is a 200). Find every
consumer of hauska-map-style.js and confirm whether this needs a PE deploy or ships
with a different surface's deploy — deploy whichever surface actually serves it, via
its established path, bundle-marker-verified. Close:
_inbox/2026-09-02_map-lightall-key_close.json.
