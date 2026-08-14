# DeepSeek Skin Studio - Windows one-click apply
# Usage: .\scripts\apply.ps1 -Theme whale-girl
param([string]$Theme = "galaxy-deep")
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$port = 9331
try {
  Invoke-WebRequest "http://127.0.0.1:$port/json/list" -UseBasicParsing -TimeoutSec 2 | Out-Null
} catch {
  $edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
  if (-not (Test-Path $edge)) { $edge = "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe" }
  if (-not (Test-Path $edge)) {
    $chrome = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe"
    if (-not (Test-Path $chrome)) { $chrome = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe" }
    if (-not (Test-Path $chrome)) { Write-Host "Edge/Chrome not found. Start a browser with --remote-debugging-port=$port and retry."; exit 1 }
    $browser = $chrome
  } else { $browser = $edge }
  Write-Host "Launching debug browser (isolated profile)..."
  $ud = Join-Path $env:TEMP "dsskin-edge"
  Start-Process $browser -ArgumentList "--remote-debugging-port=$port","--user-data-dir=$ud","--no-first-run","http://127.0.0.1:3080"
  Start-Sleep -Seconds 5
}
node "$root\src\cli.mjs" apply --theme $Theme --port $port
Write-Host "Note: the skin is injected per page-load; re-run this script after a page refresh."
