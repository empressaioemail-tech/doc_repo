# CTX W1 bake (property seat, 2026-08-30)

## GROUND-TRUTH 2026-08-30T16:05Z

Worktree `P:/seat-worktrees/property/legacy-design-tools-ctx-join` on `seat/property-ctx-w1-bake` at `7cbe0bc4`. Uncommitted W1 band-0 diff only. No commit, push, bake, publish.

W0b binds: landUse source is `land-use-fact.landUseCode` / `cad_property.property_use_code`. Situs-extend OFF for 48021 (0.688 n=32), 48055 (0.721 n=43), 48453 unmeasured. Seed `{48209,48491}` unchanged.

## LESSON

`@workspace/cad-ingest` main export loads `vintage-crosswalk` which loads `@workspace/db` and throws without `DATABASE_URL`. Builder tests already imported that graph via `joinIntegrityGate`. Keep named-source *fetches* in a CLI-only module (`namedLandUseSourceFetch.ts`) so the pure builder tests do not add a second load path. CI supplies `DATABASE_URL`; a laptop without it fails collect, not the fixtures.

## OPEN

Alias READ queries `landing_cad_txgio_alias` on `DATABASE_URL` (deployment / neondb). Factory migration 0005 is schema-only and not applied. If persist writes landing only on the Factory store, this bake sees `tableState: absent` and an empty emit set (legal). Persist job must write where the bake reads, or the bake needs a second pool. W1 does not write `identity.alias`.
