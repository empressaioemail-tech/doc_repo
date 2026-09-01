You MAY spawn sub-agents. A sub-agent MUST NOT spawn, commit, merge, or deploy. You MUST NOT git add / commit / push. You MUST NOT deploy. You MUST NOT gcloud run. You MUST NOT vercel. You MUST NOT atoms --apply. You MUST NOT Harris PBF. You MUST NOT mint absence. You MUST NOT flip `texas-rrc` or `mud-pid` to live. You MUST NOT write hauska-map. You MUST NOT occupy P:/legacy-design-tools or P:/seat-worktrees/property/legacy-design-tools. You MUST NOT occupy P:/hauska-engine. You MUST NOT start P-52 rail serve or P-54 owner. P-52 rail stays parked until scout.

Plan row P-53. Occupancy: isolated worktree P:/legacy-design-tools-worktrees/serve-p53 branch serve-p53 tracking origin/main. Create it if missing. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-22_serve_ident_qa_WDLL.md item 6 (P-53 edges). This lane is scout then cortex only. PE copy is planner follow-on. Pattern: `artifacts/api-server/src/lib/buildingFootprintFactRead.ts` (LDT PR 455, serving). S6: `_inbox/2026-08-21_s2-family-scout_close.json` property-boundary-edge HOLD-not-this-surface (CC only; envelope overlay uses parcel ring GIS). Q8 edge bind is UNMEASURED. Do not invent a percent.

## Mission

This card is scout then cortex read for S6 property-boundary-edge only. PE copy is planner follow-on.

The WDLL check is: inspect or map cites `property-boundary-edge` on a Bastrop gold ring, **not the GIS parcel outline presented as the atom**. Envelope overlay that draws `txgio_parcel` / bake ring as "the edge" is the defect this card exists to replace on inspect.

Writer key (read, do not occupy `P:/hauska-engine`): `boundaryEdgeIdFromParts` in `packages/atoms/src/boundary-instances.ts` returns `${countyFips}:${propId}:boundary:${edgeIndex}`. Emit path `packages/engine-core/src/depth-warm/emit-boundary-edges-from-warm.ts`. Prefer reading those files from `P:/hauska-engine-worktrees/ident-p55` or `cover-p17-roads`. Live store is Bastrop-heavy. CC retrieval lists by `body->>'parcelNodeId'`; that is Command Center, not this inspect bind. Derive serve SQL from the **writer entity_id**, then confirm against a live hit.

### Scout (CP1, before any product edit)

Read the writer first. Name both halves of the serve: what you query, and how it attaches to a parcel. Quote the writer-derived key and the SQL. Point SELECT or a bounded prefix-range. Never heap COUNT(*). Never treat `:boundary:` as a parcel id. Never SELECT GIS parcel outline / `txgio_parcel` / bake ring as this field.

Name one live parcel that has a store hit. Prefer gold `48021:34137` (Bastrop is the county that holds this family). If gold has no `property-boundary-edge`, say so and name the substitute you actually hit (CC historically used `48021:28286`). Quote `entity_id`, `entity_type`, `edgeIndex` or equivalent body field, and whether the geometry is on the atom body. Confirmatory: a second parcel or a typed miss.

If you cannot name a hit, STOP and file. Do not invent a fixture that the store does not have. Do not copy the GIS outline onto a miss.

### Cortex

Add a NEW sibling field on the cortex JSON ROOT, parallel to `buildingFootprintFact`. Freeze the field name in CP1 (`boundaryEdgeFact` unless the existing facets route already reserved another). Inspect later will prefer that field.

Never SELECT edge values from bake / `place_layer_snapshots` / CAD / GIS / `txgio_parcel` for this field. `ATOMS_DATABASE_URL` only. Unconfigured: `atoms-store-not-configured`.

Present: `state` present|absent|refused, `source=property-boundary-edge`, `boundAs`, `tried`, `entityId`, operator-visible fields the writer actually stores (edge index, adjacency, facingRoad if present). Geometry from the **atom body**, never from the GIS parcel ring. Do not invent an edge. Zero hits: typed refusal `code=atom-miss`.

Dual grammar on the parcel prefix only if the writer keys by parcel plus `:boundary:`. Do not copy special-district `:sd:` picker. Do not copy pipeline `ANY(bare parcel)` (that misses `:boundary:${n}`).

Tests that fail if snapshots / CAD / GIS / `txgio_parcel` are served as this field. Tests that pass on a fixture atom whose entity_id is `{parcel}:boundary:{n}`. A boot-proof that the facets route wires the new field.

L17: refuse probes use lowercase `from cad_property`. Do not add `FROM cad_property`. Do not add `CAD_PROPERTY_MULTI_YEAR_INVENTORY`.

Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, scout parcel, entity_id, bind SQL, field name, GIS-outline is not the atom, what you will violate. CP2 after tests. CLOSE quotes files, tests, fixture, and the live GET you could not run (no deploy). leave_behind: planner PR/deploy cortex-api; then a PE card. WDLL item 6 is not met until smartsite.cloud cites property-boundary-edge. PE is not this lane. Do not start P-52 / P-54.
