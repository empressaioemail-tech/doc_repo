$ErrorActionPreference = "Continue"
$proj = "smartcity-os-prod"

function Get-Sec([string]$name) {
  $v = (gcloud secrets versions access latest --secret=$name --project=$proj 2>$null | Out-String)
  if ($null -eq $v) { return "" }
  return $v.Trim()
}

$ogKey  = Get-Sec "smartcity-OPENGOV_API_KEY"
$bnpKey = Get-Sec "smartcity-OPENGOV_BNP_API_KEY"
$ogMail = Get-Sec "smartcity-OPENGOV_EMAIL"

Write-Output "== KEY PRESENCE (lengths only, values never printed) =="
Write-Output ("smartcity-OPENGOV_API_KEY     length=" + $ogKey.Length)
Write-Output ("smartcity-OPENGOV_BNP_API_KEY length=" + $bnpKey.Length)
Write-Output ("smartcity-OPENGOV_EMAIL       length=" + $ogMail.Length)

function Redact([string]$s) {
  if ($null -eq $s) { return $null }
  $t = $s
  $t = [regex]::Replace($t, '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', '<email-redacted>')
  $t = [regex]::Replace($t, '\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', '<phone-redacted>')
  return $t
}

function TypeOf($v) {
  if ($null -eq $v) { return "null" }
  if ($v -is [bool]) { return "bool" }
  if ($v -is [int] -or $v -is [long]) { return "int" }
  if ($v -is [double] -or $v -is [decimal]) { return "number" }
  if ($v -is [string]) { return "string" }
  if ($v -is [System.Array]) { return "array[" + $v.Count + "]" }
  if ($v -is [System.Management.Automation.PSCustomObject]) { return "object" }
  return $v.GetType().Name
}

function ShapeOf($obj, [string]$label) {
  Write-Output ("-- shape of " + $label)
  if ($null -eq $obj) { Write-Output "   (null)"; return }
  $keys = @()
  if ($obj -is [System.Management.Automation.PSCustomObject]) { $keys = $obj.PSObject.Properties.Name }
  elseif ($obj -is [System.Collections.IDictionary]) { $keys = $obj.Keys }
  foreach ($k in $keys) {
    $v = $obj.$k
    $t = TypeOf $v
    $preview = ""
    if ($t -eq "string") { $preview = " = " + (Redact ([string]$v)).Substring(0, [Math]::Min(60, (Redact ([string]$v)).Length)) }
    elseif ($t -eq "int" -or $t -eq "number" -or $t -eq "bool") { $preview = " = " + [string]$v }
    elseif ($t -like "array*") { $preview = " (len " + $v.Count + ")" }
    Write-Output ("   " + $k + " : " + $t + $preview)
  }
}

function Do-Read([string]$label, [string]$url, [hashtable]$headers) {
  Write-Output ""
  Write-Output ("== " + $label)
  Write-Output ("   GET " + $url)
  try {
    $resp = Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing -TimeoutSec 45
    Write-Output ("   STATUS " + [int]$resp.StatusCode)
    $len = $resp.Content.Length
    Write-Output ("   BODY BYTES " + $len)
    $json = $null
    try { $json = $resp.Content | ConvertFrom-Json } catch { Write-Output "   (body is not JSON)" }
    if ($null -ne $json) {
      $topKeys = $json.PSObject.Properties.Name
      Write-Output ("   TOP-LEVEL KEYS: " + ($topKeys -join ", "))
      foreach ($k in $topKeys) {
        $v = $json.$k
        $t = TypeOf $v
        Write-Output ("     " + $k + " : " + $t)
        if ($t -like "array*" -and $v.Count -gt 0) {
          ShapeOf $v[0] ("first element of " + $k)
        } elseif ($t -eq "object") {
          ShapeOf $v ("object " + $k)
        }
      }
    }
  } catch {
    $status = $null
    if ($_.Exception.Response -ne $null) { try { $status = [int]$_.Exception.Response.StatusCode } catch {} }
    Write-Output ("   STATUS " + $(if ($null -eq $status) { "NO-RESPONSE" } else { $status }))
    Write-Output ("   ERROR " + $_.Exception.Message)
    if ($_.ErrorDetails.Message) { Write-Output ("   BODY " + $_.ErrorDetails.Message.Substring(0, [Math]::Min(400, $_.ErrorDetails.Message.Length))) }
  }
}

# --- Leg A: OpenGov v1 (the service the v1 route opengov.ts calls) ---
Do-Read "A1 OpenGov v1 /entities (x-api-key)" "https://bastrop.opengov.com/api/v1/entities" @{ "x-api-key" = $ogKey; "Accept" = "application/json" }
Do-Read "A2 OpenGov v1 /reports (x-api-key)"  "https://bastrop.opengov.com/api/v1/reports"  @{ "x-api-key" = $ogKey; "Accept" = "application/json" }

# --- Leg B: OpenGov Budgeting & Performance (the service opengov-bnp.ts calls) ---
$bnpUrl = "https://api.bnp.opengov.com/api/v1/budgets?filter%5BentityId%5D=3c8981ac-1a8b-463d-b26b-5ef37c66734f"
Do-Read "B1 BNP /budgets with OPENGOV_BNP_API_KEY (Authorization: Token)" $bnpUrl @{ "Authorization" = ("Token " + $bnpKey); "Accept" = "application/vnd.api+json" }
Do-Read "B2 BNP /budgets with OPENGOV_API_KEY (what the deployed code would actually send)" $bnpUrl @{ "Authorization" = ("Token " + $ogKey); "Accept" = "application/vnd.api+json" }
Do-Read "B3 BNP /budgets with OPENGOV_BNP_API_KEY (Authorization: Bearer, control)" $bnpUrl @{ "Authorization" = ("Bearer " + $bnpKey); "Accept" = "application/vnd.api+json" }
