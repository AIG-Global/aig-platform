# Rebuild and Run v0.2.0 API
# Usage: .\rebuild-and-run.ps1

Write-Host "🔨 Building Phase 2 modules..." -ForegroundColor Cyan

$dirs = @(
    "packages/identity",
    "packages/user-management", 
    "packages/organization-management",
    "apps/api"
)

$tscPath = ".\node_modules\.bin\tsc.ps1"

foreach ($dir in $dirs) {
    Write-Host "  → Compiling $dir..." -ForegroundColor Yellow
    $tsconfig = Join-Path $dir "tsconfig.json"
    
    if (Test-Path $tsconfig) {
        & npx tsc -p $tsconfig 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✅ $dir" -ForegroundColor Green
        } else {
            Write-Host "    ❌ $dir failed" -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host "`n🎯 Build complete! Starting API..." -ForegroundColor Cyan

# Kill any existing node processes
$existing = Get-Process node -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "  → Stopping existing processes..." -ForegroundColor Yellow
    $existing | Stop-Process -Force
    Start-Sleep -Seconds 2
}

Write-Host "  → Launching on port 3333..." -ForegroundColor Yellow
Set-Location "apps/api"
node dist/main.js

Write-Host "`n✅ API running! Test with:" -ForegroundColor Green
Write-Host "   curl http://localhost:3333/api/health"
Write-Host "   curl http://localhost:3333/api/api/info"
