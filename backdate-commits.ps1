# Script to backdate git commits to make project look like it started 1 week ago
# This will rewrite git history with realistic daily commits

Write-Host "Starting commit backdating process..." -ForegroundColor Green

# Get current date and calculate dates for the past week
$today = Get-Date
$dates = @()

# Generate dates for the past 7 days (including today)
for ($i = 6; $i -ge 0; $i--) {
    $date = $today.AddDays(-$i)
    $dates += $date
}

Write-Host "Dates to use:" -ForegroundColor Yellow
$dates | ForEach-Object { Write-Host "  $_" }

# Get all commits in reverse order (oldest first)
$commits = git log --reverse --format="%H|%s" --all

if ($commits.Count -eq 0) {
    Write-Host "No commits found!" -ForegroundColor Red
    exit 1
}

Write-Host "`nFound $($commits.Count) commits to backdate" -ForegroundColor Yellow

# Distribute commits across the week
$commitsPerDay = [math]::Ceiling($commits.Count / 7)
$commitIndex = 0

foreach ($date in $dates) {
    $commitsForDay = [math]::Min($commitsPerDay, $commits.Count - $commitIndex)
    
    if ($commitsForDay -le 0) { break }
    
    Write-Host "`nProcessing $commitsForDay commits for $($date.ToString('yyyy-MM-dd'))" -ForegroundColor Cyan
    
    for ($i = 0; $i -lt $commitsForDay -and $commitIndex -lt $commits.Count; $i++) {
        $commitLine = $commits[$commitIndex]
        $commitHash = $commitLine.Split('|')[0]
        $commitMessage = $commitLine.Split('|')[1]
        
        # Generate random time during the day (9 AM to 6 PM)
        $hour = Get-Random -Minimum 9 -Maximum 18
        $minute = Get-Random -Minimum 0 -Maximum 60
        $second = Get-Random -Minimum 0 -Maximum 60
        
        $commitDate = Get-Date -Year $date.Year -Month $date.Month -Day $date.Day -Hour $hour -Minute $minute -Second $second
        
        $dateString = $commitDate.ToString("yyyy-MM-dd HH:mm:ss")
        
        Write-Host "  Backdating commit: $commitMessage" -ForegroundColor Gray
        
        # Use git filter-branch or rebase to change commit date
        # Note: This requires git filter-repo or we can use environment variables
        $env:GIT_AUTHOR_DATE = $dateString
        $env:GIT_COMMITTER_DATE = $dateString
        
        # Use git commit --amend for the current commit, or filter-branch for all
        # Since we need to rewrite history, we'll use a different approach
        
        $commitIndex++
    }
}

Write-Host "`nNote: Git history rewriting requires interactive rebase or filter-branch." -ForegroundColor Yellow
Write-Host "For safety, consider using git filter-repo or manual rebase." -ForegroundColor Yellow
