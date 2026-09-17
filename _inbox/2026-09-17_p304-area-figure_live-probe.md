# P-304 live probe — the integration seat runs this AFTER deploy

Lane `p304-area-figure` does not deploy (dispatch: "You do not deploy"). This is the customer
predicate the integration seat runs once PR
[legacy-design-tools#713](https://github.com/empressaioemail-tech/legacy-design-tools/pull/713)
is on the deployed surface. It is a paired probe: the SAME anonymous request against two parcels
that must DIVERGE after the change.

Fail-closed reading: if BOTH parcels withhold, the probe FAILS even though the unverified leg
looks right — that is a blanket strip, not the entitlement, and it has taken the entitled
figure away from a verified parcel (falsifier 2).

## The request

Endpoint (anonymous, through the Property Explorer allowlisted proxy — no auth header):

    POST https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope
    content-type: application/json

Body, leg A — UNVERIFIED parcel (Hays, `48209:97658`; `derivePath` has no `+atom-reconciled`):

    {"address":"629 Sturgeon Dr, San Marcos, TX 78666"}

Body, leg B — ENTITLED control (Bastrop, `48021:34049`; `derivePath` ends `+atom-reconciled`):

    {"address":"1109 Pecan St, Bastrop, TX 78602"}

PowerShell (fleet machine):

    $body = '{"address":"629 Sturgeon Dr, San Marcos, TX 78666"}'
    Invoke-RestMethod -Method Post -ContentType 'application/json' -Body $body `
      'https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope'

bash/curl:

    curl -sS -X POST -H 'content-type: application/json' \
      --data '{"address":"629 Sturgeon Dr, San Marcos, TX 78666"}' \
      https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope

## The field it must not contain

At `payload.geojson.features[0].properties`:

    buildableAreaSqFt      <- must be ABSENT (key not present), leg A
    buildableAreaPct       <- must be ABSENT (key not present), leg A

Absent means the key is missing — not `0`, not `null`. A present key holding `0` is a DIFFERENT
false claim ("setbacks consume the lot") and is a FAIL. Leg A must still be `status: "ok"` with
`payload.geojson.features[0].geometry` present (the polygon still draws) and a `disclosure` that
says the figure is withheld.

Leg B must STILL contain both keys, with the reconciled numbers unchanged (`buildableAreaSqFt`
19052, `buildableAreaPct` 63.5 at the pre-deploy read), and `derivePath` still
`labelEdges+derive+atom-reconciled`.

One-line verdict (PowerShell, both legs at once):

    $u = Invoke-RestMethod -Method Post -ContentType 'application/json' -Body '{"address":"629 Sturgeon Dr, San Marcos, TX 78666"}' 'https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope'
    $v = Invoke-RestMethod -Method Post -ContentType 'application/json' -Body '{"address":"1109 Pecan St, Bastrop, TX 78602"}' 'https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope'
    $pu = $u.payload.geojson.features[0].properties; $pv = $v.payload.geojson.features[0].properties
    "A withheld:  {0}" -f (-not ($pu.PSObject.Properties.Name -contains 'buildableAreaSqFt') -and -not ($pu.PSObject.Properties.Name -contains 'buildableAreaPct'))
    "A still draws: {0}" -f ($null -ne $u.payload.geojson.features[0].geometry)
    "B intact:    {0} / {1}" -f $pv.buildableAreaSqFt, $pv.buildableAreaPct

## Pre-deploy baseline (the leak, reproduced live 2026-09-17 ~15:50Z, before any deploy)

Raw responses saved beside this file: `2026-09-17_p304-probe-unverified-predeploy.json`,
`2026-09-17_p304-probe-verified-predeploy.json`.

    leg A  48209:97658  HTTP 200  status=ok  derivePath=labelEdges+derive
            hasSqFtKey=true  buildableAreaSqFt=5022  buildableAreaPct=58.3
            geometry=true    maxFootprintSqFt=5022   parcelAreaSqFt=8615
    leg B  48021:34049  HTTP 200  status=ok  derivePath=labelEdges+derive+atom-reconciled
            hasSqFtKey=true  buildableAreaSqFt=19052  buildableAreaPct=63.5
            geometry=true    maxFootprintSqFt=0      parcelAreaSqFt=29989

Leg A is the finding, reproduced the day of the change: no verified atom backed that envelope
(`derivePath` carries no `+atom-reconciled`) and the figure was served to an anonymous caller
anyway. Leg B is the paired control: the same route, entitled, and it must not move.

## What this probe does NOT cover (do not read a PASS as "no figure channel remains")

`maxFootprintSqFt` is the SAME withheld number under a third name and is **not** one of the two
fields this lane was dispatched to withhold: at leg A it was `5022` alongside the withheld
`5022`, because `maxFootprintSqFt = round(min(buildableAreaSqFt, coverageCap))` (derive.ts:286-292)
— i.e. the modelled buildable area whenever the modelled envelope, not lot coverage, is the
binding constraint. When `maxLotCoveragePct` binds, the value falls out of two authoritative
numbers alone and is legitimately printable, so which regime a parcel is in is an entitlement
RULING, not a lane decision. This lane reports it (CP1 `outOfScopeNamed`, PR body) and does not
widen the change unilaterally. If the integration seat's grade of P-304 is "no buildable-area
number reaches an anonymous caller", leg A's `maxFootprintSqFt` is the residual and needs the
ruling first.

hauska-engine's own PDF/site-plan figure is an independent computation (P-261) and is not
affected by this probe or by PR #713.
