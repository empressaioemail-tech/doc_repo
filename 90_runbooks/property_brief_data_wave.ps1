# Property Brief data wave — merge cc-agent-C branches, deploy, Neon warmup (one operator path)
#
# Phases (pick one or combine):
#   -MergeBranches   Push feature branches + build integration branch + open PR
#   -MergePr         Merge open data-wave PR when CI is green (explicit opt-in)
#   -Deploy          GitHub Actions deploy-canary + migrations + shift + env smoke
#   -Warmup          Load JSONL + embed + verify (uses -Auto on neon warmup script)
#
# Full unattended (merge PR only when you are ready):
#   .\property_brief_data_wave.ps1 -Warmup -Auto
#
# Merge + deploy + warmup Round Rock first:
#   .\property_brief_data_wave.ps1 -MergeBranches -CreatePr
#   # review PR, then:
#   .\property_brief_data_wave.ps1 -MergePr -Deploy -Warmup
#
# Everything in one shot (merges PR without human review — use deliberately):
#   .\property_brief_data_wave.ps1 -All -MergePr

param(
  [string]$ConfigPath = "$PSScriptRoot/property_brief_data_wave.config.json",
  [switch]$All,
  [switch]$MergeBranches,
  [switch]$CreatePr,
  [switch]$MergePr,
  [switch]$Deploy,
  [switch]$Warmup,
  [switch]$WarmupAllPilotKeys,
  [string]$ImageTag,
  [string]$BrokerageKey,
  [switch]$UseGcloudKey,
  [switch]$DryRun,
  [switch]$SkipPushFeatureBranches
)

$ErrorActionPreference = "Stop"

. "$PSScriptRoot/_PropertyBriefGcloudHelpers.ps1"

function Write-Step([string]$Msg) {
  Write-Host ""
  Write-Host "==> $Msg" -ForegroundColor Cyan
}

function Get-DataWaveConfig {
  if (-not (Test-Path $ConfigPath)) { throw "Missing config: $ConfigPath" }
  Get-Content $ConfigPath -Raw | ConvertFrom-Json
}

function Assert-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $Name"
  }
}

function Invoke-RepoGit {
  param(
    [string]$RepoRoot,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$GitArgs
  )
  Push-Location $RepoRoot
  try {
    if ($DryRun) {
      Write-Host "[dry-run] git $($GitArgs -join ' ')" -ForegroundColor Yellow
      return
    }
    & git @GitArgs
    if ($LASTEXITCODE -ne 0) {
      throw "git failed (exit $LASTEXITCODE): git $($GitArgs -join ' ')"
    }
  } finally {
    Pop-Location
  }
}

function Get-MainHeadSha {
  param([object]$Cfg)
  if ($DryRun) { return "dry-run-sha" }
  $sha = gh api "repos/$($Cfg.ghRepo)/commits/$($Cfg.ldtDefaultBranch)" --jq ".sha"
  if ($LASTEXITCODE -ne 0) { throw "gh api commits failed" }
  return $sha.Trim()
}

function Push-FeatureBranches {
  param([object]$Cfg)
  Write-Step "Push feature branches to origin"
  foreach ($branch in $Cfg.featureBranches) {
    Write-Host "  $branch"
    if ($SkipPushFeatureBranches) {
      Write-Host "    skipped (-SkipPushFeatureBranches)"
      continue
    }
    Invoke-RepoGit -RepoRoot $Cfg.ldtRepo checkout $branch
    Invoke-RepoGit -RepoRoot $Cfg.ldtRepo push -u $Cfg.ldtRemote $branch
  }
}

