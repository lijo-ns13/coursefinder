# Simple script to backdate commits using git rebase
# This is safer and easier than filter-branch

Write-Host "Git Commit Backdating Script" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Get commit count
$commitCount = (git log --oneline --all | Measure-Object -Line).Lines
Write-Host "Found $commitCount commits" -ForegroundColor Yellow

# Calculate dates (past 7 days)
$today = Get-Date
$dates = @()
for ($i = 6; $i -ge 0; $i--) {
    $dates += $today.AddDays(-$i)
}

Write-Host "`nWill distribute commits across:" -ForegroundColor Cyan
$dates | ForEach-Object { Write-Host "  $($_.ToString('yyyy-MM-dd'))" }

Write-Host "`nWARNING: This will rewrite git history!" -ForegroundColor Yellow
$confirm = Read-Host "Continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Red
    exit 1
}

# Create a rebase script
Write-Host "`nCreating rebase script..." -ForegroundColor Green

$rebaseScript = @"
# Rebase script to change commit dates
# Run: git rebase -i --root
# Then use: git commit --amend --date="YYYY-MM-DD HH:MM:SS" --no-edit
"@

# Get commits in order
$commits = git log --reverse --format="%H|%s" --all
$commitsPerDay = [math]::Ceiling($commits.Count / 7)
$commitIndex = 0

$instructions = @()
$instructions += "# Instructions to backdate commits:"
$instructions += "# 1. Run: git rebase -i --root"
$instructions += "# 2. Change 'pick' to 'edit' for commits you want to backdate"
$instructions += "# 3. For each commit, run the corresponding command below:"
$instructions += ""

foreach ($date in $dates) {
    $dayCommits = [math]::Min($commitsPerDay, $commits.Count - $commitIndex)
    
    for ($i = 0; $i -lt $dayCommits -and $commitIndex -lt $commits; $i++) {
        $commitLine = $commits[$commitIndex]
        $hash = $commitLine.Split('|')[0]
        $message = $commitLine.Split('|')[1]
        
        $hour = Get-Random -Minimum 9 -Maximum 19
        $minute = Get-Random -Minimum 0 -Maximum 60
        $dateStr = $date.ToString("yyyy-MM-dd $hour`:${minute}:00")
        
        $instructions += "git commit --amend --date=`"$dateStr`" --no-edit  # $message"
        $commitIndex++
    }
}

$instructions | Out-File -FilePath "rebase-instructions.txt" -Encoding UTF8

Write-Host "`nCreated rebase-instructions.txt" -ForegroundColor Green
Write-Host "Follow the instructions in that file to backdate commits." -ForegroundColor Yellow

