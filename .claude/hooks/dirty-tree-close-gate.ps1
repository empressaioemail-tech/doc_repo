# Dirty-tree close gate (OPS-14 precondition 1a).
# PreToolUse hook on the Bash matcher in .claude/settings.json.
#
# Blocks a `git push` of doc_repo when _STATE.md (or another live-state
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
# SCOPE (2026-08-20). Fires only when the push mutates doc_repo. Target is
# git -C, then cd, then tool working_directory / payload cwd, then
# hook-process Get-Location. A push of another repository must not be
# judged against doc_repo's dirty _STATE.md. git -C P:/doc_repo push is in
# scope even when the hook process cwd is not doc_repo.
#
# FAILS OPEN on any parse or IO error, and when git is unavailable.
# Escape hatch: `CLOSE_OVERRIDE=1 git push ...` (logged with target repo).

$DocRepo = 'P:/doc_repo'
$OverrideLog = Join-Path $DocRepo '_catalog/dispatch_overrides.log'
$Lib = Join-Path $PSScriptRoot '_git-repo-target.ps1'

$LiveStateDocs = @('_STATE.md', 'MEMORY.md')
$LiveStatePrefix = '_state/'

function Exit-Open { exit 0 }

if (-not (Test-Path -LiteralPath $Lib)) { Exit-Open }
. $Lib

function Write-BlockMessage {
    param([string]$Message)
    $escaped = ($Message -replace '\\', '\\\\' -replace '"', '\"' -replace "`r", '' -replace "`n", '\n')
    [Console]::Error.WriteLine('{"block": true, "message": "' + $escaped + '"}')
    exit 2
}

function Append-OverrideLog {
    param([string]$TargetRepo, [string]$ToolCwd)
    try {
        $stamp = (Get-Date).ToString('o')
        $t = if ($TargetRepo) { $TargetRepo } else { '-' }
        $c = if ($ToolCwd) { $ToolCwd } else { '-' }
        Add-Content -LiteralPath $OverrideLog -Value "$stamp`tCLOSE_OVERRIDE`ttarget=$t`tcwd=$c" -Encoding utf8
    } catch { }
}

try {
    $raw = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($raw)) { Exit-Open }
    $payload = $raw | ConvertFrom-Json
} catch { Exit-Open }

$extracted = $null
try {
    $extracted = Get-ToolCommandAndCwd -Payload $payload
} catch { Exit-Open }

$toolName = $extracted.ToolName
$command = $extracted.Command
if ($toolName -and $toolName -ne 'Bash' -and $toolName -ne 'PowerShell' -and $toolName -ne 'Shell') { Exit-Open }
if ([string]::IsNullOrWhiteSpace($command)) { Exit-Open }

if (-not (Test-IsGitPushSubcommand -Command $command)) { Exit-Open }

$targetRepo = Resolve-GitRepoFromCommand -Command $command -ToolCwd $extracted.ToolCwd

if ($command -match '(?i)CLOSE_OVERRIDE\s*=\s*1') {
    Append-OverrideLog -TargetRepo $targetRepo -ToolCwd $extracted.ToolCwd
    Exit-Open
}

if (-not (Test-IsDocRepo -RepoPath $targetRepo)) { Exit-Open }

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

$stranded = @()
foreach ($line in ($status -split "`n")) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    if ($line.Length -lt 4) { continue }
    $worktreeFlag = $line.Substring(1, 1)
    $path = $line.Substring(3).Trim() -replace '"', ''
    if ($worktreeFlag -eq ' ') { continue }
    foreach ($doc in $LiveStateDocs) {
        if ($path -ieq $doc -or $path -imatch "(^|/)$([regex]::Escape($doc))$") {
            $stranded += $path
        }
    }
    if ($path -replace '\\', '/' -like "$LiveStatePrefix*") {
        $stranded += $path
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
