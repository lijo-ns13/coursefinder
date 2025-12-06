#!/bin/bash
# Run git filter-branch with the date filter

cd "$(dirname "$0")"
export FILTER_BRANCH_SQUELCH_WARNING=1

if [ ! -f ".git-filter-dates.sh" ]; then
    echo "Error: .git-filter-dates.sh not found!"
    exit 1
fi

chmod +x .git-filter-dates.sh
git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all

if [ $? -eq 0 ]; then
    echo ""
    echo "Success! Cleaning up..."
    rm -rf .git/refs/original/
    echo ""
    echo "Done! Run 'git log --oneline --all --date=short' to verify."
else
    echo "Error occurred."
fi

