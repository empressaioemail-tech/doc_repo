# M2 cadence hook: refresh canon divergence report when _STATE.md is read
# and the report is missing or older than 12 hours.
# PreToolUse on Read matcher in .claude/settings.json.
# FAIL OPEN always — exit 0 on every path. A detector that breaks reads gets disabled.

$DocRepo = 'P:/doc_repo'
$Report = Join-Path $DocRepo '_catalog/canon_divergence.md'
$Script = Join-Path $DocRepo 'scripts/canon-divergence.mjs'
$MaxAgeHours = 12

function Exit-Open { exit 0 }

$stdin = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($stdin)) { Exit-Open }

try {
    $payload = $stdin | ConvertFrom-Json
} catch {
    Exit-Open
}

# Resolve file path from Read tool payload (object or array shapes).
$path = $null
try {
    if ($payload -is [System.Array] -and $payload.Count -ge 10) {
        $toolName = [string]$payload[7]
        if ($toolName -ne 'Read') { Exit-Open }
        $toolInput = $payload[9]
        if ($toolInput -is [System.Array] -and $toolInput.Count -ge 1) {
            $path = [string]$toolInput[0]
        } elseif ($toolInput.PSObject.Properties['path']) {
            $path = [string]$toolInput.path
        } elseif ($toolInput.PSObject.Properties['file_path']) {
            $path = [string]$toolInput.file_path
        }
    } elseif ($payload.PSObject.Properties['tool_name']) {
        if ([string]$payload.tool_name -ne 'Read') { Exit-Open }
        $ti = $payload.tool_input
        if ($ti.PSObject.Properties['path']) { $path = [string]$ti.path }
        elseif ($ti.PSObject.Properties['file_path']) { $path = [string]$ti.file_path }
    } else {
        Exit-Open
    }
} catch {
    Exit-Open
}

if ([string]::IsNullOrWhiteSpace($path)) { Exit-Open }
if ($path -notmatch '(?i)[/\\]_STATE\.md$') { Exit-Open }

# Stale / missing report → refresh. Fresh report → silent.
$needsRun = $true
if (Test-Path -LiteralPath $Report) {
    try {
        $age = (Get-Date) - (Get-Item -LiteralPath $Report).LastWriteTime
        if ($age.TotalHours -lt $MaxAgeHours) { $needsRun = $false }
    } catch {
        $needsRun = $true
    }
}

if (-not $needsRun) { Exit-Open }
if (-not (Test-Path -LiteralPath $Script)) { Exit-Open }

try {
    $node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $node) { Exit-Open }
    # --no-fetch keeps this under hook timeout; fetch is for manual/inbox runs.
    & node $Script --no-fetch --no-stamp 2>$null | Out-Null
} catch {
    # fail open
}

Exit-Open
