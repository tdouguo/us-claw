#!/usr/bin/env sh
set -eu

REPO_ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
OPENCLAW_HOME="${OPENCLAW_HOME:-$HOME/.openclaw}"
WORKSPACE_ROOT="${OPENCLAW_WORKSPACE:-$OPENCLAW_HOME/workspace}"
TARGET="$WORKSPACE_ROOT/us-claw"
GENERATED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
BRIDGE_URL="${US_CLAW_BRIDGE_URL:-http://127.0.0.1:8787}"
CONTROL_PLANE_URL="${US_CLAW_CONTROL_PLANE_URL:-http://127.0.0.1:8000}"
MANIFEST_PATH="$TARGET/us-claw-bootstrap.json"
EVENTS_PATH="$TARGET/us-claw-runtime-events.jsonl"
LOGS_PATH="$TARGET/us-claw-runtime-logs.jsonl"

write_seed_if_missing() {
  file_path="$1"
  payload="$2"
  seed_label="$3"

  if [ -s "$file_path" ]; then
    echo "Existing $seed_label history preserved at $file_path"
    return
  fi

  printf '%s\n' "$payload" > "$file_path"
  echo "Runtime $seed_label seed written to $file_path"
}

if [ ! -d "$OPENCLAW_HOME" ]; then
  echo "OpenClaw home not found at $OPENCLAW_HOME. Run install-openclaw first." >&2
  exit 1
fi

mkdir -p "$TARGET"
cat > "$MANIFEST_PATH" <<EOF
{
  "repo_root": "$REPO_ROOT",
  "openclaw_home": "$OPENCLAW_HOME",
  "workspace_root": "$WORKSPACE_ROOT",
  "target_workspace": "$TARGET",
  "workspace_slug": "us-claw",
  "bridge_url": "$BRIDGE_URL",
  "control_plane_url": "$CONTROL_PLANE_URL",
  "generated_at": "$GENERATED_AT",
  "runtime_files": {
    "events": "us-claw-runtime-events.jsonl",
    "logs": "us-claw-runtime-logs.jsonl"
  }
}
EOF

echo "Bootstrap manifest written to $MANIFEST_PATH"
write_seed_if_missing \
  "$EVENTS_PATH" \
  "{\"timestamp\":\"$GENERATED_AT\",\"level\":\"info\",\"event_type\":\"workspace_registered\",\"message\":\"US Claw workspace registered for OpenClaw\",\"source\":\"bootstrap\",\"details\":{\"target_workspace\":\"$TARGET\",\"repo_root\":\"$REPO_ROOT\"}}" \
  "event"
write_seed_if_missing \
  "$LOGS_PATH" \
  "{\"timestamp\":\"$GENERATED_AT\",\"level\":\"info\",\"message\":\"Bootstrap manifest refreshed\",\"source\":\"bootstrap\",\"details\":{\"target_workspace\":\"$TARGET\",\"bridge_url\":\"$BRIDGE_URL\",\"control_plane_url\":\"$CONTROL_PLANE_URL\"}}" \
  "log"
