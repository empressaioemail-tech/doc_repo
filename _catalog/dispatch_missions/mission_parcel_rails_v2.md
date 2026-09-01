# Mission — rails v2: the growth template, 52 to 65

## Why

Operator decision `_decisions/2026-09-01_parcel_record_rails_v2_template.md` (read it in
full before starting; it is the specification and this mission is its execution order).
The record is a template of what we are growing into: every aspired data point gets a
named rail now, honest-absent until sourced. Engine-only card; `schema.sql` is
rail-agnostic and MUST NOT change — if you find a schema change necessary, stop and
report rather than migrating.

## Deliverables (all in `packages/engine-core/src/parcel-record/`)

1. **13 new rails in `rail-keys.ts`** (total 65, compile-enforced):
   - companions: `owner`, `valueHistory`, `salesHistory`, `publicRecordRefs`, `ossf`,
     `utilityService`, `agValuation`, `mineralRights`, `hoaDeedRestrictions`,
     `overlayDistricts`
   - scalars: `schoolDistrict` (group jurisdiction), `maxImperviousCoverPct` (group
     zoning-envelope), `treeProtection` (group zoning-envelope)
2. **Decouple the NA list from group membership.**
   `UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS` currently derives from the zoning-envelope
   group; the two new zoning-envelope scalars would silently join it. Freeze it as an
   explicit list of exactly the v1 members (the 17 v1 zoning-envelope rails +
   `setbackRules`). A test asserts the new rails instantiate `unaccounted` on an
   unincorporated parcel, never `not-applicable`.
3. **Access pair on rail metadata.** Default pair for most rails; `owner` carries its
   paid-tier pair EXPLICITLY (never inherited). `publicRecordRefs` rows carry per-row
   access derived from `acquiredBy` (public-ingest = public pair subject to the county's
   clerk terms; user-request = tenant-private).
4. **Row-shape types for the new companions**, per the decision's shape rulings:
   - `valueHistory` / `salesHistory`: IDENTICAL shape discipline — one row per tax year /
     transaction; scalar dollar rails stay CURRENT-only; a sales row's price must itself
     represent absent-verified (Texas non-disclosure).
   - `publicRecordRefs`: county, document id, record kind, store reference into the P-85
     records store (`records_request_jobs` / artifacts), `acquiredBy`, access/terms.
     POINTER ONLY — verify the P-85 store shape by catalog before typing the reference;
     if it cannot carry what the pointer needs, STOP and report (no second store, ever).
   - `flood` (existing rail, new committed row shape): zone, floodway-vs-floodplain
     flag, base flood elevation, FEMA panel id, panel effective date. This is the
     contract future ingest must meet; do not touch any store.
5. **Derived rail liveness + gate rework.** Export the liveness derivation (a rail is
   live when >= 1 earned cell — `value` | `absent-verified` | `refused` — exists
   program-wide) as both a typed function and the SQL contract. `evaluatePublishGate`
   scores ONLY live rails and its verdict type gains a REQUIRED
   `excludedDeclaredAhead` field listing what was not scored — a verdict that omits the
   exclusion set must not typecheck. Tests: (a) a county with all live rails publishable
   and 13 declared-ahead rails unaccounted PASSES with the 13 printed; (b) violation
   test: poison one LIVE rail cell → still refuses; (c) a rail flips live on its first
   earned cell with no code change.
6. **Tests + count**: `PARCEL_RECORD_RAIL_COUNT` = 65; instantiation produces 65 cells
   per parcel; existing 8/8 suite still green.

## Landmines

- Do not touch `schema.sql`, any store, or the factory repo. The factory drift guard and
  the fill job pick up v2 via an ENGINE_SHA bump on their own cards.
- Do not add cell states. The five-state union already expresses everything (pointer =
  value; searched-and-none = absent-verified; never-looked = unaccounted).
- Do not add not-applicable rules. No new rail is NA anywhere in v2.
- Liveness is derived, never a hand flag. If you find yourself adding a `sourced:`
  boolean to rail metadata, stop — that is the has_writer defect reborn.

## Close

`_inbox/2026-09-01_parcel-rails-v2_close.json`: report the merged PR SHA, the final rail
table (key, grain, group, access), the NA-list freeze proof, the publish-gate exclusion
demo output, and `whatContradictedTheCard` (mandatory). Commit and push your own branch
before closing.
