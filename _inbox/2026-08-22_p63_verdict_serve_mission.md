# P-63 verdict layer serve — mission

Plan row: **P-63** (OPS-16 A-024). WDLL: `_inbox/2026-08-22_verdict_layer_serve_WDLL.md` items 1–7. Governing: `19_the_instrument_contract.md` §Layer.

## Out of scope

- No atoms `--apply`. No CAMA bulk load. No P-59 scorer boolean semantics (plumbing only if touched). No ledger recompute. No tier-stamp reconciliation (identity track is separate). Do not upgrade verdicts in transit.

## Worktrees (property seat)

- cortex-api + cad-ingest: `P:/seat-worktrees/property/legacy-design-tools` branch `seat/property`
- PE inspect: `P:/seat-worktrees/property/hauska-map` branch `seat/property`
- Instruments + close JSON: `P:/doc_repo` (planner commits; sub-agents do not)

## Fan model

Three parallel tracks. Lane planner merges and deploys.

| Track | Repo | WDLL items | Deliverable |
| --- | --- | --- | --- |
| **A — cortex** | legacy-design-tools `artifacts/api-server` | 1, 2, 3, 5 | Facet response carries layer absence verdict object when not populated |
| **B — PE** | hauska-map `apps/property-explorer` | 1 (display) | Inspect renders verdict + fields; no silent empty |
| **C — instrument** | doc_repo `scripts/` | 4, 6 | `verdict-layer-serve-selftest.mjs` + fixtures; violation test both directions |

Track A must read `_catalog/tx_cad_source_registry.json` and `lib/cad-ingest/src/vintage.ts` for `bulk_primary` + declared tier. Reference Smart Files absence enum pattern (do not copy SQL; match vocabulary).

## Verdict vocabulary (fixed)

- `absent-verified` — looked in stated scope, genuinely not there
- `lookup-failed` — could not look; **never** report as absent-verified
- `not-applicable` — category does not exist for this shape

Required on absent branch: `authority`, `scopeSearched`, `asOf`, `basis`.

## Test parcels

| Label | parcelNodeId | Expected |
| --- | --- | --- |
| gold | `48021:34137` | Populated families unchanged; absent families get typed verdict not bare silence |
| dallas-metro | Tarrant `48439` or Dallas `48113` parcel on stratmap-roll tier | Structural layer `lookup-failed` with basis citing bulk_primary + undeclared CAMA |
| unincorporated | Named in close — parcel with no zoning authority | Zoning `not-applicable` |

## Registry-driven lookup-failed

When county FIPS has `bulk_primary: true` in registry AND declared vintage tier is `stratmap-roll` (not `cad-export`), structural/CAMA-dependent layers MUST return `lookup-failed`, not empty chain or `atom-miss` alone.

## CP / close paths

- CP1: `_inbox/2026-08-22_p63-verdict-serve_cp1.json` — schema design + falsifiers per track
- CP2: `_inbox/2026-08-22_p63-verdict-serve_cp2.json` — violation tests pass + code ready for deploy
- CLOSE: `_inbox/2026-08-22_p63-verdict-serve_close.json` — WDLL grades 1–7 with live probe evidence post-deploy

Deploy is planner-owned after adversarial review. Sub-agents leave branches/worktree diffs; do not commit.
