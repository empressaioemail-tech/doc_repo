# Branch-protection hook for git commit / git push tool calls.
# Refuses commit/push when working tree is not on `main` (single-branch workflow per CLAUDE.md).
# Invoked from .claude/settings.json PreToolUse hook on Bash matcher.

$ti = $env:CLAUDE_TOOL_INPUT
if ($null -eq $ti) { exit 0 }

if ($ti -match 'git (commit|push)') {
    $branch = (git -C P:/doc_repo branch --show-current 2>$null)
    if ($branch) { $branch = $branch.Trim() }

    if ($branch -and $branch -ne 'main') {
        [Console]::Error.WriteLine('{"block": true, "message": "git commit/push refused: current branch is ' + $branch + ', not main. Switch to main explicitly or override."}')
        exit 2
    }

    if (-not $branch) {
        [Console]::Error.WriteLine('{"block": true, "message": "git commit/push refused: detached HEAD. Check out a branch first."}')
        exit 2
    }
}

exit 0
