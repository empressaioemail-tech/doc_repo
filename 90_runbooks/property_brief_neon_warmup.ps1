# Windows PowerShell 5.1: keep all string literals ASCII-only (no em dash or smart quotes).
#
# Property Brief - Neon warmup orchestrator (PB-001)
#
# Loads substrate JSONL into cortex-api Postgres code_atoms, backfills embeddings,
# verifies GET /coverage + POST /brief per jurisdiction.
#
# Load: hauska-engine `load-neon-warmup-jsonl` (branch feat/neon-warmup-pilot-load)
# Embed: POST /api/codes/embeddings/backfill on cortex-api (not engine CLI)
#
# HTTP verify uses Invoke-RestMethod (not curl.exe) to avoid Windows schannel
# CRYPT_E_NO_REVOCATION_CHECK on some networks.
#
# One-command (no manual secrets):
#   .\property_brief_neon_warmup.ps1 -Auto -Jurisdiction round_rock_tx
#   .\property_brief_neon_warmup.ps1 -Auto   # all pilot keys
#
# Usage:
#   $env:DATABASE_URL = "<cortex-api postgres url>"
#   $env:BROKERAGE_KEY = "<same as BROKERAGE_DEV_API_KEY>"
#   $env:OPENAI_API_KEY = "<for embedding backfill>"
#   cd P:\doc_repo\90_runbooks
#   .\property_brief_neon_warmup.ps1

param(
  [string]$ConfigPath = "$PSScriptRoot/property_brief_neon_warmup.config.json",
  [string]$DatabaseUrl = $env:DATABASE_URL,
  [string]$BrokerageKey = $env:BROKERAGE_KEY,
  [string]$OpenAiKey = $env:OPENAI_API_KEY,
  [string[]]$Jurisdiction = @(),
  [switch]$SkipLoad,
  [switch]$SkipEmbed,
  [switch]$VerifyOnly,
  [switch]$DryRun,
  [switch]$UseGcloudKey,
  [switch]$UseGcloudDatabaseUrl,
  [switch]$Auto,
  [switch]$RequireBriefPass,
  [switch]$EnsureOpenAiOnCloudRun,
  [switch]$SkipEnsureOpenAi,
  [string]$DatabaseSecret = "DEPLOYMENT_DATABASE_URL",
  [string]$GcpProject = "legacy-design-tools-prod",
  [string]$GcpRegion = "us-central1",
  [string]$GcpService = "cortex-api"
)

. "$PSScriptRoot/_PropertyBriefGcloudHelpers.ps1"

$ErrorActionPreference = "Stop"

function Write-Step([string]$Msg) {
  Write-Host ""
  Write-Host "==> $Msg" -ForegroundColor Cyan
}

function Get-Config {
  if (-not (Test-Path $ConfigPath)) { throw "Missing config: $ConfigPath" }
  Get-Content $ConfigPath -Raw | ConvertFrom-Json
}

function Redact-PostgresUrl {
  param([string]$Url)
  if ($Url -match '^(postgres(ql)?://)([^/@]+@)(.+)$') {
    return "$($Matches[1])***@$($Matches[4])"
  }
  return "***"
}

function Invoke-EngineCli {
  param(
    [string]$EngineRoot,
    [string]$SubCommand,
    [string]$JurisdictionKey,
    [string]$JsonlPath,
    [string]$DbUrl
  )
  $migrateDir = Join-Path $EngineRoot "tools/migrate-legacy-codes"
  if (-not (Test-Path $migrateDir)) {
    throw "Engine migrate-legacy-codes not found at $migrateDir"
  }
  Push-Location $migrateDir
  try {
    $env:DATABASE_URL = $DbUrl
    $env:LEGACY_DATABASE_URL = $DbUrl
    $pnpmArgs = @(
      "exec", "tsx", "src/index.ts", $SubCommand,
      "--jurisdiction", $JurisdictionKey,
      "--file", $JsonlPath,
      "--database-url", $DbUrl
    )
    if ($DryRun) {
      $safeDb = Redact-PostgresUrl -Url $DbUrl
      $safeArgs = @($pnpmArgs)
      for ($i = 0; $i -lt $safeArgs.Count; $i++) {
        if ($safeArgs[$i] -eq $DbUrl) { $safeArgs[$i] = $safeDb }
      }
      Write-Host "[dry-run] pnpm $($safeArgs -join ' ')" -ForegroundColor Yellow
      return
    }
    & pnpm @pnpmArgs
    if ($LASTEXITCODE -ne 0) {
      throw "pnpm failed (exit $LASTEXITCODE): $($pnpmArgs -join ' ')"
    }
  } finally {
    Pop-Location
  }
}

