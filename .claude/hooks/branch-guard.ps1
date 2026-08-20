# Branch-protection hook for git commit / git push tool calls.
# Refuses commit/push when doc_repo working tree is not on `main`.
# Invoked from .claude/settings.json PreToolUse hook on Bash matcher.
# Claude Code passes the tool payload as JSON on stdin (verified 2026-05-16 via diag log).
#
# SCOPE (2026-08-20). Applies ONLY when the command mutates the integration
# checkout P:/doc_repo (branch main). Seat worktrees under
# P:/seat-worktrees/*/doc_repo are a different worktree of the same object
# store; SEAT-01 (seat-worktree-gate) owns those. Target repo is git -C,
# then cd, then tool working_directory / payload cwd, then hook-process
# Get-Location.
#
# The matcher below remains presence-shaped: it cannot distinguish a command
# that commits from a command that mentions committing. That is
# HOOK-branch-guard-literal-word, not this scope fix.
#
# Fails open on parse errors so a hook bug never breaks routine Bash use.

$DocRepo = 'P:/doc_repo'
$Lib = Join-Path $PSScriptRoot '_git-repo-target.ps1'

function Exit-Open { exit 0 }

if (-not (Test-Path -LiteralPath $Lib)) { Exit-Open }
. $Lib

$stdin = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($stdin)) { Exit-Open }

try {
    $payload = $stdin | ConvertFrom-Json
} catch {
    Exit-Open
}

$extracted = Get-ToolCommandAndCwd -Payload $payload
$command = $extracted.Command
if ([string]::IsNullOrWhiteSpace($command)) { Exit-Open }

# Presence-shaped: word commit or push after git in this shell segment.
# Own hygiene row. Do not "fix" here without replacing the predicate.
if ($command -notmatch '\bgit\b[^&|;]*?\b(commit|push)\b') { Exit-Open }

$targetRepo = Resolve-GitRepoFromCommand -Command $command -ToolCwd $extracted.ToolCwd
if (-not (Test-IsDocRepo -RepoPath $targetRepo)) { Exit-Open }

# Seat worktrees end in doc_repo too. Only the integration checkout must be on main.
$targetNorm = Normalize-RepoPath $targetRepo
$integrationNorm = Normalize-RepoPath $DocRepo
if ($targetNorm -ne $integrationNorm) { Exit-Open }

$branch = (git -C $DocRepo branch --show-current 2>$null)
if ($branch) { $branch = $branch.Trim() }

if ($branch -and $branch -ne 'main') {
    [Console]::Error.WriteLine('{"block": true, "message": "git commit/push refused: doc_repo current branch is ' + $branch + ', not main. Switch doc_repo to main explicitly or override."}')
    exit 2
}

if (-not $branch) {
    [Console]::Error.WriteLine('{"block": true, "message": "git commit/push refused: doc_repo detached HEAD. Check out a branch first."}')
    exit 2
}

exit 0
