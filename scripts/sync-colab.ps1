[CmdletBinding()]
param(
    [Parameter(Position=0)]
    [string]$CommitMessage = "",
    [switch]$Push,
    [switch]$SkipPull,
    [switch]$All
)

# ==============================================================================
# Z-WBE Bottleneck Lab - Google Colab Synchronization Utility
# Automates the 8-step Antigravity <-> GitHub <-> Colab development cycle
# ==============================================================================

# Locate repository root dynamically so script can be invoked from any directory
$repoRoot = (git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) {
    $repoRoot = Split-Path -Parent $PSScriptRoot
}
Push-Location $repoRoot

try {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "   Z-WBE BOTTLENECK LAB - COLAB SYNCHRONIZATION UTILITY   " -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Cyan

    $notebookRel = "notebooks/Z_WBE_GPU_LAB.ipynb"
    $notebookPath = Join-Path $repoRoot $notebookRel

    # 1. git pull --rebase
    Write-Host "`n[Step 1/8] Running git pull --rebase --autostash origin main..." -ForegroundColor Yellow
    if (-not $SkipPull) {
        git pull --rebase --autostash origin main
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
        Write-Host "  -> Verified: $notebookRel exists." -ForegroundColor Green
    } else {
        Write-Host "  -> [Error] $notebookRel not found at $notebookPath!" -ForegroundColor Red
        exit 1
    }

    # 3. show whether Colab changed it
    Write-Host "`n[Step 3/8] Checking if Colab or remote commits modified the notebook..." -ForegroundColor Yellow
    $lastCommit = git log -1 --format="%h | %an <%ae> | %ad | %s" --date=short -- $notebookRel
    Write-Host "  -> Last commit affecting notebook: $lastCommit" -ForegroundColor Cyan

    $dirty = git status --porcelain -- $notebookRel
    if ($dirty) {
        Write-Host "  -> [Modified] Working copy changes detected: $dirty" -ForegroundColor Magenta
    } else {
        Write-Host "  -> Working copy of $notebookRel is clean." -ForegroundColor Green
    }

    # 4. run notebook validation
    Write-Host "`n[Step 4/8] Running notebook JSON schema and section validation..." -ForegroundColor Yellow
    try {
        $raw = Get-Content $notebookPath -Raw -Encoding UTF8
        $content = $raw | ConvertFrom-Json
        $cellCount = $content.cells.Count
        if ($cellCount -gt 0) {
            Write-Host "  -> Schema valid: $cellCount cells detected." -ForegroundColor Green

            # Validate the 10 canonical sections
            $allText = ($content.cells | ForEach-Object { $_.source -join " " }) -join "`n"
            $requiredSections = @(
                "Section 1: Environment",
                "Section 2: NVIDIA RAPIDS",
                "Section 3: Course Benchmark",
                "Section 4: Benchmark Evidence",
                "Section 5: Z-WBE Biophysical",
                "Section 6: 100,000-Scenario",
                "Section 7: Multi-Dimensional Bottleneck",
                "Section 8: Phase-Transition",
                "Section 9: Visual Analytics",
                "Section 10: Contest Evidence"
            )
            $missing = @()
            foreach ($sec in $requiredSections) {
                if ($allText -notmatch [regex]::Escape($sec)) {
                    $missing += $sec
                }
            }
            if ($missing.Count -eq 0) {
                Write-Host "  -> All 10 canonical sections verified in notebook structure." -ForegroundColor Green
            } else {
                Write-Host "  -> [Warning] Missing expected section headers: $($missing -join ', ')" -ForegroundColor Yellow
            }
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
        if ($All) {
            Write-Host "  -> Staging all changed files and committing with message: '$CommitMessage'..." -ForegroundColor Cyan
            git add -A
        } else {
            Write-Host "  -> Staging and committing '$notebookRel' with message: '$CommitMessage'..." -ForegroundColor Cyan
            git add $notebookRel
        }
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
}
final