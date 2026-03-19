#!/bin/bash
# Run this script after completing gh auth login
# Usage: ./setup-github.sh

set -e
cd "$(dirname "$0")"

echo "Checking gh auth..."
gh auth status

echo ""
echo "Initializing git..."
git init

echo ""
echo "Adding files..."
git add .
git status

echo ""
echo "Creating initial commit..."
git commit -m "Initial commit: todo-plus-plus app"

echo ""
echo "Creating GitHub repo and pushing..."
gh repo create todo-plus-plus --public --source=. --remote=origin --push

echo ""
echo "Done! Your code is now at https://github.com/$(gh api user -q .login)/todo-plus-plus"
