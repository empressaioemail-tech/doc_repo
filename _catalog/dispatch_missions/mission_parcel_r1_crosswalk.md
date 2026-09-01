# Mission — R1: the CAD account-to-feature crosswalk, design proven read-only

Spec: `_inbox/2026-09-01_parcel_gap_ledger.md` sections 7, 8, 11, 12(1). READ-ONLY on
every store; the deliverable is a crosswalk DESIGN with a fixture-proven instrument, not
a store write. The re-ingest is R1B, gated on this close.

Two populations, two different answers required:
1. **Williamson dual-key CAD**: 282,569 R-prefix rows (geometry-joined, dollars null) and
   319,480 numeric rows (68,483 $0 + 245,591 living>0). Find the authoritative
   account-to-feature link between the numeric and R-prefix schemes (CAD source columns:
   geo_id, ref_id, situs, owner-account structures — enumerate the catalog, do not
   guess). Prove it on >= 50 fixture pairs with a second derivation (situs+geometry
   agreement), and state the match rate and the unmatched residue honestly.
2. **Bastrop accounts-without-geometry** (8,712 living>0 + 6,158 $0, zero in txgio):
   adjudicated Mechanism A. Design where these belong: NOT stamped onto landing parcels.
   Either a companion representation on a parent feature (if a parent link exists in CAD)
   or an explicit out-of-fabric register. Recommend one with evidence.

A prefix-strip heuristic is PROHIBITED — a silent mis-join is worse than starving.
NEVER convert unaccounted to absent-verified. Close with the crosswalk spec, fixture
results verbatim, and whatContradictedTheCard.
