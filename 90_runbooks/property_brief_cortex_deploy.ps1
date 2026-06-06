# Property Brief - automated cortex-api deploy (PowerShell)
#
# Chains GitHub Actions + gcloud for Property Brief prod cutover.
#
# Sequence (matches how Cloud Run env works):
#   deploy-canary -> run-migrations -> shift-traffic -> gcloud env -> smoke prod
#
# Why env is AFTER shift-traffic: shift-traffic pins the canary tag to the new
# image revision (mock LLM, no brokerage keys). The gcloud env update creates a
# fresh revision with Grok + BROKERAGE_* keys; we then shift 100% traffic to
# that revision with update-traffic --to-latest.
#
# Requires: gh, gcloud, curl.exe
#
# Usage:
#   cd P:\doc_repo\90_runbooks
#   .\property_brief_cortex_deploy.ps1 `
#     -ImageTag aa415548d36cc5912f29ce21bb72b72e1148992e `
#     -BrokerageKey "your-pilot-key"
#
# Resume after a partial run (GH steps already green):
#   .\property_brief_cortex_deploy.ps1 -ImageTag <sha> -BrokerageKey "<key>" -SkipGh

param(
  [Parameter(Mandatory = $true)]
  [string]$ImageTag,

  [string]$BrokerageKey,

  [string]$GcpProject = "legacy-design-tools-prod",
  [string]$Region = "us-central1",
  [string]$Service = "cortex-api",
  [string]$Repo = "empressaioemail-tech/legacy-design-tools",
  [string]$Workflow = "Cloud Run Deploy (cortex-api)",

  [int]$WalletStartBalanceCents = 1000,
  [switch]$UseGcloudKey,
  [switch]$SkipGh,
  [switch]$SkipMigrations,
  [switch]$SkipShiftTraffic,
  [switch]$DryRun
)

. "$PSScriptRoot/_PropertyBriefGcloudHelpers.ps1"

$ErrorActionPreference = "Stop"

function Write-Step([string]$Msg) {
  Write-Host ""
  Write-Host "==> $Msg" -ForegroundColor Cyan
}

function Assert-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $Name"
  }
}

function Invoke-Gcloud {
  param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$GcloudArgs
  )
  $prevEap = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  $lines = @()
  try {
    & gcloud @GcloudArgs 2>&1 | ForEach-Object {
      if ($_ -is [System.Management.Automation.ErrorRecord]) {
        $msg = $_.ToString()
        if ($msg -notmatch "InsecureRequestWarning|warnings\.warn") {
          Write-Host $msg
          $lines += $msg
        }
      } else {
        Write-Host $_
        $lines += [string]$_
      }
    }
    if ($LASTEXITCODE -ne 0) {
      throw "gcloud failed (exit $LASTEXITCODE): gcloud $($GcloudArgs -join ' ')"
    }
    return ($lines -join "`n")
  } finally {
    $ErrorActionPreference = $prevEap
  }
}

function Test-GcloudSecret([string]$SecretName) {
  $prevEap = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    & gcloud secrets describe $SecretName --project=$GcpProject 2>$null | Out-Null
    return ($LASTEXITCODE -eq 0)
  } finally {
    $ErrorActionPreference = $prevEap
  }
}

function Invoke-GhWorkflow {
  param(
    [string]$Action,
    [hashtable]$Fields = @{}
  )
  $args = @(
    "workflow", "run", $Workflow,
    "--repo", $Repo,
    "-f", "action=$Action"
  )
  foreach ($k in $Fields.Keys) {
    $args += @("-f", "$k=$($Fields[$k])")
  }
  if ($DryRun) {
    Write-Host "[dry-run] gh $($args -join ' ')"
    return
  }
  & gh @args
  if ($LASTEXITCODE -ne 0) { throw "gh workflow run failed: action=$Action" }
}

function Wait-LatestWorkflowRun {
  Start-Sleep -Seconds 8
  $json = gh run list --repo $Repo --workflow=$Workflow --limit 15 --json databaseId,event,status,conclusion,createdAt
  if ($LASTEXITCODE -ne 0) { throw "gh run list failed" }
  $run = ($json | ConvertFrom-Json | Where-Object { $_.event -eq "workflow_dispatch" } | Sort-Object createdAt -Descending | Select-Object -First 1)
  if (-not $run) { throw "No workflow_dispatch run found to watch" }
  Write-Host "Watching workflow_dispatch run $($run.databaseId) ..."
  if ($DryRun) { return }
  gh run watch $run.databaseId --repo $Repo --exit-status
  if ($LASTEXITCODE -ne 0) { throw "Workflow run $($run.databaseId) failed" }
}

function Test-Health([string]$BaseUrl) {
  try {
    $null = Invoke-RestMethod -Uri "$BaseUrl/api/healthz" -Method Get
  } catch {
    throw "healthz failed at $BaseUrl : $($_.Exception.Message)"
  }
  Write-Host "healthz OK: $BaseUrl"
}

