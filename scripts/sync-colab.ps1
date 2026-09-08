[CmdletBinding()]
param(
    [Parameter(Position=0)]
    [string]$CommitMessage = "",
    [switch]$Push,
    [switch]$SkipPull
)

# ==============================================================================
# Z-WBE Bottleneck Lab - Google Colab Synchronization Script
# Automates the 8-step Antigravity <-> GitHub <-> Colab development cycle
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Z-WBE BOTTLENECK LAB - COLAB SYNCHRONIZATION UTILITY   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$notebookPath = "notebooks/Z_WBE_GPU_LAB.ipynb"

# 1. git pull --rebase
Write-Host "`n[Step 1/8] Running git pull --rebase origin main..." -ForegroundColor Yellow
if (-not $SkipPull) {
    git pull --rebase origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  -> [Error] Failed to rebase with origin/main. Please resolve conflicts." -ForegroundColor Red
        exit 1
    }
    Write-Host "  -> Successfully rebased with origin/main." -ForegroundColor Green
} else {
    Write-Host "  -> Step skipped (-SkipPull requested)." -ForegroundColor DarkGray
}

# 2. verify Z_WBE_GPU_LAB.ipynb exists
Write-Host "`n[Step 2/8] Verifying canonical notebook existence..." -ForegroundColor Yellow
if (Test-Path $notebookPath) {
    Write-Host "  -> Verified: $notebookPath exists." -ForegroundColor Green
} else {
    Write-Host "  -> [Error] $notebookPath not found!" -ForegroundColor Red
    exit 1
}

# 3. show whether Colab changed it
Write-Host "`n[Step 3/8] Checking if Colab or remote commits modified the notebook..." -ForegroundColor Yellow
$lastCommit = git log -1 --format="%h | %an <%ae> | %ad | %s" --date=short -- $notebookPath
Write-Host "  -> Last commit affecting notebook: $lastCommit" -ForegroundColor Cyan

$dirty = git status --porcelain -- $notebookPath
if ($dirty) {
    Write-Host "  -> [Modified] Working copy changes detected: $dirty" -ForegroundColor Magenta
} else {
    Write-Host "  -> Working copy of $notebookPath is clean." -ForegroundColor Green
}

# 4. run notebook validation
Write-Host "`n[Step 4/8] Running notebook JSON schema validation..." -ForegroundColor Yellow
try {
    $raw = Get-Content $notebookPath -Raw -Encoding UTF8
    $content = $raw | ConvertFrom-Json
    $cellCount = $content.cells.Count
    if ($cellCount -gt 0) {
        Write-Host "  -> Schema valid: $cellCount cells detected." -ForegroundColor Green
    } else {
        Write-Host "  -> [Warning] Notebook JSON contains 0 cells." -ForegroundColor Yellow
    }
} catch {
    Write-Host "  -> [Error] Notebook JSON is corrupted: $_" -ForegroundColor Red
    exit 1
}

# 5. show git status
Write-Host "`n[Step 5/8] Inspecting local git status..." -ForegroundColor Yellow
git status --short

# 6. commit if requested
Write-Host "`n[Step 6/8] Checking commit request..." -ForegroundColor Yellow
if ($CommitMessage -and $CommitMessage.Trim() -ne "") {
    Write-Host "  -> Staging and committing '$notebookPath' with message: '$CommitMessage'..." -ForegroundColor Cyan
    git add $notebookPath
    git commit -m $CommitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  -> [Notice] git commit returned non-zero (possibly no staged changes)." -ForegroundColor Yellow
    } else {
        Write-Host "  -> Commit successful." -ForegroundColor Green
    }
} else {
    Write-Host "  -> No commit requested. (Pass -CommitMessage 'msg' to auto-commit)." -ForegroundColor DarkGray
}

# 7. push to main
Write-Host "`n[Step 7/8] Checking push to origin main..." -ForegroundColor Yellow
if ($Push) {
    Write-Host "  -> Pushing changes to origin main..." -ForegroundColor Cyan
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  -> [Error] Failed to push to origin main." -ForegroundColor Red
        exit 1
    }
    Write-Host "  -> Push to origin main completed successfully." -ForegroundColor Green
} else {
    Write-Host "  -> Push skipped. (Pass -Push to push automatically)." -ForegroundColor DarkGray
}

# 8. print the permanent Colab URL
Write-Host "`n[Step 8/8] Permanent Canonical Google Colab Launch URL:" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb" -ForegroundColor Green
Write-Host "--------------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "`nSync complete! Canonical Z-WBE GPU Lab ready for execution on NVIDIA Tesla T4 GPU.`n" -ForegroundColor Cyan
