# Mission — R2: stamp the jurisdiction rails from landing

Spec: ledger section 11 "cheap fill add". `cityLimits` (and `etjStatus` IF landing's
disposition actually represents ETJ — enumerate the catalog; if it does not, stamp
cityLimits only and REPORT etjStatus as needs-source, do not fake it) are unaccounted on
all 981,407 rows while `landing_parcel_jurisdiction` holds the answer for every landing
parcel. Extend the fill job (or a sibling entrypoint) to stamp these rails with
source=landing_parcel_jurisdiction + vintage; factory PR on its own branch (the job
harness is shared — keep your module disjoint, re-green against current base); image
rebuild; execute all six counties on Cloud Run (parallel is fine, counties do not
conflict). Verify: cityLimits value cells = 981,405 landing-matched (never the 2
orphans), values agree with parcel_record.incorporated on every row (meaning-shaped:
two derivations of one fact must agree; count disagreements, expect 0, list any).
