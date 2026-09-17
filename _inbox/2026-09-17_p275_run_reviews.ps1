# P-275 report-only review runs. NO --apply, so no write path is entered.
# Derives its own connection URIs each run (never hardcoded).
#
# NODE_OPTIONS=--use-system-ca is REQUIRED ON THIS HOST and is not a county-level workaround: this
# machine has a TLS-interception root CA in the Windows store that Node does not read by default, so
# EVERY Node https call fails with UNABLE_TO_VERIFY_LEAF_SIGNATURE -- https://example.com included.
# Without the flag every registered live-currency source reports UNREACHABLE and every candidate
# reports UNMEASURED, which is correct behaviour for an unreachable source and tells us nothing about
# the sources. With it, the sources answer.
$ErrorActionPreference = "Continue"
$outDir = "P:\tmp\p275-scratch\out"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$h = @{ Authorization = "Bearer $env:NEON_API_KEY"; Accept = "application/json" }
$proj = "fancy-fire-06136146"
$branch = "br-crimson-feather-aphfmy91"

function Get-Uri([string]$db) {
  $c = Invoke-RestMethod -Uri "https://console.neon.tech/api/v2/projects/$proj/connection_uri?branch_id=$branch&database_name=$db&role_name=neondb_owner" -Headers $h
  return ($c.uri -replace '-pooler', '')
}

$env:TXGIO_DATABASE_URL = Get-Uri "neondb"
$env:DATABASE_URL = Get-Uri "hauska_mcp"
$env:SUBSTRATE_DATABASE_URL = $env:DATABASE_URL
$env:PARCEL_NODE_PATH = "1"
$env:NODE_OPTIONS = "--use-system-ca"
$env:PGOPTIONS = "-c default_transaction_read_only=on"

$pkg = "P:\tmp\p275-live-currency-five-counties\packages\engine-core"
# Cheapest txgio reads first; Travis (894,657 rows / 691 MB of geometry) last and alone.
$counties = @("48055", "48021", "48209", "48309", "48491", "48453")

foreach ($c in $counties) {
  Write-Output "===================== county $c ====================="
  $out = Join-Path $outDir "review-$c.json"
  $t0 = Get-Date
  Push-Location $pkg
  npx tsx scripts/review-retired-parcel-nodes.mjs --county=$c --out=$out
  Pop-Location
  $elapsed = [math]::Round(((Get-Date) - $t0).TotalSeconds, 1)
  Write-Output "-- county $c wall seconds: $elapsed"
  if (Test-Path $out) { Write-Output "-- artifact: $out" } else { Write-Output "-- NO ARTIFACT WRITTEN for $c" }
}
Write-Output "===================== done ====================="
