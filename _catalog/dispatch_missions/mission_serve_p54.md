You MAY spawn sub-agents. A sub-agent MUST NOT spawn, commit, merge, or deploy. You MUST NOT git add / commit / push. You MUST NOT deploy. You MUST NOT gcloud run. You MUST NOT vercel. You MUST NOT atoms --apply. You MUST NOT Harris PBF. You MUST NOT mint absence. You MUST NOT flip `texas-rrc` or `mud-pid` to live. You MUST NOT write hauska-map. You MUST NOT occupy P:/legacy-design-tools or P:/seat-worktrees/property/legacy-design-tools. You MUST NOT occupy P:/hauska-engine. You MUST NOT start P-52 rail. P-52 rail stays parked until contamination scout.

Plan row P-54. Occupancy: isolated worktree P:/legacy-design-tools-worktrees/serve-p54 branch serve-p54 tracking origin/main. Create it if missing. Doc_repo writes: your _inbox JSON only. Do not paste a live ownerName or mailing address into those files. Redact PII.

WDLL: P:/doc_repo/_inbox/2026-08-22_serve_ident_qa_WDLL.md item 7 (P-54 owner). This lane is scout then cortex only. PE copy is planner follow-on. Pattern: `artifacts/api-server/src/lib/landUseFactRead.ts` (same CAD-year key family) and `artifacts/api-server/src/lib/boundaryEdgeFactRead.ts` (latest sibling field, LDT PR 456, serving). S7: `_inbox/2026-08-21_s2-family-scout_close.json` owner-fact HOLD-not-this-surface (anonymous inspect never shows owner; facets route strips owner-shaped keys). Q8 owner bind is UNMEASURED. Do not invent a percent.

## Mission

This card is scout then cortex read for S7 owner-fact only. PE copy is planner follow-on.

S7 is identified-session inspect only. Anonymous browse and anonymous inspect never render owner. Fabricated owner is never acceptable. Fail if identified is a CAD-roll bake (`cad-parcel-roll` / `cad_property` / `place_layer_snapshots`) presented as the atom.

The public cortex facets URL is currently GET-able with no credential. If you emit `ownerFact` on that anonymous GET, anonymous already sees owner before PE copies anything. The identified gate belongs on cortex, not only on PE.

### Scout (CP1, before any product edit)

Read the writer first. Do not occupy `P:/hauska-engine`. Prefer `P:/hauska-engine-worktrees/ident-p55` or `cover-p17-roads`: `packages/atoms/src/owner-fact-writer.ts` and `write-owner-fact-county.mjs` (railEngineBinding owner rail). Store-audit sample (2026-08-20, PII redacted) was `entity_id=48021:30985:2025` `access_policy=public-paid` `source_adapter=cad-property-owner-v1`. Audit grammar for this family is `{fips}:{prop_id}:{taxYear}`, same shape as `land-use-fact` and `cad-parcel-roll`. Confirm against the writer. Do not assume the audit row is gold.

Name both halves of the serve: what you query, and how it attaches to a parcel. Quote the writer-derived key and the SQL. Point SELECT or a bounded year/prefix-range. Never heap COUNT(*). Never treat the tax-year token as a parcel id. Never SELECT `cad-parcel-roll` / bake / `cad_property` as this field.

Name one live parcel that has a store hit. Prefer gold `48021:34137`. If gold has no `owner-fact`, say so and name the substitute you actually hit (audit historically used `48021:30985:2025`). Quote `entity_id`, `entity_type`, `taxYear` or equivalent body field, and `access_policy`. Redact `ownerName` / mailing. Confirmatory: a second parcel or a typed miss.

Name the identified vs anonymous gate from existing code. Facets already strips owner-shaped keys (`brokerageNodeFacets.ts`). Product-key gates exist elsewhere. Quote the mechanism you will reuse. Do not invent Clerk, Stripe, or a new identity system. If no identified signal exists on this route, STOP and file. Do not invent identity. leave_behind then is planner names the identified caller before PE.

If you cannot name a hit, STOP and file. Do not invent a fixture that the store does not have. Do not copy a CAD-roll owner name onto a miss.

### Cortex

Add a NEW sibling field on the cortex JSON ROOT, parallel to `boundaryEdgeFact`. Freeze the field name in CP1 (`ownerFact` unless the existing facets route already reserved another). Inspect later will prefer that field.

Anonymous (no identified signal): no owner body. Omit `ownerFact`, or return a typed refusal that names `source=owner-fact` with no `ownerName`, no mailing, no other PII. Identified: present from `owner-fact` only, or honest miss `code=atom-miss` that names the atom.

Never SELECT owner values from bake / `place_layer_snapshots` / `cad_property` / `cad-parcel-roll` / GIS `ParcelCardData.owner` for this field. `ATOMS_DATABASE_URL` only. Unconfigured: `atoms-store-not-configured`.

Present: `state` present|absent|refused, `source=owner-fact`, `boundAs`, `tried`, `entityId`, operator-visible non-PII fields the writer actually stores (`taxYear`). PII fields only on the identified path. Do not invent an owner. Zero hits on identified: typed refusal `code=atom-miss`.

Dual grammar on the parcel prefix plus tax-year only if the writer keys that way. Do not copy special-district `:sd:` picker. Do not copy pipeline `ANY(bare parcel)` (that misses `:{taxYear}`). Do not copy edge `:boundary:` prefix-range unless the writer uses it (it should not). Closest pattern is `landUseFactRead`.

Tests that fail if snapshots / CAD / `cad-parcel-roll` / GIS owner are served as this field. Tests that fail if an anonymous caller receives `ownerName` or mailing. Tests that pass on a fixture atom whose entity_id is `{parcel}:{taxYear}` for an identified caller. A boot-proof that the facets route wires the new field. A paired anonymous vs identified fixture.

L17: refuse probes use lowercase `from cad_property`. Do not add `FROM cad_property`. Do not add `CAD_PROPERTY_MULTI_YEAR_INVENTORY`.

Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, scout parcel, entity_id (no PII), bind SQL, field name, identified-gate quote, CAD-roll is not the atom, what you will violate. CP2 after tests. CLOSE quotes files, tests, fixture, and the live GET you could not run (no deploy). leave_behind: planner PR/deploy cortex-api; then a PE card with paired anonymous vs identified live probes. WDLL item 7 is not met until those paired smartsite.cloud probes. PE is not this lane. Do not start P-52.
