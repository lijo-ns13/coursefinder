#!/bin/bash
# Simple script to backdate commits - Run this in Git Bash

cd "$(dirname "$0")"

echo "Applying git filter-branch..."
export FILTER_BRANCH_SQUELCH_WARNING=1=1

# Use the filter script
if [ -f ".git-filter-dates.sh" ]; then
    git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all
    echo ""
    echo "Cleaning up..."
    rm -rf .git/refs/original/
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    echo ""
    echo "Done! Verifying..."
    git log --oneline --all --date=short -10
else
    echo "Error: .git-filter-dates.sh not found!"
    echo "Run: powershell -ExecutionPolicy Bypass -File backdate-all-commits.ps1 -Auto"
    exit 1
fi

