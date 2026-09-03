# Mission — VH-COLLISION: port the S6 guard to valueHistory

Slate-1's CP1 found valueHistory's Williamson companion rows carrying the exact
S6-COLLISION signature (byte-identical crosswalk-derived dollars across situs-sharing
sibling R-accounts, viaCrosswalk=true; 257,604 of 540,174 rows exposed upper-bound) —
the S6 fix landed in the fill job's crosswalk and never traveled to the value-history
job's own crosswalk usage. Port S6's exact pattern (read the S6 close first): the
R-side situs-uniqueness guard in the value-history crosswalk SQL, the sweep sizing
actually-collided vs exposed, the explicit reset of collided companion rows BEFORE
the idempotent re-run (upserts skip, never clear), shared-situs residue honestly
absent, the traced-pair fixture (R664999/R665023) as the falsifier. Verify:
post-run zero byte-identical crosswalk-flagged dollar rows across distinct
situs-sharing R-keys; rowCount sums still equal landing denominators for the
unaffected five counties. Cloud Run only.
Close: _inbox/2026-09-03_parcel-vh-collision_close.json.
