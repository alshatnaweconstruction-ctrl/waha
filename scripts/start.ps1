# Start WAHA and n8n stack
$composeFile = Join-Path $PSScriptRoot "..\docker-compose\docker-compose.yml"
$envFile = Join-Path $PSScriptRoot "..\docker-compose\.env"
$envExample = Join-Path $PSScriptRoot "..\docker-compose\.env.example"

if (-not (Test-Path $envFile)) {
    Write-Host "[INFO] .env not found. Creating default from .env.example..." -ForegroundColor Yellow
    Copy-Item $envExample $envFile
}

Write-Host "[STARTING] Launching WAHA and n8n containers..." -ForegroundColor Cyan
docker compose -f $composeFile up -d

Write-Host "`n[SUCCESS] Services launched!" -ForegroundColor Green
Write-Host " -> WAHA API / Swagger Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host " -> n8n Workflow UI:              http://localhost:5678" -ForegroundColor White
