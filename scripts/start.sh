#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/../docker-compose/docker-compose.yml"
ENV_FILE="$SCRIPT_DIR/../docker-compose/.env"
ENV_EXAMPLE="$SCRIPT_DIR/../docker-compose/.env.example"

if [ ! -f "$ENV_FILE" ]; then
    echo "[INFO] .env not found. Creating default from .env.example..."
    cp "$ENV_EXAMPLE" "$ENV_FILE"
fi

echo "[STARTING] Launching WAHA and n8n stack..."
docker compose -f "$COMPOSE_FILE" up -d

echo ""
echo "[SUCCESS] Stack running:"
echo " -> WAHA API / Swagger: http://localhost:3000"
echo " -> n8n Workflow UI:    http://localhost:5678"
