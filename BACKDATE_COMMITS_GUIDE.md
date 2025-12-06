# Guide: Backdating Git Commits

This guide will help you rewrite git history to make it look like the project started 1 week ago with daily commits.

## ⚠️ Warning

**This will rewrite git history!** Make sure you:
- Have a backup of your repository
- Are working on a feature branch (not main/master)
- Understand that you'll need to force push after this

## Method 1: Automated Script (Recommended)

### Step 1: Run the script

```powershell
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File backdate-commits-auto.ps1 -Force
```

### Step 2: Apply the filter

The script creates `.git-filter-dates.sh`. Run:

```bash
# In Git Bash or Linux/Mac terminal
git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all
```

### Step 3: Clean up

```bash
# Remove backup refs
rm -rf .git/refs/original/

# Clean up filter script
rm .git-filter-dates.sh

# Force garbage collection
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Step 4: Verify

```bash
git log --oneline --all --date=short
```

You should see commits distributed over the past 7 days.

## Method 2: Manual Git Rebase

If the automated script doesn't work, use interactive rebase:

### Step 1: Start interactive rebase

```bash
git rebase -i --root
```

### Step 2: Change commits to "edit"

In the editor, change `pick` to `edit` for commits you want to backdate.

### Step 3: For each commit, amend with new date

```bash
# Example: Set date to 7 days ago at 2 PM
git commit --amend --date="2024-11-28 14:00:00" --no-edit

# Continue rebase
git rebase --continue
```

Repeat for all commits.

## Method 3: Using Git Filter-Repo (Most Reliable)

### Install git-filter-repo

```bash
pip install git-filter-repo
```

### Create date mapping file

Run the PowerShell script to generate dates, then use:

```bash
git filter-repo --commit-callback '
import datetime
import random

# Map commits to dates (you'll need to create this mapping)
commit_dates = {
    "hash1": "2024-11-28 10:00:00",
    "hash2": "2024-11-28 14:30:00",
    # ... etc
}

if commit.original_oid in commit_dates:
    date_str = commit_dates[commit.original_oid]
    commit.author_date = date_str
    commit.committer_date = date_str
'
```

## Distribution Strategy

The script distributes commits like this:
- **Day 1 (7 days ago)**: Most commits (project setup)
- **Day 2-3**: Many commits (core features)
- **Day 4-5**: Moderate commits (features, fixes)
- **Day 6-7**: Fewer commits (polish, final touches)

## After Backdating

### Force Push (if needed)

```bash
# ⚠️ Only if you're sure!
git push --force origin main
```

### Verify Dates

```bash
# See commit dates
git log --format="%h | %ad | %s" --date=short --all

# See commit graph
git log --graph --oneline --all --date=short
```

## Troubleshooting

### Script doesn't run
- Make sure you have Git Bash installed
- Try running commands manually in Git Bash

### Dates not changing
- Make sure you're using the correct branch
- Check that filter-branch completed successfully
- Try using git-filter-repo instead

### Need to undo
```bash
# Restore from backup refs
git reset --hard refs/original/refs/heads/main
```

## Example Output

After backdating, your git log should look like:

```
* 67e6e5d (2024-12-04) chore: update documentation
* b79f00b (2024-12-04) feat: add keep-alive service
* a9567bb (2024-12-03) fix: correct text sizes
* 7bb2d2e (2024-12-03) ui: finalize landing page
* 935910a (2024-12-02) refactor: improve code organization
...
* b8b6f78 (2024-11-28) initial commit
```

## Notes

- Commits are distributed with more on earlier days (realistic development pattern)
- Times are randomized between 9 AM - 7 PM (work hours)
- Author names and emails are preserved
- Commit messages remain unchanged

