# Z-WBE Bottleneck Lab - Google Colab Synchronization Script
# Automates the Antigravity <-> GitHub <-> Colab development cycle

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Z-WBE BOTTLENECK LAB - COLAB SYNCHRONIZATION UTILITY   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Pull latest commits from GitHub
Write-Host "`n[1/5] Fetching and rebasing with origin/main..." -ForegroundColor Yellow
git pull --rebase origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Error] Failed to rebase with origin/main. Please resolve conflicts." -ForegroundColor Red
    exit 1
}

# 2. Verify canonical notebook exists
$notebookPath = "notebooks/Z_WBE_GPU_LAB.ipynb"
Write-Host "`n[2/5] Verifying canonical notebook existence..." -ForegroundColor Yellow
if (Test-Path $notebookPath) {
    Write-Host "  -> Verified: $notebookPath is present." -ForegroundColor Green
} else {
    Write-Host "  -> [Warning] $notebookPath not found!" -ForegroundColor Red
}

# 3. Validate notebook JSON formatting
Write-Host "`n[3/5] Validating notebook JSON schema..." -ForegroundColor Yellow
try {
    $raw = Get-Content $notebookPath -Raw
    $content = $raw | ConvertFrom-Json
    $cellCount = $content.cells.Count
    Write-Host "  -> JSON schema valid ($cellCount cells detected)." -ForegroundColor Green
} catch {
    Write-Host "  -> [Error] Notebook JSON is corrupted: $_" -ForegroundColor Red
}

# 4. Check git status
Write-Host "`n[4/5] Inspecting local git status..." -ForegroundColor Yellow
git status --short

# 5. Output canonical Colab URL
Write-Host "`n[5/5] Permanent Canonical Google Colab Launch URL:" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb" -ForegroundColor Green
Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "`nSync complete! Ready to run on NVIDIA Tesla T4 GPU.`n" -ForegroundColor Cyan
