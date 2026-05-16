# Branch-protection hook for git commit / git push tool calls.
# Refuses commit/push when working tree is not on `main` (single-branch workflow per CLAUDE.md).
# Invoked from .claude/settings.json PreToolUse hook on Bash matcher.
# Claude Code passes the tool payload as JSON on stdin (verified 2026-05-16 via diag log).
# Fails open on any parse error so a hook bug never breaks routine Bash use.

$stdin = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($stdin)) { exit 0 }

try {
    $payload = $stdin | ConvertFrom-Json
} catch {
    exit 0
}

$command = $payload.tool_input.command
if ([string]::IsNullOrWhiteSpace($command)) { exit 0 }

# Match `git ... commit` or `git ... push` within a single shell-command segment.
# The [^&|;]*? guards against crossing into a chained sub-command (e.g. `cd foo && git status`
# where the second segment is what we care about; here we only care if commit/push appears
# in the same segment as the git invocation).
if ($command -match '\bgit\b[^&|;]*?\b(commit|push)\b') {
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
