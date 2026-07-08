# Start both API and Web servers

$ProjectRoot = "C:\Users\PC\AIG-Global\aig-platform"
Set-Location $ProjectRoot

Write-Host "Starting API and Web servers..." -ForegroundColor Cyan

# Start API in background
Write-Host "Starting API on port 3333..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ProjectRoot'; pnpm dev:api" -WindowStyle Normal

# Give API time to start
Start-Sleep -Seconds 3

# Start Web in background  
Write-Host "Starting Web on port 3003..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ProjectRoot'; pnpm dev:web" -WindowStyle Normal

Write-Host "Servers starting..." -ForegroundColor Green
Write-Host "API: http://localhost:3333" -ForegroundColor Green
Write-Host "Web: http://localhost:3003" -ForegroundColor Green
Write-Host "Check the new windows for logs" -ForegroundColor Green
