# Dirty-tree close gate (OPS-14 precondition 1a).
# PreToolUse hook on the Bash matcher in .claude/settings.json.
#
# Blocks a `git push` from doc_repo when _STATE.md (or another live-state
# doc) carries UNCOMMITTED edits — i.e. a session close that would strand
# the state file locally while pushing everything else.
#
# THE FAILURE THIS PREVENTS. _STATE.md is the pickup point for the next
# agent. A close that pushes code/doc changes but leaves _STATE.md dirty
# means the next session reads a snapshot that predates the work — the
# stale-clone rewind trap, self-inflicted. It has to be a gate at the push,
# because by the time anyone notices, the next session has already planned
# against the wrong state.
#
# SCOPE. Only fires on `git push` invoked with doc_repo as the working
# directory. Other repos are out of scope (their state lives here, not
# there). Never blocks a push that includes _STATE.md in the commit.
#
# FAILS OPEN on any parse or IO error, and when git is unavailable.
# Escape hatch: `CLOSE_OVERRIDE=1 git push ...` (logged).

$DocRepo = 'P:/doc_repo'
$OverrideLog = Join-Path $DocRepo '_catalog/dispatch_overrides.log'

# Docs whose uncommitted state must never be stranded by a push.
$LiveStateDocs = @('_STATE.md', 'MEMORY.md')

function Exit-Open { exit 0 }

function Write-BlockMessage {
    param([string]$Message)
    $escaped = ($Message -replace '\\', '\\\\' -replace '"', '\"' -replace "`r", '' -replace "`n", '\n')
    [Console]::Error.WriteLine('{"block": true, "message": "' + $escaped + '"}')
    exit 2
}

function Append-OverrideLog {
    param([string]$Reason)
    try {
        $stamp = (Get-Date).ToString('o')
        Add-Content -LiteralPath $OverrideLog -Value "$stamp`tCLOSE_OVERRIDE`t$Reason" -Encoding utf8
    } catch { }
}

try {
    $raw = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($raw)) { Exit-Open }
    $payload = $raw | ConvertFrom-Json
} catch { Exit-Open }

$toolName = $null
$command = $null
try {
    if ($payload -is [System.Array] -and $payload.Count -ge 10) {
        $toolName = [string]$payload[7]
        $toolInput = $payload[9]
        if ($toolInput -is [System.Array] -or $toolInput -is [System.Object[]]) {
            if ($toolInput.Count -ge 1) { $command = [string]$toolInput[0] }
        } elseif ($toolInput.PSObject.Properties['command']) {
            $command = [string]$toolInput.command
        }
    } elseif ($payload.PSObject.Properties['tool_name']) {
        $toolName = [string]$payload.tool_name
        $toolInput = $payload.tool_input
        if ($toolInput.PSObject.Properties['command']) { $command = [string]$toolInput.command }
    }
} catch { Exit-Open }

if ($toolName -ne 'Bash' -and $toolName -ne 'PowerShell') { Exit-Open }
if ([string]::IsNullOrWhiteSpace($command)) { Exit-Open }

# Only care about pushes.
if ($command -notmatch '(?i)\bgit\s+push\b') { Exit-Open }

# Explicit override.
if ($command -match '(?i)CLOSE_OVERRIDE\s*=\s*1') {
    Append-OverrideLog -Reason 'CLOSE_OVERRIDE=1 on git push'
    Exit-Open
}

# Is this push targeting doc_repo?
#
# Two ways it is NOT, and both must exit open or the gate blocks unrelated
# work in other repos (measured 2026-08-09: it blocked a hauska-engine
# worktree push, because "no cd in the command" is not evidence of doc_repo).
#
#   1. The command explicitly cds somewhere else.
#   2. The SHELL's current directory is not doc_repo — the common case when
#      working in another repo or a worktree, where no cd appears at all.
if ($command -match '(?i)cd\s+[''"]?([A-Za-z]:[\\/][^''"\s;&|]+|/[a-z]/[^''"\s;&|]+)') {
    $cdTarget = $Matches[1] -replace '\\', '/'
    $norm = $cdTarget.ToLower() -replace '^/([a-z])/', '$1:/'
    if ($norm -notmatch 'doc_repo') { Exit-Open }
} else {
    # No explicit cd: fall back to where the shell actually is. The hook runs
    # with the tool's working directory, so this is the honest signal.
    $cwd = (Get-Location).Path -replace '\\', '/'
    if ($cwd -notmatch '(?i)doc_repo') { Exit-Open }
}

try {
    Push-Location -LiteralPath $DocRepo -ErrorAction Stop
} catch { Exit-Open }

try {
    $status = & git status --porcelain 2>$null
    if ($LASTEXITCODE -ne 0) { Pop-Location; Exit-Open }
} catch {
    Pop-Location
    Exit-Open
}
Pop-Location

if (-not $status) { Exit-Open }

# Find live-state docs with uncommitted changes. Porcelain columns:
# [0]=index status, [1]=worktree status. A staged-only change (index set,
# worktree clean) is fine — it is going into the commit. We block when the
# WORKTREE is dirty, i.e. edits that will NOT be in this push.
$stranded = @()
foreach ($line in ($status -split "`n")) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    if ($line.Length -lt 4) { continue }
    $worktreeFlag = $line.Substring(1, 1)
    $path = $line.Substring(3).Trim() -replace '"', ''
    if ($worktreeFlag -eq ' ') { continue }   # staged, clean worktree -> in the commit
    foreach ($doc in $LiveStateDocs) {
        if ($path -ieq $doc -or $path -imatch "(^|/)$([regex]::Escape($doc))$") {
            $stranded += $path
        }
    }
}

if ($stranded.Count -eq 0) { Exit-Open }

$list = (($stranded | Select-Object -Unique) | ForEach-Object { "  - $_" }) -join "`n"
$msg = @"
DIRTY-TREE CLOSE GATE (OPS-14 precondition 1a): push would STRAND live-state edits.

Uncommitted (worktree-dirty) live-state docs:
$list

_STATE.md is the next agent's pickup point. Pushing without it means the next
session plans against a snapshot that predates this work.

Fix: stage and commit the state doc with this close --
  git add _STATE.md
  git commit -m "docs(_STATE): <what changed>"
then push.

Escape hatch (logged): prefix the command with CLOSE_OVERRIDE=1
"@
Write-BlockMessage -Message $msg.Trim()
