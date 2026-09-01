You MAY spawn sub-agents. A sub-agent MUST NOT spawn, commit, merge, or deploy. You MUST NOT git add / commit / push. You MUST NOT deploy. You MUST NOT gcloud run. You MUST NOT vercel. You MUST NOT atoms --apply. You MUST NOT Harris PBF. You MUST NOT mint absence. You MUST NOT flip `texas-rrc` or `mud-pid` to live. You MUST NOT write hauska-map. You MUST NOT occupy P:/legacy-design-tools or P:/seat-worktrees/property/legacy-design-tools. You MUST NOT start P-52 / P-53 / rail serve. P-52 rail stays parked until scout.

Plan row P-51. Occupancy: isolated worktree P:/legacy-design-tools-worktrees/serve-p51 branch serve-p51 tracking origin/main. Create it if missing. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-22_serve_ident_qa_WDLL.md item 5 (P-51 footprints). This lane is scout then cortex only. PE copy is planner follow-on. Pattern: `artifacts/api-server/src/lib/wellFactRead.ts` (LDT PR 454, serving). S4: `_inbox/2026-08-21_s2-family-scout_close.json` building-footprint HOLD, no PE layer. Q8 footprint bind is UNMEASURED. Do not invent a percent.

## Mission

This card is scout then cortex read for S4 building footprints only. PE copy is planner follow-on.

Live store still mints `{parcel}:footprint:primary` (IDENT 356 unmerged). SERVE must work on today's keys. Read the body. **Do not parse `:primary` as identity.** Structure role lives in the body. New-write identity (`:footprint` + `structureRole`) is not on the store yet.

### Scout (CP1, before any product edit)

Read the writer first: `write-building-footprint-county.mjs` and the footprint writer from `P:/hauska-engine-worktrees/cover-p17-roads` or `P:/hauska-engine-worktrees/ident-p55`. Do not occupy `P:/hauska-engine`.

Name both halves of the serve: what you query, and how it attaches to a parcel. Quote the writer-derived key and the SQL. Point SELECT or a bounded prefix-range. Never heap COUNT(*). Never treat `:primary` as a parcel id.

Name one live parcel that has a store hit. Prefer Bastrop `48021` and gold `48021:34137` if it has a footprint. If gold has no `building-footprint`, say so and name the substitute you actually hit. Quote `entity_id`, `entity_type`, and the body field that carries structure role. Confirmatory: a second county or a typed miss.

If you cannot name a hit, STOP and file. Do not invent a fixture that the store does not have.

### Cortex

Add a NEW sibling field on the cortex JSON ROOT, parallel to `wellFact`. Freeze the field name in CP1 (`buildingFootprintFact` unless the existing facets route already reserved another). Inspect later will prefer that field.

Never SELECT footprint values from bake / `place_layer_snapshots` / CAD / GIS for this field. `ATOMS_DATABASE_URL` only. Unconfigured: `atoms-store-not-configured`.

Present: `state` present|absent|refused, `source=building-footprint`, `boundAs`, `tried`, `entityId`, operator-visible fields the writer actually stores (including structure role from the body, not from parsing `:primary`). Do not invent a footprint. Zero hits: typed refusal `code=atom-miss`.

Dual grammar on the parcel prefix only if the writer keys by parcel. If the writer keys by footprint id, say so. Do not pretend a parcel prefix join exists if the writer does not write one.

Tests that fail if snapshots / CAD / GIS are served as this field, and that fail if `:primary` is parsed as identity. Tests that pass on a fixture atom whose body carries structure role. A boot-proof that the facets route wires the new field.

Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, scout parcel, entity_id, bind SQL, field name, what you will violate. CP2 after tests. CLOSE quotes files, tests, fixture, and the live GET you could not run (no deploy). leave_behind: planner PR/deploy cortex-api; then a PE card. WDLL item 5 is not met until smartsite.cloud cites building-footprint. PE is not this lane. Do not start P-52 / P-53.
