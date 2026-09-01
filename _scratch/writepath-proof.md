# WRITEPATH-PROOF scratch (F-02)

OPEN 2026-08-31T18:30Z — One named execute: factory-atoms-cad --writer=well-fact --county=48021 --apply. P4 rail apply, not the wave.

GROUND-TRUTH 2026-08-31T18:29:15Z — hauska_mcp current_database confirmed. well-fact 48021 = 0. well-fact 48055 = 53841. atoms_writer_lease_v2 empty. factory-atoms-cad generation 3, args ["--writer=cad-parcel-roll"], executionCount 8, ENGINE_SHA 76b13d1, digest sha256:56bdc23d.

GROUND-TRUTH 2026-08-31T18:27Z — SERIALIZE HOLD. factory-p2-juris-cqgnd RUNNING since 18:26:45Z, args p2-juris --county=48055 --apply, Factory run bd9580d1. Same neondb source store well-fact will scan. Do not execute until cqgnd completes.

GROUND-TRUTH 2026-08-31T18:34:05Z — factory-atoms-cad-lwnvz created. executionCount 9. Execution args [--writer=well-fact, --county=48021, --apply, --run-id=59444d3f-ce78-4559-bb16-6b187f073433]. Run row 59444d3f started 18:33:45Z. CAD-writer named failure rejected at spec layer. Store still unmeasured.

GROUND-TRUTH 2026-08-31T18:37:38Z — lwnvz FAILED exit 1. Child write-well-fact-county.mjs. Plan 63357 parcels / 8751 wells / 69000 atoms (12079 present, 56921 absent). atomsWritten 0. LeaseRequiredError at write-well-fact-county.mjs:310 / pg-storage.ts:295. hauska_mcp well-fact 48021 = 0 at 18:39:40Z. CAD 48021 max_updated 2026-08-12 (not this run). Reaper terminated crashed 18:40:26Z.

LESSON — Override path works: JSON containerOverrides.args replace the template and selected well-fact. Persist still requires HeldLease. well-fact does not mint one from --run-id. That is the next card, not a retry of this one.

DEAD-END — Re-running 48021 well-fact on this image will plan 69k again and refuse the same lease. Do not re-run to feel safe.

OPEN — Four counties stay held. P4 wave not released. well-fact (and likely footprint) need CAD-shaped --run-id lease mint before apply.

LESSON (code reading, before execute) — write-well-fact-county.mjs:310 calls writePropertyAtomsBatch with no lease. pg-storage.ts:294 throws LeaseRequiredError. CAD writer mints HeldLease from --run-id. Do not work around on this card.

DEAD-END — bexar-cad.mjs writerArgs hardcodes --writer=cad-parcel-roll. Using that runner would select CAD and prove the wrong path.

DEAD-END — Windows gcloud --args=a,b,c collapses to one token (p2-juris tm24v). Use --args=^|^a|--b or the Admin API JSON array.
