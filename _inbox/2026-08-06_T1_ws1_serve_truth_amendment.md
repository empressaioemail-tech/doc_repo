---
id: T1_WS1_serve_truth_amendment
title: T1 WS1 — serve-truth acceptance amendment (operator block)
status: active
owner: nick
last_updated: 2026-08-06
related: [T1_data_accuracy_track, HEALTH_CHECK_2026-08-05_verdict, OPS-5_cert_standard]
---

# WS1 acceptance amendment — serve-truth-based

**Ruling (2026-08-06):** Operator QA on the Jones/Higgins test block **FAILED** for served state. Prior cert-path-only close is **VOID**. WS1 does not close until every operator-visible parcel on the block serves a correct envelope or carries an honest named decline.

**Master planner rulings (2026-08-06, second pass):** remediation path, cohort scope, permanence instrument, and verifyFail framework ratified below.

## Amended acceptance (WS1 only)

For the operator's twelve Jones/Higgins parcels (APNs **31299, 31308, 31317, 31326, 31335, 31344, 31353, 31362, 31371, 31380, 31389, 31398**):

1. Report **promoted vs verifyFail** disposition from the WS1 city re-warm apply.
2. Report each parcel's **SERVED envelope today** (export-path edge roles + F/S/R setbacks + buildable area from stored atoms after `prepareBoundaryEdgesForExport` R28/R30).
3. **Serve-truth gate:** cert-graded edge roles at each cert edge index must match export-served roles; front edge index must agree; buildable envelope geojson must exist from promote.
4. WS1 **OPEN** until 12/12 serve-truth-ok or honest named decline per parcel, verified by **Warden v1.3 `serveTruthEdgeLabels`** (not a one-off probe alone).

## Findings (2026-08-06 probe)

Artifact: `_inbox/2026-08-06_T1_operator_twelve_serve_truth.json`

| Metric | Count |
|--------|------:|
| WS1 promoted | 12/12 |
| WS1 verifyFail | 0/12 |
| Cert-path pass | 12/12 |
| Serve-truth ok (interim probe) | **1/12** |
| Cert-pass / serve-mismatch | **11/12** |

All twelve were **promoted** during the 2026-08-05 city apply (`depth-warm-promoted-v1`, envelope updated 2026-08-05T22:41–22:42 UTC). None are in the 1,700 verifyFail cohort.

**Root cause (confirmed):** `promoteDepthWarmToStorage` writes `setback-rule` + `buildable-envelope` only; warm-time edge labels and ring tessellation are **not** persisted to `property-boundary-edge` atoms. Export consumes stale tessellation; cert passes on fresh warm ring while PE/export serves wrong edgeIndex roles.

## Remediation — OPTION A (ratified)

**Persist warm-time `property-boundary-edge` atoms at promote** (labels + ring tessellation from the verify-pass warm candidate), **superseding** stale stored primitives.

- Engine change lands in `promoteDepthWarmToStorage` / `emitDepthWarmPromotion` path (same labels as verify pass).
- **#255 export refresh** (`prepareBoundaryEdgesForExport` R28/R30) remains as **read-side guard only** — not the write path that closes WS1.
- Merge gate: **conclusion-string gate** (unit test proving promote writes boundary-edge atoms matching warm verify labels).

Dispatch: `_dispatches/2026-08-06_T1_promote_persist_boundary_edges.md`

## Re-persist sequence (cohort-wide scope)

After engine fix merges:

| Step | Action | Gate |
|------|--------|------|
| 1 | **Scoped re-persist** — operator twelve only (`--prop-ids-file` or equivalent) | dry-run then apply, **same engineSha** on both legs |
| 2 | **Serve-truth verify** — Warden v1.3 `serveTruthEdgeLabels` on twelve (or smoke-suite equivalent) | **12/12 OK** |
| 3 | **Render pack** from **SERVED state** (not cert-path-only) | operator exhibit |
| 4 | **Cohort-wide re-persist** — store-derived promoted-envelope roster (~4,003 on 48021; re-query before apply) | **PRE-APPROVED** heavy-scan slot after T3 pilot apply |
| 5 | block13 **7/7** before/after cohort re-persist | mandatory regression |

