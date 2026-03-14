#!/bin/zsh
# start.sh — start the MagicMirror wallboard containers.
# Calendar URLs are stored directly in mounts/config/config.js (gitignored).
# Usage: ./start.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting containers..."
docker compose -f "$SCRIPT_DIR/compose.yaml" down
docker compose -f "$SCRIPT_DIR/compose.yaml" up -d

echo "Done. MagicMirror available at http://localhost:8080"
