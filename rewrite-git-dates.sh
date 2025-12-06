#!/bin/bash
# Script to rewrite git commit dates over the past week
# Usage: bash rewrite-git-dates.sh

echo "========================================"
echo "Git History Rewriting Script"
echo "========================================"
echo ""

# Get all commits
commits=$(git log --reverse --format="%H|%s" --all)
commit_count=$(echo "$commits" | wc -l)

echo "Found $commit_count commits to backdate"
echo ""

# Calculate dates for past 7 days
today=$(date +%s)
dates=()
for i in {6..0}; do
    date=$(date -d "$i days ago" +%Y-%m-%d)
    dates+=("$date")
done

echo "Distributing commits across:"
for date in "${dates[@]}"; do
    echo "  $date"
done
echo ""

# Create filter script
cat > .git-rewrite-filter.sh << 'FILTER_SCRIPT'
#!/bin/sh
case "$GIT_COMMIT" in
FILTER_SCRIPT

commit_index=0
commits_per_day=$((commit_count / 7))

for date in "${dates[@]}"; do
    for ((i=0; i<commits_per_day && commit_index<commit_count; i++)); do
        commit_line=$(echo "$commits" | sed -n "$((commit_index+1))p")
        hash=$(echo "$commit_line" | cut -d'|' -f1)
        
        # Random time between 9 AM and 8 PM
        hour=$((RANDOM % 11 + 9))
        minute=$((RANDOM % 60))
        
        date_str="$date $hour:$minute:00"
        
        cat >> .git-rewrite-filter.sh << EOF
    $hash)
        export GIT_AUTHOR_DATE="$date_str"
        export GIT_COMMITTER_DATE="$date_str"
        ;;
EOF
        
        commit_index=$((commit_index + 1))
    done
done

cat >> .git-rewrite-filter.sh << 'FILTER_SCRIPT'
esac
FILTER_SCRIPT

chmod +x .git-rewrite-filter.sh

echo "Rewriting git history..."
git filter-branch -f --env-filter 'bash .git-rewrite-filter.sh' -- --all

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Success! Git history rewritten."
    echo "========================================"
    rm -f .git-rewrite-filter.sh
    echo ""
    echo "Done! Run 'git log --oneline --all' to see new dates."
else
    echo "Error occurred during rewrite."
fi

