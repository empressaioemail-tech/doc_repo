# P-299 — CONSUMERS (report only; no consumer file was changed by this lane)

Rulings OT-1/OT-2 change two things a consumer can see: the number a flagged
`max_height_ft` carries (100 → the canonical 999 on 76 rows, and 40 rows lose the
flag while keeping their number), and a fourth `verification_state` value
(`transcription-read`, 1190 value slots on 12 tables) arriving inside a
third-party contract (a published npm package). Both repos below read these
fields; neither is edited by this lane.

Snapshots read: `hauska-engine` origin/main `b8ae82f458b1ca8436cf2b04f4dee41994bec6aa`,
`hauska-factory` origin/main `47c7dfc1580c507043763f982e23ef96a52ffe4a`.

## hauska-engine

### Readers of `verification_state`

| file:line | what it does with it | what a `transcription-read` value does there |
| --- | --- | --- |
| `packages/engine-core/src/property-reasoning/setback-table-from-adapter.ts:47` | `mapVerification()` maps the corpus's state names into the engine's OWN three-value vocabulary (`human-verified`/`transcribed`/`unverified`); everything else — `asserted`, `primary-source-verified`, and now `transcription-read` — returns the default `"transcribed"` | **handled, by the default branch.** The new state needs no code change to avoid a crash; it lands on exactly the honest label it deserves (`transcribed`), the same one `asserted` and `primary-source-verified` already land on |
| `packages/engine-core/src/property-reasoning/types.ts:26` | the internal union is `"human-verified" \| "transcribed" \| "unverified"` — no corpus state name appears in it | unchanged |
| `packages/engine-core/src/property-reasoning/confidence.ts:100` | `field?.verification_state === "human-verified" ? "backtest" : "asserted"` | `transcription-read` → `"asserted"`, same as every non-`human-verified` state |
| `packages/engine-core/src/envelope/readPathConfidence.ts:34`, `packages/engine-core/src/finding/types.ts:110` | a *different* `verificationState` field (`"verified" \| "unverified-web-source"`) belonging to a web-source finding, not to corpus provenance | unrelated; no interaction |
| `packages/adapters/src/local/setbacks/__tests__/corpus-divergence.test.ts:90-107` | `VERIFICATION_STATE_RANK` = `{asserted: 0, "human-verified": 1, "primary-source-verified": 2}`, used by the never-weaken check | **`transcription-read` is NOT in the map, and the check at `:266-280` only compares when BOTH ranks are defined** — so it neither fails nor records. Measured: the 98 slots relabelled `primary-source-verified` → `transcription-read` are silently unranked (0 "weakened" findings). The same blind spot would hide a future relabel of a `human-verified` row into the new state. Report only |
| `packages/adapters/src/local/setbacks/bastrop-per-parcel-record.ts:741-769` | writes the engine's own `verification_state: "transcribed"` on Bastrop per-parcel rows | the engine's vocabulary, not the corpus's; no interaction |

### Readers of `max_height_ft` / `maxHeightFt`

