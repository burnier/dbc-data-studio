#!/bin/bash

# This script removes the COPY_TO_ENV_LOCAL.txt file from Git history
# to allow pushing to GitHub without secret protection blocking

echo "🔧 Removing COPY_TO_ENV_LOCAL.txt from Git history..."
echo ""

cd /Users/dburnier/Documents/my_repos/dbc-data-studio

# Use git filter-branch to remove the file from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch abigail/COPY_TO_ENV_LOCAL.txt abigail2/COPY_TO_ENV_LOCAL.txt" \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "✅ File removed from Git history"
echo ""
echo "Now run these commands to push:"
echo ""
echo "  git push origin main --force-with-lease"
echo ""