**Step 5 roster checkpoint (2026-08-06):** Size from atoms store — all parcels with active promoted `buildable-envelope` (`depthWarmPromotion` or `depth-warm-verify-promote` sourceAdapter). Elgin **91/91** re-warm parity is net-new only; full Elgin target **~1,977** (original 1,886 + 91). Bastrop city **~2,026** (not apply 2,015 alone). FIPS 48021 total **~4,003**. Artifact: `_inbox/2026-08-06_T1_cohort_repersist_roster_checkpoint.md`.

**Dry/apply same-SHA rule** applies to every re-persist run: record `engineSha` in both dry-run and apply summary artifacts; verifyPass/promote counts must match between legs at the same SHA (factory runbook §2).

Elgin close is **provisional**: warm quality accepted at Bastrop-city parity gates; serve-truth remediation **inherited** — see `_inbox/2026-08-06_T1_elgin_close.json`.

## Permanence — Warden v1.3 `serveTruthEdgeLabels`

Ship a **standing serve-truth instrument** with the engine fix:

- **Warden v1.3 check:** `serveTruthEdgeLabels` — on sample (or cert-roster) parcels, compare cert-path `labelEdgesFromRoads` edge labels vs export-served `edgeIndex` role agreement after `prepareBoundaryEdgesForExport`.
- defectClass: `CERT-VS-SERVE-EDGE-MISMATCH`
- WS1 close is verified **BY this instrument**, not by a one-off probe script alone.
- Spec: `90_operations/OPS-5_cert_standard.md` (Warden v1.3 section); factory runbook §4 Warden checks.

Smoke-suite equivalent acceptable if it runs the same comparison on the operator twelve + block13 roster on every shared-code deploy.

## verifyFail cohort reconciliation (1,700)

**Framework approved** by master planner. Per-parcel ledger still **owed** (export from apply log + pinned dry-run @ `1256277`).

| Bucket | Count | Disposition (ratified) |
|--------|------:|------------------------|
| no-setback-row | 1943 | **honest-decline OR stamp** per OPS-7 doctrine (never fabricate row) |
| front-orientation | 477 | fixable at warm |
| null-inset | 540 | fixable at warm |
| road-classification-mismatch | 424 | fixable or honest-decline by road adjacency |
| faces-answer | 176 | fixable (situs/orientation) |
| r32-per-edge-inset | 71 | fixable at warm |

Operator twelve: **0/12 in verifyFail** — serve-truth gap is a promote-write defect, not a warm verifyFail.

## Parked — orientation fixture

Operator rural/county DXF export (setbacks 50/20/50) assigns FRONT to a non-road edge. **Parcel id awaited.** Named fixture in flag-lot/orientation workstream (`no-situs-match` fallback path).

## Execution clearance (2026-08-06 — operator ratification)

**T1 runs unattended** through the sequence below. No further master round-trips.

| Step | Action | Gate |
|------|--------|------|
| 1 | PR merge — Option A + Warden v1.3 (`fix/promote-persist-boundary-edges`) | conclusion-string tests + block13 7/7 on CI |
| 2 | Scoped re-persist — operator twelve | same-SHA dry/apply |
| 3 | Warden v1.3 on twelve | **12/12 OK** |
| 4 | Render pack from **served store** | **OPERATOR GLANCE** (only human beat) — same Higgins screenshots, fixed from served atoms |
| 5 | Cohort apply — store roster (~4,003; re-query before apply) | PRE-APPROVED slot after T3 pilot apply |

Operator verifies WS1 close when artifacts file.

## Slot order (unchanged)

Pinned dry-run compare ✓ → Mesquite ✓ → Elgin ✓ (provisional) → T3 slot released. Cohort-wide re-persist **queued behind T3 pilot apply** heavy-scan reservation. **WS1 OPEN** until serve-truth instrument passes on operator twelve + render pack from served state.
