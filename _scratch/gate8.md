# gate8 scratch (Tier 2)

LESSON: Node 24 `fetch` on this Windows seat fails TLS (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`) unless invoked with `--use-system-ca`. PowerShell `Invoke-WebRequest` succeeds. A TLS miss is `refused`, never skip.

LESSON: PE customer path is `https://smartsite.cloud/api/spine/property-atoms/<node>/facets` (`adapterKey=property-atom-chain`, snapshot 2026-07-31). The Factory walk path is `/api/spine/cortex/api/brokerage/v1/place/node/.../facets` (baked 2026-08-29). C3 and C7 fire on both. C4 (status/sqft vs missing summary pct) is on the property-atoms envelope. Reading the store, or only the walk URL, misses the PE-render half of C4.

DEAD-END: do not wire Gate 8 as a per-county Cloud Run job until P1-FACTORY refuse-on-missing-county lands. Do not hook Gate 7 into `assertPublishMayComplete` this fan; that would refuse every P4 publish until cost rows exist.

GROUND-TRUTH 2026-08-30T22:41:17Z: production arm `scripts/gate8/run.mjs --arm production` exit 1. Gold 48021:34137 C3 fail / C4 fail / C7 fail on the property-atoms body. Alias property-explorer-xi.vercel.app same landUse null. C6 pass (evaluatedAt stamps 2026-08-11 / 08-12 / 08-16, stable across 10 s). C7 also hit `descriptor-fixture` on the same gold.

OPEN: bundle marker (vite define + dataset write + `--build-env`) is leave_behind for hauska-map. A1-A4, CDP walk, authority D, four spec triggers, and publish-job hook are Wave R / later cards.
