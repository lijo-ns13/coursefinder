# Automated script to backdate ALL commits over past week
# Run: powershell -ExecutionPolicy Bypass -File backdate-all-commits.ps1 -Auto

param([switch]$Auto = $false)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git Commit Backdating (Auto)" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not $Auto) {
    Write-Host "WARNING: This will rewrite git history!" -ForegroundColor Yellow
    Write-Host "Add -Auto flag to skip confirmation" -ForegroundColor Yellow
    $confirm = Read-Host "Continue? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "Aborted." -ForegroundColor Red
        exit 1
    }
}

# Get all commits
$allCommits = git log --reverse --format="%H|%s|%an|%ae" --all
$totalCommits = ($allCommits | Measure-Object -Line).Lines

Write-Host "Found $totalCommits commits" -ForegroundColor Yellow

# Dates for past 7 days
$today = Get-Date
$startDate = $today.AddDays(-7)
$dates = @()
for ($i = 0; $i -lt 7; $i++) {
    $dates += $startDate.AddDays($i)
}

Write-Host "`nDistributing commits:" -ForegroundColor Cyan
$dates | ForEach-Object { Write-Host "  $($_.ToString('yyyy-MM-dd'))" }

# Create mapping
$commitMapping = @{}
$idx = 0

foreach ($date in $dates) {
    $dayIdx = $dates.IndexOf($date)
    $weight = 7 - $dayIdx
    $totalWeight = (1..7 | ForEach-Object { 7 - $_ + 1 } | Measure-Object -Sum).Sum
    $count = [math]::Floor(($totalCommits * $weight) / $totalWeight)
    
    if ($idx + $count > $totalCommits) { $count = $totalCommits - $idx }
    if ($count -le 0) { break }
    
    Write-Host "`n$($date.ToString('yyyy-MM-dd')): $count commits" -ForegroundColor Yellow
    
    for ($j = 0; $j -lt $count -and $idx -lt $totalCommits; $j++) {
        $parts = $allCommits[$idx].Split('|')
        $hash = $parts[0]
        $author = if ($parts.Length -gt 2) { $parts[2] } else { "Developer" }
        $email = if ($parts.Length -gt 3) { $parts[3] } else { "dev@coursefinder.com" }
        
        $hour = Get-Random -Minimum 9 -Maximum 19
        $minute = Get-Random -Minimum 0 -Maximum 60
        $dt = Get-Date -Year $date.Year -Month $date.Month -Day $date.Day -Hour $hour -Minute $minute
        $dateStr = $dt.ToString("yyyy-MM-dd HH:mm:ss")
        
        $commitMapping[$hash] = @{
            Date = $dateStr
            Author = $author
            Email = $email
        }
        
        Write-Host "  [$($idx+1)/$totalCommits] $($parts[1])" -ForegroundColor Gray
        $idx++
    }
}

# Create filter script
$filter = "#!/bin/sh`ncase `$GIT_COMMIT in`n"
foreach ($hash in $commitMapping.Keys) {
    $m = $commitMapping[$hash]
    $filter += "$hash)`n"
    $filter += "        export GIT_AUTHOR_DATE=`"$($m.Date)`"`n"
    $filter += "        export GIT_COMMITTER_DATE=`"$($m.Date)`"`n"
    $filter += "        export GIT_AUTHOR_NAME=`"$($m.Author)`"`n"
    $filter += "        export GIT_AUTHOR_EMAIL=`"$($m.Email)`"`n"
    $filter += "        export GIT_COMMITTER_NAME=`"$($m.Author)`"`n"
    $filter += "        export GIT_COMMITTER_EMAIL=`"$($m.Email)`"`n"
    $filter += "        ;;`n"
}
$filter += "esac`n"

$filterPath = Join-Path $PWD ".git-filter-dates.sh"
[System.IO.File]::WriteAllText($filterPath, $filter, [System.Text.Encoding]::UTF8)

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Filter script created: .git-filter-dates.sh" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nTo apply, run in Git Bash:" -ForegroundColor Yellow
Write-Host "  git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all" -ForegroundColor Cyan
Write-Host "`nOr run this PowerShell command:" -ForegroundColor Yellow
Write-Host "  & 'C:\Program Files\Git\bin\bash.exe' -c `"cd '$PWD' && git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all`"" -ForegroundColor Cyan