function Build-IntegrationBranch {
  param([object]$Cfg)
  Write-Step "Build integration branch: $($Cfg.integrationBranch)"
  Invoke-RepoGit -RepoRoot $Cfg.ldtRepo fetch $Cfg.ldtRemote $Cfg.ldtDefaultBranch
  Invoke-RepoGit -RepoRoot $Cfg.ldtRepo checkout -B $Cfg.integrationBranch "$($Cfg.ldtRemote)/$($Cfg.ldtDefaultBranch)"
  foreach ($branch in $Cfg.featureBranches) {
    Write-Host "  merge $branch"
    if ($DryRun) {
      Write-Host "[dry-run] git merge $Cfg.ldtRemote/$branch --no-edit"
      continue
    }
    Push-Location $Cfg.ldtRepo
    try {
      & git merge "$($Cfg.ldtRemote)/$branch" --no-edit
      if ($LASTEXITCODE -ne 0) {
        throw "Merge conflict merging $branch into $($Cfg.integrationBranch). Resolve in $($Cfg.ldtRepo) and re-run."
      }
    } finally {
      Pop-Location
    }
  }
  Invoke-RepoGit -RepoRoot $Cfg.ldtRepo push -u $Cfg.ldtRemote $Cfg.integrationBranch --force-with-lease
}

function Open-DataWavePr {
  param([object]$Cfg)
  Write-Step "Open GitHub PR"
  if ($DryRun) {
    Write-Host "[dry-run] gh pr create --head $($Cfg.integrationBranch)"
    return $null
  }
  $existing = gh pr list --repo $Cfg.ghRepo --head $Cfg.integrationBranch --json number,url --jq ".[0].url"
  if ($existing) {
    Write-Host "Existing PR: $existing"
    return $existing.Trim()
  }
  $body = @"
## Summary
- PB-003 federal site context (USGS + EPA)
- PB-005/006 retrieval + Regrid polish + ADU depth
- PB-301 encumbrance upload path + migration 0031

Integration branch for operator one-shot deploy. See ``90_runbooks/property_brief_data_wave.ps1``.

## Test plan
- [ ] CI green on integration branch
- [ ] ``property_brief_data_wave.ps1 -Deploy -UseGcloudKey``
- [ ] ``property_brief_neon_warmup.ps1 -Auto -Jurisdiction round_rock_tx``
"@
  $bodyFile = Join-Path $env:TEMP "property-brief-data-wave-pr.md"
  Set-Content -Path $bodyFile -Value $body -Encoding utf8
  $url = gh pr create --repo $Cfg.ghRepo `
    --base $Cfg.ldtDefaultBranch `
    --head $Cfg.integrationBranch `
    --title "Property Brief data wave (federal + retrieval + encumbrance)" `
    --body-file $bodyFile
  if ($LASTEXITCODE -ne 0) { throw "gh pr create failed" }
  Write-Host "PR: $url"
  return $url
}

function Wait-PrChecksGreen {
  param(
    [object]$Cfg,
    [int]$TimeoutMinutes = 45
  )
  Write-Step "Wait for PR checks"
  if ($DryRun) { return }
  $prNum = gh pr list --repo $Cfg.ghRepo --head $Cfg.integrationBranch --json number --jq ".[0].number"
  if (-not $prNum) { throw "No open PR for $($Cfg.integrationBranch)" }
  gh pr checks $prNum --repo $Cfg.ghRepo --watch --interval 20
  if ($LASTEXITCODE -ne 0) { throw "PR #$prNum checks failed or timed out" }
}

function Merge-DataWavePr {
  param([object]$Cfg)
  Write-Step "Merge data-wave PR to $($Cfg.ldtDefaultBranch)"
  if ($DryRun) {
    Write-Host "[dry-run] gh pr merge"
    return
  }
  $prNum = gh pr list --repo $Cfg.ghRepo --head $Cfg.integrationBranch --json number --jq ".[0].number"
  if (-not $prNum) { throw "No open PR for $($Cfg.integrationBranch)" }
  gh pr merge $prNum --repo $Cfg.ghRepo --merge --delete-branch
  if ($LASTEXITCODE -ne 0) { throw "gh pr merge failed for PR #$prNum" }
  Start-Sleep -Seconds 5
}