function Get-BrokerageHeaders {
  param(
    [string]$ApiKey,
    [string]$InstallId = $null,
    [switch]$ForCodesApi
  )
  $h = @{ Authorization = "Bearer $ApiKey" }
  if ($ForCodesApi) {
    $h["x-brokerage-api-key"] = $ApiKey
  }
  if ($InstallId) { $h["X-Hauska-Install-Id"] = $InstallId }
  return $h
}

function Invoke-BrokerageApi {
  param(
    [string]$Method,
    [string]$Uri,
    [hashtable]$Headers,
    [string]$BodyJson = $null
  )
  $params = @{
    Uri     = $Uri
    Method  = $Method
    Headers = $Headers
  }
  if ($BodyJson) {
    $params.Body = $BodyJson
    $params.ContentType = "application/json"
  }
  try {
    return Invoke-RestMethod @params
  } catch {
    $detail = $_.Exception.Message
    if ($_.ErrorDetails.Message) { $detail = $_.ErrorDetails.Message }
    if ($detail -match 'unauthorized') {
      throw @"
${Method} ${Uri} failed: unauthorized.
BROKERAGE_KEY must match Cloud Run env BROKERAGE_DEV_API_KEY on the revision serving traffic.
Extension hauskaKey and this env var must be identical (not a doc placeholder).
"@
    }
    throw "${Method} ${Uri} failed: $detail"
  }
}

function Invoke-EmbeddingBackfill {
  param(
    [string]$ProdUrl,
    [int]$Limit = 1000,
    [int]$MaxRounds = 50
  )
  # No Authorization header - Bearer token triggers service-auth 401 on /api/codes/*.
  $embeddedTotal = 0
  $failedTotal = 0
  for ($round = 1; $round -le $MaxRounds; $round++) {
    try {
      $resp = Invoke-RestMethod -Method Post -Uri "$ProdUrl/api/codes/embeddings/backfill?limit=$Limit"
    } catch {
      $detail = $_.Exception.Message
      if ($_.ErrorDetails.Message) { $detail = $_.ErrorDetails.Message }
      throw "POST /api/codes/embeddings/backfill failed: $detail"
    }
    $n = if ($null -ne $resp.embedded) { [int]$resp.embedded } else { 0 }
    $failed = if ($null -ne $resp.failed) { [int]$resp.failed } else { 0 }
    $remaining = if ($null -ne $resp.remaining) { [int]$resp.remaining } else { 0 }
    $scanned = if ($null -ne $resp.scanned) { [int]$resp.scanned } else { 0 }
    $embeddedTotal += $n
    $failedTotal += $failed
    Write-Host "  embed round $round : scanned=$scanned embedded=$n failed=$failed remaining=$remaining"
    if ($scanned -eq 0 -and $remaining -eq 0) { break }
    if ($remaining -eq 0) { break }
    if ($n -eq 0 -and $failed -gt 0) {
      throw "Embedding failed ($failed rows) - OPENAI_API_KEY missing or invalid on cortex-api. Re-run with -EnsureOpenAiOnCloudRun (default under -Auto)."
    }
  }
  Write-Host "  embed total embedded: $embeddedTotal (failed=$failedTotal)" -ForegroundColor Green
  if ($failedTotal -gt 0 -and $embeddedTotal -eq 0) {
    throw "No embeddings written. Mount OPENAI_API_KEY on Cloud Run and re-run."
  }
}

