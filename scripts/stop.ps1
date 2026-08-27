# Stop WAHA and n8n stack
$composeFile = Join-Path $PSScriptRoot "..\docker-compose\docker-compose.yml"

Write-Host "[STOPPING] Shutting down WAHA and n8n containers..." -ForegroundColor Yellow
docker compose -f $composeFile down

Write-Host "[STOPPED] Stack stopped successfully." -ForegroundColor Green