function Invoke-DeployPhase {
  param(
    [object]$Cfg,
    [string]$Tag,
    [string]$Key
  )
  Write-Step "Deploy cortex-api (image $Tag)"
  $deployArgs = @(
    "-File", (Join-Path $PSScriptRoot "property_brief_cortex_deploy.ps1"),
    "-ImageTag", $Tag
  )
  if ($Key) {
    $deployArgs += @("-BrokerageKey", $Key)
  } else {
    $deployArgs += "-UseGcloudKey"
  }
  if ($DryRun) {
    $deployArgs += "-DryRun"
  }
  & powershell -NoProfile @deployArgs
  if ($LASTEXITCODE -ne 0) { throw "property_brief_cortex_deploy.ps1 failed" }
}

function Invoke-WarmupPhase {
  param(
    [object]$Cfg,
    [string[]]$JurisdictionKeys
  )
  Write-Step "Neon warmup (load + embed + verify)"
  $warmupArgs = @(
    "-File", (Join-Path $PSScriptRoot "property_brief_neon_warmup.ps1"),
    "-Auto"
  )
  foreach ($j in $JurisdictionKeys) {
    $warmupArgs += @("-Jurisdiction", $j)
  }
  if ($DryRun) {
    $warmupArgs += "-DryRun"
  }
  & powershell -NoProfile @warmupArgs
  if ($LASTEXITCODE -ne 0) { throw "property_brief_neon_warmup.ps1 failed (brief smoke or load)" }
}

Assert-Command git
Assert-Command gh
Assert-Command gcloud

$cfg = Get-DataWaveConfig

if ($All) {
  $MergeBranches = $true
  $CreatePr = $true
  $Deploy = $true
  $Warmup = $true
}

if (-not ($MergeBranches -or $CreatePr -or $MergePr -or $Deploy -or $Warmup)) {
  throw "Pick at least one phase: -MergeBranches, -CreatePr, -MergePr, -Deploy, -Warmup, or -All"
}

Write-Step "Property Brief data wave"
Write-Host "LDT repo: $($cfg.ldtRepo)"
Write-Host "Integration: $($cfg.integrationBranch)"
Write-Host "Features: $($cfg.featureBranches -join ', ')"

if ($MergeBranches) {
  if (-not (Test-Path $cfg.ldtRepo)) {
    throw "LDT repo not found at $($cfg.ldtRepo). Clone legacy-design-tools first."
  }
  Push-FeatureBranches -Cfg $cfg
  Build-IntegrationBranch -Cfg $cfg
}

if ($CreatePr) {
  $null = Open-DataWavePr -Cfg $cfg
}

if ($MergePr) {
  Wait-PrChecksGreen -Cfg $cfg
  Merge-DataWavePr -Cfg $cfg
}

if ($Deploy) {
  if (-not $ImageTag) {
    Write-Host "Resolving main HEAD SHA for deploy..."
    $ImageTag = Get-MainHeadSha -Cfg $cfg
    Write-Host "ImageTag: $ImageTag"
  }
  $key = $BrokerageKey
  if (-not $key -and ($UseGcloudKey -or -not $BrokerageKey)) {
    $UseGcloudKey = $true
  }
  if ($UseGcloudKey) {
    Invoke-DeployPhase -Cfg $cfg -Tag $ImageTag -Key $null
  } else {
    if (-not $key) { throw "Pass -BrokerageKey or -UseGcloudKey for deploy" }
    Invoke-DeployPhase -Cfg $cfg -Tag $ImageTag -Key $key
  }
}

if ($Warmup) {
  $jKeys = if ($WarmupAllPilotKeys) {
    @()
  } else {
    @($cfg.pilotJurisdictionFirst)
  }
  Invoke-WarmupPhase -Cfg $cfg -JurisdictionKeys $jKeys
}

Write-Host ""
Write-Host "DATA WAVE DONE." -ForegroundColor Green
