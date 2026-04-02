#!/usr/bin/env sh
set -eu

REPO_ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
OPENCLAW_HOME="${OPENCLAW_HOME:-$HOME/.openclaw}"
WORKSPACE_ROOT="${OPENCLAW_WORKSPACE:-$OPENCLAW_HOME/workspace}"
TARGET="$WORKSPACE_ROOT/us-claw"

if [ ! -d "$OPENCLAW_HOME" ]; then
  echo "OpenClaw home not found at $OPENCLAW_HOME. Run install-openclaw first." >&2
  exit 1
fi

mkdir -p "$TARGET"
cat > "$TARGET/us-claw-bootstrap.json" <<EOF
{
  "repo_root": "$REPO_ROOT",
  "openclaw_home": "$OPENCLAW_HOME",
  "workspace_root": "$WORKSPACE_ROOT",
  "target_workspace": "$TARGET"
}
EOF

echo "Bootstrap manifest written to $TARGET/us-claw-bootstrap.json"
