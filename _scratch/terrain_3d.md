# terrain_3d — scratch (Tier 2)

## GROUND-TRUTH (2026-07-31 eve)

- **#367 MERGED** — tile pipeline CLIs on legacy-design-tools main
- **GCS LIVE:** `gs://hauska-map-tiles/terrain-rgb.09ee4eaa72ca/` (1877 PNGs) + metadata sidecar
- **#131 MERGED** — pitch-gate (auto-tilt 45°, no setTerrain at pitch 0) @ `a72e701`
- **#132 MERGED** — hillshade + gradient sky for perceptible relief @ `9c1b01b` (2026-07-31 eve)
- **PE PROD:** https://property-explorer-xi.vercel.app — redeploy after #132 merge (~2 min)
- Sample tile: `https://storage.googleapis.com/hauska-map-tiles/terrain-rgb.09ee4eaa72ca/15/7525/13507.png`

## LESSON (2026-07-31 QA #2)

Downtown Bastrop z15 tile `7525/13507` decodes to ~29–35 m NAVD88 — only **~5.7 m range** per tile. At exaggeration **1.0** (doc 40 credibility) the mesh is nearly invisible downtown; **hillshade** (0.85, viewport-lit) accentuates relief without changing elevation data. River bluff west (~30.108, -97.335) has **~27 m** range — use for obvious depth QA.

## QA CHECKLIST (operator)

1. Hard refresh PE prod
2. PE → LAYERS → toggle **3D terrain (TxGIO LiDAR)** — auto-tilts ~45°
3. Confirm **hillshade** on ground (subtle downtown; obvious at river bluff)
4. Pan west toward Colorado River for bluff depth if downtown looks flat
5. Extrusion anchoring screenshot still grades WDLL item 5
6. Confirm flood/drainage still on contours (no report repoint)

## EXTRUSION ANCHORING

Shader PASS documented in `hauska-map/.../TERRAIN_EXTRUSION_ANCHORING.md` — live screenshot still grades WDLL item 5
