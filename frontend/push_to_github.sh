#!/bin/bash
# Script to push frontend to GitHub

echo "🚀 Pushing GITAM AI Frontend to GitHub..."
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")"

# Remove existing git if present
echo "📁 Cleaning up existing git repository..."
rm -rf .git

# Initialize new repository
echo "🔧 Initializing new git repository..."
git init

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/mkeshavareddy/Gttham_frontend.git

# Stage all files
echo "📦 Staging files (.gitignore will exclude node_modules, .next, etc.)..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "Initial commit: GITAM AI Policy Frontend

- Next.js 14 frontend with App Router
- Discovery Engine API integration via Next.js API routes
- Production-ready Dockerfile
- Standalone output configuration
- Test pages for Discovery Engine
- Complete deployment documentation

🚀 Ready for Cloud Run deployment"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ Done! Frontend pushed to https://github.com/mkeshavareddy/Gttham_frontend.git"
echo ""
echo "Next step: Deploy to Cloud Run!"
echo "Run: gcloud run deploy gitam-ai-policy-frontend --source . --region asia-south1"
