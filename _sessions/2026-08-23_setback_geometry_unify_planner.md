---
date: 2026-08-23
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
---

# Session: setback geometry unification close + wedge hotfix

## Snapshot

- **Seat:** integration / doc_repo planner
- **doc_repo:** `main` @ `42a9f63` (setback WDLL close committed; close JSON + scratch amend **uncommitted**)
- **Cortex:** LDT [#467](https://github.com/empressaioemail-tech/legacy-design-tools/pull/467) `8c6d304f`, serving `cortex-api-00560-rih` @ 100%
- **PE:** [#196](https://github.com/empressaioemail-tech/hauska-map/pull/196) `f3e390ab` + hotfix [#197](https://github.com/empressaioemail-tech/hauska-map/pull/197) `b74cca1`, prod `dpl_4JRGkvaTVdhBeNmEQYdfekbSHqrg` → smartsite.cloud

## Done

1. **Option C WDLL closed** — `_inbox/2026-08-23_setback_geometry_unification_WDLL.md` status closed; close artifact `_inbox/2026-08-23_setback_geometry_unification_close.json`; thesis parity ledger entry; probe instrument `_scratch/_probe_setback_unify.mjs`.
2. **Live probes (pre-hotfix):** `48021:34137` PASS (BDC 30/10/30 wedge); `48021:34073` PASS honest-empty; `48453:280239` PASS honest-empty with short address form.
3. **Operator report: no map wedge** — root cause: PE #196 sent `parcel_node_id` on buildable-envelope POST; cortex returns **400 invalid_body**; live derive never ran; card could show stale warm buildable % without geometry.
4. **PE hotfix #197 merged + deployed** — omit `parcel_node_id` until LDT accepts it; default buildable-envelope overlay visible before layer seed; coords-only retry on geocode_miss when map seed has point.
5. **Post-hotfix proxy probe:** 908 Pine derive `ok` + geometry; Simsbrook short address `no-buildable-area` (ring 0) with correct Pflugerville scalars.

## WDLL re-grade (item 4 partial → still partial)

- Navigation address threads in PE; cortex geocode_miss on full `17005 Simsbrook Drive, Pflugerville, TX 78660`.
- `parcel_node_id` still not on cortex POST schema (PE must re-enable send after LDT lands).

## Open (next session)

| Priority | Item | Repo | Notes |
| --- | --- | --- | --- |
| P0 | **Dedupe live derive in `fact-sheet-resolver`** | hauska-map | `resolveGeometry` and `patchFacetsEnvelopeFromLive` each POST buildable-envelope serially (~400ms each) plus facets (~700ms) plus gis-layer probe (~300ms). Card shows "Reading this parcel…" until full resolve completes. |
| P0 | **Setback visualization for `no-buildable-area`** | hauska-map (+ maybe cortex) | Simsbrook has setback scalars; derive says setbacks consume lot (0% buildable). Amber fill is wrong; operator expects **visible setback geometry** (per-edge inset lines or dashed consumed outline). `setbackConsumedOverlay` needs parcel ring on `clickedParcelGeomRef`; search path may not pass geom before `onEnvelope`. |
| P1 | Cortex accept `parcel_node_id` on POST | legacy-design-tools | Unblocks Travis `, TX` class without geocodeable address. |
| P1 | Geocoder miss on full Simsbrook street address | legacy-design-tools | Shorter form works. |
| P2 | Commit doc_repo amend (close JSON deploy id + scratch) | doc_repo | Uncommitted on `main` ahead 1. |
| P2 | Engine BDC hash mirror | hauska-engine | Optional. |

## Operator feedback captured

- Property inspect feels **slow** ("Reading this parcel…" too long).
- **"No amber fill" is not acceptable UX** when setbacks exist on card; need honest visualization of setback effect, not silence.

## leave_behind

- item: dedupe derive + setback-line viz for consumed lots
- owner: property seat
- plan_row: P-60
