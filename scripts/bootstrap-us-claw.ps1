$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$openclawHome = if ($env:OPENCLAW_HOME) { $env:OPENCLAW_HOME } else { Join-Path $HOME ".openclaw" }
$workspaceRoot = if ($env:OPENCLAW_WORKSPACE) { $env:OPENCLAW_WORKSPACE } else { Join-Path $openclawHome "workspace" }
$target = Join-Path $workspaceRoot "us-claw"
$generatedAt = (Get-Date).ToUniversalTime().ToString("o")
$bridgeUrl = if ($env:US_CLAW_BRIDGE_URL) { $env:US_CLAW_BRIDGE_URL } else { "http://127.0.0.1:8787" }
$controlPlaneUrl = if ($env:US_CLAW_CONTROL_PLANE_URL) { $env:US_CLAW_CONTROL_PLANE_URL } else { "http://127.0.0.1:8000" }
$manifestPath = Join-Path $target "us-claw-bootstrap.json"
$eventsPath = Join-Path $target "us-claw-runtime-events.jsonl"
$logsPath = Join-Path $target "us-claw-runtime-logs.jsonl"

function Test-SeedFileInitialized {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Path
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return $false
  }

  $content = Get-Content -LiteralPath $Path -Raw -ErrorAction SilentlyContinue
  return -not [string]::IsNullOrWhiteSpace($content)
}

function Write-SeedFileIfMissing {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Path,
    [Parameter(Mandatory = $true)]
    [hashtable] $Payload,
    [Parameter(Mandatory = $true)]
    [string] $SeedLabel
  )

  if (Test-SeedFileInitialized -Path $Path) {
    Write-Output "Existing $SeedLabel history preserved at $Path"
    return
  }

  ($Payload | ConvertTo-Json -Depth 5 -Compress) | Set-Content -LiteralPath $Path -Encoding UTF8
  Write-Output "Runtime $SeedLabel seed written to $Path"
}

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
  workspace_slug = "us-claw"
  bridge_url = $bridgeUrl
  control_plane_url = $controlPlaneUrl
  generated_at = $generatedAt
  runtime_files = @{
    events = "us-claw-runtime-events.jsonl"
    logs = "us-claw-runtime-logs.jsonl"
  }
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

$event = @{
  timestamp = $generatedAt
  level = "info"
  event_type = "workspace_registered"
  message = "US Claw workspace registered for OpenClaw"
  source = "bootstrap"
  details = @{
    target_workspace = $target
    repo_root = $repoRoot.Path
  }
}
$log = @{
  timestamp = $generatedAt
  level = "info"
  message = "Bootstrap manifest refreshed"
  source = "bootstrap"
  details = @{
    target_workspace = $target
    bridge_url = $bridgeUrl
    control_plane_url = $controlPlaneUrl
  }
}

Write-Output "Bootstrap manifest written to $manifestPath"
Write-SeedFileIfMissing -Path $eventsPath -Payload $event -SeedLabel "event"
Write-SeedFileIfMissing -Path $logsPath -Payload $log -SeedLabel "log"
