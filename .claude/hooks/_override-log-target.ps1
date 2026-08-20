# Resolve per-seat override log path from seat_register.json.
# Historical rows stay in _catalog/dispatch_overrides.log and
# _catalog/canon_overrides.log. New appends go here.
# Dot-source after $DocRepo is set.

function Get-NormalizedRepoPath {
    param([string]$Path)
    if ([string]::IsNullOrWhiteSpace($Path)) { return '' }
    return ($Path -replace '\\', '/').TrimEnd('/')
}

function Get-SeatNameFromCwd {
    param([string]$Cwd)
    $c = (Get-NormalizedRepoPath $Cwd).ToLowerInvariant()
    if (-not $c) { return 'unknown' }
    $regPath = Join-Path $DocRepo '_catalog/seat_register.json'
    if (-not (Test-Path -LiteralPath $regPath)) { return 'unknown' }
    try {
        $reg = Get-Content -LiteralPath $regPath -Raw -Encoding utf8 | ConvertFrom-Json
    } catch {
        return 'unknown'
    }
    $bestName = $null
    $bestLen = -1
    $candidates = @()
    if ($reg.integration -and $reg.integration.worktree) {
        $candidates += @{ Name = 'integration'; Path = $reg.integration.worktree }
    }
    foreach ($s in @($reg.seats)) {
        $candidates += @{ Name = $s.name; Path = $s.worktree }
        foreach ($r in @($s.repos)) {
            $candidates += @{ Name = $s.name; Path = $r.worktree }
        }
    }
    foreach ($x in @($reg.otherWorktrees)) {
        $candidates += @{ Name = 'extra'; Path = $x.path }
    }
    foreach ($item in $candidates) {
        $w = (Get-NormalizedRepoPath $item.Path).ToLowerInvariant()
        if (-not $w) { continue }
        if ($c -eq $w -or $c.StartsWith($w + '/')) {
            if ($w.Length -gt $bestLen) {
                $bestName = $item.Name
                $bestLen = $w.Length
            }
        }
    }
    if ($null -eq $bestName) { return 'unknown' }
    return $bestName
}

function Get-OverrideLogPath {
    param([string]$Cwd)
    $dir = Join-Path $DocRepo '_catalog/override_logs'
    if (-not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
    $seat = Get-SeatNameFromCwd -Cwd $Cwd
    $safe = ($seat -replace '[^A-Za-z0-9_-]', '_')
    if ([string]::IsNullOrWhiteSpace($safe)) { $safe = 'unknown' }
    return Join-Path $dir "$safe.log"
}