function Test-CoverageKey {
  param([string]$ProdUrl, [string]$Key, [string]$ApiKey)
  $resp = Invoke-BrokerageApi -Method Get `
    -Uri "$ProdUrl/api/brokerage/v1/coverage" `
    -Headers (Get-BrokerageHeaders -ApiKey $ApiKey)
  $json = $resp | ConvertTo-Json -Depth 20 -Compress
  if ($json -notmatch $Key) {
    Write-Warning "Key $Key not found in coverage response"
    return $false
  }
  $neon = ($json -match "`"$Key`"") -and ($json -match "neon")
  if (-not $neon) {
    Write-Warning "Key $Key may not be tier=neon yet"
    return $false
  }
  Write-Host "coverage OK: $Key appears neon" -ForegroundColor Green
  return $true
}

function Test-BriefSmoke {
  param([string]$ProdUrl, [string]$Address, [string]$ApiKey, [string]$InstallId)
  $bodyJson = (@{
    address          = $Address
    source           = "neon-warmup"
    presentationMode = "consumer"
  } | ConvertTo-Json -Compress)
  $headers = Get-BrokerageHeaders -ApiKey $ApiKey -InstallId $InstallId
  try {
    $resp = Invoke-BrokerageApi -Method Post `
      -Uri "$ProdUrl/api/brokerage/v1/brief" `
      -Headers $headers `
      -BodyJson $bodyJson
    $out = $resp | ConvertTo-Json -Depth 30 -Compress
  } catch {
    $msg = $_.Exception.Message
    if ($msg -match "property_brief_api_unconfigured|brokerage_api_unconfigured") {
      throw "Brief unconfigured - check BROKERAGE_KEY on serving revision"
    }
    throw
  }
  if ($out -match "property_brief_api_unconfigured|brokerage_api_unconfigured") {
    throw "Brief unconfigured - check BROKERAGE_KEY on serving revision"
  }
  $corpusStatus = $null
  if ($resp.PSObject.Properties.Name -contains "corpusStatus") {
    $corpusStatus = [string]$resp.corpusStatus
  }
  $inCorpus = ($corpusStatus -eq "in_corpus")
  $hasCitations = $false
  if ($resp.citations) {
    if ($resp.citations -is [System.Array]) {
      $hasCitations = $resp.citations.Count -gt 0
    } else {
      $hasCitations = $true
    }
  }
  $corpusColor = if ($inCorpus) { "Green" } else { "Yellow" }
  $citeColor = if ($hasCitations) { "Green" } else { "Yellow" }
  Write-Host "  corpusStatus: $corpusStatus (in_corpus=$inCorpus)" -ForegroundColor $corpusColor
  Write-Host "  citations non-empty: $hasCitations" -ForegroundColor $citeColor
  if ($out.Length -gt 400) { $out = $out.Substring(0, 400) + "..." }
  Write-Host "  snippet: $out"
  return ($inCorpus -and $hasCitations)
}

$config = Get-Config
$prod = $config.prodApiUrl
$jsonlDir = $config.jsonlDir
$engineRoot = $config.engineRepo

if ($Auto) {
  $UseGcloudKey = $true
  $UseGcloudDatabaseUrl = $true
  $VerifyOnly = $false
  $RequireBriefPass = $true
  $EnsureOpenAiOnCloudRun = $true
}

if ($UseGcloudKey) {
  Write-Host "Reading BROKERAGE_DEV_API_KEY from Cloud Run ($GcpService)..." -ForegroundColor Cyan
  $apiKey = Get-BrokerageKeyFromGcloud -Project $GcpProject -Region $GcpRegion -Service $GcpService
  $env:BROKERAGE_KEY = $apiKey
} else {
  if (-not $BrokerageKey) {
    $BrokerageKey = $env:BROKERAGE_DEV_API_KEY
  }
  if (-not $BrokerageKey) {
    throw "Set BROKERAGE_KEY, or use -UseGcloudKey / -Auto."
  }
  $apiKey = $BrokerageKey.Trim()
  Assert-BrokerageKeyLooksValid -Key $apiKey
}
Write-Host "Auth key length: $($apiKey.Length) chars"

if ($UseGcloudDatabaseUrl) {
  Write-Host "Reading $DatabaseSecret from Secret Manager..." -ForegroundColor Cyan
  $DatabaseUrl = Get-DatabaseUrlFromGcloud -Project $GcpProject -SecretName $DatabaseSecret
  $env:DATABASE_URL = $DatabaseUrl
  $hostHint = if ($DatabaseUrl -match '@([^/?]+)') { $Matches[1] } else { "(unknown host)" }
  Write-Host "Database host: $hostHint"
} elseif ($DatabaseUrl) {
  Assert-DatabaseUrlLooksValid -Url $DatabaseUrl
}
$keys = if ($Jurisdiction.Count -gt 0) { @($Jurisdiction) } else { @($config.priorityOrder) }

Write-Step "Property Brief Neon warmup (PB-001)"
Write-Host "Prod: $prod"
Write-Host "JSONL dir: $jsonlDir"
Write-Host "Keys: $($keys -join ', ')"

