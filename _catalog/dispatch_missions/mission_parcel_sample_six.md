# Mission — parcel-record fill job, proven on a six-county sample

## Why

Operator ruling `_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`, step 2:
ingest what we already hold. The operator corrected the prior planner explicitly: fill A
HANDFUL OF PARCELS IN EACH of the six counties first, NOT one county end to end. The
variance is between counties and is already measured; a six-county sample exercises every
shape at once. This card builds the fill job and proves it on that sample. The full-county
fill cards depend on this close.

## What to build

A `parcel-record-fill` job in `hauska-factory` (the job harness, run rows and termination
records exist — use them) that, for a named set of parcels:

1. **Instantiates** each parcel's full 52-rail record via the engine module
   (`packages/engine-core/src/parcel-record/` at engine main >= `bfa9642`).
   `buildParcelRecordCells` / `instantiateParcelRecord` is the SOLE constructor — do not
   build cells any other way. Incorporation comes from the containment results already in
   the Factory store (the parcel-jurisdiction landing from migration `0005c`; enumerate the
   catalog to find the authoritative table, do not guess). `not-applicable` is stamped ONLY
   for parcels containment says are unincorporated, via the module's own rail list; program
   guard `texasCtxProgramConfig` (370,289).
2. **CAD-ingests** from `cad_property` on the cortex-prod store (`PRODUCTION_NEONDB_URL`;
   verify by catalog WHICH database on that host holds `cad_property` — `neondb` vs
   `hauska_mcp` — before reading). `ingestCadOntoRecords` semantics are the law. Writes are
   idempotent upserts keyed `(place_key, rail_key)`; a re-run may not change state.

The engine module is the semantic authority. If the job needs an engine-side change, make
it in the registered engine clone as its own PR; do NOT fork the semantics into the job.

## The sample

Deterministic (fixed ordering by `prop_id`, no randomness), ~50 parcels per county, and it
must include per county: >=10 in-city, >=10 unincorporated, plus these targeted shapes:

| county | must include |
|---|---|
| 48021 Bastrop | gold `48021:34137`; >=5 parcels where roll atoms claim livingArea but `cad_property` has none — PROVE the fill does NOT copy the invented atom value |
| 48055 Caldwell | >=5 of the 24,552 real `$0` improvements — `$0` must land as `value: 0`, never absent |
| 48209 Hays | ordinary strata (roll atoms hollow — irrelevant because you never read them) |
| 48309 McLennan | >=5 parcels with assessed and livingArea NULL at source |
| 48453 Travis | >=5 parcels with livingArea NULL at source (0 of 500,307 have it) |
| 48491 Williamson | >=5 parcels present in `place_layer_snapshots` but absent from roll atoms — prove the fill keys off `cad_property`, not snapshots, not atoms |

## What to report (not decide)

- The rail-by-rail mapping the module actually produced for NULL-at-CAD-source: which
  state it assigns (`absent-verified` with a CAD-null basis vs `unaccounted`). Report the
  mapping as a table. If you believe the mapping is wrong, say so in the close — do NOT
  patch semantics in the job.
- Per county x rail x state counts for the sample, before and after CAD ingest, verbatim.
- Idempotency proof: run the sample twice; paste the zero-drift diff.
- Live publish-gate check: `poisonCell` one sample parcel → gate refuses; then clean up
  and note the exclusion.

## Landmines

- READ `cad_property`. NEVER roll atoms for CAD fields: Hays/Travis/Williamson bodies are
  hollow (29/3/7 claim keys) and Bastrop atoms INVENT coverage CAD lacks (livingArea
  40,602 vs 8,712). `#575` already shipped this exact defect once.
- The snapshot table is not a projection of the atom table (Williamson 602,050 vs 319,487).
- Atoms live in database `hauska_mcp`, not `neondb`. `jurisdiction_tenant` is NOT a FIPS
  scope — scope atoms by half-open `entity_id` ranges (only relevant if you touch atoms at
  all, which CAD fill does not).
- Never convert `unaccounted` to `absent-verified` to clear a gate.
- Store reads time out under writer load; verify from execution status and the execution
  log close line, not OFFSET pagination.
- Chunk everything; the prior unchunked prove run was killed at 5.5 minutes.
- Never echo a secret. Do not rebuild the store token.

## Close

`_inbox/2026-09-01_parcel-sample-six_close.json`: `whatContradictedTheCard` mandatory —
your seats have repeatedly been right where the planner's card was wrong; contradictions
are the yield of this card. `leave_behind` + scratch block. Commit and push your branches
before closing.
