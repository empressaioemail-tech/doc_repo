# Shared git-target resolution for branch-guard and dirty-tree-close-gate.
# Keep both hooks on the repository the command mutates, not the hook process cwd.
# Invoked via: . (Join-Path $PSScriptRoot '_git-repo-target.ps1')

function Normalize-RepoPath {
    param([string]$Path)
    if ([string]::IsNullOrWhiteSpace($Path)) { return $null }
    $p = $Path.Trim().Trim('"', "'") -replace '\\', '/'
    if ($p -match '^/([a-z])/(.+)$') {
        $p = ($Matches[1] + ':/' + $Matches[2])
    }
    return $p.ToLower()
}

function Test-IsDocRepo {
    param([string]$RepoPath)
    $norm = Normalize-RepoPath $RepoPath
    if (-not $norm) { return $false }
    return ($norm -match '(^|[/\\])doc_repo/?$')
}

function Get-ToolCommandAndCwd {
    param($Payload)
    $command = $null
    $toolCwd = $null
    $toolName = $null

    if ($Payload -is [System.Array] -and $Payload.Count -ge 10) {
        $toolName = [string]$Payload[7]
        $toolInput = $Payload[9]
        if ($toolInput -is [System.Array] -or $toolInput -is [System.Object[]]) {
            if ($toolInput.Count -ge 1) { $command = [string]$toolInput[0] }
        } elseif ($null -ne $toolInput) {
            if ($toolInput.PSObject.Properties['command']) { $command = [string]$toolInput.command }
            if ($toolInput.PSObject.Properties['working_directory']) { $toolCwd = [string]$toolInput.working_directory }
        }
    } elseif ($Payload.PSObject.Properties['tool_name'] -or $Payload.PSObject.Properties['tool_input']) {
        if ($Payload.PSObject.Properties['tool_name']) { $toolName = [string]$Payload.tool_name }
        $ti = $Payload.tool_input
        if ($null -ne $ti) {
            if ($ti.PSObject.Properties['command']) { $command = [string]$ti.command }
            if ($ti.PSObject.Properties['working_directory']) { $toolCwd = [string]$ti.working_directory }
        }
    }

    if (-not $toolCwd -and $Payload.PSObject.Properties['cwd']) {
        $toolCwd = [string]$Payload.cwd
    }

    return @{
        Command = $command
        ToolCwd = $toolCwd
        ToolName = $toolName
    }
}

function Resolve-GitRepoFromCommand {
    param(
        [string]$Command,
        [string]$ToolCwd
    )

    if ($Command -match '(?i)\bgit\s+-C\s+("([^"]+)"|''([^'']+)''|(\S+))') {
        if ($Matches[2]) { return $Matches[2] }
        if ($Matches[3]) { return $Matches[3] }
        return $Matches[4]
    }

    $cdTarget = $null
    foreach ($m in [regex]::Matches($Command, '(?i)(?:^|[;&|]\s*)cd\s+("([^"]+)"|''([^'']+)''|([A-Za-z]:[\\/][^\s''";|&]+|/[a-z]/[^\s''";|&]+))')) {
        if ($m.Groups[2].Success) { $cdTarget = $m.Groups[2].Value }
        elseif ($m.Groups[3].Success) { $cdTarget = $m.Groups[3].Value }
        else { $cdTarget = $m.Groups[4].Value }
    }
    if ($cdTarget) { return $cdTarget }

    if (-not [string]::IsNullOrWhiteSpace($ToolCwd)) { return $ToolCwd }

    # Accepted residual, 2026-08-20. Process cwd is the value that produced
    # the scope defect this resolver exists to close. It remains the fallback
    # when git -C, cd, and tool cwd are all absent. Git itself then runs in
    # the tool's shell cwd; the assumption is hook-process cwd equals that
    # shell cwd. Unknown target is collapsed into this default rather than
    # represented as its own state. Fail-closed on unknown would block
    # ordinary commits in any harness that omits cwd and train the bypass.
    # Fail-open on unknown would recreate the silent miss. Named as a default,
    # not as a determination. See 61_enforcement_doctrine.md revision 6.
    return (Get-Location).Path
}

# git push as a subcommand, allowing git -C <path> and dashed flags before it.
# Does not treat the word push inside an argument as the subcommand.
function Test-IsGitPushSubcommand {
    param([string]$Command)
    return [bool]($Command -match '(?i)\bgit\b(?:\s+-C\s+(?:"[^"]+"|''[^'']+''|\S+))?(?:\s+-[^\s;&|]+)*\s+push\b')
}
