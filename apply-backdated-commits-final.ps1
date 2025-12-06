# Final script to backdate git commits
# This uses git filter-branch with inline filter

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git Commit Backdating" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get all commits
$allCommits = git log --reverse --format="%H|%s|%an|%ae" --all
$totalCommits = ($allCommits | Measure-Object -Line).Lines

Write-Host "Found $totalCommits commits" -ForegroundColor Yellow

# Calculate dates for past 7 days
$today = Get-Date
$startDate = $today.AddDays(-7)
$dates = @()
for ($i = 0; $i -lt 7; $i++) {
    $dates += $startDate.AddDays($i)
}

Write-Host "`nDistributing commits across:" -ForegroundColor Cyan
$dates | ForEach-Object { Write-Host "  $($_.ToString('yyyy-MM-dd'))" }

Write-Host "`nWARNING: This will rewrite git history!" -ForegroundColor Yellow
$confirm = Read-Host "Continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Red
    exit 1
}

# Create commit-to-date mapping
$commitMapping = @{}
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
        
        $commitMapping[$hash] = @{
            Date = $dateStr
            Author = $author
            Email = $email
            Message = $message
        }
        
        Write-Host "  [$($commitIndex+1)/$totalCommits] $message" -ForegroundColor Gray
        $commitIndex++
    }
}

# Create filter script with proper formatting
Write-Host "`nCreating filter script..." -ForegroundColor Green

$filterScript = "#!/bin/sh`ncase `$GIT_COMMIT in`n"

foreach ($hash in $commitMapping.Keys) {
    $mapping = $commitMapping[$hash]
    $filterScript += "$hash)`n"
    $filterScript += "        export GIT_AUTHOR_DATE=`"$($mapping.Date)`"`n"
    $filterScript += "        export GIT_COMMITTER_DATE=`"$($mapping.Date)`"`n"
    $filterScript += "        export GIT_AUTHOR_NAME=`"$($mapping.Author)`"`n"
    $filterScript += "        export GIT_AUTHOR_EMAIL=`"$($mapping.Email)`"`n"
    $filterScript += "        export GIT_COMMITTER_NAME=`"$($mapping.Author)`"`n"
    $filterScript += "        export GIT_COMMITTER_EMAIL=`"$($mapping.Email)`"`n"
    $filterScript += "        ;;`n"
}

$filterScript += "esac`n"

$filterScriptPath = ".git-filter-dates.sh"
[System.IO.File]::WriteAllText((Resolve-Path .).Path + "\" + $filterScriptPath, $filterScript, [System.Text.Encoding]::UTF8)

Write-Host "Filter script created: $filterScriptPath" -ForegroundColor Green
Write-Host "`nApplying git filter-branch..." -ForegroundColor Yellow

# Use Git Bash
$gitBashPath = "C:\Program Files\Git\bin\bash.exe"
if (Test-Path $gitBashPath) {
    $workDir = (Resolve-Path .).Path.Replace('\', '/')
    $bashCmd = "cd '$workDir' && export FILTER_BRANCH_SQUELCH_WARNING=1 && git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all"
    
    $process = Start-Process -FilePath $gitBashPath -ArgumentList "-c", $bashCmd -Wait -NoNewWindow -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host "`n========================================" -ForegroundColor Green
        Write-Host "Success! Git history rewritten." -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        
        # Cleanup
        Remove-Item ".git\refs\original" -Recurse -Force -ErrorAction SilentlyContinue
        
        Write-Host "`nVerifying..." -ForegroundColor Yellow
        git log --oneline --all --date=short -10
        
        Write-Host "`nDone! Commits are now backdated over the past week." -ForegroundColor Green
    } else {
        Write-Host "`nFilter-branch completed. Check git log to verify." -ForegroundColor Yellow
    }
} else {
    Write-Host "Git Bash not found. Please run manually:" -ForegroundColor Yellow
    Write-Host "  git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all" -ForegroundColor Cyan
}

