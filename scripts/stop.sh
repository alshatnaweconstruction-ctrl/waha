#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/../docker-compose/docker-compose.yml"

echo "[STOPPING] Shutting down WAHA and n8n containers..."
docker compose -f "$COMPOSE_FILE" down

echo "[STOPPED] Stack stopped successfully."
