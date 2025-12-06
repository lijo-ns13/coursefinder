# Apply git filter-branch with proper path handling
$scriptPath = Join-Path $PWD ".git-filter-dates.sh"
$scriptPathAbs = (Resolve-Path $scriptPath -ErrorAction SilentlyContinue).Path

if (-not $scriptPathAbs) {
    Write-Host "Filter script not found at: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "Applying git filter-branch..." -ForegroundColor Green
Write-Host "Script path: $scriptPathAbs" -ForegroundColor Gray

# Set environment variable to suppress warning
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

# Use Git Bash if available
$gitBash = "C:\Program Files\Git\bin\bash.exe"
if (Test-Path $gitBash) {
    Write-Host "Using Git Bash..." -ForegroundColor Yellow
    $bashScript = @"
cd '$PWD'
export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all
"@
    $bashScript | & $gitBash
} else {
    # Try with WSL bash or system bash
    Write-Host "Git Bash not found. Trying system bash..." -ForegroundColor Yellow
    bash -c "cd '$PWD' && export FILTER_BRANCH_SQUELCH_WARNING=1 && git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all"
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "Success! Git history rewritten." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    Write-Host "`nCleaning up backup refs..." -ForegroundColor Yellow
    Remove-Item ".git\refs\original" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host "`nVerifying changes..." -ForegroundColor Yellow
    git log --oneline --all --date=short -10
    
    Write-Host "`nDone! Your commits are now backdated over the past week." -ForegroundColor Green
    Write-Host "`nTo see all commits with dates:" -ForegroundColor Cyan
    Write-Host "  git log --format='%h | %ad | %s' --date=short --all" -ForegroundColor White
} else {
    Write-Host "`nError occurred. You may need to run this manually in Git Bash." -ForegroundColor Red
    Write-Host "`nManual command:" -ForegroundColor Yellow
    Write-Host "  git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all" -ForegroundColor Cyan
}

