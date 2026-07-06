# Build all Phase 2 packages and the main API
# Run from workspace root: .\build-all.ps1

Write-Host "🔨 Building Phase 2 packages..." -ForegroundColor Cyan

Write-Host "📦 Building @aig/identity..." -ForegroundColor Yellow
cd packages/identity
npm run build
cd ../..

Write-Host "📦 Building @aig/user-management..." -ForegroundColor Yellow
cd packages/user-management
npm run build
cd ../..

Write-Host "📦 Building @aig/organization-management..." -ForegroundColor Yellow
cd packages/organization-management
npm run build
cd ../..

Write-Host "🚀 Building API..." -ForegroundColor Yellow
cd apps/api
npm run build
cd ../..

Write-Host "✅ All packages built successfully!" -ForegroundColor Green
Write-Host "Run 'npm start' in apps/api to start the API" -ForegroundColor Green