if (-not $VerifyOnly) {
  if (-not $DatabaseUrl) {
    throw "DATABASE_URL required for load/embed. Use -UseGcloudDatabaseUrl, -Auto, or -VerifyOnly."
  }
  if ($EnsureOpenAiOnCloudRun -and -not $SkipEnsureOpenAi) {
    Ensure-CloudRunOpenAiSecret -Project $GcpProject -Region $GcpRegion -Service $GcpService -DryRun:$DryRun
  }
  if (-not $OpenAiKey -and -not $SkipEmbed) {
    Write-Host "Local OPENAI_API_KEY not required - embed uses Cloud Run OPENAI_API_KEY via /api/codes/embeddings/backfill."
  }
}

$results = @()
$installBase = "neon-warmup-$(Get-Date -Format 'yyyyMMdd-HHmm')"

foreach ($key in $keys) {
  if ($config.blockedKeys -contains $key) {
    Write-Warning "Skipping blocked key: $key"
    continue
  }
  $j = $config.jurisdictions.$key
  if (-not $j) {
    Write-Warning "No config for $key - skip"
    continue
  }
  $jsonlPath = Join-Path $jsonlDir $j.jsonl
  $address = $j.smokeAddress

  Write-Step "Jurisdiction: $key"
  if (-not (Test-Path $jsonlPath)) {
    Write-Warning "Missing JSONL: $jsonlPath"
    $results += [pscustomobject]@{
      key = $key; load = "missing_jsonl"; embed = "skip"
      coverage = $false; brief = $false
    }
    continue
  }
  $lineCount = (Get-Content $jsonlPath | Measure-Object -Line).Lines
  Write-Host "JSONL lines: $lineCount ($jsonlPath)"

  $loadOk = "skipped"
  $embedOk = "skipped"

  if (-not $VerifyOnly -and -not $SkipLoad) {
    Write-Host "Load..."
    try {
      Invoke-EngineCli -EngineRoot $engineRoot -SubCommand "load-neon-warmup-jsonl" `
        -JurisdictionKey $key -JsonlPath $jsonlPath -DbUrl $DatabaseUrl
      $loadOk = "ok"
    } catch {
      $loadOk = "failed: $_"
      Write-Warning "Load failed. Ensure hauska-engine branch feat/neon-warmup-pilot-load and DATABASE_URL points at cortex-api Postgres."
    }
  }

  if ((-not $VerifyOnly) -and (-not $SkipEmbed) -and ($loadOk -eq "ok")) {
    Write-Host "Embed backfill (cortex-api)..."
    try {
      Invoke-EmbeddingBackfill -ProdUrl $prod
      $embedOk = "ok"
    } catch {
      $embedOk = "failed: $_"
      Write-Warning "Embedding backfill failed - ensure OPENAI_API_KEY is mounted on cortex-api (-Auto does this)."
    }
  }

  Write-Host "Verify prod..."
  $cov = Test-CoverageKey -ProdUrl $prod -Key $key -ApiKey $apiKey
  $brief = Test-BriefSmoke -ProdUrl $prod -Address $address -ApiKey $apiKey -InstallId "$installBase-$key"

  $results += [pscustomobject]@{
    key      = $key
    lines    = $lineCount
    load     = $loadOk
    embed    = $embedOk
    coverage = $cov
    brief    = $brief
  }
}

Write-Step "Summary"
$results | Format-Table -AutoSize

$reportPath = Join-Path (Split-Path $PSScriptRoot -Parent) "_inbox/$(Get-Date -Format 'yyyy-MM-dd')_operator_neon_warmup_report.md"
if (-not $DryRun) {
  $md = @(
    "---",
    "date: $(Get-Date -Format 'yyyy-MM-dd')",
    "agent: operator",
    "topic: neon_warmup_automated_run",
    "---",
    "",
    "# Neon warmup run",
    "",
    "| key | lines | load | embed | coverage | brief |",
    "|-----|------:|------|-------|----------|-------|"
  )
  foreach ($r in $results) {
    $md += "| $($r.key) | $($r.lines) | $($r.load) | $($r.embed) | $($r.coverage) | $($r.brief) |"
  }
  $md | Set-Content -Path $reportPath -Encoding utf8
  Write-Host "Report: $reportPath" -ForegroundColor Green
}

$failedBrief = @($results | Where-Object { -not $_.brief })
if ($RequireBriefPass -and $failedBrief.Count -gt 0) {
  Write-Host ""
  Write-Host "BRIEF SMOKE FAILED for: $($failedBrief.key -join ', ')" -ForegroundColor Red
  Write-Host "Load/embed may be incomplete, or embeddings still backfilling. Re-run -Auto for the same jurisdiction." -ForegroundColor Yellow
  exit 1
}

Write-Host ""
Write-Host "DONE." -ForegroundColor Green
