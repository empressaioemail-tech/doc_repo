$ErrorActionPreference = "Continue"
$h = @{ Authorization = "Bearer $env:NEON_API_KEY"; Accept = "application/json" }
$proj = "fancy-fire-06136146"; $branch = "br-crimson-feather-aphfmy91"
$c = Invoke-RestMethod -Uri "https://console.neon.tech/api/v2/projects/$proj/connection_uri?branch_id=$branch&database_name=hauska_mcp&role_name=neondb_owner" -Headers $h
$u = [uri]$c.uri; $env:PGPASSWORD = $u.UserInfo.Split(':')[1]
$ATOMS = "host=$(($u.Host -replace '-pooler','')) dbname=hauska_mcp user=$($u.UserInfo.Split(':')[0]) sslmode=require"
$env:PGOPTIONS = "-c default_transaction_read_only=on"
Write-Output "=== 5 sample node ids per county (any status) + keyKind/absenceKind ==="
psql $ATOMS -t -A -F '|' -c "select body->>'countyFips' as fips, body->>'parcelNodeId' as nid, body->>'status' as st, coalesce(body->>'parcelKeyKind','-') as kk, coalesce(body->>'absenceKind','-') as ak from atoms where entity_type='parcel-node' and body->>'countyFips' in ('48021','48055','48209','48309','48453','48491') order by random() limit 30;" 2>&1
Write-Output "=== keyKind distribution by county ==="
psql $ATOMS -t -A -F ',' -c "select body->>'countyFips' as fips, coalesce(body->>'parcelKeyKind','(none)') as kk, coalesce(body->>'absenceKind','-') as ak, count(*) from atoms where entity_type='parcel-node' and body->>'countyFips' in ('48021','48055','48209','48309','48453','48491') group by 1,2,3 order by 1,4 desc;" 2>&1
Write-Output "DONE"
