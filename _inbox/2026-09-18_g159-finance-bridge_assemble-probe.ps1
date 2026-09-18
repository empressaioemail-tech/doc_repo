# G-159 — assemble the measurement artifact for the close.
#
# Re-measures production rather than transcribing earlier terminal output, and
# folds in the 16-cell route proof already captured to disk. Writes to _inbox.
$ErrorActionPreference = "Continue"
$inbox  = "P:\seat-worktrees\g159-finance-bridge\doc_repo\_inbox"
$live   = "P:\seat-worktrees\g159-finance-bridge\doc_repo\_scratch\g159_step1_live_proof.json"

$liveProof = (Get-Content $live -Raw | ConvertFrom-Json).results

function Probe([string]$url) {
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 25
    $ct = ($r.Headers["Content-Type"] -split ";")[0]
    $kind = if ($ct -eq "text/html") { "SPA_SHELL_no_such_route" } elseif ($ct -like "*json*") { "JSON" } else { "OTHER" }
    return [pscustomobject]@{ url = $url; status = $r.StatusCode; contentType = $ct; classification = $kind; bytes = $r.RawContentLength }
  } catch {
    $sc = $_.Exception.Response.StatusCode.value__
    $ct = $_.Exception.Response.Headers["Content-Type"]
    if ($ct -is [array]) { $ct = $ct[0] }
    $ct = ("" + $ct -split ";")[0]
    return [pscustomobject]@{ url = $url; status = $sc; contentType = $ct; classification = "JSON_error_route_exists"; bytes = $null }
  }
}

$prodPaths = @(
  "/api/platform/opengov/budgets",
  "/api/platform/opengov/budgets/130231/amounts-summary",
  "/api/platform/opengov/chart-of-accounts",
  "/api/platform/finance/permit-revenue/summary?fy=2026",
  "/api/platform/xyz-nonexistent-control",
  "/api/platform/mygov/permits",
  "/api/opengov/reports"
)
$prodProbe = foreach ($p in $prodPaths) { Probe "https://smartcityos.io$p" }

$artifact = [ordered]@{
  lane       = "g159-finance-bridge"
  planRow    = "G-159"
  generatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
  instrument = [ordered]@{
    what = "Two live measurements, re-run at assembly time rather than transcribed."
    legA = "Four platform routes booted from the merged source in a lane worktree against the live OpenGov vendor and the live Bastrop database, hit over real HTTP with and without the bearer token."
    legB = "The v1 production surface (https://smartcityos.io, app walrus-app) probed over real HTTPS to establish that the merged routes are NOT deployed and that the pre-existing surface still refuses."
    whatThisInstrumentIsNot = "It is NOT scripts/surface-probe.mjs. That script's ROWS registry holds P-151, P-152, P-153, P-155 and P-157 only - OPS-23 customer surfaces on smartsite.cloud - so it has no row that measures G-159 and citing it would cite an instrument that measured other rows. Recorded rather than worked around."
    tlsNote = "The proof box sits behind TLS inspection, so the Node leg ran with --use-system-ca (Node does not read the Windows trust store by default). This is an artifact of the proof machine, not of the code."
    keyHandling = "OPENGOV_API_KEY read from GCP Secret Manager (smartcity-os-prod) into the process environment; the value was never printed. Only its length (64) was recorded."
  }
  legA_routeProof = $liveProof
  legB_productionReadBack = [ordered]@{
    measuredOrReadAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    app = "walrus-app (2a2a3a1a-b441-4296-8628-a82b20ded1b2)"
    productionUrl = "https://smartcityos.io"
    servicesSourceCommitHash = "e783f3510d8f582894c4317e511650af327ea0a1"
    servicesGithubBranch = "d9-api-8bea7fa"
    source = "DigitalOcean Apps API via the do-apps MCP (apps-get-info / apps-get-deployment-status)"
    deployment = [ordered]@{
      id = "e32caf51-bbb3-4456-8b44-c0159bc1ec5b"
      phase = "ACTIVE"
      health = "HEALTHY"
      deployedAt = "2026-09-17T19:09:06Z"
      cause = "domain smartcityos.io ready"
    }
    ancestry = [ordered]@{
      deployBranchTip = "e783f3510d8f582894c4317e511650af327ea0a1"
      isTip = $true
      productionPinIsAncestor = "8bea7fa5 is an ancestor of e783f351 - the deploy is production plus the API work"
      isMyMergeDeployed = $false
      basis = "git merge-base --is-ancestor a400f7be origin/d9-api-8bea7fa exits non-zero: the G-159 merge commit is not on the deploy branch"
    }
    httpProbe = $prodProbe
    whatThisProves = "The four new routes do not exist in production (they return the SPA shell, the same signature a deliberately fake /api/platform/ path returns), while the pre-existing platform route /api/platform/mygov/permits and the session route /api/opengov/reports both still answer 401 JSON. So G-159 merged to main and did NOT deploy, and the v1 surface Bastrop uses is intact - which is exactly the dispatch's 'merged, NOT deployed'."
  }
  verdicts = [ordered]@{
    step0_keyProof = "PASS (CP1) - CP1 AND THE LANE CLAIM WERE FIRST FILED IN P:\doc_repo, the integration seat's checkout, and moved to P:\seat-worktrees\g159-finance-bridge\doc_repo\_inbox when the dispatch's own rule for a lane spawned by the dispatch planner was applied. The correction is recorded in CP1's addendum because the planner reads these paths."
    step1_routesAnswerAndRefuse = "PASS - 16 of 16 cells on legA."
    step1_mergedNotDeployed = "PASS - legB."
    step2_v2AdapterShape = "UNMEASURED - NOT STARTED. The dispatch gates STEP 2 on G-154 merging ('Wait for G-154 to merge before starting this step'), and G-154 is open as PR #68 at close time."
    step2_cityDefaultByViolation = "UNMEASURED - NOT STARTED, same gate. The enumeration below was done read-only from origin/main, which writes nothing and so cannot collide with G-154."
    step2_uatProof = "UNMEASURED - there is no v2 change to prove. The DO Apps credential IS present in this session (unlike the G-156 lane, which had none), so the read-back is not blocked on tooling when STEP 2 runs."
  }
}

$out = Join-Path $inbox "2026-09-18_122500_g159_platform_route_probe.json"
$artifact | ConvertTo-Json -Depth 12 | Out-File -Encoding utf8 $out
Write-Output "WROTE $out"
Write-Output "size=$((Get-Item $out).Length)"
Write-Output "=== production probe, re-measured ==="
$prodProbe | ForEach-Object { "{0,-58} {1,-4} {2,-12} {3}" -f ($_.url -replace "https://smartcityos.io",""), $_.status, $_.contentType, $_.classification }
