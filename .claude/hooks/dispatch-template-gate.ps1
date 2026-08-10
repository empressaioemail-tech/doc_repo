# Dispatch-template gate (OPS-14 precondition 1b).
# PreToolUse hook on Agent|Write matchers in .claude/settings.json.
#
# Rejects executor briefs missing any of the four ruled clauses:
#   1. CANON-PREAMBLE marker (hash-pinned; canon-gate.ps1 checks freshness,
#      this one only checks presence so the two gates stay independent)
#   2. no-nesting clause as the FIRST line
#   3. exit-bounded verification
#   4. machine-checkable close artifact
#
# WHY A HOOK AND NOT A CHECKLIST. Measured base rate in this repo:
# hook-shaped controls 1-for-1, protocol-step-shaped 0-for-3. The
# session-close grading rung ran 0 of 215 sessions and was deleted rather
# than repaired. These four clauses were ruled preconditions on 2026-08-09
# and the first W1/W5 briefs went out without them, which is the whole
# reason this file exists.
#
# Payload shape verified against canon-gate.ps1 (2026-08-08): top-level JSON
# array where [7]=tool_name and [9]=tool_input, OR an object with tool_name /
# tool_input. Agent tool_input is [description, prompt, model, run_in_background].
#
# FAILS OPEN on any parse or IO error so a hook bug never blocks routine work.
# Escape hatch: a line `DISPATCH_OVERRIDE: <reason>` anywhere in the text,
# logged to _catalog/dispatch_overrides.log.

$DocRepo = 'P:/doc_repo'
$OverrideLog = Join-Path $DocRepo '_catalog/dispatch_overrides.log'

function Exit-Open { exit 0 }

function Write-BlockMessage {
    param([string]$Message)
    $escaped = ($Message -replace '\\', '\\\\' -replace '"', '\"' -replace "`r", '' -replace "`n", '\n')
    [Console]::Error.WriteLine('{"block": true, "message": "' + $escaped + '"}')
    exit 2
}

function Append-OverrideLog {
    param([string]$Reason, [string]$Text)
    try {
        $stamp = (Get-Date).ToString('o')
        $first = ($Text -split "`n" | Select-Object -First 1).Trim()
        if ($first.Length -gt 120) { $first = $first.Substring(0, 120) }
        Add-Content -LiteralPath $OverrideLog -Value "$stamp`tDISPATCH_OVERRIDE`t$Reason`t$first" -Encoding utf8
    } catch { }
}

# --- read payload (fail open on anything unexpected) ---
try {
    $raw = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($raw)) { Exit-Open }
    $payload = $raw | ConvertFrom-Json
} catch { Exit-Open }

function Get-AgentPromptFromToolInput {
    param($ToolInput)
    if ($null -eq $ToolInput) { return $null }
    if ($ToolInput -is [System.Array] -or $ToolInput -is [System.Object[]]) {
        if ($ToolInput.Count -ge 2) { return [string]$ToolInput[1] }
    }
    if ($ToolInput.PSObject.Properties['value']) {
        $inner = $ToolInput.value
        if ($inner -is [System.Array] -or $inner -is [System.Object[]]) {
            if ($inner.Count -ge 2) { return [string]$inner[1] }
        }
    }
    if ($ToolInput.PSObject.Properties['prompt']) { return [string]$ToolInput.prompt }
    return $null
}

$toolName = $null
$inspectText = $null
$filePath = $null

try {
    if ($payload -is [System.Array] -and $payload.Count -ge 10) {
        $toolName = [string]$payload[7]
        $toolInput = $payload[9]
        if ($toolName -eq 'Agent') {
            $inspectText = Get-AgentPromptFromToolInput -ToolInput $toolInput
        }
    } elseif ($payload.PSObject.Properties['tool_name']) {
        $toolName = [string]$payload.tool_name
        $toolInput = $payload.tool_input
        if ($toolName -eq 'Agent') {
            $inspectText = Get-AgentPromptFromToolInput -ToolInput $toolInput
        } elseif ($toolName -eq 'Write') {
            if ($toolInput.PSObject.Properties['file_path']) { $filePath = [string]$toolInput.file_path }
            elseif ($toolInput.PSObject.Properties['path']) { $filePath = [string]$toolInput.path }
            if ($toolInput.PSObject.Properties['contents']) { $inspectText = [string]$toolInput.contents }
            elseif ($toolInput.PSObject.Properties['content']) { $inspectText = [string]$toolInput.content }
        }
    }
} catch { Exit-Open }

