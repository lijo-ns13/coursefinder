# Create realistic git commit history over the past week
# This script will rewrite commit dates to make it look like daily development

Write-Host "Creating realistic commit history..." -ForegroundColor Green

# Get all commits
$allCommits = git log --reverse --format="%H|%an|%ae|%s" --all

if ($allCommits.Count -eq 0) {
    Write-Host "No commits found!" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($allCommits.Count) commits" -ForegroundColor Yellow

# Calculate dates for the past week
$today = Get-Date
$weekDates = @()
for ($i = 6; $i -ge 0; $i--) {
    $weekDates += $today.AddDays(-$i)
}

# Distribute commits across days
$commitsPerDay = [math]::Max(1, [math]::Floor($allCommits.Count / 7))
$remainingCommits = $allCommits.Count

Write-Host "`nDistributing commits:" -ForegroundColor Cyan
$dayIndex = 0
$commitIndex = 0

# Create a temporary file to store the mapping
$mappingFile = "commit-dates.txt"
Remove-Item $mappingFile -ErrorAction SilentlyContinue

foreach ($date in $weekDates) {
    if ($commitIndex -ge $allCommits.Count) { break }
    
    # Calculate commits for this day (distribute remaining evenly)
    $commitsToday = [math]::Min($commitsPerDay, $remainingCommits)
    if ($dayIndex -eq 6) { $commitsToday = $remainingCommits } # Last day gets remaining
    
    Write-Host "`n$($date.ToString('yyyy-MM-dd')): $commitsToday commits" -ForegroundColor Green
    
    for ($i = 0; $i -lt $commitsToday -and $commitIndex -lt $allCommits.Count; $i++) {
        $commitLine = $allCommits[$commitIndex]
        $parts = $commitLine.Split('|')
        $hash = $parts[0]
        $author = $parts[1]
        $email = $parts[2]
        $message = $parts[3]
        
        # Random time during work hours (9 AM - 7 PM)
        $hour = Get-Random -Minimum 9 -Maximum 19
        $minute = Get-Random -Minimum 0 -Maximum 60
        
        $commitDateTime = Get-Date -Year $date.Year -Month $date.Month -Day $date.Day -Hour $hour -Minute $minute -Second 0
        $dateString = $commitDateTime.ToString("yyyy-MM-dd HH:mm:ss")
        
        Write-Host "  [$($commitDateTime.ToString('HH:mm'))] $message" -ForegroundColor Gray
        
        # Store mapping
        Add-Content $mappingFile "$hash|$dateString|$author|$email|$message"
        
        $commitIndex++
    }
    
    $remainingCommits -= $commitsToday
    $dayIndex++
}

Write-Host "`nCommit mapping saved to $mappingFile" -ForegroundColor Yellow
Write-Host "`nTo apply these dates, run:" -ForegroundColor Cyan
Write-Host "  git filter-branch -f --env-filter '`$hash=`$GIT_COMMIT; `$line=Select-String -Path commit-dates.txt -Pattern `$hash; if(`$line) { `$date=`$line.ToString().Split(\"|\")[1]; `$GIT_AUTHOR_DATE=`$date; `$GIT_COMMITTER_DATE=`$date }'" -ForegroundColor White

Write-Host "`nOr use git filter-repo (recommended):" -ForegroundColor Cyan
Write-Host "  Install: pip install git-filter-repo" -ForegroundColor White
Write-Host "  Then use the mapping file to rewrite dates" -ForegroundColor White
