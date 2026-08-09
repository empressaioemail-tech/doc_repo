# Pre-dispatch canon gate (M1) + standing-decision injection check (M3).
# PreToolUse hook on Agent|Write matchers in .claude/settings.json.
# Agent payload verified 2026-08-08: top-level JSON array; tool_input is
# [description, prompt, model, run_in_background] and prompt carries dispatch text.
# Fails open on any parse or IO error so a hook bug never blocks routine work.

$DocRepo = 'P:/doc_repo'
$IntentsPath = Join-Path $DocRepo '_catalog/repo_intents.md'
$PreamblePath = Join-Path $DocRepo '_catalog/DISPATCH_PREAMBLE.md'
$OverrideLog = Join-Path $DocRepo '_catalog/canon_overrides.log'

function Exit-Open { exit 0 }

function Write-BlockMessage {
    param([string]$Message)
    $escaped = ($Message -replace '\\', '\\\\' -replace '"', '\"' -replace "`r", '' -replace "`n", '\n')
    [Console]::Error.WriteLine('{"block": true, "message": "' + $escaped + '"}')
    exit 2
}

function Get-PreambleHash {
    if (-not (Test-Path -LiteralPath $PreamblePath)) { return $null, $null }
    try {
        $text = [System.IO.File]::ReadAllText($PreamblePath)
    } catch { return $null, $null }
    if ($text -match 'CANON-PREAMBLE v([a-f0-9]{8})') {
        return $Matches[1], $text
    }
    return $null, $text
}

function Get-IntentsMeta {
    if (-not (Test-Path -LiteralPath $IntentsPath)) { return $null }
    try {
        $raw = [System.IO.File]::ReadAllText($IntentsPath)
    } catch { return $null }

    $lastVerified = $null
    if ($raw -match '(?m)^last_updated:\s*(\d{4}-\d{2}-\d{2})') {
        $lastVerified = [datetime]::ParseExact($Matches[1], 'yyyy-MM-dd', $null)
    }

    $rows = @{}
    foreach ($line in ($raw -split "`n")) {
        if ($line -notmatch '^\|\s*([^|]+?)\s*\|') { continue }
        $repoCell = $Matches[1].Trim()
        if ($repoCell -in @('Repo', '---', '')) { continue }
        if ($repoCell -match '^-+$') { continue }

        $parts = $line -split '\|'
        if ($parts.Count -lt 4) { continue }

        $repoKey = ($repoCell -split '\s*\(')[0].Trim().ToLower()
        $going = $parts[3].Trim()
        $dies = if ($parts.Count -ge 5) { $parts[4].Trim() } else { '' }
        $combined = "$going $dies"

        $posture = 'active'
        if ($combined -match '(?i)NOT\s+RETIRING') {
            $posture = 'active'
        } elseif ($combined -match '(?i)ABSOLUTE\s+NO-TOUCH|\bno-touch\b') {
            $posture = 'no-touch'
        } elseif ($combined -match '(?i)\bretiring\b') {
            $posture = 'retiring'
        }

        if ($repoKey) { $rows[$repoKey] = @{ Posture = $posture; Row = $line.Trim() } }
    }

    return @{ LastVerified = $lastVerified; Rows = $rows; RawDate = if ($lastVerified) { $lastVerified.ToString('yyyy-MM-dd') } else { 'unknown' } }
}

function Resolve-RepoFromText {
    param([string]$Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return $null }

    if ($Text -match '(?m)^repo:\s*([A-Za-z0-9_.-]+)\s*$') {
        return $Matches[1].ToLower()
    }

    if ($Text -match '(?m)^CANON_OVERRIDE:') {
        # override present; still resolve repo for logging
    }

    if ($Text -match '(?m)(?:git\s+-C\s+|Working in\s+|worktree:\s*)[`'']?P:[/\\](legacy-design-tools|hauska-engine|hauska-map|hauska-mcp-server|smartcity-os|hauska-sdk|hauska-brief-extension|legacy-design-tools-prod)[/\\]?') {
        return $Matches[1].ToLower()
    }

    if ($Text -match '(?m)[`'']P:[/\\](legacy-design-tools|hauska-engine|hauska-map|hauska-mcp-server|smartcity-os|hauska-sdk|hauska-brief-extension)[/\\]') {
        return $Matches[1].ToLower()
    }

    if ($Text -match '(?m)P:[/\\]ldt[-_][A-Za-z0-9_-]+') { return 'legacy-design-tools' }
    if ($Text -match '(?m)P:[/\\]hauska-engine[-_][A-Za-z0-9_-]+') { return 'hauska-engine' }

    if ($Text -match '(?m)empressaioemail-tech/(legacy-design-tools|hauska-engine|hauska-map|hauska-mcp-server|smartcity-os|hauska-brief-extension)') {
        return $Matches[1].ToLower()
    }

    return $null
}

