# Check status of WAHA and n8n stack
$composeFile = Join-Path $PSScriptRoot "..\docker-compose\docker-compose.yml"

Write-Host "[STATUS] Container status:" -ForegroundColor Cyan
docker compose -f $composeFile ps

Write-Host "`n[HEALTH] Probing endpoints:" -ForegroundColor Cyan
try {
    $wahaVersion = Invoke-RestMethod -Uri "http://localhost:3000/api/server/version" -TimeoutSec 3 -ErrorAction Stop
    Write-Host " -> WAHA: ONLINE (Version: $($wahaVersion.version))" -ForegroundColor Green
} catch {
    Write-Host " -> WAHA: OFFLINE or initializing ($($_.Exception.Message))" -ForegroundColor DarkGray
}

try {
    $n8nHealth = Invoke-WebRequest -Uri "http://localhost:5678/healthz" -TimeoutSec 3 -ErrorAction Stop
    Write-Host " -> n8n:  ONLINE (Status Code: $($n8nHealth.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host " -> n8n:  OFFLINE or initializing ($($_.Exception.Message))" -ForegroundColor DarkGray
}
