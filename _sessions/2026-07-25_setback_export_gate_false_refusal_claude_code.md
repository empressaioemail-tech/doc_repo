---
date: 2026-07-25
agent: planner
repo: portfolio
session_type: execute
rolled_up: false
model: cursor-grok-4.5
---

# Session: setback export gate false refusal (land + verify)

## What was done

Closed the site-plan export false refusal on parcels that already have setback-rule atoms with silent axes (e.g. Bastrop P-5 `48021:47595`: F 15' + S/R `not_specified`).

**Root causes (two, stacked):**

1. `buildParcelTerrainRoutes` defaulted to `InMemoryStorage()`, so production engine-api never saw Postgres setback-rule atoms and every parcel looked like `setback_rule_missing`.
2. After wiring Postgres, `listPropertyAtomsByParcelNodeId` omitted `parcel-terrain-model`, so refresh could write artifacts while GET/download always 404'd.

**Also:** sheet labeling for `not_specified` (same class as PE #67 / engine #120 display fix) so silent axes are labeled honestly, never fabricated as S/R feet, and never used as a reason to refuse the whole export.

**Shipped (hauska-engine):**

| PR | What |
|----|------|
| [#121](https://github.com/empressaioemail-tech/hauska-engine/pull/121) | PgStorage for parcel-terrain routes; `not_specified` sheet labels; uniform-min ignores silent zeros |
| [#122](https://github.com/empressaioemail-tech/hauska-engine/pull/122) | Include `parcel-terrain-model` in parcel atom list; DXF/PDF legend for uniform-min + silent axes; `cloudbuild.engine-api.yaml` |

**Deploy (traffic trap watched):**

- Wrong-image near-miss: `gcloud run deploy --source=.` used root Dockerfile (retrieval-api). Rolled traffic back to `00038-78q` immediately. Health recovered to `engine-api`.
- Correct path: `cloudbuild.engine-api.yaml` → `services/engine-api/Dockerfile` → canary tag → health = `engine-api` → shift.
- Serving: **`hauska-engine-api-00086-hoz` @ 100%** (tag `setback-gate`).

**Live verify (MET):**

- `48021:47595` site-plan refresh → 201 with `dxf-site-plan` / `ifc-site-plan` / `pdf-site-plan`.
- GET + download succeed; PDF summary: `F 15' · S not specified · R not specified — build-to-line governs`; DXF contains `not specified` / `build-to-line` / `SETBACKS:`.
- Truly missing parcel `48021:999999001` → 422 `setback_rule_missing` (anti-fabrication guard intact).
- Pre-fix prod (`00038`) still 422'd on 47595 (control).

## What was learned

- Engine-api Cloud Run must never be source-deployed from the repo root Dockerfile (that image is retrieval-api). Use `services/engine-api/Dockerfile` / `cloudbuild.engine-api.yaml`.
- `not_specified` ≠ missing must be applied at every consumer of setback axes (display, derive, export gate, sheet labels), not only PE inspect.
- StoragePort parcel lists that omit an entity type the write path uses create silent "refresh OK / download 404" loops.

## What's still open

- Signed-in PE UI dogfood of the same parcel (engine path verified; PE BFF soft-422 mapping should clear once engine stops false-missing).
- Optional: re-bake setback atoms so `fieldProvenance.notSpecified` is on the wire (today export enriches from B3 table by `districtCode`).
- Delete or quarantine accidental retrieval image tagged onto engine-api `00039` if still in Artifact Registry.

## Suggested canonical doc updates

- `00_current_state.md`: bump; note setback export gate closed + engine-api deploy rule.
- `_catalog/thesis_parity_ledger.md`: findings-log entry for not_specified vs missing at export + StoragePort list completeness.
- Check-in: `_inbox/2026-07-25_setback_export_gate_false_refusal_checkin.md`.
