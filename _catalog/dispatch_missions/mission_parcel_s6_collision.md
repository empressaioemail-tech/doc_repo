# Mission — S6-COLLISION: the crosswalk many-to-one fix and the damage sweep

Review finding #1 (read _inbox/2026-09-02_parcel_program_review.md finding 1 in full —
it carries the traced live example). WILLIAMSON_CROSSWALK_SQL guards uniqueness in one
direction only; two R-prefix accounts sharing a situs both crosswalk to the same unique
numeric account. 134 groups / 777 accounts exposed; R664999/R665023 confirmed carrying
a byte-identical $613,956 on two distinct parcels.

1. FIX: add the R-side guard — a shared situs among R-prefix accounts disqualifies the
   group (both directions now partition-unique). Test with the traced pair as the
   fixture; falsifier = the current one-direction SQL passing it.
2. SWEEP: all 134 groups — size the ACTUALLY-collided subset (identical non-zero dollar
   values across 2+ R-keys) vs the merely exposed; report both numbers per rail.
3. REMEDIATION — the named trap: idempotent upserts SKIP, they do not CLEAR. The
   collided cells must be explicitly reset to unaccounted (targeted corrective write,
   scoped to the exposed groups' crosswalk-sourced dollar cells only, every reset row
   recorded per the state-change rule) BEFORE re-running the fixed crosswalk ingest.
   Post-run, shared-situs groups stay honestly unaccounted — the crosswalk cannot
   distinguish them and must not guess; their resolution needs a better key (deed or
   geometry), which is reported as residue, not fixed here.
4. VERIFY: the traced pair ends with BOTH accounts unaccounted on crosswalk-sourced
   dollar rails; store-wide falsifier: zero byte-identical non-zero dollar values
   across distinct R-keys within shared-situs groups. Cloud Run only, run rows.

Close: _inbox/2026-09-02_parcel-s6-collision_close.json with the sweep numbers verbatim.
