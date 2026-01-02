#!/bin/bash
# Setup script for initializing git and preparing for GitHub

echo "Setting up git repository for personal GitHub account (burnier)..."

# Configure git (if not already set globally)
if [ -z "$(git config user.name)" ]; then
    echo "Git user.name not set. Please run:"
    echo "  git config user.name 'Your Name'"
    echo "  git config user.email 'your.email@example.com'"
    echo ""
fi

# Add all files
echo "Staging files..."
git add .

# Show what will be committed
echo ""
echo "Files to be committed:"
git status --short

echo ""
echo "Next steps:"
echo "1. Review the files above"
echo "2. Create a new repository on GitHub at: https://github.com/burnier/dbc-data-studio"
echo "3. Run: git commit -m 'Initial commit: CatalogHero smoke test'"
echo "4. Run: git remote add origin https://github.com/burnier/dbc-data-studio.git"
echo "5. Run: git branch -M main"
echo "6. Run: git push -u origin main"

