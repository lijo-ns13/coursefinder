# Simple script to rewrite git commit dates
# Uses git filter-branch with environment variables

Write-Host "Rewriting git commit dates..." -ForegroundColor Green

if (-not (Test-Path "commit-dates.txt")) {
    Write-Host "Error: commit-dates.txt not found!" -ForegroundColor Red
    Write-Host "Run create-realistic-history.ps1 first." -ForegroundColor Yellow
    exit 1
}

# Read mappings
$mappings = @{}
Get-Content "commit-dates.txt" | ForEach-Object {
    $parts = $_.Split('|')
    if ($parts.Length -ge 2) {
        $mappings[$parts[0]] = $parts[1]
    }
}

Write-Host "Loaded $($mappings.Count) commit date mappings" -ForegroundColor Yellow

# Create filter script
$filterScript = @'
$mappings = @{}
Get-Content "commit-dates.txt" | ForEach-Object {
    $parts = $_.Split('|')
    if ($parts.Length -ge 2) {
        $mappings[$parts[0]] = $parts[1]
    }
}

$hash = $env:GIT_COMMIT
if ($mappings.ContainsKey($hash)) {
    $date = $mappings[$hash]
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_DATE = $date
    Write-Host "Rewriting commit $hash to $date" -ForegroundColor Gray
}
'@

$filterScript | Out-File "date-filter.ps1" -Encoding UTF8

Write-Host "`nRunning git filter-branch..." -ForegroundColor Cyan
Write-Host "This will rewrite history. Make sure you're on a branch or have a backup!" -ForegroundColor Yellow

# Run filter-branch
gitCommand = "git filter-branch -f --env-filter 'powershell -File date-filter.ps1' -- --all"
Invoke-Expression $Command

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccess! Commit dates rewritten." -ForegroundColor Green
    Write-Host "`nCleaning up..." -ForegroundColor Yellow
    Remove-Item "date-filter.ps1" -ErrorAction SilentlyContinue
    
    Write-Host "`nVerifying dates:" -ForegroundColor Cyan
    git log --all --format="%ad | %s" --date=short -10
    
    Write-Host "`nTo push (force required): git push --force --all" -ForegroundColor Yellow
} else {
    Write-Host "`nError occurred. You may need to clean up:" -ForegroundColor Red
    Write-Host "  git filter-branch --abort" -ForegroundColor White
}

