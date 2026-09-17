P-256b — EXACT dry-run and apply commands per county, for the integration seat
================================================================================
Evidence for dispatch mission step 5. Every argv below was run against the pinned
checkout (head abdb8fd) on 2026-09-17 and observed to be ACCEPTED by the real flag
parser; the failures printed are the guards, never UNKNOWN_ARGUMENT. Full transcript:
2026-09-17_p256b-pin-and-classification_integration-commands-offline.txt

THE IMAGE
---------
The two writers deploy as Cloud Run jobs built from the checkout `gcloud builds
submit` is run in:

  gcloud builds submit --config=cloudbuild.parcel-setback-cells.yaml  --project=hauska-prod-497015
  gcloud builds submit --config=cloudbuild.parcel-envelope-cells.yaml --project=hauska-prod-497015

Each config builds us-east4-docker.pkg.dev/hauska-prod-497015/hauska-factory/hauska-factory
from the working tree, pushes a :<tag>-$BUILD_ID tag, resolves its @sha256 digest, and
pins `factory-parcel-setback-cells` / `factory-parcel-envelope-cells` to that digest.
Run these from a checkout AT THE MERGED COMMIT of PR #160 (the 1.4.0 pin + regenerated
table), NOT from a pre-merge checkout -- the image is the only place the pin ships.

WHY THE PIN SURVIVES THE IMAGE BUILD: the Dockerfile does `COPY package.json ./` then
`npm install --omit=dev` and never copies package-lock.json, so the image resolves the
corpus from package.json alone. package.json pins the EXACT version "1.4.0" (not a
range) for exactly this reason.

SIX COUNTIES = THE SCOPE. FIPS: Bastrop 48021, Caldwell 48055, Hays 48209,
McLennan 48309, Travis 48453, Williamson 48491. `--county` takes ONE FIPS per
occurrence: repeated flags are accepted, a comma-joined pair is refused COUNTY_UNKNOWN
(measured, both writers).

DRY RUN (writes nothing), one county, both writers:
  gcloud run jobs execute factory-parcel-setback-cells  --project=hauska-prod-497015 --region=us-east4 --wait --args=parcel-setback-cells,--county=48021
  gcloud run jobs execute factory-parcel-envelope-cells --project=hauska-prod-497015 --region=us-east4 --wait --args=parcel-envelope-cells,--county=48021

  Repeat --county=<fips> for 48055, 48209, 48309, 48453, 48491.
  All six counties in one execution (repeated flags):
    --args=parcel-setback-cells,--county=48021,--county=48055,--county=48209,--county=48309,--county=48453,--county=48491

APPLY (the A-199 action, within that county's ceiling), one county, both writers:
  gcloud run jobs execute factory-parcel-setback-cells  --project=hauska-prod-497015 --region=us-east4 --wait --args=parcel-setback-cells,--county=48021,--apply
  gcloud run jobs execute factory-parcel-envelope-cells --project=hauska-prod-497015 --region=us-east4 --wait --args=parcel-envelope-cells,--county=48021,--apply

CEILINGS TO CHECK EACH APPLY AGAINST (A-199, parcels; see the close's per-county table):
  Bastrop 5,518 | Caldwell 5,116 | Hays 18,904 | McLennan 43,305 | Travis 103,283 | Williamson 43,346

THE IMAGE'S OWN PIN CHECK, FREE: if the deployed image's classification table and its
CORPUS_VERSION disagree, envelope-corpus-lookup.mjs throws
ENVELOPE_ROUTER_CLASSIFICATION_TABLE_STALE AT MODULE LOAD, before any store is opened.
So each county's dry run doubles as the proof that the running image carries a
consistent 1.4.0 pin + 1.4.0 table; a stale image cannot produce a clean dry run.

OFFLINE ACCEPTANCE OBSERVED (same argv, no store env, from head abdb8fd):
  parcel-setback-cells  --county=48453                 -> NEON_URL_REQUIRED       (parsed, scoped, reached connectFactory)
  parcel-setback-cells  --county=48453 --apply         -> LAPTOP_WRITE_FROZEN     (apply additionally gated off-laptop)
  parcel-setback-cells  --county=48209 --county=48453 --apply -> LAPTOP_WRITE_FROZEN (repeated --county accepted)
  parcel-setback-cells  --county=48021,48055           -> COUNTY_UNKNOWN          (comma-joined refused)
  parcel-envelope-cells --county=48453                 -> NEON_URL_REQUIRED
  parcel-envelope-cells --county=48453 --apply         -> LAPTOP_WRITE_FROZEN
  parcel-envelope-cells --county=48209 --county=48453 --apply -> LAPTOP_WRITE_FROZEN
  parcel-envelope-cells --county=48021,48055           -> COUNTY_UNKNOWN
