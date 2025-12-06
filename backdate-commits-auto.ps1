# Automated script to backdate git commits
# Run with: powershell -ExecutionPolicy Bypass -File backdate-commits-auto.ps1

param(
    [switch]$Force = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git Commit Backdating (Auto Mode)" -ForegroundColor Cyan
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

if (-not $Force) {
    Write-Host "`nWARNING: This will rewrite git history!" -ForegroundColor Yellow
    Write-Host "Add -Force flag to skip confirmation: .\backdate-commits-auto.ps1 -Force" -ForegroundColor Yellow
    $confirm = Read-Host "`nContinue? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "Aborted." -ForegroundColor Red
        exit 1
    }
}

# Distribute commits
$commitMapping = @()
$commitIndex = 0

foreach ($date in $dates) {
    $dayIndex = $dates.IndexOf($date)
    $weight = 7 - $dayIndex
    
    $totalWeight = (1..7 | ForEach-Object { 7 - $_ + 1 } | Measure-Object -Sum).Sum
    $commitsForDay = [math]::Floor(($totalCommits * $weight) / $totalWeight)
    
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
        
        $hour = Get-Random -Minimum 9 -Maximum 19
        $minute = Get-Random -Minimum 0 -Maximum 60
        
        $commitDateTime = Get-Date -Year $date.Year -Month $date.Month -Day $date.Day -Hour $hour -Minute $minute -Second 0
        $dateStr = $commitDateTime.ToString("yyyy-MM-dd HH:mm:ss")
        
        $commitMapping += @{
            Hash = $hash
            Message = $message
            Author = $author
            Email = $email
            Date = $dateStr
        }
        
        Write-Host "  [$($commitIndex+1)/$totalCommits] $message" -ForegroundColor Gray
        $commitIndex++
    }
}

# Create filter script
Write-Host "`nCreating filter script..." -ForegroundColor Green

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

Write-Host "`nFilter script created: $filterScriptPath" -ForegroundColor Green
Write-Host "`nTo apply the changes, run:" -ForegroundColor Yellow
Write-Host "  git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all" -ForegroundColor Cyan
Write-Host "`nOr if you have Git Bash:" -ForegroundColor Yellow
Write-Host "  bash -c `"git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all`"" -ForegroundColor Cyan
Write-Host "`nAfter running, verify with:" -ForegroundColor Yellow
Write-Host "  git log --oneline --all --date=short" -ForegroundColor Cyan

