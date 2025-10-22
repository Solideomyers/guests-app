# PowerShell Deployment Script for Event Guest Manager
# Deploys Frontend to Vercel and Backend to Railway

param(
    [switch]$SkipTests = $false,
    [switch]$BackendOnly = $false,
    [switch]$FrontendOnly = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Event Guest Manager - Production Deployment" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-Command($command) {
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan

if (-not (Test-Command "railway")) {
    Write-Host "❌ Railway CLI not found. Install with: npm install -g @railway/cli" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "vercel")) {
    Write-Host "❌ Vercel CLI not found. Install with: npm install -g vercel" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All prerequisites met" -ForegroundColor Green
Write-Host ""

# Run tests if not skipped
if (-not $SkipTests) {
    Write-Host "🧪 Running tests..." -ForegroundColor Cyan
    
    # Backend tests
    if (-not $FrontendOnly) {
        Write-Host "  → Backend tests..." -ForegroundColor Gray
        Set-Location backend
        npm run test 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Backend tests failed!" -ForegroundColor Red
            Set-Location ..
            exit 1
        }
        Set-Location ..
        Write-Host "  ✅ Backend tests passed" -ForegroundColor Green
    }
    
    # Frontend tests
    if (-not $BackendOnly) {
        Write-Host "  → Frontend tests..." -ForegroundColor Gray
        Set-Location frontend
        npm run test 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Frontend tests failed!" -ForegroundColor Red
            Set-Location ..
            exit 1
        }
        Set-Location ..
        Write-Host "  ✅ Frontend tests passed" -ForegroundColor Green
    }
    
    Write-Host ""
}

# Deploy Backend to Railway
if (-not $FrontendOnly) {
    Write-Host "📦 Deploying Backend to Railway..." -ForegroundColor Cyan
    Write-Host "  → Building backend..." -ForegroundColor Gray
    
    Set-Location backend
    
    # Build
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend build failed!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    
    Write-Host "  → Deploying to Railway..." -ForegroundColor Gray
    railway up
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Railway deployment failed!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    
    Set-Location ..
    Write-Host "✅ Backend deployed successfully" -ForegroundColor Green
    Write-Host ""
}

# Deploy Frontend to Vercel
if (-not $BackendOnly) {
    Write-Host "🎨 Deploying Frontend to Vercel..." -ForegroundColor Cyan
    Write-Host "  → Building frontend..." -ForegroundColor Gray
    
    Set-Location frontend
    
    # Build
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend build failed!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    
    Set-Location ..
    
    Write-Host "  → Deploying to Vercel..." -ForegroundColor Gray
    vercel --prod
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel deployment failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Frontend deployed successfully" -ForegroundColor Green
    Write-Host ""
}

# Summary
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""

if (-not $FrontendOnly) {
    Write-Host "Backend (Railway):" -ForegroundColor Cyan
    railway status 2>&1 | Select-String "URL" | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
    Write-Host ""
}

if (-not $BackendOnly) {
    Write-Host "Frontend (Vercel):" -ForegroundColor Cyan
    Write-Host "  Check your Vercel dashboard for the production URL" -ForegroundColor White
    Write-Host "  https://vercel.com/dashboard" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "📚 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Test your production app" -ForegroundColor White
Write-Host "  2. Verify CORS settings" -ForegroundColor White
Write-Host "  3. Check logs for any errors" -ForegroundColor White
Write-Host "  4. Update DNS if using custom domain" -ForegroundColor White
Write-Host ""

Write-Host "Happy deploying! 🚀" -ForegroundColor Green