function Test-Brief([string]$BaseUrl, [string]$Key, [string]$InstallId) {
  $bodyJson = '{"address":"251 Cool Water Dr, Bastrop, TX 78602","source":"smoke","presentationMode":"consumer"}'
  try {
    $resp = Invoke-RestMethod -Uri "$BaseUrl/api/brokerage/v1/brief" -Method Post `
      -Headers @{
        Authorization       = "Bearer $Key"
        "Content-Type"      = "application/json"
        "X-Hauska-Install-Id" = $InstallId
      } `
      -Body $bodyJson `
      -ContentType "application/json"
    $out = $resp | ConvertTo-Json -Depth 20 -Compress
  } catch {
    $detail = $_.Exception.Message
    if ($_.ErrorDetails.Message) { $detail = $_.ErrorDetails.Message }
    throw "Brief smoke failed: $detail"
  }
  if ($out -match "brokerage_api_unconfigured|property_brief_api_unconfigured") {
    throw "Brief returned unconfigured - BROKERAGE_DEV_API_KEY missing on serving revision"
  }
  if ($out -notmatch "runId") {
    throw "Brief smoke failed. Response: $out"
  }
  $runId = if ($resp.runId) { $resp.runId } else { "(present, unparsed)" }
  $hasLaySummary = ($null -ne $resp.laySummary)
  if (-not $hasLaySummary) {
    Write-Warning "Response has runId but no laySummary - confirm PR #133 is in deployed image"
  }
  Write-Host "brief smoke OK: $BaseUrl"
  Write-Host "  runId: $runId"
  Write-Host "  laySummary: $(if ($hasLaySummary) { 'present' } else { 'missing' })"
  return $out
}

Assert-Command gh
Assert-Command gcloud

if ($UseGcloudKey) {
  Write-Host "Reading BROKERAGE_DEV_API_KEY from Cloud Run..." -ForegroundColor Cyan
  $BrokerageKey = Get-BrokerageKeyFromGcloud -Project $GcpProject -Region $Region -Service $Service
} elseif (-not $BrokerageKey) {
  throw "Pass -BrokerageKey or -UseGcloudKey"
}
Assert-BrokerageKeyLooksValid -Key $BrokerageKey.Trim()

Write-Step "Config"
Write-Host "Project: $GcpProject  Service: $Service  Region: $Region  Image: $ImageTag"
if ($SkipGh) { Write-Host "SkipGh: skipping GitHub Actions steps 1-3" }

Invoke-Gcloud config set project $GcpProject

$prodUrl = (Invoke-Gcloud run services describe $Service --region=$Region --project=$GcpProject --format="value(status.url)").Trim()
if (-not $prodUrl) { throw "Could not resolve Cloud Run URL for $Service" }
$InstallId = "deploy-smoke-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

Write-Host "Prod URL: $prodUrl"

if (-not $SkipGh) {
  Write-Step "1/5 deploy-canary (GitHub Actions)"
  Invoke-GhWorkflow -Action deploy-canary -Fields @{ image_tag = $ImageTag }
  Wait-LatestWorkflowRun

  Write-Step "2/5 run-migrations (GitHub Actions)"
  if ($SkipMigrations) {
    Write-Host "Skipped (-SkipMigrations)"
  } else {
    Invoke-GhWorkflow -Action run-migrations -Fields @{ bootstrap = "false" }
    Wait-LatestWorkflowRun
  }

  Write-Step "3/5 shift-traffic (GitHub Actions)"
  if ($SkipShiftTraffic) {
    Write-Host "Skipped (-SkipShiftTraffic). Stop here; run gcloud env manually before prod smoke."
  } else {
    Invoke-GhWorkflow -Action shift-traffic
    Wait-LatestWorkflowRun
  }
} else {
  Write-Host "Steps 1-3 skipped (-SkipGh)"
}

Write-Step "4/5 gcloud env - Grok + Property Brief keys + traffic to latest"
$envVars = "BRIEFING_LLM_MODE=grok,BROKERAGE_DEV_API_KEY=$BrokerageKey,BROKERAGE_WALLET_START_BALANCE_CENTS=$WalletStartBalanceCents,BROKERAGE_WALLET_BYPASS=false,BROKERAGE_TOP_UP_INCREMENT_CENTS=500,BROKERAGE_COMPUTE_COST_CENTS=100"
if ($DryRun) {
  Write-Host "[dry-run] gcloud run services update $Service --update-env-vars=..."
  Write-Host "[dry-run] gcloud run services update-traffic $Service --to-latest"
} else {
  $hasXai = Test-GcloudSecret "XAI_API_KEY"
  if ($hasXai) {
    Write-Host "Attaching XAI_API_KEY secret + env vars in one revision"
    Invoke-Gcloud run services update $Service `
      --region=$Region `
      --project=$GcpProject `
      --update-env-vars=$envVars `
      --update-secrets="XAI_API_KEY=XAI_API_KEY:latest"
  } else {
    Write-Warning "Secret XAI_API_KEY not in $GcpProject - create it or Grok may not work"
    Invoke-Gcloud run services update $Service `
      --region=$Region `
      --project=$GcpProject `
      --update-env-vars=$envVars
  }

  Write-Host "Shifting 100% traffic to latest env-patched revision ..."
  Invoke-Gcloud run services update-traffic $Service `
    --region=$Region `
    --project=$GcpProject `
    --to-latest

  $liveRev = (Invoke-Gcloud run services describe $Service --region=$Region --project=$GcpProject --format="value(status.traffic[0].revisionName)").Trim()
  Write-Host "Serving revision: $liveRev"
}

Write-Step "5/5 smoke production"
if (-not $DryRun) {
  Test-Health -BaseUrl $prodUrl
  $null = Test-Brief -BaseUrl $prodUrl -Key $BrokerageKey -InstallId $InstallId
}

Write-Host ""
Write-Host "DONE." -ForegroundColor Green
Write-Host "Extension briefApiUrl = $prodUrl"
Write-Host "Extension hauskaKey   = (same BrokerageKey you passed in)"
