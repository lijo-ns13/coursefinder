# Simple Guide: Backdate Git Commits

## ✅ Quick Steps

### Step 1: Generate the filter script
```powershell
powershell -ExecutionPolicy Bypass -File backdate-all-commits.ps1 -Auto
```

This creates `.git-filter-dates.sh` with all commit-to-date mappings.

### Step 2: Open Git Bash
Open Git Bash in your project folder:
```
C:\Users\Lijo\Desktop\freelance\coursefinder
```

### Step 3: Run filter-branch
```bash
export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all
```

### Step 4: Clean up
```bash
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Step 5: Verify
```bash
git log --oneline --all --date=short
```

You should see commits from **2025-11-28** to **2025-12-04**.

## 📊 Commit Distribution

- **Nov 28**: 12 commits (project setup)
- **Nov 29**: 10 commits (core features)  
- **Nov 30**: 9 commits (AI integration)
- **Dec 1**: 7 commits (UI components)
- **Dec 2**: 5 commits (mobile, polish)
- **Dec 3**: 3 commits (fixes)
- **Dec 4**: 1 commit (final)

## 🔄 If It Doesn't Work

The filter script (`.git-filter-dates.sh`) is already created. Just run it in Git Bash:

```bash
cd /c/Users/Lijo/Desktop/freelance/coursefinder
bash .git-filter-dates.sh
git filter-branch -f --env-filter 'bash .git-filter-dates.sh' -- --all
```

## ⚠️ After Backdating

If you need to push to remote:
```bash
git push --force origin main
```

**Warning**: This rewrites remote history. Only do this if you're sure!

