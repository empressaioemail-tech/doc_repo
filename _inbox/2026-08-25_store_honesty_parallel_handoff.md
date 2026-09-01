---
id: 2026-08-25_store_honesty_parallel_handoff
title: Handoff — Tarrant keep-or-drop + P-78 landuse leftover, canvases, commit
date: 2026-08-25
status: filed
plan_row: P-78
from: integration planner
to: in-flight property planner
---

# Store-honesty wave (parallel)

Pickup: `origin/main` @ `11763c0`. Pull before you write. Integration `P:/doc_repo` is not a planner seat; if you stay here, commit by pathspec only.

Paste everything below the line.

---

You are still the write-path planner. P-77 and #222 are customer-done. Stop the bind string. This wave is store honesty. Two tracks may run in parallel. They must not both write `cad_property`.

## First, hygiene (you, not a sub-agent)

1. `git fetch origin` and `git checkout` a tree that has `11763c0`. If you are behind on `9842ed2`, pull.
2. Commit leftover uncommitted wave artifacts by **pathspec**. Never `git add` all. Already on main: P-77 close, #222 close, Tarrant classify, repair-or-skip, pin, voided announces. If anything from that batch is still dirty on your tree, commit it. Do not commit `_inbox/2026-08-25_get_back_on_track_handoff.md`.
3. Then update **every** family canvas before you fan. They still say P-25 Wave 4 IN FLIGHT and cortex `00581-kuh`. That is a lie.

Canvases (outside git, same machine):

- `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-facts-write-path.canvas.tsx`
- `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-health.canvas.tsx`
- `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\county-manifest.canvas.tsx`
- `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\parcel-public-facts-deficit.canvas.tsx`
- `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\recalibration-and-design-systems.canvas.tsx`

Each snapshot must say, in substance:

- Cortex `cortex-api-00584-gaf` @100%, LDT `46e1a5a1` (P-77)
- PE #222 `9224a73` on smartsite.cloud (chips + P-74 sentinel)
- P-77 item 7 met: `48453:280238` lookup-failed + vintage; 280239/280210 joined
- P-25 Wave 4 is **stopped / SKIP**. Dallas count matches 2026-08-14. Tarrant +91,931 classified (net-new prop_id), not repaired. `ready:false`. No L17 flip.
- Next cards this wave: Tarrant keep-or-drop + P-78 `landuse.ts` leftover
- Do not revive "CAMA reload IN FLIGHT"

Write-path wave table: item 7 met, item 10 skip/classified, item 9 (`landuse.ts` leftover) in flight. Recalibration Lane 3 stays a pointer. Who-serves is still not a Manifest rail.

## Parallel is allowed. This is the split.

| Track | Who | Writes | Must not |
| --- | --- | --- | --- |
| A Tarrant keep-or-drop | sub-agent, read-only first | docs only until you name keep or drop | cad-ingest, DELETE, L17, tad.org |
| B P-78 landuse leftover | sub-agent, isolated LDT | `landuse.ts` + fixtures + PR | CAMA zip, `--apply`, value columns on `txgio_parcel` |

Fan one level. First line of every sub-agent: `DO NOT SPAWN SUB-AGENTS`. They do not commit. You merge PRs. You commit doc_repo pathspec. You update canvases again at close.

If Track A decides **drop**, stop Track B writes to `cad_property` until the drop is done or explicitly serialized. Two writers on that table in one hour is how Wave 4 happened.

### Track A — Tarrant +91,931 keep-or-drop

Authority: `_inbox/2026-08-25_p25_tarrant_drift_classify.md`. 91,349 keys from `tad_propertydata_full` on 2026-08-25. 582 delimited-only from 2026-08-14.

Name what those 91,349 are (real TAD accounts missing from the 2026-08-14 zip, or junk). Sample `prop_id` shape, situs, legal, overlap with 2025 StratMap. File `_inbox/2026-08-25_p25_tarrant_keep_or_drop.md` with KEEP or DROP and the evidence.

KEEP: leave the rows. No reload. No L17.
DROP: you present the delete SQL and a dry-run count. Do not run DELETE until the operator says go. Not this sub-agent's apply.

P-25 stays `ready:false`.

### Track B — P-78 leftover (`landuse.ts`)

`#477` shipped the upsert merge. Year / sqft / acres may still be hard-nulled on the StratMap landuse path. Isolated tree `P:/tmp/ldt-p78-landuse` from `origin/main` (`46e1a5a1`). Spec `_inbox/2026-08-24_p78_cad_property_merge_SPEC.md`. Fixtures `node scripts/p78-merge-fixtures-selftest.mjs` must stay green.

Stop forcing `year_built` / `living_area_sqft` / `land_acres` null when the DBF has `YEAR_BUILT` / `GIS_AREA`. First-valid-YYYY (F8). `GIS_AREA_U` refuse-or-convert (F5). No value columns on `txgio_parcel`. No county re-run `--apply` this card unless you dry-run one named county and the operator goes.

Open an LDT PR. Close on fixtures + PR, not a prod upsert replay. Live merge probe on prod write stays leave_behind unless you have a non-prod harness.

Atom writes still P-55 (`parcel-write-identity.ts`, `atom_did IN`, `applies-to`). This card does not mint atoms.

## Do not start

P-80 Travis 51% rebake. P-79 REST writer. P-09. COVER. Dallas/Tarrant CAMA. L17 flip. atoms `--apply`. rematerialize. memory pin raise. 280239 street-title bake. 280238 geometry seed. Re-merge #222 / #478 / #477.

## Done looks like

1. Your leftover docs are committed by pathspec (or you report none dirty).
2. All five family canvases match `11763c0` + this wave's live facts. No "Wave 4 IN FLIGHT."
3. Tarrant KEEP or DROP filed with samples. No silent delete.
4. `landuse.ts` PR open or merged, fixtures green.
5. Routing pin still `ready:false` on P-25 / P-09 / roads. `--check` PASS.
6. Close JSON + leave_behind. Sub-agents did not commit.

Read `_inbox/2026-08-25_factory_operating_instructions.md` if you drifted.
