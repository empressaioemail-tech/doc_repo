# P-275: classify Bastrop's 1,013 residual retired parcel nodes -- SECOND PASS.
#
# The first pass matched BCAD features by geo_id WITHOUT looking at geometry type, and BCAD's parcels
# layer publishes some records as POINTS (a record for a parcel with no mapped polygon). Those matched
# a geo_id and produced 164 "re-keyed"/"contradiction" rows that were an artifact of the query, not a
# finding. This pass records the geometry type and the polygon point count for every match, so the
# classes below are separated by evidence:
#
#   LIVE_POLYGON_SAME_PROP_ID   BCAD serves a usable polygon for this exact prop_id  -> reader is WRONG
#   RECORD_WITHOUT_POLYGON      BCAD knows the prop_id, but there is no usable polygon for it
#   SUCCESSOR_POLYGON_OTHER_ID  a usable polygon shares the geo_id under a DIFFERENT prop_id
#   GONE_FROM_BCAD              no BCAD record by prop_id, no polygon by geo_id
#   TXGIO_ROW_WITHOUT_GEO_ID    the plan row carries no geo_id, so only the prop_id axis exists
#
# The independent refutation is the txgio envelope: a "successor" only counts if its polygon actually
# covers the retired planning record's footprint.
$ErrorActionPreference = "Continue"
$outDir = "P:\tmp\p275-scratch\out"
$base = "https://maps.co.bastrop.tx.us/server/rest/services/Cadastral_BP/Bastrop_County_Parcels/FeatureServer/0/query"

function Get-Bcad($where, $outFields) {
  $w = [uri]::EscapeDataString($where)
  $u = "${base}?where=$w&outFields=$outFields&returnGeometry=true&outSR=4326&f=geojson"
  $r = curl.exe -s $u | ConvertFrom-Json
  if ($r.error) { return @{ error = $r.error.message } }
  return $r
}

function GeomInfo($feature) {
  $g = $feature.geometry
  if (-not $g) { return @{ type = "none"; pts = 0; w = $null; s = $null; e = $null; n = $null } }
  $type = $g.type
  $pts = 0; $w = $null; $s = $null; $e = $null; $n = $null
  if ($type -eq "Polygon") {
    $ring = $g.coordinates[0]
    $pts = @($ring).Count
    if ($pts -gt 0) {
      $lngs = $ring | ForEach-Object { $_[0] }
      $lats = $ring | ForEach-Object { $_[1] }
      $w = ($lngs | Measure-Object -Minimum).Minimum
      $e = ($lngs | Measure-Object -Maximum).Maximum
      $s = ($lats | Measure-Object -Minimum).Minimum
      $n = ($lats | Measure-Object -Maximum).Maximum
    }
  }
  return @{ type = $type; pts = $pts; w = $w; s = $s; e = $e; n = $n }
}

# ---- inputs from the first pass (keys + txgio row facts)
$txgio = @{}
foreach ($line in (Get-Content "$outDir\bastrop-retired-txgio.csv")) {
  $p = $line -split ','
  $txgio[$p[0]] = @{ geoId = $p[1]; geomBytes = $p[2]; vintage = $p[3] }
}
$keys = @(Get-Content "$outDir\bastrop-retired-keys.csv" | ForEach-Object { ($_ -split ',')[1] } | Where-Object { $_ })
Write-Output "keys: $($keys.Count)"

# ---- txgio envelopes for the footprint test
$h = @{ Authorization = "Bearer $env:NEON_API_KEY"; Accept = "application/json" }
$c = Invoke-RestMethod -Uri "https://console.neon.tech/api/v2/projects/fancy-fire-06136146/connection_uri?branch_id=br-crimson-feather-aphfmy91&database_name=neondb&role_name=neondb_owner" -Headers $h
$u = [uri]$c.uri
$env:PGPASSWORD = $u.UserInfo.Split(':')[1]
$SERVE = "host=$(($u.Host -replace '-pooler','')) dbname=neondb user=$($u.UserInfo.Split(':')[0]) sslmode=require"
$env:PGOPTIONS = "-c default_transaction_read_only=on -c statement_timeout=600000"
$env:PGCONNECT_TIMEOUT = "60"
$keyList = ($keys | ForEach-Object { "'$_'" }) -join ","
$env2 = psql $SERVE -t -A -F ',' -c "select prop_id, west_lng, south_lat, east_lng, north_lat from txgio_parcel where county_fips='48021' and prop_id in ($keyList);" 2>$null
$planEnv = @{}
foreach ($line in $env2) {
  if ($line -notmatch '\S') { continue }
  $p = $line -split ','
  $planEnv[$p[0]] = @{ w = [double]$p[1]; s = [double]$p[2]; e = [double]$p[3]; n = [double]$p[4] }
}
Write-Output "txgio envelopes: $($planEnv.Count)"

