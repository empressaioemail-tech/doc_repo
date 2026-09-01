# writer-lease (F-02)

OPEN 2026-08-31T19:05Z — Executing compiled dispatch `_dispatches/2026-08-31_writer-lease_dispatch.md`. Clone `P:/tmp/hauska-engine-writer-lease` from origin/main `76b13d1`.

GROUND-TRUTH 2026-08-31T18:37Z — WRITEPATH-PROOF lwnvz planned 69000 wrote 0. LeaseRequiredError. See `_scratch/writepath-proof.md`.

LESSON — Do not re-run 48021 well-fact until a new image with lease mint is serving.

DEAD-END — Copying CAD `entity_type: cad-parcel-roll` onto another rail. Scope is (scope_type, entity_type, county_fips); that is a deadlock.

GROUND-TRUTH 2026-08-31T19:10Z — hauska-engine #368 opened at 6aed43d. Four CLI refuse arms exit 2 LEASE_REQUIRED before planning (tsx spawn). Write arm not live. Do not execute 48021 on the old image.

LESSON 2026-08-31T19:17Z — A spawn that inherits DATABASE_URL and greps only dry-run-prediction / atomsBuilt will pass a late LEASE_REQUIRED that still exits 2 after a different planning log. Strip store URLs. Fail on PLANNING_STARTED. Fixture writer-apply-lease-late-guard.fixture.mjs is the known violation (isEarlyRefuse false); then the four writers pass.

DEAD-END — Re-run 48021 well-fact on digest sha256:56bdc23d / ENGINE_SHA 76b13d1. Same plan, same LeaseRequiredError. Do not execute factory-atoms-cad until a new image contains 6aed43d.

GROUND-TRUTH 2026-08-31T19:16:30Z — pnpm --filter @hauska-engine/engine-core exec vitest run scripts/writer-apply-lease.test.mjs → 11 passed. Late-guard instrument fired then passed.

GROUND-TRUTH 2026-08-31T19:17:57Z — stripped-env refuse arms: well-fact / building-footprint / utility-easement / setback all exit 2 LEASE_REQUIRED, stdout empty. Setback --apply --run-id=row-1 exit 2 SETBACK_APPLY_HELD. 6aed43d MATCH. Live write arm HELD.

OPEN — Live well-fact 48021 write on the NEW image. Planner serializes against P4-QUARANTINE. Recipe in _inbox/2026-08-31_writer-lease_cp2.json live_execute_recipe_held. Fold uncommitted test/fixture onto #368 before merge. When P4-QUARANTINE lifts SETBACK_APPLY_HELD, wire takeScopedLease entity_type=setback.

PLANNER REVIEW 2026-08-31T19:20Z — Read write-well-fact / building-footprint / utility-easement / setback + writer-apply-lease.mjs + uncommitted test. Accept partial. 6aed43d MATCH on the three write rails (rail-scoped takeScopedLease, writePropertyAtomsBatch(slice, lease), releaseScopedLease in finally). Refuse is before poolUrl, which is earlier than CAD's own guard. persistRailAtoms is starved (tested, no writer calls it); not a card miss. Setback parse-guard + hold, no lease mint: correct while SETBACK_APPLY_HELD stays. #368 CI conclusion SUCCESS at 6aed43d; late-guard fold is NOT on that SHA. Do not merge until fold + re-green. Do not live-write until P4 scans are idle and a new image contains the merge.

GROUND-TRUTH 2026-08-31T19:28Z — Folded late-guard onto #368 as a199155. Pushed. CI check-run conclusion SUCCESS on that SHA (typecheck + test, run 33430453063). Merge still planner-owned; live write still held.

GROUND-TRUTH 2026-08-31T19:57Z — #368 merged 34710cb. factory-atoms-cad gen 4 digest sha256:0b259a54 ENGINE_SHA 34710cb (was 56bdc23d / 76b13d1). Live well-fact 48021 run 3dc46ece execution factory-atoms-cad-9zhg5. Store hauska_mcp 66913 vs job 69000. Gap 2087. CAD max 2026-08-28T12:34:16.348Z unchanged. Caldwell 53841. Binding 48021 matches. Factory run still started.
