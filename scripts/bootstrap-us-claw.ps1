$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$openclawHome = if ($env:OPENCLAW_HOME) { $env:OPENCLAW_HOME } else { Join-Path $HOME ".openclaw" }
$workspaceRoot = if ($env:OPENCLAW_WORKSPACE) { $env:OPENCLAW_WORKSPACE } else { Join-Path $openclawHome "workspace" }
$target = Join-Path $workspaceRoot "us-claw"

if (-not (Test-Path -LiteralPath $openclawHome)) {
  Write-Error "OpenClaw home not found at $openclawHome. Run install-openclaw first."
  exit 1
}

if (-not (Test-Path -LiteralPath $workspaceRoot)) {
  New-Item -ItemType Directory -Path $workspaceRoot -Force | Out-Null
}

if (-not (Test-Path -LiteralPath $target)) {
  New-Item -ItemType Directory -Path $target -Force | Out-Null
}

$manifest = @{
  repo_root = $repoRoot.Path
  openclaw_home = $openclawHome
  workspace_root = $workspaceRoot
  target_workspace = $target
  generated_at = (Get-Date).ToString("o")
}

$manifestPath = Join-Path $target "us-claw-bootstrap.json"
$manifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $manifestPath -Encoding UTF8
Write-Output "Bootstrap manifest written to $manifestPath"
