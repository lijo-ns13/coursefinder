# PowerShell script to backdate git commits over the past week
# This creates realistic commit history

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git Commit Backdating" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get all commits
$allCommits = git log --reverse --format="%H|%s|%an|%ae" --all
$totalCommits = ($allCommits | Measure-Object -Line).Lines

Write-Host "Found $totalCommits commits" -ForegroundColor Yellow

# Calculate dates for past 7 days (starting 7 days ago)
$today = Get-Date
$startDate = $today.AddDays(-7)
$dates = @()

for ($i = 0; $i -lt 7; $i++) {
    $dates += $startDate.AddDays($i)
}

Write-Host "`nDistributing commits across:" -ForegroundColor Cyan
$dates | ForEach-Object { Write-Host "  $($_.ToString('yyyy-MM-dd'))" }

Write-Host "`nWARNING: This will rewrite git history!" -ForegroundColor Yellow
Write-Host "Make sure you have a backup or are working on a feature branch." -ForegroundColor Yellow
$confirm = Read-Host "`nContinue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Red
    exit 1
}

# Distribute commits (more on early days, fewer on later days)
$commitMapping = @()
$commitIndex = 0

foreach ($date in $dates) {
    $dayIndex = $dates.IndexOf($date)
    # More commits on earlier days
    $weight = 7 - $dayIndex
    
    # Calculate commits for this day
    $totalWeight = (1..7 | ForEach-Object { 7 - $_ + 1 } | Measure-Object -Sum).Sum
    $commitsForDay = [math]::Floor(($totalCommits * $weight) / $totalWeight)
    
    # Ensure we don't exceed
    if ($commitIndex + $commitsForDay > $totalCommits) {
        $commitsForDay = $totalCommits - $commitIndex
    }
    
    if ($commitsForDay -le 0) { break }
    
    Write-Host "`n$($date.ToString('yyyy-MM-dd')): $commitsForDay commits" -ForegroundColor Yellow
    
    for ($i = 0; $i -lt $commitsForDay -and $commitIndex -lt $totalCommits; $i++) {
        $commitLine = $allCommits[$commitIndex]
        $parts = $commitLine.Split('|')
        $hash = $parts[0]
        $message = $parts[1]
        $author = if ($parts.Length -gt 2) { $parts[2] } else { "Developer" }
        $email = if ($parts.Length -gt 3) { $parts[3] } else { "dev@coursefinder.com" }
        
        # Random time during work hours (9 AM to 7 PM)
        $hour = Get-Random -Minimum 9 -Maximum 19
        $minute = Get-Random -Minimum 0 -Maximum 60
        
        $commitDateTime = Get-Date -Year $date.Year -Month $date.Month -Day $date.Day -Hour $hour -Minute $minute -Second 0
        $dateStr = $commitDateTime.ToString("yyyy-MM-dd HH:mm:ss")
        
        $dateStrISO = $commitDateTime.ToString("yyyy-MM-ddTHH:mm:ss")
        
        $commitMapping += @{
            Hash = $hash
            Message = $message
            Author = $author
            Email = $email
            Date = $dateStr
            DateISO = $dateStrISO
        }
        
        Write-Host "  [$($commitIndex+1)/$totalCommits] $message" -ForegroundColor Gray
        $commitIndex++
    }
}

# Create filter script for git filter-branch
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Creating filter script..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

$filterContent = @'
#!/bin/sh
case "$GIT_COMMIT" in
'@

foreach ($mapping in $commitMapping) {
    $filterContent += @"
    $($mapping.Hash))
        export GIT_AUTHOR_DATE="$($mapping.Date)"
        export GIT_COMMITTER_DATE="$($mapping.Date)"
        export GIT_AUTHOR_NAME="$($mapping.Author)"
        export GIT_AUTHOR_EMAIL="$($mapping.Email)"
        export GIT_COMMITTER_NAME="$($mapping.Author)"
        export GIT_COMMITTER_EMAIL="$($mapping.Email)"
        ;;
"@
}

$filterContent += @'
esac
'@

$filterScriptPath = ".git-filter-dates.sh"
$filterContent | Out-File -FilePath $filterScriptPath -Encoding UTF8 -NoNewline

Write-Host "`nRewriting git history with filter-branch..." -ForegroundColor Green
Write-Host "This may take a few moments..." -ForegroundColor Yellow

# Check if git filter-branch is available
$gitPath = (Get-Command git -ErrorAction SilentlyContinue).Source
if (-not $gitPath) {
    Write-Host "Git not found in PATH!" -ForegroundColor Red
    exit 1
}

# Use git filter-branch
$env:GIT_AUTHOR_NAME = $commitMapping[0].Author
$env:GIT_AUTHOR_EMAIL = $commitMapping[0].Email

# Try to use bash if available (Git Bash on Windows)
$bashPath = "C:\Program Files\Git\bin\bash.exe"
if (Test-Path $bashPath) {
    & $bashPath -c "git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all"
} else {
    # Fallback: use git directly (may not work on Windows without Git Bash)
    Write-Host "Git Bash not found. Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative: Create a batch file approach
    Write-Host "`nPlease run this command manually:" -ForegroundColor Yellow
    Write-Host "git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all" -ForegroundColor Cyan
    Write-Host "`nOr use Git Bash to run the script." -ForegroundColor Yellow
    
    Write-Host "`nFilter script created at: $filterScriptPath" -ForegroundColor Green
    Write-Host "You can also use git rebase interactively with the dates." -ForegroundColor Yellow
    exit 0
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "Success! Git history rewritten." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    # Cleanup
    Remove-Item $filterScriptPath -ErrorAction SilentlyContinue
    Remove-Item ".git/refs/original/" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host "`nDone! Your commits are now backdated." -ForegroundColor Green
    Write-Host "Run 'git log --oneline --all --date=short' to verify." -ForegroundColor Cyan
    Write-Host "`nNote: You may need to force push: git push --force" -ForegroundColor Yellow
} else {
    Write-Host "`nFilter-branch completed. Check git log to verify." -ForegroundColor Yellow
    Write-Host "If dates weren't changed, you may need to run manually:" -ForegroundColor Yellow
    Write-Host "  git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all" -ForegroundColor Cyan
}
