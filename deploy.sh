#!/bin/bash

# MERN Stack Deployment Script for Vercel
# This script helps deploy your MERN stack to Vercel

echo "🚀 MERN Stack Deployment Script"
echo "================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo ""
echo "📋 Deployment Checklist:"
echo "1. Have you set up MongoDB Atlas? (Y/N)"
read -r mongodb_setup

if [[ ! "$mongodb_setup" =~ ^[Yy]$ ]]; then
    echo "⚠️  Please set up MongoDB Atlas first:"
    echo "   - Create account at https://www.mongodb.com/atlas"
    echo "   - Create a new cluster"
    echo "   - Get your connection string"
    exit 1
fi

echo "2. Do you have your MongoDB connection string ready? (Y/N)"
read -r mongodb_ready

if [[ ! "$mongodb_ready" =~ ^[Yy]$ ]]; then
    echo "⚠️  Please get your MongoDB connection string from Atlas"
    exit 1
fi

echo ""
echo "📝 Backend Deployment Setup:"
echo "Please provide your MongoDB connection string:"
read -r mongodb_uri

echo "Please provide a strong JWT secret (min 32 characters):"
read -r jwt_secret

echo ""
echo "🚀 Starting Backend Deployment..."
cd server || exit

# Create .env file for backend
cat > .env << EOF
MONGODB_URI=$mongodb_uri
JWT_SECRET=$jwt_secret
CORS_ORIGIN=https://your-frontend.vercel.app
PORT=5000
NODE_ENV=production
EOF

echo "✅ Backend .env file created"
echo ""
echo "📦 Deploying Backend to Vercel..."
vercel --prod

echo ""
echo "📝 Frontend Deployment Setup:"
echo "Please provide your deployed backend URL (e.g., https://your-backend.vercel.app):"
read -r backend_url

cd ../client || exit

# Create .env file for frontend
cat > .env << EOF
VITE_API_URL=$backend_url
VITE_APP_NAME=CMIS - College Management System
VITE_APP_ENV=production
EOF

echo "✅ Frontend .env file created"
echo ""
echo "📦 Deploying Frontend to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📋 Post-Deployment Steps:"
echo "1. Update backend CORS_ORIGIN with your actual frontend URL"
echo "2. Test registration/login functionality"
echo "3. Verify all API endpoints are working"
echo ""
echo "🔧 To update CORS settings:"
echo "   - Go to your Vercel dashboard"
echo "   - Find your backend project"
echo "   - Update CORS_ORIGIN environment variable"
echo "   - Redeploy the backend"
echo ""
echo "Happy coding! 🚀"