# ---- BCAD by prop_id (bare numerics), batched, WITH geometry
$byProp = @{}
$batch = 100
for ($i = 0; $i -lt $keys.Count; $i += $batch) {
  $chunk = $keys[$i..([Math]::Min($i + $batch - 1, $keys.Count - 1))]
  $r = Get-Bcad ("prop_id IN (" + (($chunk | ForEach-Object { $_.TrimStart('0') }) -join ",") + ")") "prop_id,geo_id"
  if ($r.error) { Write-Output "prop_id batch $i ERROR: $($r.error)"; continue }
  foreach ($f in @($r.features)) {
    $propKey = [string]$f.properties.prop_id
    if (-not $byProp.ContainsKey($propKey)) { $byProp[$propKey] = @() }
    $byProp[$propKey] += (GeomInfo $f)
  }
}
Write-Output "distinct prop_ids BCAD answers: $($byProp.Count)"

# ---- BCAD by geo_id (quoted strings), batched, WITH geometry
$geoIds = @($txgio.Values | ForEach-Object { $_.geoId } | Where-Object { $_ -and $_ -ne '' } | Select-Object -Unique)
$byGeo = @{}
for ($i = 0; $i -lt $geoIds.Count; $i += $batch) {
  $chunk = $geoIds[$i..([Math]::Min($i + $batch - 1, $geoIds.Count - 1))]
  $r = Get-Bcad ("geo_id IN (" + (($chunk | ForEach-Object { "'$_'" }) -join ",") + ")") "prop_id,geo_id"
  if ($r.error) { Write-Output "geo_id batch $i ERROR: $($r.error)"; continue }
  foreach ($f in @($r.features)) {
    $g = [string]$f.properties.geo_id
    if (-not $byGeo.ContainsKey($g)) { $byGeo[$g] = @() }
    $byGeo[$g] += @{ propId = [string]$f.properties.prop_id; geom = (GeomInfo $f) }
  }
}
Write-Output "distinct geo_ids BCAD answers: $($byGeo.Count)"

# ---- classify
function Covers($a, $b) {
  # does footprint b (BCAD) overlap plan envelope a at all, and is its centre inside a?
  if (-not $a -or -not $b.w) { return $false }
  $cx = ($b.w + $b.e) / 2; $cy = ($b.s + $b.n) / 2
  return ($cx -ge $a.w -and $cx -le $a.e -and $cy -ge $a.s -and $cy -le $a.n)
}

$rows = @()
foreach ($k in $keys) {
  $t = $txgio[$k]
  $geo = if ($t) { $t.geoId } else { '' }
  $propHits = if ($byProp.ContainsKey($k)) { $byProp[$k] } else { @() }
  $polySame = @($propHits | Where-Object { $_.type -eq "Polygon" -and $_.pts -ge 4 })
  $pointSame = @($propHits | Where-Object { $_.type -ne "Polygon" })
  $geoSameKeyPoly = 0
  $geoSameKeyAny = 0
  $successorCovers = 0
  $successorNoCover = 0
  $geoTough = @()
  if ($geo -and $byGeo.ContainsKey($geo)) {
    foreach ($m in $byGeo[$geo]) {
      if ($m.propId -eq $k) {
        $geoSameKeyAny += 1
        if ($m.geom.type -eq "Polygon" -and $m.geom.pts -ge 4) { $geoSameKeyPoly += 1 }
      } elseif ($m.geom.type -eq "Polygon" -and $m.geom.pts -ge 4) {
        if (Covers $planEnv[$k] $m.geom) { $successorCovers += 1; $geoTough += $m.propId } else { $successorNoCover += 1 }
      }
    }
  }
  $class =
    if ($polySame.Count -gt 0) { "LIVE_POLYGON_SAME_PROP_ID" }
    elseif ($successorCovers -gt 0) { "SUCCESSOR_POLYGON_OTHER_ID_COVERS_FOOTPRINT" }
    elseif ($pointSame.Count -gt 0 -or $geoSameKeyAny -gt 0) { "RECORD_WITHOUT_POLYGON" }
    elseif ($successorNoCover -gt 0) { "POLYGON_UNDER_OTHER_ID_DOES_NOT_COVER" }
    elseif (-not $t -or -not $geo) { "TXGIO_ROW_WITHOUT_GEO_ID" }
    else { "GONE_FROM_BCAD" }
  $rows += [pscustomobject]@{
    propId = $k
    geoId = $geo
    txgioGeomBytes = if ($t) { $t.geomBytes } else { $null }
    bcadPolyForPropId = $polySame.Count
    bcadNonPolyForPropId = $pointSame.Count
    bcadPolySameGeoId = $geoSameKeyPoly
    successorsCoveringFootprint = $successorCovers
    successorPropIds = ($geoTough -join "|")
    classification = $class
  }
}
$rows | Export-Csv -Path "$outDir\bastrop-residual-classification-v2.csv" -NoTypeInformation -Encoding ascii
$rows | ConvertTo-Json -Depth 4 | Set-Content -Path "$outDir\bastrop-residual-classification-v2.json" -Encoding utf8
Write-Output "=== classification tally (v2) ==="
$rows | Group-Object classification | Sort-Object Count -Descending | ForEach-Object { Write-Output ("  {0,-46} {1}" -f $_.Name, $_.Count) }
$rows | Where-Object { $_.successorsCoveringFootprint -gt 0 } | Select-Object -First 8 | Format-Table propId, geoId, successorsCoveringFootprint, successorPropIds -AutoSize
