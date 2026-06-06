# Shared gcloud helpers for Property Brief operator scripts.
# Dot-source from property_brief_neon_warmup.ps1 and property_brief_data_wave.ps1

function Invoke-GcloudQuiet {
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
          $lines += $msg
        }
      } else {
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

function Get-CloudRunServiceJson {
  param(
    [string]$Project,
    [string]$Region,
    [string]$Service
  )
  $jsonText = Invoke-GcloudQuiet run services describe $Service `
    --region=$Region `
    --project=$Project `
    --format=json
  return ($jsonText | ConvertFrom-Json)
}

function Get-BrokerageKeyFromGcloud {
  param(
    [string]$Project,
    [string]$Region,
    [string]$Service
  )
  $svc = Get-CloudRunServiceJson -Project $Project -Region $Region -Service $Service
  $entry = $svc.spec.template.spec.containers[0].env |
    Where-Object { $_.name -eq "BROKERAGE_DEV_API_KEY" } |
    Select-Object -First 1
  if (-not $entry) {
    throw "BROKERAGE_DEV_API_KEY not in Cloud Run template env for $Service."
  }
  if ($entry.valueFrom) {
    throw "BROKERAGE_DEV_API_KEY is a secret reference. Use extension hauskaKey or inline env on Cloud Run."
  }
  if (-not $entry.value) {
    throw "BROKERAGE_DEV_API_KEY has no inline value on $Service template."
  }
  return [string]$entry.value.Trim()
}

function Get-DatabaseUrlFromGcloud {
  param(
    [string]$Project,
    [string]$SecretName = "DEPLOYMENT_DATABASE_URL"
  )
  $url = Invoke-GcloudQuiet secrets versions access latest `
    --secret=$SecretName `
    --project=$Project
  $url = $url.Trim()
  if (-not $url -or $url -match '^\s*$') {
    throw "Secret $SecretName is empty in project $Project."
  }
  if ($url -notmatch '^postgres(ql)?://') {
    throw "Secret $SecretName does not look like a postgres URL."
  }
  return $url
}

function Assert-BrokerageKeyLooksValid {
  param([string]$Key)
  if ($Key -match '[<>]' -or $Key -match '(?i)paste|hauskaKey|real hauska|48 char') {
    throw @"
BROKERAGE_KEY looks like instructions pasted literally.
Use -UseGcloudKey or -Auto instead of typing placeholder text.
"@
  }
  if ($Key.Length -lt 32) {
    throw "BROKERAGE_KEY is only $($Key.Length) chars; use -UseGcloudKey or -Auto."
  }
  if ($Key -match '(?i)YOUR-|your-pilot|PASTE|PLACEHOLDER|FROM-DEPLOY|example|\.\.\.') {
    throw "BROKERAGE_KEY looks like a doc placeholder. Use -UseGcloudKey or -Auto."
  }
}

function Get-CloudRunEnvEntry {
  param(
    [string]$Project,
    [string]$Region,
    [string]$Service,
    [string]$EnvName
  )
  $svc = Get-CloudRunServiceJson -Project $Project -Region $Region -Service $Service
  return $svc.spec.template.spec.containers[0].env |
    Where-Object { $_.name -eq $EnvName } |
    Select-Object -First 1
}

function Test-CloudRunOpenAiMounted {
  param(
    [string]$Project,
    [string]$Region,
    [string]$Service
  )
  $entry = Get-CloudRunEnvEntry -Project $Project -Region $Region -Service $Service -EnvName "OPENAI_API_KEY"
  if (-not $entry) { return $false }
  if ($entry.valueFrom -and $entry.valueFrom.secretKeyRef) { return $true }
  if ($entry.value) { return $true }
  return $false
}

function Ensure-CloudRunOpenAiSecret {
  param(
    [string]$Project,
    [string]$Region,
    [string]$Service,
    [string]$SecretName = "OPENAI_API_KEY",
    [switch]$DryRun
  )
  if (Test-CloudRunOpenAiMounted -Project $Project -Region $Region -Service $Service) {
    Write-Host "Cloud Run already has OPENAI_API_KEY configured." -ForegroundColor Green
    return
  }
  Write-Host "Mounting $SecretName on $Service (embeddings backfill requires it)..." -ForegroundColor Cyan
  if ($DryRun) {
    Write-Host "[dry-run] gcloud run services update $Service --update-secrets=OPENAI_API_KEY=$SecretName`:latest"
    Write-Host "[dry-run] gcloud run services update-traffic $Service --to-latest"
    return
  }
  Invoke-GcloudQuiet secrets describe $SecretName --project=$Project | Out-Null
  Invoke-GcloudQuiet run services update $Service `
    --region=$Region `
    --project=$Project `
    --update-secrets="OPENAI_API_KEY=${SecretName}:latest"
  Invoke-GcloudQuiet run services update-traffic $Service `
    --region=$Region `
    --project=$Project `
    --to-latest
  Start-Sleep -Seconds 8
  if (-not (Test-CloudRunOpenAiMounted -Project $Project -Region $Region -Service $Service)) {
    throw "OPENAI_API_KEY still not visible on $Service after update."
  }
  Write-Host "OPENAI_API_KEY mounted; traffic shifted to latest revision." -ForegroundColor Green
}

function Assert-DatabaseUrlLooksValid {
  param([string]$Url)
  if (-not $Url -or $Url -match '\.\.\.' -or $Url -match '(?i)USER:PASS|REAL_USER|DBNAME') {
    throw "DATABASE_URL looks like a placeholder. Use -UseGcloudDatabaseUrl or -Auto."
  }
  if ($Url -notmatch '^postgres(ql)?://') {
    throw "DATABASE_URL must be a postgres connection string."
  }
}
