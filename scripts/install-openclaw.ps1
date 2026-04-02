$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$dockerCommand = Get-Command docker -ErrorAction SilentlyContinue
$nodeVersion = if ($nodeCommand) { (& node --version) 2>$null } else { "" }
$dockerVersion = if ($dockerCommand) { (& docker --version) 2>$null } else { "" }
$openclawHome = if ($env:OPENCLAW_HOME) { $env:OPENCLAW_HOME } else { Join-Path $HOME ".openclaw" }
$openclawRepo = if ($env:OPENCLAW_REPO) { $env:OPENCLAW_REPO } else { Join-Path $HOME "dev/docker/openclaw" }
$openclawCommand = Get-Command openclaw -ErrorAction SilentlyContinue

Write-Output "US Claw OpenClaw install check"
Write-Output "node: $nodeVersion"
Write-Output "docker: $dockerVersion"
Write-Output "openclaw_home: $openclawHome"
Write-Output "openclaw_repo: $openclawRepo"

if ($openclawCommand -or (Test-Path -LiteralPath $openclawHome)) {
  Write-Output "OpenClaw looks installed or configured."
  exit 0
}

if (Test-Path -LiteralPath $openclawRepo) {
  Write-Error "OpenClaw source checkout exists, but no installed OpenClaw home was found. Run the official installer first, then rerun bootstrap-us-claw."
  exit 2
}

Write-Error "OpenClaw is not installed. Use the official OpenClaw installer, then rerun this script."
exit 1
