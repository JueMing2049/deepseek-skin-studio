# DeepSeek Skin Studio - Windows restore native look
param()
$ErrorActionPreference = "SilentlyContinue"
$root = Split-Path -Parent $PSScriptRoot
node "$root\src\cli.mjs" pause --port 9331
if ($LASTEXITCODE -ne 0) { node "$root\src\cli.mjs" pause --port 9222 }
