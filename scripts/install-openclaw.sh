#!/usr/bin/env sh
set -eu

OPENCLAW_HOME="${OPENCLAW_HOME:-$HOME/.openclaw}"
OPENCLAW_REPO="${OPENCLAW_REPO:-$HOME/dev/docker/openclaw}"
NODE_VERSION="$(node --version 2>/dev/null || true)"
DOCKER_VERSION="$(docker --version 2>/dev/null || true)"
OPENCLAW_COMMAND="$(command -v openclaw || true)"

echo "US Claw OpenClaw install check"
echo "node: ${NODE_VERSION:-missing}"
echo "docker: ${DOCKER_VERSION:-missing}"
echo "openclaw_home: $OPENCLAW_HOME"
echo "openclaw_repo: $OPENCLAW_REPO"

if [ -n "$OPENCLAW_COMMAND" ] || [ -d "$OPENCLAW_HOME" ]; then
  echo "OpenClaw looks installed or configured."
  exit 0
fi

if [ -d "$OPENCLAW_REPO" ]; then
  echo "OpenClaw source checkout exists, but no installed OpenClaw home was found. Run the official installer first, then rerun bootstrap-us-claw." >&2
  exit 2
fi

echo "OpenClaw is not installed. Use the official OpenClaw installer, then rerun this script." >&2
exit 1
