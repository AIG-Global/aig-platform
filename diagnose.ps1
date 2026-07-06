# Diagnostic and repair script for AIG Platform
# This script will:
# 1. Check if pnpm is available
# 2. Verify workspace recognition
# 3. Install dependencies
# 4. Start the API

Write-Host "====== AIG Platform Startup Diagnostic ======"
Write-Host ""

# Test 1: Check current directory
Write-Host "[1/5] Current directory:"
$cwd = Get-Location
Write-Host "  $cwd"
Write-Host ""

# Test 2: Check if key files exist
Write-Host "[2/5] Verifying key files:"
$files = @(
    "pnpm-workspace.yaml",
    "package.json",
    "apps/api/package.json",
    "apps/api/src/main.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $cwd $file
    if (Test-Path $fullPath) {
        Write-Host "  ✓ $file found"
    } else {
        Write-Host "  ✗ $file NOT FOUND"
    }
}
Write-Host ""

# Test 3: Check if pnpm is available
Write-Host "[3/5] Checking package managers:"
try {
    $pnpmVersion = & pnpm --version 2>&1
    Write-Host "  ✓ pnpm available: $pnpmVersion"
} catch {
    Write-Host "  ✗ pnpm NOT available"
    Write-Host "  Attempting to install globally..."
    & npm install -g pnpm
}
Write-Host ""

# Test 4: List workspace packages
Write-Host "[4/5] Workspace packages recognized by pnpm:"
try {
    $packages = & pnpm -r list --depth=0 2>&1
    if ($packages) {
        Write-Host "$packages"
    } else {
        Write-Host "  (No output from pnpm list)"
    }
} catch {
    Write-Host "  Error: $_"
}
Write-Host ""

# Test 5: Try to install API dependencies
Write-Host "[5/5] Installing API dependencies:"
try {
    Push-Location "apps/api"
    Write-Host "  Location: $(Get-Location)"
    
    $output = & npm install 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Dependencies installed successfully"
    } else {
        Write-Host "  ✗ npm install failed with exit code: $LASTEXITCODE"
        Write-Host "  Output: $output"
    }
    
    Pop-Location
} catch {
    Write-Host "  Error: $_"
}

Write-Host ""
Write-Host "====== Diagnostic Complete ======"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Review the diagnostics above"
Write-Host "2. Fix any issues"
Write-Host "3. Run: cd apps/api && npm run dev"
