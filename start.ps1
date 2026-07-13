# start.ps1 - AIGINVEST local development launcher
# Usage: .\start.ps1
# Compiles the API, then starts both API and web dev server.

param(
  [switch]$ApiOnly,
  [switch]$WebOnly
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$ApiDir = Join-Path $Root "apps\api"
$WebDir = Join-Path $Root "apps\web"
$IdentityDir = Join-Path $Root "packages\identity"
$UserManagementDir = Join-Path $Root "packages\user-management"
$OrganizationManagementDir = Join-Path $Root "packages\organization-management"

function Build-Package {
  param(
    [string]$PackageName,
    [string]$PackageDir
  )

  Write-Host "  Building $PackageName..." -ForegroundColor Yellow
  $tsc = Join-Path $PackageDir "node_modules\.bin\tsc.CMD"
  & $tsc --skipLibCheck -p "$PackageDir\tsconfig.json"
  if ($LASTEXITCODE -ne 0) {
    Write-Host "  Failed building $PackageName." -ForegroundColor Red
    exit 1
  }
  Write-Host "  Built $PackageName" -ForegroundColor Green
}

Write-Host ""
Write-Host "  AIGINVEST Development Server" -ForegroundColor Cyan
Write-Host ""

# Compile API
if (-not $WebOnly) {
  Write-Host "  [1/3] Building workspace packages..." -ForegroundColor Yellow
  Build-Package "@aig/identity" $IdentityDir
  Build-Package "@aig/user-management" $UserManagementDir
  Build-Package "@aig/organization-management" $OrganizationManagementDir

  Write-Host "  [2/3] Compiling API..." -ForegroundColor Yellow
  $tsc = Join-Path $ApiDir "node_modules\.bin\tsc.CMD"
  & $tsc --skipLibCheck -p "$ApiDir\tsconfig.json"
  if ($LASTEXITCODE -ne 0) {
    Write-Host "  API compilation failed. Fix TypeScript errors and try again." -ForegroundColor Red
    exit 1
  }
  Write-Host "  API compiled" -ForegroundColor Green
}

# Start API
if (-not $WebOnly) {
  Write-Host "  [3/3] Starting API on http://localhost:3333..." -ForegroundColor Yellow
  $apiJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    node "dist\main.js"
  } -ArgumentList $ApiDir

  Start-Sleep -Milliseconds 2500
  try {
    $health = Invoke-WebRequest -Uri "http://localhost:3333/api/health" -UseBasicParsing -ErrorAction Stop
    if ($health -and $health.StatusCode -eq 200) {
      Write-Host "  API running -> http://localhost:3333" -ForegroundColor Green
    } else {
      Write-Host "  API may still be starting. Check output." -ForegroundColor Yellow
    }
  } catch {
    Write-Host "  API may still be starting. Check output." -ForegroundColor Yellow
  }
}

if ($ApiOnly) {
  Write-Host ""
  Write-Host "  API running. Press Ctrl+C to stop." -ForegroundColor Cyan
  Wait-Job $apiJob | Receive-Job
  exit 0
}

# Start Web
Write-Host ""
Write-Host "  Starting web on http://localhost:3001..." -ForegroundColor Yellow
Write-Host "  (Press Ctrl+C to stop both servers)" -ForegroundColor Gray
Write-Host ""

Set-Location $WebDir
& npx next dev --port 3001
