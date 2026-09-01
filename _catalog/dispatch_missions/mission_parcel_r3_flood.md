# Mission — R3: flood onto the record — reconcile first, then ingest

Spec: gap ledger section 10 plus operator go ("it needs to be brought up to speed").
Flood cells are unaccounted on all 981,407 rows. The committed companion row shape
(zone, floodway flag, BFE, panel id, effective date) is the product claim; the stores
are thinner and disagree.

Phase 1 — RECONCILE (checkpoint CP1 before any write): the two flood stores disagree
AO vs AE on the same parcel (prior adjudication
`_inbox/2026-08-20_c10_flood_store_adjudication.md` — tile vs point-on-surface). Derive
the reconciliation rule from authority, not convenience: NFHL polygons with
point-on-surface (or parcel-intersection with dominant-zone + all-zones rows) versus
any derived/tile store. State the rule, its falsifier, and the disagreement count it
resolves; file CP1 and proceed only on that basis.

Phase 2 — INGEST from the reconciled source (`tx_fema_nfhl_flood_zone`, ~198k rows):
zone from fld_zone, floodway flag from zone_subty, BFE from static_bfe WHERE PRESENT
(null BFE is an honest per-row absence — record it as such, never 0), panel/DFIRM id,
and vintage NFHL_48_20260101 with an explicit note that a panel EFFECTIVE DATE does not
exist in this source — that field stays honestly absent until a panel source is
acquired. Zone-major spatial join. Swept parcels with no flood polygon intersection:
absent-verified with the sweep as basis (this is a legitimate emission — the NFHL sweep
is the look). Outside-sweep stays unaccounted. Factory PR own branch, Cloud Run only,
idempotent, verify per county verbatim (zone distribution vs an independent source
query). The GTM-relevant truth (BFE sparsity, no effective date) goes in the close in
plain words — the wedge thinness is a deliverable, not a failure.
