# Mission — SCOUT-FLOOD-DEPTH: the wedge's missing depth, priced read-only

The R3 ingest landed NFHL zones and floodway flags, but the GTM wedge needs depth: real
BFEs (static_bfe was null in sampled AE rows) and panel effective dates (absent from
NFHL entirely). READ-ONLY scout.

Targets: FEMA FIRM panel products (effective dates per panel); cross-section and BFE
line layers (S_XS, S_BFE in full NFHL distributions — check whether our
tx_fema_nfhl_flood_zone load simply omitted sibling tables we could re-pull);
preliminary/pending panels for the six counties; and Base Level Engineering / estimated
BFE datasets (FEMA BLE for Texas HUC8s).

Per source: URL, format, vintage, coverage, license verbatim, cost, magnitude, join
mechanism, and — the key deliverable — which target closes which gap (BFE sparsity vs
missing effective dates vs floodway detail). State what CANNOT be closed from public
sources so the wedge claim can be sized honestly.

Close: `_inbox/2026-09-02_parcel-scout-flood_close.json` plus an inventory markdown.
