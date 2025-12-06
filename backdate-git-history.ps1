# Script to backdate git commits to make project look like it started 1 week ago
# This rewrites git history with realistic daily commits

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git History Backdating Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Warning
Write-Host "WARNING: This will rewrite git history!" -ForegroundColor Yellow
Write-Host "Make sure you have a backup or are okay with rewriting history." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Red
    exit 1
}

# Get all commits in reverse order (oldest first)
Write-Host "`nFetching commit history..." -ForegroundColor Green
$commits = git log --reverse --format="%H|%s|%an|%ae" --all

if ($commits.Count -eq 0) {
    Write-Host "No commits found!" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($commits.Count) commits to backdate" -ForegroundColor Yellow
Write-Host ""

# Calculate dates for the past 7 days (starting from 7 days ago)
$today = Get-Date
$startDate = $today.AddDays(-7)
$dates = @()

# Generate dates for the past 7 days
for ($i = 0; $i -lt 7; $i++) {
    $date = $startDate.AddDays($i)
    $dates += $date
}

Write-Host "Distributing commits across dates:" -ForegroundColor Cyan
$dates | ForEach-Object { Write-Host "  $($_.ToString('yyyy-MM-dd'))" }

# Distribute commits across days (more commits on earlier days, fewer on later days)
$totalCommits = $commits.Count
$commitIndex = 0

# Create a mapping of commits to dates
$commitDates = @()

foreach ($date in $dates) {
    # Distribute commits: more on early days, fewer on later days
    $dayIndex = $dates.IndexOf($date)
    $weight = 7 - $dayIndex  # More weight for earlier days
    
    # Calculate commits for this day based on weight
    $totalWeight = (1..7 | ForEach-Object { 7 - $_ + 1 } | Measure-Object -Sum).Sum
    $commitsForDay = [math]::Floor(($totalCommits * $weight) / $totalWeight)
    
    # Ensure we don't exceed total commits
    if ($commitIndex + $commitsForDay > $totalCommits) {
        $commitsForDay = $totalCommits - $commitIndex
    }
    
    if ($commitsForDay -le 0) { break }
    
    Write-Host "`n$($date.ToString('yyyy-MM-dd')): $commitsForDay commits" -ForegroundColor Yellow
    
    for ($i = 0; $i -lt $commitsForDay -and $commitIndex -lt $totalCommits; $i++) {
        $commitLine = $commits[$commitIndex]
        $parts = $commitLine.Split('|')
        $hash = $parts[0]
        $message = $parts[1]
        $author = $parts[2]
        $email = $parts[3]
        
        # Generate random time during work hours (9 AM to 8 PM)
        $hour = Get-Random -Minimum 9 -Maximum 20
        $minute = Get-Random -Minimum 0 -Maximum 60
        
        $commitDateTime = Get-Date -Year $date.Year -Month $date.Month -Day $date.Day -Hour $hour -Minute $minute -Second 0
        
        $commitDates += @{
            Hash = $hash
            Message = $message
            Author = $author
            Email = $email
            Date = $commitDateTime
        }
        
        Write-Host "  - $message" -ForegroundColor Gray
        $commitIndex++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Rewriting git history..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Create a script file for git filter-branch
$filterScript = @"
#!/bin/sh
case `$GIT_COMMIT in
"@

foreach ($commitDate in $commitDates) {
    $dateStr = $commitDate.Date.ToString("yyyy-MM-dd HH:mm:ss")
    $hash = $commitDate.Hash
    $author = $commitDate.Author
    $email = $commitDate.Email
    
    $filterScript += @"
    $hash)
        export GIT_AUTHOR_DATE="$dateStr"
        export GIT_COMMITTER_DATE="$dateStr"
        export GIT_AUTHOR_NAME="$author"
        export GIT_AUTHOR_EMAIL="$email"
        export GIT_COMMITTER_NAME="$author"
        export GIT_COMMITTER_EMAIL="$email"
        ;;
"@
}

$filterScript += @"
esac
"@

# Save filter script
$filterScriptPath = ".git-rewrite-filter.sh"
$filterScript | Out-File -FilePath $filterScriptPath -Encoding UTF8 -NoNewline

Write-Host "`nUsing git filter-branch to rewrite history..." -ForegroundColor Green
Write-Host "This may take a few moments..." -ForegroundColor Yellow

# Use git filter-branch
$env:PATH = "C:\Program Files\Git\bin;$env:PATH"
git filter-branch -f --env-filter "bash $filterScriptPath" -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "Success! Git history has been rewritten." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "`nCleaning up..." -ForegroundColor Yellow
    
    # Clean up
    Remove-Item $filterScriptPath -ErrorAction SilentlyContinue
    
    Write-Host "`nDone! Your commits are now backdated over the past week." -ForegroundColor Green
    Write-Host "Run 'git log --oneline --all' to see the new dates." -ForegroundColor Cyan
} else {
    Write-Host "`nError occurred. You may need to use git filter-repo instead." -ForegroundColor Red
    Write-Host "Or manually rebase commits with: git rebase -i --root" -ForegroundColor Yellow
}

