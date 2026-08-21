## GROUND-TRUTH
- 2026-08-12T18:42Z A1 CLOSED; slot released
- Ledger 384/10.7987 → 423/11.8954 (+39 = 13×3)
- Owner/landuse/cad cells 0→13 each; Tarrant 89.45% + Travis gap stay not-yet
- Local engine patches uncommitted — PR owed

## LESSON
- isUsablePropId must match parcelNodeId alphabet or one bad CAD token kills a metro
- cad-parcel-roll HOLD must include LANDUSE_JOIN_HOLD not just CROSSWALK
- Scorer facet key must equal rail_key (land-use ≠ landuse)

## GROUND-TRUTH
- 2026-08-12T19:11Z A1P eng #319 MERGED @ a4889cc; CI conclusion success
- Hays cad-parcel-roll live: present=0 / join-hold=265852 / total=265852 (LANDUSE_JOIN_HOLD reason)

## LESSON
- A bare createOwnerFact().toThrow() is not a Tarrant abort proof if atomDid/provenance are also illegal — pin the message to parcelNodeId
- Uncommitted A1 working-tree patches were still recoverable at 89d4c08; recover beats reconstruct

## OPEN
- CAD-bounded accounted denominator for Tarrant 89.45% near-miss
- A2/A3 may take slot