if ($toolName -notin @('Agent', 'Write')) { Exit-Open }

# Scope: Agent dispatches always; Write only under _dispatches/ (same rule as canon-gate).
if ($toolName -eq 'Write') {
    if (-not ($filePath -and ($filePath -match '[/\\]_dispatches[/\\]'))) { Exit-Open }
}

if ([string]::IsNullOrWhiteSpace($inspectText)) { Exit-Open }

# Explicit override
if ($inspectText -match '(?m)^DISPATCH_OVERRIDE:\s*(.+)$') {
    Append-OverrideLog -Reason $Matches[1].Trim() -Text $inspectText
    Exit-Open
}

# --- NOT-A-DISPATCH heuristics (keep the gate off ordinary agent use) ---
# Only briefs that actually task an executor need the four clauses. A short
# read-only question to a subagent is not a dispatch.
if ($inspectText.Length -lt 400) { Exit-Open }

$dispatchSignal = $false
foreach ($pat in @(
    '(?i)\bCANON-PREAMBLE\b',
    '(?i)\bexecutor\b',
    '(?i)\bdispatch\b',
    '(?i)\bclose artifact\b',
    '(?i)\byour task\b.*\bbranch\b',
    '(?i)\bopen a PR\b',
    '(?i)\bmerge only on\b'
)) {
    if ($inspectText -match $pat) { $dispatchSignal = $true; break }
}
if (-not $dispatchSignal) { Exit-Open }

# --- the four checks ---
$missing = @()

# 1. CANON-PREAMBLE marker present (freshness is canon-gate's job)
if ($inspectText -notmatch '(?i)CANON-PREAMBLE\s+v[a-f0-9]{8}') {
    $missing += 'CANON-PREAMBLE vXXXXXXXX marker (regenerate: node P:/doc_repo/scripts/dispatch-preamble.mjs)'
}

# 2. no-nesting clause must be the FIRST non-empty line
$firstLine = ''
foreach ($line in ($inspectText -split "`n")) {
    if (-not [string]::IsNullOrWhiteSpace($line)) { $firstLine = $line.Trim(); break }
}
$noNestPat = '(?i)(do not (spawn|nest|dispatch|delegate|launch)|no[- ]nesting|never (spawn|nest|dispatch)|you are the deepest)'
if ($firstLine -notmatch $noNestPat) {
    if ($inspectText -match $noNestPat) {
        $missing += 'no-nesting clause is present but NOT the first line (it must lead, or it gets skimmed past)'
    } else {
        $missing += 'no-nesting clause as the FIRST line (e.g. "Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.")'
    }
}

# 3. exit-bounded verification
$exitBoundPat = '(?i)(exit-bounded|exit bounded|must exit|non-exiting|terminates on its own|bounded verification|do not run (a )?(watch|tail|server|non-exiting)|--watch is banned|timeout)'
if ($inspectText -notmatch $exitBoundPat) {
    $missing += 'exit-bounded verification clause (verification commands must terminate: build/test, or bg-start + curl + kill; never a watch/tail/serve)'
}

# 4. machine-checkable close artifact
$closePat = '(?i)(close artifact|_inbox/[^\s]+\.(json|md)|write (a )?(machine-checkable|close|closing) )'
if ($inspectText -notmatch $closePat) {
    $missing += 'machine-checkable close artifact clause (name the exact _inbox/ path the executor must write)'
}

if ($missing.Count -eq 0) { Exit-Open }

$bullets = ($missing | ForEach-Object { "  - $_" }) -join "`n"
$msg = @"
DISPATCH TEMPLATE GATE (OPS-14 precondition 1b): brief is missing required clauses.

MISSING:
$bullets

These four were ruled PRECONDITIONS on 2026-08-09. Base rate in this repo:
hook-shaped controls 1-for-1; protocol-step-shaped 0-for-3. Add the clauses
and re-dispatch.

Escape hatch (logged): add a line
  DISPATCH_OVERRIDE: <reason>
"@
Write-BlockMessage -Message $msg.Trim()