| file:line | what it does with it | a flagged (999) height |
| --- | --- | --- |
| `packages/engine-core/src/property-reasoning/setback-table-from-adapter.ts:60,93` | `fieldFrom()` builds the field; **a value that is not a finite number produces NO field at all** (`undefined`), and `not_specified` is carried only as `{ not_specified: true }` | a flagged 999 is kept as the value with the flag beside it; a `null` (what LDT's route now serves) yields no `max_height_ft` field |
| `packages/engine-core/src/property-reasoning/emit-setback-rule.ts:51,67` | `maxHeightFt: row.max_height_ft?.value` and `widthedFromFieldProvenance(row.max_height_ft, basis)` | **the height is passed through with no `not_specified` consultation.** The `fieldProvenance` block at `:236-257` reports `notSpecified` for `front`, `side` and `rear` only — there is no `height` entry. So this reader cannot distinguish "999 ft" from "no feet limit stated" |
| `packages/engine-core/src/property-reasoning/table-backed-setback-from-zoning.ts:153-161` and `bake-from-tier1-snapshot.ts:336-349` | refuse to derive consume-lot when a scalar setback is `not_specified` | those guards are on front/side/rear; they do not cover height |
| `packages/engine-core/src/parcel-record/rail-keys.ts:59`, `services/retrieval-api/src/parcel-record-rail-registry.ts:68`, `services/retrieval-api/src/parcel-record-slate.json:28` | declare/serve the `maxHeightFt` scalar rail for the TX counties | a 999 reaching the rail would be served as a 999 ft height |
| `packages/retrieval/src/serving-sweep/vendor/atom-chain-to-facets.ts:607` | `typeof rule.maxHeightFt === "number" && rule.maxHeightFt > 0 ? { maxHeightFt: rule.maxHeightFt }` | **accepts any positive number, including 999.** This is the serving-side reader the corpus gate's G8 exists to keep honest from the other end |
| `packages/atoms/src/property-instances.ts:273,372` | the `maxHeightFt` property on an instance | unchanged |

### Measured consequence of the corpus bump (script: `scripts/p299_consumers_engine_divergence.mjs`)

    engine verdict on corpus 1.4.0 (via the shape of corpus-divergence.test.ts)
      vendored tables compared: 14
      numeric-mismatch findings (ANY one fails that test): 23
        by field: {"max_height_ft":23}          san-antonio-tx 17, bastrop-city-tx 6
      verification-state changes the test's rank map CANNOT see: 98
        pairs: {"primary-source-verified -> transcription-read":98}
      verification-weakened findings (rank DECREASE): 0

Read honestly: the engine vendors its own copies of 14 jurisdictions (listed above)
and compares them to the published package, so **bumping the engine to corpus 1.4.0
fails that test until its vendored tables receive the same row corrections** — that
is the test working as designed, and it is an engine-side change this lane does not
make (the dispatch says report, do not change). The `max_height_ft` mismatches are
the 23 sentinel normalizations (100 → 999); the 40 flag removals produce no numeric
mismatch, and the relabels produce no finding at all because of the rank gap above.

## hauska-factory

`git grep -E "verification_state|verificationState"` over `*.mjs *.js *.ts *.tsx` at
origin/main returns **no code hit**: the new state is invisible to the factory. It
reads the corpus's numbers, and the provenance flags through one lens — the P-146
classification table — never a state name.

### Readers of `max_height_ft` / `maxHeightFt`

| file:line | what it does |
| --- | --- |
| `src/lib/envelope-writer/envelope-corpus-lookup.mjs:82-160` | `resolveField(d, "max_height_ft", …)`: **flagged slots are resolved from the classification table, not from the number** — `REAL_VALUE_FLAGGED` → serve the raw number, `SENTINEL_UNIFORM` → absent (`ENVELOPE_ROUTER_FIELD_NOT_SPECIFIED`), `SENTINEL_SUSPECT_IN_MIXED_GROUP` → absent (`ENVELOPE_ROUTER_FIELD_SUSPECT_SENTINEL`), no entry → **throws** `CLASSIFICATION_TABLE_STALE`. **Unflagged slots serve the raw number with the classification never consulted** |
| `src/jobs/parcel-envelope-cells.mjs:155,161,434-504` | writes the `maxHeightFt` rail; a gated sentinel becomes an `absent-verified` cell |
| `src/lib/parcel-record-engine/rail-keys.js:51,107` | declares the `maxHeightFt` scalar rail |
| `src/control/writer-allowlist.mjs:167` | registers the `parcel-envelope-cells` job that fills it |
| `scripts/verify-not-specified-classification.mjs:61-69` | re-resolves flagged `maxHeightFt`/`maxLotCoveragePct` cells in the store against the table |

### Measured before/after (script: `scripts/p299_consumers_factory_lookup.mjs`)

    hardcoded CORPUS_VERSION in setback-table-router.mjs = 1.1.0
    checked-in P-146 table corpusVersion = 1.1.0 (329 rows)

    1. FLAG REMOVALS (40 rows) — flagged branch -> unflagged branch.
       all classified REAL_VALUE_FLAGGED in the table? YES
       => the factory serves the SAME number before and after for these rows.
    2. SENTINEL NORMALISED (76 rows) — number changed inside the flagged branch.
       served BEFORE: absent (FIELD_NOT_SPECIFIED), absent (FIELD_SUSPECT_SENTINEL)
       served AFTER : absent (FIELD_NOT_SPECIFIED), absent (FIELD_SUSPECT_SENTINEL)
       => the raw number changed (100 -> 999) but a flagged slot is never served
          from its number, so the factory's output is unchanged.
    3. ROWS LEFT FLAGGED AND UNCHANGED (39) — 25 of them have NO classification entry
       (the factory throws CLASSIFICATION_TABLE_STALE on those).

Two things the integration seat should sequence (this lane changed no factory file):

1. **Version coupling.** `envelope-corpus-lookup.mjs` throws AT MODULE LOAD when the
   table's `corpusVersion` (1.1.0) differs from `CORPUS_VERSION`, and `CORPUS_VERSION`
   is a hardcoded literal in `setback-table-router.mjs`, not read from the installed
   package. The corpus becomes 1.4.0 in this lane. Staying on 1.1.0 is fine; bumping
   to the new corpus requires regenerating the P-146 table in the same commit.
2. **25 flagged height slots with no classification entry**, all left flagged with
   999: round-rock (11), austin (4), waco (4), martindale (2), kyle (1), lakeway (1),
   luling (1), san-marcos (1). These are rows the P-258 campaign added after the
   table was generated, and the factory's own lookup throws on them rather than
   degrading. Pre-existing (P-299 neither creates nor removes it: these rows were
   already 999 with the flag before this lane), but it is now visible because the
   corpus and the table are being looked at together.
