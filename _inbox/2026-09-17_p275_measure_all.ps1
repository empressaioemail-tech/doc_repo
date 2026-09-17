# P-275: ONE timestamped measurement pass over every store the close cites.
# Read-only everywhere (default_transaction_read_only=on). No heavy-scan lease available (CP1).
#
# Every figure in the close's per-county table comes from THIS run and is stamped with its instant,
# because the tier-1 snapshot store is rewritten by the factory while we read it: two figures taken
# an hour apart are two different states, and DEV_PROCESS refuses a number without its date.
$ErrorActionPreference = "Continue"
$outDir = "P:\tmp\p275-scratch\out"
$stamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$h = @{ Authorization = "Bearer $env:NEON_API_KEY"; Accept = "application/json" }
$proj = "fancy-fire-06136146"; $branch = "br-crimson-feather-aphfmy91"
function Get-Cs([string]$db) {
  $c = Invoke-RestMethod -Uri "https://console.neon.tech/api/v2/projects/$proj/connection_uri?branch_id=$branch&database_name=$db&role_name=neondb_owner" -Headers $h
  $u = [uri]$c.uri
  $env:PGPASSWORD = $u.UserInfo.Split(':')[1]
  return "host=$(($u.Host -replace '-pooler','')) dbname=$db user=$($u.UserInfo.Split(':')[0]) sslmode=require"
}
$ATOMS = Get-Cs "hauska_mcp"
$SERVE = Get-Cs "neondb"
$env:PGOPTIONS = "-c default_transaction_read_only=on -c statement_timeout=900000"
$env:PGCONNECT_TIMEOUT = "60"
$fips = "'48021','48055','48209','48309','48453','48491'"
$result = [ordered]@{ measuredAtUtc = $stamp; stores = @{} }

function Run([string]$name, [string]$db, [string]$q) {
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $r = psql $db -t -A -F ',' -c $q 2>&1
  $sw.Stop()
  $result.stores[$name] = @{ db = $db; elapsedMs = $sw.ElapsedMilliseconds; rows = @($r | Where-Object { $_ -match '\S' }) }
  Write-Output "--- $name ($($sw.ElapsedMilliseconds) ms)"
  $result.stores[$name].rows | ForEach-Object { Write-Output "    $_" }
}

Write-Output "=== P-275 single measurement pass at $stamp ==="

Run "atomsParcelNodesByStatus" $ATOMS @"
select body->>'countyFips' as fips, coalesce(body->>'status','(none)') as status, count(*) as nodes
from atoms where entity_type='parcel-node' and body->>'countyFips' in ($fips)
group by 1,2 order by 1,2;
"@

Run "atomsRetiredProvenance" $ATOMS @"
select body->>'countyFips' as fips, count(*) as retired,
       count(*) filter (where body ? 'retiredAt') as has_retired_at,
       min(body->>'retiredAt') as first_retired_at, max(body->>'retiredAt') as last_retired_at,
       count(*) filter (where body ? 'retirementRunId') as has_run_id,
       min(body->>'retirementRunId') as run_id_sample
from atoms where entity_type='parcel-node' and body->>'status'='retired' and body->>'countyFips' in ($fips)
group by 1 order by 1;
"@

Run "atomsReactivationRuns" $ATOMS @"
select body->>'countyFips' as fips, body->>'reactivationRunId' as reactivation_run,
       count(*) as nodes, min(body->>'reactivatedAt') as first_at, max(body->>'reactivatedAt') as last_at
from atoms where entity_type='parcel-node' and body ? 'reactivatedAt' and body->>'countyFips' in ($fips)
group by 1,2 order by 1;
"@

Run "txgioRowsByCounty" $SERVE @"
select county_fips, count(*) as rows, count(*) filter (where prop_id is null) as null_prop_id,
       count(*) filter (where geo_id is null) as null_geo_id,
       min(source_vintage) as vintage, min(ingested_at) as first_ingest, max(ingested_at) as last_ingest
from txgio_parcel where county_fips in ($fips) group by 1 order by 1;
"@

Run "serveTier1Retirement" $SERVE @"
select split_part(place_key,':',2) as fips,
       count(*) as snapshot_rows,
       count(*) filter (where payload_json->'recordRetirement'->>'status'='retired') as retired_marked,
       count(*) filter (where coalesce(payload_json->>'status','')='retired') as status_field_retired,
       min(snapshot_at) as first_snapshot, max(snapshot_at) as last_snapshot
from place_layer_snapshots
where adapter_key='node-facets:tier1' and split_part(place_key,':',2) in ($fips)
group by 1 order by 1;
"@

Run "serveRetirementBasis" $SERVE @"
select split_part(place_key,':',2) as fips,
       coalesce(payload_json->'recordRetirement'->>'verdict','(none)') as verdict,
       coalesce(payload_json->'recordRetirement'->>'rule','(none)') as rule,
       count(*) as rows
from place_layer_snapshots
where adapter_key='node-facets:tier1' and split_part(place_key,':',2) in ($fips)
  and payload_json->'recordRetirement'->>'status'='retired'
group by 1,2,3 order by 1,4 desc;
"@

Run "serveRetiredIdPresenceInTxgio" $SERVE @"
with retired as (
  select split_part(place_key,':',2) as fips, split_part(place_key,':',3) as node_id
  from place_layer_snapshots
  where adapter_key='node-facets:tier1' and split_part(place_key,':',2) in ($fips)
    and payload_json->'recordRetirement'->>'status'='retired'
)
select r.fips, count(*) as retired_nodes,
       count(*) filter (where t.prop_id is not null) as present_by_prop_id,
       count(*) filter (where t.geo_id is not null) as present_by_geo_id
from retired r
left join txgio_parcel t on t.county_fips = r.fips and t.prop_id = r.node_id
group by 1 order by 1;
"@

$path = Join-Path $outDir "measure-all-$($stamp -replace '[:]','').json"
$result | ConvertTo-Json -Depth 6 | Set-Content -Path $path -Encoding utf8
Write-Output "=== wrote $path ==="