function Test-DispatchShaped {
    param([string]$Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return $false }

    $hasExecutorVoice = ($Text -match '(?i)\bYou are\b') -and (
        ($Text -match '(?m)^repo:\s*\S+') -or
        ($Text -match 'P:[/\\](legacy-design-tools|hauska-engine|hauska-map|hauska-mcp-server|smartcity-os|ldt-|hauska-engine-)') -or
        ($Text -match 'empressaioemail-tech/')
    )
    $hasScopeMarkers = ($Text -match '(?m)^## Scope\b') -or ($Text -match '(?m)^## Acceptance criteria\b')

    return ($hasExecutorVoice -or $hasScopeMarkers)
}

function Append-OverrideLog {
    param([string]$Repo, [string]$Reason, [string]$Prompt)
    try {
        $stamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
        $snippet = if ($Prompt.Length -gt 200) { $Prompt.Substring(0, 200) } else { $Prompt }
        $snippet = $snippet -replace '\s+', ' '
        $line = "$stamp`t$Repo`t$Reason`t$snippet"
        Add-Content -LiteralPath $OverrideLog -Value $line -Encoding utf8
    } catch {
        # logging failure must not block
    }
}

$stdin = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($stdin)) { Exit-Open }

try {
    $payload = $stdin | ConvertFrom-Json
} catch {
    Exit-Open
}

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

    if ($ToolInput.PSObject.Properties['prompt']) {
        return [string]$ToolInput.prompt
    }

    return $null
}

$toolName = $null
$inspectText = $null
$filePath = $null

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

if ($toolName -notin @('Agent', 'Write')) { Exit-Open }

if ($toolName -eq 'Write' -and $filePath -and ($filePath -match '[/\\]_dispatches[/\\]')) {
    if (-not $inspectText) { Exit-Open }
} elseif ($toolName -eq 'Write') {
    Exit-Open
}

if ([string]::IsNullOrWhiteSpace($inspectText)) { Exit-Open }

if ($inspectText -match '(?m)^CANON_OVERRIDE:\s*(.+)$') {
    $reason = $Matches[1].Trim()
    $repoForLog = Resolve-RepoFromText -Text $inspectText
    if (-not $repoForLog) { $repoForLog = 'unknown' }
    Append-OverrideLog -Repo $repoForLog -Reason $reason -Prompt $inspectText
    Exit-Open
}

$repo = Resolve-RepoFromText -Text $inspectText
$intents = Get-IntentsMeta

if ($repo -and $intents) {
    $ageDays = $null
    if ($intents.LastVerified) {
        $ageDays = ((Get-Date).Date - $intents.LastVerified.Date).Days
    }

    if ($null -ne $ageDays -and $ageDays -gt 30) {
        $msg = @"
CANON GATE (M1): repo_intents record is stale.

Repo resolved: $repo
Intent doc last_updated: $($intents.RawDate) ($ageDays days ago; limit 30)

Re-verify _catalog/repo_intents.md against git log and live state, update last_updated, then dispatch.
Or add a line: CANON_OVERRIDE: <reason>
"@
        Write-BlockMessage -Message $msg.Trim()
    }

    if ($intents.Rows.ContainsKey($repo)) {
        $posture = $intents.Rows[$repo].Posture
        if ($posture -in @('retiring', 'no-touch')) {
            $row = $intents.Rows[$repo].Row
            $msg = @"
CANON GATE (M1): dispatch blocked - repo posture is '$posture'.

Repo: $repo
Intent row: $row

See _catalog/repo_intents.md and _decisions/ for the ruling.
To override: add a line CANON_OVERRIDE: <reason>
"@
            Write-BlockMessage -Message $msg.Trim()
        }
    }
}

if ($toolName -eq 'Agent' -and (Test-DispatchShaped -Text $inspectText)) {
    $currentHash, $preambleText = Get-PreambleHash
    if ($currentHash) {
        if ($inspectText -notmatch "CANON-PREAMBLE v$currentHash") {
            if ($inspectText -match 'CANON-PREAMBLE v([a-f0-9]{8})') {
                $staleHash = $Matches[1]
                $msg = @"
CANON GATE (M3): dispatch preamble is stale (CANON-PREAMBLE v$staleHash; current is v$currentHash).

Standing decisions in _STATE.md changed since this preamble was copied.
Paste the current block below:

$preambleText
"@
                Write-BlockMessage -Message $msg.Trim()
            } else {
                $msg = @"
CANON GATE (M3): dispatch missing CANON-PREAMBLE marker (current v$currentHash).

Paste this block into the dispatch prompt:

$preambleText
"@
                Write-BlockMessage -Message $msg.Trim()
            }
        }
    }
}

Exit-Open
